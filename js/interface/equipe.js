import { EquipeDesclassificada } from "../classes/equipedesclassificada.js";
import { listarEquipes } from "../dados/equipe.js";

const tabela = document.getElementById("lista-equipes");
const pesquisa = document.getElementById("pesquisa");

const equipes = listarEquipes();

function mostrarEquipes(lista) {
    tabela.replaceChildren();

    let posicao = 1;

    lista.forEach(equipe => {
        tabela.appendChild(equipe.render(posicao));

        if (!(equipe instanceof EquipeDesclassificada)) {
            posicao++;
        }
    });
}

pesquisa.addEventListener("input", () => {
    const termo = pesquisa.value.trim().toLowerCase();

    const resultado = equipes.filter(equipe =>
        equipe.getNome().toLowerCase().includes(termo)
    );

    mostrarEquipes(resultado);
});

mostrarEquipes(equipes);
