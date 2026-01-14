# Introdução aos Vídeos

Bem-vindo ao curso sobre como usar vídeos no PDI Learning Hub! 🎬

## Duas Formas de Usar Vídeos

O sistema oferece **duas maneiras** de incorporar vídeos nos cursos:

### 1️⃣ Seção Dedicada de Vídeo

Use o tipo `"type": "video"` no `curso.json` para criar uma seção exclusiva de vídeo.

**Vantagens:**
- ✅ Simples de configurar
- ✅ Player centralizado e destacado
- ✅ Navegação clara entre seções
- ✅ Suporte a poster (thumbnail)

**Quando usar:**
- Vídeo é o conteúdo principal
- Não precisa de muito texto explicativo
- Tutorial prático completo

### 2️⃣ Vídeo Dentro do Markdown

Incorpore vídeos diretamente nos arquivos `.md` usando HTML.

**Vantagens:**
- ✅ Combina vídeo com texto
- ✅ Múltiplos vídeos na mesma seção
- ✅ Contexto antes e depois do vídeo
- ✅ Mais flexibilidade

**Quando usar:**
- Precisa explicar conceitos antes do vídeo
- Quer adicionar notas após o vídeo
- Tutorial passo a passo com demonstrações

---

## Estrutura do Curso

Este curso está dividido em 4 seções:

1. **Introdução** (você está aqui!)
2. **Vídeo: Demonstração Prática** ← Seção de vídeo dedicada
3. **Vídeos Dentro do Markdown** ← Vídeos incorporados em texto
4. **Quando Usar Cada Formato** ← Comparação e guia

---

## Configuração de Vídeos

### Formato do Arquivo

- **Codec:** H.264 (MP4)
- **Resolução:** 720p ou 1080p
- **Tamanho:** < 50MB (recomendado)
- **Áudio:** AAC

### Organização de Arquivos

```
curso-interno-videos/
├── curso.json
├── introducao.md
├── videos/
│   ├── demo.mp4              ← Vídeo principal
│   ├── demo-poster.jpg       ← Thumbnail
│   ├── parte-1.mp4           ← Outros vídeos
│   └── parte-2.mp4
└── videos-no-markdown.md
```

---

## Exemplo de Configuração

### No curso.json (Seção Dedicada)

```json
{
    "id": "video-demo",
    "title": "Vídeo: Demonstração Prática",
    "type": "video",
    "content": "videos/demo.mp4",
    "poster": "videos/demo-poster.jpg"
}
```

### No Markdown (Incorporado)

```markdown
<div class="video-container">
    <video controls poster="videos/thumbnail.jpg">
        <source src="videos/demo.mp4" type="video/mp4">
        Seu navegador não suporta vídeos.
    </video>
</div>
```

---

## Processamento Automático

O sistema automaticamente:

1. ✅ Resolve caminhos relativos
2. ✅ Adiciona o `basePath` do curso
3. ✅ Aplica estilos responsivos
4. ✅ Configura player HTML5

**Você não precisa se preocupar** com caminhos absolutos ou configuração do player!

---

## Recursos do Player

O player de vídeo inclui:

- ▶️ Play/Pause
- 🔊 Controle de volume
- ⏩ Avanço/retrocesso
- 📺 Tela cheia
- ⏱️ Barra de progresso
- 🎬 Thumbnail antes do play

---

## Placeholder de Vídeos

**⚠️ IMPORTANTE:** Este curso usa placeholders para vídeos.

Para ativar os vídeos de verdade:

1. Crie a pasta `videos/` neste curso
2. Adicione seus vídeos (formato MP4)
3. Opcionalmente, crie thumbnails (formato JPG/PNG)
4. Os vídeos serão carregados automaticamente!

### Estrutura Esperada

```
curso-interno-videos/
└── videos/
    ├── demo.mp4           ← ADICIONE SEU VÍDEO AQUI
    ├── demo-poster.jpg    ← ADICIONE THUMBNAIL AQUI
    ├── parte-1.mp4        ← Vídeos para a seção 3
    └── parte-2.mp4
```

---

## Próxima Seção

Na próxima seção, você verá um exemplo de **seção dedicada de vídeo**.

Se você já adicionou o arquivo `videos/demo.mp4`, o vídeo será reproduzido. Caso contrário, verá o player com mensagem de erro (o que é normal!).

---

**Continue** para ver o vídeo de demonstração! →
