import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { PRODUCTS, CATEGORIES, SEASONS, COLORS } from '../data';

export default function ProductShop() {
  const { state, dispatch, activeAssortment, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSeason, setActiveSeason] = useState('All');
  const [activeColor, setActiveColor] = useState('All');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat   = activeCategory === 'All' || p.category === activeCategory;
      const matchSeason= activeSeason === 'All' || p.season === activeSeason;
      const matchColor = activeColor === 'All' || p.color === activeColor;
      return matchSearch && matchCat && matchSeason && matchColor;
    });
  }, [search, activeCategory, activeSeason, activeColor]);

  const activeFilterCount = [
    activeCategory !== 'All',
    activeSeason !== 'All',
    activeColor !== 'All',
  ].filter(Boolean).length;

  const isInAssortment = (pid) =>
    activeAssortment ? activeAssortment.products.includes(pid) : false;

  const handleToggle = (product) => {
    if (!activeAssortment) {
      addToast('Open an assortment first to add products.', 'warning');
      return;
    }
    if (isInAssortment(product.id)) {
      dispatch({ type: 'REMOVE_PRODUCT_FROM_ASSORTMENT', assortmentId: activeAssortment.id, productId: product.id });
      addToast(`Removed "${product.name}" from assortment.`, 'warning');
    } else {
      dispatch({ type: 'ADD_PRODUCT_TO_ASSORTMENT', assortmentId: activeAssortment.id, productId: product.id });
      addToast(`Added "${product.name}" to "${activeAssortment.name}".`);
    }
  };

  const catCounts = useMemo(() => {
    const counts = { All: PRODUCTS.length };
    CATEGORIES.forEach(c => { counts[c] = PRODUCTS.filter(p => p.category === c).length; });
    return counts;
  }, []);

  const FilterContent = () => (
    <>
      {activeAssortment && (
        <div className="shop-assortment-info">
          <div className="shop-assortment-info-label">Shopping for</div>
          <div className="shop-assortment-info-name">{activeAssortment.name}</div>
          <div className="shop-assortment-info-count">{activeAssortment.products.length} products selected</div>
        </div>
      )}

      <div className="shop-filter-group">
        <div className="shop-filter-title">Category</div>
        <button className={`shop-filter-option ${activeCategory === 'All' ? 'active' : ''}`} id="filter-cat-all" onClick={() => setActiveCategory('All')}>
          All <span className="shop-filter-count">{catCounts.All}</span>
        </button>
        {CATEGORIES.map(c => (
          <button key={c} className={`shop-filter-option ${activeCategory === c ? 'active' : ''}`} id={`filter-cat-${c.toLowerCase()}`} onClick={() => setActiveCategory(c)}>
            {c} <span className="shop-filter-count">{catCounts[c] || 0}</span>
          </button>
        ))}
      </div>

      <div className="shop-filter-group">
        <div className="shop-filter-title">Season</div>
        <button className={`shop-filter-option ${activeSeason === 'All' ? 'active' : ''}`} id="filter-season-all" onClick={() => setActiveSeason('All')}>All</button>
        {SEASONS.map(s => (
          <button key={s} className={`shop-filter-option ${activeSeason === s ? 'active' : ''}`} id={`filter-season-${s.toLowerCase()}`} onClick={() => setActiveSeason(s)}>{s}</button>
        ))}
      </div>

      <div className="shop-filter-group">
        <div className="shop-filter-title">Color</div>
        <button className={`shop-filter-option ${activeColor === 'All' ? 'active' : ''}`} id="filter-color-all" onClick={() => setActiveColor('All')}>All</button>
        {COLORS.map(c => (
          <button key={c} className={`shop-filter-option ${activeColor === c ? 'active' : ''}`} id={`filter-color-${c.toLowerCase()}`} onClick={() => setActiveColor(c)}>
            {c}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="shop-view">
      {/* Desktop Left Filter Sidebar */}
      <aside className="shop-sidebar" aria-label="Product filters">
        <FilterContent />
      </aside>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="mobile-filter-overlay" onClick={() => setMobileFilterOpen(false)}>
          <aside
            className="mobile-filter-drawer"
            aria-label="Product filters"
            onClick={e => e.stopPropagation()}
          >
            <div className="mobile-filter-drawer-header">
              <span style={{fontWeight:700,fontSize:'var(--font-size-md)'}}>Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>
              <div style={{display:'flex',gap:'var(--space-2)'}}>
                {activeFilterCount > 0 && (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => { setActiveCategory('All'); setActiveSeason('All'); setActiveColor('All'); }}
                  >
                    Clear all
                  </button>
                )}
                <button className="btn btn--primary btn--sm" onClick={() => setMobileFilterOpen(false)}>
                  Show {filteredProducts.length} products
                </button>
              </div>
            </div>
            <div className="mobile-filter-drawer-body">
              <FilterContent />
            </div>
          </aside>
        </div>
      )}

      {/* Main product grid */}
      <main className="shop-main">
        <div className="shop-toolbar">
          <div className="shop-search" style={{position:'relative'}}>
            <span className="shop-search-icon" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--color-text-muted)',pointerEvents:'none'}}>🔍</span>
            <input
              id="shop-search"
              className="input"
              style={{paddingLeft:36}}
              placeholder="Search products, SKUs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Mobile filter button */}
          <button
            className="shop-mobile-filter-btn"
            onClick={() => setMobileFilterOpen(true)}
            id="btn-mobile-filters"
            aria-label="Open filters"
          >
            🎛 Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>

          <span className="shop-count">{filteredProducts.length} products</span>
          {!activeAssortment && (
            <span className="shop-no-assortment-warn">
              ⚠ Open an assortment to add products
            </span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No products found</div>
            <div className="empty-state-desc">Try adjusting your filters or search term.</div>
          </div>
        ) : (
          <div className="product-grid" role="list">
            {filteredProducts.map(product => {
              const inA = isInAssortment(product.id);
              return (
                <article
                  key={product.id}
                  className={`product-card ${inA ? 'in-assortment' : ''}`}
                  role="listitem"
                  id={`product-${product.id}`}
                >
                  {inA && (
                    <div className="product-card-tag">
                      <span className="badge badge--teal">✓ Added</span>
                    </div>
                  )}
                  <div className="product-image-placeholder" style={{background:'var(--color-bg-elevated)'}}>
                    {product.emoji}
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-name" title={product.name}>{product.name}</div>
                    <div className="product-card-sku">{product.sku} · {product.season}</div>
                    <div className="product-card-footer">
                      <div>
                        <div className="product-card-price">${product.msrp}</div>
                        <div className="product-card-ws">WS ${product.wholesale}</div>
                      </div>
                      <button
                        id={`add-product-${product.id}`}
                        className={`product-add-btn ${inA ? 'added' : ''}`}
                        onClick={() => handleToggle(product)}
                        aria-label={inA ? `Remove ${product.name}` : `Add ${product.name} to assortment`}
                        title={inA ? 'Remove from assortment' : 'Add to assortment'}
                      >
                        {inA ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
