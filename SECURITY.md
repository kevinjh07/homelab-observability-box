# Política de Segurança

O projeto roda em uma rede local de confiança e inclui, de propósito, escolhas inadequadas a produção (API de exemplo sem autenticação, credenciais padrão `admin/admin` no Grafana, serviços expostos em `0.0.0.0` na LAN). Essas características estão documentadas na seção **Segurança** do [README](README.md) e não são vulnerabilidades.

## Reportando uma vulnerabilidade

Encontrou um problema de segurança **real** (no código da API, em uma config que vaze dados, ou em uma dependência)? **Não** abra uma issue pública. Use o canal privado do GitHub:

1. Vá em **Security** > **Report a vulnerability** (GitHub Security Advisories) neste repositório.
2. Descreva o problema, o impacto e, se possível, um passo a passo para reproduzir.

Não há SLA formal, mas correções de segurança têm prioridade; espere um primeiro retorno em alguns dias.

## Boas práticas ao usar o projeto

- Troque `GRAFANA_ADMIN_PASSWORD` antes de expor a box na LAN.
- Mantenha a stack atrás da sua rede local ou de uma VPN; não exponha as portas na internet.
- Mantenha as imagens base atualizadas (`docker compose pull`) e revise as versões fixadas no `docker-compose.yml`.
