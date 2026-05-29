export type SectionTier = 'free' | 'premium';

export interface LessonDef {
  id: string;
  icon: string;
  title: { en: string; de: string; es: string; pt: string };
  xp: number;
  categories: string[];
  difficulty: 1 | 2 | 3;
}

export interface SectionDef {
  id: string;
  icon: string;
  color: string;
  tier: SectionTier;
  title: { en: string; de: string; es: string; pt: string };
  subtitle: { en: string; de: string; es: string; pt: string };
  lessons: LessonDef[];
}

export const LEARNING_SECTIONS: SectionDef[] = [
  {
    id: 's1', icon: '🌱', color: '#10B981', tier: 'free',
    title: { en: 'Investing Basics', de: 'Investitions-Grundlagen', es: 'Fundamentos de Inversión', pt: 'Fundamentos de Investimento' },
    subtitle: { en: 'Learn the foundations of investing', de: 'Lerne die Grundlagen des Investierens', es: 'Aprende las bases de la inversión', pt: 'Aprenda as bases do investimento' },
    lessons: [
      {
        id: 'l1_1', icon: '📈', xp: 15, categories: ['Markets'], difficulty: 1,
        title: { en: 'What is Investing?', de: 'Was ist Investieren?', es: '¿Qué es invertir?', pt: 'O que é investir?' },
      },
      {
        id: 'l1_2', icon: '🏢', xp: 15, categories: ['Stocks'], difficulty: 1,
        title: { en: 'Stocks & Ownership', de: 'Aktien & Eigentum', es: 'Acciones y propiedad', pt: 'Ações e propriedade' },
      },
      {
        id: 'l1_3', icon: '🐂', xp: 20, categories: ['Markets'], difficulty: 1,
        title: { en: 'Bull & Bear Markets', de: 'Bullen- & Bärenmärkte', es: 'Mercados alcistas y bajistas', pt: 'Mercados em alta e em baixa' },
      },
      {
        id: 'l1_4', icon: '🥗', xp: 20, categories: ['Strategy'], difficulty: 1,
        title: { en: 'Diversification', de: 'Diversifikation', es: 'Diversificación', pt: 'Diversificação' },
      },
      {
        id: 'l1_5', icon: '📦', xp: 25, categories: ['Funds'], difficulty: 1,
        title: { en: 'ETFs & Index Funds', de: 'ETFs & Indexfonds', es: 'ETFs y fondos índice', pt: 'ETFs e fundos de índice' },
      },
    ],
  },
  {
    id: 's2', icon: '💰', color: '#F59E0B', tier: 'free',
    title: { en: 'Building Wealth', de: 'Vermögen aufbauen', es: 'Construir riqueza', pt: 'Construir riqueza' },
    subtitle: { en: 'Strategies for long-term growth', de: 'Strategien für langfristiges Wachstum', es: 'Estrategias para el crecimiento a largo plazo', pt: 'Estratégias para crescimento a longo prazo' },
    lessons: [
      {
        id: 'l2_1', icon: '⚡', xp: 20, categories: ['Personal Finance'], difficulty: 1,
        title: { en: 'Compound Interest', de: 'Zinseszins', es: 'Interés compuesto', pt: 'Juros compostos' },
      },
      {
        id: 'l2_2', icon: '🎯', xp: 20, categories: ['Strategy'], difficulty: 2,
        title: { en: 'Dollar-Cost Averaging', de: 'Durchschnittskostenmethode', es: 'Promedio del coste', pt: 'Preço médio de custo' },
      },
      {
        id: 'l2_3', icon: '🏠', xp: 25, categories: ['Personal Finance'], difficulty: 2,
        title: { en: 'Smart Budgeting', de: 'Cleveres Budgetieren', es: 'Presupuesto inteligente', pt: 'Orçamento inteligente' },
      },
      {
        id: 'l2_4', icon: '🧠', xp: 25, categories: ['Strategy', 'Behavioral Finance'], difficulty: 2,
        title: { en: 'Investor Psychology', de: 'Anlegerpsychologie', es: 'Psicología del inversor', pt: 'Psicologia do investidor' },
      },
      {
        id: 'l2_5', icon: '🏆', xp: 30, categories: ['Strategy'], difficulty: 2,
        title: { en: 'Portfolio Building', de: 'Portfolio aufbauen', es: 'Construir un portfolio', pt: 'Construir um portfólio' },
      },
    ],
  },
  {
    id: 's3', icon: '₿', color: '#F97316', tier: 'premium',
    title: { en: 'Crypto & Digital Assets', de: 'Krypto & Digitale Assets', es: 'Cripto y activos digitales', pt: 'Cripto e ativos digitais' },
    subtitle: { en: 'Bitcoin, Ethereum, DeFi and more', de: 'Bitcoin, Ethereum, DeFi und mehr', es: 'Bitcoin, Ethereum, DeFi y más', pt: 'Bitcoin, Ethereum, DeFi e mais' },
    lessons: [
      {
        id: 'l3_1', icon: '₿', xp: 25, categories: ['Crypto'], difficulty: 1,
        title: { en: 'What is Bitcoin?', de: 'Was ist Bitcoin?', es: '¿Qué es Bitcoin?', pt: 'O que é Bitcoin?' },
      },
      {
        id: 'l3_2', icon: '🔗', xp: 25, categories: ['Crypto'], difficulty: 1,
        title: { en: 'Blockchain Explained', de: 'Blockchain erklärt', es: 'Blockchain explicado', pt: 'Blockchain explicado' },
      },
      {
        id: 'l3_3', icon: '🌐', xp: 30, categories: ['Crypto'], difficulty: 2,
        title: { en: 'DeFi & Smart Contracts', de: 'DeFi & Smart Contracts', es: 'DeFi y contratos inteligentes', pt: 'DeFi e contratos inteligentes' },
      },
      {
        id: 'l3_4', icon: '🪙', xp: 30, categories: ['Crypto'], difficulty: 2,
        title: { en: 'Altcoins & Tokens', de: 'Altcoins & Token', es: 'Altcoins y tokens', pt: 'Altcoins e tokens' },
      },
      {
        id: 'l3_5', icon: '📉', xp: 35, categories: ['Crypto'], difficulty: 3,
        title: { en: 'Crypto Risk & Volatility', de: 'Krypto-Risiko & Volatilität', es: 'Riesgo y volatilidad cripto', pt: 'Risco e volatilidade em cripto' },
      },
    ],
  },
  {
    id: 's4', icon: '📊', color: '#60A5FA', tier: 'premium',
    title: { en: 'Stock Analysis', de: 'Aktienanalyse', es: 'Análisis de acciones', pt: 'Análise de ações' },
    subtitle: { en: 'Fundamental & technical analysis', de: 'Fundamental- & Technische Analyse', es: 'Análisis fundamental y técnico', pt: 'Análise fundamentalista e técnica' },
    lessons: [
      {
        id: 'l4_1', icon: '🔍', xp: 30, categories: ['Stocks'], difficulty: 2,
        title: { en: 'Reading Financials', de: 'Finanzkennzahlen lesen', es: 'Leer estados financieros', pt: 'Ler demonstrações financeiras' },
      },
      {
        id: 'l4_2', icon: '📐', xp: 30, categories: ['Stocks', 'Corporate Finance'], difficulty: 2,
        title: { en: 'P/E, EPS & Valuation', de: 'KGV, EPS & Bewertung', es: 'P/E, EPS y valoración', pt: 'P/L, LPA e valuation' },
      },
      {
        id: 'l4_3', icon: '🕯️', xp: 35, categories: ['Trading'], difficulty: 2,
        title: { en: 'Chart Patterns', de: 'Chart-Muster', es: 'Patrones de gráfico', pt: 'Padrões gráficos' },
      },
      {
        id: 'l4_4', icon: '🎢', xp: 35, categories: ['Trading'], difficulty: 3,
        title: { en: 'Technical Indicators', de: 'Technische Indikatoren', es: 'Indicadores técnicos', pt: 'Indicadores técnicos' },
      },
      {
        id: 'l4_5', icon: '🏹', xp: 40, categories: ['Strategy', 'Trading'], difficulty: 3,
        title: { en: 'Entry & Exit Strategy', de: 'Ein- & Ausstiegsstrategie', es: 'Estrategia de entrada y salida', pt: 'Estratégia de entrada e saída' },
      },
    ],
  },
  {
    id: 's5', icon: '🌍', color: '#8B5CF6', tier: 'premium',
    title: { en: 'Global Markets', de: 'Globale Märkte', es: 'Mercados globales', pt: 'Mercados globais' },
    subtitle: { en: 'Forex, macro, and world markets', de: 'Forex, Makro & Weltmärkte', es: 'Forex, macro y mercados mundiales', pt: 'Forex, macro e mercados mundiais' },
    lessons: [
      {
        id: 'l5_1', icon: '💱', xp: 30, categories: ['Forex'], difficulty: 2,
        title: { en: 'How Forex Works', de: 'Wie Forex funktioniert', es: 'Cómo funciona el Forex', pt: 'Como o Forex funciona' },
      },
      {
        id: 'l5_2', icon: '🏛️', xp: 35, categories: ['Macro'], difficulty: 2,
        title: { en: 'Central Banks & Rates', de: 'Zentralbanken & Zinsen', es: 'Bancos centrales y tipos', pt: 'Bancos centrais e taxas' },
      },
      {
        id: 'l5_3', icon: '🛢️', xp: 35, categories: ['Macro'], difficulty: 2,
        title: { en: 'Commodities & Oil', de: 'Rohstoffe & Öl', es: 'Materias primas y petróleo', pt: 'Commodities e petróleo' },
      },
      {
        id: 'l5_4', icon: '🗺️', xp: 40, categories: ['Macro'], difficulty: 3,
        title: { en: 'Emerging Markets', de: 'Schwellenländer', es: 'Mercados emergentes', pt: 'Mercados emergentes' },
      },
      {
        id: 'l5_5', icon: '⚖️', xp: 40, categories: ['Macro', 'Forex'], difficulty: 3,
        title: { en: 'Geopolitics & Markets', de: 'Geopolitik & Märkte', es: 'Geopolítica y mercados', pt: 'Geopolítica e mercados' },
      },
    ],
  },
  {
    id: 's6', icon: '🏦', color: '#EC4899', tier: 'premium',
    title: { en: 'Advanced Finance', de: 'Fortgeschrittene Finanzen', es: 'Finanzas avanzadas', pt: 'Finanças avançadas' },
    subtitle: { en: 'Options, derivatives, and risk management', de: 'Optionen, Derivate & Risikomanagement', es: 'Opciones, derivados y gestión de riesgos', pt: 'Opções, derivativos e gestão de risco' },
    lessons: [
      {
        id: 'l6_1', icon: '🎰', xp: 40, categories: ['Derivatives'], difficulty: 3,
        title: { en: 'Options Basics', de: 'Optionen Grundlagen', es: 'Fundamentos de opciones', pt: 'Fundamentos de opções' },
      },
      {
        id: 'l6_2', icon: '🔬', xp: 40, categories: ['Risk'], difficulty: 3,
        title: { en: 'Risk Management', de: 'Risikomanagement', es: 'Gestión del riesgo', pt: 'Gestão de risco' },
      },
      {
        id: 'l6_3', icon: '💼', xp: 45, categories: ['Corporate Finance'], difficulty: 3,
        title: { en: 'M&A & IPOs', de: 'M&A & Börsengänge', es: 'M&A e IPOs', pt: 'M&A e IPOs' },
      },
      {
        id: 'l6_4', icon: '🔮', xp: 45, categories: ['Risk', 'Strategy'], difficulty: 3,
        title: { en: 'Portfolio Theory', de: 'Portfoliotheorie', es: 'Teoría de cartera', pt: 'Teoria do portfólio' },
      },
      {
        id: 'l6_5', icon: '🚀', xp: 50, categories: ['Strategy', 'Risk'], difficulty: 3,
        title: { en: 'Hedge Fund Strategies', de: 'Hedge-Fonds-Strategien', es: 'Estrategias de hedge funds', pt: 'Estratégias de hedge funds' },
      },
    ],
  },
];
