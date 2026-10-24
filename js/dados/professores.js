
import { Professor } from "../classes/professor.js";

const professores = [
    new Professor(1, "Professor Exemplo", "Organização de Corridas")
];

export function listarProfessores() {
    return [...professores];
}
