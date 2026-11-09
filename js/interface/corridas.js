import {
    criarEstadoVazio,
    criarItemCorrida
} from "./componentes.js";

import {
    corridas,
    carregarDados,
    salvarCorrida,
    excluirCorrida
} from "../dados/armazenamento.js";

const formulario = document.getElementById("form-corrida");
const campoNome = document.getElementById("nome");
const campoData = document.getElementById("data");
const lista = document.getElementById("lista-corridas");
const mensagem = document.getElementById("mensagem");
const botaoCancelar = document.getElementById("cancelar");

let idEditando = null;

function avisar(texto) {
    mensagem.textContent = texto;
}

function limparFormulario() {
    formulario.reset();
    idEditando = null;

    formulario.querySelector('[type="submit"]').textContent =
        "Salvar corrida";
}

function renderizar() {
    lista.replaceChildren();

    if (corridas.length === 0) {
        lista.appendChild(criarEstadoVazio("Nenhuma corrida cadastrada."));
        return;
    }

    corridas.forEach(corrida => {
        lista.appendChild(criarItemCorrida(corrida, {
            aoEditar: () => {
                campoNome.value = corrida.nome;
                campoData.value = corrida.data ?? "";
                idEditando = corrida.id;

                formulario.querySelector('[type="submit"]').textContent =
                    "Salvar alterações";

                campoNome.focus();
            },
            aoExcluir: async () => {
                if (!confirm(`Deseja excluir a corrida "${corrida.nome}"?`)) {
                    return;
                }

                try {
                    const resultado = await excluirCorrida(corrida.id);
                    avisar(resultado.mensagem);
                    renderizar();
                } catch (erro) {
                    avisar("Erro ao excluir a corrida: " + erro.message);
                }
            }
        }));
    });
}

formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const data = campoData.value;

    if (!nome || !data) {
        avisar("Preencha o nome e a data da corrida.");
        return;
    }

    try {
        await salvarCorrida(idEditando, nome, data);
        limparFormulario();
        renderizar();
        avisar("Corrida salva com sucesso!");
    } catch (erro) {
        console.error(erro);
        avisar("Erro ao salvar a corrida: " + erro.message);
    }
});

botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    avisar("");
});

try {
    await carregarDados();
    renderizar();
} catch (erro) {
    console.error(erro);
    avisar("Não foi possível carregar as corridas. Verifique se a API está em execução.");
}