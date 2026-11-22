from app.database import db


class Checkpoint(db.Model):
    __tablename__ = "checkpoints"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(150), nullable=False)
    localizacao = db.Column(db.String(200), nullable=True)
    corrida_id = db.Column(db.Integer, db.ForeignKey("corridas.id"), nullable=False)

    corrida = db.relationship("Corrida", back_populates="checkpoints")
    passagens = db.relationship("Passagem", back_populates="checkpoint")