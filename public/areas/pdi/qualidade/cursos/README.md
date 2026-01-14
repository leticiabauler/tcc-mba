# Guia de Cursos Manuais

## Estrutura de Pastas

Os cursos manuais devem ser organizados da seguinte forma:

```
public/
└── areas/
    └── [nome-da-area]/
        └── cursos/
            └── [id-do-curso]/
                ├── curso.json          (Configuração do curso)
                ├── introducao.md       (Conteúdo em markdown)
                ├── secao1.md
                ├── secao2.md
                ├── video-demo.mp4      (Vídeos opcionais)
                ├── video-poster.jpg    (Thumbnail do vídeo)
                └── imagens/            (Pasta para imagens)
                    ├── diagrama1.png
                    └── exemplo1.jpg
```

## Exemplo: Estrutura de um Curso

### 1. Arquivo `curso.json`

Este arquivo define a estrutura do curso:

```json
{
    "id": "meu-curso-exemplo",
    "title": "Título do Curso",
    "description": "Descrição breve do curso",
    "duration": "3 horas",
    "author": "Nome do Autor ou Equipe",
    "lastUpdate": "2026-01-14",
    "sections": [
        {
            "id": "introducao",
            "title": "Introdução",
            "type": "markdown",
            "content": "introducao.md"
        },
        {
            "id": "video-demo",
            "title": "Demonstração Prática",
            "type": "video",
            "content": "video-demo.mp4",
            "poster": "video-poster.jpg"
        },
        {
            "id": "conclusao",
            "title": "Conclusão",
            "type": "markdown",
            "content": "conclusao.md"
        }
    ]
}
```

### 2. Arquivo Markdown (exemplo: `introducao.md`)

```markdown
# Título da Seção

Conteúdo da seção em **Markdown**.

## Subtítulo

- Item 1
- Item 2
- Item 3

### Código

\`\`\`javascript
function exemplo() {
    console.log("Hello World!");
}
\`\`\`

### Imagens

![Descrição da imagem](imagens/diagrama1.png)

> **Dica**: Use blockquotes para destacar informações importantes!
```

## Adicionando o Curso ao JSON da Equipe

No arquivo JSON da equipe (ex: `qualidade.json`), adicione o curso:

```json
{
    "id": "pdi-qualidade-labview",
    "name": "LabVIEW",
    "tracks": [
        {
            "courses": [
                {
                    "name": "Meu Curso Manual",
                    "type": "manual",
                    "courseId": "meu-curso-exemplo",
                    "coursePath": "areas/pdi/cursos/meu-curso-exemplo/curso.json",
                    "description": "Descrição do curso",
                    "time": "3 horas",
                    "buttonText": "Abrir curso",
                    "onboarding": true
                }
            ]
        }
    ]
}
```

## Tipos de Conteúdo Suportados

### 1. Markdown (`type: "markdown"`)

- Títulos (H1, H2, H3, etc.)
- Texto formatado (negrito, itálico)
- Listas (ordenadas e não ordenadas)
- Links
- Imagens
- Código (inline e blocos)
- Tabelas
- Blockquotes
- Linhas horizontais

### 2. Vídeo (`type: "video"`)

- Formato: MP4
- Controles nativos do navegador
- Suporta poster (thumbnail)

```json
{
    "id": "video-exemplo",
    "title": "Vídeo Tutorial",
    "type": "video",
    "content": "meu-video.mp4",
    "poster": "thumbnail.jpg"
}
```

## Recursos de Markdown Suportados

### Títulos
```markdown
# H1
## H2
### H3
```

### Ênfase
```markdown
**negrito**
*itálico*
~~tachado~~
```

### Listas
```markdown
- Item não ordenado
- Outro item

1. Item ordenado
2. Outro item
```

### Links e Imagens
```markdown
[Texto do link](https://exemplo.com)
![Alt da imagem](caminho/imagem.png)
```

### Código
```markdown
`código inline`

\`\`\`javascript
// Bloco de código
function exemplo() {
    return true;
}
\`\`\`
```

### Tabelas
```markdown
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Valor 1  | Valor 2  | Valor 3  |
| Valor 4  | Valor 5  | Valor 6  |
```

### Blockquotes
```markdown
> **Nota**: Informação importante aqui
```

## Deeplinks

Os cursos manuais suportam deeplinks completos:

### Formato do Deeplink

```
https://seu-site.com/#/area/{area}/equipe/{team}/trilha/{trackId}/curso/{courseId}
```

### Exemplos:

- Link para trilha: `#/area/PDI/Qualidade/pdi-qualidade-labview`
- Link para curso: `#/area/PDI/Qualidade/pdi-qualidade-labview/labview-boas-praticas`

### Botão de Compartilhar

Cada curso tem um botão "🔗 Copiar link do curso" que gera e copia o deeplink automaticamente.

## Boas Práticas

1. **IDs únicos**: Use IDs descritivos e únicos para cursos e seções
2. **Nomes de arquivos**: Use kebab-case (minúsculas com hífens)
3. **Imagens**: Otimize imagens antes de adicionar (PNG ou JPG)
4. **Vídeos**: Use formato MP4 com codecs compatíveis (H.264)
5. **Markdown**: Mantenha hierarquia de títulos consistente
6. **Organização**: Separe conteúdo em seções lógicas
7. **Tamanho**: Mantenha seções com tamanho razoável (5-15 min de leitura)

## Exemplo Completo

Veja o curso exemplo em:
```
public/areas/pdi/cursos/labview-boas-praticas/
```

Este curso demonstra:
- ✅ Múltiplas seções em markdown
- ✅ Formatação rica (títulos, listas, código, tabelas)
- ✅ Navegação entre seções
- ✅ Metadata completa
- ✅ Estrutura profissional

## Testando seu Curso

1. Crie a estrutura de pastas
2. Adicione o `curso.json`
3. Crie os arquivos markdown
4. Adicione a referência no JSON da equipe
5. Abra o Learning Hub
6. Navegue até a trilha
7. Clique em "Abrir curso"

## Troubleshooting

### Curso não aparece
- Verifique se o `type: "manual"` está definido
- Confirme o caminho do `coursePath`
- Verifique se o `courseId` é único

### Markdown não renderiza
- Verifique sintaxe do markdown
- Confirme que o arquivo .md existe
- Verifique o caminho no `content`

### Imagens não carregam
- Use caminhos relativos ao arquivo markdown
- Verifique se os arquivos de imagem existem
- Confirme extensão do arquivo (.png, .jpg, .jpeg)

### Vídeo não reproduz
- Use formato MP4
- Verifique codec (H.264 recomendado)
- Confirme que o arquivo não está corrompido

## Próximos Passos

Depois de criar seu curso:

1. Teste em diferentes navegadores
2. Solicite feedback da equipe
3. Atualize o conteúdo conforme necessário
4. Documente mudanças no `lastUpdate`
5. Compartilhe o deeplink com a equipe!

---

**Dúvidas?** Entre em contato com a equipe de desenvolvimento.
