import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { loginUser, registerUser } from '../services/authService'

const authSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters long.'),
})

function Auth() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isLoginMode, setIsLoginMode] = useState(false)

  const onSubmit = async (values) => {
    clearErrors('root')

    try {
      if (isLoginMode) {
        await loginUser(values.email, values.password)
      } else {
        await registerUser(values.email, values.password)
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Authentication failed.',
      })
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center px-4 py-10">
      <section className="w-full rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex rounded-full border border-stone-200 bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isLoginMode ? 'bg-orange-500 text-white' : 'text-stone-600'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              !isLoginMode ? 'bg-orange-500 text-white' : 'text-stone-600'
            }`}
          >
            Register
          </button>
        </div>

        <h1 className="text-3xl font-bold text-stone-900">
          {isLoginMode ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          {isLoginMode ? 'Sign in to continue.' : 'Register to save your favourites.'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-700 outline-none transition focus:border-orange-400 focus:bg-white"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-700 outline-none transition focus:border-orange-400 focus:bg-white"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {isSubmitting ? 'Please wait...' : isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Auth
