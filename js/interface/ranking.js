import { criarLinhaRankingEquipe } from "./componentes.js";
import {
    corridas,
    equipes,
    passagens,
    carregarDados
} from "../dados/armazenamento.js";

const tabela = document.getElementById("lista-equipes");
const pesquisa = document.getElementById("pesquisa");

function obterEquipesRanking() {
    return equipes
        .map(equipe => {
            const registros = passagens.filter(
                passagem => String(passagem.equipe.id) === String(equipe.id)
            );

            const ultimaPassagem = registros.reduce((maisRecente, atual) => {
                if (!maisRecente) return atual;
                return Date.parse(atual.dataHora) > Date.parse(maisRecente.dataHora)
                    ? atual
                    : maisRecente;
            }, null);

            return {
                nome: equipe.nome,
                numero: equipe.id,
                checkpoints: registros.length,
                ultimaPassagem: ultimaPassagem
                    ? new Date(ultimaPassagem.dataHora).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                    : "Sem passagem",
                motivoDesclassificacao: null
            };
        })
        .sort((a, b) => b.checkpoints - a.checkpoints || a.nome.localeCompare(b.nome));
}

function renderizarEquipes(listaEquipes) {
    tabela.replaceChildren();
    let posicao = 1;

    for (const equipe of listaEquipes) {
        tabela.appendChild(criarLinhaRankingEquipe({
            ...equipe,
            numero: equipe.numero
        }, posicao));
        if (!equipe.motivoDesclassificacao) {
            posicao += 1;
        }
    }
}

pesquisa.addEventListener("input", () => {
    const texto = pesquisa.value.toLowerCase();
    const resultado = obterEquipesRanking().filter(equipe =>
        equipe.nome.toLowerCase().includes(texto)
    );

    renderizarEquipes(resultado);
});

try {
    await carregarDados();
    renderizarEquipes(obterEquipesRanking());
} catch (erro) {
    console.error(erro);
    tabela.replaceChildren();
    const linha = document.createElement("tr");
    const celula = document.createElement("td");
    celula.colSpan = 5;
    celula.textContent = "Não foi possível carregar o ranking. Verifique se a API está em execução.";
    linha.appendChild(celula);
    tabela.appendChild(linha);
}
