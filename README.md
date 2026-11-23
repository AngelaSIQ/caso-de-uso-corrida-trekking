# caso-de-uso-corrida-trekking

Componentes:
- Ádina Lourrane Silva dos Santos.
- Angela Siqueira de Lima.
- Maria Clara Oliveira de Moura.
- Lidia Silva da Cruz.

## Visão geral

Este projeto realiza a integração final do sistema de controle de checkpoints em corridas de trekking com um **backend real em Python (Flask + SQLAlchemy + Flask-CORS)**. A interface web consome a API REST nos endpoints `/corridas`, `/equipes`, `/checkpoints` e `/passagens`, persistindo os dados em banco de dados relacional.

## Estrutura do projeto

- `app/` contém a aplicação backend em Flask, incluindo modelos (`models/`), configuração de banco (`database.py`) e rotas REST (`routes/`).
- `seed.py` popula o banco de dados com registros iniciais para testes e demonstração.
- `js/api/` concentra as chamadas HTTP (`fetch`) apontando para a API Flask (`http://127.0.0.1:5000`).
- `js/dados/armazenamento.js` transforma as respostas da API em entidades do domínio e reconstrói associações.
- `js/interface/` gerencia a renderização das telas e interação com o usuário.
- `js/classes/` mantém as validações e regras de negócio no frontend.

## Instalação e execução

### 1. Backend (Flask)

Crie e ative o ambiente virtual Python:

```bash
python -m venv venv
source venv/Scripts/activate  

```

Instale as dependências:

```bash
pip install -r requirements.txt

```

Popule o banco de dados inicial:

```bash
python seed.py

```

Inicie o servidor da API:

```bash
flask run

```

A API estará disponível em `http://127.0.0.1:5000`.

### 2. Frontend

Com o servidor Flask ativo, abra o arquivo `index.html` utilizando um servidor HTTP local (como a extensão **Live Server** do VS Code, geralmente na porta `5500`) para que as requisições entre origens distintas (CORS) funcionem corretamente.

## Regras de negócio preservadas

* Não é possível excluir uma corrida que ainda possui equipes ou checkpoints associados.
* Não é possível excluir uma equipe ou um checkpoint quando existem passagens vinculadas a eles.
* A passagem exige que equipe e checkpoint pertençam à mesma corrida.
* As operações de cadastro, edição e exclusão atualizam a interface após a resposta da API.

## Entrega

* Repositório: https://github.com/AngelaSIQ/caso-de-uso-corrida-trekking
* Branch da atividade: `integracao-final`

```