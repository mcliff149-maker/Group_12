import { useState } from 'react';

/**
 * DashboardEditor
 * A slide-in panel for users to customise their dashboard.
 *
 * Props:
 *   widgets   – current widget list [{ id, label, visible, order, settings }]
 *   onSave    – fn(updatedWidgets) called when user clicks Save
 *   onClose   – fn() called to dismiss the panel
 *   role      – string role name (used for role-specific settings)
 */
export default function DashboardEditor({ widgets, onSave, onClose, role }) {
  const [draft, setDraft] = useState(() =>
    [...widgets].sort((a, b) => a.order - b.order)
  );

  function toggleVisible(id) {
    setDraft(d => d.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  }

  function moveUp(index) {
    if (index === 0) return;
    setDraft(d => {
      const next = [...d];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((w, i) => ({ ...w, order: i }));
    });
  }

  function moveDown(index) {
    setDraft(d => {
      if (index === d.length - 1) return d;
      const next = [...d];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((w, i) => ({ ...w, order: i }));
    });
  }

  function updateSetting(id, key, value) {
    setDraft(d => d.map(w =>
      w.id === id ? { ...w, settings: { ...w.settings, [key]: value } } : w
    ));
  }

  function handleSave() {
    onSave(draft.map((w, i) => ({ ...w, order: i })));
  }

  return (
    <div className="editor-overlay" role="dialog" aria-modal="true" aria-label="Edit Dashboard">
      <div className="editor-panel">
        <div className="editor-header">
          <h3>✏️ Edit Dashboard</h3>
          <button className="btn btn-sm btn-secondary" onClick={onClose} aria-label="Close editor">✕ Close</button>
        </div>

        <p className="editor-hint">
          Toggle widgets on/off, reorder with the ↑↓ buttons, and tweak per-widget settings.
          Changes are saved when you click <strong>Save Layout</strong>.
        </p>

        <ul className="editor-list">
          {draft.map((w, idx) => (
            <li key={w.id} className={`editor-item ${w.visible ? '' : 'editor-item--hidden'}`}>
              <div className="editor-item-main">
                <label className="editor-toggle">
                  <input
                    type="checkbox"
                    checked={w.visible}
                    onChange={() => toggleVisible(w.id)}
                  />
                  <span className="editor-toggle-track" />
                </label>

                <span className="editor-label">{w.label}</span>

                <div className="editor-order-btns">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    title="Move up"
                    aria-label={`Move ${w.label} up`}
                  >↑</button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => moveDown(idx)}
                    disabled={idx === draft.length - 1}
                    title="Move down"
                    aria-label={`Move ${w.label} down`}
                  >↓</button>
                </div>
              </div>

              {/* Widget-specific settings */}
              {w.visible && w.id === 'tasks' && (
                <div className="editor-settings">
                  <label>
                    <input
                      type="checkbox"
                      checked={w.settings?.showDone ?? true}
                      onChange={e => updateSetting(w.id, 'showDone', e.target.checked)}
                    />
                    {' '}Show completed tasks
                  </label>
                </div>
              )}

              {w.visible && w.id === 'announcements' && (
                <div className="editor-settings">
                  <label htmlFor={`ann-limit-${w.id}`} style={{ marginRight: '.5rem' }}>
                    Max items:
                  </label>
                  <select
                    id={`ann-limit-${w.id}`}
                    value={w.settings?.limit ?? 5}
                    onChange={e => updateSetting(w.id, 'limit', Number(e.target.value))}
                    style={{ fontSize: '.8rem', padding: '.2rem .4rem' }}
                  >
                    {[3, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              )}

              {w.visible && w.id === 'schedule' && (
                <div className="editor-settings">
                  <label htmlFor={`sched-range-${w.id}`} style={{ marginRight: '.5rem' }}>
                    Date range:
                  </label>
                  <select
                    id={`sched-range-${w.id}`}
                    value={w.settings?.range ?? '7'}
                    onChange={e => updateSetting(w.id, 'range', e.target.value)}
                    style={{ fontSize: '.8rem', padding: '.2rem .4rem' }}
                  >
                    <option value="7">Next 7 days</option>
                    <option value="14">Next 14 days</option>
                    <option value="30">Next 30 days</option>
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="editor-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>💾 Save Layout</button>
        </div>
      </div>
    </div>
  );
}
