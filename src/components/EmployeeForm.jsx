import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEmployee, saveEmployee } from '../lib/api.js';
import { deleteAttachment, saveAttachment } from '../lib/attachments.js';
import { formatCpf, validateAttachment, validateEmployee } from '../lib/validation.js';

const uniqueId = () => globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
const emptyActivity = () => ({ id: uniqueId(), nome: '', epis: [{ id: uniqueId(), nome: 'Calçado de segurança', ca: '' }] });
const emptyEmployee = () => ({ nome: '', cpf: '', sexo: 'Não informado', nascimento: '', rg: '', cargo: '', ativo: true, naoUsaEPI: true, atividades: [], anexo: null });
const roles = ['Operador de loja', 'Estoquista', 'Administrativo', 'Repositor', 'Auxiliar de limpeza', 'Operador de caixa', 'Outro'];
const epiOptions = ['Calçado de segurança', 'Capacete de segurança', 'Luva de proteção', 'Óculos de proteção', 'Protetor auricular', 'Máscara respiratória', 'Outro'];

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [model, setModel] = useState(emptyEmployee);
  const [file, setFile] = useState(null);
  const [removeStoredFile, setRemoveStoredFile] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);
  useEffect(() => {
    if (!id) return undefined;
    let alive = true;
    getEmployee(id).then((person) => {
      if (!alive) return;
      if (!person) setError('Funcionário não encontrado.');
      else setModel(person);
    }).catch((e) => { if (alive) setError(e.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id]);
  const update = (key, value) => { setModel((previous) => ({ ...previous, [key]: value })); setErrors((previous) => ({ ...previous, [key]: undefined })); };
  const updateActivity = (index, value) => setModel((previous) => ({ ...previous, atividades: previous.atividades.map((a, i) => i === index ? { ...a, nome: value } : a) }));
  const updateEpi = (activityIndex, epiIndex, key, value) => setModel((previous) => ({
    ...previous, atividades: previous.atividades.map((a, i) => i !== activityIndex ? a : ({
      ...a, epis: a.epis.map((epi, j) => j === epiIndex ? { ...epi, [key]: value } : epi),
    })),
  }));
  const addEpi = (index) => setModel((previous) => ({ ...previous, atividades: previous.atividades.map((a, i) => i === index ? { ...a, epis: [...a.epis, { id: uniqueId(), nome: epiOptions[0], ca: '' }] } : a) }));
  const removeEpi = (i, j) => setModel((previous) => ({ ...previous, atividades: previous.atividades.map((a, ai) => ai === i ? { ...a, epis: a.epis.filter((_, ei) => ei !== j) } : a) }));
  async function submit(event) {
    event.preventDefault(); setError('');
    const found = validateEmployee(model);
    if (file) { const fileError = validateAttachment(file); if (fileError) found.file = fileError; }
    setErrors(found);
    if (Object.keys(found).length) {
      setError('Revise os campos destacados antes de salvar.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...model, atividades: model.naoUsaEPI ? [] : model.atividades, anexo: removeStoredFile ? null : model.anexo };
      let saved = await saveEmployee(payload);
      try {
        if (removeStoredFile && !file) await deleteAttachment(saved.id);
        if (file) {
          const metadata = await saveAttachment(saved.id, file);
          saved = await saveEmployee({ ...saved, anexo: metadata }, { log: false });
        }
      } catch (attachmentError) {
        navigate('/funcionarios/' + saved.id, { state: { warning: 'Cadastro salvo, mas o anexo não foi atualizado: ' + attachmentError.message } });
        return;
      }
      navigate('/funcionarios/' + saved.id);
    } catch (e) { setError(e.message || 'Não foi possível salvar o cadastro.'); }
    finally { setSaving(false); }
  }
  const fieldError = (name) => errors[name] ? <small className="field-error" id={'erro-' + name}>{errors[name]}</small> : null;
  if (loading) return <div className="panel empty" role="status">Carregando cadastro…</div>;
  if (editing && error === 'Funcionário não encontrado.') return <div className="panel empty" role="alert">{error} <Link to="/funcionarios">Voltar</Link></div>;
  return <div className="stack">
    <div className="page-heading"><div><p className="eyebrow">GESTÃO DE FUNCIONÁRIOS</p><h1>{editing ? 'Editar funcionário' : 'Adicionar funcionário'}</h1><p>Preencha as informações abaixo. Os dados usados devem ser fictícios.</p></div><Link className="btn btn-outline" to="/funcionarios">Cancelar</Link></div>
    {error && <div className="notice notice-error" role="alert">{error}</div>}
    <form onSubmit={submit} className="stack" noValidate>
      <section className="panel">
        <div className="panel-heading"><div><h2>1. Informações pessoais</h2><p>Identificação e situação do cadastro</p></div><label className="switch-label"><input type="checkbox" checked={model.ativo} onChange={(e) => update('ativo', e.target.checked)} /><span>Funcionário ativo</span></label></div>
        <div className="form-grid">
          <label className="field field-wide"><span>Nome completo <span aria-hidden="true">*</span></span><input name="nome" autoComplete="name" value={model.nome} onChange={(e) => update('nome', e.target.value)} aria-invalid={Boolean(errors.nome)} aria-describedby={errors.nome ? 'erro-nome' : undefined} placeholder="Ex.: Funcionário Exemplo" />{fieldError('nome')}</label>
          <label className="field"><span>Cargo <span aria-hidden="true">*</span></span><input name="cargo" list="cargos-sugeridos" value={model.cargo} onChange={(e) => update('cargo', e.target.value)} aria-invalid={Boolean(errors.cargo)} aria-describedby={errors.cargo ? 'erro-cargo' : undefined} placeholder="Digite o cargo" />{fieldError('cargo')}</label>
          <datalist id="cargos-sugeridos">{roles.map((role) => <option key={role} value={role} />)}</datalist>
          <label className="field"><span>CPF (opcional)</span><input name="cpf" inputMode="numeric" value={formatCpf(model.cpf)} maxLength={14} onChange={(e) => update('cpf', formatCpf(e.target.value))} aria-invalid={Boolean(errors.cpf)} aria-describedby={errors.cpf ? 'erro-cpf' : undefined} placeholder="000.000.000-00" />{fieldError('cpf')}</label>
          <label className="field"><span>Data de nascimento</span><input name="nascimento" type="date" value={model.nascimento || ''} onChange={(e) => update('nascimento', e.target.value)} aria-invalid={Boolean(errors.nascimento)} aria-describedby={errors.nascimento ? 'erro-nascimento' : undefined} />{fieldError('nascimento')}</label>
          <label className="field"><span>Sexo</span><select name="sexo" value={model.sexo} onChange={(e) => update('sexo', e.target.value)}><option>Não informado</option><option>Masculino</option><option>Feminino</option><option>Outro</option></select></label>
          <label className="field"><span>RG (opcional)</span><input name="rg" value={model.rg} onChange={(e) => update('rg', e.target.value)} placeholder="Documento de exemplo" /></label>
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>2. Atividades e EPIs</h2><p>Registre os equipamentos de proteção e seus CAs</p></div></div>
        <label className="switch-label epi-toggle"><input type="checkbox" checked={model.naoUsaEPI} onChange={(e) => setModel((prev) => ({ ...prev, naoUsaEPI: e.target.checked, atividades: e.target.checked ? [] : prev.atividades.length ? prev.atividades : [emptyActivity()] }))} /><span>O funcionário não utiliza EPI nas atividades registradas</span></label>
        {!model.naoUsaEPI && <div className="activities">
          {fieldError('atividades')}
          {model.atividades.map((activity, index) => <fieldset className="activity-card" key={activity.id}><legend>Atividade {index + 1}</legend><div className="activity-head"><label className="field"><span>Nome da atividade</span><input value={activity.nome} onChange={(e) => updateActivity(index, e.target.value)} aria-invalid={Boolean(errors['atividade-' + index])} aria-describedby={errors['atividade-' + index] ? 'erro-atividade-' + index : undefined} placeholder="Ex.: Reposição" />{fieldError('atividade-' + index)}</label><button className="btn btn-text danger-text" type="button" onClick={() => setModel((prev) => ({ ...prev, atividades: prev.atividades.filter((_, i) => i !== index) }))}>Remover atividade</button></div>
            {activity.epis.map((epi, j) => <div className="epi-row" key={epi.id}><label className="field"><span>Equipamento de proteção</span><select value={epi.nome} aria-invalid={Boolean(errors['epi-' + index + '-' + j])} onChange={(e) => updateEpi(index, j, 'nome', e.target.value)}>{epiOptions.map((name) => <option key={name}>{name}</option>)}</select>{fieldError('epi-' + index + '-' + j)}</label><label className="field"><span>Número do CA</span><input inputMode="numeric" value={epi.ca} onChange={(e) => updateEpi(index, j, 'ca', e.target.value)} aria-invalid={Boolean(errors['ca-' + index + '-' + j])} aria-describedby={errors['ca-' + index + '-' + j] ? 'erro-ca-' + index + '-' + j : undefined} placeholder="Ex.: 12345" />{fieldError('ca-' + index + '-' + j)}</label><button className="btn btn-outline btn-sm" type="button" onClick={() => removeEpi(index, j)} aria-label={'Remover EPI ' + (j + 1) + ' da atividade ' + (index + 1)}>Remover EPI</button></div>)}
            {fieldError('atividade-epis-' + index)}
            <button className="btn btn-outline btn-sm" type="button" onClick={() => addEpi(index)}>+ Adicionar EPI</button>
          </fieldset>)}
          <button className="btn btn-outline" type="button" onClick={() => setModel((prev) => ({ ...prev, atividades: [...prev.atividades, emptyActivity()] }))}>+ Adicionar atividade</button>
        </div>}
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>3. Documento ocupacional</h2><p>Anexo opcional • armazenado exclusivamente neste navegador</p></div></div>
        {model.anexo && !removeStoredFile && <div className="document-row"><span>Atual: {model.anexo.name}</span><button className="btn btn-text danger-text" type="button" onClick={() => setRemoveStoredFile(true)}>Remover anexo</button></div>}
        <label className="field file-field"><span>Selecionar PDF, PNG ou JPG (até 2 MB)</span><input type="file" name="documento" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" aria-invalid={Boolean(errors.file)} aria-describedby={errors.file ? 'erro-file' : 'anexo-ajuda'} onChange={(e) => { const selected = e.target.files?.[0] || null; setFile(selected); setErrors((prev) => ({ ...prev, file: validateAttachment(selected) || undefined })); }} />{fieldError('file')}<small id="anexo-ajuda" className="muted">{file ? 'Selecionado: ' + file.name : 'Nenhum arquivo novo selecionado.'}</small></label>
      </section>
      <div className="form-actions"><Link to="/funcionarios" className="btn btn-outline">Cancelar</Link><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando…' : (editing ? 'Salvar alterações' : 'Cadastrar funcionário')}</button></div>
    </form>
  </div>;
}
