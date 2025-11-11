export const kpiInfo = {
  receita_total: {
    title: "Receita Total",
    short: "Volume total de cupons gerados, sem custos.",
    long: "A receita total é o valor total de dinheiro que uma empresa gera com a venda de seus bens ou serviços em um determinado período, antes de quaisquer deduções.",
    formula: "Soma do valor dos cupons"
  },
  receita_liquida: {
    title: "Receita Líquida",
    short: "Receita após repasses deduzidos.",
    long: "A Receita Líquida representa o valor retido após os repasses. É o indicador mais preciso da geração de valor para a operação.",
    formula: "Receita Total − Total de Repasses"
  },
  margem_operacional: {
    title: "Margem Operacional",
    short: "Eficiência entre receita líquida e total.",
    long: "A Margem Operacional indica a proporção da receita líquida em relação à receita total e reflete a eficiência ao converter vendas em resultado.",
    formula: "(Receita Líquida / Receita Total) × 100"
  },
  ticket_medio: {
    title: "Ticket Médio",
    short: "Valor médio por transação.",
    long: "O ticket médio é o valor médio que cada cliente gasta em uma compra ou transação em um determinado período.",
    formula: "Faturamento Total / Número de Vendas"
  },
  top_categorias: {
    title: "Top Categorias de Estabelecimentos",
    short: "Setores que são mais relevantes.",
    long: "A análise por categorias identifica os segmentos mais relevantes para o negócio. Isso permite priorizar esforços comerciais, desenvolver soluções específicas e identificar oportunidades de crescimento.",
    formula: "Soma do valor dos cupons por segmento"
  },
  top_parceiros: {
    title: "Top Lojas Parceiras por Receita",
    short: "Ranking das parceiras com maior receita por cupons.",
    long: "Lista as lojas parceiras ordenadas pela soma do valor dos cupons no período. Ajuda a identificar contas estratégicas, orientar negociações e priorizar ações comerciais.",
    formula: "Soma do valor dos cupons por estabelecimento"
  },
  analise_cupons_por_tipo: {
    title: "Análise dos Cupons por Tipo",
    short: "Participação de cada tipo de cupom na receita.",
    long: "A distribuição do volume por tipo de cupom mostra o papel relativo de cada estratégia promocional. Quando os tipos têm participação equilibrada, a operação evita canibalização entre campanhas e amplia o alcance para diferentes perfis de cliente.",
    formula: "Participação (%) = (Transações do tipo / Transações totais) × 100"
  },
  analise_por_periodo_dia: {
    title: "Análise Temporal por Período do Dia",
    short: "Períodos de maior atividade de captura de cupons.",
    long: "A distribuição de atividade ao longo do dia tende a se concentrar nos horários comerciais. Tarde e noite costumam concentrar maior volume, enquanto a manhã tende a registrar menor intensidade.",
    formula: "(Transações no período / Transações totais) × 100"
  },
  participacao_diaria: {
    title: "Participação Diária",
    short: "Análise dos dias com maior participação na receita.",
    long: "A participação de receita por dia mostra variações de desempenho ao longo da semana. Em muitos contextos, dias de meio de semana mantêm participação consistente.",
    formula: "(Receita do dia / Receita total do período) × 100"
  },
  ticket_medio_diario: {
    title: "Ticket Médio Diário",
    short: "Valor médio dos cupons por dia da semana.",
    long: "O ticket médio diário tende a oscilar em faixas estáveis quando há equilíbrio entre mix de parceiros/categorias, intensidade de promoções e sazonalidade de consumo.",
    formula: "Valor total do dia / Quantidade de transações do dia"
  },
  dau: {
    title: "Usuários Ativos Diários (DAU)",
    short: "Total de usuários únicos ativos por dia.",
    long: "O DAU mede a quantidade de usuários únicos que realizaram ao menos uma ação relevante em um determinado dia. Essa métrica captura o hábito de uso diário.",
    formula: "DAU = COUNT(DISTINCT user_id) por dia"
  },
  total_usuarios: {
    title: "Total de Usuários",
    short: "Total de usuários registrados na plataforma.",
    long: "Representa a base total de usuários cadastrados. Este número cresce conforme novos usuários se registram e utilizam a plataforma.",
    formula: "COUNT(DISTINCT user_id)"
  },
  total_parceiros: {
    title: "Total de Parceiros",
    short: "Número total de estabelecimentos parceiros.",
    long: "Representa a quantidade de estabelecimentos parceiros ativos. Este número indica a amplitude da rede de parceiros disponíveis.",
    formula: "COUNT(DISTINCT estabelecimento)"
  },
  receita_media_parceiro: {
    title: "Receita Média por Parceiro",
    short: "Valor médio de receita gerado por parceiro.",
    long: "A Receita Média por Parceiro é uma métrica de desempenho financeiro que mede a receita média gerada por cada parceiro de uma empresa em um determinado período.",
    formula: "receita total do período / numero total de parceiros no período"
  },
  total_segmentos: {
    title: "Total de Segmentos",
    short: "Quantidade de categorias de estabelecimentos.",
    long: "Representa a diversidade de segmentos de mercado atendidos pela plataforma. Maior diversificação indica menor dependência de categorias específicas.",
    formula: "COUNT(DISTINCT categoria_estabelecimento)"
  },
  taxa_retencao: {
    title: "Taxa de Retenção",
    short: "Percentual de usuários que retornam.",
    long: "A taxa de retenção de clientes indica a fidelidade e a satisfação dos clientes de uma empresa, mostrando a porcentagem de clientes que continuaram usando seus produtos ou serviços em um determinado período.",
    formula: "[(clientes finais – novos clientes) / clientes iniciais] x 100"
  },
  usuarios_ativos: {
    title: "Usuários Ativos",
    short: "Quantidade de usuários com atividade recente.",
    long: "Representa o número de usuários que realizaram pelo menos uma ação no período. É um indicador direto de engajamento e uso efetivo da plataforma.",
    formula: "COUNT(DISTINCT user_id com atividade no período)"
  }
};
