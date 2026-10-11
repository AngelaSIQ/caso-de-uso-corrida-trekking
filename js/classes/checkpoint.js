export class Checkpoint {
    static proximoId = 1;

    #id;
    #nome;
    #localizacao;
    #corrida;

    constructor(nome, localizacao, corrida, id = null) {
        if (!nome || !nome.trim()) {
            throw new Error("Informe o nome do checkpoint.");
        }

        if (!corrida) {
            throw new Error("Selecione uma corrida.");
        }

        this.#id = id ?? Checkpoint.proximoId++;
        this.#nome = nome.trim();
        this.#localizacao = localizacao;
        this.#corrida = corrida;

        if (id !== null && id >= Checkpoint.proximoId) {
            Checkpoint.proximoId = id + 1;
        }
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    set nome(valor) {
        if (!valor || !valor.trim()) {
            throw new Error("O nome é obrigatório.");
        }

        this.#nome = valor.trim();
    }

    get localizacao() {
        return this.#localizacao;
    }

    set localizacao(valor) {
        this.#localizacao = valor;
    }

    get corrida() {
        return this.#corrida;
    }

    set corrida(valor) {
        if (!valor) {
            throw new Error("Selecione uma corrida.");
        }

        this.#corrida = valor;
    }
}