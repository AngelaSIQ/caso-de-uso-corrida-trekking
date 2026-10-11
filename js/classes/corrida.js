export class Corrida {
    static proximoId = 1;

    #id;
    #nome;
    #data;

    constructor(nome, data, id = null) {
        if (!nome.trim()) {
            throw new Error("Informe o nome da corrida.");
        }

        this.#id = id ?? Corrida.proximoId++;
        this.#nome = nome;
        this.#data = data;

        if (id !== null && id >= Corrida.proximoId) {
            Corrida.proximoId = id + 1;
        }
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    set nome(valor) {
        if (!valor.trim()) {
            throw new Error("O nome da corrida é obrigatório.");
        }
        this.#nome = valor;
    }

    get data() {
        return this.#data;
    }

    set data(valor) {
        this.#data = valor;
    }
}
