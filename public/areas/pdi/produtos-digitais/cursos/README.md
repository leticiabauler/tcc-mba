# Cursos Manuais - Produtos Digitais

Esta pasta contém os cursos manuais da equipe **Produtos Digitais**.

## Como adicionar um novo curso manual

1. Crie uma pasta com o nome do curso (use kebab-case)
2. Dentro da pasta, crie os arquivos markdown (.md) com o conteúdo
3. Crie um arquivo `curso.json` com a estrutura do curso
4. No arquivo `team.json`, adicione o curso na trilha correspondente

### Estrutura de um curso

```
produtos-digitais/cursos/meu-curso/
├── curso.json          (configurações do curso)
├── introducao.md       (seção 1)
├── conceitos.md        (seção 2)
└── pratica.md         (seção 3)
```

### Exemplo de curso.json

```json
{
    "id": "meu-curso",
    "title": "Meu Curso Incrível",
    "description": "Descrição do curso",
    "duration": "2 horas",
    "author": "Equipe Produtos Digitais",
    "lastUpdate": "2026-01-14",
    "sections": [
        {
            "id": "introducao",
            "title": "Introdução",
            "type": "markdown",
            "content": "introducao.md"
        }
    ]
}
```

### Como referenciar no team.json

```json
{
    "name": "Meu Curso Incrível",
    "type": "manual",
    "coursePath": "areas/pdi/produtos-digitais/cursos/meu-curso",
    "description": "Descrição breve",
    "time": "2 horas",
    "onboarding": true
}
```

## Cursos disponíveis

- (Nenhum curso adicionado ainda)

---

Para mais detalhes, veja o curso exemplo em `qualidade/cursos/git-pratico/`
