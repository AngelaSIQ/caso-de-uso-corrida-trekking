# caso-de-uso-corrida-trekking

Componentes:
Ádina Lourrane Silva dos Santos.
Angela Siqueira de Lima.
Maria Clara Oliveira de Moura.
Lidia Silva da Cruz.
Deisiane Costa Gomes.

## Visão geral

Este projeto adapta o estudo de caso de trekking para uso com uma API REST em JSON Server. A interface continua sendo a mesma, mas passou a consultar e persistir dados em `/corridas`, `/equipes`, `/checkpoints` e `/passagens`, sem depender do armazenamento local do navegador.

## Estrutura da adaptação

- `js/api/` concentra as chamadas HTTP e centraliza as operações de comunicação com a API.
- `js/dados/armazenamento.js` transforma as respostas em entidades do domínio, reconstrói associações e preserva regras de negócio.
- `js/interface/` continua responsável pela renderização e interação com o usuário.
- `js/classes/` mantém as validações do domínio, incluindo a verificação de relacionamento entre equipe e checkpoint.

A implementação foi ajustada para aceitar identificadores textuais, preservando o valor retornado pela API e comparando os IDs de forma consistente, sem forçar conversões numéricas.

## Instalação e execução

Instale as dependências:

```bash
npm install
```

Opção rápida para subir tudo junto:

```bash
npm run dev
```

Ou em terminais separados:

```bash
npm run api
```

```bash
npm run web
```

Acesse:

- API: http://localhost:3000
- Interface: http://localhost:8000

Importante: abra a interface via `http://localhost:8000` e não diretamente pelo arquivo HTML em disco. O navegador precisa acessar a API em `localhost:3000` por meio de HTTP para que o `fetch` funcione corretamente.

Para iniciar a interface e a API separadamente, use os comandos `npm run web` e `npm run api` em terminais diferentes. A API disponibiliza os recursos em `/corridas`, `/equipes`, `/checkpoints` e `/passagens`.

## Dados iniciais

O arquivo `db.json` contém registros iniciais em cada recurso e usa identificadores textuais para validar a integração com a API REST. Isso garante que o sistema funcione também com IDs como `corr-001`, `eq-001` e `pass-001`.

## Regras de negócio preservadas

- Não é possível excluir uma corrida que ainda possui equipes ou checkpoints associados.
- Não é possível excluir uma equipe ou um checkpoint quando existem passagens vinculadas a eles.
- A passagem exige que equipe e checkpoint pertençam à mesma corrida.
- As operações de edição, cadastro e exclusão atualizam a interface após a resposta da API.

## Testes

Execute a suíte automatizada:

```bash
npm test
```

Ela valida:

- carregamento e reconstrução de associações com IDs textuais;
- cadastro, edição e exclusão dos quatro recursos;
- bloqueio das exclusões que violam as regras de relacionamento;
- rejeição de passagem entre equipe e checkpoint de corridas diferentes;
- tratamento de falha de rede e de resposta HTTP de erro, sem alterar o estado local.

Também é possível verificar os recursos diretamente em `http://localhost:3000/corridas`, `/equipes`, `/checkpoints` e `/passagens`. Para testar a interface, abra cada página pelo servidor web e execute o cadastro, a edição e a exclusão, observando as respostas da API e o arquivo `db.json`.

Resultado validado: todos os cenários automatizados passam. Além da suíte, o JSON Server real foi testado com uma base temporária: GET, POST, PUT e DELETE funcionaram, preservando um ID textual. Os quatro recursos da base do projeto também responderam com HTTP 200 (2 corridas, 3 equipes, 3 checkpoints e 3 passagens). Os testes automatizados usam uma API simulada e não alteram o `db.json` do projeto.

## Entrega

A integração usa `fetch` e `async/await`, separa a comunicação da interface e apresenta mensagens compreensíveis para falhas de conexão e respostas HTTP de erro.

- Repositório: https://github.com/AngelaSIQ/caso-de-uso-corrida-trekking
- Branch da atividade: `capitulo-7-api-rest`
