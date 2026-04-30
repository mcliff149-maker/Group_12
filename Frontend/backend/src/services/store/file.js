import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * JSON-file-based key/value store.
 *
 * Each collection is a separate JSON file: <dataDir>/<collection>.json
 * Structure: { "<id>": { ...item } }
 *
 * Behaves like the localStorage mock but server-side.
 * Easy to swap for a real DB: replace get/list/set/delete with ORM calls.
 */
export class FileStore {
  #dir;
  #cache = new Map(); // collection → Map<id, item>

  constructor(dataDir) {
    this.#dir = dataDir;
  }

  async #filePath(collection) {
    await fs.mkdir(this.#dir, { recursive: true });
    return path.join(this.#dir, `${collection}.json`);
  }

  async #load(collection) {
    if (this.#cache.has(collection)) return this.#cache.get(collection);
    const fp = await this.#filePath(collection);
    let data = {};
    try {
      data = JSON.parse(await fs.readFile(fp, 'utf8'));
    } catch {
      // file doesn't exist yet – start empty
    }
    const map = new Map(Object.entries(data));
    this.#cache.set(collection, map);
    return map;
  }

  async #flush(collection) {
    const map = await this.#load(collection);
    const fp  = await this.#filePath(collection);
    await fs.writeFile(fp, JSON.stringify(Object.fromEntries(map), null, 2), 'utf8');
  }

  async get(collection, id) {
    const map = await this.#load(collection);
    return map.get(String(id)) ?? null;
  }

  async list(collection) {
    const map = await this.#load(collection);
    return [...map.values()];
  }

  async set(collection, id, value) {
    const map = await this.#load(collection);
    map.set(String(id), value);
    await this.#flush(collection);
    return value;
  }

  async delete(collection, id) {
    const map = await this.#load(collection);
    map.delete(String(id));
    await this.#flush(collection);
  }
}
