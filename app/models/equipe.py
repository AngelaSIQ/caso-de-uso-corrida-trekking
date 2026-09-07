from app.database import db


class Equipe(db.Model):
    __tablename__ = "equipes"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    numero = db.Column(db.Integer, nullable=False, unique=True)
    integrantes = db.Column(db.Text, nullable=False)

    passagens = db.relationship("Passagem", back_populates="equipe", cascade="all, delete-orphan")
