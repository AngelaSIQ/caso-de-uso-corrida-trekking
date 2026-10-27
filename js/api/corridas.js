import { requisicao } from "./http.js";

const RECURSO = "corridas";

export function listarCorridas() {
    return requisicao(RECURSO);
}

export function cadastrarCorrida(corrida) {
    return requisicao(RECURSO, {
        method: "POST",
        body: JSON.stringify(corrida)
    });
}

export function atualizarCorrida(id, corrida) {
    return requisicao(`${RECURSO}/${id}`, {
        method: "PUT",
        body: JSON.stringify(corrida)
    });
}

export function excluirCorrida(id) {
    return requisicao(`${RECURSO}/${id}`, { method: "DELETE" });
}
