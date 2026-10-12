const API_BASE = "/api";

const formulario = document.querySelector("#form-passagem");
const campoId = document.querySelector("#passagem-id");
const campoCorrida = document.querySelector("#corrida-id");
const campoCheckpoint = document.querySelector("#checkpoint-id");
const campoEquipe = document.querySelector("#equipe-id");
const campoDataHora = document.querySelector("#data-hora");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const lista = document.querySelector("#lista-passagens");
const mensagemStatus = document.querySelector("#mensagem-status");
const avisoPrerequisitos = document.querySelector("#aviso-prerequisitos");

let corridas = [];
let checkpoints = [];
let equipes = [];
let passagens = [];

async function requisitar(caminho, opcoes = {}) {
    const resposta = await fetch(`${API_BASE}${caminho}`, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            ...opcoes.headers,
        },
    });

    if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({}));
        throw new Error(erro.erro || `Falha na API (${resposta.status}).`);
    }

    return resposta.status === 204 ? null : resposta.json();
}

function exibirMensagem(texto, tipo = "sucesso") {
    mensagemStatus.textContent = texto;
    mensagemStatus.className = `mensagem-status ${tipo}`;
}

function preencherOpcoes(select, registros, textoInicial, rotulo) {
    select.replaceChildren(new Option(textoInicial, ""));
    for (const registro of registros) {
        select.add(new Option(rotulo(registro), registro.id));
    }
}

function carregarCheckpoints(corridaId, checkpointSelecionado = "") {
    const disponiveis = checkpoints.filter(
        (checkpoint) => String(checkpoint.corrida_id) === String(corridaId),
    );

    preencherOpcoes(
        campoCheckpoint,
        disponiveis,
        corridaId ? "Selecione um checkpoint" : "Selecione uma corrida primeiro",
        (checkpoint) => `${checkpoint.ordem}. ${checkpoint.identificacao_local}`,
    );
    campoCheckpoint.disabled = disponiveis.length === 0;
    campoCheckpoint.value = checkpointSelecionado;
}

function rotuloDataHora(valor) {
    return new Date(valor).toLocaleString("pt-BR");
}

function renderizarPassagens() {
    lista.replaceChildren();

    if (passagens.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");
        celula.colSpan = 5;
        celula.textContent = "Nenhuma passagem registrada.";
        linha.append(celula);
        lista.append(linha);
        return;
    }

    for (const passagem of passagens) {
        const corrida = corridas.find((item) => item.id === passagem.corrida_id);
        const checkpoint = checkpoints.find((item) => item.id === passagem.checkpoint_id);
        const equipe = equipes.find((item) => item.id === passagem.equipe_id);
        const linha = document.createElement("tr");

        for (const texto of [
            corrida?.nome || "Corrida indisponível",
            checkpoint ? `${checkpoint.ordem}. ${checkpoint.identificacao_local}` : "Checkpoint indisponível",
            equipe ? `${equipe.nome} (#${equipe.numero})` : "Equipe indisponível",
            rotuloDataHora(passagem.data_hora),
        ]) {
            const celula = document.createElement("td");
            celula.textContent = texto;
            linha.append(celula);
        }

        const acoes = document.createElement("td");
        acoes.className = "acoes-registro";
        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Alterar";
        botaoEditar.addEventListener("click", () => editarPassagem(passagem));

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", () => excluirPassagem(passagem));

        acoes.append(botaoEditar, botaoExcluir);
        linha.append(acoes);
        lista.append(linha);
    }
}

function editarPassagem(passagem) {
    campoId.value = passagem.id;
    campoCorrida.value = passagem.corrida_id;
    carregarCheckpoints(passagem.corrida_id, String(passagem.checkpoint_id));
    campoEquipe.value = passagem.equipe_id;
    campoDataHora.value = passagem.data_hora.slice(0, 16);
    tituloFormulario.textContent = "Alterar passagem";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;
    campoCorrida.focus();
}

function limparFormulario() {
    formulario.reset();
    campoId.value = "";
    carregarCheckpoints("");
    campoDataHora.value = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    tituloFormulario.textContent = "Registrar passagem";
    botaoSalvar.textContent = "Registrar passagem";
    botaoCancelar.hidden = true;
}

async function salvarPassagem(evento) {
    evento.preventDefault();
    const dados = {
        corrida_id: Number(campoCorrida.value),
        checkpoint_id: Number(campoCheckpoint.value),
        equipe_id: Number(campoEquipe.value),
        data_hora: campoDataHora.value,
    };

    const checkpoint = checkpoints.find((item) => item.id === dados.checkpoint_id);
    if (!checkpoint || checkpoint.corrida_id !== dados.corrida_id) {
        exibirMensagem("Selecione um checkpoint pertencente à corrida escolhida.", "erro");
        return;
    }

    try {
        const id = campoId.value;
        await requisitar(id ? `/passagens/${id}` : "/passagens", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(dados),
        });
        await carregarPassagens();
        limparFormulario();
        exibirMensagem(id ? "Passagem atualizada." : "Passagem registrada.");
    } catch (erro) {
        exibirMensagem(erro.message, "erro");
    }
}

async function excluirPassagem(passagem) {
    if (!window.confirm("Excluir esta passagem?")) {
        return;
    }

    try {
        await requisitar(`/passagens/${passagem.id}`, { method: "DELETE" });
        await carregarPassagens();
        exibirMensagem("Passagem excluída.");
        if (campoId.value === String(passagem.id)) {
            limparFormulario();
        }
    } catch (erro) {
        exibirMensagem(erro.message, "erro");
    }
}

async function carregarPassagens() {
    passagens = await requisitar("/passagens");
    renderizarPassagens();
}

export async function inicializarPassagens() {
    formulario.addEventListener("submit", salvarPassagem);
    campoCorrida.addEventListener("change", () => carregarCheckpoints(campoCorrida.value));
    botaoCancelar.addEventListener("click", limparFormulario);

    try {
        [corridas, checkpoints, equipes, passagens] = await Promise.all([
            requisitar("/corridas"),
            requisitar("/checkpoints"),
            requisitar("/equipes"),
            requisitar("/passagens"),
        ]);

        preencherOpcoes(campoCorrida, corridas, "Selecione uma corrida", (corrida) => corrida.nome);
        preencherOpcoes(
            campoEquipe,
            equipes,
            "Selecione uma equipe",
            (equipe) => `${equipe.nome} (#${equipe.numero})`,
        );
        carregarCheckpoints("");
        avisoPrerequisitos.hidden = corridas.length > 0
            && checkpoints.length > 0
            && equipes.length > 0;
        renderizarPassagens();
    } catch (erro) {
        exibirMensagem(`Não foi possível carregar os dados: ${erro.message}`, "erro");
    }
}