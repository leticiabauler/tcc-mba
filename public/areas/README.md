# 📁 Áreas - PDI Learning Hub

Esta pasta contém todas as áreas de treinamento do sistema.

## 🏗️ Estrutura

Cada área tem sua própria pasta com:
- **`area.json`** - Configuração da área (nome, ícone, lista de times)
- **`*.json`** - Arquivos JSON dos times/equipes

## ✨ Como Adicionar uma Nova Área

### Passo 1: Criar a pasta
```powershell
mkdir public\areas\nome-da-area
```

### Passo 2: Criar `area.json`
```json
{
  "name": "Nome que aparece no front",
  "description": "Descrição opcional da área",
  "icon": "🎯",
  "teams": [
    "time1.json",
    "time2.json"
  ]
}
```

### Passo 3: Criar arquivos dos times
Cada arquivo `time.json` deve ter:
```json
{
  "teamName": "Nome do Time",
  "tracks": [
    {
      "name": "Trilha 1",
      "courses": [
        {
          "name": "Curso",
          "description": "Descrição",
          "estimatedTime": "2h",
          "url": "https://link.com",
          "onboarding": true
        }
      ]
    }
  ]
}
```

### Passo 4: Registrar no sistema
Edite `public/assets/scripts/main.js`:
```javascript
const areaFolders = ['pdi', 'nome-da-area'];
```

## 📂 Áreas Existentes

- **`pdi/`** - PDI e Produtos Digitais (💻)
- **`_exemplo-nova-area/`** - Exemplo de estrutura (não ativo)

## 🔧 Ativar a Área de Exemplo

Para ativar a área de exemplo "Marketing e Comunicação":

1. Renomeie a pasta:
```powershell
Rename-Item public\areas\_exemplo-nova-area marketing
```

2. Adicione ao `main.js`:
```javascript
const areaFolders = ['pdi', 'marketing'];
```

3. Recarregue a página!

## 📝 Propriedades

### area.json
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | ✅ | Nome exibido na interface |
| `description` | string | ❌ | Descrição (uso futuro) |
| `icon` | string | ❌ | Emoji ao lado do nome |
| `teams` | array | ✅ | Lista de arquivos JSON dos times |

### time.json
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `teamName` | string | ✅ | Nome do time |
| `tracks` | array | ✅ | Trilhas de aprendizado |

### courses (dentro de tracks)
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `name` | string | ✅ | Nome do curso |
| `description` | string | ❌ | Descrição do curso |
| `estimatedTime` | string | ❌ | Tempo estimado (ex: "2h") |
| `url` | string | ✅ | Link externo do curso |
| `onboarding` | boolean | ❌ | Badge de "Onboarding" |

## 🚀 Dicas

- Use emojis para deixar as áreas mais visuais
- Organize os times de forma lógica
- Mantenha URLs válidas e atualizadas
- Use `onboarding: true` para cursos essenciais
