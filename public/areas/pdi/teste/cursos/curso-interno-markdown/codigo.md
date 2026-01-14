# Blocos de Código

Aprenda a compartilhar código de forma profissional com syntax highlighting.

## Código Inline

Para pequenos trechos de código dentro do texto, use crases simples:

A função `console.log()` é usada para imprimir no console.

---

## Blocos de Código

Use três crases (```) para criar blocos de código:

```
Este é um bloco de código simples
sem syntax highlighting
```

---

## Syntax Highlighting

Adicione a linguagem após as três crases para ativar o highlighting:

### JavaScript

```javascript
function saudacao(nome) {
    return `Olá, ${nome}!`;
}

const resultado = saudacao('Maria');
console.log(resultado); // Olá, Maria!
```

---

### Python

```python
def calcular_media(numeros):
    """Calcula a média de uma lista de números"""
    if not numeros:
        return 0
    return sum(numeros) / len(numeros)

notas = [8.5, 9.0, 7.5, 8.0]
media = calcular_media(notas)
print(f"Média: {media}")  # Média: 8.25
```

---

### HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Minha Página</title>
</head>
<body>
    <h1>Bem-vindo!</h1>
    <p>Este é um exemplo de HTML.</p>
    <button onclick="alert('Clicou!')">Clique aqui</button>
</body>
</html>
```

---

### CSS

```css
/* Estilos modernos */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
}
```

---

### JSON

```json
{
    "curso": {
        "id": "javascript-basico",
        "titulo": "JavaScript Básico",
        "duracao": "20 horas",
        "modulos": [
            {
                "numero": 1,
                "nome": "Introdução",
                "aulas": 5
            },
            {
                "numero": 2,
                "nome": "Variáveis e Tipos",
                "aulas": 8
            }
        ],
        "ativo": true
    }
}
```

---

### SQL

```sql
-- Consulta de vendas por categoria
SELECT 
    c.nome AS categoria,
    COUNT(p.id) AS total_produtos,
    SUM(v.quantidade) AS total_vendido,
    AVG(v.valor) AS ticket_medio
FROM categorias c
INNER JOIN produtos p ON c.id = p.categoria_id
LEFT JOIN vendas v ON p.id = v.produto_id
WHERE v.data >= '2026-01-01'
GROUP BY c.id, c.nome
HAVING total_vendido > 100
ORDER BY total_vendido DESC;
```

---

### Bash/Shell

```bash
#!/bin/bash

# Script de deploy automatizado
echo "🚀 Iniciando deploy..."

# Atualizar código
git pull origin main

# Instalar dependências
npm install

# Build do projeto
npm run build

# Reiniciar servidor
pm2 restart app

echo "✅ Deploy concluído com sucesso!"
```

---

### TypeScript

```typescript
interface Usuario {
    id: number;
    nome: string;
    email: string;
    ativo: boolean;
}

class GerenciadorUsuarios {
    private usuarios: Usuario[] = [];

    adicionar(usuario: Usuario): void {
        this.usuarios.push(usuario);
        console.log(`Usuário ${usuario.nome} adicionado!`);
    }

    buscarPorId(id: number): Usuario | undefined {
        return this.usuarios.find(u => u.id === id);
    }

    listarAtivos(): Usuario[] {
        return this.usuarios.filter(u => u.ativo);
    }
}

const gerenciador = new GerenciadorUsuarios();
gerenciador.adicionar({
    id: 1,
    nome: "João Silva",
    email: "joao@example.com",
    ativo: true
});
```

---

### React (JSX)

```jsx
import React, { useState } from 'react';

function Contador() {
    const [count, setCount] = useState(0);

    return (
        <div className="contador">
            <h2>Contador: {count}</h2>
            <button onClick={() => setCount(count + 1)}>
                Incrementar
            </button>
            <button onClick={() => setCount(count - 1)}>
                Decrementar
            </button>
            <button onClick={() => setCount(0)}>
                Resetar
            </button>
        </div>
    );
}

export default Contador;
```

---

## Código com Números de Linha

Alguns sistemas suportam números de linha (varia por implementação):

```javascript
1: function fibonacci(n) {
2:     if (n <= 1) return n;
3:     return fibonacci(n - 1) + fibonacci(n - 2);
4: }
5: 
6: console.log(fibonacci(10)); // 55
```

---

## Destacar Linhas Específicas

Em alguns sistemas, você pode destacar linhas específicas:

```javascript
function processarDados(dados) {
    // Validação
    if (!dados || dados.length === 0) {
        return []; // Esta linha é importante
    }

    // Processamento
    return dados.map(item => ({
        ...item,
        processado: true  // Esta linha também
    }));
}
```

---

## Comparação: Antes e Depois

### ❌ Antes (código ruim)

```javascript
function calc(a,b,c){
var x=a+b
var y=x*c
return y
}
```

### ✅ Depois (código bom)

```javascript
function calcularTotal(valor1, valor2, multiplicador) {
    const soma = valor1 + valor2;
    const resultado = soma * multiplicador;
    return resultado;
}
```

---

## Linguagens Suportadas

O sistema suporta syntax highlighting para diversas linguagens:

| Linguagem | Código |
|-----------|--------|
| JavaScript | `javascript`, `js` |
| TypeScript | `typescript`, `ts` |
| Python | `python`, `py` |
| Java | `java` |
| C# | `csharp`, `cs` |
| C++ | `cpp`, `c++` |
| Go | `go` |
| Rust | `rust`, `rs` |
| PHP | `php` |
| Ruby | `ruby`, `rb` |
| HTML | `html` |
| CSS | `css` |
| SCSS | `scss` |
| SQL | `sql` |
| JSON | `json` |
| YAML | `yaml`, `yml` |
| Markdown | `markdown`, `md` |
| Bash | `bash`, `sh` |
| PowerShell | `powershell`, `ps1` |

---

## Exercício Prático

### Desafio: Crie um Snippet

Escolha sua linguagem favorita e crie um snippet de código útil:

```
// Seu código aqui
```

---

**Próximo**: Trabalhando com Imagens →
