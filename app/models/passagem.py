from app.database import db


class Passagem(db.Model):
    __tablename__ = "passagens"

    id = db.Column(db.Integer, primary_key=True)
    equipe_id = db.Column(db.Integer, db.ForeignKey("equipes.id"), nullable=False)
    checkpoint_id = db.Column(db.Integer, db.ForeignKey("checkpoints.id"), nullable=False)
    data_hora = db.Column(db.String(25), nullable=False)

    equipe = db.relationship("Equipe", back_populates="passagens")
    checkpoint = db.relationship("Checkpoint", back_populates="passagens")