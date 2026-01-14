# Workflow Diário com Git

## Workflow Típico

Vamos ver como é um dia típico de trabalho com Git.

## 📅 Início do Dia

### 1. Atualizar Repositório Local

Sempre comece sincronizando com o remoto:

```bash
# Mudar para branch principal
git checkout main

# Atualizar branch principal
git pull origin main

# Verificar status
git status
```

### 2. Criar Branch para Nova Tarefa

```bash
# Criar branch descritiva
git checkout -b feature/implementa-login-oauth

# Ou para correção de bug
git checkout -b bugfix/corrige-validacao-email

# Ou para hotfix em produção
git checkout -b hotfix/erro-critico-pagamento
```

## 💻 Durante o Desenvolvimento

### 3. Fazer Mudanças Incrementais

```bash
# Modificar arquivos...
# Testar localmente...

# Ver o que mudou
git status
git diff

# Adicionar mudanças ao stage
git add src/login.js
git add src/auth.js

# Ou adicionar tudo
git add .

# Fazer commit
git commit -m "Implementa autenticação OAuth com Google"
```

### 4. Commits Frequentes

**Boas práticas:**

✅ **Commits pequenos e focados**
```bash
git commit -m "Adiciona componente de botão OAuth"
git commit -m "Implementa função de validação de token"
git commit -m "Adiciona testes para autenticação"
```

❌ **Evite commits grandes**
```bash
git commit -m "Implementa tudo do login" # 50 arquivos modificados!
```

### 5. Mantendo Branch Atualizada

```bash
# Periodicamente, sincronize com main
git checkout main
git pull origin main

# Voltar para sua branch
git checkout feature/implementa-login-oauth

# Mesclar mudanças da main
git merge main

# Ou usar rebase (mantém histórico linear)
git rebase main
```

## 🔄 Sincronizando com Remote

### 6. Push Regular

```bash
# Enviar sua branch para o remote
git push origin feature/implementa-login-oauth

# Primeira vez? Configurar upstream
git push -u origin feature/implementa-login-oauth

# Depois, apenas
git push
```

### 7. Trabalho em Equipe

Se outra pessoa também trabalha na mesma branch:

```bash
# Buscar mudanças dela
git pull origin feature/implementa-login-oauth

# Se houver conflitos, resolve e continua
# (veremos conflitos na próxima seção)
```

## ✅ Finalizando Tarefa

### 8. Preparar para Merge

```bash
# Certificar que está atualizado
git checkout main
git pull origin main

git checkout feature/implementa-login-oauth
git merge main

# Ou rebase
git rebase main

# Rodar testes
npm test  # ou seu comando de teste

# Push final
git push
```

### 9. Pull Request / Merge Request

No GitHub/GitLab/Azure DevOps:

1. Criar Pull Request da sua branch para `main`
2. Adicionar descrição detalhada
3. Solicitar revisão de código
4. Aguardar aprovação
5. Fazer merge

### 10. Limpeza Pós-Merge

```bash
# Voltar para main
git checkout main

# Atualizar main
git pull origin main

# Deletar branch local
git branch -d feature/implementa-login-oauth

# Branch remota geralmente é deletada automaticamente pelo PR
# Mas se não for:
git push origin --delete feature/implementa-login-oauth
```

## 📋 Workflows Comuns

### Workflow 1: Feature Branch

```
main
  │
  ├─ feature/nova-funcionalidade
  │    ├─ commit 1
  │    ├─ commit 2
  │    └─ commit 3
  │         │
  │         └─> Merge para main
  │
  └─ continua...
```

**Passos:**
```bash
git checkout main
git pull
git checkout -b feature/minha-feature
# ... desenvolver ...
git add .
git commit -m "Mensagem"
git push -u origin feature/minha-feature
# Criar PR no GitHub
# Após aprovação e merge
git checkout main
git pull
git branch -d feature/minha-feature
```

### Workflow 2: Gitflow

```
main (produção)
  │
develop (desenvolvimento)
  │
  ├─ feature/funcionalidade-1
  ├─ feature/funcionalidade-2
  └─ release/v1.2.0
       │
       └─> merge para main e develop
```

**Passos:**
```bash
# Features vão para develop
git checkout develop
git checkout -b feature/nova-feature
# ... desenvolver ...
git checkout develop
git merge feature/nova-feature

# Release para preparar versão
git checkout -b release/v1.2.0 develop
# ... ajustes finais ...
git checkout main
git merge release/v1.2.0
git tag v1.2.0

# Merge de volta para develop
git checkout develop
git merge release/v1.2.0
```

### Workflow 3: Trunk-Based Development

```
main (sempre deployável)
  │
  ├─ feature-toggle-login (commit direto, feature flag off)
  ├─ commit 2
  └─ feature-toggle-login (ativa feature, flag on)
```

**Características:**
- Commits diretos ou PRs muito rápidos
- Feature flags para funcionalidades incompletas
- CI/CD robusto
- Deploy contínuo

## 🚨 Situações Especiais

### Preciso Mudar de Contexto Urgentemente

```bash
# Guardar trabalho atual
git stash save "WIP: implementando login"

# Mudar de branch para emergência
git checkout main
git checkout -b hotfix/bug-urgente

# ... corrigir bug ...
git add .
git commit -m "Corrige bug urgente"
git push

# Voltar ao trabalho anterior
git checkout feature/implementa-login-oauth
git stash pop
```

### Esqueci de Criar Branch

```bash
# Oh não! Fiz commits na main!
git log  # Ver commits

# Criar branch com os commits
git branch feature/salvar-trabalho

# Voltar main ao estado remoto
git reset --hard origin/main

# Mudar para branch salva
git checkout feature/salvar-trabalho
```

### Commit Errado

```bash
# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Fazer correções necessárias
# Commitar novamente
git add .
git commit -m "Mensagem corrigida"
```

## 📊 Verificações Antes de Commit

### Checklist Mental

- [ ] Código funciona?
- [ ] Testes passam?
- [ ] Lint/formatação ok?
- [ ] Sem arquivos indesejados? (`git status`)
- [ ] Mensagem descritiva?
- [ ] Branch correta?

### Comando Útil

```bash
# Ver exatamente o que vai no commit
git diff --staged

# Adicionar interativamente
git add -p  # Pergunta parte por parte
```

## 🎯 Boas Práticas do Dia a Dia

### 1. Commits Atômicos

Cada commit deve ser uma unidade lógica completa:

```bash
# ✅ BOM - Um conceito por commit
git commit -m "Adiciona validação de email"
git commit -m "Adiciona testes de validação de email"

# ❌ RUIM - Mistura conceitos
git commit -m "Adiciona validação e corrige bug de login"
```

### 2. Mensagens Claras

**Formato recomendado:**

```
Tipo: Descrição curta (50 chars)

Descrição detalhada opcional (72 chars por linha)
- Ponto 1
- Ponto 2

Refs: #123
```

**Tipos comuns:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação, ponto e vírgula
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas de manutenção

**Exemplos:**
```bash
git commit -m "feat: Implementa autenticação OAuth"
git commit -m "fix: Corrige timeout na API de pagamento"
git commit -m "docs: Atualiza README com instruções de deploy"
```

### 3. Pull Antes de Push

```bash
# Sempre antes de push
git pull --rebase origin sua-branch
git push
```

### 4. Branches Descritivas

```bash
# ✅ BOM
feature/implementa-carrinho-compras
bugfix/corrige-calculo-frete
hotfix/erro-pagamento-cartao
refactor/melhora-performance-queries

# ❌ RUIM
branch1
teste
fix
desenvolvimento
```

### 5. Sincronização Regular

```bash
# Pelo menos 1x por dia
git checkout main
git pull origin main

# Atualizar sua branch
git checkout sua-branch
git merge main
# ou
git rebase main
```

## ⏰ Rotina Recomendada

### Manhã (5 minutos)

```bash
# 1. Atualizar repositório
git checkout main
git pull

# 2. Atualizar sua branch de trabalho
git checkout sua-branch
git merge main

# 3. Verificar pendências
git status
```

### Durante o Dia (frequente)

```bash
# A cada funcionalidade completa
git add .
git commit -m "Mensagem descritiva"

# A cada hora ou duas
git push
```

### Fim do Dia (5 minutos)

```bash
# 1. Push de tudo
git push

# 2. Verificar que está limpo
git status

# 3. (Opcional) Stash se não quer commitar
git stash save "WIP: continuar amanhã"
```

## 📈 Métricas para Monitorar

```bash
# Commits hoje
git log --since="1 day ago" --oneline

# Arquivos mais modificados
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10

# Contribuições por autor
git shortlog -sn

# Linhas adicionadas/removidas
git log --author="Seu Nome" --pretty=tformat: --numstat | \
  awk '{ add += $1; subs += $2; loc += $1 - $2 } END \
  { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'
```

## 🎓 Exercício Prático

Simule um dia de trabalho:

```bash
# 1. Setup
git clone https://github.com/seu-usuario/projeto-teste.git
cd projeto-teste

# 2. Nova feature
git checkout -b feature/adiciona-header

# 3. Desenvolver
echo "header { color: blue; }" > header.css
git add header.css
git commit -m "feat: Adiciona estilo do header"

# 4. Mais mudanças
echo "header h1 { font-size: 24px; }" >> header.css
git add header.css
git commit -m "feat: Define tamanho de fonte do header"

# 5. Sincronizar
git push -u origin feature/adiciona-header

# 6. Ver histórico
git log --oneline

# 7. Limpar
git checkout main
git branch -d feature/adiciona-header
```

## Próxima Seção

Agora vamos aprender a lidar com **conflitos de merge**! →

---

**Dica**: Estabeleça uma rotina e ela se tornará natural!
