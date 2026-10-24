export class Corrida {
    #id;
    #nome;
    #data;

    constructor(id, nome, data) {
        this.#id = id;
        this.#nome = nome;
        this.#data = data;
    }

    getId() {
        return this.#id;
    }

    getNome() {
        return this.#nome;
    }

    getData() {
        return this.#data;
    }

    render() {
        const artigo = document.createElement("article");
        const titulo = document.createElement("h2");
        const data = document.createElement("p");

        titulo.textContent = this.#nome;
        data.textContent = `Data: ${this.#data}`;

        artigo.append(titulo, data);
        return artigo;
    }
}
