import { criarLinhaRankingEquipe } from "./componentes.js";

const equipes = [
    {
        nome: "Trilheiros RN",
        numero: 1,
        checkpoints: 5,
        ultimaPassagem: "14:32"
    },
    {
        nome: "Aventureiros",
        numero: 2,
        checkpoints: 4,
        ultimaPassagem: "14:41"
    },
    {
        nome: "Exploradores",
        numero: 3,
        checkpoints: 3,
        ultimaPassagem: "14:50"
    },
    {
        nome: "Equipe Alpha",
        numero: 4,
        checkpoints: 2,
        ultimaPassagem: "15:02",
        motivoDesclassificacao: "Rota Incorreta"
    }
];

const tabela = document.getElementById("lista-equipes");
const pesquisa = document.getElementById("pesquisa");

function renderizarEquipes(listaEquipes) {
    tabela.replaceChildren();
    let posicao = 1;

    for (const equipe of listaEquipes) {
        tabela.appendChild(criarLinhaRankingEquipe(equipe, posicao));
        if (!equipe.motivoDesclassificacao) {
            posicao += 1;
        }
    }
}

pesquisa.addEventListener("input", () => {
    const texto = pesquisa.value.toLowerCase();
    const resultado = equipes.filter(equipe =>
        equipe.nome.toLowerCase().includes(texto)
    );

    renderizarEquipes(resultado);
});

renderizarEquipes(equipes);