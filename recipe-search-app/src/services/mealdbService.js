// This file will handle communication with TheMealDB API.

export async function searchMeals(query) {
  const encodedQuery = encodeURIComponent(query?.trim() ?? '')
  const endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodedQuery}`

  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data?.meals) ? data.meals : []
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Meal search failed: ${message}`)
  }
}

export async function fetchRandomMeals(count = 12) {
  const targetCount = Math.min(Math.max(Number(count) || 12, 12), 20)
  const requestCount = Math.max(targetCount, 20)

  console.time('fetchRandomMeals')

  try {
    const requests = Array.from({ length: requestCount }, async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')

      if (!response.ok) {
        throw new Error(`Failed to fetch random meal: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data?.meals?.[0] ?? null
    })

    const results = await Promise.all(requests)
    const uniqueMeals = []
    const seenIds = new Set()

    results.forEach((meal) => {
      if (!meal || !meal.idMeal || seenIds.has(meal.idMeal)) {
        return
      }

      seenIds.add(meal.idMeal)
      uniqueMeals.push(meal)
    })

    return uniqueMeals.slice(0, targetCount)
  } finally {
    console.timeEnd('fetchRandomMeals')
  }
}
