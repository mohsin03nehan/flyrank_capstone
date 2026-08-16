import RecipeCard from '../components/RecipeCard'
import { useFavourites } from '../hooks/useFavourites'

function Home({ query, meals, loading, error }) {
  const { toggleFavourite, isFavourite } = useFavourites()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">Fresh picks</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            {query?.trim() ? 'Search results' : 'Popular recipes'}
          </h1>
        </div>

        {loading && <p className="text-stone-600">Loading recipes...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && meals.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {meals.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                isFavourite={isFavourite(meal.idMeal)}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </ul>
        )}

        {!loading && meals.length === 0 && !error && (
          <p className="text-stone-600">No recipes found for this search.</p>
        )}
      </section>
    </main>
  )
}

export default Home
