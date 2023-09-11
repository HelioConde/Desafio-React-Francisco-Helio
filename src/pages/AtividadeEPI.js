import React, { useState } from 'react';

function AtividadeEPI() {
  const [atividades, setAtividades] = useState([{ atividade: '', epis: [{ epi: '', ca: '' }] }]);

  const adicionarAtividade = () => {
    setAtividades([...atividades, { atividade: '', epis: [{ epi: '', ca: '' }] }]);
  };

  const adicionarEPI = (indiceAtividade) => {
    const novasAtividades = [...atividades];
    novasAtividades[indiceAtividade].epis.push({ epi: '', ca: '' });
    setAtividades(novasAtividades);
  };

  // Lógica para enviar para o servidor JSON aqui

  return (
    <form>
      {atividades.map((atividade, indiceAtividade) => (
        <div key={indiceAtividade}>
          <select>
            <option>Ativid. 1</option>
            <option>Ativid. 2</option>
          </select>

          {atividade.epis.map((epi, indiceEPI) => (
            <div key={indiceEPI}>
              <select>
                <option>Calçado de segurança</option>
              </select>
              <input type="text" placeholder="Informe o número do CA:" />
              <button onClick={() => adicionarEPI(indiceAtividade)}>Adicionar EPI</button>
            </div>
          ))}

          <button onClick={adicionarAtividade}>Adicionar outra atividade</button>
        </div>
      ))}
    </form>
  );
}

export default AtividadeEPI;
