import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { DELIVERIES, DOORS, BUYING_STAGES } from '../data';
import NewAssortmentModal from '../components/NewAssortmentModal';

const ICON_COLORS = {
  teal:   'assortment-icon--teal',
  amber:  'assortment-icon--amber',
  violet: 'assortment-icon--violet',
  blue:   'assortment-icon--blue',
};

const STAGE_BADGE = {
  'Preline':     'badge--muted',
  'Buying':      'badge--amber',
  'Pre-Approved':'badge--violet',
  'Approved':    'badge--teal',
  'Ordered':     'badge--teal',
};

export default function AssortmentDrive({ onOpenAssortment }) {
  const { state, dispatch, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = state.assortments.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.season.toLowerCase().includes(search.toLowerCase())
  );

  const totalDoors = new Set(state.assortments.flatMap(a => a.doors)).size;
  const totalProducts = new Set(state.assortments.flatMap(a => a.products)).size;
  const inBuying = state.assortments.filter(a => a.stage === 'Buying').length;

  const handleOpenAssortment = (a) => {
    dispatch({ type: 'SET_ACTIVE_ASSORTMENT', id: a.id });
    onOpenAssortment(a.id);
  };

  return (
    <div className="drive-view">
      {/* Header */}
      <div className="drive-view-header">
        <h1 className="drive-view-title">Assortments Drive</h1>
        <button id="btn-new-assortment" className="btn btn--primary btn--new-assortment" onClick={() => setShowModal(true)}>
          <span>+</span> <span className="btn-label-full">New Assortment</span>
        </button>
      </div>

      {/* Stats */}
      <div className="drive-stats">
        <div className="drive-stat-card">
          <div className="drive-stat-label">Total Assortments</div>
          <div className="drive-stat-value"><span>{state.assortments.length}</span></div>
          <div className="drive-stat-sub">Across all seasons</div>
        </div>
        <div className="drive-stat-card">
          <div className="drive-stat-label">In Buying</div>
          <div className="drive-stat-value"><span>{inBuying}</span></div>
          <div className="drive-stat-sub">Active buys</div>
        </div>
        <div className="drive-stat-card">
          <div className="drive-stat-label">Unique Doors</div>
          <div className="drive-stat-value"><span>{totalDoors}</span></div>
          <div className="drive-stat-sub">Across all assortments</div>
        </div>
        <div className="drive-stat-card">
          <div className="drive-stat-label">Unique Products</div>
          <div className="drive-stat-value"><span>{totalProducts}</span></div>
          <div className="drive-stat-sub">SKUs planned</div>
        </div>
      </div>

      {/* Search */}
      <div className="drive-search-bar">
        <div className="drive-search-input" style={{position:'relative',flex:1}}>
          <span className="drive-search-icon" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--color-text-muted)'}}>🔍</span>
          <input
            id="drive-search"
            className="input"
            style={{paddingLeft:36}}
            placeholder="Search assortments…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn--secondary btn--sm">Filter ▾</button>
        <button className="btn btn--secondary btn--sm">Sort ▾</button>
      </div>

      {/* Desktop Table / Mobile Card List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗂️</div>
          <div className="empty-state-title">No assortments found</div>
          <div className="empty-state-desc">Try a different search term or create a new assortment.</div>
        </div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="drive-table-wrap">
            <table className="assortment-table" role="grid">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Season</th>
                  <th>Buying Stage</th>
                  <th>Delivery</th>
                  <th>Doors</th>
                  <th>Products</th>
                  <th>Owner</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => {
                  const delivery = DELIVERIES.find(d => d.id === a.delivery);
                  return (
                    <tr
                      key={a.id}
                      onClick={() => handleOpenAssortment(a)}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && handleOpenAssortment(a)}
                      role="row"
                      aria-label={`Open ${a.name}`}
                    >
                      <td>
                        <div className="assortment-name-cell">
                          <div className={`assortment-icon ${ICON_COLORS[a.icon] || 'assortment-icon--teal'}`}>
                            📋
                          </div>
                          <div>
                            <div style={{fontWeight:600,color:'var(--color-text-primary)'}}>{a.name}</div>
                            {a.shared && <span style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)'}}>🔗 Shared</span>}
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge--muted">{a.season}</span></td>
                      <td><span className={`badge ${STAGE_BADGE[a.stage] || 'badge--muted'}`}>{a.stage}</span></td>
                      <td style={{color:'var(--color-text-secondary)',fontSize:'var(--font-size-xs)'}}>{delivery?.name ?? '—'}</td>
                      <td style={{textAlign:'center'}}><span className="badge badge--muted">{a.doors.length}</span></td>
                      <td style={{textAlign:'center'}}><span className="badge badge--muted">{a.products.length}</span></td>
                      <td style={{color:'var(--color-text-secondary)'}}>{a.owner}</td>
                      <td style={{color:'var(--color-text-muted)',fontSize:'var(--font-size-xs)'}}>{a.updatedAt}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={e => { e.stopPropagation(); handleOpenAssortment(a); }}
                            id={`open-assortment-${a.id}`}
                            aria-label={`Open ${a.name}`}
                          >
                            Open →
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="drive-mobile-cards">
            {filtered.map(a => {
              const delivery = DELIVERIES.find(d => d.id === a.delivery);
              return (
                <div
                  key={a.id}
                  className="drive-mobile-card"
                  onClick={() => handleOpenAssortment(a)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleOpenAssortment(a)}
                  aria-label={`Open ${a.name}`}
                  id={`mobile-assortment-${a.id}`}
                >
                  <div className="drive-mobile-card-header">
                    <div className={`assortment-icon ${ICON_COLORS[a.icon] || 'assortment-icon--teal'}`}>📋</div>
                    <div className="drive-mobile-card-info">
                      <div className="drive-mobile-card-name">{a.name}</div>
                      <div className="drive-mobile-card-meta">{a.owner} · {a.updatedAt}</div>
                    </div>
                    <span className={`badge ${STAGE_BADGE[a.stage] || 'badge--muted'}`}>{a.stage}</span>
                  </div>
                  <div className="drive-mobile-card-tags">
                    <span className="badge badge--muted">{a.season}</span>
                    {delivery && <span className="badge badge--muted">{delivery.name}</span>}
                  </div>
                  <div className="drive-mobile-card-stats">
                    <div className="drive-mobile-stat">
                      <span className="drive-mobile-stat-val">{a.doors.length}</span>
                      <span className="drive-mobile-stat-label">Doors</span>
                    </div>
                    <div className="drive-mobile-stat">
                      <span className="drive-mobile-stat-val">{a.products.length}</span>
                      <span className="drive-mobile-stat-label">Products</span>
                    </div>
                    <button
                      className="btn btn--primary btn--sm"
                      style={{marginLeft:'auto'}}
                      onClick={e => { e.stopPropagation(); handleOpenAssortment(a); }}
                      id={`open-mobile-assortment-${a.id}`}
                    >
                      Open →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showModal && (
        <NewAssortmentModal
          onClose={() => setShowModal(false)}
          onCreated={(id) => {
            setShowModal(false);
            addToast('Assortment created successfully!', 'success');
            dispatch({ type: 'SET_ACTIVE_ASSORTMENT', id });
            onOpenAssortment(id);
          }}
        />
      )}
    </div>
  );
}
