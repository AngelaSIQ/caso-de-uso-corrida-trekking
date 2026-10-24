export class Professor {
    #id;
    #nome;
    #disciplina;

    constructor(id, nome, disciplina) {
        this.#id = id;
        this.#nome = nome;
        this.#disciplina = disciplina;
    }

    getId() {
        return this.#id;
    }

    getNome() {
        return this.#nome;
    }

    getDisciplina() {
        return this.#disciplina;
    }

    render() {
        const artigo = document.createElement("article");
        const titulo = document.createElement("h2");
        const disciplina = document.createElement("p");

        titulo.textContent = this.#nome;
        disciplina.textContent = `Disciplina: ${this.#disciplina}`;

        artigo.append(titulo, disciplina);
        return artigo;
    }
}
