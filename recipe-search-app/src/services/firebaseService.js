import { initializeApp } from 'firebase/app'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const database = getFirestore(app)
export const auth = getAuth(app)

function requireUserId(userId) {
  if (!userId) {
    throw new Error('User ID is required to manage favourites.')
  }
}

export async function addFavourite(userId, meal) {
  requireUserId(userId)

  if (!meal || !meal.idMeal) {
    throw new Error('Meal data is required to add a favourite.')
  }

  const favouriteRef = doc(database, 'users', userId, 'favourites', meal.idMeal)
  await setDoc(favouriteRef, {
    ...meal,
    addedAt: new Date().toISOString(),
  })

  return meal
}

export async function removeFavourite(userId, mealId) {
  requireUserId(userId)

  if (!mealId) {
    throw new Error('Meal ID is required to remove a favourite.')
  }

  const favouriteRef = doc(database, 'users', userId, 'favourites', mealId)
  await deleteDoc(favouriteRef)
}

export async function getFavourites(userId) {
  requireUserId(userId)

  const favouritesRef = collection(database, 'users', userId, 'favourites')
  const snapshot = await getDocs(favouritesRef)

  return snapshot.docs.map((docSnapshot) => ({
    ...docSnapshot.data(),
    id: docSnapshot.id,
  }))
}
