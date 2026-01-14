# 🧪 Equipe de Teste - Guia Completo de Referência

## 📋 Visão Geral

A **Equipe de Teste** (`public/areas/pdi/teste/`) é uma equipe de **demonstração completa** que contém **TODOS os tipos de configurações possíveis** no PDI Learning Hub.

**Use este guia como referência para criar suas próprias equipes e cursos!**

---

## 🎯 Propósito

Esta equipe serve como:

1. ✅ **Referência Completa** - Todos os campos e opções disponíveis
2. ✅ **Exemplos Práticos** - Cursos funcionais de demonstração
3. ✅ **Template Base** - Copie e adapte para suas necessidades
4. ✅ **Documentação Viva** - Atualizada com o sistema

---

## 📂 Estrutura de Arquivos

```
teste/
├── team.json                           ← Configuração da equipe
├── cursos/                             ← Pasta de cursos internos
│   ├── README.md                       ← Guia dos cursos
│   ├── curso-completo/                 ← Curso com TODAS as opções
│   │   ├── curso.json
│   │   ├── introducao.md
│   │   ├── secao-1.md
│   │   ├── secao-2.md
│   │   └── conclusao.md
│   ├── curso-basico/                   ← Curso mínimo obrigatório
│   │   ├── curso.json
│   │   └── conteudo.md
│   ├── curso-interno-markdown/         ← Markdown avançado
│   │   ├── curso.json
│   │   ├── introducao.md
│   │   ├── formatacao.md
│   │   ├── codigo.md
│   │   └── tabelas-listas.md
│   ├── curso-interno-videos/           ← Vídeos
│   │   ├── curso.json
│   │   ├── introducao.md
│   │   ├── video-secao.json           ← Seção de vídeo
│   │   ├── video-markdown.md          ← Vídeo no Markdown
│   │   ├── teste.mp4                  ← Arquivo de vídeo
│   │   └── video-poster.jpg           ← Thumbnail
│   └── curso-imagens/                  ← Imagens
│       ├── curso.json
│       ├── imagens-basicas.md
│       ├── imagens-organizadas.md
│       ├── README-IMAGENS.md
│       └── images/                     ← Subpasta de imagens
│           └── ...
└── GUIA-EQUIPE-TESTE.md               ← Este arquivo
```

---

## 🎓 Trilhas Disponíveis

### 1. **Trilha Completa de Demonstração**
**ID:** `trilha-completa`

Demonstra **TODOS** os tipos de cursos e configurações:

#### Cursos Incluídos:

| Curso | Tipo | Propósito |
|-------|------|-----------|
| **Curso Interno Completo - Markdown** | Interno | Exemplo com TODOS os campos opcionais |
| **Curso Interno com Vídeos** | Interno | Vídeos em seções dedicadas e Markdown |
| **Curso Externo - Link Direto** | Externo | Link para plataforma externa |
| **Curso com Todos os Badges** | Interno | Múltiplos badges com cores diferentes |
| **Curso Sem Descrição** | Interno | Configuração sem campo `description` |
| **Curso Sem Duração** | Interno | Configuração sem campo `duration` |
| **Curso Sem Badges** | Interno | Configuração sem badges |
| **Curso Mínimo Possível** | Interno | Apenas campos obrigatórios |
| **Link Externo - GitHub** | Externo | Documentação externa |
| **Link Externo - YouTube** | Externo | Vídeo/playlist externa |
| **Curso com Nome Muito Longo** | Interno | Teste de alinhamento de UI |
| **Curso Título Curto** | Interno | Teste de alinhamento de UI |

---

### 2. **Demonstração de Badges**
**ID:** `trilha-badges`

Demonstra **TODAS** as cores de badges disponíveis:

| Cor | Uso Recomendado | Exemplo |
|-----|-----------------|---------|
| **Verde** | Novo, Básico | `"color": "green"` |
| **Azul** | Interno, Oficial | `"color": "blue"` |
| **Roxo** | Técnico, Especializado | `"color": "purple"` |
| **Vermelho** | Avançado, Crítico | `"color": "red"` |
| **Laranja** | Popular, Prático | `"color": "orange"` |
| **Dourado** | Certificado, Premium | `"color": "gold"` |
| **Cinza** | Externo, Docs | `"color": "gray"` |
| **Ciano** | Plataforma, Online | `"color": "cyan"` |
| **Rosa** | Beta, Experimental | `"color": "pink"` |
| **Preto** | GitHub, Open Source | `"color": "black"` |

---

### 3. **Trilha Minimalista**
**ID:** `trilha-minimalista`

Demonstra configurações **mínimas e simples**:

- Curso com apenas nome e ID
- Link externo simples

---

## 📝 Estrutura do `team.json`

### Campos Disponíveis:

```json
{
    "name": "Nome da Equipe",              // ✅ OBRIGATÓRIO
    "description": "Descrição detalhada",  // ⚠️ OPCIONAL (recomendado)
    "icon": "🧪",                          // ⚠️ OPCIONAL
    "tracks": [                            // ✅ OBRIGATÓRIO
        {
            "id": "trilha-id",             // ✅ OBRIGATÓRIO
            "name": "Nome da Trilha",      // ✅ OBRIGATÓRIO
            "description": "Descrição",    // ⚠️ OPCIONAL
            "duration": "10 horas",        // ⚠️ OPCIONAL
            "courses": [                   // ✅ OBRIGATÓRIO
                // ... cursos aqui
            ]
        }
    ]
}
```

---

## 📚 Configurações de Cursos

### **Curso Interno (type: "internal")**

#### Configuração Completa:

```json
{
    "name": "Nome do Curso",
    "description": "Descrição detalhada do curso",
    "duration": "2 horas",
    "badges": [
        {
            "text": "Interno",
            "color": "blue"
        },
        {
            "text": "Avançado",
            "color": "red"
        }
    ],
    "courseId": "pasta-do-curso",
    "type": "internal"
}
```

#### Configuração Mínima:

```json
{
    "name": "Nome do Curso",
    "courseId": "pasta-do-curso",
    "type": "internal"
}
```

#### Campos:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `name` | ✅ SIM | Nome exibido no card |
| `courseId` | ✅ SIM | Nome da pasta em `cursos/` |
| `type` | ✅ SIM | Deve ser `"internal"` |
| `description` | ❌ NÃO | Descrição no card |
| `duration` | ❌ NÃO | Tempo estimado |
| `badges` | ❌ NÃO | Array de badges |

---

### **Curso Externo (type: "external")**

#### Configuração Completa:

```json
{
    "name": "Nome do Curso Externo",
    "description": "Descrição do link",
    "duration": "3 horas",
    "badges": [
        {
            "text": "Externo",
            "color": "gray"
        },
        {
            "text": "Udemy",
            "color": "cyan"
        }
    ],
    "link": "https://www.exemplo.com/curso",
    "type": "external"
}
```

#### Configuração Mínima:

```json
{
    "name": "Nome do Link",
    "link": "https://www.exemplo.com",
    "type": "external"
}
```

#### Campos:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `name` | ✅ SIM | Nome exibido no card |
| `link` | ✅ SIM | URL completa |
| `type` | ✅ SIM | Deve ser `"external"` |
| `description` | ❌ NÃO | Descrição no card |
| `duration` | ❌ NÃO | Tempo estimado |
| `badges` | ❌ NÃO | Array de badges |

---

## 🎨 Sistema de Badges

### Como Adicionar Badges:

```json
"badges": [
    {
        "text": "Texto do Badge",
        "color": "cor"
    },
    {
        "text": "Outro Badge",
        "color": "outra-cor"
    }
]
```

### Cores Disponíveis:

- `green` - Verde
- `blue` - Azul
- `purple` - Roxo/Violeta
- `red` - Vermelho
- `orange` - Laranja
- `gold` - Dourado
- `gray` - Cinza
- `cyan` - Ciano
- `pink` - Rosa
- `black` - Preto

### Exemplos de Uso:

```json
// Badge de curso novo
{ "text": "Novo", "color": "green" }

// Badge de curso interno
{ "text": "Interno", "color": "blue" }

// Badge de curso avançado
{ "text": "Avançado", "color": "red" }

// Badge de certificação
{ "text": "Certificado", "color": "gold" }

// Badge de link externo
{ "text": "Externo", "color": "gray" }
```

---

## 🎬 Cursos Internos - Estrutura

### **curso.json** - Configuração do Curso

#### Configuração Completa:

```json
{
    "id": "curso-exemplo",
    "title": "Título do Curso",
    "description": "Descrição completa",
    "duration": "2 horas",
    "author": "Nome do Autor",
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
            "title": "Demonstração",
            "type": "video",
            "content": "demo.mp4",
            "poster": "demo-poster.jpg"
        }
    ]
}
```

#### Configuração Mínima:

```json
{
    "id": "curso-exemplo",
    "title": "Título do Curso",
    "sections": [
        {
            "id": "conteudo",
            "title": "Conteúdo",
            "type": "markdown",
            "content": "conteudo.md"
        }
    ]
}
```

---

### Tipos de Seções:

#### **1. Seção Markdown**

```json
{
    "id": "secao-markdown",
    "title": "Título da Seção",
    "type": "markdown",
    "content": "arquivo.md"
}
```

#### **2. Seção de Vídeo**

```json
{
    "id": "secao-video",
    "title": "Título do Vídeo",
    "type": "video",
    "content": "video.mp4",
    "poster": "thumbnail.jpg"
}
```

---

## 🖼️ Recursos Multimídia

### **Imagens no Markdown**

#### Mesma pasta:
```markdown
![Descrição](imagem.png)
```

#### Subpasta:
```markdown
![Descrição](images/imagem.png)
```

#### Pasta aninhada:
```markdown
![Descrição](images/secao-1/imagem.png)
```

---

### **Vídeos no Markdown**

```markdown
<div class="video-container">
    <video controls poster="thumbnail.jpg">
        <source src="video.mp4" type="video/mp4">
        Seu navegador não suporta a reprodução de vídeos.
    </video>
</div>
```

---

## 🚀 Como Usar Esta Equipe de Teste

### 1. **Explorar no Sistema**

Navegue até: **PDI → Teste**

Veja todos os exemplos funcionando!

---

### 2. **Copiar Estruturas**

#### Para criar uma nova equipe:

```bash
# Copie a estrutura base
cp -r teste/ minha-equipe/

# Renomeie e customize
# Edite minha-equipe/team.json
```

---

### 3. **Adaptar Cursos**

#### Para criar um curso novo:

```bash
# Copie um curso de exemplo
cp -r teste/cursos/curso-basico/ teste/cursos/meu-curso/

# Edite o curso.json e arquivos .md
```

---

### 4. **Testar Configurações**

Use esta equipe para testar:

- ✅ Diferentes cores de badges
- ✅ Cursos com/sem descrição
- ✅ Cursos com/sem duração
- ✅ Links externos
- ✅ Vídeos e imagens
- ✅ Múltiplas seções

---

## 📖 Documentação Relacionada

### Guias Criados:

| Guia | Localização | Conteúdo |
|------|-------------|----------|
| **Imagens** | `GUIA-IMAGENS-CURSOS.md` | Como usar imagens |
| **Vídeos no Markdown** | `GUIA-VIDEOS-MARKDOWN.md` | Vídeos integrados |
| **Vídeos Gerais** | `GUIA-VIDEOS.md` | Todas as formas de vídeo |
| **Deeplinks** | `DEEPLINKS.md` | Sistema de links diretos |
| **Estrutura de Equipes** | `ESTRUTURA-EQUIPES.md` | Como organizar equipes |
| **Criação de Cursos** | `CURSO-MANUAL-README.md` | Guia completo |

---

## ✅ Checklist de Criação

### Para criar uma nova equipe baseada neste exemplo:

- [ ] Copiar estrutura da pasta `teste/`
- [ ] Renomear pasta para nome da equipe
- [ ] Editar `team.json`:
  - [ ] Alterar `name`
  - [ ] Alterar `description`
  - [ ] Escolher `icon` (opcional)
  - [ ] Definir `tracks`
- [ ] Para cada trilha:
  - [ ] Definir `id` único
  - [ ] Definir `name`
  - [ ] Adicionar `description` (recomendado)
  - [ ] Listar `courses`
- [ ] Para cada curso interno:
  - [ ] Criar pasta em `cursos/`
  - [ ] Criar `curso.json`
  - [ ] Criar arquivos `.md`
  - [ ] Adicionar imagens/vídeos se necessário
  - [ ] Referenciar no `team.json`
- [ ] Para cada curso externo:
  - [ ] Verificar URL
  - [ ] Adicionar no `team.json`
- [ ] Testar no navegador
- [ ] Verificar deeplinks
- [ ] Validar responsividade

---

## 🎯 Casos de Uso

### **1. Equipe Técnica com Cursos Práticos**

```json
{
    "name": "Desenvolvimento",
    "icon": "💻",
    "tracks": [
        {
            "id": "frontend",
            "name": "Frontend",
            "courses": [
                {
                    "name": "React Avançado",
                    "courseId": "react-avancado",
                    "type": "internal",
                    "badges": [
                        { "text": "Avançado", "color": "red" },
                        { "text": "Hands-on", "color": "orange" }
                    ]
                }
            ]
        }
    ]
}
```

---

### **2. Equipe com Links Externos**

```json
{
    "name": "Certificações",
    "icon": "🎓",
    "tracks": [
        {
            "id": "aws",
            "name": "AWS",
            "courses": [
                {
                    "name": "AWS Solutions Architect",
                    "link": "https://aws.amazon.com/certification/",
                    "type": "external",
                    "duration": "40 horas",
                    "badges": [
                        { "text": "Certificado", "color": "gold" },
                        { "text": "AWS", "color": "orange" }
                    ]
                }
            ]
        }
    ]
}
```

---

### **3. Equipe Mista (Interno + Externo)**

```json
{
    "name": "Qualidade",
    "tracks": [
        {
            "id": "testes",
            "name": "Testes",
            "courses": [
                {
                    "name": "Fundamentos de Testes",
                    "courseId": "fundamentos-testes",
                    "type": "internal"
                },
                {
                    "name": "Cypress.io Docs",
                    "link": "https://docs.cypress.io/",
                    "type": "external",
                    "badges": [
                        { "text": "Docs", "color": "gray" }
                    ]
                }
            ]
        }
    ]
}
```

---

## 🔍 Troubleshooting

### Curso não aparece?

1. ✅ Verifique se o `courseId` corresponde à pasta em `cursos/`
2. ✅ Confirme que `team.json` está válido (sem vírgulas extras)
3. ✅ Verifique se `curso.json` existe e está válido
4. ✅ Limpe o cache do navegador (Ctrl+Shift+R)

### Badge não aparece?

1. ✅ Verifique a sintaxe do array `badges`
2. ✅ Confirme que a cor está entre as suportadas
3. ✅ Verifique vírgulas e aspas

### Imagem não carrega?

1. ✅ Arquivo existe na pasta correta?
2. ✅ Nome do arquivo está correto (case-sensitive)?
3. ✅ Caminho não usa `../`?
4. ✅ Extensão está correta (`.png`, `.jpg`)?

### Vídeo não reproduz?

1. ✅ Formato é MP4 (H.264)?
2. ✅ Arquivo não está muito grande (< 50MB)?
3. ✅ Caminho está correto?
4. ✅ Tag `<div class="video-container">` está presente?

---

## 📊 Resumo Visual

```
Equipe de Teste
│
├── Trilha Completa (12 cursos)
│   ├── Internos (8)
│   │   ├── Curso Completo (todas as opções)
│   │   ├── Curso com Vídeos
│   │   ├── Curso com Badges
│   │   ├── Curso Sem Descrição
│   │   ├── Curso Sem Duração
│   │   ├── Curso Sem Badges
│   │   ├── Curso Mínimo
│   │   └── Testes de UI
│   └── Externos (4)
│       ├── Link YouTube
│       ├── Link GitHub
│       └── Link Genérico
│
├── Demonstração de Badges (10 cursos)
│   └── Um curso para cada cor
│
└── Trilha Minimalista (2 cursos)
    ├── Curso Ultra Simples
    └── Link Simples
```

---

## 🎉 Conclusão

A **Equipe de Teste** é sua referência completa para:

- ✅ Ver todas as possibilidades do sistema
- ✅ Copiar estruturas funcionais
- ✅ Testar novas configurações
- ✅ Aprender boas práticas

**Use-a como base para criar suas próprias equipes e cursos!**

---

**Última atualização:** 14/01/2026  
**Versão:** 1.0  
**Status:** ✅ Completo e Funcional
