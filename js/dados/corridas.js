
import { Corrida } from "../classes/corrida.js";

const corridas = [
    new Corrida(1, "Corrida de Trekking", "15/11/2026")
];

export function listarCorridas() {
    return [...corridas];
}
