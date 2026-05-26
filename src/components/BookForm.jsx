import React, { useState } from 'react'

const GENRES = [
  'Fiction',
  'Non-Fiction',
  'Fantasy',
  'Science Fiction',
  'Biography',
  'History',
]

const EMPTY = {
  title: '',
  author: '',
  genre: 'Fiction',
  year: '',
  rating: 0,
}

export default function BookForm({ initial = EMPTY, onSubmit, loading, submitLabel = 'Save' }) {
  const [form, setForm]     = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())  e.title  = 'Title is required'
    if (!form.author.trim()) e.author = 'Author is required'
    if (!form.year || form.year < 1000 || form.year > new Date().getFullYear() + 5)
      e.year = 'Enter a valid year'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({ ...form, year: Number(form.year) })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      <Field
        label="Title" name="title" value={form.title}
        onChange={set} error={errors.title}
        placeholder="e.g. The Great Gatsby"
      />

      <Field
        label="Author" name="author" value={form.author}
        onChange={set} error={errors.author}
        placeholder="e.g. F. Scott Fitzgerald"
      />

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>Genre</label>
        <select
          value={form.genre} onChange={(e) => set('genre', e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: '1px solid #d5d5d5', background: '#fafafa', fontSize: 14, outline: 'none', cursor: 'pointer' }}
        >
          {GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <Field
        label="Publication Year" name="year" type="number" value={form.year}
        onChange={set} error={errors.year}
        min={1000} max={new Date().getFullYear() + 5} placeholder="e.g. 2024"
      />

      {}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 8 }}>Rating</label>
        <StarRating value={form.rating} onChange={(val) => set('rating', val)} />
      </div>

      <button
        type="submit" disabled={loading}
        style={{
          width: '100%', padding: 11, background: '#2D6A4F', color: '#fff',
          border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {loading ? 'Saving…' : submitLabel}
      </button>

    </form>
  )
}

function Field({ label, name, value, onChange, error, type = 'text', ...rest }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '9px 12px',
          borderRadius: 8, border: `1px solid ${error ? '#C9184A' : '#d5d5d5'}`,
          background: '#fafafa', fontSize: 14, outline: 'none',
        }}
        {...rest}
      />
      {error && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#C9184A' }}>{error}</p>}
    </div>
  )
}


function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(null)
  const displayed = hovered ?? value

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          style={{
            fontSize: 28,
            cursor: 'pointer',
            color: star <= displayed ? '#f5a623' : '#d5d5d5',
            transition: 'color 0.1s',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
      {value > 0 && (
        <span
          onClick={() => onChange(0)}
          style={{ fontSize: 12, color: '#aaa', cursor: 'pointer', marginLeft: 6 }}
        >
          clear
        </span>
      )}
    </div>
  )
}