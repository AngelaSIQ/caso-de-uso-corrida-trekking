import { Corrida } from "../classes/corrida.js";
import { Equipe } from "../classes/equipe.js";
import { Checkpoint } from "../classes/checkpoint.js";

const CHAVE_CORRIDAS = "trekking_corridas";
const CHAVE_EQUIPES = "trekking_equipes";
const CHAVE_CHECKPOINTS = "trekking_checkpoints";

function lerDados(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

export const corridas = lerDados(CHAVE_CORRIDAS).map(
    dados => new Corrida(dados.nome, dados.data, dados.id)
);

export const equipes = lerDados(CHAVE_EQUIPES).map(dados => {
    const corrida = corridas.find(
        item => item.id === dados.corridaId
    ) ?? null;

    return new Equipe(
        dados.nome,
        dados.integrantes ?? "",
        corrida,
        dados.id
    );
});

export const checkpoints = lerDados(CHAVE_CHECKPOINTS).flatMap(dados => {
    const corrida = corridas.find(
        item => item.id === dados.corridaId
    );

    if (!corrida) return [];

    return [
        new Checkpoint(
            dados.nome,
            dados.localizacao ?? "",
            corrida,
            dados.id
        )
    ];
});

export function salvarCorridas() {
    localStorage.setItem(
        CHAVE_CORRIDAS,
        JSON.stringify(corridas.map(corrida => ({
            id: corrida.id,
            nome: corrida.nome,
            data: corrida.data
        })))
    );
}

export function salvarEquipes() {
    localStorage.setItem(
        CHAVE_EQUIPES,
        JSON.stringify(equipes.map(equipe => ({
            id: equipe.id,
            nome: equipe.nome,
            integrantes: equipe.integrantes,
            corridaId: equipe.corrida?.id ?? null
        })))
    );
}

export function salvarCheckpoints() {
    localStorage.setItem(
        CHAVE_CHECKPOINTS,
        JSON.stringify(checkpoints.map(checkpoint => ({
            id: checkpoint.id,
            nome: checkpoint.nome,
            localizacao: checkpoint.localizacao,
            corridaId: checkpoint.corrida?.id ?? null
        })))
    );
}

export function excluirCorrida(id) {
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

    const indice = corridas.findIndex(
        corrida => corrida.id === id
    );

    if (indice === -1) {
        return {
            sucesso: false,
            mensagem: "Corrida não encontrada."
        };
    }

    corridas.splice(indice, 1);
    salvarCorridas();

    return {
        sucesso: true,
        mensagem: "Corrida excluída com sucesso."
    };
}
