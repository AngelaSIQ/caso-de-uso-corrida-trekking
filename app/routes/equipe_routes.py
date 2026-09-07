from flask import Blueprint, jsonify, request

from app.database import db
from app.models import Equipe

equipe_bp = Blueprint("equipes", __name__, url_prefix="/api/equipes")


def equipe_json(equipe):
    return {"id": equipe.id, "nome": equipe.nome, "numero": equipe.numero, "integrantes": equipe.integrantes}


@equipe_bp.get("")
def listar_equipes():
    return jsonify([equipe_json(item) for item in Equipe.query.all()])


@equipe_bp.get("/<int:equipe_id>")
def buscar_equipe(equipe_id):
    equipe = db.session.get(Equipe, equipe_id)
    if not equipe:
        return jsonify({"erro": "Equipe não encontrada"}), 404
    return jsonify(equipe_json(equipe))


@equipe_bp.post("")
def criar_equipe():
    dados = request.get_json() or {}
    if not all(campo in dados for campo in ("nome", "numero", "integrantes")):
        return jsonify({"erro": "Informe nome, numero e integrantes"}), 400
    equipe = Equipe(nome=dados["nome"], numero=dados["numero"], integrantes=dados["integrantes"])
    db.session.add(equipe)
    db.session.commit()
    return jsonify(equipe_json(equipe)), 201


@equipe_bp.put("/<int:equipe_id>")
def atualizar_equipe(equipe_id):
    equipe = db.session.get(Equipe, equipe_id)
    if not equipe:
        return jsonify({"erro": "Equipe não encontrada"}), 404
    dados = request.get_json() or {}
    for campo in ("nome", "numero", "integrantes"):
        if campo in dados:
            setattr(equipe, campo, dados[campo])
    db.session.commit()
    return jsonify(equipe_json(equipe))


@equipe_bp.delete("/<int:equipe_id>")
def excluir_equipe(equipe_id):
    equipe = db.session.get(Equipe, equipe_id)
    if not equipe:
        return jsonify({"erro": "Equipe não encontrada"}), 404
    db.session.delete(equipe)
    db.session.commit()
    return "", 204
