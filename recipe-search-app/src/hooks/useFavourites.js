import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { addFavourite, getFavourites, removeFavourite } from '../services/firebaseService'

export function useFavourites() {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadFavourites = useCallback(async () => {
    if (!user?.uid) {
      setFavourites([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await getFavourites(user.uid)
      setFavourites(results)
    } catch (err) {
      setFavourites([])
      setError(err instanceof Error ? err.message : 'Unable to load favourites.')
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    loadFavourites()
  }, [loadFavourites])

  const handleRemoveFavourite = useCallback(
    async (mealId) => {
      if (!user?.uid) {
        return
      }

      try {
        await removeFavourite(user.uid, mealId)
        setFavourites((currentFavourites) =>
          currentFavourites.filter((meal) => (meal.idMeal || meal.id) !== mealId),
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to remove favourite.')
      }
    },
    [user?.uid],
  )

  const handleAddFavourite = useCallback(
    async (meal) => {
      if (!user?.uid || !meal) {
        return
      }

      try {
        await addFavourite(user.uid, meal)
        setFavourites((currentFavourites) => {
          const mealId = meal.idMeal || meal.id
          const exists = currentFavourites.some((item) => (item.idMeal || item.id) === mealId)

          if (exists) {
            return currentFavourites
          }

          return [...currentFavourites, meal]
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to add favourite.')
      }
    },
    [user?.uid],
  )

  const isFavourite = useCallback(
    (mealId) => favourites.some((meal) => (meal.idMeal || meal.id) === mealId),
    [favourites],
  )

  const toggleFavourite = useCallback(
    async (meal) => {
      const mealId = meal?.idMeal || meal?.id

      if (!mealId) {
        return
      }

      if (isFavourite(mealId)) {
        await handleRemoveFavourite(mealId)
        return
      }

      await handleAddFavourite(meal)
    },
    [handleAddFavourite, handleRemoveFavourite, isFavourite],
  )

  return {
    favourites,
    loading,
    error,
    addFavourite: handleAddFavourite,
    removeFavourite: handleRemoveFavourite,
    toggleFavourite,
    isFavourite,
    refreshFavourites: loadFavourites,
  }
}
