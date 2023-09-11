// Importando bibliotecas
import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom"; // Importando o Link e Outlet

// Arquivos CSS
import "./Employee.css"; // Importando CSS principal
import "./Global.css"; // CSS Variavels Global
import userImage from "./user.png"; // Caminho para a imagem
import Form from "./Formulario.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faEllipsis,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

// Componente que mostra os detalhes de um usuário
const UserDetail = ({ user }) => (
  <div className="menuActionUsers" key={user.id}>
    <div className="menuActionUsersInfo">
      <div className="menuActionUserName">{user.name}</div>
      <div className="menuActionUserInfo">
        <div className="menuActionUserItems">{user.cpf}</div>
        <div className="menuActionUserItems">
          {user.isActive ? "Ativo" : "Inativo"}
        </div>
        <div className="menuActionUserItems">{user.cargo}</div>
      </div>
    </div>
    <div className="menuActionBar">
      <FontAwesomeIcon icon={faEllipsis} />
    </div>
  </div>
);

const Employee = () => {
  // Armazenar os dados
  const [data, setData] = useState([]);
  
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [inputValue, setInputValue] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [showItem2Title, setShowItem2Title] = useState(false);

  const handleButtonClick = () => {
    if (highlightedIndex === 0) {
      setShowItem2Title(true);
    }
    setHighlightedIndex((prevIndex) => prevIndex + 1);
  };

  // Efeito para carregar os dados
  useEffect(() => {
    fetch("http://localhost:3001/data/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0]);
        data == "" || setData(data);
      })
      .catch((error) => console.error("Erro ao obter os dados:", error));
  }, []);

  console.log(data);

  // Filtrando os usuários ativos
  const usuariosAtivos = data.filter((item) => item.ativo === "Ativo");
  const quantidadeUsuariosAtivos = usuariosAtivos.length;
  const quantidadeTotalUsuarios = data.length;
  const usuariosFiltrados = showActiveUsers ? usuariosAtivos : data;

  // Clique para adicionar funcionário
  const handleAddEmployeeClick = () => {
    setIsAddingEmployee(!isAddingEmployee);
  };

  // Renderização do componente
  return (
    <>
      <div className="view">
        <div className="menuBar">
          {/* Criando links de menu */}
          {Array.from({ length: 9 }, (_, index2) => (
            <div
              key={index2}
              className="mainControl"
              onClick={() => setHighlightedIndex(index2)}
            >
              <div
                className={`mainButton ${
                  index2 === highlightedIndex ? "highlighted" : ""
                }`}
              >
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div>
                {index2 === 0 && inputValue ? (
                  <span>
                    ITEM 1 <div>CONCLUIDO</div>
                  </span>
                ) : (
                  `Item ${index2 + 1}`
                )}
              </div>
            </div>
          ))}

          {/* Separador da barra de menu */}
          <span className="menuBorder"></span>
        </div>

        <div className="menuMain">
          {!showItem2Title ? (
            <>
              <div className="menuInfo">
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                  suscipit suscipit porttitor. Suspendisse ex lorem, rhoncus nec
                  ante eu, venenatis aliquam turpis. Nulla facilisi. Curabitur
                  nec mattis dolor. Nulla finibus bibendum ligula tempus
                  vehicula. Ut at tristique libero, nec efficitur dui. Aliquam
                  erat volutpat. Fusce quam sem, tempus nec justo eget, luctus
                  scelerisque velit. Nam sollicitudin purus urna, vitae ornare
                  neque tincidunt vel. Proin ac lacinia erat, et commodo felis.
                  Phasellus tempor tellus eu vulputate tempus.
                </div>
              </div>
              <div className="menuAction">
                <div
                  className="menuActionTitle"
                  onClick={isAddingEmployee ? handleAddEmployeeClick : null}
                >
                  {isAddingEmployee ? (
                    <div>
                      <FontAwesomeIcon icon={faArrowLeft} /> Adicionar
                      Funcionário
                    </div>
                  ) : (
                    "Funcionário(s)"
                  )}
                </div>

                <div className="meuActionBox">
                  {!isAddingEmployee && (
                    <div>
                      {/* Botões e informações sobre funcionários */}
                      <div
                        className="menuActionButtonAdd"
                        onClick={handleAddEmployeeClick}
                      >
                        + Adicionar Funcionário
                      </div>
                      <div className="menuActionButtonAction">
                        <div className="menuActionButtonFilter">
                          {/* Botões para filtrar usuários */}
                          <div onClick={() => setShowActiveUsers(true)}>
                            Ver apenas ativos
                          </div>
                          <div onClick={() => setShowActiveUsers(false)}>
                            Limpar Filtros
                          </div>
                        </div>
                        {/* Contagem de funcionários ativos */}
                        <div>
                          Ativos {quantidadeUsuariosAtivos}/
                          {quantidadeTotalUsuarios}
                        </div>
                      </div>

                      {/* Lista de detalhes dos usuários */}
                      <div className="menuActionMain">
                        {usuariosFiltrados.map((user) => (
                          <UserDetail key={user.id} user={user} />
                        ))}
                      </div>
                      <div className="menuActionCheck">
                        {/* Checkbox para marcar etapa concluída */}
                        <div>A etapa está concluída?</div>
                        <div>
                          <div className="menuToggleContainer">
                            <label className="menuSwitch2">
                              <input
                                type="checkbox"
                                className="menuSwitchInput"
                                checked={inputValue}
                                onChange={(e) =>
                                  setInputValue(e.target.checked)
                                }
                              />
                              <span
                                className="menuSwitchLabel"
                                data-on="Sim"
                                data-off="Não"
                              ></span>
                              <span className="menuHandle"></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAddingEmployee && <Form />}
                </div>
              </div>

              <img
                src={userImage}
                className="userShadown"
                alt="Imagem do Usuário"
              />
            </>
          ) : (
            <h1>Item 2</h1>
          )}
        </div>
        {!isAddingEmployee && (
          <div className="next">
            <button className="nextButton" onClick={handleButtonClick}>
              Próximo passo
            </button>
          </div>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Employee;
