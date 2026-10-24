
import { Equipe } from "../classes/equipe.js";
import {
    criarItemEquipe,
    criarOpcaoCorrida,
    criarOpcaoSelecioneCorrida
} from "./componentes.js";

import {
    corridas,
    equipes,
    salvarEquipes,
    excluirEquipe
} from "../dados/armazenamento.js";

const formulario = document.getElementById("form-equipe");
const campoNome = document.getElementById("nome");
const campoIntegrantes = document.getElementById("integrantes");
const campoCorrida = document.getElementById("corridaId");
const lista = document.getElementById("lista-equipes");
const mensagem = document.getElementById("mensagem");
const botaoCancelar = document.getElementById("cancelar");

let idEditando = null;

function avisar(texto) {
    mensagem.textContent = texto;
}

function preencherCorridas() {
    campoCorrida.replaceChildren(criarOpcaoSelecioneCorrida());

    corridas.forEach(corrida => {
        campoCorrida.appendChild(criarOpcaoCorrida(corrida));
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
        lista.appendChild(criarItemEquipe(equipe, {
            aoEditar: () => {
                campoNome.value = equipe.nome;
                campoIntegrantes.value = equipe.integrantes;
                campoCorrida.value = equipe.corrida.id;
                idEditando = equipe.id;

                formulario.querySelector('[type="submit"]').textContent =
                    "Salvar alterações";

                campoNome.focus();
            },
            aoExcluir: () => {
                if (!confirm(`Excluir a equipe "${equipe.nome}"?`)) {
                    return;
                }

                const resultado = excluirEquipe(equipe.id);
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
