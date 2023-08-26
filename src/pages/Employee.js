// Importando bibliotecas
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom'; // Importando o Link e Outlet

// Arquivos CSS
import './Employee.css'; // Importando CSS principal
import './Global.css'; // CSS Variavels Global
import userImage from './user.png'; // Caminho para a imagem

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faEllipsis, faArrowLeft } from '@fortawesome/free-solid-svg-icons';




// Componente que mostra os detalhes de um usuário
const UserDetail = ({ user }) => (
    <div className='menuActionUsers' key={user.id}>
        <div className='menuActionUsersInfo'>
            <div className='menuActionUserName'>{user.nome}</div>
            <div className='menuActionUserInfo'>
                <div className='menuActionUserItems'>{user.cpf}</div>
                <div className='menuActionUserItems'>{user.status}</div>
                <div className='menuActionUserItems'>{user.cargo}</div>
            </div>
        </div>
        <div className='menuActionBar'>
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
        setHighlightedIndex(prevIndex => prevIndex + 1);
    };


    // Efeito para carregar os dados
    useEffect(() => {
        fetch('http://localhost:3001/data/')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Erro ao obter os dados:', error));
    }, []);

    // Filtrando os usuários ativos
    const usuariosAtivos = data.filter(item => item.status === 'Ativo');
    const quantidadeUsuariosAtivos = usuariosAtivos.length;
    const quantidadeTotalUsuarios = data.length;
    const usuariosFiltrados = showActiveUsers ? usuariosAtivos : data;

    // Clique para adicionar funcionário
    const handleAddEmployeeClick = () => {
        setIsAddingEmployee(!isAddingEmployee);
        setFormData(initialFormState); // Limpa o formulário ao alternar para a tela de adição
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    // Estado inicial para atividade e formulário
    const initialActivity = { atividade: 'Ativid. 1', epi: 'Calçado de segurança', ca: '' };
    const initialFormState = {
        nome: '',
        status: 'Inativo',
        sexo: 'Masculino',
        cpf: '',
        nascimento: '',
        rg: '',
        cargo: 'Cargo 1',
        atividades: [initialActivity],
        documento_ocupacional: null
    };

    const [formData, setFormData] = useState(initialFormState);

    // Lidando com a mudança de campos de entrada
    const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });

    // Lidando com a mudança de atividades
    const handleActivityChange = (index, field, value) => {
        const updatedActivities = [...formData.atividades];
        updatedActivities[index][field] = value;
        setFormData({ ...formData, atividades: updatedActivities });
    };

    // Lidando com a adição de uma nova atividade
    const handleAddActivity = () => setFormData({ ...formData, atividades: [...formData.atividades, initialActivity] });


    // Lidando com o salvamento dos dados
    const handleSave = () => {
        // Montando os dados para enviar

        if (
            formData.nome.trim() === '' ||
            formData.sexo.trim() === '' ||
            formData.cpf.trim() === '' ||
            formData.nascimento.trim() === '' ||
            formData.rg.trim() === '' ||
            // ... outros campos obrigatórios ...

            formData.atividades.some((activity) =>
                activity.naoUsaEPI ? false : activity.ca.trim() === ''
            )
        ) {

            console.log(formData.nome.trim(), formData.sexo.trim(), formData.cpf.trim(), formData.nascimento.trim(), formData.rg.trim())
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const dataToSend = {
            id: quantidadeTotalUsuarios + 1,
            nome: formData.nome,
            status: formData.status,
            sexo: formData.sexo,
            cpf: formData.cpf,
            nascimento: formData.nascimento,
            cadastro: new Date().toISOString(), // Data de cadastro atual
            rg: formData.rg,
            cargo: formData.cargo,
            EPI: formData.atividades.map(activity => ({
                atividade: activity.atividade,
                epi: activity.epi,
                CA: activity.ca,
                naoUsaEPI: activity.naoUsaEPI
            })),
            documento_ocupacional: formData.documento_ocupacional ? formData.documento_ocupacional.name : null,
        };

        // Enviando os dados
        fetch('http://localhost:3001/data/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        })
            .then(response => response.json())
            .then(data => window.location.reload(), console.log('Dados enviados com sucesso:', data))
            .catch(error => console.error('Erro ao enviar os dados:', error));
    };

    // Renderização do componente
    return (
        <>
            <div className='view'>

                <div className="menuBar">
                    {/* Criando links de menu */}
                    {Array.from({ length: 9 }, (_, index) => (
                        <div
                            key={index}
                            className='mainControl'
                            onClick={() => setHighlightedIndex(index)}
                        >
                            <div className={`mainButton ${index === highlightedIndex ? 'highlighted' : ''}`}>
                                <FontAwesomeIcon icon={faBuilding} />
                            </div>
                            <div>
                                {index === 0 && inputValue ? (
                                    <span>ITEM 1 <div>CONCLUIDO</div></span>
                                ) : (
                                    `Item ${index + 1}`
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Separador da barra de menu */}
                    <span className='menuBorder'></span>
                </div>

                <div className='menuMain'>
                    {!showItem2Title ? (
                        <>
                            <div className='menuInfo'>

                                <div>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In suscipit suscipit porttitor. Suspendisse ex lorem, rhoncus nec ante eu, venenatis aliquam turpis. Nulla facilisi. Curabitur nec mattis dolor. Nulla finibus bibendum ligula tempus vehicula. Ut at tristique libero, nec efficitur dui. Aliquam erat volutpat. Fusce quam sem, tempus nec justo eget, luctus scelerisque velit. Nam sollicitudin purus urna, vitae ornare neque tincidunt vel. Proin ac lacinia erat, et commodo felis. Phasellus tempor tellus eu vulputate tempus.
                                </div>
                            </div>
                            <div className='menuAction'>

                                <div className='menuActionTitle' onClick={isAddingEmployee ? handleAddEmployeeClick : null}>
                                    {isAddingEmployee ? (
                                        <div>
                                            <FontAwesomeIcon icon={faArrowLeft} /> Adicionar Funcionário
                                        </div>
                                    ) : (
                                        "Funcionário(s)"
                                    )}
                                </div>

                                <div className='meuActionBox'>

                                    {!isAddingEmployee && (
                                        <div>
                                            {/* Botões e informações sobre funcionários */}
                                            <div className='menuActionButtonAdd' onClick={handleAddEmployeeClick}>
                                                + Adicionar Funcionário
                                            </div>
                                            <div className='menuActionButtonAction'>
                                                <div className='menuActionButtonFilter'>
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
                                                    Ativos {quantidadeUsuariosAtivos}/{quantidadeTotalUsuarios}
                                                </div>
                                            </div>

                                            {/* Lista de detalhes dos usuários */}
                                            <div className='menuActionMain'>
                                                {usuariosFiltrados.map((user) => (
                                                    <UserDetail key={user.id} user={user} />  /* Adiciona chave prop */
                                                ))}
                                            </div>
                                            <div className='menuActionCheck'>
                                                {/* Checkbox para marcar etapa concluída */}
                                                <div>
                                                    A etapa está concluída?
                                                </div>
                                                <div>
                                                    <div className="menuToggleContainer">
                                                        <label className="menuSwitch2">
                                                            <input
                                                                type="checkbox"
                                                                className="menuSwitchInput"
                                                                checked={inputValue}
                                                                onChange={(e) => setInputValue(e.target.checked)}
                                                            />
                                                            <span className="menuSwitchLabel" data-on="Sim" data-off="Não"></span>
                                                            <span className="menuHandle"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isAddingEmployee && (
                                        <div>
                                            <div className='formToggle'>
                                                <div>
                                                    Trabalhador está ativo ou inativo?
                                                </div>
                                                <div className="menuToggleContainer">
                                                    <label className="menuSwitch">

                                                        <input
                                                            type="checkbox"
                                                            checked={formData.status === 'Ativo'}
                                                            onChange={() =>
                                                                handleInputChange('status', formData.status === 'Ativo' ? 'Inativo' : 'Ativo')
                                                            }
                                                            className="menuSwitchInput"
                                                        />
                                                        <span className="menuSwitchLabel" data-on="Ativo" data-off="Inativo">
                                                        </span>
                                                        <span className="menuHandle"></span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='formInfo'>
                                                <div className='formBox'>

                                                    <label>
                                                        Nome
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={formData.nome}
                                                                onChange={(e) => handleInputChange('nome', e.target.value)}
                                                            />
                                                        </div>
                                                    </label>
                                                    <label>
                                                        Sexo
                                                        <div className='formSexo'>

                                                            <div className='radio-item'>
                                                                <input
                                                                    type="radio"
                                                                    name="sexo"
                                                                    value="Masculino"
                                                                    id='masculino'
                                                                    checked={formData.sexo === 'Masculino'}
                                                                    onChange={(e) => handleInputChange('sexo', e.target.value)}
                                                                />
                                                                <label htmlFor="masculino">Masculino</label>

                                                            </div>
                                                            <div className='radio-item'>
                                                                <input
                                                                    type="radio"
                                                                    name="sexo"
                                                                    value="Feminino"
                                                                    id='feminino'
                                                                    checked={formData.sexo === 'Feminino'}
                                                                    onChange={(e) => handleInputChange('sexo', e.target.value)}
                                                                />
                                                                <label htmlFor="feminino">Feminino</label>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                                <div className='formBox'>
                                                    <label>
                                                        CPF:
                                                        <input
                                                            type="text"
                                                            value={formData.cpf}
                                                            onChange={(e) => handleInputChange('cpf', e.target.value)}
                                                        />
                                                    </label>
                                                    <label>
                                                        Data de Nascimento:
                                                        <input
                                                            type="text"
                                                            value={formData.nascimento}
                                                            onChange={(e) => handleInputChange('nascimento', e.target.value)}
                                                        />
                                                    </label>
                                                </div>
                                                <div className='formBox'>
                                                    <label>
                                                        RG:
                                                        <input
                                                            type="text"
                                                            value={formData.rg}
                                                            onChange={(e) => handleInputChange('rg', e.target.value)}
                                                        />
                                                    </label>
                                                    <label>
                                                        Cargo
                                                        <div>

                                                            <select
                                                                value={formData.cargo}
                                                                onChange={(e) => handleInputChange('cargo', e.target.value)}
                                                            >
                                                                <option value="Cargo 1">Cargo 1</option>
                                                                <option value="Cargo 2">Cargo 2</option>
                                                                <option value="Cargo 3">Cargo 3</option>

                                                            </select>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            {formData.atividades.map((activity, index) => (
                                                <div key={index}>
                                                    <div className='boxEpi'>
                                                        <div className='boxTitle'>Quais EPIs o trabalhador usa na atividade?</div>
                                                        <div className='epiCheck'>
                                                            <input
                                                                type="checkbox"
                                                                id={`checkEPI`}
                                                                checked={activity.naoUsaEPI}
                                                                onChange={() => handleActivityChange(index, 'naoUsaEPI', !activity.naoUsaEPI)}
                                                            />
                                                            <label htmlFor={`checkEPI`}>O trabalhador não usa EPI.</label>
                                                        </div>
                                                        {!activity.naoUsaEPI && (
                                                            <>
                                                                <div className='boxEpi'>
                                                                    <div>
                                                                        <label>
                                                                            Selecione a atividade:
                                                                            <select
                                                                                value={activity.atividade || ''}
                                                                                onChange={(e) => handleActivityChange(index, 'atividade', e.target.value)}
                                                                            >

                                                                                <option>
                                                                                    Ativid. 1
                                                                                </option>
                                                                                <option>
                                                                                    Ativid. 2
                                                                                </option>
                                                                            </select>
                                                                        </label>
                                                                    </div>
                                                                    <div className='epiActive'>
                                                                        <label>
                                                                            Selecione o EPI:
                                                                            <select
                                                                                value={activity.epi || ''}
                                                                                onChange={(e) => handleActivityChange(index, 'epi', e.target.value)}
                                                                            >

                                                                                <option>
                                                                                    Calçado de segurança
                                                                                </option>
                                                                            </select>

                                                                        </label>

                                                                        <label>
                                                                            Informe o número do CA:
                                                                            <input
                                                                                type="text"
                                                                                value={activity.ca || ''}
                                                                                onChange={(e) => handleActivityChange(index, 'ca', e.target.value)}
                                                                            />
                                                                        </label>

                                                                        <div className='addEpi'>Adicionar EPI</div>
                                                                    </div>
                                                                </div>
                                                                <div>

                                                                    <button onClick={handleAddActivity}>Adicionar outra atividade</button>
                                                                </div>

                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <div class="boxEpi">
                                                <div className='boxTitle'>
                                                    Atestado de Saúde Ocupacional (opcional):
                                                </div>
                                                {selectedFile && (
                                                    <div className='viewNameFile'>
                                                        {selectedFile && selectedFile.name}
                                                    </div>
                                                )}
                                                <div className='fileBox'>
                                                    <label className='fileLabel'>
                                                        Selecionar arquivo
                                                        <input
                                                            type='file'
                                                            accept='image/*'
                                                            onChange={(e) => {
                                                                handleFileChange(e);
                                                                handleInputChange('documento_ocupacional', e.target.value);
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>


                                            <button className='save' onClick={handleSave}>Salvar</button>
                                        </div>
                                    )}

                                </div>
                            </div>

                            <img src={userImage} className='userShadown' alt="Imagem do Usuário" />
                        </>
                    ) : (
                        <h1>Item 2</h1>
                    )}
                </div>
                {!isAddingEmployee && (
                    <div className='next'>
                        <button className='nextButton' onClick={handleButtonClick}>Próximo passo</button>
                    </div>
                )}
            </div>
            <Outlet />
        </>
    )
};

export default Employee;