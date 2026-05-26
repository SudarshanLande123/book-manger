const BASE_URL = '/books'

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json()
}

export const getAll = async () => {
  const res = await fetch(BASE_URL)
  return handleResponse(res)
}

export const create = async (bookData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  })
  return handleResponse(res)
}

export const update = async (id, bookData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData),
  })
  return handleResponse(res)
}

export const remove = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
  return { success: true }
}