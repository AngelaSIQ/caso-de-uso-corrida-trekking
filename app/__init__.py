"""Configuração e fábrica da aplicação Flask."""

from flask import Flask
from flask_cors import CORS

from app.database import db
from app.routes.checkpoint_routes import checkpoint_bp
from app.routes.corrida_routes import corrida_bp
from app.routes.equipe_routes import equipe_bp
from app.routes.passagem_routes import passagem_bp


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

	return application


app = create_app()
