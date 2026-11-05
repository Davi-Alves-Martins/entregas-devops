# Simulação de Rollback

## Versionamento
Usamos versionamento semântico (MAJOR.MINOR.PATCH) nas tags Git e nas imagens do GHCR.

## Cenário
- v1.0.0: versão estável, publicada e em homologação.
- v1.1.0: versão com falha (descrever aqui o que quebrou).

## Procedimento de rollback
1. Detectar a falha (o deploy ou o curl de verificação falhou).
2. Abrir Actions > Rollback > Run workflow.
3. Informar a versão estável: 1.0.0.
4. O workflow baixa a imagem ghcr.io/<usuario>/<repo>:1.0.0 e sobe o container.
5. A verificação com curl confirma que o serviço voltou.

## Evidências
(Cole aqui os prints: run falho da v1.1.0, run do Rollback, imagens em Packages.)
