/**
 * In-memory key/value store.
 *
 * Collections are plain JS Maps keyed by a string id.
 * Data is lost on process restart – good for development/testing.
 */
export class MemoryStore {
  #db = new Map(); // collection → Map<id, item>

  #col(collection) {
    if (!this.#db.has(collection)) this.#db.set(collection, new Map());
    return this.#db.get(collection);
  }

  async get(collection, id) {
    return this.#col(collection).get(String(id)) ?? null;
  }

  async list(collection) {
    return [...this.#col(collection).values()];
  }

  async set(collection, id, value) {
    this.#col(collection).set(String(id), value);
    return value;
  }

  async delete(collection, id) {
    this.#col(collection).delete(String(id));
  }
}
