# Comandos Essenciais do Git

## Comandos de Configuração

### Identidade

```bash
# Configurar nome (obrigatório)
git config --global user.name "Seu Nome"

# Configurar email (obrigatório)
git config --global user.email "seu.email@weg.net"

# Ver configuração atual
git config user.name
git config user.email
```

### Editor Padrão

```bash
# Configurar VS Code como editor
git config --global core.editor "code --wait"

# Ou Notepad++ (Windows)
git config --global core.editor "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
```

### Aliases Úteis

```bash
# Criar atalhos
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"

# Usar: git st em vez de git status
```

## Comandos Básicos

### Inicializar e Clonar

```bash
# Criar novo repositório
git init

# Clonar repositório existente
git clone https://github.com/usuario/projeto.git

# Clonar para pasta específica
git clone https://github.com/usuario/projeto.git minha-pasta
```

### Status e Informações

```bash
# Ver status atual
git status

# Status resumido
git status -s

# Ver diferenças não staged
git diff

# Ver diferenças staged
git diff --staged

# Ver log de commits
git log

# Log resumido
git log --oneline

# Log com gráfico
git log --oneline --graph --all
```

## Trabalhando com Arquivos

### Adicionar Arquivos (Staging)

```bash
# Adicionar arquivo específico
git add arquivo.txt

# Adicionar múltiplos arquivos
git add arquivo1.txt arquivo2.txt

# Adicionar todos arquivos modificados
git add .

# Adicionar todos arquivos .js
git add *.js

# Adicionar interativamente
git add -p
```

### Commit

```bash
# Commit com mensagem
git commit -m "Adiciona nova funcionalidade"

# Commit com descrição detalhada
git commit
# Abrirá o editor para mensagem completa

# Adicionar e commitar em um comando (apenas tracked files)
git commit -am "Atualiza documentação"

# Corrigir último commit (antes de push)
git commit --amend -m "Nova mensagem"

# Adicionar arquivos ao último commit
git add arquivo-esquecido.txt
git commit --amend --no-edit
```

### Remover e Mover Arquivos

```bash
# Remover arquivo (staged deletion)
git rm arquivo.txt

# Remover do Git mas manter no disco
git rm --cached arquivo.txt

# Mover/renomear arquivo
git mv antigo.txt novo.txt
```

## Branches

### Criar e Navegar

```bash
# Listar branches
git branch

# Criar nova branch
git branch feature/nova-funcionalidade

# Mudar para branch
git checkout feature/nova-funcionalidade

# Criar e mudar em um comando
git checkout -b feature/nova-funcionalidade

# No Git 2.23+, usar switch
git switch feature/nova-funcionalidade
git switch -c feature/nova-funcionalidade
```

### Mesclar (Merge)

```bash
# Mesclar branch na atual
git checkout main
git merge feature/nova-funcionalidade

# Merge com mensagem personalizada
git merge feature/nova-funcionalidade -m "Adiciona funcionalidade X"

# Abortar merge em conflito
git merge --abort
```

### Deletar Branches

```bash
# Deletar branch local (apenas se merged)
git branch -d feature/finalizada

# Forçar deleção (cuidado!)
git branch -D feature/abandonada

# Deletar branch remota
git push origin --delete feature/antiga
```

## Trabalhando com Remotes

### Configurar Remotes

```bash
# Ver remotes configurados
git remote -v

# Adicionar remote
git remote add origin https://github.com/usuario/projeto.git

# Remover remote
git remote remove origin

# Renomear remote
git remote rename origin upstream
```

### Push (Enviar)

```bash
# Push para remote
git push origin main

# Push e configurar upstream
git push -u origin main

# Push de todas branches
git push --all origin

# Push de tags
git push --tags
```

### Pull e Fetch

```bash
# Buscar e mesclar mudanças
git pull origin main

# Apenas buscar (não mesclar)
git fetch origin

# Fetch de todas branches
git fetch --all

# Pull com rebase
git pull --rebase origin main
```

## Desfazendo Mudanças

### Working Directory

```bash
# Descartar mudanças em arquivo
git checkout -- arquivo.txt

# No Git 2.23+
git restore arquivo.txt

# Descartar todas mudanças
git checkout -- .
git restore .
```

### Staging Area

```bash
# Remover arquivo do stage
git reset HEAD arquivo.txt

# No Git 2.23+
git restore --staged arquivo.txt

# Remover todos do stage
git reset HEAD
```

### Commits

```bash
# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (volta ao working directory)
git reset HEAD~1
git reset --mixed HEAD~1

# Desfazer último commit (PERDE mudanças!)
git reset --hard HEAD~1

# Desfazer múltiplos commits
git reset --hard HEAD~3

# Criar commit que reverte outro commit
git revert <commit-hash>
```

## Stash (Guardar Temporariamente)

```bash
# Guardar mudanças atuais
git stash

# Guardar com mensagem
git stash save "WIP: implementando login"

# Listar stashes
git stash list

# Aplicar último stash
git stash apply

# Aplicar e remover último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{2}

# Remover stash
git stash drop stash@{0}

# Limpar todos stashes
git stash clear
```

## Tags

```bash
# Criar tag simples
git tag v1.0.0

# Criar tag anotada (recomendado)
git tag -a v1.0.0 -m "Versão 1.0.0"

# Listar tags
git tag

# Ver detalhes da tag
git show v1.0.0

# Push de tag específica
git push origin v1.0.0

# Push de todas tags
git push --tags

# Deletar tag local
git tag -d v1.0.0

# Deletar tag remota
git push origin --delete v1.0.0
```

## Visualização

### Log Avançado

```bash
# Log com gráfico completo
git log --graph --oneline --decorate --all

# Log dos últimos N commits
git log -5

# Log com diferenças
git log -p

# Log de um arquivo específico
git log -- arquivo.txt

# Log por autor
git log --author="Nome"

# Log por período
git log --since="2 weeks ago"
git log --after="2026-01-01" --before="2026-01-14"

# Commits que modificaram uma função
git log -S"nome_da_funcao"
```

### Diff Avançado

```bash
# Diferença entre branches
git diff main..feature/nova

# Diferença entre commits
git diff abc123..def456

# Apenas nomes de arquivos modificados
git diff --name-only

# Estatísticas de mudanças
git diff --stat
```

## Comandos de Inspeção

```bash
# Ver conteúdo de commit
git show <commit-hash>

# Ver conteúdo de arquivo em commit específico
git show <commit-hash>:caminho/arquivo.txt

# Ver quem modificou cada linha
git blame arquivo.txt

# Buscar texto no histórico
git grep "texto" $(git rev-list --all)

# Ver referências de um commit
git reflog
```

## Limpeza

```bash
# Remover arquivos não rastreados
git clean -n  # Visualizar o que será removido
git clean -f  # Remover arquivos
git clean -fd # Remover arquivos e diretórios

# Otimizar repositório
git gc

# Verificar integridade
git fsck
```

## Tabela de Referência Rápida

| Comando | Descrição |
|---------|-----------|
| `git init` | Criar repositório |
| `git clone <url>` | Clonar repositório |
| `git status` | Ver status |
| `git add <arquivo>` | Adicionar ao stage |
| `git commit -m "msg"` | Criar commit |
| `git push` | Enviar mudanças |
| `git pull` | Buscar mudanças |
| `git branch` | Listar branches |
| `git checkout -b <branch>` | Criar e mudar branch |
| `git merge <branch>` | Mesclar branch |
| `git log` | Ver histórico |
| `git diff` | Ver diferenças |
| `git stash` | Guardar mudanças |

## Dicas de Produtividade

### 1. Auto-complete

Configure auto-complete no seu shell (bash, zsh, PowerShell).

### 2. Aliases do Shell

Adicione ao seu `.bashrc` ou `.zshrc`:

```bash
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline --graph'
alias gco='git checkout'
```

### 3. Git GUI Tools

- **GitKraken** - Interface visual completa
- **GitHub Desktop** - Simples e integrado
- **SourceTree** - Poderoso e gratuito
- **Git Extensions** - Para Windows

### 4. Atalhos VS Code

- `Ctrl+Shift+G` - Abrir Source Control
- `Ctrl+Enter` - Commit
- Integração nativa com Git

## Próxima Seção

Agora que você conhece os comandos essenciais, vamos ver como usá-los em um **workflow diário**! →

---

**Dica**: Pratique estes comandos em um repositório de teste antes de usar em projetos reais.
