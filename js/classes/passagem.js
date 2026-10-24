export class Passagem {
    static proximoId = 1;

    #id;
    #equipe;
    #checkpoint;
    #dataHora;

    constructor(equipe, checkpoint, dataHora, id = null) {
        if (!equipe || !checkpoint) {
            throw new Error(
                "Selecione a equipe e o checkpoint."
            );
        }

        if (equipe.corrida?.id !== checkpoint.corrida?.id) {
            throw new Error(
                "A equipe e o checkpoint devem pertencer à mesma corrida."
            );
        }

        if (!dataHora || Number.isNaN(Date.parse(dataHora))) {
            throw new Error("Informe uma data e hora válidas.");
        }

        this.#id = id ?? Passagem.proximoId++;
        this.#equipe = equipe;
        this.#checkpoint = checkpoint;
        this.#dataHora = dataHora;

        if (id !== null && id >= Passagem.proximoId) {
            Passagem.proximoId = id + 1;
        }
    }

    get id() {
        return this.#id;
    }

    get equipe() {
        return this.#equipe;
    }

    get checkpoint() {
        return this.#checkpoint;
    }

    get dataHora() {
        return this.#dataHora;
    }
}
