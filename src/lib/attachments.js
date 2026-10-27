import { validateAttachment } from './validation.js';

// Os blobs ficam no IndexedDB local; o JSON Server recebe apenas metadados.
// Não é um armazenamento empresarial ou compartilhado entre dispositivos.
const DATABASE = 'sea-demo-attachments-v1';
const STORE = 'documents';
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function operation(id, mode, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    const req = mode === 'readonly' ? store.get(String(id)) : (value === null ? store.delete(String(id)) : store.put(value, String(id)));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}
export async function saveAttachment(id, file) {
  const error = validateAttachment(file);
  if (error) throw new Error(error);
  await operation(id, 'readwrite', { blob: file, name: file.name, type: file.type });
  return { name: file.name, type: file.type, size: file.size, localOnly: true };
}
export async function getAttachment(id) { return operation(id, 'readonly'); }
export async function deleteAttachment(id) { return operation(id, 'readwrite', null); }
