# caso-de-uso-corrida-trekking 

Componentes:
Ádina Lourrane Silva dos Santos.
Angela Siqueira de Lima.
Maria Clara Oliveira de Moura.
Lidia Silva da Cruz. 
Deisiane Costa Gomes.

## Módulo de componentes da interface

As classes de domínio em `js/classes/` representam os dados e as regras das
entidades e não possuem métodos de renderização HTML. A análise também
identificou no `index.html` as classes de apresentação `Equipe` e
`EquipeDesclassificada`, que implementavam `render()` para montar linhas do
ranking com posição, equipe, número, checkpoints, última passagem e situação de
desclassificação. Essas classes foram removidas e seus dados de demonstração
agora são apresentados por um componente de interface.

O módulo `js/interface/componentes.js` concentra a criação de itens de corrida,
equipe, checkpoint e passagem, opções dos formulários, estado de lista vazia e
linhas do ranking. Os itens de cadastro recebem callbacks para edição e
exclusão: os componentes associam os eventos, enquanto os módulos de interface
mantêm as operações, validações e persistência. A construção das linhas do
ranking também fica nesse módulo; `ranking.js` mantém a busca e os dados de
demonstração.

Os dados apresentados são: nome e data da corrida; nome, integrantes e corrida
associada à equipe; nome, localização e corrida associada ao checkpoint. A
passagem apresenta equipe, checkpoint, corrida e data/hora. O modelo de domínio
`Passagem` valida a data/hora e exige que equipe e checkpoint pertençam à mesma
corrida.

Os módulos `js/interface/corridas.js`, `js/interface/equipes.js` e
`js/interface/checkpoints.js` coordenam formulários, edição, exclusão e uso dos
componentes. `js/interface/passagens.js` faz o mesmo para registros de
passagem, oferecendo seleções de equipe e checkpoint filtradas pela corrida.
`js/interface/ranking.js` coordena a busca e a apresentação do ranking.
`js/dados/armazenamento.js` mantém os registros no `localStorage`, reconstrói as
associações entre entidades e impede excluir equipes ou checkpoints usados por
passagens.

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
