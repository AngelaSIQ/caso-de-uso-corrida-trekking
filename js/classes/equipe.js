export class Equipe {
    static proximoId = 1;

    #id;
    #nome;
    #integrantes;
    #corrida;

    constructor(nome, integrantes, corrida = null, id = null) {
        if (!nome || !nome.trim()) {
            throw new Error("Informe o nome da equipe.");
        }

        this.#id = id ?? Equipe.proximoId++;
        this.#nome = nome.trim();
        this.#integrantes = integrantes;
        this.#corrida = corrida;

        if (id !== null && id >= Equipe.proximoId) {
            Equipe.proximoId = id + 1;
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
            throw new Error("O nome da equipe é obrigatório.");
        }

        this.#nome = valor.trim();
    }

    get integrantes() {
        return this.#integrantes;
    }

    set integrantes(valor) {
        this.#integrantes = valor;
    }

    get corrida() {
        return this.#corrida;
    }

    set corrida(valor) {
        this.#corrida = valor;
    }
}