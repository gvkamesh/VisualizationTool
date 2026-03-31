import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { PRODUCTS, DOORS, BUYING_STAGES } from '../data';

const VISIBLE_COLS = ['MSRP', 'WS Price', 'Color', 'Category'];

export default function AssortmentGrid({ onNavigateShop }) {
  const { state, dispatch, activeAssortment, addToast } = useApp();
  const [configTab, setConfigTab] = useState('columns');
  const [panelOpen, setPanelOpen] = useState(true);
  const [visibleCols, setVisibleCols] = useState(new Set(VISIBLE_COLS));

  if (!activeAssortment) {
    return (
      <div className="empty-state" style={{flex:1}}>
        <div className="empty-state-icon">📊</div>
        <div className="empty-state-title">No assortment open</div>
        <div className="empty-state-desc">Select an assortment from the Drive to start planning.</div>
      </div>
    );
  }

  const products = PRODUCTS.filter(p => activeAssortment.products.includes(p.id));
  const doors = DOORS.filter(d => activeAssortment.doors.includes(d.id));
  const allDoors = DOORS;

  const quantities = state.quantities[activeAssortment.id] ?? {};

  const rowTotal = (pid) =>
    doors.reduce((sum, d) => sum + (Number(quantities[pid]?.[d.id]) || 0), 0);

  const colTotal = (did) =>
    products.reduce((sum, p) => sum + (Number(quantities[p.id]?.[did]) || 0), 0);

  const grandTotal = products.reduce((sum, p) => sum + rowTotal(p.id), 0);
  const grandRevenue = products.reduce((sum, p) => {
    const prod = PRODUCTS.find(x => x.id === p.id);
    return sum + rowTotal(p.id) * (prod?.wholesale ?? 0);
  }, 0);

  const handleQtyChange = (pid, did, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    dispatch({ type: 'SET_QTY', assortmentId: activeAssortment.id, productId: pid, doorId: did, value: num });
  };

  const handleStageChange = (stage) => {
    dispatch({ type: 'SET_BUYING_STAGE', assortmentId: activeAssortment.id, stage });
    addToast(`Stage updated to "${stage}".`);
  };

  const toggleDoor = (did) => {
    dispatch({ type: 'TOGGLE_DOOR_IN_ASSORTMENT', assortmentId: activeAssortment.id, doorId: did });
  };

  const toggleCol = (col) => {
    setVisibleCols(prev => {
      const next = new Set(prev);
      next.has(col) ? next.delete(col) : next.add(col);
      return next;
    });
  };

  return (
    <div className="assortment-view">
      <div className="assortment-grid-area">
        {/* Toolbar */}
        <div className="assortment-grid-toolbar">
          <div style={{display:'flex',flexDirection:'column',gap:2}}>
            <span style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700}}>Buying Stage</span>
            <div className="buying-stages">
              {BUYING_STAGES.map(s => (
                <button
                  key={s}
                  id={`stage-${s.toLowerCase().replace(/\s/g,'-')}`}
                  className={`buying-stage ${activeAssortment.stage === s ? 'active' : ''}`}
                  onClick={() => handleStageChange(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="assortment-grid-toolbar-right">
            <div style={{display:'flex',alignItems:'center',gap:'var(--space-4)',marginRight:'var(--space-4)',fontSize:'var(--font-size-sm)'}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700}}>Total Units</div>
                <div style={{fontWeight:800,color:'var(--color-text-primary)',fontSize:'var(--font-size-md)'}}>{grandTotal.toLocaleString()}</div>
              </div>
              <div style={{width:1,height:28,background:'var(--color-border)'}}/>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.06em',fontWeight:700}}>WS Revenue</div>
                <div style={{fontWeight:800,color:'var(--color-brand-text)',fontSize:'var(--font-size-md)'}}>${grandRevenue.toLocaleString()}</div>
              </div>
            </div>

            <button id="btn-add-products" className="btn btn--secondary btn--sm" onClick={onNavigateShop}>+ Products</button>

            <button
              id="btn-toggle-columns"
              className={`grid-panel-toggle ${panelOpen && configTab === 'columns' ? 'active' : ''}`}
              onClick={() => { setConfigTab('columns'); setPanelOpen(o => configTab !== 'columns' ? true : !o); }}
            >
              ▦ Columns
            </button>
            <button
              id="btn-toggle-doors-panel"
              className={`grid-panel-toggle ${panelOpen && configTab === 'doors' ? 'active' : ''}`}
              onClick={() => { setConfigTab('doors'); setPanelOpen(o => configTab !== 'doors' ? true : !o); }}
            >
              🏪 Doors
            </button>
            <button
              id="btn-toggle-metrics"
              className={`grid-panel-toggle ${panelOpen && configTab === 'metrics' ? 'active' : ''}`}
              onClick={() => { setConfigTab('metrics'); setPanelOpen(o => configTab !== 'metrics' ? true : !o); }}
            >
              📈 Metrics
            </button>
          </div>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="empty-state" style={{flex:1}}>
            <div className="empty-state-icon">🛍️</div>
            <div className="empty-state-title">No products in assortment</div>
            <div className="empty-state-desc">Go to Shop to add products to this assortment.</div>
            <button className="btn btn--primary" onClick={onNavigateShop} id="btn-go-to-shop">Browse Products</button>
          </div>
        ) : (
          <div className="planning-grid-wrap">
            <table className="planning-grid" aria-label="Assortment planning grid">
              <thead>
                <tr>
                  <th className="pinned" style={{left:0,minWidth:280}}>Product</th>
                  {visibleCols.has('MSRP') && <th style={{minWidth:80,textAlign:'right'}}>MSRP</th>}
                  {visibleCols.has('WS Price') && <th style={{minWidth:80,textAlign:'right'}}>WS Price</th>}
                  {visibleCols.has('Color') && <th style={{minWidth:80}}>Color</th>}
                  {visibleCols.has('Category') && <th style={{minWidth:90}}>Category</th>}
                  {doors.map(d => (
                    <th key={d.id} style={{minWidth:90,textAlign:'center'}}>
                      <div>{d.name.split(' ').slice(0,2).join(' ')}</div>
                      <div style={{fontWeight:400,color:'var(--color-text-muted)',textTransform:'none',letterSpacing:0,fontSize:10}}>{d.region}</div>
                    </th>
                  ))}
                  <th style={{minWidth:80,textAlign:'right'}}>Total</th>
                  <th style={{minWidth:90,textAlign:'right'}}>WS Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const total = rowTotal(product.id);
                  const wsTotal = total * product.wholesale;
                  return (
                    <tr key={product.id}>
                      <td className="pinned" style={{left:0}}>
                        <div className="grid-product-cell">
                          <div className="grid-product-img" style={{background:'var(--color-bg-elevated)'}}>{product.emoji}</div>
                          <div className="grid-product-info">
                            <div className="grid-product-name">{product.name}</div>
                            <div className="grid-product-sku">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      {visibleCols.has('MSRP') && <td className="grid-msrp-cell">${product.msrp}</td>}
                      {visibleCols.has('WS Price') && <td className="grid-ws-cell">${product.wholesale}</td>}
                      {visibleCols.has('Color') && <td style={{padding:'var(--space-2) var(--space-3)',fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>{product.color}</td>}
                      {visibleCols.has('Category') && <td style={{padding:'var(--space-2) var(--space-3)'}}><span className="badge badge--muted">{product.category}</span></td>}
                      {doors.map(door => (
                        <td key={door.id} className="grid-input-cell">
                          <input
                            id={`qty-${product.id}-${door.id}`}
                            className="grid-qty-input"
                            type="number"
                            min={0}
                            step={6}
                            value={quantities[product.id]?.[door.id] || ''}
                            placeholder="—"
                            onChange={e => handleQtyChange(product.id, door.id, e.target.value)}
                            aria-label={`Quantity for ${product.name} at ${door.name}`}
                          />
                        </td>
                      ))}
                      <td className="grid-total-cell">{total > 0 ? total.toLocaleString() : '—'}</td>
                      <td className="grid-total-cell" style={{color:'var(--color-brand-text)'}}>{wsTotal > 0 ? `$${wsTotal.toLocaleString()}` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="grid-footer-row">
                  <td className="pinned grid-footer-label" style={{left:0}}>COLUMN TOTALS</td>
                  {visibleCols.has('MSRP') && <td />}
                  {visibleCols.has('WS Price') && <td />}
                  {visibleCols.has('Color') && <td />}
                  {visibleCols.has('Category') && <td />}
                  {doors.map(door => (
                    <td key={door.id} className="grid-footer-total">{colTotal(door.id).toLocaleString()}</td>
                  ))}
                  <td className="grid-footer-total" style={{color:'var(--color-text-primary)'}}>{grandTotal.toLocaleString()}</td>
                  <td className="grid-footer-total" style={{color:'var(--color-brand-text)'}}>${grandRevenue.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Config Panel */}
      <aside className={`config-panel ${panelOpen ? '' : 'collapsed'}`} aria-label="Configuration panel">
        <div className="config-panel-tabs">
          {['columns','doors','metrics'].map(tab => (
            <button
              key={tab}
              id={`config-tab-${tab}`}
              className={`config-panel-tab ${configTab === tab ? 'active' : ''}`}
              onClick={() => setConfigTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="config-panel-body">
          {configTab === 'columns' && (
            <div>
              <p style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',marginBottom:'var(--space-3)'}}>Toggle which columns appear in the grid.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
                {VISIBLE_COLS.map(col => (
                  <div
                    key={col}
                    className={`door-toggle-item ${visibleCols.has(col) ? 'active' : ''}`}
                    onClick={() => toggleCol(col)}
                    role="checkbox"
                    aria-checked={visibleCols.has(col)}
                    tabIndex={0}
                    id={`col-toggle-${col.toLowerCase().replace(/\s/g,'-')}`}
                  >
                    <div className="door-toggle-check">{visibleCols.has(col) ? '✓' : ''}</div>
                    <span className="door-toggle-name">{col}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {configTab === 'doors' && (
            <div>
              <p style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',marginBottom:'var(--space-3)'}}>Toggle which doors appear as columns in this assortment.</p>
              <div className="door-toggle-list">
                {allDoors.map(door => {
                  const isActive = activeAssortment.doors.includes(door.id);
                  return (
                    <div
                      key={door.id}
                      className={`door-toggle-item ${isActive ? 'active' : ''}`}
                      onClick={() => toggleDoor(door.id)}
                      role="checkbox"
                      aria-checked={isActive}
                      tabIndex={0}
                      id={`door-toggle-${door.id}`}
                    >
                      <div className="door-toggle-check">{isActive ? '✓' : ''}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div className="door-toggle-name">{door.name}</div>
                        <div className="door-toggle-region">{door.region} · {door.cluster}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {configTab === 'metrics' && (
            <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
              <p style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)'}}>Assortment-level performance summary.</p>
              {[
                { label: 'Total Units', value: grandTotal.toLocaleString(), color: 'var(--color-text-primary)' },
                { label: 'WS Revenue', value: `$${grandRevenue.toLocaleString()}`, color: 'var(--color-brand-text)' },
                { label: 'Avg Units/Door', value: doors.length ? Math.round(grandTotal / doors.length).toLocaleString() : '—', color: 'var(--color-text-primary)' },
                { label: 'Avg Units/Product', value: products.length ? Math.round(grandTotal / products.length).toLocaleString() : '—', color: 'var(--color-text-primary)' },
                { label: 'Products', value: products.length, color: 'var(--color-text-primary)' },
                { label: 'Active Doors', value: doors.length, color: 'var(--color-text-primary)' },
              ].map(m => (
                <div key={m.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'var(--space-2) 0',borderBottom:'1px solid var(--color-border-subtle)'}}>
                  <span style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>{m.label}</span>
                  <span style={{fontSize:'var(--font-size-md)',fontWeight:700,color:m.color}}>{m.value}</span>
                </div>
              ))}

              <div style={{marginTop:'var(--space-2)'}}>
                <div style={{fontSize:'var(--font-size-xs)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--color-text-muted)',marginBottom:'var(--space-3)'}}>Top Doors by Units</div>
                {doors
                  .map(d => ({ door: d, total: colTotal(d.id) }))
                  .sort((a,b) => b.total - a.total)
                  .slice(0,5)
                  .map(({ door, total }) => (
                    <div key={door.id} style={{marginBottom:'var(--space-2)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:'var(--font-size-xs)',marginBottom:4}}>
                        <span style={{color:'var(--color-text-secondary)',fontWeight:500}}>{door.name}</span>
                        <span style={{color:'var(--color-text-primary)',fontWeight:700}}>{total}</span>
                      </div>
                      <div style={{height:4,background:'var(--color-bg-muted)',borderRadius:'var(--radius-full)',overflow:'hidden'}}>
                        <div style={{
                          height:'100%',
                          width: grandTotal > 0 ? `${(total/grandTotal)*100}%` : '0%',
                          background:'var(--color-brand)',
                          borderRadius:'var(--radius-full)',
                          transition:'width 0.4s ease',
                        }}/>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
