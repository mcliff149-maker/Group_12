import { store } from './store/index.js';

const COLLECTION = 'reviews';

export async function getReviews(filter = {}) {
  const all = await store.list(COLLECTION);
  if (filter.reviewerUsername) return all.filter(r => r.reviewerUsername === filter.reviewerUsername);
  if (filter.studentUsername)  return all.filter(r => r.studentUsername  === filter.studentUsername);
  return all;
}

export async function createReview(reviewerUsername, data) {
  const id     = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const review = { ...data, id, reviewerUsername, createdAt: new Date().toISOString() };
  return store.set(COLLECTION, id, review);
}

export async function updateReview(id, data) {
  const existing = await store.get(COLLECTION, id);
  if (!existing) throw Object.assign(new Error('Review not found.'), { status: 404 });
  const updated = { ...existing, ...data, id };
  return store.set(COLLECTION, id, updated);
}
