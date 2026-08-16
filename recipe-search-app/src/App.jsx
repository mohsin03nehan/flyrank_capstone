import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import { useAuth } from './context/AuthContext'
import { useHomeRecipes } from './hooks/useHomeRecipes'
import Auth from './pages/Auth'
import Favourites from './pages/Favourites'
import Home from './pages/Home'

function PrivateRoute({ children }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <p className="px-4 py-8 text-center text-stone-600">Loading...</p>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function PublicOnlyRoute({ children }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <p className="px-4 py-8 text-center text-stone-600">Loading...</p>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const { query, setQuery, meals, loading, error, handleSearch } = useHomeRecipes()

  return (
    <>
      <Header query={query} onQueryChange={setQuery} onSearch={handleSearch} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              query={query}
              meals={meals}
              loading={loading}
              error={error}
            />
          }
        />
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <PrivateRoute>
              <Favourites />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
