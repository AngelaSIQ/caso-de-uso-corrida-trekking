export class Corrida {
    #id;
    #nome;
    #descricao;
    #data;
    #status;

    constructor(id, nome, descricao, data, status = "Criada") {
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#data = data;
        this.#status = status;
    }

    getId() {
        return this.#id;
    }

    getNome() {
        return this.#nome;
    }

    getDescricao() {
        return this.#descricao;
    }

    getData() {
        return this.#data;
    }

    getStatus() {
        return this.#status;
    }

    iniciar() {
        if (this.#status !== "Criada") {
            return false;
        }

        this.#status = "Iniciada";
        return true;
    }

    encerrar() {
        if (this.#status !== "Iniciada") {
            return false;
        }

        this.#status = "Encerrada";
        return true;
    }
}
