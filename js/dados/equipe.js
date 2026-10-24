
import { Equipe } from "../classes/equipes.js";
import { EquipeDesclassificada } from "../classes/equipedesclassificada.js";

export function listarEquipes() {
    return [
        new Equipe(1, "Trilheiros RN", 1, 5, "14:32"),
        new Equipe(2, "Aventureiros", 2, 4, "14:41"),
        new Equipe(3, "Exploradores", 3, 3, "14:50"),
        new EquipeDesclassificada(
            4,
            "Equipe Alpha",
            4,
            2,
            "15:02",
            "Rota Incorreta"
        )
    ];
}