export class Passagem {
    static proximoId = 1;

    #id;
    #equipe;
    #checkpoint;

    constructor(equipe, checkpoint, id = null) {
        if (!equipe || !checkpoint) {
            throw new Error(
                "Selecione a equipe e o checkpoint."
            );
        }

        this.#id = id ?? Passagem.proximoId++;
        this.#equipe = equipe;
        this.#checkpoint = checkpoint;

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
}
