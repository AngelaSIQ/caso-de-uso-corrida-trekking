"""Configuração e fábrica da aplicação Flask."""

from pathlib import Path

from flask import Flask, abort, send_from_directory
from flask_cors import CORS

from app.database import db
from app.routes.checkpoint_routes import checkpoint_bp
from app.routes.corrida_routes import corrida_bp
from app.routes.equipe_routes import equipe_bp
from app.routes.passagem_routes import passagem_bp

FRONTEND_ROOT = Path(__file__).resolve().parent.parent


def create_app():
	application = Flask(__name__)
	application.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///trekking.db"
	application.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

	CORS(application)
	db.init_app(application)
	application.register_blueprint(corrida_bp)
	application.register_blueprint(checkpoint_bp)
	application.register_blueprint(equipe_bp)
	application.register_blueprint(passagem_bp)

	with application.app_context():
		from app import models
		db.create_all()

	@application.get("/")
	def index():
		return {"mensagem": "API de Controle de Checkpoints em Corridas de Trekking"}

	@application.get("/<path:filename>")
	def arquivos_frontend(filename):
		if Path(filename).suffix.lower() not in {".html", ".css", ".js"}:
			abort(404)
		return send_from_directory(FRONTEND_ROOT, filename)

	return application


app = create_app()
