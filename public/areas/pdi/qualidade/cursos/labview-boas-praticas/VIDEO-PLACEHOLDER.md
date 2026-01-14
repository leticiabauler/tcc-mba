# Como Usar Vídeos nos Cursos

## 🎬 Duas Formas de Adicionar Vídeos

### Opção 1: Seção Dedicada de Vídeo (via `curso.json`)

Use quando quiser uma seção exclusiva para o vídeo.

**No arquivo `curso.json`:**
```json
{
    "id": "video-demo",
    "title": "Demonstração Prática",
    "type": "video",
    "content": "teste.mp4",
    "poster": "video-poster.jpg"
}
```

### Opção 2: Vídeo Dentro do Markdown

Use quando quiser misturar vídeo com texto explicativo.

**No arquivo `.md`:**
```markdown
# Minha Aula

Aqui está uma explicação em texto...

<div class="video-container">
    <video controls poster="video-poster.jpg">
        <source src="teste.mp4" type="video/mp4">
        Seu navegador não suporta a reprodução de vídeos.
    </video>
</div>

E aqui continua o texto após o vídeo...
```

## 📁 Estrutura de Arquivos

Coloque os vídeos na mesma pasta do curso:

```
labview-boas-praticas/
├── curso.json
├── introducao.md
├── video-demo.md           ← Markdown com vídeo
├── teste.mp4              ← Arquivo de vídeo
└── video-poster.jpg       ← Thumbnail (opcional)
```

## 🎥 Especificações Recomendadas

**Formato e Codec:**
- **Formato**: MP4 (`.mp4`)
- **Codec de Vídeo**: H.264
- **Codec de Áudio**: AAC

**Qualidade:**
- **Resolução**: 1280x720 (HD) ou 1920x1080 (Full HD)
- **Taxa de bits**: 2-5 Mbps
- **Frame rate**: 30 fps

**Thumbnail (Poster):**
- **Formato**: JPG ou PNG
- **Resolução**: Mesma do vídeo
- **Nome**: `video-poster.jpg` ou `nome-video-poster.jpg`

## 🛠️ Ferramentas de Conversão

### Gratuitas:
- **HandBrake** - Melhor para conversão local
- **FFmpeg** - Linha de comando (avançado)
- **CloudConvert** - Online, sem instalação

### Pagas:
- **Adobe Media Encoder** - Profissional
- **Camtasia** - Para screencasts

## 📝 Exemplos Práticos

### Exemplo 1: Vídeo Simples (sem poster)

```markdown
<div class="video-container">
    <video controls>
        <source src="meu-video.mp4" type="video/mp4">
        Seu navegador não suporta a reprodução de vídeos.
    </video>
</div>
```

### Exemplo 2: Vídeo com Thumbnail

```markdown
<div class="video-container">
    <video controls poster="thumbnail.jpg">
        <source src="meu-video.mp4" type="video/mp4">
        Seu navegador não suporta a reprodução de vídeos.
    </video>
</div>
```

### Exemplo 3: Múltiplos Vídeos em Uma Seção

```markdown
# Tutoriais em Vídeo

## Parte 1: Introdução

<div class="video-container">
    <video controls poster="parte1-poster.jpg">
        <source src="parte1.mp4" type="video/mp4">
    </video>
</div>

## Parte 2: Prática

<div class="video-container">
    <video controls poster="parte2-poster.jpg">
        <source src="parte2.mp4" type="video/mp4">
    </video>
</div>
```

## ✅ O Que o Sistema Faz Automaticamente

1. ✅ Converte caminhos relativos em absolutos
2. ✅ Aplica estilos responsivos (funciona em mobile)
3. ✅ Adiciona controles nativos do navegador
4. ✅ Suporta tela cheia
5. ✅ Carrega thumbnail antes do play

## 🎨 Personalização (Opcional)

Você pode adicionar atributos extras:

```markdown
<div class="video-container">
    <video controls 
           poster="thumbnail.jpg"
           preload="metadata"
           controlslist="nodownload">
        <source src="video.mp4" type="video/mp4">
    </video>
</div>
```

**Atributos úteis:**
- `preload="metadata"` - Carrega apenas metadados (mais rápido)
- `preload="auto"` - Pré-carrega o vídeo todo
- `controlslist="nodownload"` - Remove botão de download
- `loop` - Reproduz em loop
- `muted` - Inicia sem som

## 🚀 Dicas de Performance

1. **Comprima seus vídeos** antes de adicionar
2. **Use thumbnails leves** (< 200KB)
3. **Evite vídeos muito longos** (máx 10-15 min)
4. **Considere dividir** vídeos grandes em partes
5. **Teste em mobile** para garantir boa experiência
