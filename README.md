# caso-de-uso-corrida-trekking

# caso-de-uso-corrida-trekking

Componentes:
Ádina Lourrane Silva dos Santos.
Angela Siqueira de Lima.
Maria Clara Oliveira de Moura.
Lidia Silva da Cruz.


## Visão geral

Sistema de controle de checkpoints em corridas de trekking. O **frontend** (HTML, CSS e JavaScript) consome a **API REST em Flask** (backend), que persiste os dados em SQLite.

- Frontend: `http://localhost:8000`
- Backend (API): `http://localhost:5000/api`

Como o frontend (porta 8000) e a API (porta 5000) têm origens distintas, o backend habilita o **CORS** com `Flask-CORS`.

## Requisitos

- Python 3.10 ou superior
- Node.js (somente para rodar os testes do frontend)

## Instalação e execução

### 1. Backend (Flask)

```bash
python -m venv venv
```

Ative o ambiente virtual:

- Windows (PowerShell): `venv\Scripts\Activate.ps1`
- Windows (CMD): `venv\Scripts\activate.bat`
- Linux/Mac: `source venv/bin/activate`

Instale as dependências, popule o banco e inicie a API:

```bash
pip install -r requirements.txt
python seed.py
flask run
```

A API ficará em `http://127.0.0.1:5000`.

### 2. Frontend

Em **outro terminal**, na pasta do projeto:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`. Não abra os arquivos HTML direto do disco: o navegador precisa acessar o frontend por HTTP.

## Rotas da API

| Recurso | Rota |
|---|---|
| Corridas | `/api/corridas` |
| Equipes | `/api/equipes` |
| Checkpoints | `/api/checkpoints` |
| Passagens | `/api/passagens` |

Cada recurso aceita `GET`, `POST`, `PUT /<id>` e `DELETE /<id>`.

## Regras de negócio

- Não é possível excluir uma corrida que ainda tem equipes ou checkpoints associados (HTTP 409).
- Não é possível excluir uma equipe ou um checkpoint com passagens vinculadas (HTTP 409).
- A passagem exige que equipe e checkpoint pertençam à mesma corrida (HTTP 400).

## Dados iniciais

O comando `python seed.py` apaga e recria o banco com 2 corridas, 3 equipes, 3 checkpoints e 3 passagens de exemplo.

## Testes do frontend

```bash
npm install
npm test
```

Os testes usam uma API simulada e não alteram o banco.

## Entrega

- Repositório: https://github.com/AngelaSIQ/caso-de-uso-corrida-trekking
- Branch da atividade: `integracao-final`
