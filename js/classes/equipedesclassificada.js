
import { Equipe } from "./equipes.js";

export class EquipeDesclassificada extends Equipe {
    #motivo;

    constructor(id, nome, numero, checkpoints, ultimaPassagem, motivo) {
        super(id, nome, numero, checkpoints, ultimaPassagem);
        this.#motivo = motivo;
    }

    render(posicao) {
        const linha = document.createElement("tr");
        linha.classList.add("desclassificada");

        linha.innerHTML = `
            <td>-</td>
            <td>${this.getNome()}
                <span class="status-tag">
                    Desclassificada (${this.#motivo})
                </span>
            </td>
            <td>${this.getNumero()}</td>
            <td>${this.getCheckpoints()}</td>
            <td>${this.getUltimaPassagem()}</td>
        `;

        return linha;
    }
}
