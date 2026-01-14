# Imagens Organizadas

## 📁 Usando Subpastas

Para organizar melhor, crie uma pasta `images/`:

```
curso-imagens/
├── curso.json
├── imagens-organizadas.md
└── images/
    ├── introducao/
    │   ├── conceito-1.png
    │   └── conceito-2.png
    └── pratica/
        ├── exemplo-1.png
        └── exemplo-2.png
```

---

## 🖼️ Referenciando de Subpastas

### Pasta Direta

```markdown
![Conceito 1](images/conceito-1.png)
```

![Conceito 1](images/conceito-1.png)

---

### Pasta Aninhada

```markdown
![Exemplo prático](images/pratica/exemplo-1.png)
```

![Exemplo prático](images/pratica/exemplo-1.png)

---

## 🎯 Quando Usar Subpastas?

### ✅ Use subpastas quando:

- Curso tem **mais de 5 imagens**
- Imagens pertencem a **seções diferentes**
- Quer **organização clara**
- Precisa de **fácil manutenção**

### ❌ Não use subpastas quando:

- Curso tem **poucas imagens (1-3)**
- Todas as imagens são **relacionadas**
- Prefere **simplicidade**

---

## 📊 Exemplo: Curso com Muitas Imagens

```
curso-grande/
├── curso.json
├── secao-1.md
├── secao-2.md
├── secao-3.md
└── images/
    ├── secao-1/
    │   ├── img-1-1.png
    │   ├── img-1-2.png
    │   └── img-1-3.png
    ├── secao-2/
    │   ├── img-2-1.png
    │   └── img-2-2.png
    └── secao-3/
        └── img-3-1.png
```

**No arquivo `secao-1.md`:**
```markdown
![Primeiro conceito](images/secao-1/img-1-1.png)
![Segundo conceito](images/secao-1/img-1-2.png)
```

---

## 🎨 Múltiplas Imagens em Sequência

### Comparação Lado a Lado

Você pode adicionar várias imagens seguidas:

![Antes da refatoração](images/antes.png)

![Depois da refatoração](images/depois.png)

**O sistema organiza automaticamente!**

---

## 💡 Dicas de Organização

### 1. **Nomenclatura Consistente:**

```
images/
├── 01-introducao.png
├── 02-conceitos.png
├── 03-pratica.png
└── 04-conclusao.png
```

### 2. **Por Categoria:**

```
images/
├── diagramas/
│   ├── fluxo-1.png
│   └── fluxo-2.png
├── screenshots/
│   ├── tela-1.png
│   └── tela-2.png
└── fotos/
    └── equipe.jpg
```

### 3. **Por Tipo:**

```
images/
├── icons/
│   ├── warning.png
│   └── success.png
├── charts/
│   └── vendas.png
└── photos/
    └── produto.jpg
```

---

## 🔍 Troubleshooting

### ❌ Imagem não aparece?

**Verifique:**

1. ✅ Arquivo existe na pasta correta
2. ✅ Nome está correto (case-sensitive!)
3. ✅ Caminho não usa `../` (não funciona!)
4. ✅ Extensão está certa (`.png`, `.jpg`)

**Exemplo de erro comum:**
```markdown
❌ ![Logo](../images/logo.png)      # Não funciona!
✅ ![Logo](images/logo.png)          # Funciona!
```

---

## 📚 Formatos Suportados

| Formato | Uso Recomendado | Tamanho |
|---------|-----------------|---------|
| **PNG** | Diagramas, logos, screenshots | Maior |
| **JPG** | Fotos, imagens complexas | Menor |
| **SVG** | Ícones, vetores | Muito pequeno |
| **GIF** | Animações (use com moderação) | Variável |

---

## ✅ Checklist de Imagens

Antes de adicionar imagens ao curso:

- [ ] Imagens otimizadas (< 500KB cada)
- [ ] Nomes descritivos e sem espaços
- [ ] Texto alternativo adicionado
- [ ] Pasta `images/` criada (se necessário)
- [ ] Caminho relativo correto (sem `../`)
- [ ] Testado no navegador

---

**Veja também:**
- `GUIA-IMAGENS-CURSOS.md` - Guia completo de imagens
- `curso-completo` - Exemplo com todas as funcionalidades
