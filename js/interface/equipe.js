
import { EquipeDesclassificada } from "../classes/equipedesclassificada.js";

export function mostrarEquipes(lista) {
    const tabela = document.getElementById("lista-equipes");
    tabela.innerHTML = "";

    let posicao = 1;

    for (const equipe of lista) {
        tabela.appendChild(equipe.render(posicao));

        if (!(equipe instanceof EquipeDesclassificada)) {
            posicao++;
        }
    }
}

export function configurarPesquisa(equipes) {
    const pesquisa = document.getElementById("pesquisa");

    pesquisa.addEventListener("input", function () {
        const texto = pesquisa.value.toLowerCase();

        const resultado = equipes.filter(function (equipe) {
            return equipe.getNome().toLowerCase().includes(texto);
        });

        mostrarEquipes(resultado);
    });
}
