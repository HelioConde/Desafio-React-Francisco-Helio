import { describe, expect, it } from 'vitest';
import { digits, formatCpf, normalizeEmployee, validCpf, validateAttachment, validateEmployee } from './validation.js';

describe('CPF e validação', () => {
  it('remove caracteres de máscara e formata CPF', () => {
    expect(digits('529.982.247-25')).toBe('52998224725');
    expect(formatCpf('52998224725')).toBe('529.982.247-25');
  });
  it('confere dígitos verificadores e bloqueia repetições', () => {
    expect(validCpf('529.982.247-25')).toBe(true);
    expect(validCpf('111.111.111-11')).toBe(false);
    expect(validCpf('529.982.247-20')).toBe(false);
  });
  it('não deixa salvar funcionário sem nome ou cargo', () => {
    expect(validateEmployee({ nome: '', cargo: '', naoUsaEPI: true })).toEqual({
      nome: 'Informe o nome com pelo menos 3 caracteres.', cargo: 'Informe o cargo.',
    });
  });
  it('exige CA numérico ao registrar EPI', () => {
    const errors = validateEmployee({
      nome: 'Teste QA', cargo: 'Estoquista', naoUsaEPI: false,
      atividades: [{ id: '1', nome: 'Estoque', epis: [{ id: '2', nome: 'Luva', ca: 'xx' }] }],
    });
    expect(errors['ca-0-0']).toMatch(/CA numérico/);
  });
  it('normaliza funcionários de dados antigos', () => {
    const old = normalizeEmployee({
      nome: '  Exemplo  ', ativo: 'Ativo', Atividades: [{ atividade: 'Expedição', epi: ['Capacete'], ca: ['12345'] }],
    });
    expect(old.nome).toBe('Exemplo');
    expect(old.ativo).toBe(true);
    expect(old.atividades[0].epis[0].ca).toBe('12345');
    expect(normalizeEmployee({ ativo: false }).ativo).toBe(false);
  });
  it('rejeita datas impossíveis e datas futuras', () => {
    expect(validateEmployee({ nome: 'Teste QA', cargo: 'Cargo', nascimento: '2026-13-04', naoUsaEPI: true }).nascimento).toBeDefined();
    expect(validateEmployee({ nome: 'Teste QA', cargo: 'Cargo', nascimento: '2999-01-01', naoUsaEPI: true }).nascimento).toBeDefined();
  });
});
describe('anexos', () => {
  it('aceita PDF e rejeita formatos e tamanhos inseguros', () => {
    expect(validateAttachment({ type: 'application/pdf', size: 2048 })).toBe('');
    expect(validateAttachment({ type: 'text/html', size: 2048 })).toMatch(/PDF/);
    expect(validateAttachment({ type: 'image/png', size: 3 * 1024 * 1024 })).toMatch(/2 MB/);
  });
});
