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

export async function getCachedClasses(): Promise<Array<Partial<AutiusClass>>> {
  try {
    const doc = await cache.doc(CACHE_DOCUMENT_ID).get()
    const items: Array<number> = JSON.parse(doc.data().items)

    return items.map((id) => ({ id }))
  } catch {
    return []
  }
}

export async function setCachedClasses(classes: Array<AutiusClass>) {
  const value = classes.map(({ id }) => id)

  const docs = await cache.listDocuments()

  await docs
    .reduce(((batch, doc) => batch.delete(doc)), db.batch())
    .commit()

  await db
    .batch()
    .set(cache.doc(CACHE_DOCUMENT_ID), { items: JSON.stringify(value) })
    .commit()
}
