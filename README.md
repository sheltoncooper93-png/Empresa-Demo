# EMPRESA DEMO — Gestão Empresarial

Sistema integrado de gestão empresarial (PWA, offline) que reconstrói funcionalmente a
planilha **Gestao_Empresarial_SaaS_clone.xlsx** com uma experiência de software profissional,
seguindo a identidade visual do PDF de referência.

> **Abrir agora:** `index.html` (funciona diretamente no navegador, sem instalação nem servidor).

---

## 1. O que está incluído

| Módulo | Ecrã | Funções principais |
|---|---|---|
| Início | `#/inicio` | 18 indicadores, período mês/ano, gráfico de 6 meses, 7 atalhos, alertas e notificações |
| Vendas | `#/vendas` | lista com pesquisa/filtros/ordenação, venda multi-linha, edição, cancelamento, cobranças parciais, recibos |
| Caixa / POS | `#/pdv` | carrinho, descontos, dois métodos de pagamento, troco, saldo, carrinhos guardados |
| Stock | `#/stock` | gráfico em anel, cartões com barra de progresso, ficha completa, históricos de compras/vendas/movimentos |
| Compras | `#/compras` | entradas de stock, custo médio ponderado, estado e vencimento, fornecedor |
| Fornecedores | `#/fornecedores` | ficha, compras, despesas, valores pagos/pendentes |
| Movimentos | `#/movimentos` | tipos com efeito +1/−1, quantidade líquida, responsável, autorização para stock negativo |
| Despesas | `#/despesas` | categorias, IVA automático, recorrência, estados, relatório por categoria com "Outras" |
| Catálogo | `#/catalogo` | custo efetivo (manual ou stock × consumo), margem, IVA próprio/padrão, preço com IVA, inativação |
| Clientes | `#/clientes` | ficha, faturação, dívida com pagamentos parciais, última compra, ranking, tarefas |
| Funcionários | `#/funcionarios` | custo mensal com encargos, admissão/saída, histórico salarial, PIN de 4 dígitos, perfis |
| Tarefas | `#/tarefas` | responsável, cliente, prioridade, estado, dias restantes, alertas |
| Dashboard | `#/dashboard` | filtro por ano, 18 KPIs, tabela Jan–Dez com meta, despesas por categoria, rankings, stock a repor |
| Listas | `#/listas` | 15 listas editáveis, adicionar/editar/eliminar/reordenar/pesquisar |
| Configuração | `#/config` | empresa, moeda, IVA, prazo, ano, meta, encargos, módulos ativos, cópias de segurança |

Navegação: **Início · Vendas · Stock · Despesas · Mais** — barra inferior flutuante em pílula no
telemóvel (ativo com ícone + nome em verde-lima; restantes apenas ícone) e navegação lateral no
computador.

---

## 2. Como executar

### No computador
1. Descompacte a pasta.
2. Abra `index.html` num navegador moderno (Chrome, Edge, Safari, Firefox).

### No telemóvel / instalar como app (PWA)
A instalação requer **HTTPS** (ou `localhost`). Opções gratuitas:
- **Netlify Drop** — app.netlify.com/drop → arraste a pasta.
- **Cloudflare Pages** — Workers & Pages → Upload assets → envie a pasta.
- **GitHub Pages** — envie os ficheiros e ative Pages.

Depois: Android Chrome `⋮ → Instalar app` · iPhone Safari `Partilhar → Adicionar ao ecrã principal`.
A app funciona **sem internet** após a primeira visita (service worker com cache do app shell).

### Servidor local (para testar o modo offline)
```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

---

## 3. Dados e persistência

- Todos os dados ficam **no dispositivo** (`localStorage`, chave `empresa_demo_db_v1`).
- **Mais → Guardar cópia de segurança** exporta um JSON completo; **Restaurar cópia** importa-o.
- **Mais → Recarregar dados de exemplo** repõe os dados da planilha original.
- **Mais → Apagar tudo** deixa a aplicação vazia, mantendo listas, configuração e um administrador.

### Dados de demonstração
Reproduzem a planilha: 6 clientes, 9 serviços/produtos, 20 vendas, 17 despesas, 3 funcionários,
5 itens de stock, 1 compra, 5 movimentos, 6 tarefas, 12 fornecedores e as listas originais.
Os totais conferem com o Excel: **receita 68 395,00**, **despesas 7 933,00**, **pessoal 51 727,50**,
**a receber c/IVA 14 947,00**, **em atraso 10 947,00**, **19 vendas**.

---

## 4. Correspondência Excel → aplicação

| Folha do Excel | Módulo | Observações |
|---|---|---|
| Início | Início | menu convertido em navegação + KPIs e alertas |
| Configuração | Configuração | nomes, moeda, IVA, prazo, ano, meta, encargos, módulos |
| Dashboard | Dashboard | mesma lógica SUMIFS/COUNTIFS + custo das vendas |
| Clientes | Clientes | indicadores por ID, ranking por faturação |
| Serviços | Catálogo | custo efetivo, margem, IVA, ligação a stock |
| Vendas | Vendas + POS + Cobranças | multi-linha, pagamentos parciais, recibos |
| Despesas | Despesas | IVA, recorrência, relatório por categoria |
| Funcionários | Funcionários | custo mensal, histórico salarial, permissões |
| Stock | Stock + Compras + Movimentos | custo médio ponderado, situações, sugestão de compra |
| Tarefas | Tarefas | dias restantes e alertas calculados |
| Listas | Listas | listas dinâmicas que alimentam todos os menus |

> Nota transparente: o ficheiro anexado contém **11 folhas** (não 15). Todas foram analisadas
> (cabeçalhos, fórmulas, validações, nomes definidos e dados) e integralmente reproduzidas.

---

## 5. Decisões, correções e melhorias documentadas

1. **Custo das vendas e lucro bruto (correção ao Excel).** A folha *Vendas* do Excel não tinha
   colunas de custo, pelo que o dashboard somava apenas `Receita − Despesas − Pessoal`. Como o
   caderno de encargos exige custo das vendas, lucro bruto e margens, o custo é agora copiado para
   cada linha no momento da venda. **Resultado = lucro bruto − despesas − pessoal.** Com os dados de
   exemplo isto dá **−17 090,50** (o Excel mostrava 8 734,50 porque ignorava 25 825,00 de custo).
   O valor equivalente ao Excel continua consultável: receita − despesas − pessoal.
2. **Relações por ID.** Clientes, fornecedores, produtos, funcionários, stock, listas e tarefas são
   ligados por identificadores (CLI-0001, SRV-001, STK-0001, L-…), nunca pelo nome.
3. **Vendas multi-linha.** O Excel tinha uma linha por venda; a app permite vários itens, com
   subtotal, IVA, custo e lucro por linha e totais da venda.
4. **Pagamentos parciais e histórico.** Introduzidos pagamentos independentes (valor, data, forma);
   o estado Paga/Pendente é derivado do saldo e nunca guardado como verdade absoluta.
5. **Atraso calculado.** `EM ATRASO · N dias` é derivado de vencimento vs. data atual (nunca
   armazenado como estado), como pedido.
6. **Cancelamento.** Venda cancelada sai de todos os totais, stock e indicadores; os pagamentos
   associados são removidos. É possível reativar.
7. **Custo médio ponderado.** `(qtd inicial × custo inicial + subtotais das compras) ÷ (qtd inicial +
   qtd comprada)`; se o denominador for zero usa o custo inicial; valor em stock apenas sobre
   quantidade positiva.
8. **Stock negativo.** Bloqueado para operadores; com autorização de administrador é permitido com
   confirmação explícita. Serviços sem ligação a stock não movimentam inventário.
9. **IVA estimado a entregar.** IVA liquidado em vendas do ano − IVA de compras − IVA de despesas do
   ano. Pode ser negativo (crédito de imposto).
10. **Pessoal por mês.** Respeita admissão, saída, estado e histórico salarial; meses futuros
    apresentam zero. O encargo individual, quando vazio, usa a percentagem da configuração.
11. **Listas editáveis.** Eliminação bloqueada quando a opção está em uso (contagem real de
    utilizações); reordenação e pesquisa incluídas. Alterações refletem-se de imediato nos menus.
12. **"Outras" nas despesas.** Categorias órfãs (por exemplo, após eliminar uma categoria em uso
    antigo) são agregadas numa linha "Outras", garantindo que o total inclui todas as despesas.
13. **Eliminações protegidas.** Clientes com vendas não podem ser eliminados (inativar em vez disso);
    produtos vendidos também não (inativar). Existe sempre pelo menos um administrador.
14. **Recibos.** Documento branco imprimível/PDF com empresa, NUIT, venda, cliente, itens, IVA,
    totais, pagamentos, saldo, data e vendedor.

---

## 6. Estrutura do projeto

```
index.html                 app shell (PWA)
manifest.webmanifest       instalação
sw.js                      cache offline
css/styles.css             design system (dark + verde-lima)
js/seed.js                 dados de demonstração (derivados da planilha)
js/store.js                persistência + motor de cálculo financeiro
js/ui.js                   ícones Lucide inline, modais, formulários, toasts, gráficos
js/shared.js               componentes de página reutilizáveis
js/views-core.js           Início, Dashboard, Mais, notificações, sessão/PIN
js/views-sales.js          Vendas, detalhe, editor, cobranças, recibo, POS
js/views-stock.js          Stock, compras, movimentos, fornecedores
js/views-expenses.js       Despesas, relatórios, catálogo
js/views-people.js         Clientes, funcionários, tarefas
js/views-system.js         Listas, configuração, cópias de segurança
js/app.js                  router, layout, navegação, permissões
fonts/inter-var.woff2      Inter (local, offline)
icons/                     ícones PWA
```

Sem dependências externas, sem build: HTML + CSS + JavaScript.

---

## 7. Controlo de qualidade (QA) executado

Testes automatizados em Chromium (390 px, 320 px, 820 px e 1440 px), sem erros de consola:

- Navegação por todos os 20 ecrãs e respetivos detalhes.
- Criação de venda multi-linha → cobrança total e parcial (2 pagamentos) → estado e saldo corretos.
- Rejeição de pagamento superior ao saldo.
- Cancelamento de venda → receita recalculada e pagamentos removidos.
- Checkout no POS com troco → recibo e venda Paga.
- Compra → stock e custo médio atualizados; movimento com efeito correto.
- Venda de produto ligado a stock → saída de inventário pelo fator de consumo.
- Cálculos conferidos: stock, custo médio, valor, situações e sugestão de reposição.
- Eliminação de opção de lista em uso bloqueada.
- Perfil operador sem acesso à configuração; PIN de 4 dígitos; troca de operador.
- Funcionamento offline: navegação e recarregamento com a rede desligada.
- Exportação de cópia de segurança válida (JSON) e layout sem overflow horizontal a 320 px.

---

## 8. Identidade visual

Fundo `#0A0E14` · cartões `#151B23` · superfícies `#1F2833` · texto `#F3F6F8` / `#8B96A3` ·
verde-lima `#C8F25A` (ações e navegação ativa) · laranja `#F5A94A` (despesas/pendências) ·
verde `#4ADE80` (pago/disponível) · vermelho `#FF7A7A` (atrasos/erros) · azul `#7B9BFF`
(informação complementar). Inter, ícones lineares Lucide, cartões de 22 px, botões em pílula,
etiquetas translúcidas e animações discretas, com áreas seguras respeitadas em iOS/Android.
