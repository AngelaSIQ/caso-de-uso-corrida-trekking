const API_URL = "http://localhost:3000";

export async function requisicao(recurso, opcoes = {}) {
    const resposta = await fetch(`${API_URL}/${recurso}`, {
        ...opcoes,
        headers: {
            ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
            ...opcoes.headers
        }
    });

    if (!resposta.ok) {
        const detalhe = await resposta.text();
        throw new Error(
            detalhe || `A API respondeu com o status ${resposta.status}.`
        );
    }

    if (resposta.status === 204) return null;
    return resposta.json();
}
