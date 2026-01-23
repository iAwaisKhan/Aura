/**
 * Aura Unified Storage Manager
 * Implements persistent storage using IndexedDB with LocalStorage fallback.
 */

const DB_NAME = 'AuraDB_Modern';
const DB_VERSION = 2;
const STORES = ['notes', 'tasks', 'settings', 'snippets', 'focusSessions'];

class StorageManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        STORES.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event: any) => {
        console.error('IndexedDB failed, falling back to LocalStorage', event);
        resolve(); // Resolve anyway to allow fallback
      };
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (this.db) {
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(this.getFallback<T>(storeName));
      });
    }
    return this.getFallback<T>(storeName);
  }

  async save<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    if (this.db) {
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => {
          this.saveFallback(storeName, item);
          resolve();
        };
      });
    }
    this.saveFallback(storeName, item);
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (this.db) {
      return new Promise((resolve) => {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => {
          this.deleteFallback(storeName, id);
          resolve();
        };
      });
    }
    this.deleteFallback(storeName, id);
  }

  // LocalStorage Fallback Methods
  private getFallback<T>(storeName: string): T[] {
    const data = localStorage.getItem(`aura_${storeName}`);
    return data ? JSON.parse(data) : [];
  }

  private saveFallback<T extends { id: string }>(storeName: string, item: T): void {
    const items = this.getFallback<T>(storeName);
    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) items[index] = item;
    else items.push(item);
    localStorage.setItem(`aura_${storeName}`, JSON.stringify(items));
  }

  private deleteFallback(storeName: string, id: string): void {
    const items = this.getFallback<{id: string}>(storeName);
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(`aura_${storeName}`, JSON.stringify(filtered));
  }
}

export const storage = new StorageManager();
