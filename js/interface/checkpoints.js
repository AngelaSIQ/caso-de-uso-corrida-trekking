
import { Checkpoint } from "/classes/checkpoint.js";

import {
    corridas,
    checkpoints,
    salvarCheckpoints,
    excluirCheckpoint
} from "../dados/armazenamento.js";

const formulario = document.getElementById("form-checkpoint");
const campoNome = document.getElementById("nome");
const campoLocalizacao = document.getElementById("localizacao");
const campoCorrida = document.getElementById("corrida");
const lista = document.getElementById("lista-checkpoints");
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
        "Cadastrar checkpoint";
}

function renderizar() {
    lista.replaceChildren();

    checkpoints.forEach(checkpoint => {
        const item = document.createElement("li");
        const descricao = document.createElement("span");

        descricao.textContent =
            `${checkpoint.nome} — ${checkpoint.localizacao} — Corrida: ${checkpoint.corrida.nome} `;

        const editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";

        editar.addEventListener("click", () => {
            campoNome.value = checkpoint.nome;
            campoLocalizacao.value = checkpoint.localizacao;
            campoCorrida.value = checkpoint.corrida.id;
            idEditando = checkpoint.id;

            formulario.querySelector('[type="submit"]').textContent =
                "Salvar alterações";

            campoNome.focus();
        });

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", () => {
            if (!confirm(`Excluir o checkpoint "${checkpoint.nome}"?`)) {
                return;
            }

            const resultado = excluirCheckpoint(checkpoint.id);
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
            checkpoints.push(
                new Checkpoint(
                    campoNome.value,
                    campoLocalizacao.value,
                    corrida
                )
            );
        } else {
            const checkpoint = checkpoints.find(
                c => c.id === idEditando
            );

            if (!checkpoint) {
                throw new Error("Checkpoint não encontrado.");
            }

            checkpoint.nome = campoNome.value;
            checkpoint.localizacao = campoLocalizacao.value;
            checkpoint.corrida = corrida;
        }

        salvarCheckpoints();
        limparFormulario();
        renderizar();
        avisar("Checkpoint salvo com sucesso.");
    } catch (erro) {
        avisar(erro.message);
    }
});

botaoCancelar.addEventListener("click", limparFormulario);

preencherCorridas();
renderizar();
