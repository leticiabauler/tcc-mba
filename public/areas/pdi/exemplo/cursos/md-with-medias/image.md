# Organização de Código

A organização do código é fundamental para manter projetos de LabVIEW sustentáveis e profissionais.

## Estrutura de Projetos

### Hierarquia Recomendada

```
MeuProjeto.lvproj
├── Source/
│   ├── Main.vi
│   ├── SubVIs/
│   │   ├── Initialization.vi
│   │   └── ProcessData.vi
│   └── TypeDefs/
│       └── ConfigData.ctl
├── Tests/
│   └── Unit Tests/
└── Documentation/
    └── README.md
```

## Convenções de Nomenclatura

### VIs e SubVIs

- **Use nomes descritivos**: `ReadSensorData.vi` em vez de `Read.vi`
- **PascalCase**: `ProcessTemperatureData.vi`
- **Verbos para ações**: `Initialize`, `Process`, `Calculate`

### Variáveis e Controles

- **camelCase para variáveis locais**: `sensorValue`, `maxTemperature`
- **Nomes significativos**: evite `x`, `temp`, `data`
- **Unidades quando aplicável**: `temperatureCelsius`, `pressureBar`

## Painel Frontal

### Layout Profissional

1. **Agrupe controles relacionados** usando clusters
2. **Alinhe elementos** usando as ferramentas de alinhamento
3. **Use cores com moderação** - mantenha profissional
4. **Deixe espaço em branco** - não sobrecarregue

### Exemplo de Organização

Se você tiver uma imagem de exemplo, pode adicioná-la assim:

![Exemplo de Organização](SIPATinho.png)

**Nota:** Coloque suas imagens na mesma pasta do curso ou crie uma subpasta `images/` dentro do curso.

## Diagrama de Blocos

### Regras de Ouro

1. **Fluxo da esquerda para direita**
   - Dados fluem naturalmente
   - Fácil de seguir a lógica

2. **Evite cruzamentos de fios**
   - Use roteamento limpo
   - Considere restructurar se necessário

3. **Tamanho consistente de estruturas**
   - Case Structures alinhadas
   - Loops com tamanho adequado

4. **Comentários significativos**
   - Explique o "porquê", não o "o quê"
   - Use Free Labels para documentar

### Antes e Depois

**❌ Código Desorganizado**
- Fios cruzados
- Sem comentários
- Difícil de entender

**✅ Código Organizado**
- Fluxo claro
- Bem documentado
- Fácil manutenção

## SubVIs

### Quando criar um SubVI?

Crie um SubVI quando:

- ✅ O código se repete em múltiplos lugares
- ✅ Uma seção lógica pode ser isolada
- ✅ O diagrama está ficando muito grande
- ✅ Você quer reutilizar funcionalidade

### Boas Práticas para SubVIs

1. **Uma responsabilidade por VI**
2. **Interface clara** (entradas/saídas bem definidas)
3. **Documentação** no Description do VI
4. **Ícone personalizado** representativo
5. **Error handling** consistente

## Exercício Prático

Reorganize um dos seus VIs aplicando estas técnicas:

1. Renomeie variáveis com nomes descritivos
2. Alinhe elementos do painel frontal
3. Melhore o fluxo do diagrama de blocos
4. Adicione comentários relevantes
5. Extraia código repetido para SubVIs

---

**Próximo**: Padrões de Design →
