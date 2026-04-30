export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
  options,      // for type="select": [{ value, label }]
  rows,         // for type="textarea"
  min, max,     // for type="number" or "range"
  readOnly,
  accept,       // for type="file"
}) {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name}>
          {label}{required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          className={error ? 'error' : ''}
          readOnly={readOnly}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={error ? 'error' : ''}
          disabled={readOnly}
        >
          <option value="">-- Select --</option>
          {options && options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={type === 'file' ? undefined : value}
          onChange={onChange}
          placeholder={placeholder}
          className={error ? 'error' : ''}
          min={min}
          max={max}
          readOnly={readOnly}
          accept={accept}
        />
      )}
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}
