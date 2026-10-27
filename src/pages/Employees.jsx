import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEmployees, removeEmployee } from '../lib/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const PAGE_SIZE = 8;
export default function Employees() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('todos');
  const [cargo, setCargo] = useState('todos');
  const [order, setOrder] = useState('nome');
  const [page, setPage] = useState(1);
  async function reload() {
    setLoading(true); setError('');
    try { setPeople(await listEmployees()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { reload(); }, []);
  const cargos = useMemo(() => [...new Set(people.map((p) => p.cargo).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'pt-BR')), [people]);
  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('pt-BR');
    return people.filter((p) => {
      const matches = !q || [p.nome, p.cargo, p.ativo ? 'ativo' : 'inativo'].some((s) => s.toLocaleLowerCase('pt-BR').includes(q));
      return matches && (status === 'todos' || (p.ativo ? 'ativos' : 'inativos') === status) && (cargo === 'todos' || p.cargo === cargo);
    }).sort((a, b) => order === 'recente'
      ? String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))
      : a.nome.localeCompare(b.nome, 'pt-BR') * (order === 'nome-desc' ? -1 : 1));
  }, [people, search, status, cargo, order]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  async function handleDelete(person) {
    if (!window.confirm('Excluir ' + person.nome + '? Esta ação não pode ser desfeita.')) return;
    setBusy(person.id); setError(''); setMessage('');
    try {
      await removeEmployee(person);
      setMessage('Funcionário excluído com sucesso.');
      setPage(1);
      await reload();
    } catch (e) { setError(e.message); }
    finally { setBusy(null); }
  }
  const change = (setter) => (event) => { setter(event.target.value); setPage(1); };
  return (
    <div className="stack employees-page">
      <div className="page-heading"><div><p className="eyebrow">CADASTROS</p><h1>Funcionários</h1><p>Pesquise e gerencie informações de trabalhadores e EPIs.</p></div><Link className="btn btn-primary" to="/funcionarios/novo">+ Adicionar funcionário</Link></div>
      {error && <div className="notice notice-error" role="alert">{error} <button className="link-button" type="button" onClick={reload}>Tentar novamente</button></div>}
      {message && <div className="notice notice-success" role="status">{message}</div>}
      <section className="panel" aria-labelledby="titulo-lista">
        <div className="panel-heading"><div><h2 id="titulo-lista">Lista de funcionários</h2><p aria-live="polite">{loading ? 'Carregando…' : filtered.length + ' resultado(s)'}</p></div></div>
        <div className="filter-grid">
          <label className="field search-field"><span>Buscar por nome, cargo ou status</span><span className="input-icon"><FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden="true" /><input type="search" placeholder="Buscar funcionário…" value={search} onChange={change(setSearch)} /></span></label>
          <label className="field"><span>Status</span><select value={status} onChange={change(setStatus)}><option value="todos">Todos</option><option value="ativos">Ativos</option><option value="inativos">Inativos</option></select></label>
          <label className="field"><span>Cargo</span><select value={cargo} onChange={change(setCargo)}><option value="todos">Todos</option>{cargos.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label className="field"><span>Ordenação</span><select value={order} onChange={change(setOrder)}><option value="nome">Nome (A–Z)</option><option value="nome-desc">Nome (Z–A)</option><option value="recente">Alterados recentemente</option></select></label>
        </div>
        {loading ? <p className="empty-inline" role="status">Carregando registros…</p> : !visible.length ? <div className="empty-inline"><p>Nenhum funcionário encontrado.</p><button type="button" className="btn btn-outline" onClick={() => { setSearch(''); setCargo('todos'); setStatus('todos'); }}>Limpar filtros</button></div> :
        <><div className="table-wrap"><table><thead><tr><th scope="col">Nome</th><th scope="col">Cargo</th><th scope="col">Status</th><th scope="col">Atividades</th><th scope="col" className="actions-col">Ações</th></tr></thead><tbody>{visible.map((p) =>
          <tr key={p.id}><td><div className="person-cell"><span className="avatar" aria-hidden="true">{p.nome.charAt(0)}</span><strong>{p.nome}</strong></div></td><td>{p.cargo}</td><td><span className={'status ' + (p.ativo ? 'status-active' : 'status-inactive')}>{p.ativo ? 'Ativo' : 'Inativo'}</span></td><td>{p.atividades.length}</td><td><div className="row-actions"><Link className="icon-btn" aria-label={'Ver ' + p.nome} title="Ver detalhes" to={'/funcionarios/' + p.id}><FontAwesomeIcon icon={faEye} /></Link><Link className="icon-btn" aria-label={'Editar ' + p.nome} title="Editar" to={'/funcionarios/' + p.id + '/editar'}><FontAwesomeIcon icon={faPen} /></Link><button className="icon-btn danger" type="button" aria-label={'Excluir ' + p.nome} title="Excluir" disabled={busy === p.id} onClick={() => handleDelete(p)}><FontAwesomeIcon icon={faTrashCan} /></button></div></td></tr>
        )}</tbody></table></div>
        <div className="mobile-employee-list" aria-label="Funcionários em cartões">
          {visible.map((p) => <article className="mobile-person-card" key={p.id}>
            <div className="mobile-person-header"><span className="avatar" aria-hidden="true">{p.nome.charAt(0)}</span>
              <div className="mobile-person-id"><strong>{p.nome}</strong><span>{p.cargo}</span></div>
              <span className={'status ' + (p.ativo ? 'status-active' : 'status-inactive')}>{p.ativo ? 'Ativo' : 'Inativo'}</span>
            </div>
            <p className="mobile-activity-count">{p.atividades.length} atividade(s) cadastrada(s)</p>
            <div className="mobile-person-actions">
              <Link className="btn btn-outline btn-sm" aria-label={'Ver ' + p.nome} to={'/funcionarios/' + p.id}><FontAwesomeIcon icon={faEye} /> Detalhes</Link>
              <Link className="btn btn-outline btn-sm" aria-label={'Editar ' + p.nome} to={'/funcionarios/' + p.id + '/editar'}><FontAwesomeIcon icon={faPen} /> Editar</Link>
              <button className="btn btn-outline btn-sm danger-text" type="button" aria-label={'Excluir ' + p.nome} disabled={busy === p.id} onClick={() => handleDelete(p)}><FontAwesomeIcon icon={faTrashCan} /> Excluir</button>
            </div>
          </article>)}
        </div></>}
        {!loading && filtered.length > PAGE_SIZE && <div className="pagination"><span>Página {page} de {pageCount}</span><div><button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</button><button className="btn btn-outline btn-sm" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Próxima</button></div></div>}
      </section>
    </div>
  );
}
