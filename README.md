# WTD - Trilhas de Treinamento

Sistema de gerenciamento de trilhas de treinamento com suporte a cursos manuais internos, deeplinks para compartilhamento e interface moderna com tema claro/escuro.

## Principais mudanças recentes
- Cursos manuais em Markdown, com suporte a imagens e vídeo
- Deeplinks para áreas, equipes, trilhas, cursos e seções
- Trilha de exemplos (aparece somente em ambiente local)
- Links no conteúdo Markdown abrem em nova aba por padrão
- Cursos externos abrem diretamente (sem modal) quando clicados no card

## Índice
- Início Rápido
- Como Rodar Localmente
- Estrutura do Projeto
- Como Adicionar Conteúdo
- Comportamentos Importantes

## Início Rápido

1. Clone o repositório

```powershell
git clone <url-do-repositorio>
cd pdi-learning-hub
```

2. Inicie um servidor local (recomendado)

```powershell
npm install
npm run dev
```

ou, se preferir um servidor simples:

```powershell
# Python 3
python -m http.server 8080
```

3. Abra no navegador:

http://localhost:3000 (ou porta configurada)

> Observação: A trilha de exemplos localizada em `public/areas/pdi/exemplo` só é incluída quando a aplicação é executada em ambiente local (localhost, 127.0.0.1 ou protocolo file:). Em ambientes de produção/CI (ex.: GitLab Pages), a trilha `exemplo` será filtrada e não será exibida.

## Estrutura do Projeto (resumida)

public/
- index.html
- areas/
  - pdi/
    - area.json
    - exemplo/
      - team.json    ← Trilha de exemplos (visível apenas localmente)
      - cursos/
    - outras equipes...
- assets/
  - scripts/main.js
  - styles/main.css

## Como Adicionar Conteúdo

- Arquivos de equipe: `public/areas/<area>/<team>/team.json` (contém trilhas e cursos)
- Cursos externos: adicionar objeto com `link` no `courses` da trilha
- Cursos internos/manuais: adicionar objeto com `type: "manual"` e `coursePath` apontando para a pasta do curso onde exista `curso.json`
- Cursos internos simples (indicação): adicionar objeto sem `link` nem `coursePath` — nesses casos o card não exibirá botão de ação nem botão de copiar link

Exemplo de curso manual no `team.json`:

```json
{
  "type": "manual",
  "name": "Curso Exemplo",
  "courseId": "curso-exemplo",
  "coursePath": "areas/pdi/exemplo/cursos/curso-exemplo",
  "time": "30 min"
}
```

## Comportamentos importantes

- Links embutidos em arquivos Markdown são reescritos para abrir em uma nova aba (`target="_blank"` e `rel="noopener noreferrer"`).
- Clicar em um curso externo no card abre o link diretamente em nova aba. O modal de confirmação é usado apenas quando a navegação vier por deeplink ou for necessário exibir detalhes antes de redirecionar.
- O botão "Copiar link" aparece apenas quando o curso possui um link externo (`link`), uma pasta interna (`folder`/`coursePath`) ou é um curso manual com `courseId`.
- Deeplinks têm o formato: `#/area/<AreaName>/<TeamName>/<trackId>/<courseId>/section/<n>` — use o botão copiar para compartilhar.

## Troubleshooting rápido
- Se arquivos JSON não carregarem: rode via servidor (não abra `index.html` direto no disco) e verifique o console do navegador (F12).
- Curso não aparece: verifique `coursePath`/`folder` e o nome da pasta no disco; valide JSON em jsonlint.com.

## Contribuição
- Abra uma branch, faça alterações e crie PRs para avaliação.

---

Versão: 1.0.1
Última atualização: Janeiro 2026