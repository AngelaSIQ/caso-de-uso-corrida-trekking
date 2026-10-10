
import { Professor } from "../classes/professores.js";
import { professores } from "../dados/professores.js";

const formulario = document.getElementById("form-professor");
const lista = document.getElementById("lista-professores");

export function mostrarProfessores() {
    lista.innerHTML = "";

    professores.forEach((professor) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${professor.getNome()}</td>
            <td>${professor.getEmail()}</td>
            <td>
                <button type="button" data-id="${professor.getId()}">
                    Excluir
                </button>
            </td>
        `;

        lista.appendChild(linha);
    });
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nome || !email) {
        alert("Preencha todos os campos.");
        return;
    }

    const id = Date.now();
    const professor = new Professor(id, nome, email);

    professores.push(professor);

    formulario.reset();
    mostrarProfessores();
});

lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-id]");

    if (!botao) return;

    const id = Number(botao.dataset.id);
    const indice = professores.findIndex(
        (professor) => professor.getId() === id
    );

    if (indice !== -1) {
        professores.splice(indice, 1);
        mostrarProfessores();
    }
});

mostrarProfessores();
