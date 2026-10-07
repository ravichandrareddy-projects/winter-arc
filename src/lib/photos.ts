/** On-device photo blobs (IndexedDB). Metadata lives in the zustand store. */

const DB_NAME = "winterarc-photos";
const STORE = "photos";

/** Photo IDs become object-storage path segments; reject traversal/control chars. */
export function isSafePhotoId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(value);
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = run(t.objectStore(STORE));
        req.onerror = () => reject(req.error);
        t.oncomplete = () => { db.close(); resolve(req.result); };
        t.onerror = () => { db.close(); reject(t.error); };
        t.onabort = () => { db.close(); reject(t.error ?? new Error("Photo storage transaction aborted.")); };
      })
  );
}

export function putPhotoBlob(id: string, blob: Blob): Promise<void> {
  return tx("readwrite", (s) => s.put(blob, id)).then(() => undefined);
}

export function getPhotoBlob(id: string): Promise<Blob | undefined> {
  return tx("readonly", (s) => s.get(id));
}

export function deletePhotoBlob(id: string): Promise<void> {
  return tx("readwrite", (s) => s.delete(id)).then(() => undefined);
}

export interface PhotoBackup {
  id: string;
  dataUrl: string;
}

export function photoDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Validate every image before writing; commit imported blobs together. */
export async function restorePhotoBlobs(photos: PhotoBackup[]): Promise<void> {
  const records = photos.map((photo) => {
    if (!photo || !isSafePhotoId(photo.id) || typeof photo.dataUrl !== "string") throw new Error("Invalid photo backup.");
    const match = /^data:(image\/(?:jpeg|png|webp|heic|heif));base64,([A-Za-z0-9+/=\r\n]+)$/.exec(photo.dataUrl);
    if (!match) throw new Error("Invalid photo image.");
    const binary = atob(match[2]);
    if (binary.length > 15 * 1024 * 1024) throw new Error("Photo exceeds 15MB.");
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return { id: photo.id, blob: new Blob([bytes], { type: match[1] }) };
  });
  if (!records.length) return;
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, "readwrite");
    const store = transaction.objectStore(STORE);
    for (const record of records) store.put(record.blob, record.id);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = transaction.onabort = () => { db.close(); reject(transaction.error); };
  });
}

/** Deletes the entire photo database (used by Clear All Data). */
export function deletePhotoDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("Close other Winter Arc tabs and try clearing photos again."));
  });
}
