// UI.jsx
import { useEffect, useState } from 'react'

export function BookCover({ initials, size = 56 }) {
  return (
    <div style={{
      width: size, height: size * 1.4, borderRadius: 4,
      background: '#2D6A4F', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: size * 0.22 }}>
        {initials}
      </span>
    </div>
  )
}

export function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(null)
  const displayed = hovered ?? value

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => !readonly && onChange?.(i)}
          onMouseEnter={() => !readonly && setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            fontSize: readonly ? 13 : 18,
            color: i <= displayed ? '#f5a623' : '#ccc',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function Badge({ label }) {
  return (
    <span style={{
      background: '#f0f0f0', color: '#444',
      borderRadius: 20, padding: '2px 10px',
      fontSize: 11, fontWeight: 600,
    }}>
      {label}
    </span>
  )
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      <div style={{
        width: 28, height: 28,
        border: '2.5px solid #e5e5e5', borderTopColor: '#2D6A4F',
        borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export function Toast({ msg, type = 'success', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: type === 'error' ? '#c0392b' : '#2D6A4F',
      color: '#fff', padding: '12px 20px', borderRadius: 8,
      fontSize: 14, zIndex: 9999,
    }}>
      {msg}
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  )
}