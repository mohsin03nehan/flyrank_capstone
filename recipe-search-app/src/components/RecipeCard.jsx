import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RecipeCard({ meal, isFavourite = false, onToggleFavourite }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleFavouriteClick = async () => {
    if (!user) {
      navigate('/auth')
      return
    }

    if (onToggleFavourite) {
      await onToggleFavourite(meal)
    }
  }

  return (
    <li className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 shadow-sm">
      <img
        src={meal?.strMealThumb}
        alt={meal?.strMeal || 'Recipe thumbnail'}
        className="h-52 w-full object-cover"
      />

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-500">
              {meal?.strCategory || 'Recipe'}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-stone-900">{meal?.strMeal}</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFavouriteClick}
          className={`w-full rounded-full border px-4 py-2.5 text-sm font-medium transition ${
            isFavourite
              ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
              : 'border-stone-300 bg-white text-stone-700 hover:border-orange-300 hover:text-orange-600'
          }`}
        >
          {isFavourite ? 'Remove Favourite' : 'Favourite'}
        </button>
      </div>
    </li>
  )
}

export default RecipeCard
