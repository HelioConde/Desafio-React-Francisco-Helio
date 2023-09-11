import React, { useState } from "react";
import InputMask from "react-input-mask";

function Formulario() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dados, setDados] = useState({
    ativo: "Ativo",
    nome: "",
    sexo: "Masculino",
    cpf: "",
    nascimento: "",
    rg: "",
    cargo: "Cargo 1",
    Atividades: [
      {
        atividade: "Ativid. 1",
        epi: ["Calçado de segurança"],
        ca: [""],
      },
    ],
    documento_ocupacional: null, // Adicione esta chave
  });

  // Função para adicionar uma nova atividade
  const adicionarAtividade = () => {
    const novaAtividade = {
      atividade: "Ativid. 1",
      epi: ["Calçado de segurança"],
      ca: [],
    };
    setDados({
      ...dados,
      Atividades: [...dados.Atividades, novaAtividade],
    });
  };

  const handleUsaEPIChange = (e) => {
    const { checked } = e.target;
    setDados({
      ...dados,
      naoUsaEPI: checked,
    });
  };

  // Função para adicionar mais epi e ca a uma atividade existente
  const adicionarEpiCa = (indiceAtividade) => {
    const novasAtividades = [...dados.Atividades];
    novasAtividades[indiceAtividade].epi.push("Calçado de segurança");
    novasAtividades[indiceAtividade].ca.push("");
    setDados({
      ...dados,
      Atividades: novasAtividades,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const formData = new FormData();
  const handleSave = () => {
    // Configurar os dados do formulário
    formData.append("ativo", dados.ativo);
    formData.append("nome", dados.nome);
    formData.append("sexo", dados.sexo);
    formData.append("cpf", dados.cpf);
    formData.append("nascimento", dados.nascimento);
    formData.append("rg", dados.rg);
    formData.append("cargo", dados.cargo);

    // Adicionar atividades ao FormData
    dados.Atividades.forEach((atividade, index) => {
      formData.append(`Atividades[${index}].atividade`, atividade.atividade);
      atividade.epi.forEach((epi, epiIndex) => {
        formData.append(
          `Atividades[${index}].epi[${epiIndex}]`,
          atividade.epi[epiIndex]
        );
        formData.append(
          `Atividades[${index}].ca[${epiIndex}]`,
          atividade.ca[epiIndex]
        );
      });
    });

    // Adicionar o arquivo ao FormData
    if (selectedFile) {
      formData.append("documento_ocupacional", selectedFile);
    }

    const campos = ["nome", "sexo", "cpf", "nascimento"];
    let campoVazio = null;

    for (let i = 0; i < campos.length; i++) {
      if (!dados[campos[i]]) {
        campoVazio = campos[i];
        break; // Se encontrarmos um campo vazio, podemos parar o loop
      }
    }
    console.log(dados);
    if (campoVazio) {
      // Se campoVazio não for nulo, significa que encontramos um campo vazio
      alert(
        `O campo '${campoVazio}' está vazio. Por favor, preencha este campo.`
      );
    } else {
      // Executar o código se todos os campos estiverem preenchidos
      console.log("Todos os campos estão preenchidos.");
    }

    
    // Enviar os dados do formulário para o servidor usando fetch
    fetch("http://localhost:3001/data/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
      .then((response) => response.json())
      .then(
        (data) => window.location.reload(),
        console.log("Dados enviados com sucesso:", dados)
      )
      .catch((error) => console.error("Erro ao enviar os dados:", error));
  };

  return (
    <div>
      <div className="formToggle">
        <div>Trabalhador está ativo ou inativo?</div>
        <div className="menuToggleContainer">
          <label className="menuSwitch">
            <input
              type="checkbox"
              onChange={(e) => setDados({ ...dados, ativo: e.target.checked })}
              className="menuSwitchInput"
              defaultChecked={dados.ativo} // Defina o estado inicial aqui
            />
            <span
              className="menuSwitchLabel"
              data-on="Ativo"
              data-off="Inativo"
            ></span>
            <span className="menuHandle"></span>
          </label>
        </div>
      </div>

      <div className="formInfo">
        <div className="formBox">
          <label>
            Nome
            <div>
              <input
                type="text"
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              />
            </div>
          </label>
          <label>
            Sexo
            <div className="formSexo">
              <div className="radio-item">
                <input
                  type="radio"
                  name="sexo"
                  value="Masculino"
                  id="masculino"
                  onChange={(e) => setDados({ ...dados, sexo: e.target.value })}
                  defaultChecked={dados.sexo === "Masculino"} // Adicione esta linha
                />
                <label htmlFor="masculino">Masculino</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="sexo"
                  value="Feminino"
                  id="feminino"
                  onChange={(e) => setDados({ ...dados, sexo: e.target.value })}
                  defaultChecked={dados.sexo === "Feminino"} // Adicione esta linha
                />
                <label htmlFor="feminino">Feminino</label>
              </div>
            </div>
          </label>
        </div>
        <div className="formBox">
          <label>
            CPF:
            <InputMask
              mask="999.999.999-99"
              type="text"
              onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
            />
          </label>
          <label>
            Data de Nascimento:
            <InputMask
              mask="99/99/9999"
              type="text"
              onChange={(e) =>
                setDados({ ...dados, nascimento: e.target.value })
              }
            />
          </label>
        </div>
        <div className="formBox">
          <label>
            RG:
            <InputMask
              mask="9.999.999"
              type="text"
              onChange={(e) => setDados({ ...dados, rg: e.target.value })}
            />
          </label>
          <label>
            Cargo
            <div>
              <select
                onChange={(e) => setDados({ ...dados, cargo: e.target.value })}
              >
                <option value="Cargo 1">Cargo 1</option>
                <option value="Cargo 2">Cargo 2</option>
                <option value="Cargo 3">Cargo 3</option>
              </select>
            </div>
          </label>
        </div>
      </div>

      <div>
        <div className="boxEpi">
          <div className="boxTitle">
            Quais EPIs o trabalhador usa na atividade?
          </div>
          <div className="epiCheck">
            <input
              type="checkbox"
              id={`checkEPI`}
              onChange={handleUsaEPIChange}
              checked={dados.naoUsaEPI}
            />
            <label htmlFor={`checkEPI`}>O trabalhador não usa EPI.</label>
          </div>
          {!dados.naoUsaEPI ? (
            <>
              {dados.Atividades.map((atividade, indiceAtividade) => (
                <div key={indiceAtividade}>
                  <div className="boxEpi">
                    <div>
                      <label>
                        Selecione a atividade:
                        <select
                          value={atividade.atividade}
                          onChange={(e) => {
                            const novasAtividades = [...dados.Atividades];
                            novasAtividades[indiceAtividade].atividade =
                              e.target.value;
                            setDados({
                              ...dados,
                              Atividades: novasAtividades,
                            });
                          }}
                        >
                          <option>Ativid. 1</option>
                          <option>Ativid. 2</option>
                        </select>
                      </label>
                    </div>
                    <div className="epiActiveControl">
                      <div>
                        {atividade.epi.map((epi, indiceEpi) => (
                          <div className="epiActive" key={indiceEpi}>
                            <label>
                              Selecione o EPI:
                              <select
                                type="text"
                                placeholder="EPI"
                                value={epi}
                                onChange={(e) => {
                                  const novasAtividades = [...dados.Atividades];
                                  novasAtividades[indiceAtividade].epi[
                                    indiceEpi
                                  ] = e.target.value;
                                  setDados({
                                    ...dados,
                                    Atividades: novasAtividades,
                                  });
                                }}
                              >
                                <option>Calçado de segurança</option>
                                <option>Capacete de segurança</option>
                              </select>
                            </label>

                            <label>
                              Informe o número do CA:
                              <input
                                type="text"
                                placeholder="CA"
                                value={atividade.ca[indiceEpi]}
                                onChange={(e) => {
                                  const novasAtividades = [...dados.Atividades];
                                  novasAtividades[indiceAtividade].ca[
                                    indiceEpi
                                  ] = e.target.value;
                                  setDados({
                                    ...dados,
                                    Atividades: novasAtividades,
                                  });
                                }}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                      <div
                        className="addEpi"
                        onClick={() => adicionarEpiCa(indiceAtividade)}
                      >
                        Adicionar EPI
                      </div>
                    </div>
                  </div>
                  <div>
                    <button onClick={adicionarAtividade}>
                      Adicionar outra atividade
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>

      <div className="boxEpi">
        <div className="boxTitle">
          Atestado de Saúde Ocupacional (opcional):
        </div>
        {selectedFile && (
          <div className="viewNameFile">
            {selectedFile.name}{" "}
            {/* Usar selectedFile.name para exibir o nome */}
          </div>
        )}
        <div className="fileBox">
          <label className="fileLabel">
            Selecionar arquivo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileChange(e); // Chame a função para atualizar selectedFile
                setDados({
                  ...dados,
                  documento_ocupacional: e.target.value, // Atualize documento_ocupacional
                });
              }}
            />
          </label>
        </div>
      </div>

      <button className="save" onClick={handleSave}>
        Salvar
      </button>
    </div>
  );
}

export default Formulario;
