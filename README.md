src/
  api/
    booksApi.js       # All API calls (mock or real)
  components/
    BookCard.jsx      # Single book card (grid + list view)
    BookForm.jsx      # Add / edit form with validation
    UI.jsx            # Shared: Modal, Toast, Spinner, StarRating, Badge, BookCover
  hooks/
    useBooks.js       # Data fetching + CRUD state logic
  App.jsx             # Root layout, search/filter toolbar
  main.jsx            # Entry point