from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Corrida, Equipe

equipe_bp = Blueprint("equipes", __name__, url_prefix="/api/equipes")


def to_json(equipe):
    return {
        "id": equipe.id,
        "nome": equipe.nome,
        "integrantes": equipe.integrantes,
        "corridaId": equipe.corrida_id,
    }


def validar(dados):
    if not str(dados.get("nome", "")).strip():
        return "Informe o nome da equipe."
    try:
        corrida = db.session.get(Corrida, int(dados.get("corridaId")))
    except (TypeError, ValueError):
        return "Selecione uma corrida."
    if not corrida:
        return "Corrida não encontrada."
    return None


@equipe_bp.get("")
def listar():
    return jsonify([to_json(e) for e in Equipe.query.all()])


@equipe_bp.post("")
def criar():
    dados = request.get_json() or {}
    erro = validar(dados)
    if erro:
        return jsonify({"erro": erro}), 400

    equipe = Equipe(
        nome=str(dados["nome"]).strip(),
        integrantes=dados.get("integrantes") or "",
        corrida_id=int(dados["corridaId"]),
    )
    db.session.add(equipe)
    db.session.commit()
    return jsonify(to_json(equipe)), 201


@equipe_bp.put("/<int:id>")
def atualizar(id):
    equipe = db.session.get(Equipe, id)
    if not equipe:
        return jsonify({"erro": "Equipe não encontrada."}), 404

    dados = {**to_json(equipe), **(request.get_json() or {})}
    erro = validar(dados)
    if erro:
        return jsonify({"erro": erro}), 400

    equipe.nome = str(dados["nome"]).strip()
    equipe.integrantes = dados.get("integrantes") or ""
    equipe.corrida_id = int(dados["corridaId"])
    db.session.commit()
    return jsonify(to_json(equipe))


@equipe_bp.delete("/<int:id>")
def excluir(id):
    equipe = db.session.get(Equipe, id)
    if not equipe:
        return jsonify({"erro": "Equipe não encontrada."}), 404

    if equipe.passagens:
        return jsonify({
            "erro": "Não é possível excluir a equipe: há passagens associadas."
        }), 409

    db.session.delete(equipe)
    db.session.commit()
    return "", 204