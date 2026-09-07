from app.database import db


class Corrida(db.Model):
    __tablename__ = "corridas"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    data = db.Column(db.Date, nullable=False)

    checkpoints = db.relationship("Checkpoint", back_populates="corrida", cascade="all, delete-orphan")
    passagens = db.relationship("Passagem", back_populates="corrida", cascade="all, delete-orphan")
