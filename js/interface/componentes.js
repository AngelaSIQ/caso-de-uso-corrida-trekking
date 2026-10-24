function criarBotaoAcao(texto, aoClicar) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.classList.add(
        texto === "Excluir" ? "button-danger" : "button-secondary"
    );
    botao.addEventListener("click", aoClicar);
    return botao;
}

function criarItemComAcoes(descricaoTexto, aoEditar, aoExcluir) {
    const item = document.createElement("li");
    const descricao = document.createElement("span");

    descricao.textContent = descricaoTexto;
    item.append(
        descricao,
        criarBotaoAcao("Editar", aoEditar),
        criarBotaoAcao("Excluir", aoExcluir)
    );

    return item;
}

export function criarOpcaoCorrida(corrida) {
    const opcao = document.createElement("option");
    opcao.value = corrida.id;
    opcao.textContent = corrida.nome;
    return opcao;
}

export function criarOpcaoEquipe(equipe) {
    const opcao = document.createElement("option");
    opcao.value = equipe.id;
    opcao.textContent = equipe.nome;
    return opcao;
}

export function criarOpcaoCheckpoint(checkpoint) {
    const opcao = document.createElement("option");
    opcao.value = checkpoint.id;
    opcao.textContent = checkpoint.nome;
    return opcao;
}

export function criarOpcaoSelecioneCorrida() {
    return criarOpcaoSelecione("Selecione uma corrida");
}

export function criarOpcaoSelecione(texto) {
    const opcao = document.createElement("option");
    opcao.value = "";
    opcao.textContent = texto;
    return opcao;
}

export function criarEstadoVazio(texto) {
    const item = document.createElement("li");
    item.textContent = texto;
    return item;
}

export function criarItemCorrida(corrida, { aoEditar, aoExcluir }) {
    return criarItemComAcoes(
        `${corrida.nome} — ${corrida.data || "Sem data"} `,
        aoEditar,
        aoExcluir
    );
}

export function criarItemEquipe(equipe, { aoEditar, aoExcluir }) {
    return criarItemComAcoes(
        `${equipe.nome} — ${equipe.integrantes} — Corrida: ${equipe.corrida?.nome ?? "Sem corrida"} `,
        aoEditar,
        aoExcluir
    );
}

export function criarItemCheckpoint(checkpoint, { aoEditar, aoExcluir }) {
    return criarItemComAcoes(
        `${checkpoint.nome} — ${checkpoint.localizacao} — Corrida: ${checkpoint.corrida?.nome ?? "Sem corrida"} `,
        aoEditar,
        aoExcluir
    );
}

export function criarItemPassagem(passagem, { aoEditar, aoExcluir }) {
    const dataHora = new Date(passagem.dataHora).toLocaleString("pt-BR");
    return criarItemComAcoes(
        `${passagem.equipe.nome} — ${passagem.checkpoint.nome} — Corrida: ${passagem.equipe.corrida.nome} — ${dataHora}`,
        aoEditar,
        aoExcluir
    );
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto;
    return celula;
}

export function criarLinhaRankingEquipe(equipe, posicao) {
    const linha = document.createElement("tr");
    const desclassificada = Boolean(equipe.motivoDesclassificacao);

    if (desclassificada) {
        linha.classList.add("desclassificada");
    }

    linha.append(
        criarCelula(desclassificada ? "-" : `${posicao}º`)
    );

    const nome = document.createElement("td");
    nome.textContent = equipe.nome;

    if (desclassificada) {
        const status = document.createElement("span");
        status.classList.add("status-tag");
        status.textContent = `Desclassificada (${equipe.motivoDesclassificacao})`;
        nome.append(" ", status);
    }

    linha.append(
        nome,
        criarCelula(String(equipe.numero)),
        criarCelula(String(equipe.checkpoints)),
        criarCelula(equipe.ultimaPassagem)
    );

    return linha;
}