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

        linha.innerHTML = `
            <td>${posicao}º</td>
            <td>${this.#nome}</td>
            <td>${this.#numero}</td>
            <td>${this.#checkpoints}</td>
            <td>${this.#ultimaPassagem}</td>
        `;

        return linha;
    }
}
