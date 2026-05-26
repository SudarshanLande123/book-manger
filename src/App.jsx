/**
 * App.jsx
 * Root component. Owns search/filter/sort/view UI state.
 * Delegates data logic to useBooks() and rendering to BookCard.
 */
import { useState, useRef } from 'react'
import { useBooks } from './hooks/useBooks'
import BookCard from './components/BookCard'
import BookForm, { GENRES } from './components/BookForm'
import { Modal, Toast, Spinner, BookCover } from './components/UI'

const SORT_OPTIONS = [
  { value: 'title',  label: 'Sort: Title'  },
  { value: 'author', label: 'Sort: Author' },
  { value: 'year',   label: 'Sort: Year'   },
  { value: 'rating', label: 'Sort: Rating' },
]

export default function App() {
  const { books, loading, error, actionLoading, fetchBooks, addBook, editBook, deleteBook } = useBooks()

  // ── UI state ────────────────────────────────────────────────────────────────
  const [search,      setSearch]      = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [sortBy,      setSortBy]      = useState('title')
  const [view,        setView]        = useState('grid')   // 'grid' | 'list'
  const [modal,       setModal]       = useState(null)     // null | {type,book?}
  const [toast,       setToast]       = useState(null)
  const searchRef = useRef()

  const showToast = (msg, type = 'success') => setToast({ msg, type })
  const closeModal = () => { if (!actionLoading) setModal(null) }

  // ── CRUD callbacks ──────────────────────────────────────────────────────────
  const handleAdd = async (data) => {
    const result = await addBook(data)
    if (result.success) { setModal(null); showToast(`"${result.book.title}" added to library`) }
    else showToast(result.message, 'error')
  }

  const handleEdit = async (data) => {
    const result = await editBook(modal.book.id, data)
    if (result.success) { setModal(null); showToast(`"${result.book.title}" updated`) }
    else showToast(result.message, 'error')
  }

  const handleDelete = async () => {
    const title = modal.book.title
    const result = await deleteBook(modal.book.id)
    if (result.success) { setModal(null); showToast(`"${title}" removed`) }
    else showToast(result.message, 'error')
  }

  // ── Filter + sort ───────────────────────────────────────────────────────────
  const allGenres = ['All', ...Array.from(new Set(books.map((b) => b.genre))).sort()]

  const filtered = books
    .filter((b) => {
      const q = search.toLowerCase()
      return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    })
    .filter((b) => genreFilter === 'All' || b.genre === genreFilter)
    .sort((a, b) => {
      if (sortBy === 'title')  return a.title.localeCompare(b.title)
      if (sortBy === 'author') return a.author.localeCompare(b.author)
      if (sortBy === 'year')   return b.year - a.year
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ background: '#fff', borderBottom: '0.5px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: '#2D6A4F', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📚</div>
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px' }}>LibraryOS</span>
          </div>

          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
            <input
              ref={searchRef} value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author…"
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 36, paddingRight: 12, height: 36, borderRadius: 20, border: '1px solid #e0e0e0', background: '#f7f7f4', fontSize: 14, outline: 'none' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Add button */}
          <button
            onClick={() => setModal({ type: 'add' })}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 36, background: '#2D6A4F', color: '#fff', border: 'none', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Book
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {/* Genre filter + controls */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
            {allGenres.map((g) => (
              <button
                key={g} onClick={() => setGenreFilter(g)}
                style={{
                  padding: '5px 14px', borderRadius: 20,
                  border: `1px solid ${genreFilter === g ? '#2D6A4F' : '#e0e0e0'}`,
                  background: genreFilter === g ? '#2D6A4F' : '#fff',
                  color: genreFilter === g ? '#fff' : '#555',
                  fontSize: 13, fontWeight: genreFilter === g ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {g}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', color: '#555', fontSize: 13, cursor: 'pointer' }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
              {['grid', 'list'].map((v) => (
                <button
                  key={v} onClick={() => setView(v)}
                  style={{ padding: '5px 10px', background: view === v ? '#f0f0ec' : '#fff', border: 'none', cursor: 'pointer', color: view === v ? '#1a1a1a' : '#aaa', fontSize: 16, lineHeight: 1 }}
                >
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count */}
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#999' }}>
          {loading ? 'Loading…' : `${filtered.length} of ${books.length} book${books.length !== 1 ? 's' : ''}${search || genreFilter !== 'All' ? ' (filtered)' : ''}`}
        </p>

        {/* Content states */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#C9184A', marginBottom: 12 }}>{error}</p>
            <button onClick={fetchBooks} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14 }}>Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, margin: 0 }}>
              {search || genreFilter !== 'All' ? 'No books match your filters.' : 'Your library is empty. Add your first book!'}
            </p>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} view="grid" onEdit={(b) => setModal({ type: 'edit', book: b })} onDelete={(b) => setModal({ type: 'delete', book: b })} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((book) => (
              <BookCard key={book.id} book={book} view="list" onEdit={(b) => setModal({ type: 'edit', book: b })} onDelete={(b) => setModal({ type: 'delete', book: b })} />
            ))}
          </div>
        )}
      </main>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {modal?.type === 'add' && (
        <Modal title="Add new book" onClose={closeModal}>
          <BookForm onSubmit={handleAdd} loading={actionLoading} submitLabel="Add to library" />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Edit book" onClose={closeModal}>
          <BookForm initial={modal.book} onSubmit={handleEdit} loading={actionLoading} submitLabel="Save changes" />
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Remove book" onClose={closeModal}>
          <div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
              <BookCover initials={modal.book.cover || modal.book.title.slice(0, 2).toUpperCase()} size={40} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{modal.book.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: '#666' }}>by {modal.book.author}</p>
              </div>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#666', lineHeight: 1.6 }}>
              This action cannot be undone. The book will be permanently removed from your library.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={closeModal} style={{ flex: 1, padding: 10, background: '#f5f5f5', color: '#333', border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} disabled={actionLoading} style={{ flex: 1, padding: 10, background: '#A4133C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: actionLoading ? 'not-allowed' : 'pointer', opacity: actionLoading ? 0.7 : 1 }}>
                {actionLoading ? 'Deleting…' : 'Delete book'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}
