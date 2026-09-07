# caso-de-uso-corrida-trekking 

Componentes:
Ádina Lourrane Silva dos Santos.
Angela Siqueira de Lima.
Maria Clara Oliveira de Moura.
Lidia Silva da Cruz. 
Deisiane Costa Gomes.

## API Flask

### Ambiente virtual

```bash
python -m venv venv
source venv/bin/activate
```

No Windows, use `venv\Scripts\activate` para ativar o ambiente virtual.

### Instalação

```bash
pip install -r requirements.txt
```

### Execução

```bash
flask run
```

A API estará disponível em `http://127.0.0.1:5000`.

As rotas principais são `/api/corridas`, `/api/checkpoints`, `/api/equipes` e `/api/passagens`. O ranking da corrida atual está disponível em `/api/corridas/<id>/status`.
