import { listarProfessores } from "../dados/professores.js";

const lista = document.getElementById("lista-professores");

if (lista) {
    const professores = listarProfessores();

    professores.forEach(professor => {
        lista.appendChild(professor.render());
    });
}
