// Somente dados fictícios. Nunca testar com informações de funcionários reais.
export const sampleEmployees = [
  {
    id: 1, nome: 'Funcionário Exemplo 01', cpf: '', cargo: 'Operador de loja',
    ativo: true, nascimento: '1995-04-12', sexo: 'Não informado',
    rg: '', naoUsaEPI: false,
    atividades: [{ id: 'at-1', nome: 'Reposição', epis: [{ id: 'epi-1', nome: 'Calçado de segurança', ca: '12345' }] }],
    anexo: null, createdAt: '2026-01-10T10:00:00.000Z', updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 2, nome: 'Funcionário Exemplo 02', cpf: '', cargo: 'Administrativo',
    ativo: false, nascimento: '1990-09-22', sexo: 'Não informado',
    rg: '', naoUsaEPI: true, atividades: [], anexo: null,
    createdAt: '2026-02-04T10:00:00.000Z', updatedAt: '2026-02-04T10:00:00.000Z',
  },
  {
    id: 3, nome: 'Funcionário Exemplo 03', cpf: '', cargo: 'Estoquista',
    ativo: true, nascimento: '1998-11-16', sexo: 'Não informado',
    rg: '', naoUsaEPI: false,
    atividades: [{ id: 'at-3', nome: 'Movimentação de estoque', epis: [{ id: 'epi-3', nome: 'Capacete de segurança', ca: '45678' }] }],
    anexo: null, createdAt: '2026-02-15T10:00:00.000Z', updatedAt: '2026-02-15T10:00:00.000Z',
  },
];
