import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, onSnapshot, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error('Firebase initialization error:', error)
}

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null

if (db) {
  enableIndexedDbPersistence(db).catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase persistence failed: multiple tabs open')
    } else if (err.code === 'unimplemented') {
      console.warn('Firebase persistence not available in this browser')
    }
  })
}

export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  const userDoc = await getDoc(doc(db, 'users', user.uid))
  return { user, profile: userDoc.exists() ? userDoc.data() : null }
}

export async function registerUser(email, password, profileData) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  await setDoc(doc(db, 'users', user.uid), { ...profileData, email, uid: user.uid })
  return { user, profile: profileData }
}

export async function logout() {
  await signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async user => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      callback({ user, profile: userDoc.exists() ? userDoc.data() : null })
    } else {
      callback(null)
    }
  })
}

export async function getCollection(collectionName, constraints = []) {
  const q = constraints.length > 0 ? query(collection(db, collectionName), ...constraints) : collection(db, collectionName)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getDocument(collectionName, docId) {
  const docRef = doc(db, collectionName, docId)
  const snapshot = await getDoc(docRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export async function createDocument(collectionName, data) {
  const docRef = doc(collection(db, collectionName))
  await setDoc(docRef, data)
  return { id: docRef.id, ...data }
}

export async function updateDocument(collectionName, docId, data) {
  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, data)
  return { id: docId, ...data }
}

export async function deleteDocument(collectionName, docId) {
  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}

export async function uploadFile(path, file) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export function subscribeToCollection(collectionName, constraints, callback) {
  const q = constraints.length > 0 ? query(collection(db, collectionName), ...constraints) : collection(db, collectionName)
  return onSnapshot(q, snapshot => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(items)
  })
}
