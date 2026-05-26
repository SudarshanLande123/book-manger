
const KEY = 'library-books'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] }
  catch { return [] }
}

function save(books) {
  localStorage.setItem(KEY, JSON.stringify(books))
}

export const getAll = async () => {
  return load()
}

export const create = async (data) => {
  const books = load()
  const book = { ...data, id: Date.now() }
  save([...books, book])
  return book
}

export const update = async (id, data) => {
  const books = load().map((b) => b.id === id ? { ...b, ...data } : b)
  save(books)
  return books.find((b) => b.id === id)
}

export const remove = async (id) => {
  save(load().filter((b) => b.id !== id))
  return { success: true }
}