import React from 'react';
import { useApp } from '../AppContext';

const NAV_ITEMS = [
  { id: 'drive',    icon: '🗂️',  label: 'Assortments' },
  { id: 'shop',     icon: '🛍️',  label: 'Shop' },
  { id: 'doors',    icon: '🏪',  label: 'Doors' },
  { id: 'settings', icon: '⚙️',  label: 'Settings' },
];

export default function Sidebar({ activeView, onNavigate, mobileOpen, onMobileClose }) {
  const { state } = useApp();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar / Mobile drawer */}
      <aside
        className={`sidebar ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
        role="navigation"
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark" aria-hidden="true" style={{fontSize:10,letterSpacing:'-0.5px'}}>GVK</div>
          <div className="sidebar-logo-text">Kamesh<span>Order</span></div>
          {/* Mobile close button */}
          <button
            className="sidebar-mobile-close"
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Main Navigation */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Workspace</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onMobileClose?.(); }}
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
                onClick={() => { onNavigate('grid'); onMobileClose?.(); }}
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`mobile-bottom-nav-item ${activeView === item.id || (activeView === 'grid' && item.id === 'drive') ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
          >
            <span className="mobile-bottom-nav-icon">{item.icon}</span>
            <span className="mobile-bottom-nav-label">{item.label}</span>
            {item.id === 'drive' && state.assortments.length > 0 && (
              <span className="mobile-bottom-nav-badge">{state.assortments.length}</span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
}
