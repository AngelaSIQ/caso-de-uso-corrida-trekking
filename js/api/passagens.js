import { requisicao } from "./http.js";

const RECURSO = "passagens";

export function listarPassagens() {
    return requisicao(RECURSO);
}

export function cadastrarPassagem(passagem) {
    return requisicao(RECURSO, {
        method: "POST",
        body: JSON.stringify(passagem)
    });
}

export function atualizarPassagem(id, passagem) {
    return requisicao(`${RECURSO}/${id}`, {
        method: "PUT",
        body: JSON.stringify(passagem)
    });
}

export function excluirPassagem(id) {
    return requisicao(`${RECURSO}/${id}`, { method: "DELETE" });
}
