# WTD - Trilhas de Treinamento

Sistema de gerenciamento de trilhas de treinamento organizadas por áreas, equipes e cursos. Interface moderna com suporte a tema claro/escuro e navegação hierárquica.

## 📋 Índice

- [Características](#características)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Adicionar Conteúdo](#como-adicionar-conteúdo)
- [Estrutura dos Arquivos JSON](#estrutura-dos-arquivos-json)
- [Exemplos Práticos](#exemplos-práticos)
- [Personalização](#personalização)

## ✨ Características

- 🎨 **Tema Claro/Escuro**: Alternância entre temas com persistência de preferência
- 📱 **Responsivo**: Adaptável para desktop, tablet e mobile
- 🗂️ **Hierárquico**: Organização em Áreas → Equipes → Trilhas → Cursos
- 🚩 **Sistema de Onboarding**: Marcação de cursos obrigatórios
- 🔍 **Navegação Intuitiva**: Menu lateral expansível com navegação em árvore
- 📊 **Cards Informativos**: Exibição de tempo estimado e descrições
- 🔗 **Flexível**: Suporte para cursos com ou sem links

## 📁 Estrutura do Projeto

```
projeto/
├── index.html                 # Arquivo principal da aplicação
├── weg_icon.png              # Ícone do site (opcional)
├── README.md                 # Este arquivo
└── pdi/                      # Exemplo de área
    ├── desktop.json
    ├── modelos.json
    ├── pmo.json
    ├── produtos-digitais.json
    ├── qualidade.json
    └── web.json
```

### Estrutura Recomendada para Múltiplas Áreas

```
projeto/
├── index.html
├── README.md
├── pdi/                      # Área: PDI e Produtos Digitais
│   ├── desktop.json
│   ├── web.json
│   └── qualidade.json
├── comercial/                # Área: Comercial
│   ├── vendas.json
│   └── marketing.json
├── rh/                       # Área: Recursos Humanos
│   ├── recrutamento.json
│   └── treinamento.json
└── financeiro/               # Área: Financeiro
    ├── contabilidade.json
    └── tesouraria.json
```

## 🚀 Instalação

1. Clone ou faça download do projeto
2. Certifique-se de ter a seguinte estrutura mínima:
   - `index.html`
   - Pelo menos uma pasta de área (ex: `pdi/`)
   - Pelo menos um arquivo JSON de equipe dentro da pasta

3. Abra o `index.html` em um navegador web ou configure um servidor local:

```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server

# Usando PHP
php -S localhost:8000
```

4. Acesse `http://localhost:8000` no navegador

## ⚙️ Configuração

### Passo 1: Definir as Áreas no `index.html`

Localize o array `areasStructure` no arquivo `index.html` (por volta da linha 700):

```javascript
const areasStructure = [
    {
        areaName: 'PDI e Produtos Digitais',
        teams: [
            'pdi/desktop.json',
            'pdi/modelos.json',
            'pdi/pmo.json',
            'pdi/produtos-digitais.json',
            'pdi/qualidade.json',
            'pdi/web.json'
        ]
    },
    // Adicione mais áreas aqui
];
```

### Passo 2: Adicionar uma Nova Área

Para adicionar uma nova área, adicione um objeto ao array:

```javascript
const areasStructure = [
    {
        areaName: 'PDI e Produtos Digitais',
        teams: [
            'pdi/desktop.json',
            'pdi/web.json'
        ]
    },
    {
        areaName: 'Comercial',
        teams: [
            'comercial/vendas.json',
            'comercial/marketing.json'
        ]
    },
    {
        areaName: 'Recursos Humanos',
        teams: [
            'rh/recrutamento.json',
            'rh/treinamento.json'
        ]
    }
];
```

## 📝 Como Adicionar Conteúdo

### Adicionar uma Nova Área

1. Crie uma nova pasta para a área (ex: `comercial/`)
2. Crie arquivos JSON para cada equipe dentro da pasta
3. Adicione a área no array `areasStructure` do `index.html`

### Adicionar uma Nova Equipe

1. Crie um novo arquivo JSON na pasta da área (ex: `comercial/vendas.json`)
2. Adicione o caminho do arquivo no array `teams` da área correspondente no `index.html`

### Adicionar uma Nova Trilha

1. Abra o arquivo JSON da equipe
2. Adicione um novo objeto no array `tracks`

### Adicionar um Novo Curso

1. Abra o arquivo JSON da equipe
2. Localize a trilha desejada
3. Adicione um novo objeto no array `courses` da trilha

## 🗂️ Estrutura dos Arquivos JSON

### Estrutura Completa de um Arquivo de Equipe

```json
{
  "name": "Nome da Equipe",
  "tracks": [
    {
      "id": "identificador-unico",
      "name": "Nome da Trilha",
      "icon": "🎯",
      "description": "Descrição da trilha de aprendizado",
      "onboarding": true,
      "courses": [
        {
          "name": "Nome do Curso",
          "description": "Descrição opcional do curso",
          "time": "2 horas",
          "link": "https://exemplo.com/curso",
          "buttonText": "Acessar curso",
          "onboarding": true
        }
      ]
    }
  ]
}
```

### Campos Obrigatórios vs Opcionais

#### Nível Equipe (Arquivo JSON)
| Campo | Obrigatório | Descrição |
|-------|------------|-----------|
| `name` | ✅ Sim | Nome da equipe |
| `tracks` | ✅ Sim | Array de trilhas |

#### Nível Trilha
| Campo | Obrigatório | Descrição |
|-------|------------|-----------|
| `id` | ✅ Sim | Identificador único da trilha |
| `name` | ✅ Sim | Nome da trilha |
| `icon` | ✅ Sim | Emoji ou ícone da trilha |
| `description` | ✅ Sim | Descrição da trilha |
| `onboarding` | ❌ Não | Se true, marca como obrigatória para onboarding |
| `courses` | ✅ Sim | Array de cursos |

#### Nível Curso
| Campo | Obrigatório | Descrição |
|-------|------------|-----------|
| `name` | ✅ Sim | Nome do curso |
| `description` | ❌ Não | Descrição do curso |
| `time` | ❌ Não | Tempo estimado (ex: "2 horas", "30 minutos") |
| `link` | ❌ Não | URL do curso (se não informado, não exibe botão) |
| `buttonText` | ❌ Não | Texto do botão (padrão: "Acessar curso") |
| `onboarding` | ❌ Não | Se true, marca como obrigatório para onboarding |

## 💡 Exemplos Práticos

### Exemplo 1: Curso Completo com Link

```json
{
  "name": "Introdução ao React",
  "description": "Aprenda os fundamentos do React.js",
  "time": "4 horas",
  "link": "https://react.dev/learn",
  "buttonText": "Começar agora",
  "onboarding": true
}
```

**Resultado**: Card com número, badge de onboarding, título, descrição, tempo estimado e botão "Começar agora"

### Exemplo 2: Indicação de Estudo (Sem Link)

```json
{
  "name": "Estudar Design Patterns",
  "description": "Recomenda-se estudar os principais padrões de design orientado a objetos",
  "time": "8 horas",
  "onboarding": false
}
```

**Resultado**: Card com número, título, descrição e tempo estimado (sem botão)

### Exemplo 3: Curso Simples

```json
{
  "name": "Git Básico",
  "link": "https://git-scm.com/book/pt-br/v2"
}
```

**Resultado**: Card minimalista com número, título e botão "Acessar curso"

### Exemplo 4: Arquivo Completo de Equipe

```json
{
  "name": "Equipe Web",
  "tracks": [
    {
      "id": "frontend-basico",
      "name": "Frontend Básico",
      "icon": "🎨",
      "description": "Fundamentos de desenvolvimento frontend",
      "onboarding": true,
      "courses": [
        {
          "name": "HTML5 e Semântica",
          "description": "Estruturação correta de páginas web",
          "time": "3 horas",
          "link": "https://developer.mozilla.org/pt-BR/docs/Web/HTML",
          "onboarding": true
        },
        {
          "name": "CSS3 e Flexbox",
          "description": "Estilização e layout responsivo",
          "time": "4 horas",
          "link": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
          "onboarding": true
        },
        {
          "name": "JavaScript ES6+",
          "time": "6 horas",
          "link": "https://javascript.info/",
          "buttonText": "Estudar agora",
          "onboarding": true
        }
      ]
    },
    {
      "id": "frontend-avancado",
      "name": "Frontend Avançado",
      "icon": "🚀",
      "description": "Técnicas avançadas de desenvolvimento",
      "onboarding": false,
      "courses": [
        {
          "name": "React.js",
          "description": "Biblioteca para construção de interfaces",
          "time": "8 horas",
          "link": "https://react.dev/learn"
        },
        {
          "name": "Estudar Performance Web",
          "description": "Otimização de aplicações web",
          "time": "4 horas"
        }
      ]
    }
  ]
}
```

### Alterar Ícones

Use emojis ou caracteres Unicode nos campos `icon` das trilhas:

```json
"icon": "🎯"  // Alvo
"icon": "🚀"  // Foguete
"icon": "💻"  // Computador
"icon": "📚"  // Livros
"icon": "🎨"  // Paleta
"icon": "⚙️"  // Engrenagem
```

## 🔧 Resolução de Problemas

### Os arquivos JSON não carregam

- Verifique se o caminho no `areasStructure` está correto
- Certifique-se de estar usando um servidor web (não abra o arquivo HTML diretamente)
- Verifique o console do navegador (F12) para erros

### Tema não persiste

- Verifique se o localStorage está habilitado no navegador
- Limpe o cache e cookies do navegador

### Cards não aparecem

- Valide a estrutura do JSON em um validador online
- Verifique se todos os campos obrigatórios estão presentes
- Confirme que a trilha tem pelo menos um curso

## 📄 Licença

Este projeto é de uso interno da organização.

## 🤝 Contribuindo

Para adicionar novas funcionalidades ou reportar problemas, entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2025