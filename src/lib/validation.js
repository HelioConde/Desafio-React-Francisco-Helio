export const digits = (value) => String(value ?? '').replace(/\D/g, '');
export const formatCpf = (value) => {
  const s = digits(value).slice(0, 11);
  return s.replace(/^(\d{3})(\d)/, '$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1-$2');
};
export const validCpf = (value) => {
  const cpf = digits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const check = (length) => {
    const sum = [...cpf.slice(0, length)].reduce((acc, d, i) => acc + Number(d) * (length + 1 - i), 0);
    return ((sum * 10) % 11) % 10;
  };
  return check(9) === Number(cpf[9]) && check(10) === Number(cpf[10]);
};
export const normalizeEmployee = (raw = {}) => {
  const old = raw.Atividades || [];
  const activities = raw.atividades || old.map((a, i) => ({
    id: 'migrated-' + i, nome: a.atividade || '',
    epis: (a.epi || []).map((nome, j) => ({ id: 'migrated-' + i + '-' + j, nome, ca: a.ca?.[j] || '' })),
  }));
  return {
    ...raw,
    id: raw.id,
    nome: String(raw.nome || '').trim(),
    ativo: raw.ativo === true || raw.ativo === 'Ativo',
    cargo: raw.cargo || '',
    cpf: raw.cpf || '',
    sexo: raw.sexo || 'Não informado',
    nascimento: raw.nascimento || '',
    rg: raw.rg || '',
    naoUsaEPI: Boolean(raw.naoUsaEPI ?? raw.usaEPI === false),
    atividades: activities.map((a, i) => ({
      id: a.id || 'atividade-' + i, nome: a.nome || '',
      epis: (a.epis || []).map((e, j) => ({ id: e.id || 'epi-' + i + '-' + j, nome: e.nome || '', ca: String(e.ca || '') })),
    })),
    anexo: raw.anexo || null,
  };
};
export const validateEmployee = (raw) => {
  const e = normalizeEmployee(raw);
  const errors = {};
  if (e.nome.length < 3) errors.nome = 'Informe o nome com pelo menos 3 caracteres.';
  if (!e.cargo.trim()) errors.cargo = 'Informe o cargo.';
  if (e.cpf && !validCpf(e.cpf)) errors.cpf = 'CPF inválido. Deixe vazio para uma demonstração.';
  if (e.nascimento && (!/^\d{4}-\d{2}-\d{2}$/.test(e.nascimento) || !Number.isFinite(Date.parse(e.nascimento)) || new Date(e.nascimento) > new Date())) {
    errors.nascimento = 'Informe uma data de nascimento válida.';
  }
  if (!e.naoUsaEPI) e.atividades.forEach((a, i) => {
    if (!a.nome.trim()) errors['atividade-' + i] = 'Informe a atividade.';
    if (!a.epis.length) errors['atividade-epis-' + i] = 'Inclua pelo menos um EPI.';
    a.epis.forEach((epi, j) => {
      if (!epi.nome.trim()) errors['epi-' + i + '-' + j] = 'Selecione um EPI.';
      if (!/^\d{3,8}$/.test(digits(epi.ca))) errors['ca-' + i + '-' + j] = 'Informe um CA numérico de 3 a 8 dígitos.';
    });
  });
  return errors;
};
export const validateAttachment = (file) => {
  if (!file) return '';
  const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
  if (!allowed.includes(file.type)) return 'Use PDF, PNG ou JPG.';
  if (file.size > 2 * 1024 * 1024) return 'O arquivo deve ter no máximo 2 MB.';
  return '';
};
