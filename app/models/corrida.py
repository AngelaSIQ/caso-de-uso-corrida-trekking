from app.database import db


class Corrida(db.Model):
    __tablename__ = "corridas"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    data = db.Column(db.String(10), nullable=True)

    equipes = db.relationship("Equipe", back_populates="corrida")
    checkpoints = db.relationship("Checkpoint", back_populates="corrida")