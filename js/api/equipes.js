import { requisicao } from "./http.js";

const RECURSO = "equipes";

export function listarEquipes() {
    return requisicao(RECURSO);
}

export function cadastrarEquipe(equipe) {
    return requisicao(RECURSO, {
        method: "POST",
        body: JSON.stringify(equipe)
    });
}

export function atualizarEquipe(id, equipe) {
    return requisicao(`${RECURSO}/${id}`, {
        method: "PUT",
        body: JSON.stringify(equipe)
    });
}

export function excluirEquipe(id) {
    return requisicao(`${RECURSO}/${id}`, { method: "DELETE" });
}
