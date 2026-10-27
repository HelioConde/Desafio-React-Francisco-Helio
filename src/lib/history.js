const KEY = 'sea-demo-history-v2';
export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
export function recordHistory(action, employee) {
  const entry = { id: Date.now() + '-' + Math.random().toString(36).slice(2), action, employee: employee.nome, when: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify([entry, ...getHistory()].slice(0, 100))); }
  catch { /* Modo privativo: histórico opcional */ }
}
