import { Corrida } from "../classes/Corrida.js";
import { Equipe } from "../classes/Equipe.js";
import { Checkpoint } from "../classes/Checkpoint.js";

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

// Primeiro carregamos as corridas.
export const corridas = lerDados(CHAVE_CORRIDAS).map(
    dados => new Corrida(
        dados.nome,
        dados.data,
        dados.id
    )
);

// Depois carregamos as equipes e recuperamos
// a referência para a corrida correspondente.
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

// Por último, carregamos os checkpoints.
export const checkpoints = lerDados(CHAVE_CHECKPOINTS)
    .flatMap(dados => {
        const corrida = corridas.find(
            item => item.id === dados.corridaId
        );

        if (!corrida) {
            return [];
        }

        return [
            new Checkpoint(
                dados.nome,
                dados.localizacao ?? "",
                corrida,
                dados.id
            )
        ];
    });

// SALVAR CORRIDAS
export function salvarCorridas() {
    const dados = corridas.map(corrida => ({
        id: corrida.id,
        nome: corrida.nome,
        data: corrida.data
    }));

    localStorage.setItem(
        CHAVE_CORRIDAS,
        JSON.stringify(dados)
    );
}

// SALVAR EQUIPES
export function salvarEquipes() {
    const dados = equipes.map(equipe => ({
        id: equipe.id,
        nome: equipe.nome,
        integrantes: equipe.integrantes,
        corridaId: equipe.corrida?.id ?? null
    }));

    localStorage.setItem(
        CHAVE_EQUIPES,
        JSON.stringify(dados)
    );
}

// SALVAR CHECKPOINTS
export function salvarCheckpoints() {
    const dados = checkpoints.map(checkpoint => ({
        id: checkpoint.id,
        nome: checkpoint.nome,
        localizacao: checkpoint.localizacao,
        corridaId: checkpoint.corrida.id
    }));

    localStorage.setItem(
        CHAVE_CHECKPOINTS,
        JSON.stringify(dados)
    );
}

// EXCLUIR CORRIDA
// Não permite excluir uma corrida que tenha
// equipes ou checkpoints associados.
export function excluirCorrida(id) {
    const possuiEquipe = equipes.some(
        equipe => equipe.corrida?.id === id
    );

    const possuiCheckpoint = checkpoints.some(
        checkpoint => checkpoint.corrida.id === id
    );

    if (possuiEquipe || possuiCheckpoint) {
        return {
            sucesso: false,
            mensagem:
                "Não é possível excluir esta corrida, pois existem equipes ou checkpoints associados a ela."
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
