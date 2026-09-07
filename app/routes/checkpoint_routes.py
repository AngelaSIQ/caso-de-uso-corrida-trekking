from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Checkpoint

checkpoint_bp = Blueprint("checkpoints", __name__, url_prefix="/api/checkpoints")


def checkpoint_json(checkpoint):
    return {
        "id": checkpoint.id,
        "identificacao_local": checkpoint.identificacao_local,
        "professor_responsavel": checkpoint.professor_responsavel,
        "ordem": checkpoint.ordem,
        "corrida_id": checkpoint.corrida_id,
    }


@checkpoint_bp.get("")
def listar_checkpoints():
    return jsonify([checkpoint_json(item) for item in Checkpoint.query.order_by(Checkpoint.ordem).all()])


@checkpoint_bp.get("/<int:checkpoint_id>")
def buscar_checkpoint(checkpoint_id):
    checkpoint = db.session.get(Checkpoint, checkpoint_id)
    if not checkpoint:
        return jsonify({"erro": "Checkpoint não encontrado"}), 404
    return jsonify(checkpoint_json(checkpoint))


@checkpoint_bp.post("")
def criar_checkpoint():
    dados = request.get_json() or {}
    try:
        checkpoint = Checkpoint(
            identificacao_local=dados["identificacao_local"],
            professor_responsavel=dados["professor_responsavel"],
            ordem=int(dados["ordem"]),
            corrida_id=int(dados["corrida_id"]),
        )
        db.session.add(checkpoint)
        db.session.commit()
        return jsonify(checkpoint_json(checkpoint)), 201
    except (KeyError, ValueError):
        db.session.rollback()
        return jsonify({"erro": "Dados inválidos para o checkpoint"}), 400


@checkpoint_bp.put("/<int:checkpoint_id>")
def atualizar_checkpoint(checkpoint_id):
    checkpoint = db.session.get(Checkpoint, checkpoint_id)
    if not checkpoint:
        return jsonify({"erro": "Checkpoint não encontrado"}), 404
    dados = request.get_json() or {}
    for campo in ("identificacao_local", "professor_responsavel"):
        if campo in dados:
            setattr(checkpoint, campo, dados[campo])
    if "ordem" in dados:
        checkpoint.ordem = int(dados["ordem"])
    if "corrida_id" in dados:
        checkpoint.corrida_id = int(dados["corrida_id"])
    db.session.commit()
    return jsonify(checkpoint_json(checkpoint))


@checkpoint_bp.delete("/<int:checkpoint_id>")
def excluir_checkpoint(checkpoint_id):
    checkpoint = db.session.get(Checkpoint, checkpoint_id)
    if not checkpoint:
        return jsonify({"erro": "Checkpoint não encontrado"}), 404
    db.session.delete(checkpoint)
    db.session.commit()
    return "", 204
