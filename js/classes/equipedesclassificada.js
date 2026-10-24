import { Equipe } from "./equipes.js";
export class EquipeDesclassificada extends Equipe {
    #motivo;

    constructor(id, nome, numero, checkpoints, ultimaPassagem, motivo) {
        super(id, nome, numero, checkpoints, ultimaPassagem);
        this.#motivo = motivo;
    }

    render() {
        const linha = super.render("-");

        linha.classList.add("desclassificada");

        const celulaEquipe = linha.children[1];
        const etiqueta = document.createElement("span");

        etiqueta.className = "status-tag";
        etiqueta.textContent = `Desclassificada (${this.#motivo})`;

        celulaEquipe.appendChild(document.createTextNode(" "));
        celulaEquipe.appendChild(etiqueta);

        return linha;
    }
}
