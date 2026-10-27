import {
    corridas,
    equipes,
    checkpoints,
    passagens,
    carregarDados,
    salvarPassagem,
    excluirPassagem
} from "../dados/armazenamento.js";
import {
    criarEstadoVazio,
    criarItemPassagem,
    criarOpcaoCheckpoint,
    criarOpcaoCorrida,
    criarOpcaoEquipe,
    criarOpcaoSelecione
} from "./componentes.js";

const formulario = document.getElementById("form-passagem");
const campoCorrida = document.getElementById("corrida");
const campoEquipe = document.getElementById("equipe");
const campoCheckpoint = document.getElementById("checkpoint");
const campoDataHora = document.getElementById("dataHora");
const lista = document.getElementById("lista-passagens");
const mensagem = document.getElementById("mensagem");
const botaoCancelar = document.getElementById("cancelar");

let idEditando = null;

function avisar(texto) {
    mensagem.textContent = texto;
}

function preencherCorridas() {
    campoCorrida.replaceChildren(criarOpcaoSelecione("Selecione uma corrida"));
    corridas.forEach(corrida => {
        campoCorrida.appendChild(criarOpcaoCorrida(corrida));
    });
}

function preencherAssociacoes() {
    const corridaId = Number(campoCorrida.value);
    const corridaSelecionada = corridas.some(corrida => corrida.id === corridaId);

    campoEquipe.replaceChildren(criarOpcaoSelecione("Selecione uma equipe"));
    campoCheckpoint.replaceChildren(
        criarOpcaoSelecione("Selecione um checkpoint")
    );

    campoEquipe.disabled = !corridaSelecionada;
    campoCheckpoint.disabled = !corridaSelecionada;

    if (!corridaSelecionada) return;

    equipes
        .filter(equipe => equipe.corrida?.id === corridaId)
        .forEach(equipe => campoEquipe.appendChild(criarOpcaoEquipe(equipe)));

    checkpoints
        .filter(checkpoint => checkpoint.corrida?.id === corridaId)
        .forEach(checkpoint =>
            campoCheckpoint.appendChild(criarOpcaoCheckpoint(checkpoint))
        );
}

function limparFormulario() {
    formulario.reset();
    idEditando = null;
    preencherAssociacoes();
    formulario.querySelector('[type="submit"]').textContent =
        "Registrar passagem";
}

function editarPassagem(passagem) {
    const corridaId = passagem.equipe.corrida.id;
    campoCorrida.value = corridaId;
    preencherAssociacoes();
    campoEquipe.value = passagem.equipe.id;
    campoCheckpoint.value = passagem.checkpoint.id;
    campoDataHora.value = passagem.dataHora;
    idEditando = passagem.id;
    formulario.querySelector('[type="submit"]').textContent =
        "Salvar alterações";
    campoCorrida.focus();
}

function renderizar() {
    lista.replaceChildren();

    if (passagens.length === 0) {
        lista.appendChild(criarEstadoVazio("Nenhuma passagem registrada."));
        return;
    }

    passagens.forEach(passagem => {
        lista.appendChild(criarItemPassagem(passagem, {
            aoEditar: () => editarPassagem(passagem),
            aoExcluir: async () => {
                if (!confirm("Deseja excluir esta passagem?")) return;

                try {
                    const resultado = await excluirPassagem(passagem.id);
                    avisar(resultado.mensagem);
                    renderizar();
                } catch (erro) {
                    avisar("Erro ao excluir a passagem: " + erro.message);
                }
            }
        }));
    });
}

campoCorrida.addEventListener("change", preencherAssociacoes);

formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    try {
        const corridaId = Number(campoCorrida.value);
        const equipe = equipes.find(
            item => item.id === Number(campoEquipe.value)
        );
        const checkpoint = checkpoints.find(
            item => item.id === Number(campoCheckpoint.value)
        );

        if (!corridas.some(corrida => corrida.id === corridaId)) {
            throw new Error("Selecione uma corrida.");
        }

        if (!equipe || !checkpoint) {
            throw new Error("Selecione a equipe e o checkpoint.");
        }

        if (equipe.corrida.id !== corridaId) {
            throw new Error("A equipe não pertence à corrida selecionada.");
        }

        await salvarPassagem(
            idEditando,
            equipe,
            checkpoint,
            campoDataHora.value
        );
        limparFormulario();
        renderizar();
        avisar("Passagem salva com sucesso.");
    } catch (erro) {
        console.error(erro);
        avisar(erro.message);
    }
});

botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    avisar("");
});

try {
    await carregarDados();
    preencherCorridas();
    preencherAssociacoes();
    renderizar();
} catch (erro) {
    console.error(erro);
    avisar("Não foi possível carregar as passagens. Verifique se a API está em execução.");
}