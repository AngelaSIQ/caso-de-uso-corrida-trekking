const API_URL = "http://localhost:5000/api";

export async function requisicao(recurso, opcoes = {}) {
    let resposta;

    try {
        resposta = await fetch(`${API_URL}/${recurso}`, {
            ...opcoes,
            headers: {
                ...(opcoes.body ? { "Content-Type": "application/json" } : {}),
                ...opcoes.headers
            }
        });
    } catch (erro) {
        throw new Error(
            "Não foi possível conectar à API. Verifique se o servidor está em execução.",
            { cause: erro }
        );
    }

    if (!resposta.ok) {
        let detalhe = "";

        try {
            const corpo = await resposta.json();
            detalhe = corpo.erro || "";
        } catch {
            // resposta sem JSON: usa a mensagem padrão
        }

        throw new Error(
            detalhe
                ? `${detalhe} (HTTP ${resposta.status})`
                : `A API respondeu com o status ${resposta.status}.`
        );
    }

    if (resposta.status === 204) return null;
    return resposta.json();
}