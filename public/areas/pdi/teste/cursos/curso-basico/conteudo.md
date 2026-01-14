# Curso Básico - Exemplo Mínimo

## 📝 Sobre Este Curso

Este é um exemplo da configuração **mínima obrigatória** para um curso interno.

### Campos Obrigatórios no `curso.json`:

```json
{
    "id": "curso-basico",           // ✅ OBRIGATÓRIO
    "title": "Título do Curso",     // ✅ OBRIGATÓRIO
    "sections": [                   // ✅ OBRIGATÓRIO (mínimo 1 seção)
        {
            "id": "secao-id",       // ✅ OBRIGATÓRIO
            "title": "Título",      // ✅ OBRIGATÓRIO
            "type": "markdown",     // ✅ OBRIGATÓRIO
            "content": "arquivo.md" // ✅ OBRIGATÓRIO
        }
    ]
}
```

### Campos Opcionais:

- `description` - Descrição do curso
- `duration` - Duração estimada
- `author` - Nome do autor
- `lastUpdate` - Data da última atualização

## 💡 Quando Usar Esta Configuração

Use a configuração mínima quando:

- ✅ Curso simples e rápido
- ✅ Conteúdo em uma única seção
- ✅ Não precisa de metadados extras
- ✅ Quer começar rápido

## 📁 Estrutura de Arquivos

```
curso-basico/
├── curso.json      ← Configuração mínima
└── conteudo.md     ← Arquivo único de conteúdo
```

## 🚀 Como Criar um Curso Assim

### 1. Crie a pasta:
```bash
mkdir cursos/meu-curso-basico
```

### 2. Crie o `curso.json`:
```json
{
    "id": "meu-curso-basico",
    "title": "Meu Curso",
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

### 3. Crie o `conteudo.md`:
```markdown
# Meu Curso

Aqui vai o conteúdo...
```

### 4. Adicione à trilha no `team.json`:
```json
{
    "courses": [
        {
            "type": "internal",
            "name": "Meu Curso",
            "folder": "meu-curso-basico"
        }
    ]
}
```

## ✅ Pronto!

Seu curso estará disponível no sistema.

---

**Veja também:**
- `curso-completo` - Exemplo com todos os campos opcionais
- `curso-interno-videos` - Exemplo com vídeos
- `GUIA-CRIACAO-CURSOS.md` - Documentação completa
