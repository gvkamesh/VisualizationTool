import React from 'react';
import { useApp } from '../AppContext';

const NAV_ITEMS = [
  { id: 'drive',    icon: '🗂️',  label: 'Assortments' },
  { id: 'shop',     icon: '🛍️',  label: 'Shop' },
  { id: 'doors',    icon: '🏪',  label: 'Doors' },
  { id: 'settings', icon: '⚙️',  label: 'Settings' },
];

export default function Sidebar({ activeView, onNavigate }) {
  const { state } = useApp();

  return (
    <aside className="sidebar" role="navigation" aria-label="Primary navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark" aria-hidden="true">N</div>
        <div className="sidebar-logo-text">Nu<span>Order</span></div>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Workspace</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            <span className="sidebar-nav-icon" role="img" aria-label={item.label}>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'drive' && (
              <span className="sidebar-nav-badge">{state.assortments.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="sidebar-divider" />

      {/* Active Assortment */}
      {state.activeAssortmentId && (() => {
        const a = state.assortments.find(x => x.id === state.activeAssortmentId);
        return a ? (
          <div className="sidebar-section">
            <div className="sidebar-section-title">Active</div>
            <button
              className={`sidebar-nav-item ${activeView === 'grid' ? 'active' : ''}`}
              onClick={() => onNavigate('grid')}
              id="nav-grid"
            >
              <span role="img" aria-label="Grid" style={{fontSize:16}}>📊</span>
              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1,textAlign:'left'}}>{a.name}</span>
            </button>
          </div>
        ) : null;
      })()}

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user" role="button" tabIndex={0}>
          <div className="sidebar-avatar" aria-hidden="true">KG</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Kamesh Garimella</div>
            <div className="sidebar-user-role">Buying Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
