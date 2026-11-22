from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Corrida

corrida_bp = Blueprint("corridas", __name__, url_prefix="/api/corridas")


def to_json(corrida):
    return {"id": corrida.id, "nome": corrida.nome, "data": corrida.data}


@corrida_bp.get("")
def listar():
    return jsonify([to_json(c) for c in Corrida.query.all()])


@corrida_bp.post("")
def criar():
    dados = request.get_json() or {}
    nome = str(dados.get("nome", "")).strip()
    if not nome:
        return jsonify({"erro": "Informe o nome da corrida."}), 400

    corrida = Corrida(nome=nome, data=dados.get("data"))
    db.session.add(corrida)
    db.session.commit()
    return jsonify(to_json(corrida)), 201


@corrida_bp.put("/<int:id>")
def atualizar(id):
    corrida = db.session.get(Corrida, id)
    if not corrida:
        return jsonify({"erro": "Corrida não encontrada."}), 404

    dados = request.get_json() or {}
    nome = str(dados.get("nome", corrida.nome)).strip()
    if not nome:
        return jsonify({"erro": "Informe o nome da corrida."}), 400

    corrida.nome = nome
    corrida.data = dados.get("data", corrida.data)
    db.session.commit()
    return jsonify(to_json(corrida))


@corrida_bp.delete("/<int:id>")
def excluir(id):
    corrida = db.session.get(Corrida, id)
    if not corrida:
        return jsonify({"erro": "Corrida não encontrada."}), 404

    if corrida.equipes or corrida.checkpoints:
        return jsonify({
            "erro": "Não é possível excluir a corrida: há equipes ou checkpoints associados."
        }), 409

    db.session.delete(corrida)
    db.session.commit()
    return "", 204