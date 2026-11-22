from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Checkpoint, Equipe, Passagem

passagem_bp = Blueprint("passagens", __name__, url_prefix="/api/passagens")


def to_json(passagem):
    return {
        "id": passagem.id,
        "equipeId": passagem.equipe_id,
        "checkpointId": passagem.checkpoint_id,
        "dataHora": passagem.data_hora,
    }


def validar(dados):
    try:
        equipe = db.session.get(Equipe, int(dados.get("equipeId")))
        checkpoint = db.session.get(Checkpoint, int(dados.get("checkpointId")))
    except (TypeError, ValueError):
        return "Selecione a equipe e o checkpoint."

    if not equipe or not checkpoint:
        return "Equipe ou checkpoint não encontrado."
    if equipe.corrida_id != checkpoint.corrida_id:
        return "Equipe e checkpoint devem pertencer à mesma corrida."
    if not dados.get("dataHora"):
        return "Informe a data e a hora da passagem."
    return None


@passagem_bp.get("")
def listar():
    return jsonify([to_json(p) for p in Passagem.query.all()])


@passagem_bp.post("")
def criar():
    dados = request.get_json() or {}
    erro = validar(dados)
    if erro:
        return jsonify({"erro": erro}), 400

    passagem = Passagem(
        equipe_id=int(dados["equipeId"]),
        checkpoint_id=int(dados["checkpointId"]),
        data_hora=dados["dataHora"],
    )
    db.session.add(passagem)
    db.session.commit()
    return jsonify(to_json(passagem)), 201


@passagem_bp.put("/<int:id>")
def atualizar(id):
    passagem = db.session.get(Passagem, id)
    if not passagem:
        return jsonify({"erro": "Passagem não encontrada."}), 404

    dados = {**to_json(passagem), **(request.get_json() or {})}
    erro = validar(dados)
    if erro:
        return jsonify({"erro": erro}), 400

    passagem.equipe_id = int(dados["equipeId"])
    passagem.checkpoint_id = int(dados["checkpointId"])
    passagem.data_hora = dados["dataHora"]
    db.session.commit()
    return jsonify(to_json(passagem))


@passagem_bp.delete("/<int:id>")
def excluir(id):
    passagem = db.session.get(Passagem, id)
    if not passagem:
        return jsonify({"erro": "Passagem não encontrada."}), 404

    db.session.delete(passagem)
    db.session.commit()
    return "", 204