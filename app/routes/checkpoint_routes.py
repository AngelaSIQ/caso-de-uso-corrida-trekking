from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Checkpoint, Corrida

checkpoint_bp = Blueprint("checkpoints", __name__, url_prefix="/api/checkpoints")


def to_json(checkpoint):
    return {
        "id": checkpoint.id,
        "nome": checkpoint.nome,
        "localizacao": checkpoint.localizacao,
        "corridaId": checkpoint.corrida_id,
    }


def validar(dados):
    if not str(dados.get("nome", "")).strip():
        return "Informe o nome do checkpoint."
    try:
        corrida = db.session.get(Corrida, int(dados.get("corridaId")))
    except (TypeError, ValueError):
        return "Selecione uma corrida."
    if not corrida:
        return "Corrida não encontrada."
    return None


@checkpoint_bp.get("")
def listar():
    return jsonify([to_json(c) for c in Checkpoint.query.all()])


@checkpoint_bp.post("")
def criar():
    dados = request.get_json() or {}
    erro = validar(dados)
    if erro:
        return jsonify({"erro": erro}), 400

    checkpoint = Checkpoint(
        nome=str(dados["nome"]).strip(),
        localizacao=dados.get("localizacao"),
        corrida_id=int(dados["corridaId"]),
    )
    db.session.add(checkpoint)
    db.session.commit()
    return jsonify(to_json(checkpoint)), 201


@checkpoint_bp.put("/<int:id>")
def atualizar(id):
    checkpoint = db.session.get(Checkpoint, id)
    if not checkpoint:
        return jsonify({"erro": "Checkpoint não encontrado."}), 404

    dados = {**to_json(checkpoint), **(request.get_json() or {})}
    erro = validar(dados)
    if erro:
        return jsonify({"erro": erro}), 400

    checkpoint.nome = str(dados["nome"]).strip()
    checkpoint.localizacao = dados.get("localizacao")
    checkpoint.corrida_id = int(dados["corridaId"])
    db.session.commit()
    return jsonify(to_json(checkpoint))


@checkpoint_bp.delete("/<int:id>")
def excluir(id):
    checkpoint = db.session.get(Checkpoint, id)
    if not checkpoint:
        return jsonify({"erro": "Checkpoint não encontrado."}), 404

    if checkpoint.passagens:
        return jsonify({
            "erro": "Não é possível excluir o checkpoint: há passagens associadas."
        }), 409

    db.session.delete(checkpoint)
    db.session.commit()
    return "", 204