import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './firebaseService'

function formatFirebaseError(error) {
  const code = error?.code || ''

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    default:
      return error?.message || 'Authentication failed.'
  }
}

export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw new Error(formatFirebaseError(error))
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw new Error(formatFirebaseError(error))
  }
}

export async function logoutUser() {
  try {
    await signOut(auth)
  } catch (error) {
    throw new Error(formatFirebaseError(error))
  }
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}
