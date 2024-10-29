import axios from 'axios';

const url = import.meta.env.VITE_API_URL;    

function buscarTodos() {
    return axios.get(url).then((response) => {
        return {sucesso: true, dados: response.data };
    }).catch((error) => {
        return {sucesso: false, mensagem: error.mensage };
    });
}

function buscar(id) {
    return axios.get(`${url}/${id}`).then((response) => {
        return {sucesso:true, dados: response.data};
    }).catch((error) => {
        return {sucesso:true, dados: response.data};
    });
}

function adicionar(contato) {
    return axios.post(url, contato)
    .then((response) => {return {sucesso: true, dados: response.data }}) // sucesso, devolver os dados
    .catch((error) => {return {sucesso: false, mensagem: error.mensage }}); // erro
}

function atualizar(contato) {
    return axios.put(`${url}/${id}`, {nome: contato.nome, telefone: contato.telefone,}).then((response) =>{
        return {sucesso: true, mensagem: error.mensage}
    } ).catch((error) => {
        return {sucesso: false, mensagem: error.mensage};
} ) }

function remover(id) {
    return axios
    .delete(`${url}/${id}`) // http://localhost:3000/contatos/id
    .then((response) => {
        return {sucesso: true, dados: response.data };
    })
    .catch((error) => {
        return {sucesso: false, mensagem: error.mensage };
    });
}

export { buscarTodos, buscar, adicionar, atualizar, remover }