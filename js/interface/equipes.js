
import {
    criarItemEquipe,
    criarOpcaoCorrida,
    criarOpcaoSelecioneCorrida
} from "./componentes.js";

import {
    corridas,
    equipes,
    carregarDados,
    salvarEquipe,
    excluirEquipe
} from "../dados/armazenamento.js";

const formulario = document.getElementById("form-equipe");
const campoNome = document.getElementById("nome");
const campoIntegrantes = document.getElementById("integrantes");
const campoCorrida = document.getElementById("corridaId");
const lista = document.getElementById("lista-equipes");
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
            aoExcluir: async () => {
                if (!confirm(`Excluir a equipe "${equipe.nome}"?`)) {
                    return;
                }

                try {
                    const resultado = await excluirEquipe(equipe.id);
                    avisar(resultado.mensagem);
                    renderizar();
                } catch (erro) {
                    avisar("Erro ao excluir a equipe: " + erro.message);
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

        await salvarEquipe(
            idEditando,
            campoNome.value,
            campoIntegrantes.value,
            corrida
        );
        limparFormulario();
        renderizar();
        avisar("Equipe salva com sucesso.");
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
    avisar("Não foi possível carregar as equipes. Verifique se a API está em execução.");
}
