
import {
    criarItemCheckpoint,
    criarOpcaoCorrida,
    criarOpcaoSelecioneCorrida
} from "./componentes.js";

import {
    corridas,
    checkpoints,
    carregarDados,
    salvarCheckpoint,
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
            aoExcluir: async () => {
                if (!confirm(`Excluir o checkpoint "${checkpoint.nome}"?`)) {
                    return;
                }

                try {
                    const resultado = await excluirCheckpoint(checkpoint.id);
                    avisar(resultado.mensagem);
                    renderizar();
                } catch (erro) {
                    avisar("Erro ao excluir o checkpoint: " + erro.message);
                }
            }
        }));
    });
}

formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    try {
        const corrida = corridas.find(
            c => c.id === Number(campoCorrida.value)
        );

        if (!corrida) {
            throw new Error("Cadastre e selecione uma corrida primeiro.");
        }

        await salvarCheckpoint(
            idEditando,
            campoNome.value,
            campoLocalizacao.value,
            corrida
        );
        limparFormulario();
        renderizar();
        avisar("Checkpoint salvo com sucesso.");
    } catch (erro) {
        console.error(erro);
        avisar(erro.message);
    }
});

botaoCancelar.addEventListener("click", limparFormulario);

try {
    await carregarDados();
    preencherCorridas();
    renderizar();
} catch (erro) {
    console.error(erro);
    avisar("Não foi possível carregar os checkpoints. Verifique se a API está em execução.");
}
