# Resolução de Conflitos

## O que são Conflitos?

**Conflitos** ocorrem quando o Git não consegue automaticamente mesclar mudanças de diferentes branches. Isso acontece quando:

- Duas pessoas editam a mesma linha de código
- Uma pessoa edita um arquivo que outra deletou
- Mudanças incompatíveis na mesma área do código

> **Não entre em pânico!** Conflitos são normais e resolvê-los é uma habilidade essencial.

## Quando Conflitos Acontecem?

### Durante Merge

```bash
git checkout main
git merge feature/nova-funcionalidade
# CONFLICT (content): Merge conflict in arquivo.js
```

### Durante Rebase

```bash
git rebase main
# CONFLICT (content): Merge conflict in arquivo.js
```

### Durante Pull

```bash
git pull origin main
# CONFLICT (content): Merge conflict in arquivo.js
```

## Anatomia de um Conflito

Quando há conflito, o Git marca o arquivo assim:

```javascript
function calcularTotal(itens) {
<<<<<<< HEAD
    // Sua mudança
    return itens.reduce((sum, item) => sum + item.preco, 0);
=======
    // Mudança deles
    return itens.reduce((total, item) => total + item.valor, 0);
>>>>>>> feature/nova-funcionalidade
}
```

**Marcadores:**
- `<<<<<<< HEAD` - Início da sua mudança (branch atual)
- `=======` - Separador entre mudanças
- `>>>>>>> feature/nova-funcionalidade` - Fim da mudança da outra branch

## Processo de Resolução

### 1. Identificar Conflitos

```bash
# Ver quais arquivos têm conflito
git status

# Resultado:
# Unmerged paths:
#   both modified:   src/arquivo.js
```

### 2. Abrir Arquivo com Conflito

Use seu editor preferido. No VS Code:

```bash
code src/arquivo.js
```

O VS Code destaca conflitos e oferece botões:
- Accept Current Change
- Accept Incoming Change
- Accept Both Changes
- Compare Changes

### 3. Resolver o Conflito

Você tem três opções:

**Opção A: Manter sua mudança**
```javascript
function calcularTotal(itens) {
    return itens.reduce((sum, item) => sum + item.preco, 0);
}
```

**Opção B: Manter mudança deles**
```javascript
function calcularTotal(itens) {
    return itens.reduce((total, item) => total + item.valor, 0);
}
```

**Opção C: Combinar ambas (mais comum)**
```javascript
function calcularTotal(itens) {
    // Combina as duas abordagens
    return itens.reduce((sum, item) => sum + (item.preco || item.valor), 0);
}
```

**Opção D: Reescrever completamente**
```javascript
function calcularTotal(itens) {
    // Solução melhor que qualquer uma das duas
    let total = 0;
    for (const item of itens) {
        total += item.preco || item.valor || 0;
    }
    return total;
}
```

### 4. Marcar como Resolvido

```bash
# Após editar e salvar o arquivo
git add src/arquivo.js
```

### 5. Completar o Merge/Rebase

```bash
# Para merge
git commit -m "Resolve conflito no cálculo de total"

# Para rebase
git rebase --continue
```

## Exemplos Práticos

### Exemplo 1: Conflito Simples

**Branch A (sua):**
```javascript
const API_URL = 'https://api.dev.weg.com';
```

**Branch B (deles):**
```javascript
const API_URL = 'https://api.prod.weg.com';
```

**Conflito:**
```javascript
<<<<<<< HEAD
const API_URL = 'https://api.dev.weg.com';
=======
const API_URL = 'https://api.prod.weg.com';
>>>>>>> feature/atualiza-api
```

**Resolução:**
```javascript
// Usar variável de ambiente
const API_URL = process.env.API_URL || 'https://api.dev.weg.com';
```

### Exemplo 2: Conflito em CSS

**Sua mudança:**
```css
.botao {
    background-color: blue;
    padding: 10px;
}
```

**Mudança deles:**
```css
.botao {
    background-color: red;
    border-radius: 5px;
}
```

**Resolução combinada:**
```css
.botao {
    background-color: blue;
    padding: 10px;
    border-radius: 5px;
}
```

### Exemplo 3: Conflito em JSON

**Sua mudança:**
```json
{
    "name": "Projeto",
    "version": "1.2.0",
    "author": "Time A"
}
```

**Mudança deles:**
```json
{
    "name": "Projeto",
    "version": "1.2.0",
    "description": "Descrição do projeto"
}
```

**Resolução:**
```json
{
    "name": "Projeto",
    "version": "1.2.0",
    "author": "Time A",
    "description": "Descrição do projeto"
}
```

## Estratégias de Resolução

### 1. Comunicação

```bash
# Antes de resolver, pergunte!
# "Por que você fez essa mudança?"
# "Qual era o objetivo?"
```

### 2. Testes

```bash
# Após resolver, teste!
npm test
npm run lint

# Rode a aplicação
npm start
```

### 3. Code Review

Se não tiver certeza, peça ajuda:
- Pergunte ao autor da outra mudança
- Faça pair programming para resolver
- Teste ambas as abordagens

## Ferramentas de Merge

### VS Code (Integrado)

VS Code tem excelente suporte a conflitos:
- Destaque visual
- Botões de resolução rápida
- Comparação lado a lado

### Git Merge Tools

```bash
# Configurar VS Code como mergetool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Usar mergetool
git mergetool

# Outras opções populares
git config --global merge.tool kdiff3
git config --global merge.tool meld
```

### Ferramentas Visuais

- **GitKraken** - Interface visual intuitiva
- **SourceTree** - Merge tool integrada
- **Beyond Compare** - Comparação avançada
- **P4Merge** - Gratuito e poderoso

## Abortar Merge/Rebase

Se não souber resolver:

```bash
# Abortar merge
git merge --abort

# Abortar rebase
git rebase --abort

# Voltar ao estado anterior
git reset --hard HEAD
```

## Evitando Conflitos

### 1. Comunicação em Equipe

- Avise quando for editar arquivo crítico
- Use issues/tasks para coordenar trabalho
- Faça code reviews regularmente

### 2. Branches Pequenas e Focadas

```bash
# ✅ BOM - Branches pequenas
feature/adiciona-botao-login
feature/valida-email

# ❌ RUIM - Branches grandes
feature/refatora-tudo
```

### 3. Sincronização Frequente

```bash
# Pelo menos 1x por dia
git checkout main
git pull
git checkout sua-branch
git merge main
```

### 4. Modularização

- Separe código em arquivos pequenos
- Cada módulo com responsabilidade única
- Menos chance de duas pessoas editarem o mesmo arquivo

### 5. Feature Flags

Em vez de branches longas:

```javascript
// Funcionalidade nova, mas inativa
if (featureFlags.novoLogin) {
    // Código novo
} else {
    // Código antigo
}
```

## Conflitos Avançados

### Conflito de Deleção

```bash
# Você editou, alguém deletou
# CONFLICT (modify/delete): arquivo.js deleted in branch X

# Decisão:
git rm arquivo.js  # Manter deleção
# ou
git add arquivo.js  # Manter arquivo
```

### Conflito de Renomeação

```bash
# Duas pessoas renomearam o mesmo arquivo diferentemente
# Git pode não detectar automaticamente

# Escolher um nome e padronizar
git mv arquivo-nome1.js arquivo-nome-final.js
git add .
git commit -m "Resolve conflito de renomeação"
```

### Conflito Binário

Arquivos binários (imagens, PDFs) não podem ser mesclados:

```bash
# Escolher uma versão
git checkout --ours arquivo.png
# ou
git checkout --theirs arquivo.png

git add arquivo.png
```

## Checklist de Resolução

Ao resolver conflito:

- [ ] Entendi ambas as mudanças?
- [ ] Comuniquei com o autor da outra mudança?
- [ ] Testei a resolução?
- [ ] Código compila/roda?
- [ ] Testes passam?
- [ ] Lint/formatação ok?
- [ ] Mensagem de commit descritiva?

## Comandos Úteis

```bash
# Ver conflitos
git status
git diff

# Ver mudanças de cada lado
git show :1:arquivo.js  # Ancestral comum
git show :2:arquivo.js  # HEAD (seu)
git show :3:arquivo.js  # MERGE_HEAD (deles)

# Aceitar tudo de um lado (cuidado!)
git checkout --ours arquivo.js    # Sua versão
git checkout --theirs arquivo.js  # Versão deles

# Ver histórico de merges
git log --merges

# Ver branches não mescladas
git branch --no-merged
```

## Exemplo Completo

Vamos simular e resolver um conflito:

```bash
# 1. Setup
git init projeto-teste
cd projeto-teste
echo "v1" > arquivo.txt
git add .
git commit -m "Commit inicial"

# 2. Branch A
git checkout -b feature-a
echo "v2 da branch A" > arquivo.txt
git add .
git commit -m "Mudança na A"

# 3. Voltar e criar Branch B
git checkout main
git checkout -b feature-b
echo "v2 da branch B" > arquivo.txt
git add .
git commit -m "Mudança na B"

# 4. Merge A em main
git checkout main
git merge feature-a  # OK, sem conflito

# 5. Tentar merge B em main
git merge feature-b
# CONFLICT!

# 6. Ver conflito
cat arquivo.txt
# <<<<<<< HEAD
# v2 da branch A
# =======
# v2 da branch B
# >>>>>>> feature-b

# 7. Resolver (editar arquivo)
echo "v3 combinando A e B" > arquivo.txt

# 8. Finalizar
git add arquivo.txt
git commit -m "Resolve conflito entre feature-a e feature-b"

# 9. Verificar
git log --graph --oneline --all
```

## Dicas Finais

1. **Não tenha medo** - Conflitos são normais
2. **Comunique-se** - Fale com a equipe
3. **Teste sempre** - Após resolver, teste tudo
4. **Aprenda com erros** - Cada conflito ensina algo
5. **Use ferramentas** - VS Code, GitKraken ajudam muito
6. **Previna** - Sincronize frequentemente
7. **Documente** - Explique resoluções não-óbvias

## Conclusão do Curso

Parabéns! 🎉 Você completou o curso de **Git na Prática**!

### O que você aprendeu:

✅ Conceitos fundamentais do Git  
✅ Comandos essenciais do dia a dia  
✅ Workflows profissionais  
✅ Resolução de conflitos  

### Próximos Passos:

1. **Pratique** - Use Git diariamente
2. **Explore** - Aprenda Git avançado (cherry-pick, bisect, etc.)
3. **Ensine** - Compartilhe conhecimento com a equipe
4. **Contribua** - Participe de projetos open source

### Recursos Adicionais:

- 📚 [Pro Git Book](https://git-scm.com/book/pt-br/v2)
- 🎮 [Learn Git Branching](https://learngitbranching.js.org/)
- 📺 [Git & GitHub para Iniciantes](https://youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
- 🔗 [Documentação Oficial](https://git-scm.com/docs)

### Feedback

Gostou do curso? Tem sugestões?  
Entre em contato: **pdi@weg.net**

---

**Bons commits!** 🚀
