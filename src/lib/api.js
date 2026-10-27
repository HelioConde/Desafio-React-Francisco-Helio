import { sampleEmployees } from '../data/seed.js';
import { normalizeEmployee } from './validation.js';
import { recordHistory } from './history.js';
import { deleteAttachment } from './attachments.js';

const KEY = 'sea-demo-employees-v2';
export const isDemo = import.meta.env.VITE_DATA_MODE === 'demo' || (import.meta.env.PROD && import.meta.env.VITE_DATA_MODE !== 'api');
const URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '') + '/data';
const clone = (obj) => JSON.parse(JSON.stringify(obj));
function loadDemo() {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === null ? clone(sampleEmployees) : JSON.parse(stored);
  } catch { return clone(sampleEmployees); }
}
function writeDemo(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
async function request(path = '', options) {
  let response;
  try { response = await fetch(URL + path, options); }
  catch { throw new Error('Servidor de demonstração indisponível. Execute npm run dev:api.'); }
  if (!response.ok) throw new Error('Não foi possível concluir a operação (' + response.status + ').');
  if (response.status === 204) return null;
  return response.json();
}
export async function listEmployees() {
  const all = isDemo ? loadDemo() : await request();
  if (!Array.isArray(all)) throw new Error('Formato de resposta inesperado.');
  return all.map(normalizeEmployee);
}
export async function getEmployee(id) {
  if (isDemo) return loadDemo().map(normalizeEmployee).find((e) => String(e.id) === String(id)) || null;
  try { return normalizeEmployee(await request('/' + encodeURIComponent(id))); }
  catch (error) { if (error.message.includes('(404)')) return null; throw error; }
}
export async function saveEmployee(raw, { log = true } = {}) {
  const e = normalizeEmployee(raw);
  const hasId = e.id !== undefined && e.id !== null;
  const now = new Date().toISOString();
  const payload = { ...e, createdAt: e.createdAt || now, updatedAt: now };
  let result;
  if (isDemo) {
    const list = loadDemo();
    if (hasId) {
      const index = list.findIndex((item) => String(item.id) === String(e.id));
      if (index === -1) throw new Error('Funcionário não encontrado.');
      list[index] = payload;
    } else {
      payload.id = globalThis.crypto?.randomUUID?.() || String(Date.now());
      list.push(payload);
    }
    writeDemo(list);
    result = payload;
  } else {
    result = await request(hasId ? '/' + encodeURIComponent(e.id) : '', {
      method: hasId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hasId ? payload : Object.fromEntries(Object.entries(payload).filter(([key]) => key !== 'id'))),
    });
  }
  if (log) recordHistory(hasId ? 'Edição' : 'Cadastro', result);
  return normalizeEmployee(result);
}
export async function removeEmployee(employee) {
  if (isDemo) {
    writeDemo(loadDemo().filter((item) => String(item.id) !== String(employee.id)));
  } else {
    await request('/' + encodeURIComponent(employee.id), { method: 'DELETE' });
  }
  try { await deleteAttachment(employee.id); } catch { /* Exclusão dos dados principais concluída */ }
  recordHistory('Exclusão', employee);
}
