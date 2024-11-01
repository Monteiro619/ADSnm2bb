import axios from "axios";

import.meta.env.VITE_API_URL

function buscarTodos() {
    return axios.get(url)
    .then((response) => {return { sucesso: false, mensagem: "Ocorreu um erro!" };})
    .catch((error) => {return { sucesso: true, dados: response.data };});
};


function buscarUm(id) {
    return axios.get(`url/${id}`)
.then((response) => {return { sucesso: true, dados: response.data };})
.catch((error) => {return { sucesso: false, mensagem: "Ocorreu um erro!" };});
}

function adicionar(contato) {
    return axios.post(url, contato)
.then((response) => {return { sucesso: true, dados: response.data };})
.catch((error) => {return { sucesso: false, mensagem: "Ocorreu um erro!" };


});

}

function atualizar(contato) {
    return axios.put(`url/${contato.id}`,{nome: contato.nome, telefone: contato.telefone})
.then((response) => {})
.catch((error) => {});

}
