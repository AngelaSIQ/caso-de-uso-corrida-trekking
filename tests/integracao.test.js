import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, test } from "node:test";

import {
    carregarDados,
    corridas,
    equipes,
    checkpoints,
    passagens,
    salvarCorrida,
    salvarEquipe,
    salvarCheckpoint,
    salvarPassagem,
    excluirCorrida,
    excluirEquipe,
    excluirCheckpoint,
    excluirPassagem
} from "../js/dados/armazenamento.js";

const fetchOriginal = globalThis.fetch;
let banco;
let proximaFalha;
let proximoId;

function respostaJson(dados, status = 200) {
    return new Response(JSON.stringify(dados), {
        status,
        headers: { "Content-Type": "application/json" }
    });
}

function simularApi(url, opcoes = {}) {
    if (proximaFalha === "rede") {
        proximaFalha = null;
        return Promise.reject(new TypeError("fetch failed"));
    }

    if (proximaFalha === "http") {
        proximaFalha = null;
        return Promise.resolve(new Response("Serviço indisponível", { status: 503 }));
    }

    const partes = new URL(url).pathname.split("/").filter(Boolean);
    const recurso = partes[0];
    const id = partes[1] === undefined
        ? null
        : decodeURIComponent(partes[1]);
    const registros = banco[recurso];

    if (!registros) {
        return Promise.resolve(new Response("Recurso inexistente", { status: 404 }));
    }

    if (opcoes.method === "GET" || !opcoes.method) {
        return Promise.resolve(respostaJson(registros));
    }

    if (opcoes.method === "POST") {
        const registro = {
            ...JSON.parse(opcoes.body),
            id: `teste-${recurso}-${proximoId++}`
        };
        registros.push(registro);
        return Promise.resolve(respostaJson(registro, 201));
    }

    const indice = registros.findIndex(registro => String(registro.id) === id);
    if (indice < 0) {
        return Promise.resolve(new Response("Registro não encontrado", { status: 404 }));
    }

    if (opcoes.method === "PUT") {
        registros[indice] = {
            ...JSON.parse(opcoes.body),
            id: registros[indice].id
        };
        return Promise.resolve(respostaJson(registros[indice]));
    }

    if (opcoes.method === "DELETE") {
        registros.splice(indice, 1);
        return Promise.resolve(new Response(null, { status: 204 }));
    }

    return Promise.resolve(new Response("Método não permitido", { status: 405 }));
}

describe("integração com a API", { concurrency: false }, () => {
beforeEach(() => {
    banco = {
        corridas: [
            { id: "corrida-01", nome: "Trilha Norte", data: "2027-05-10" },
            { id: "corrida-02", nome: "Trilha Sul", data: "2027-06-20" }
        ],
        equipes: [
            {
                id: "equipe-01",
                nome: "Exploradores",
                integrantes: "Ana e Bia",
                corridaId: "corrida-01"
            }
        ],
        checkpoints: [
            {
                id: "checkpoint-01",
                nome: "Lago",
                localizacao: "Margem leste",
                corridaId: "corrida-01"
            },
            {
                id: "checkpoint-02",
                nome: "Mirante",
                localizacao: "Pico",
                corridaId: "corrida-02"
            }
        ],
        passagens: [
            {
                id: "passagem-01",
                equipeId: "equipe-01",
                checkpointId: "checkpoint-01",
                dataHora: "2027-05-10T08:30"
            }
        ]
    };
    proximaFalha = null;
    proximoId = 1;
    globalThis.fetch = simularApi;
});

afterEach(() => {
    globalThis.fetch = fetchOriginal;
});

test("carrega registros e reconstrói associações com IDs textuais", {
    concurrency: false
}, async () => {
    await carregarDados();

    assert.equal(corridas[0].id, "corrida-01");
    assert.equal(equipes[0].id, "equipe-01");
    assert.equal(equipes[0].corrida, corridas[0]);
    assert.equal(passagens[0].id, "passagem-01");
    assert.equal(passagens[0].equipe, equipes[0]);
    assert.equal(passagens[0].checkpoint, checkpoints[0]);
});

test("cadastra, altera e exclui recursos preservando regras e relacionamentos", {
    concurrency: false
}, async () => {
    await carregarDados();

    const corrida = await salvarCorrida(null, "Trilha Central", "2027-07-15");
    assert.match(corrida.id, /^teste-corridas-/);
    await salvarCorrida(corrida.id, "Trilha Central Atualizada", "2027-07-16");
    assert.equal(corrida.nome, "Trilha Central Atualizada");

    const equipe = await salvarEquipe(null, "Equipe Nova", "Caio e Duda", corrida);
    assert.match(equipe.id, /^teste-equipes-/);
    await salvarEquipe(equipe.id, "Equipe Atualizada", "Caio, Duda e Eva", corrida);
    assert.equal(equipe.nome, "Equipe Atualizada");

    const checkpoint = await salvarCheckpoint(
        null,
        "Cachoeira",
        "Vale central",
        corrida
    );
    assert.match(checkpoint.id, /^teste-checkpoints-/);
    await salvarCheckpoint(
        checkpoint.id,
        "Cachoeira Alta",
        "Vale superior",
        corrida
    );
    assert.equal(checkpoint.nome, "Cachoeira Alta");

    const passagem = await salvarPassagem(
        null,
        equipe,
        checkpoint,
        "2027-07-16T09:10"
    );
    assert.match(passagem.id, /^teste-passagens-/);
    await salvarPassagem(
        passagem.id,
        equipe,
        checkpoint,
        "2027-07-16T09:25"
    );
    assert.equal(
        passagens.find(item => item.id === passagem.id).dataHora,
        "2027-07-16T09:25"
    );

    assert.equal((await excluirCorrida(corrida.id)).sucesso, false);
    assert.equal((await excluirEquipe(equipe.id)).sucesso, false);
    assert.equal((await excluirCheckpoint(checkpoint.id)).sucesso, false);

    assert.equal((await excluirPassagem(passagem.id)).sucesso, true);
    assert.equal((await excluirEquipe(equipe.id)).sucesso, true);
    assert.equal((await excluirCheckpoint(checkpoint.id)).sucesso, true);
    assert.equal((await excluirCorrida(corrida.id)).sucesso, true);

    assert.equal(banco.corridas.some(item => item.id === corrida.id), false);
    assert.equal(banco.equipes.some(item => item.id === equipe.id), false);
    assert.equal(banco.checkpoints.some(item => item.id === checkpoint.id), false);
    assert.equal(banco.passagens.some(item => item.id === passagem.id), false);
});

test("impede passagem entre equipe e checkpoint de corridas diferentes", {
    concurrency: false
}, async () => {
    await carregarDados();

    await assert.rejects(
        salvarPassagem(null, equipes[0], checkpoints[1], "2027-05-10T09:00"),
        /mesma corrida/
    );
    assert.equal(banco.passagens.length, 1);
});

test("apresenta erro de conexão e não altera estado quando a API falha", {
    concurrency: false
}, async () => {
    proximaFalha = "rede";
    await assert.rejects(carregarDados(), /conectar à API/);

    await carregarDados();
    const nomeOriginal = corridas[0].nome;
    proximaFalha = "http";

    await assert.rejects(
        salvarCorrida(corridas[0].id, "Nome não persistido", "2027-05-10"),
        /503/
    );
    assert.equal(corridas[0].nome, nomeOriginal);
});
});
