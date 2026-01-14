# 📚 Cursos da Equipe de Teste

Esta pasta contém cursos de exemplo demonstrando todas as possibilidades do sistema.

## 📂 Estrutura

Cada curso interno tem sua própria pasta com:
- `curso.json` - Configuração do curso
- Arquivos `.md` - Seções em Markdown
- `images/` - Imagens do curso (opcional)
- `videos/` - Vídeos do curso (opcional)

## 🎯 Cursos Disponíveis

### Cursos Internos (Markdown + Vídeo)

1. **curso-interno-markdown/** - Curso completo com múltiplas seções Markdown
2. **curso-interno-videos/** - Curso combinando Markdown e vídeos
3. **curso-badges/** - Demonstração de badges
4. **curso-sem-descricao/** - Configuração sem descrição
5. **curso-sem-duracao/** - Configuração sem duração
6. **curso-sem-badges/** - Configuração sem badges
7. **curso-minimo/** - Configuração mínima possível
8. **curso-titulo-longo/** - Teste de UX com título longo
9. **curso-titulo-curto/** - Teste de UX com título curto
10. **badge-verde/**, **badge-azul/**, etc. - Demonstrações de cores de badges
11. **ultra-simples/** - Curso ultra minimalista

### Cursos Externos (Links)

Os cursos externos não precisam de pasta, apenas a configuração no `team.json`:
- Curso Externo - Link Direto
- Link Externo - GitHub
- Link Externo - YouTube
- Link Simples

## 🔧 Como Criar Novos Cursos

### Curso Interno

1. Crie uma pasta com o `courseId`
2. Crie o `curso.json` com a estrutura
3. Crie os arquivos `.md` para cada seção
4. Adicione imagens/vídeos se necessário

### Curso Externo

1. Adicione no `team.json` com `type: "external"`
2. Use a propriedade `link` com a URL
3. Não precisa criar pasta de curso

## 📖 Referência

Consulte os cursos de exemplo para ver todas as possibilidades de configuração.
