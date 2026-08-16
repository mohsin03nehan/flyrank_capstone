import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header({ query, onQueryChange, onSearch }) {
  const { user, logout } = useAuth()

  const handleSearchClick = () => {
    console.log('Header Search button clicked')
    onSearch()
  }

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            to="/"
            className="rounded-full px-3 py-2 text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
          >
            Home
          </Link>
          <Link
            to="/favourites"
            className="rounded-full px-3 py-2 text-stone-700 transition hover:bg-stone-100 hover:text-stone-900"
          >
            Favourites
          </Link>
        </nav>

        <form
          className="flex w-full max-w-md items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            handleSearchClick()
          }}
        >
          <label htmlFor="header-search" className="sr-only">
            Search recipes
          </label>
          <input
            id="header-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleSearchClick()
              }
            }}
            placeholder="Search recipes"
            className="w-full rounded-full border border-stone-300 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:bg-white"
          />
          <button
            type="submit"
            className="rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Search
          </button>
        </form>

        {user && (
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
