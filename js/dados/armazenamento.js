import { Corrida } from "../classes/corrida.js";
import { Equipe } from "../classes/equipe.js";
import { Checkpoint } from "../classes/checkpoint.js";
import { Passagem } from "../classes/passagem.js";
import * as apiCorridas from "../api/corridas.js";
import * as apiEquipes from "../api/equipes.js";
import * as apiCheckpoints from "../api/checkpoints.js";
import * as apiPassagens from "../api/passagens.js";

export const corridas = [];
export const equipes = [];
export const checkpoints = [];
export const passagens = [];

function substituirConteudo(lista, novosDados) {
    lista.splice(0, lista.length, ...novosDados);
}

export async function carregarDados() {
    const [dadosCorridas, dadosEquipes, dadosCheckpoints, dadosPassagens] =
        await Promise.all([
            apiCorridas.listarCorridas(),
            apiEquipes.listarEquipes(),
            apiCheckpoints.listarCheckpoints(),
            apiPassagens.listarPassagens()
        ]);

    const novasCorridas = dadosCorridas.map(
        dados => new Corrida(dados.nome, dados.data, Number(dados.id))
    );
    const novasEquipes = dadosEquipes.map(dados => {
        const corrida = novasCorridas.find(
            item => item.id === Number(dados.corridaId)
        );

        if (!corrida) {
            throw new Error(`Corrida da equipe "${dados.nome}" não encontrada.`);
        }

        return new Equipe(
            dados.nome,
            dados.integrantes,
            corrida,
            Number(dados.id)
        );
    });
    const novosCheckpoints = dadosCheckpoints.map(dados => {
        const corrida = novasCorridas.find(
            item => item.id === Number(dados.corridaId)
        );

        if (!corrida) {
            throw new Error(
                `Corrida do checkpoint "${dados.nome}" não encontrada.`
            );
        }

        return new Checkpoint(
            dados.nome,
            dados.localizacao,
            corrida,
            Number(dados.id)
        );
    });
    const novasPassagens = dadosPassagens.map(dados => {
        const equipe = novasEquipes.find(
            item => item.id === Number(dados.equipeId)
        );
        const checkpoint = novosCheckpoints.find(
            item => item.id === Number(dados.checkpointId)
        );

        if (!equipe || !checkpoint) {
            throw new Error(
                `Equipe ou checkpoint da passagem ${dados.id} não encontrado.`
            );
        }

        return new Passagem(
            equipe,
            checkpoint,
            dados.dataHora,
            Number(dados.id)
        );
    });

    substituirConteudo(corridas, novasCorridas);
    substituirConteudo(equipes, novasEquipes);
    substituirConteudo(checkpoints, novosCheckpoints);
    substituirConteudo(passagens, novasPassagens);
}

export async function salvarCorrida(id, nome, data) {
    if (id === null) {
        const dados = await apiCorridas.cadastrarCorrida({ nome, data });
        const corrida = new Corrida(dados.nome, dados.data, Number(dados.id));
        corridas.push(corrida);
        return corrida;
    }

    await apiCorridas.atualizarCorrida(id, { nome, data });
    const corrida = corridas.find(item => item.id === id);
    if (!corrida) throw new Error("Corrida não encontrada.");
    corrida.nome = nome;
    corrida.data = data;
    return corrida;
}

export async function salvarEquipe(id, nome, integrantes, corrida) {
    const dados = { nome, integrantes, corridaId: corrida.id };

    if (id === null) {
        const resposta = await apiEquipes.cadastrarEquipe(dados);
        const equipe = new Equipe(
            resposta.nome,
            resposta.integrantes,
            corrida,
            Number(resposta.id)
        );
        equipes.push(equipe);
        return equipe;
    }

    await apiEquipes.atualizarEquipe(id, dados);
    const equipe = equipes.find(item => item.id === id);
    if (!equipe) throw new Error("Equipe não encontrada.");
    equipe.nome = nome;
    equipe.integrantes = integrantes;
    equipe.corrida = corrida;
    return equipe;
}

export async function salvarCheckpoint(id, nome, localizacao, corrida) {
    const dados = { nome, localizacao, corridaId: corrida.id };

    if (id === null) {
        const resposta = await apiCheckpoints.cadastrarCheckpoint(dados);
        const checkpoint = new Checkpoint(
            resposta.nome,
            resposta.localizacao,
            corrida,
            Number(resposta.id)
        );
        checkpoints.push(checkpoint);
        return checkpoint;
    }

    await apiCheckpoints.atualizarCheckpoint(id, dados);
    const checkpoint = checkpoints.find(item => item.id === id);
    if (!checkpoint) throw new Error("Checkpoint não encontrado.");
    checkpoint.nome = nome;
    checkpoint.localizacao = localizacao;
    checkpoint.corrida = corrida;
    return checkpoint;
}

export async function salvarPassagem(id, equipe, checkpoint, dataHora) {
    const dados = {
        equipeId: equipe.id,
        checkpointId: checkpoint.id,
        dataHora
    };

    if (id === null) {
        const resposta = await apiPassagens.cadastrarPassagem(dados);
        const passagem = new Passagem(
            equipe,
            checkpoint,
            resposta.dataHora,
            Number(resposta.id)
        );
        passagens.push(passagem);
        return passagem;
    }

    await apiPassagens.atualizarPassagem(id, dados);
    const indice = passagens.findIndex(item => item.id === id);
    if (indice === -1) throw new Error("Passagem não encontrada.");
    const passagem = new Passagem(equipe, checkpoint, dataHora, id);
    passagens.splice(indice, 1, passagem);
    return passagem;
}

export async function excluirEquipe(id) {
    if (passagens.some(passagem => passagem.equipe.id === id)) {
        return {
            sucesso: false,
            mensagem: "Não é possível excluir esta equipe, pois existem passagens associadas a ela."
        };
    }

    const indice = equipes.findIndex(equipe => equipe.id === id);
    if (indice === -1) {
        return { sucesso: false, mensagem: "Equipe não encontrada." };
    }

    await apiEquipes.excluirEquipe(id);
    equipes.splice(indice, 1);
    return { sucesso: true, mensagem: "Equipe excluída com sucesso." };
}

export async function excluirCheckpoint(id) {
    if (passagens.some(passagem => passagem.checkpoint.id === id)) {
        return {
            sucesso: false,
            mensagem: "Não é possível excluir este checkpoint, pois existem passagens associadas a ele."
        };
    }

    const indice = checkpoints.findIndex(checkpoint => checkpoint.id === id);
    if (indice === -1) {
        return { sucesso: false, mensagem: "Checkpoint não encontrado." };
    }

    await apiCheckpoints.excluirCheckpoint(id);
    checkpoints.splice(indice, 1);
    return { sucesso: true, mensagem: "Checkpoint excluído com sucesso." };
}

export async function excluirPassagem(id) {
    const indice = passagens.findIndex(passagem => passagem.id === id);
    if (indice === -1) {
        return { sucesso: false, mensagem: "Passagem não encontrada." };
    }

    await apiPassagens.excluirPassagem(id);
    passagens.splice(indice, 1);
    return { sucesso: true, mensagem: "Passagem excluída com sucesso." };
}

export async function excluirCorrida(id) {
    const possuiEquipe = equipes.some(
        equipe => equipe.corrida?.id === id
    );
    const possuiCheckpoint = checkpoints.some(
        checkpoint => checkpoint.corrida?.id === id
    );

    if (possuiEquipe || possuiCheckpoint) {
        return {
            sucesso: false,
            mensagem: "Não é possível excluir esta corrida, pois existem equipes ou checkpoints associados a ela."
        };
    }

    const indice = corridas.findIndex(corrida => corrida.id === id);
    if (indice === -1) {
        return { sucesso: false, mensagem: "Corrida não encontrada." };
    }

    await apiCorridas.excluirCorrida(id);
    corridas.splice(indice, 1);
    return { sucesso: true, mensagem: "Corrida excluída com sucesso." };
}
