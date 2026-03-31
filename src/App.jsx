import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Sidebar from './components/Sidebar';
import AssortmentDrive from './views/AssortmentDrive';
import ProductShop from './views/ProductShop';
import AssortmentGrid from './views/AssortmentGrid';
import DoorManager from './views/DoorManager';
import './index.css';

const STAGE_BADGE = {
  'Preline':      'badge--muted',
  'Buying':       'badge--amber',
  'Pre-Approved': 'badge--violet',
  'Approved':     'badge--teal',
  'Ordered':      'badge--teal',
};

function AppInner() {
  const { state, toasts, activeAssortment } = useApp();
  const [activeView, setActiveView] = useState('drive'); // 'drive' | 'shop' | 'grid' | 'doors' | 'settings'

  const handleNavigate = (view) => setActiveView(view);

  const handleOpenAssortment = (id) => {
    setActiveView('grid');
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'drive':    return { title: 'Assortments Drive', sub: 'All your assortments in one place' };
      case 'shop':     return { title: 'Product Shop', sub: 'Discover and add products to your assortment' };
      case 'grid':     return { title: activeAssortment?.name ?? 'Grid', sub: 'Planning view · ' + (activeAssortment?.season ?? '') };
      case 'doors':    return { title: 'Door Manager', sub: 'Manage store locations and attributes' };
      case 'settings': return { title: 'Settings', sub: '' };
      default:         return { title: '', sub: '' };
    }
  };

  const { title, sub } = getHeaderTitle();

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />

      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div>
            {activeView === 'grid' && activeAssortment ? (
              <div className="top-header-breadcrumb">
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setActiveView('drive')}
                  id="breadcrumb-drive"
                  style={{padding:'2px 8px'}}
                >
                  Assortments
                </button>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">{activeAssortment.name}</span>
                <span className={`badge ${STAGE_BADGE[activeAssortment.stage] || 'badge--muted'}`} style={{marginLeft:8}}>
                  {activeAssortment.stage}
                </span>
              </div>
            ) : (
              <div>
                <div className="top-header-title">{title}</div>
                {sub && <div className="top-header-subtitle">{sub}</div>}
              </div>
            )}
          </div>

          <div className="top-header-actions">
            {activeView === 'grid' && activeAssortment && (
              <>
                <span style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)'}}>
                  {activeAssortment.doors.length} doors · {activeAssortment.products.length} products
                </span>
                <button className="btn btn--secondary btn--sm" id="btn-export" onClick={() => alert('Export as CSV – coming soon!')} >📥 Export</button>
              </>
            )}
            <div style={{
              width:32,height:32,borderRadius:'50%',
              background:'linear-gradient(135deg,hsl(258,85%,70%),hsl(174,72%,44%))',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'var(--font-size-xs)',fontWeight:700,color:'white',cursor:'pointer',
              boxShadow:'0 2px 8px rgba(0,0,0,0.3)',flexShrink:0
            }}>AK</div>
          </div>
        </header>

        {/* Tab Bar for Grid view */}
        {activeView === 'grid' && activeAssortment && (
          <nav className="view-tabs" aria-label="Assortment view tabs">
            <button id="tab-grid" className={`view-tab active`}>📊 Grid</button>
            <button id="tab-shop-from-grid" className="view-tab" onClick={() => setActiveView('shop')}>🛍️ Shop</button>
            <button id="tab-doors-from-grid" className="view-tab" onClick={() => setActiveView('doors')}>🏪 Doors</button>
          </nav>
        )}

        {/* Main View */}
        <main style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          {activeView === 'drive' && (
            <AssortmentDrive onOpenAssortment={handleOpenAssortment} />
          )}
          {activeView === 'shop' && (
            <ProductShop />
          )}
          {activeView === 'grid' && (
            <AssortmentGrid onNavigateShop={() => setActiveView('shop')} />
          )}
          {activeView === 'doors' && (
            <DoorManager />
          )}
          {activeView === 'settings' && (
            <div className="empty-state" style={{flex:1}}>
              <div className="empty-state-icon">⚙️</div>
              <div className="empty-state-title">Settings</div>
              <div className="empty-state-desc">Configure your workspace preferences here.</div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <span className="toast-icon">{toast.type === 'success' ? '✓' : '⚠'}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
