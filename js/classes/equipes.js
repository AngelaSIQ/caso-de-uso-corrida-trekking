export class Equipe {
    #id;
    #nome;
    #numero;
    #checkpoints;
    #ultimaPassagem;

    constructor(id, nome, numero, checkpoints, ultimaPassagem) {
        this.#id = id;
        this.#nome = nome;
        this.#numero = numero;
        this.#checkpoints = checkpoints;
        this.#ultimaPassagem = ultimaPassagem;
    }

    getId() {
        return this.#id;
    }

    getNome() {
        return this.#nome;
    }

    getNumero() {
        return this.#numero;
    }

    getCheckpoints() {
        return this.#checkpoints;
    }

    getUltimaPassagem() {
        return this.#ultimaPassagem;
    }

    render(posicao) {
        const linha = document.createElement("tr");

        const valores = [
            posicao,
            this.#nome,
            this.#numero,
            this.#checkpoints,
            this.#ultimaPassagem
        ];

        valores.forEach(valor => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        });

        return linha;
    }
}
