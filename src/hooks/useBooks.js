import { useState, useEffect, useCallback } from 'react'
import * as api from '../api/booksApi'

export function useBooks() {
  const [books, setBooks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getAll()
      setBooks(data)
    } catch {
      setError('Failed to load books. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  // ── Add ────────────────────────────────────────────────────────────────────
  const addBook = async (formData) => {
    setActionLoading(true)
    try {
      const cover = formData.title.slice(0, 2).toUpperCase()
      const book  = await api.create({ ...formData, cover })
      setBooks((prev) => [...prev, book])
      return { success: true, book }
    } catch {
      return { success: false, message: 'Failed to add book.' }
    } finally {
      setActionLoading(false)
    }
  }

  // ── Edit ───────────────────────────────────────────────────────────────────
  const editBook = async (id, formData) => {
    setActionLoading(true)
    try {
      const updated = await api.update(id, formData)
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)))
      return { success: true, book: updated }
    } catch {
      return { success: false, message: 'Failed to update book.' }
    } finally {
      setActionLoading(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteBook = async (id) => {
    setActionLoading(true)
    try {
      await api.remove(id)
      setBooks((prev) => prev.filter((b) => b.id !== id))
      return { success: true }
    } catch {
      return { success: false, message: 'Failed to delete book.' }
    } finally {
      setActionLoading(false)
    }
  }

  return { books, loading, error, actionLoading, fetchBooks, addBook, editBook, deleteBook }
}
