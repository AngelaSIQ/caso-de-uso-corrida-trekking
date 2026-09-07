from app.database import db


class Checkpoint(db.Model):
    __tablename__ = "checkpoints"

    id = db.Column(db.Integer, primary_key=True)
    identificacao_local = db.Column(db.String(150), nullable=False)
    professor_responsavel = db.Column(db.String(120), nullable=False)
    ordem = db.Column(db.Integer, nullable=False)
    corrida_id = db.Column(db.Integer, db.ForeignKey("corridas.id"), nullable=False)

    corrida = db.relationship("Corrida", back_populates="checkpoints")
    passagens = db.relationship("Passagem", back_populates="checkpoint", cascade="all, delete-orphan")
