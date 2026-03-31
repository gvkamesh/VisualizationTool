import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { DELIVERIES, DOORS, BUYING_STAGES, SEASONS } from '../data';

function generateId() {
  return 'a' + Math.random().toString(36).slice(2, 9);
}

const ICON_OPTIONS = ['teal','amber','violet','blue'];

export default function NewAssortmentModal({ onClose, onCreated }) {
  const { dispatch } = useApp();
  const [step, setStep] = useState(1); // 1: Name/Season, 2: Delivery, 3: Doors
  const [name, setName] = useState('');
  const [season, setSeason] = useState('FW25');
  const [delivery, setDelivery] = useState('');
  const [selectedDoors, setSelectedDoors] = useState([]);
  const [icon, setIcon] = useState('teal');

  const toggleDoor = (id) =>
    setSelectedDoors(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);

  const handleCreate = () => {
    const id = generateId();
    dispatch({
      type: 'CREATE_ASSORTMENT',
      assortment: {
        id,
        name: name.trim() || 'New Assortment',
        season,
        stage: 'Preline',
        delivery: delivery || DELIVERIES[0].id,
        doors: selectedDoors,
        products: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        owner: 'Alex Kim',
        shared: false,
        icon,
      },
    });
    onCreated(id);
  };

  const canNext = step === 1 ? name.trim().length > 0 : step === 2 ? !!delivery : true;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="New Assortment" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">New Assortment</div>
            <div style={{fontSize:'var(--font-size-xs)',color:'var(--color-text-muted)',marginTop:2}}>Step {step} of 3</div>
          </div>
          <button className="modal-close" onClick={onClose} id="modal-close" aria-label="Close">✕</button>
        </div>

        {/* Step indicator */}
        <div style={{display:'flex',padding:'var(--space-4) var(--space-6)',gap:'var(--space-2)',borderBottom:'1px solid var(--color-border-subtle)'}}>
          {['Name & Season','Delivery','Doors'].map((label, i) => (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <div style={{
                width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'var(--font-size-xs)',fontWeight:700,
                background: i+1 < step ? 'var(--color-brand)' : i+1 === step ? 'var(--color-brand)' : 'var(--color-bg-muted)',
                color: i+1 <= step ? 'white' : 'var(--color-text-muted)',
                boxShadow: i+1 === step ? 'var(--shadow-glow-brand)' : 'none',
                transition:'all 0.3s ease',
              }}>
                {i+1 < step ? '✓' : i+1}
              </div>
              <div style={{fontSize:10,color:i+1===step?'var(--color-brand-text)':'var(--color-text-muted)',fontWeight:i+1===step?700:400}}>{label}</div>
            </div>
          ))}
        </div>

        <div className="modal-body">
          {step === 1 && (
            <>
              <div>
                <label className="form-label" htmlFor="assortment-name">Assortment Name *</label>
                <input
                  id="assortment-name"
                  className="input"
                  placeholder="e.g. FW25 Core Collection"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label" htmlFor="assortment-season">Season</label>
                <div style={{display:'flex',gap:'var(--space-2)',flexWrap:'wrap'}}>
                  {SEASONS.map(s => (
                    <button
                      key={s}
                      id={`season-${s}`}
                      className={`btn ${season === s ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                      onClick={() => setSeason(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Color Label</label>
                <div style={{display:'flex',gap:'var(--space-2)'}}>
                  {ICON_OPTIONS.map(c => (
                    <button
                      key={c}
                      id={`icon-${c}`}
                      onClick={() => setIcon(c)}
                      style={{
                        width:28,height:28,borderRadius:'50%',border: icon===c ? '2px solid var(--color-brand)' : '2px solid transparent',
                        background: c==='teal'?'var(--color-brand)':c==='amber'?'var(--color-amber)':c==='violet'?'var(--color-violet)':'hsl(220,80%,60%)',
                        cursor:'pointer',
                        boxShadow: icon===c?'var(--shadow-glow-brand)':'none',
                        transition:'all 0.2s ease',
                      }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div>
              <label className="form-label">Select Delivery Window</label>
              <div style={{display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
                {DELIVERIES.map(d => (
                  <div
                    key={d.id}
                    id={`delivery-${d.id}`}
                    className={`delivery-option ${delivery === d.id ? 'selected' : ''}`}
                    onClick={() => setDelivery(d.id)}
                    role="radio"
                    aria-checked={delivery === d.id}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setDelivery(d.id)}
                  >
                    <div className="delivery-option-radio" />
                    <div className="delivery-option-info">
                      <div className="delivery-option-name">{d.name}</div>
                      <div className="delivery-option-dates">{d.start} – {d.end}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-3)'}}>
                <label className="form-label" style={{margin:0}}>Select Doors ({selectedDoors.length} selected)</label>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setSelectedDoors(selectedDoors.length === DOORS.length ? [] : DOORS.map(d => d.id))}
                  id="select-all-doors"
                >
                  {selectedDoors.length === DOORS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{maxHeight:280,overflowY:'auto',display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
                {DOORS.map(door => (
                  <div
                    key={door.id}
                    id={`modal-door-${door.id}`}
                    className={`door-toggle-item ${selectedDoors.includes(door.id) ? 'active' : ''}`}
                    onClick={() => toggleDoor(door.id)}
                    role="checkbox"
                    aria-checked={selectedDoors.includes(door.id)}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && toggleDoor(door.id)}
                  >
                    <div className="door-toggle-check">{selectedDoors.includes(door.id) ? '✓' : ''}</div>
                    <div style={{flex:1}}>
                      <div className="door-toggle-name">{door.name}</div>
                      <div className="door-toggle-region">{door.region} · {door.cluster} · {door.climate}</div>
                    </div>
                    <span className="badge badge--muted">{door.code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn--ghost" onClick={() => setStep(s => s-1)} id="btn-back">← Back</button>
          )}
          <button className="btn btn--ghost" onClick={onClose} id="btn-cancel">Cancel</button>
          {step < 3 ? (
            <button
              className="btn btn--primary"
              disabled={!canNext}
              onClick={() => setStep(s => s+1)}
              id="btn-next"
              style={{opacity: canNext ? 1 : 0.5}}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn--primary"
              onClick={handleCreate}
              id="btn-create-assortment"
            >
              ✓ Create Assortment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
