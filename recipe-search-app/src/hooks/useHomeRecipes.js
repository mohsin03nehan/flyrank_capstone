import { useEffect, useState } from 'react'
import { fetchRandomMeals, searchMeals } from '../services/mealdbService'

export function useHomeRecipes() {
  const [query, setQuery] = useState('')
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInitialLoad = async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await fetchRandomMeals(12)
      setMeals(results)
    } catch (err) {
      setMeals([])
      setError(err instanceof Error ? err.message : 'Unable to load recipes.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (searchTerm = query) => {
    const trimmedQuery = (searchTerm ?? '').trim()

    console.log('handleSearch started', { trimmedQuery, currentQuery: query })

    setQuery(trimmedQuery)

    if (!trimmedQuery) {
      setError(null)
      await handleInitialLoad()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await searchMeals(trimmedQuery)
      setMeals(results)
    } catch (err) {
      setMeals([])
      setError(err instanceof Error ? err.message : 'Unable to search recipes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleInitialLoad()
  }, [])

  return { query, setQuery, meals, loading, error, handleSearch }
}
