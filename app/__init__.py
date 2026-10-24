"""Configuração e fábrica da aplicação Flask."""

from pathlib import Path

from flask import Flask, abort, send_from_directory
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
		project_root = Path(application.root_path).parent
		return send_from_directory(project_root, "index.html")

	@application.get("/<path:filename>")
	def frontend_file(filename):
		pages = {
			"index.html",
			"corridas.html",
			"equipes.html",
			"checkpoints.html",
			"passagens.html",
		}
		if filename not in pages and not filename.startswith(("css/", "js/")):
			abort(404)

		project_root = Path(application.root_path).parent
		return send_from_directory(project_root, filename)

	return application


app = create_app()
