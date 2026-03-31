import React, { useState } from 'react';
import { DOORS, REGIONS, CLUSTERS, CHANNELS, CLIMATES } from '../data';

const ATTR_COLORS = {
  Flagship: 'badge--violet',
  Premium:  'badge--amber',
  Standard: 'badge--muted',
  Outlet:   'badge--muted',
};

export default function DoorManager() {
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterCluster, setFilterCluster] = useState('All');
  const [view, setView] = useState('cards'); // 'cards' | 'table'

  const filtered = DOORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase());
    const matchRegion = filterRegion === 'All' || d.region === filterRegion;
    const matchCluster = filterCluster === 'All' || d.cluster === filterCluster;
    return matchSearch && matchRegion && matchCluster;
  });

  const totalUnits = DOORS.reduce((s, d) => s + d.units, 0);
  const totalRevenue = DOORS.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="door-manager-view">
      {/* Header */}
      <div className="door-manager-header">
        <div>
          <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:800,letterSpacing:'-0.03em',color:'var(--color-text-primary)'}}>Door Manager</h1>
          <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-muted)',marginTop:4}}>Manage store locations, attributes, and allocation metrics.</p>
        </div>
        <div style={{display:'flex',gap:'var(--space-3)'}}>
          <button className="btn btn--secondary" id="btn-import-doors">📥 Import from Excel</button>
          <button className="btn btn--primary" id="btn-add-door">+ Add Door</button>
        </div>
      </div>

      {/* Stats */}
      <div className="door-manager-stats">
        {[
          { label: 'Total Doors', value: DOORS.length, sub: 'Active locations' },
          { label: 'Total Units', value: totalUnits.toLocaleString(), sub: 'Across all assortments' },
          { label: 'Total Revenue', value: `$${(totalRevenue/1000).toFixed(0)}K`, sub: 'Wholesale revenue' },
          { label: 'Regions', value: new Set(DOORS.map(d=>d.region)).size, sub: 'Geographic coverage' },
        ].map(s => (
          <div key={s.label} className="door-stat">
            <div className="door-stat-label">{s.label}</div>
            <div className="door-stat-val">{s.value}</div>
            <div style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',marginTop:4}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'var(--space-5)'}}>
        <div style={{position:'relative',flex:1}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-muted)',pointerEvents:'none'}}>🔍</span>
          <input
            id="door-search"
            className="input"
            style={{paddingLeft:36}}
            placeholder="Search doors or codes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          id="filter-region"
          className="input"
          style={{width:'auto',cursor:'pointer'}}
          value={filterRegion}
          onChange={e => setFilterRegion(e.target.value)}
        >
          <option value="All">All Regions</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select
          id="filter-cluster"
          className="input"
          style={{width:'auto',cursor:'pointer'}}
          value={filterCluster}
          onChange={e => setFilterCluster(e.target.value)}
        >
          <option value="All">All Clusters</option>
          {CLUSTERS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div style={{display:'flex',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)',overflow:'hidden'}}>
          <button id="view-cards" className={`btn btn--ghost btn--sm ${view==='cards'?'active':''}`} style={{borderRadius:0,borderRight:'1px solid var(--color-border)'}} onClick={() => setView('cards')}>⊞ Cards</button>
          <button id="view-table" className={`btn btn--ghost btn--sm ${view==='table'?'active':''}`} style={{borderRadius:0}} onClick={() => setView('table')}>☰ Table</button>
        </div>

        <span style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-muted)',whiteSpace:'nowrap'}}>{filtered.length} doors</span>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <div className="empty-state-title">No doors found</div>
          <div className="empty-state-desc">Try adjusting your search or filters.</div>
        </div>
      ) : view === 'cards' ? (
        <div className="door-card-grid">
          {filtered.map(door => (
            <div key={door.id} className="door-card" id={`door-${door.id}`} role="article" aria-label={door.name}>
              <div className="door-card-header">
                <div className="door-card-icon">🏪</div>
                <button className="door-card-menu" aria-label="Door options">⋮</button>
              </div>
              <div className="door-card-name">{door.name}</div>
              <div className="door-card-code">{door.code}</div>
              <div className="door-card-attrs">
                <span className={`badge ${ATTR_COLORS[door.cluster] || 'badge--muted'}`}>{door.cluster}</span>
                <span className="badge badge--muted">{door.region}</span>
                <span className="badge badge--muted">{door.climate}</span>
                <span className="badge badge--muted">{door.channel}</span>
              </div>
              {door.notes && (
                <div className="door-card-notes">{door.notes}</div>
              )}
              <div className="door-card-metrics">
                <div className="door-metric">
                  <div className="door-metric-val">{door.units.toLocaleString()}</div>
                  <div className="door-metric-label">Units</div>
                </div>
                <div className="door-metric">
                  <div className="door-metric-val">${(door.revenue/1000).toFixed(0)}K</div>
                  <div className="door-metric-label">Revenue</div>
                </div>
                <div className="door-metric">
                  <div className="door-metric-val">${Math.round(door.revenue/door.units)}</div>
                  <div className="door-metric-label">Avg Price</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="assortment-table" role="grid">
          <thead>
            <tr>
              <th>Door Name</th>
              <th>Code</th>
              <th>Region</th>
              <th>Cluster</th>
              <th>Channel</th>
              <th>Climate</th>
              <th style={{textAlign:'right'}}>Units</th>
              <th style={{textAlign:'right'}}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(door => (
              <tr key={door.id} id={`door-row-${door.id}`}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)'}}>
                    <span style={{fontSize:18}}>🏪</span>
                    <span style={{fontWeight:600}}>{door.name}</span>
                  </div>
                </td>
                <td><code style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',background:'var(--color-bg-elevated)',padding:'2px 6px',borderRadius:'var(--radius-sm)'}}>{door.code}</code></td>
                <td style={{color:'var(--color-text-secondary)'}}>{door.region}</td>
                <td><span className={`badge ${ATTR_COLORS[door.cluster] || 'badge--muted'}`}>{door.cluster}</span></td>
                <td style={{color:'var(--color-text-secondary)'}}>{door.channel}</td>
                <td><span className="badge badge--muted">{door.climate}</span></td>
                <td style={{textAlign:'right',fontWeight:600}}>{door.units.toLocaleString()}</td>
                <td style={{textAlign:'right',fontWeight:600,color:'var(--color-brand-text)'}}>${door.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
