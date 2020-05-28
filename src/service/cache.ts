import * as admin from 'firebase-admin'
import { AutiusClass } from '../types'

let db: admin.firestore.Firestore = null
let cache: admin.firestore.CollectionReference = null
const CACHE_COLLECTION_ID = 'cache'
const CACHE_DOCUMENT_ID = '_cache'

export function initCache() {
  let privateKey: string

  try {
    privateKey = JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
  } catch {
    privateKey = process.env.FIREBASE_PRIVATE_KEY
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
      projectId: 'autius'
    })
  })

  db = admin.firestore()
  cache = db.collection(CACHE_COLLECTION_ID)
}

export async function getCachedClasses() {
  try {
    const doc = await cache.doc(CACHE_DOCUMENT_ID).get()

    return JSON.parse(doc.data().items)
  } catch {
    return []
  }
}

export async function setCachedClasses(value: Array<Partial<AutiusClass>>) {
  let batch = db.batch()

  const docs = await cache.listDocuments()

  docs.forEach((doc) => batch.delete(doc))

  await batch.commit()

  batch = db.batch()

  batch.set(cache.doc(CACHE_DOCUMENT_ID), { items: JSON.stringify(value) })

  await batch.commit()
}
