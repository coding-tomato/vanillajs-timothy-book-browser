export class IndexedDBInstance {
  constructor(dbName, storeName) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);
      request.onupgradeneeded = () =>
        request.result.createObjectStore(this.storeName);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async write(key, value) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.put(JSON.stringify(value), key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async read(key) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => {
        const value = request.result;
        resolve(value ? JSON.parse(value) : undefined);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
