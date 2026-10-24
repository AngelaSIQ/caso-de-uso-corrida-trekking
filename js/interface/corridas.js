import { listarCorridas } from "../dados/corridas.js";

const lista = document.getElementById("lista-corridas");

if (lista) {
    const corridas = listarCorridas();

    corridas.forEach(corrida => {
        lista.appendChild(corrida.render());
    });
}
