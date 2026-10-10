
import { Corrida } from "../classes/corridas.js";
import { corridas } from "../dados/corridas.js";


// Mostra as corridas na tabela
export function mostrarCorridas() {
    const tabela = document.getElementById("lista-corridas");

    tabela.innerHTML = "";

    for (const corrida of corridas) {
        const linha = document.createElement("tr");

        const nome = document.createElement("td");
        nome.textContent = corrida.getNome();

        const descricao = document.createElement("td");
        descricao.textContent = corrida.getDescricao();

        const data = document.createElement("td");
        data.textContent = corrida.getData();

        const status = document.createElement("td");
        status.textContent = corrida.getStatus();

        const acoes = document.createElement("td");

        if (corrida.getStatus() === "Criada") {
            const botaoIniciar = document.createElement("button");
            botaoIniciar.textContent = "Iniciar";

            botaoIniciar.addEventListener("click", () => {
                corrida.iniciar();
                mostrarCorridas();
            });

            acoes.appendChild(botaoIniciar);
        }

        if (corrida.getStatus() === "Iniciada") {
            const botaoEncerrar = document.createElement("button");
            botaoEncerrar.textContent = "Encerrar";

            botaoEncerrar.addEventListener("click", () => {
                corrida.encerrar();
                mostrarCorridas();
            });

            acoes.appendChild(botaoEncerrar);
        }

        linha.append(nome, descricao, data, status, acoes);
        tabela.appendChild(linha);
    }
}

// Configura o formulário de cadastro
export function configurarFormulario() {
    const formulario = document.getElementById("form-corrida");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const data = document.getElementById("data").value;

        if (!nome || !data) {
            alert("Preencha o nome e a data da corrida.");
            return;
        }

        const novoId = corridas.length > 0
            ? Math.max(...corridas.map(corrida => corrida.getId())) + 1
            : 1;

        const novaCorrida = new Corrida(
            novoId,
            nome,
            descricao,
            data
        );

        corridas.push(novaCorrida);

        formulario.reset();
        mostrarCorridas();
    });
}
