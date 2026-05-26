import { BookCover, StarRating, Badge } from './UI'

export default function BookCard({ book, view, onEdit, onDelete }) {
  const initials = book.cover || book.title.slice(0, 2).toUpperCase()

  if (view === 'list') {
    return (
      <div style={{
        background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10,
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <BookCover initials={initials} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.title}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#666' }}>{book.author}</p>
        </div>
        <Badge label={book.genre} />
        <span style={{ fontSize: 13, color: '#999' }}>{book.year}</span>
        <StarRating value={book.rating} readonly />
        <button onClick={() => onEdit(book)}   style={btn()}>Edit</button>
        <button onClick={() => onDelete(book)} style={btn(true)}>Delete</button>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, overflow: 'hidden',
    }}>
      <div style={{ background: '#f7f7f4', display: 'flex', justifyContent: 'center', padding: '20px 0 12px' }}>
        <BookCover initials={initials} size={56} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 14 }}>{book.title}</p>
        <p style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>{book.author}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Badge label={book.genre} />
          <span style={{ fontSize: 12, color: '#999' }}>{book.year}</span>
        </div>
        <StarRating value={book.rating} readonly />
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <button onClick={() => onEdit(book)}   style={{ ...btn(), flex: 1 }}>Edit</button>
          <button onClick={() => onDelete(book)} style={{ ...btn(true), flex: 1 }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function btn(danger = false) {
  return {
    padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: 500,
    cursor: 'pointer', background: 'none',
    border: `1px solid ${danger ? '#fcc' : '#e0e0e0'}`,
    color: danger ? '#C9184A' : '#555',
  }
}