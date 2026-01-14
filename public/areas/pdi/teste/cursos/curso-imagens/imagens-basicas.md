# Imagens Básicas

## 🖼️ Como Adicionar Imagens

### Forma Mais Simples

Coloque a imagem na mesma pasta do curso e referencie pelo nome:

![Logo da WEG](logo-exemplo.png)

⚠️ **IMPORTANTE:** Coloque o arquivo `logo-exemplo.png` nesta pasta!

---

## 📝 Sintaxe Markdown

```markdown
![Texto alternativo](nome-do-arquivo.png)
```

**Componentes:**
- `![...]` - Indica que é uma imagem
- `Texto alternativo` - Descrição da imagem (acessibilidade)
- `nome-do-arquivo.png` - Nome do arquivo

---

## 🎨 Exemplos

### Exemplo 1: Logo

![Logo da empresa](logo-exemplo.png)

### Exemplo 2: Diagrama

![Fluxograma do processo](diagrama-exemplo.png)

### Exemplo 3: Screenshot

![Interface do sistema](screenshot-exemplo.png)

---

## ✅ Boas Práticas

### 1. **Use nomes descritivos:**
```markdown
✅ ![Dashboard principal](dashboard-principal.png)
❌ ![Imagem](img1.png)
```

### 2. **Sempre adicione texto alternativo:**
```markdown
✅ ![Gráfico de vendas mensal](grafico.png)
❌ ![](grafico.png)
```

### 3. **Otimize o tamanho:**
- Máximo 1920px de largura
- Comprima antes de adicionar
- Use PNG para diagramas
- Use JPG para fotos

---

## 📂 Estrutura de Arquivos

```
curso-imagens/
├── curso.json
├── imagens-basicas.md
├── logo-exemplo.png          ← Coloque aqui
├── diagrama-exemplo.png      ← Coloque aqui
└── screenshot-exemplo.png    ← Coloque aqui
```

---

## 🔧 O Sistema Automaticamente:

1. ✅ Converte caminhos relativos em absolutos
2. ✅ Aplica estilos responsivos
3. ✅ Adiciona sombra e bordas arredondadas
4. ✅ Garante que funcione em mobile

**Você só precisa escrever:**
```markdown
![Descrição](imagem.png)
```

**O sistema converte para:**
```html
<img src="areas/pdi/teste/cursos/curso-imagens/imagem.png" 
     alt="Descrição"
     style="max-width: 100%; border-radius: 8px; ...">
```

---

**Próxima seção:** Imagens Organizadas →
