# Exemplos Práticos

Vamos aplicar tudo que aprendemos em exemplos do mundo real.

## Exemplo 1: Sistema de Aquisição de Dados

### Requisitos

- Ler temperatura de 4 sensores
- Atualizar UI em tempo real
- Salvar dados a cada 10 segundos
- Interface responsiva

### Solução: Queued Message Handler

**Por quê?**
- UI responsiva (Event Loop)
- Aquisição contínua (State Machine)
- Salvamento assíncrono

### Estrutura

```
Event Structure Loop (UI)
    ↓
  Queue
    ↓
State Machine
    ├── Initialize
    ├── Acquire Data
    ├── Update Display
    ├── Save Data
    └── Shutdown
```

### Código Chave

**Event Loop (Producer)**
```
- Start Button → Enqueue "Initialize"
- Stop Button → Enqueue "Shutdown"
- Timeout (100ms) → Enqueue "Acquire Data"
```

**State Machine (Consumer)**
```
Initialize:
  - Configure DAQ
  - Next State: Acquire Data

Acquire Data:
  - Read all sensors
  - Next State: Update Display

Update Display:
  - Update charts
  - Check if time to save
  - Next State: Save Data OR Acquire Data

Save Data:
  - Write to file
  - Next State: Acquire Data
```

## Exemplo 2: Teste Automatizado de Transformador

### Requisitos

- Sequência fixa de testes
- Diferentes configurações por teste
- Relatório detalhado
- Tratamento de erros robusto

### Solução: State Machine

**Por quê?**
- Sequência bem definida
- Fácil adicionar/remover testes
- Fluxo claro e documentado

### Estados

```
1. Initialize
   - Conectar instrumentos
   - Verificar conexões
   
2. Setup Transformer
   - Aplicar configurações
   - Aguardar estabilização
   
3. Test Resistance
   - Medir resistência dos enrolamentos
   - Validar limites
   
4. Test Isolation
   - Aplicar tensão de teste
   - Medir corrente de fuga
   
5. Test Ratio
   - Aplicar tensão primária
   - Medir tensão secundária
   - Calcular relação
   
6. Generate Report
   - Compilar resultados
   - Salvar em PDF
   
7. Cleanup
   - Desconectar equipamentos
   - Salvar logs
   
8. Error
   - Tratar erro específico
   - Decidir se continua ou aborta
```

### TypeDef para Estados

```labview
enum TestStates {
    Initialize,
    SetupTransformer,
    TestResistance,
    TestIsolation,
    TestRatio,
    GenerateReport,
    Cleanup,
    Error,
    Idle
}
```

## Exemplo 3: Monitor de Múltiplos Equipamentos

### Requisitos

- Monitorar 10 equipamentos simultaneamente
- Cada equipamento tem protocolo diferente
- Centralizar dados
- Alertas em tempo real

### Solução: Master/Slave com Producer/Consumer

**Estrutura**

```
Master VI
  ├── Launch 10 Slave VIs (um por equipamento)
  ├── Receive data via Queue
  ├── Consolidate data
  └── Update central dashboard

Each Slave VI
  ├── Connect to equipment
  ├── Acquire data
  ├── Send to Master via Queue
  └── Handle local errors
```

### Comunicação

**Slave → Master**
```
Queue Message = {
    equipmentID: "EQUIP_01",
    timestamp: current_time,
    data: {
        temperature: 45.2,
        pressure: 2.1,
        status: "OK"
    },
    error: error_cluster
}
```

## Exemplo 4: Calibração Interativa

### Requisitos

- Interface amigável
- Múltiplos pontos de calibração
- Validação em tempo real
- Salvar certificado

### Implementação

**Interface**
- Cluster para cada ponto de calibração
- Gráfico mostrando erro
- Botões para avançar/voltar
- Status visual claro

**Lógica**
```
State Machine com:
  - Welcome
  - Enter Reference
  - Measure Point 1..N
  - Calculate Coefficients
  - Verify Calibration
  - Generate Certificate
```

**TypeDef para Calibration Data**
```
cluster CalibrationPoint {
    double reference_value;
    double measured_value;
    double error;
    boolean valid;
}
```

## Boas Práticas Aplicadas

### 1. Configuração por Arquivo

```
config.ini:
[Equipment]
GPIB_Address=10
Timeout=5000
Retry_Count=3

[Test]
Temperature_Min=20.0
Temperature_Max=80.0
Samples_Per_Point=10
```

Carregue no Initialize state!

### 2. Log Estruturado

```
[2026-01-14 10:15:23] [INFO] Test started
[2026-01-14 10:15:24] [DEBUG] GPIB connection established
[2026-01-14 10:15:30] [INFO] Resistance: 10.5 Ω (PASS)
[2026-01-14 10:15:45] [ERROR] Isolation test failed: Current > 1mA
[2026-01-14 10:15:46] [INFO] Test aborted - see error log
```

### 3. SubVIs Reutilizáveis

Crie biblioteca de SubVIs:
- `GPIB_Initialize.vi`
- `GPIB_Write.vi`
- `GPIB_Read.vi`
- `Parse_Response.vi`
- `Validate_Limits.vi`
- `Generate_PDF_Report.vi`

### 4. Error Handling Consistente

```
For cada SubVI:
  - Error In (required)
  - Error Out (required)
  - Executa apenas se Error In = No Error
  - Propaga erro com contexto adicional
```

## Checklist de Qualidade

Antes de entregar seu projeto:

- [ ] Todos os VIs têm ícones personalizados
- [ ] Description preenchido em todos os VIs
- [ ] Convenção de nomes seguida
- [ ] Error handling implementado
- [ ] Código comentado onde necessário
- [ ] SubVIs para código repetido
- [ ] Configurações em arquivo externo
- [ ] Log de eventos implementado
- [ ] Testado com dados reais
- [ ] Documentação técnica criada

## Recursos Adicionais

### Bibliotecas Recomendadas

1. **JKI VI Package Manager**
   - Gerenciamento de pacotes
   - Bibliotecas da comunidade

2. **OpenG Toolkit**
   - Ferramentas úteis
   - File I/O, arrays, strings

3. **DQMH Framework**
   - Framework profissional
   - Baseado em QMH

### Onde Aprender Mais

- 📚 NI Community Forums
- 📺 NI YouTube Channel
- 📖 LabVIEW Style Guide (NI)
- 🎓 NI Certification Program

## Conclusão

Parabéns por completar o curso! 🎉

Você agora sabe:
- ✅ Como organizar código profissionalmente
- ✅ Implementar padrões de design reconhecidos
- ✅ Aplicar boas práticas em projetos reais
- ✅ Criar código manutenível e escalável

### Próximos Passos

1. **Aplique** estas práticas em seus projetos
2. **Revise** código antigo e refatore
3. **Compartilhe** conhecimento com a equipe
4. **Continue aprendendo** - tecnologia sempre evolui

### Feedback

Suas sugestões são importantes! Entre em contato:
- 📧 qualidade@weg.net
- 💬 Teams: Canal Qualidade PDI

---

**Obrigado por participar!** 🚀
