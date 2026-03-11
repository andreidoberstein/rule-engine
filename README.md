# Smollan

Este projeto é um sistema de ponta a ponta focado no gerenciamento e simulação de orçamentos (Budgets). Seu principal diferencial é ser orientado a um **Motor de Regras dinâmico** em vez de cálculos puramente programados no código.

## 🛠 Tech Stack

### Back-end
* **NestJS:** Framework progressivo para Node.js construído com TypeScript completo. Ele fornece uma estrutura opinativa que promove uma arquitetura modularizada, o que é vital para separar domínios lógicos.
* **Prisma ORM:** Um ORM (Object-Relational Mapping) moderno e "Type-Safe" que gerencia o modelo de dados, as consultas do Postgres e as migrações (Migrations).
* **PostgreSQL:** Sistema de banco de dados relacional robusto para mapeamento transacional exato de verbas, clientes e orçamentos.
* **Arquitetura (DDD & Clean Architecture Adaptada):** O código é dividido em módulos de negócio (Ex: `users`, `budgets`, `rule-templates`). Dentro deles, as camadas são subdivididas em `application` (onde ficam os DTRs e Use Cases/Services), `domain` (onde ficam as interfaces e entidades em sua forma pura) e `infrastructure` (Implementação do Prisma, Controllers (API REST) e injeção de dependências).
  * **Motivação:** Escalar o projeto. O isolamento garante que uma mudança no modelo do banco de dados (Infraestrutura) não quebre imediatamente a regra de negócio (Interface de Domínio).

### Front-end
* **React + Vite + TypeScript:** Para uma interface de usuário tipada, veloz no desenvolvimento e moderna no bundle de produção.
* **TailwindCSS:** Uma abordagem unificada e atômica de design, permitindo que componentes sejam padronizados rapidamente sem poluir os estilos globais.
* **Componentes base:** Utilizamos a biblioteca de ícones `lucide-react`, roteamento com `react-router-dom` e os Toasts nativos do `sonner`.
* **Fluxo Orientado e Dinâmico:** Telas contendo UI rica como "Card Lists" e "Wizards" em múltiplos steps (Steps no BudgetsCreate).

---

## ⚙️ O Motor de Regras (Rules Engine)

O coração do sistema é como o "valor de uma posição/vaga" é calculado em um Orçamento. Diferente de um sistema comum onde a "Verba de Transporte" custa 100 reais direto no código, este projeto externaliza essa responsividade em um Motor Parametrizável.

### Por que usar um Motor de Regras?
1. **Flexibilidade Comercial:** No cenário real, as regras não são as mesmas. Um Assistente num estado X pode ter regras trabalhistas ou custos diferentes de outro em Y. Da mesma forma, um "Cliente Z" pode ter um acordo comercial diferente.
2. **Histórico Seguro:** Se o motor fosse fixo, atualizações sindicais afetariam orçamentos antigos. O Engine foi desenvolvido para agir na *Simulação* (congelando as respostas) para criar o Orçamento.

### Como a Lógica Funciona?

O fluxo se divide em 3 pilares: **1. Cadastro do Template de Regras**, **2. A Simulação**, e **3. A Aplicação do Orçamento (Tweaking).**

#### 1. Cadastro do Template de Regras
O Admin cadastra uma parametrização para um `Verba Type` específico.
Essa regra pode ser:
- **Global:** Válida para qualquer situação.
- **Específica de UF:** Válida apenas para uma unidade da Federação.
- **Específica de Cliente:** Válida apenas para uma empresa (acordo comercial).

#### 2. Processo de Avaliação (Simulação)
Quando o sistema vai gerar o Orçamento (No Front-end: Step 3 de BudgetsCreate), o backend executa o **Rule Evaluator** para cada cargo/praça definido (Ex: Cargos alocados na praça SP pro Cliente X).
A regra da "Taxa de Sucesso" busca o fallback, pegando a regra MAIS ESPECÍFICA possível, ignorando as globais caso tenha uma específica cadastrada.

**Exemplo de Código (Backend - Fallback Pattern):**
```typescript
// fallback_evaluation (Conceito do RulesTemplatesService)
async evaluateRules(clientId: string, stateUf: string): Promise<RuleTemplate[]> {
    // 1. Busca TODAS as regras para todos os tipos possíveis daquele cenário (Global, UF X, Cliente Y, Cliente Y+UF X)
    const allTemplates = await this.prisma.ruleTemplate.findMany({ ... });
    
    // 2. Agrupa por "Tipo de Verba" e aplica a pontuação (Fallback)
    // O sistema descarta as regras perdedoras e aplica a pontuação máxima
    // Ex: Regra com Cliente_ID && State_UF = 4 pontos (Aplica-se em prioridade 1!)
    // Regra Global sem UF e Sem Cliente = 1 ponto.
    
    // O array resultante são os parâmetros oficiais aplicados aquele cenário no momento EXATO da simulação.
    return matchedWinners;
}
```

#### 3. Simulação e Finalização (Tweaking no Frontend)
Uma vez avaliada pelo Motor, a Simulação exibe os componentes na tela para aprovação.
No mundo real, o analista pode querer abrir uma "exceção" naquele orçamento exato (ex: aumentar temporariamente a porcentagem de comissão deste orçamento de 5% pra 7%).
Para isso, nós permitimos alterar os parâmetros (`base_calc_type` e `base_value`) do "snapshot" sem alterar o cadastro oficial global, salvando tudo como "Verba do Orçamento".

**Exemplo de Lógica de Ajuste no Frontend (`BudgetsCreate.tsx`):**
```tsx
const saveVerbaEdit = () => {
    // Pegar o snapshot da regra atual da simulação
    const verba = role.verbas[editingVerba.verbaIdx];
    
    // O usuário altera o "valor base" da regra de forma customizada pra esse Orçamento
    verba.base_value = Number(editVerbaForm.base_value);
    
    // Recalcular no Front-end o subtotal da vaga multiplicando as cabecinhas (vagas)
    if (verba.base_calc_type === 'FIXED') {
      verba.total_calculated = verba.base_value * role.headcount;
    } else {
      verba.total_calculated = verba.base_value; // %
    }
    
    setSimulatedData(newData);
    calculateTotal(newData); // Recalcula R$ Global dinâmico
};
```

Quando o salvamento é disparado com sucesso pro Backend, aquela "Simulação" converte-se em Registros Estáticos (`BudgetVerba`). O Prisma Entity grava o valor do cenário perfeitamente na tabela:

```prisma
model BudgetVerba {
  id              String   @id @default(uuid()) @db.Uuid
  base_calc_type  String   @default("FIXED") // Salva a "Métrica" que foi usada (Ex: % ou R$) 
  base_value      Decimal                    // Salva a regra que o usuário aplicou (+ histórico seguro contra mudanças futuras do RuleTemplates)
  total_calculated Decimal                   // Salva o cálculo Financeiro Exato na época!
  // ... chaves estrangeiras
}
```

Deste modo a arquitetura consegue ser extremamente configurável usando as tabelas paramétricas (`RuleTemplates`), mas ao mesmo tempo imutável e à prova de corrupção ou auditoria para transações gravadas (`BudgetVerba`).
