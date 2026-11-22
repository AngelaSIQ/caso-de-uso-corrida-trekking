from app import app
from app.database import db
from app.models import Checkpoint, Corrida, Equipe, Passagem

with app.app_context():
    db.drop_all()
    db.create_all()

    serra = Corrida(nome="Trekking Serra Verde", data="2026-11-15")
    pedra = Corrida(nome="Desafio da Pedra Azul", data="2026-11-22")
    db.session.add_all([serra, pedra])
    db.session.flush()

    trilheiros = Equipe(
        nome="Trilheiros do Norte", integrantes="Ana, Bruno e Caio", corrida_id=serra.id
    )
    passo = Equipe(
        nome="Passo a Passo", integrantes="Diana, Eduardo e Fátima", corrida_id=serra.id
    )
    montanha = Equipe(
        nome="Rota da Montanha", integrantes="Gisele, Hugo e Ivo", corrida_id=pedra.id
    )

    lagoa = Checkpoint(nome="Lagoa", localizacao="Margem da Lagoa Azul", corrida_id=serra.id)
    mirante = Checkpoint(nome="Mirante", localizacao="Topo da Serra", corrida_id=serra.id)
    cachoeira = Checkpoint(
        nome="Cachoeira", localizacao="Base da queda d'água", corrida_id=pedra.id
    )

    db.session.add_all([trilheiros, passo, montanha, lagoa, mirante, cachoeira])
    db.session.flush()

    db.session.add_all([
        Passagem(equipe_id=trilheiros.id, checkpoint_id=lagoa.id, data_hora="2026-11-15T08:15"),
        Passagem(equipe_id=passo.id, checkpoint_id=mirante.id, data_hora="2026-11-15T09:05"),
        Passagem(equipe_id=montanha.id, checkpoint_id=cachoeira.id, data_hora="2026-11-22T07:40"),
    ])
    db.session.commit()
    print("Banco populado com sucesso.")