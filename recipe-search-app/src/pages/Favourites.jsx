import RecipeCard from '../components/RecipeCard'
import { useFavourites } from '../hooks/useFavourites'

function Favourites() {
  const { favourites, loading, error, toggleFavourite, isFavourite } = useFavourites()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">Saved</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">Favourites</h1>
        </div>

        {loading && <p className="text-stone-600">Loading favourites...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && favourites.length === 0 && (
          <p className="text-stone-600">You haven’t saved any favourites yet.</p>
        )}

        {!loading && favourites.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favourites.map((meal) => (
              <RecipeCard
                key={meal.idMeal || meal.id}
                meal={meal}
                isFavourite={isFavourite(meal.idMeal || meal.id)}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default Favourites
