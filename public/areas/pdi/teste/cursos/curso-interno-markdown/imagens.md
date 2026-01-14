# Trabalhando com Imagens

Aprenda a adicionar e organizar imagens nos seus cursos.

## Sintaxe Básica

A sintaxe do Markdown para imagens é:

```markdown
![Texto alternativo](caminho/da/imagem.png)
```

---

## Como Adicionar Imagens

### Opção 1: Imagem na Mesma Pasta

Se a imagem está na mesma pasta do arquivo Markdown:

```markdown
![Logo da empresa](logo.png)
```

### Opção 2: Imagem em Subpasta

Organize imagens em uma subpasta `images/`:

```markdown
![Diagrama](images/diagrama-fluxo.png)
```

### Opção 3: Imagem Externa (URL)

Você também pode usar URLs externas:

```markdown
![GitHub Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)
```

---

## Exemplo Real

**IMPORTANTE:** Para testar com imagens reais, você precisa:

1. Criar uma pasta `images/` neste curso
2. Adicionar suas imagens nessa pasta
3. Referenciar usando: `![Descrição](images/nome-imagem.png)`

### Estrutura de Arquivos Recomendada:

```
curso-interno-markdown/
├── curso.json
├── introducao.md
├── imagens.md
└── images/           ← Crie esta pasta
    ├── exemplo-1.png
    ├── exemplo-2.jpg
    └── diagrama.svg
```

---

## Texto Alternativo (Alt Text)

O texto alternativo é importante para:
- ✅ Acessibilidade (leitores de tela)
- ✅ SEO (se aplicável)
- ✅ Exibição quando a imagem não carrega

### Boas Práticas

```markdown
❌ Ruim:
![img](foto.png)

✅ Bom:
![Arquitetura do sistema mostrando frontend, backend e banco de dados](foto.png)
```

---

## Placeholder - Aguardando Suas Imagens

### 📸 Imagem 1: Screenshot de Interface

**Descrição:** Aqui você pode adicionar um screenshot da interface do sistema.

```markdown
![Screenshot da interface principal](images/interface.png)
```

*Para ativar: Adicione a imagem `interface.png` na pasta `images/`*

---

### 📊 Imagem 2: Diagrama

**Descrição:** Adicione um diagrama explicativo.

```markdown
![Diagrama de fluxo do processo](images/diagrama.png)
```

*Para ativar: Adicione a imagem `diagrama.png` na pasta `images/`*

---

### 🎨 Imagem 3: Exemplo Visual

**Descrição:** Um exemplo visual do conceito explicado.

```markdown
![Exemplo de implementação](images/exemplo.png)
```

*Para ativar: Adicione a imagem `exemplo.png` na pasta `images/`*

---

## Formatos Suportados

| Formato | Extensão | Uso Recomendado |
|---------|----------|-----------------|
| PNG | `.png` | Screenshots, ícones, transparências |
| JPEG | `.jpg`, `.jpeg` | Fotos, imagens complexas |
| GIF | `.gif` | Animações simples |
| SVG | `.svg` | Ícones, logotipos, gráficos vetoriais |
| WebP | `.webp` | Alternativa moderna (menor tamanho) |

---

## Dicas de Organização

### 1. Use Nomes Descritivos

```
❌ Ruim:
img1.png
foto.jpg
pic2.png

✅ Bom:
arquitetura-sistema.png
dashboard-vendas.jpg
fluxo-autenticacao.png
```

### 2. Organize em Subpastas

```
images/
├── screenshots/
│   ├── tela-login.png
│   └── tela-dashboard.png
├── diagramas/
│   ├── arquitetura.png
│   └── fluxo-dados.png
└── icones/
    ├── check.svg
    └── warning.svg
```

### 3. Otimize o Tamanho

- 📏 Resolução máxima: 1920px de largura
- 💾 Tamanho recomendado: < 500KB por imagem
- 🗜️ Use ferramentas de compressão: TinyPNG, ImageOptim

---

## Estilos Automáticos

O sistema aplica estilos automaticamente:

- ✅ Largura máxima: 100% (responsivo)
- ✅ Altura automática (mantém proporção)
- ✅ Bordas arredondadas
- ✅ Sombra sutil
- ✅ Margem adequada

---

## Imagens com Links

Você pode tornar uma imagem clicável:

```markdown
[![Descrição da imagem](images/thumbnail.png)](https://link-completo.com)
```

Útil para:
- Abrir imagem em tamanho maior
- Direcionar para documentação externa
- Link para vídeo relacionado

---

## Múltiplas Imagens

### Sequência de Screenshots

```markdown
### Passo 1
![Passo 1: Abrir configurações](images/passo-1.png)

### Passo 2
![Passo 2: Selecionar opção](images/passo-2.png)

### Passo 3
![Passo 3: Confirmar alterações](images/passo-3.png)
```

---

## Comparação Antes/Depois

### ❌ Antes

```markdown
![Interface antiga desorganizada](images/antes.png)
```

*Imagem mostrando interface desorganizada*

### ✅ Depois

```markdown
![Interface nova e organizada](images/depois.png)
```

*Imagem mostrando interface melhorada*

---

## Checklist de Imagens

Antes de adicionar imagens ao curso:

- [ ] Imagens otimizadas (< 500KB)
- [ ] Nomes descritivos
- [ ] Texto alternativo significativo
- [ ] Formato apropriado (PNG para screenshots, JPG para fotos)
- [ ] Organizadas em pastas lógicas
- [ ] Testadas no navegador

---

## Ferramentas Úteis

### Compressão
- [TinyPNG](https://tinypng.com/) - Compressão PNG/JPG
- [ImageOptim](https://imageoptim.com/) - Mac
- [RIOT](https://riot-optimizer.com/) - Windows

### Screenshots
- Windows: `Win + Shift + S`
- Mac: `Cmd + Shift + 4`
- [ShareX](https://getsharex.com/) - Ferramenta avançada

### Edição
- [GIMP](https://www.gimp.org/) - Gratuito
- [Photopea](https://www.photopea.com/) - Online, gratuito

---

## Exercício Prático

1. Crie a pasta `images/` neste curso
2. Adicione uma imagem de teste
3. Referencie a imagem no Markdown
4. Teste no navegador

---

**Próximo**: Conclusão e Próximos Passos →
