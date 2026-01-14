# Conceitos Básicos do Git

## O que é Git?

**Git** é um sistema de controle de versão distribuído criado por Linus Torvalds em 2005. Ele permite que você:

- 📝 Rastreie mudanças no código
- 🔄 Colabore com outros desenvolvedores
- 🔙 Reverta alterações quando necessário
- 🌿 Trabalhe em múltiplas funcionalidades simultaneamente

## Git vs GitHub

É importante entender a diferença:

| Git | GitHub |
|-----|--------|
| Sistema de controle de versão | Plataforma de hospedagem |
| Funciona localmente | Funciona na nuvem |
| Software | Serviço web |
| Gerencia repositórios | Hospeda repositórios Git |

> **Nota**: Existem alternativas ao GitHub como GitLab, Bitbucket, Azure DevOps, etc.

## Conceitos Fundamentais

### 1. Repositório (Repository)

Um **repositório** é como uma pasta de projeto que o Git monitora. Contém:

- Todos os arquivos do projeto
- Histórico completo de mudanças
- Configurações do Git

```bash
# Criar novo repositório
git init

# Clonar repositório existente
git clone https://github.com/usuario/projeto.git
```

### 2. Commit

Um **commit** é um "snapshot" do seu projeto em um momento específico.

```bash
# Criar um commit
git commit -m "Mensagem descritiva"
```

**Boas práticas para mensagens de commit:**

✅ **BOM**
- `Adiciona validação de email no formulário de cadastro`
- `Corrige bug de timeout na conexão com banco de dados`
- `Refatora função de cálculo de impostos`

❌ **RUIM**
- `update`
- `fix`
- `mudanças`
- `wip`

### 3. Branch (Ramificação)

**Branches** permitem trabalhar em funcionalidades isoladas.

```
main (produção)
  |
  |-- feature/nova-funcionalidade
  |-- bugfix/correcao-bug
  |-- hotfix/erro-critico
```

```bash
# Criar e mudar para nova branch
git checkout -b feature/minha-funcionalidade

# Listar branches
git branch

# Mudar de branch
git checkout main
```

### 4. Working Directory, Staging Area e Repository

```
┌─────────────────┐
│ Working Directory│ ← Arquivos modificados
└────────┬────────┘
         │ git add
         ▼
┌─────────────────┐
│  Staging Area   │ ← Arquivos preparados para commit
└────────┬────────┘
         │ git commit
         ▼
┌─────────────────┐
│   Repository    │ ← Histórico de commits
└─────────────────┘
```

### 5. Remote (Remoto)

**Remote** é uma versão do repositório hospedada em um servidor (GitHub, GitLab, etc.)

```bash
# Ver remotes configurados
git remote -v

# Adicionar remote
git remote add origin https://github.com/usuario/projeto.git

# Enviar mudanças
git push origin main

# Buscar mudanças
git pull origin main
```

## Estados dos Arquivos

Os arquivos no Git podem estar em diferentes estados:

### 1. Untracked (Não rastreado)
Arquivo novo que o Git ainda não conhece.

### 2. Unmodified (Não modificado)
Arquivo rastreado sem mudanças desde o último commit.

### 3. Modified (Modificado)
Arquivo rastreado que foi alterado.

### 4. Staged (Preparado)
Arquivo marcado para ser incluído no próximo commit.

```bash
# Ver status dos arquivos
git status

# Resultado exemplo:
# Changes not staged for commit:
#   modified: arquivo.txt
#
# Untracked files:
#   novo-arquivo.txt
```

## Ciclo de Vida Básico

```
1. Modificar arquivos → Working Directory
          ↓
2. Adicionar ao stage → git add
          ↓
3. Fazer commit → git commit
          ↓
4. Enviar para remoto → git push
```

## Configuração Inicial

Antes de começar, configure suas informações:

```bash
# Configurar nome
git config --global user.name "Seu Nome"

# Configurar email
git config --global user.email "seu.email@weg.net"

# Verificar configurações
git config --list
```

## Estrutura de um Repositório Git

```
meu-projeto/
├── .git/              ← Pasta do Git (não mexer!)
│   ├── objects/       ← Armazena commits
│   ├── refs/          ← Referências de branches
│   ├── HEAD           ← Branch atual
│   └── config         ← Configurações locais
├── .gitignore         ← Arquivos a ignorar
├── README.md
└── src/
    └── main.js
```

## .gitignore

Arquivo que define quais arquivos o Git deve **ignorar**:

```gitignore
# Dependências
node_modules/
*.pyc
__pycache__/

# Builds
dist/
build/
*.exe

# IDEs
.vscode/
.idea/
*.suo

# Arquivos do sistema
.DS_Store
Thumbs.db

# Arquivos sensíveis
.env
*.key
secrets.json
```

## Visualizando o Histórico

```bash
# Ver histórico de commits
git log

# Formato compacto
git log --oneline

# Com gráfico de branches
git log --oneline --graph --all

# Últimos 5 commits
git log -5
```

## Exemplo Prático

Vamos criar um repositório do zero:

```bash
# 1. Criar pasta do projeto
mkdir meu-projeto
cd meu-projeto

# 2. Inicializar Git
git init

# 3. Criar arquivo
echo "# Meu Projeto" > README.md

# 4. Ver status
git status
# → README.md está untracked

# 5. Adicionar ao stage
git add README.md

# 6. Fazer commit
git commit -m "Adiciona README inicial"

# 7. Conectar com remote
git remote add origin https://github.com/usuario/meu-projeto.git

# 8. Enviar para GitHub
git push -u origin main
```

## Comandos de Ajuda

```bash
# Ajuda geral
git help

# Ajuda de comando específico
git help commit
git commit --help

# Lista de comandos
git help -a
```

## Diferença entre Git e SVN

Se você vem de SVN, principais diferenças:

| Aspecto | SVN | Git |
|---------|-----|-----|
| Tipo | Centralizado | Distribuído |
| Repositório | Único servidor | Cópia completa local |
| Offline | Limitado | Totalmente funcional |
| Branches | Pesadas | Leves e rápidas |
| Performance | Média | Alta |

## Vantagens do Git

- ✅ **Velocidade**: Operações locais são rápidas
- ✅ **Distribuído**: Cada clone é um backup completo
- ✅ **Branches leves**: Criar/mesclar branches é rápido
- ✅ **Staging area**: Controle fino do que commitar
- ✅ **Open source**: Gratuito e código aberto
- ✅ **Comunidade**: Amplamente adotado na indústria

## Próximos Passos

Agora que você conhece os conceitos básicos, vamos aos comandos essenciais! 🚀

---

**Dica**: Não tenha medo de experimentar! Git é muito difícil de quebrar permanentemente.
