from datetime import date

from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Corrida, Equipe

corrida_bp = Blueprint("corridas", __name__, url_prefix="/api/corridas")


def corrida_json(corrida):
    return {
        "id": corrida.id,
        "nome": corrida.nome,
        "descricao": corrida.descricao,
        "data": corrida.data.isoformat(),
    }


@corrida_bp.get("")
def listar_corridas():
    return jsonify([corrida_json(corrida) for corrida in Corrida.query.all()])


@corrida_bp.get("/<int:corrida_id>")
def buscar_corrida(corrida_id):
    corrida = db.session.get(Corrida, corrida_id)
    if not corrida:
        return jsonify({"erro": "Corrida não encontrada"}), 404
    return jsonify(corrida_json(corrida))


@corrida_bp.post("")
def criar_corrida():
    dados = request.get_json() or {}
    try:
        corrida = Corrida(
            nome=dados["nome"],
            descricao=dados.get("descricao"),
            data=date.fromisoformat(dados["data"]),
        )
        db.session.add(corrida)
        db.session.commit()
        return jsonify(corrida_json(corrida)), 201
    except (KeyError, ValueError):
        db.session.rollback()
        return jsonify({"erro": "Informe nome e data no formato AAAA-MM-DD"}), 400


@corrida_bp.put("/<int:corrida_id>")
def atualizar_corrida(corrida_id):
    corrida = db.session.get(Corrida, corrida_id)
    if not corrida:
        return jsonify({"erro": "Corrida não encontrada"}), 404
    dados = request.get_json() or {}
    try:
        corrida.nome = dados.get("nome", corrida.nome)
        corrida.descricao = dados.get("descricao", corrida.descricao)
        if "data" in dados:
            corrida.data = date.fromisoformat(dados["data"])
        db.session.commit()
        return jsonify(corrida_json(corrida))
    except ValueError:
        db.session.rollback()
        return jsonify({"erro": "A data deve estar no formato AAAA-MM-DD"}), 400


@corrida_bp.delete("/<int:corrida_id>")
def excluir_corrida(corrida_id):
    corrida = db.session.get(Corrida, corrida_id)
    if not corrida:
        return jsonify({"erro": "Corrida não encontrada"}), 404
    db.session.delete(corrida)
    db.session.commit()
    return "", 204


@corrida_bp.get("/<int:corrida_id>/status")
def status_corrida(corrida_id):
    corrida = db.session.get(Corrida, corrida_id)
    if not corrida:
        return jsonify({"erro": "Corrida não encontrada"}), 404

    ranking = []
    for equipe in Equipe.query.all():
        passagens = [p for p in equipe.passagens if p.corrida_id == corrida_id]
        ranking.append({
            "equipe_id": equipe.id,
            "nome": equipe.nome,
            "numero": equipe.numero,
            "checkpoints_concluidos": len({p.checkpoint_id for p in passagens}),
            "ultima_passagem": max((p.data_hora for p in passagens), default=None),
        })
    ranking.sort(key=lambda item: item["checkpoints_concluidos"], reverse=True)
    for item in ranking:
        if item["ultima_passagem"]:
            item["ultima_passagem"] = item["ultima_passagem"].isoformat()

    return jsonify({"corrida": corrida_json(corrida), "ranking": ranking})
