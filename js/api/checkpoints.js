import { requisicao } from "./http.js";

const RECURSO = "checkpoints";

export function listarCheckpoints() {
    return requisicao(RECURSO);
}

export function cadastrarCheckpoint(checkpoint) {
    return requisicao(RECURSO, {
        method: "POST",
        body: JSON.stringify(checkpoint)
    });
}

export function atualizarCheckpoint(id, checkpoint) {
    return requisicao(`${RECURSO}/${id}`, {
        method: "PUT",
        body: JSON.stringify(checkpoint)
    });
}

export function excluirCheckpoint(id) {
    return requisicao(`${RECURSO}/${id}`, { method: "DELETE" });
}
