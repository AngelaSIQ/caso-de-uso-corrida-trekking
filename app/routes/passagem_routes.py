from datetime import datetime

from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Passagem

passagem_bp = Blueprint("passagens", __name__, url_prefix="/api/passagens")


def passagem_json(passagem):
    return {
        "id": passagem.id,
        "corrida_id": passagem.corrida_id,
        "checkpoint_id": passagem.checkpoint_id,
        "equipe_id": passagem.equipe_id,
        "data_hora": passagem.data_hora.isoformat(),
    }


@passagem_bp.get("")
def listar_passagens():
    return jsonify([passagem_json(item) for item in Passagem.query.order_by(Passagem.data_hora.desc()).all()])


@passagem_bp.get("/<int:passagem_id>")
def buscar_passagem(passagem_id):
    passagem = db.session.get(Passagem, passagem_id)
    if not passagem:
        return jsonify({"erro": "Passagem não encontrada"}), 404
    return jsonify(passagem_json(passagem))


@passagem_bp.post("")
def criar_passagem():
    dados = request.get_json() or {}
    try:
        passagem = Passagem(
            corrida_id=int(dados["corrida_id"]),
            checkpoint_id=int(dados["checkpoint_id"]),
            equipe_id=int(dados["equipe_id"]),
            data_hora=datetime.fromisoformat(dados["data_hora"]),
        )
        db.session.add(passagem)
        db.session.commit()
        return jsonify(passagem_json(passagem)), 201
    except (KeyError, ValueError):
        db.session.rollback()
        return jsonify({"erro": "Dados inválidos ou data_hora ausente"}), 400


@passagem_bp.put("/<int:passagem_id>")
def atualizar_passagem(passagem_id):
    passagem = db.session.get(Passagem, passagem_id)
    if not passagem:
        return jsonify({"erro": "Passagem não encontrada"}), 404
    dados = request.get_json() or {}
    for campo in ("corrida_id", "checkpoint_id", "equipe_id"):
        if campo in dados:
            setattr(passagem, campo, int(dados[campo]))
    if "data_hora" in dados:
        passagem.data_hora = datetime.fromisoformat(dados["data_hora"])
    db.session.commit()
    return jsonify(passagem_json(passagem))


@passagem_bp.delete("/<int:passagem_id>")
def excluir_passagem(passagem_id):
    passagem = db.session.get(Passagem, passagem_id)
    if not passagem:
        return jsonify({"erro": "Passagem não encontrada"}), 404
    db.session.delete(passagem)
    db.session.commit()
    return "", 204
