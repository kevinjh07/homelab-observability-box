# Contribuindo

Clareza e simplicidade valem mais do que sofisticação aqui — tenha isso em mente ao contribuir.

## Como contribuir

1. Abra uma _issue_ descrevendo o bug ou a melhoria antes de um PR grande, para alinharmos a abordagem.
2. Faça um _fork_ e crie um branch a partir de `main` (ex.: `fix/alerta-logs` ou `feat/dashboard-tempo`).
3. Faça as mudanças, garanta que tudo passa (veja abaixo) e abra o Pull Request descrevendo o _quê_ e o _porquê_.

## Configurando o ambiente

Na **raiz** do repositório ficam o Prettier, o ESLint e o Husky, que padronizam formatação e lint de todo o projeto (TypeScript da API, JavaScript do gerador e os arquivos de config). Instale o tooling uma vez:

```bash
npm install
```

Isso também ativa o hook de Git via Husky. A partir daí, todo `git commit` roda o **lint-staged**, que aplica `eslint --fix` e `prettier --write` apenas nos arquivos alterados — se o ESLint encontrar um erro que não dá para corrigir automaticamente, o commit é bloqueado.

Comandos úteis (na raiz):

```bash
npm run format        # formata o repositório
npm run format:check  # só verifica (é o que o CI roda)
npm run lint
npm run lint:fix      # corrige o que for automático
```

## Desenvolvendo a API

O código da API mora em `api/` (Express + TypeScript) e tem testes em Vitest com **cobertura de 100%**.

```bash
cd api
npm install
npm test
npm run test:coverage   # testes + relatório de cobertura
npm run build           # type-check + transpile (tsc)
```

Antes de abrir o PR, confirme localmente:

- `npm run build` passa sem erros de tipo.
- `npm run test:coverage` passa — a cobertura precisa **continuar em 100%** (statements, branches, functions e lines). Os thresholds estão fixados em `api/vitest.config.ts`; testes novos devem acompanhar todo código novo.
- `index.ts` e `tracing.ts` são excluídos da cobertura por serem _entrypoints_ de bootstrap.

O CI no GitHub Actions roda lint + formatação + build + cobertura em cada push e PR; PRs só entram com o CI verde.

## Mexendo na stack (Docker / configs)

Ao alterar `docker-compose.yml` ou as configs (`prometheus/`, `loki/`, `tempo/`, `promtail/`, `grafana/`, `blackbox/`):

- Rode `docker compose config -q` para validar a sintaxe.
- Pine imagens em versões específicas (evite `:latest`) para manter builds reproduzíveis.
- Se possível, suba a stack (`docker compose up -d --build`) e confira `docker compose logs` do serviço alterado antes de enviar.

## Estilo de commit

- Mensagens em português, no imperativo, com prefixo de tipo: `fix:`, `feat:`, `docs:`, `infra:`, `chore:`.
- Primeira linha curta e objetiva; use o corpo para detalhar o _porquê_ quando a mudança não for óbvia.

## Código de conduta

Ao participar, você concorda em seguir o nosso [Código de Conduta](CODE_OF_CONDUCT.md).
