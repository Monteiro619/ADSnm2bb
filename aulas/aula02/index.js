const root = document.getElementById("root");

/* componentes */
function Cabecalho() {
    const header = document.createElement("header");
    return header;
}

function Conteudo() {
    const main = document.createElement("main");
    return main;
}

function Rodape(texto) {
    const footer = document.createElement("footer");
    footer.innerHTML = `<p>${texto}</p>`;
    return footer;
}

function Imagem(origem, texto) {
    const img = document.createElement("img");
    img.setAttribute("src", origem);
    img.setAttribute("alt", texto);
    return img;
}

function Titulo(texto) {
    const h1 = document.createElement("h1");
    h1.innerText = texto;
    return h1;
}

function Input(id, tipo, rotulo) {
   const label = document.createElement("label");
   label.innerText = rotulo;
   label.setAttribute("for", id);
   const input = document.createElement("input");
   input.setAttribute("id", id);
   input.setAttribute("name", id);
   input.setAttribute("type", tipo);
   const grupo = document.createElement("div");
   grupo.append(label, input);
   return grupo;
}

function Botao(texto) {
    const button = document.createElement("input");
    button.setAttribute("type", "submit");
    button.setAttribute("value", texto);
    return button;
}

function Link(texto, rota) {
   const a = document.createElement("a");
   a.setAttribute("href", rota);
   a.innerText = texto;
   return a;
}

function Menu() {
    const opcoes = [
       {menu: "Home", rota: "/home"},
       {menu: "Perfil", rota: "/perfil"},
       {menu: "Sair", rota: "/login"}
    ];

    const lista = document.createElement("ul");
    opcoes.forEach((opcao) => { 
        const link = Link(opcao.menu, opcao.rota);
        link.addEventListener("click", (event) => {
            event.preventDefault();
            navega(event.target.getAttribute("href"));
        });
        const item = document.createElement("li");
        item.append(link);
        lista.append(item);        
    })
    const nav = document.createElement("nav");
    nav.append(lista);
    return nav;
    
}

/* ferramentas */
function navega(rota) {
   root.innerHTML = "";
   if (rota === "/login") {
    PageLogin();
   } else if (rota === "/home") {
    PageHome();
   } else if (rota === "/perfil") {
    PagePerfil();
   } else {
    root.innerHTML = "<p>Deu ruim</p>";
   }
}

/* paginas */
function FormLogin() {
    const email = Input("email", "email", "E-mail");
    const senha = Input("senha", "password", "Senha");
    const entrar = Botao("Entrar");
    entrar.addEventListener("click", (event) => {
        alert("Clicou!");
    })
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/login");
    form.append(email, senha, entrar);
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // chamar o backend
        navega("/home");
    })
    return form;
}

function PageLogin() {
    const logo = Imagem("https://www.svgrepo.com/show/520490/student.svg", "Logo da Aplicação");
    const titulo = Titulo("Aluno Online");
    const form = FormLogin();
    const link = Link("Esqueceu a Senha?", "/esqueceu-senha");
    const conteudo = Conteudo();
    conteudo.append(logo, titulo, form, link);
    const rodape = Rodape("Copyright (C) 2024");
    root.append(conteudo, rodape);
}

function PageHome() {
    const cabecalho = Cabecalho();
    const menu = Menu();
    const conteudo = Conteudo();
    conteudo.append(menu);
    root.append(cabecalho, conteudo);
}

function PagePerfil() {
    const cabecalho = Cabecalho();
    const menu = Menu();
    const conteudo = Conteudo();
    conteudo.append(menu);
    root.append(cabecalho, conteudo);
}


navega("/login");