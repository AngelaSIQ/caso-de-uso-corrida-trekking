
import { Checkpoint } from "../classes/checkpoint.js";
import {
    criarItemCheckpoint,
    criarOpcaoCorrida,
    criarOpcaoSelecioneCorrida
} from "./componentes.js";

import {
    corridas,
    checkpoints,
    salvarCheckpoints,
    excluirCheckpoint
} from "../dados/armazenamento.js";

const formulario = document.getElementById("form-checkpoint");
const campoNome = document.getElementById("nome");
const campoLocalizacao = document.getElementById("local");
const campoCorrida = document.getElementById("corridaId");
const lista = document.getElementById("lista-checkpoints");
const mensagem = document.getElementById("mensagem");
const avisoCorridas = document.getElementById("aviso-corridas");
const botaoCancelar = document.getElementById("cancelar");

let idEditando = null;

function avisar(texto) {
    mensagem.textContent = texto;
}

function preencherCorridas() {
    campoCorrida.replaceChildren(criarOpcaoSelecioneCorrida());
    avisoCorridas.hidden = corridas.length > 0;

    corridas.forEach(corrida => {
        campoCorrida.appendChild(criarOpcaoCorrida(corrida));
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
        lista.appendChild(criarItemCheckpoint(checkpoint, {
            aoEditar: () => {
                campoNome.value = checkpoint.nome;
                campoLocalizacao.value = checkpoint.localizacao;
                campoCorrida.value = checkpoint.corrida.id;
                idEditando = checkpoint.id;

                formulario.querySelector('[type="submit"]').textContent =
                    "Salvar alterações";

                campoNome.focus();
            },
            aoExcluir: () => {
                if (!confirm(`Excluir o checkpoint "${checkpoint.nome}"?`)) {
                    return;
                }

                const resultado = excluirCheckpoint(checkpoint.id);
                avisar(resultado.mensagem);
                renderizar();
            }
        }));
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
