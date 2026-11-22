from app.database import db


class Equipe(db.Model):
    __tablename__ = "equipes"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    integrantes = db.Column(db.Text, nullable=False)
    corrida_id = db.Column(db.Integer, db.ForeignKey("corridas.id"), nullable=False)

    corrida = db.relationship("Corrida", back_populates="equipes")
    passagens = db.relationship("Passagem", back_populates="equipe")