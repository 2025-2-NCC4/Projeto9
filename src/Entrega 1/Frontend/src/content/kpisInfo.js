// mantenha tudo que é texto aqui: curto, longo e fórmula
export const KPI_INFO = {
  receita_total: {
    titulo: "Receita Total",
    short: "Volume total de cupons gerados, sem custos.",
    long:
      "A Receita Total representa a soma de todos os valores de cupons gerados no período. " +
      "Ela oferece uma visão macro do volume financeiro sem considerar custos, descontos ou repasses.",
    formula: "Soma do valor dos cupons",
  },
  receita_liquida: {
    titulo: "Receita Líquida",
    short: "Receita após repasses deduzidos.",
    long:
      "A receita líquida representa o valor que a PicMoney retém após os repasses. Ela é o indicador mais preciso da geração de valor.",
    formula: "Receita Total − Total de Repasses",
  },
  margem_operacional: {
    titulo: "Margem Operacional",
    short: "Eficiência entre receita líquida e total.",
    long:
      "A Margem Operacional indica a proporção da receita líquida em relação à receita total, " +
      "e reflete a eficiência operacional da PicMoney ao transformar vendas em resultado.",
    formula: "(Receita Líquida / Receita Total) x 100",
  },
  top_categorias: {
    titulo: "Top Categorias de Estabelecimentos",
    short: "Setores que são mais relevantes.",
    long: "A análise por categorias identifica os segmentos mais relevantes para o negócio. Isso permite à PicMoney priorizar esforços comerciais, desenvolver soluções específicas e identificar oportunidades de crescimento.",
    formula: "Soma do valor dos cupons por seguimento"
  },
  top_parceiros: {
    titulo: "Top Lojas Parceiras por Receita",
    short: "Ranking das parceiras com maior receita por cupons.",
    long:
      "Lista as lojas parceiras ordenadas pela soma do valor do cupom no período. "
      + "Ajuda a identificar contas estratégicas, orientar negociações e priorizar  ações comerciais. ",
    formula: "Soma do valor dos cupons usados por estabelecimento"
  },
  analise_cupons_por_tipo:{
    titulo: "Análise Dos Cupons Por Tipo",
    short: "Participação de cada tipo de cupom na receita.",
    long: "A distribuição do volume de transações por tipo de cupom demonstra um equilíbrio notável. As categorias Cashback (34%), Produto (33%) e Desconto (33%) apresentam uma participação quase idêntica no total de transações. Este resultado sugere que a estratégia de marketing da PicMoney é eficaz em todos os tipos de promoção, sem que um único tipo canibalize a performance dos outros",
    formula: "Participação = (Total de Transações do Cupom / Total de Transações Geral) * 100 "
    + "Ticket Médio = Total de Transações do Cupom / Receita Total do Cupom"
  },
  analise_por_periodo_dia:{
    titulo: "Análise temporal por período do dia",
    short:"Períodos de maior atividade de captura dos cupons.",
    long:"A análise da distribuição de atividade ao longo do dia na PicMoney demonstra uma concentração de volume nos horários comerciais. O período da Tarde (42,56%) e da Noite (35,91%) são os mais ativos, somando mais de 78% da atividade total. Em contraste, o período da Manhã registra o menor volume de transações, com 21,53% do total. Essa distribuição sugere que a principal operação da empresa ocorre a partir da tarde, refletindo o comportamento de consumo típico dos clientes.",
    formula: "(Quantidade de cupons entre os períodos / Receita Total dos Cupons) * 100"
  },
  analise_temporal_cupom:{
    titulo: "Participação Diária",
    short: "Análise dos dias com maior participação na receita.",
    long: "A análise da participação diária de transações revela uma variação no desempenho ao longo da semana. O período de terça a quinta-feira apresenta uma participação consistente e elevada, em torno de 16% do total cada. Por outro lado, a segunda-feira sexta-feira, sábado e o domingo registram uma queda significativa, com uma participação mais baixa. Essa tendência pode sugerir que a operação da PicMoney é mais forte durante o meio da semana.",
    formula: "(Receita Total do Dia / Receita Total) * 100"
  },
  analise_temporal_ticket_medio:{
    titulo: "Ticket Médio Diário",
    short: "Análise do valor médio dos cupons por dia da semana.",
    long: "No período analisado, o ticket médio diário variou entre R$ 552,81 a R$ 546,00, indicando estabilidade com leve acomodação. Essa variação sugere um equilíbrio entre mudanças no mix de lojas/categorias, intensidade de promoções/descontos, sazonalidade e padrões de consumo por faixa do dia, preservando a eficiência das ações sem alterar significativamente o valor médio.",
    formula: "Valor total do dia / Quantidade de transações do dia"
  }

}
