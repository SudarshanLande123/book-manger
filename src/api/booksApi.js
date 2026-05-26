const KEY = 'library-books'
const DEFAULT_BOOKS = [
    {
      "id": "1",
      "title": "The Midnight Library",
      "author": "Matt Haig",
      "genre": "Fiction",
      "year": 2020,
      "rating": 4,
      "cover": "ML"
    },
    {
      "id": "2",
      "title": "Atomic Habits",
      "author": "James Clear",
      "genre": "Self-Help",
      "year": 2018,
      "rating": 5,
      "cover": "AH"
    },
    {
      "id": "3",
      "title": "Dune",
      "author": "Frank Herbert",
      "genre": "Science Fiction",
      "year": 1965,
      "rating": 5,
      "cover": "DU"
    },
    {
      "id": "4",
      "title": "The Alchemist",
      "author": "Paulo Coelho",
      "genre": "Fiction",
      "year": 1988,
      "rating": 4,
      "cover": "TA"
    },
    {
      "id": "5",
      "title": "Sapiens",
      "author": "Yuval Noah Harari",
      "genre": "Non-Fiction",
      "year": 2011,
      "rating": 5,
      "cover": "SA"
    },
    {
      "id": "6",
      "title": "Project Hail Mary",
      "author": "Andy Weir",
      "genre": "Science Fiction",
      "year": 2021,
      "rating": 5,
      "cover": "PH"
    },
    {
      "id": "7",
      "title": "The Psychology of Money",
      "author": "Morgan Housel",
      "genre": "Finance",
      "year": 2020,
      "rating": 4,
      "cover": "PM"
    },
    {
      "id": "8",
      "title": "Educated",
      "author": "Tara Westover",
      "genre": "Memoir",
      "year": 2018,
      "rating": 4,
      "cover": "ED"
    },
    {
      "id": "9",
      "title": "The Name of the Wind",
      "author": "Patrick Rothfuss",
      "genre": "Fantasy",
      "year": 2007,
      "rating": 5,
      "cover": "NW"
    },
    {
      "id": "10",
      "title": "Thinking, Fast and Slow",
      "author": "Daniel Kahneman",
      "genre": "Psychology",
      "year": 2011,
      "rating": 4,
      "cover": "TF"
    }
  ]

function load() {
  try {
    const stored = localStorage.getItem(KEY)
    const parsed = stored ? JSON.parse(stored) : null
    
    if (!parsed || parsed.length === 0) {
      save(DEFAULT_BOOKS)
      return DEFAULT_BOOKS
    }
    return parsed
  } catch {
    return DEFAULT_BOOKS
  }
}

function save(books) {
  localStorage.setItem(KEY, JSON.stringify(books))
}

export const getAll = async () => {
  return load()
}

export const create = async (data) => {
  const books = load()
  const book = { ...data, id: String(Date.now()) }
  save([...books, book])
  return book
}

export const update = async (id, data) => {
  const books = load().map((b) => String(b.id) === String(id) ? { ...b, ...data } : b)
  save(books)
  return books.find((b) => String(b.id) === String(id))
}

export const remove = async (id) => {
  save(load().filter((b) => String(b.id) !== String(id)))
  return { success: true }
}