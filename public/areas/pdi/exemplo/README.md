# Trilha de Exemplo Única

Esta pasta contém uma única trilha de exemplo chamada `trilha-exemplo-unica` que demonstra todas as variações solicitadas (internos, externos, com/sem botão, com/sem duração, flags obrigatório/desejável, cursos com 1 e com múltiplas seções, cursos longos em horas).

Local: `public/areas/pdi/exemplo/`

Trilha: `trilha-exemplo-unica`

Cursos incluídos nesta trilha:

- Curso Interno - Uma Seção (sem tempo)
- Curso Interno - Múltiplas Seções (com tempo)
- Curso Interno - Com Horas (3 horas)
- Curso Interno - Obrigatório (flag `required` no `team.json`)
- Curso Interno - Desejável (flag `recommended` no `team.json`)
- Curso Externo - Com Botão (link exibido)
- Curso Externo - Sem Botão (link sem botão)
- Curso Externo - Com Duração (exibe duration)

Como testar localmente

1. Inicie o servidor do projeto:
   powershell.exe
   npm run dev

2. Abra o navegador em `http://localhost:3000` (ou porta configurada).
3. Navegue: PDI → Trilha de Exemplo Única → abra os cursos.

Observações

- Cursos internos estão em `public/areas/pdi/exemplo/cursos/` com uma pasta por curso.
- Cursos externos não precisam de arquivos locais; são links no `team.json`.
- Se algum curso não aparecer, verifique o campo `folder` no `team.json` e o nome da pasta no disco.

Contribuições

Se quiser alterar/expandir a trilha de exemplo, edite `team.json` e adicione/edite as pastas em `cursos/`.

---

Arquivo gerado automaticamente para seguir a solicitação de manter apenas uma trilha de exemplo.
