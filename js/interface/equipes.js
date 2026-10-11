
import { Equipe } from "/classes/equipe.js";

import {
    corridas,
    equipes,
    salvarEquipes,
    excluirEquipe
} from "../dados/armazenamento.js";

const formulario = document.getElementById("form-equipe");
const campoNome = document.getElementById("nome");
const campoIntegrantes = document.getElementById("integrantes");
const campoCorrida = document.getElementById("corrida");
const lista = document.getElementById("lista-equipes");
const mensagem = document.getElementById("mensagem");
const botaoCancelar = document.getElementById("cancelar");

let idEditando = null;

function avisar(texto) {
    mensagem.textContent = texto;
}

function preencherCorridas() {
    campoCorrida.replaceChildren();

    const inicial = document.createElement("option");
    inicial.value = "";
    inicial.textContent = "Selecione uma corrida";
    campoCorrida.appendChild(inicial);

    corridas.forEach(corrida => {
        const opcao = document.createElement("option");
        opcao.value = corrida.id;
        opcao.textContent = corrida.nome;
        campoCorrida.appendChild(opcao);
    });
}

function limparFormulario() {
    formulario.reset();
    idEditando = null;

    formulario.querySelector('[type="submit"]').textContent =
        "Cadastrar equipe";
}

function renderizar() {
    lista.replaceChildren();

    equipes.forEach(equipe => {
        const item = document.createElement("li");
        const descricao = document.createElement("span");

        descricao.textContent =
            `${equipe.nome} — ${equipe.integrantes} — Corrida: ${equipe.corrida.nome} `;

        const editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";

        editar.addEventListener("click", () => {
            campoNome.value = equipe.nome;
            campoIntegrantes.value = equipe.integrantes;
            campoCorrida.value = equipe.corrida.id;
            idEditando = equipe.id;

            formulario.querySelector('[type="submit"]').textContent =
                "Salvar alterações";

            campoNome.focus();
        });

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", () => {
            if (!confirm(`Excluir a equipe "${equipe.nome}"?`)) {
                return;
            }

            const resultado = excluirEquipe(equipe.id);
            avisar(resultado.mensagem);
            renderizar();
        });

        item.append(descricao, editar, excluir);
        lista.appendChild(item);
    });
}

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    try {
        const corrida = corridas.find(
            c => c.id === Number(campoCorrida.value)
        );

        if (!corrida) {
            throw new Error("Cadastre e selecione uma corrida primeiro.");
        }

        if (idEditando === null) {
            equipes.push(
                new Equipe(
                    campoNome.value,
                    campoIntegrantes.value,
                    corrida
                )
            );
        } else {
            const equipe = equipes.find(e => e.id === idEditando);

            if (!equipe) {
                throw new Error("Equipe não encontrada.");
            }

            equipe.nome = campoNome.value;
            equipe.integrantes = campoIntegrantes.value;
            equipe.corrida = corrida;
        }

        salvarEquipes();
        limparFormulario();
        renderizar();
        avisar("Equipe salva com sucesso.");
    } catch (erro) {
        avisar(erro.message);
    }
});

botaoCancelar.addEventListener("click", limparFormulario);

preencherCorridas();
renderizar();
