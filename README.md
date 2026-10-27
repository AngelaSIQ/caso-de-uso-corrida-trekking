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
`js/dados/armazenamento.js` consulta a API, reconstrói as associações entre
entidades e impede excluir equipes ou checkpoints usados por passagens.

## API REST com JSON Server

A interface dos cadastros consulta a API REST do JSON Server. O arquivo
`db.json` contém dados iniciais de corridas, equipes, checkpoints e passagens;
as associações são armazenadas pelos campos `corridaId`, `equipeId` e
`checkpointId`.

### Instalação e execução

Instale as dependências do projeto e inicie a API:

```bash
npm install
npm run api
```

O JSON Server ficará disponível em `http://localhost:3000`. Os recursos REST
são `/corridas`, `/equipes`, `/checkpoints` e `/passagens`.

Em outro terminal, sirva os arquivos da interface, por exemplo:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador. Mantenha os dois servidores em
execução enquanto utiliza o sistema. Para verificar a API, acesse
`http://localhost:3000/corridas` ou consulte os demais recursos. As operações
de cadastro, edição e exclusão persistem diretamente no `db.json`.

## Módulos da API

`js/api/http.js` centraliza as requisições HTTP. Os módulos
`js/api/corridas.js`, `js/api/equipes.js`, `js/api/checkpoints.js` e
`js/api/passagens.js` expõem as operações de listar, cadastrar, atualizar e
excluir. `js/dados/armazenamento.js` transforma as respostas em entidades do
domínio e mantém as associações usadas pela interface.
