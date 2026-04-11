import { DATA_STORE, DATA_DIR } from '../../config.js';
import { MemoryStore } from './memory.js';
import { FileStore }   from './file.js';

/**
 * Factory – returns the configured store singleton.
 * DATA_STORE=memory (default) or DATA_STORE=file
 */
function createStore() {
  if (DATA_STORE === 'file') return new FileStore(DATA_DIR);
  return new MemoryStore();
}

export const store = createStore();
