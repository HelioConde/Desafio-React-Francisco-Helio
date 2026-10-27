import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getEmployee } from '../lib/api.js';
import { getAttachment } from '../lib/attachments.js';

export default function EmployeeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    getEmployee(id).then((e) => { if (alive) setEmployee(e); }).catch((e) => { if (alive) setError(e.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);
  async function download() {
    try {
      const document = await getAttachment(id);
      if (!document) throw new Error('Este anexo não está neste navegador.');
      const url = URL.createObjectURL(document.blob);
      const a = window.document.createElement('a');
      a.href = url; a.download = document.name; window.document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) { setError(e.message); }
  }
  if (loading) return <div role="status" className="panel empty">Carregando funcionário…</div>;
  if (!employee) return <div className="panel empty" role="alert">{error || 'Funcionário não encontrado.'} <Link to="/funcionarios">Voltar</Link></div>;
  return <div className="stack">
    <div className="page-heading"><div><p className="eyebrow">DETALHES DO CADASTRO</p><h1>{employee.nome}</h1><p>{employee.cargo} • <span className={'status ' + (employee.ativo ? 'status-active' : 'status-inactive')}>{employee.ativo ? 'Ativo' : 'Inativo'}</span></p></div><div className="heading-actions"><Link className="btn btn-outline" to="/funcionarios">Voltar</Link><Link className="btn btn-primary" to={'/funcionarios/' + id + '/editar'}>Editar cadastro</Link></div></div>
    {location.state?.warning && <div className="notice notice-error" role="alert">{location.state.warning}</div>}
    {error && <div className="notice notice-error" role="alert">{error}</div>}
    <section className="panel"><h2>Informações pessoais</h2><dl className="details-grid"><div><dt>Nome</dt><dd>{employee.nome}</dd></div><div><dt>Cargo</dt><dd>{employee.cargo}</dd></div><div><dt>CPF</dt><dd>{employee.cpf || 'Não informado'}</dd></div><div><dt>Nascimento</dt><dd>{employee.nascimento || 'Não informado'}</dd></div><div><dt>Sexo</dt><dd>{employee.sexo}</dd></div><div><dt>RG</dt><dd>{employee.rg || 'Não informado'}</dd></div></dl></section>
    <section className="panel"><h2>Atividades e EPIs</h2>{employee.naoUsaEPI ? <p>Funcionário marcado como não usuário de EPI.</p> : !employee.atividades.length ? <p>Sem atividades registradas.</p> : employee.atividades.map((a) => <div className="activity-detail" key={a.id}><h3>{a.nome}</h3>{a.epis.map((epi) => <p key={epi.id}>{epi.nome} <span className="muted">• CA {epi.ca}</span></p>)}</div>)}</section>
    <section className="panel"><h2>Documento ocupacional</h2>{employee.anexo ? <div className="document-row"><span>{employee.anexo.name} <small>(salvo neste navegador)</small></span><button type="button" className="btn btn-outline" onClick={download}>Baixar anexo</button></div> : <p className="muted">Nenhum anexo cadastrado.</p>}</section>
  </div>;
}
