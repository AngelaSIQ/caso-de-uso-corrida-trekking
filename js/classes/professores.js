
export class Professor {
    #id;
    #nome;
    #email;

    constructor(id, nome, email) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
    }

    getId() {
        return this.#id;
    }

    getNome() {
        return this.#nome;
    }

    getEmail() {
        return this.#email;
    }

    setNome(nome) {
        this.#nome = nome;
    }

    setEmail(email) {
        this.#email = email;
    }
}
