import { Language } from '../i18n/translations';

export interface ConceptCard {
  title: { en: string; de: string };
  body: { en: string; de: string };
  example: { en: string; de: string };
  takeaway: { en: string; de: string };
}

export interface LessonContent {
  lessonId: string;
  cards: ConceptCard[];
}

export const LESSON_CONTENT: LessonContent[] = [
  {
    lessonId: 'l1_1', // Was ist Investieren?
    cards: [
      {
        title: { en: 'Money working for you', de: 'Geld arbeitet für dich' },
        body: {
          en: 'Investing means putting your money into assets that grow in value over time — so your money earns money while you sleep.',
          de: 'Investieren bedeutet, dein Geld in Vermögenswerte zu stecken, die über die Zeit an Wert gewinnen — dein Geld verdient Geld, während du schläfst.',
        },
        example: {
          en: '€1,000 in an S&P 500 fund 30 years ago → ~€17,000 today. No active work needed.',
          de: '€1.000 in einem S&P-500-Fonds vor 30 Jahren → heute ~€17.000. Ohne aktiven Aufwand.',
        },
        takeaway: {
          en: 'The goal: your money grows faster than inflation eats it.',
          de: 'Ziel: Dein Geld wächst schneller als die Inflation es auffrisst.',
        },
      },
      {
        title: { en: 'Saving vs Investing', de: 'Sparen vs. Investieren' },
        body: {
          en: 'Saving = keeping money safe in a bank account. Investing = putting money to work in the market. Saving is safe but loses value. Investing has risk but beats inflation.',
          de: 'Sparen = Geld sicher auf dem Konto halten. Investieren = Geld im Markt arbeiten lassen. Sparen ist sicher, verliert aber an Kaufkraft. Investieren hat Risiko, schlägt aber Inflation.',
        },
        example: {
          en: '€100 in a savings account in 2000 → €100 today (but buys what €59 bought then). €100 invested → ~€700.',
          de: '€100 auf dem Sparkonto 2000 → €100 heute (aber kauft was €59 damals kaufte). €100 investiert → ~€700.',
        },
        takeaway: {
          en: 'Keeping money in cash is a hidden loss. Inflation is the silent thief.',
          de: 'Geld in Cash halten ist ein versteckter Verlust. Inflation ist der stille Dieb.',
        },
      },
      {
        title: { en: 'What can you invest in?', de: 'Worin kann man investieren?' },
        body: {
          en: 'Main asset classes: Stocks (ownership in companies), Bonds (loans to governments/companies), ETFs (baskets of assets), Real Estate, Crypto.',
          de: 'Wichtigste Anlageklassen: Aktien (Eigentum an Unternehmen), Anleihen (Kredite an Staaten/Firmen), ETFs (Körbe aus Wertpapieren), Immobilien, Krypto.',
        },
        example: {
          en: 'A beginner can start with just €50/month in a simple ETF — no stock-picking needed.',
          de: 'Ein Anfänger kann mit nur €50/Monat in einem einfachen ETF starten — kein Stock-Picking nötig.',
        },
        takeaway: {
          en: 'Start simple. One broad ETF beats 90% of active fund managers over 20 years.',
          de: 'Einfach starten. Ein breiter ETF schlägt 90% der aktiven Fondsmanager über 20 Jahre.',
        },
      },
    ],
  },
  {
    lessonId: 'l1_2', // Aktien & Eigentum
    cards: [
      {
        title: { en: 'A stock = ownership', de: 'Eine Aktie = Eigentum' },
        body: {
          en: 'When you buy a share of Apple, you own a tiny piece of Apple Inc. If Apple grows, your piece grows too. You\'re not lending money — you own a fraction of the business.',
          de: 'Wenn du eine Apple-Aktie kaufst, besitzt du einen winzigen Teil von Apple Inc. Wenn Apple wächst, wächst dein Anteil auch. Du leihst kein Geld — du besitzt einen Bruchteil des Unternehmens.',
        },
        example: {
          en: 'Apple has ~15 billion shares. Buy 1 share → you own 1/15,000,000,000 of Apple.',
          de: 'Apple hat ~15 Milliarden Aktien. 1 Aktie kaufen → du besitzt 1/15.000.000.000 von Apple.',
        },
        takeaway: {
          en: 'Think like an owner, not a trader. Great companies make great long-term investments.',
          de: 'Denke wie ein Eigentümer, nicht wie ein Trader. Grossartige Unternehmen sind grossartige Langfrist-Investments.',
        },
      },
      {
        title: { en: 'How you make money', de: 'Wie du Geld verdienst' },
        body: {
          en: 'Two ways: Price increase (stock goes from €50 to €100 = +100% gain) and Dividends (company shares profits with shareholders, e.g. €2/share per quarter).',
          de: 'Zwei Wege: Kursanstieg (Aktie geht von €50 auf €100 = +100% Gewinn) und Dividenden (Unternehmen teilt Gewinne mit Aktionären, z.B. €2/Aktie pro Quartal).',
        },
        example: {
          en: 'Holding €1,000 of Apple for 10 years (2014→2024): +1,200% gain = €13,000. Plus dividends paid out each quarter.',
          de: '€1.000 Apple 10 Jahre halten (2014→2024): +1.200% Gewinn = €13.000. Plus vierteljährliche Dividenden.',
        },
        takeaway: {
          en: 'Compound returns + reinvested dividends = the most powerful wealth formula for stocks.',
          de: 'Zinseszinsrenditen + reinvestierte Dividenden = die mächtigste Vermögensformel bei Aktien.',
        },
      },
      {
        title: { en: 'Risk of stocks', de: 'Risiko bei Aktien' },
        body: {
          en: 'Stocks can drop 50%+ in crashes (2008: S&P 500 -55%). But every crash in history was followed by recovery and new all-time highs. The risk decreases the longer you hold.',
          de: 'Aktien können in Crashs 50%+ fallen (2008: S&P 500 -55%). Aber auf jeden Crash folgte in der Geschichte eine Erholung und neue Allzeithochs. Das Risiko sinkt je länger du hältst.',
        },
        example: {
          en: 'COVID crash March 2020: S&P 500 -34% in 5 weeks. By August 2020: back to all-time highs.',
          de: 'COVID-Crash März 2020: S&P 500 -34% in 5 Wochen. Im August 2020: zurück auf Allzeithochs.',
        },
        takeaway: {
          en: 'Short-term = volatile. Long-term (10+ years) = historically always positive for broad indexes.',
          de: 'Kurzfristig = volatil. Langfristig (10+ Jahre) = historisch immer positiv für breite Indizes.',
        },
      },
    ],
  },
  {
    lessonId: 'l1_3', // Bullen- & Bärenmärkte
    cards: [
      {
        title: { en: 'Bull Market = rising prices', de: 'Bullenmarkt = steigende Kurse' },
        body: {
          en: 'A bull market is when prices rise 20%+ from their lows over a sustained period. Investors are optimistic, money flows in, economy grows.',
          de: 'Ein Bullenmarkt ist wenn die Kurse 20%+ von ihren Tiefs über einen anhaltenden Zeitraum steigen. Investoren sind optimistisch, Geld fliesst rein, die Wirtschaft wächst.',
        },
        example: {
          en: 'The bull market from 2009 to 2020 lasted 11 years — the longest in US history. S&P 500 went from 666 to 3,400.',
          de: 'Der Bullenmarkt von 2009 bis 2020 dauerte 11 Jahre — der längste in der US-Geschichte. S&P 500 von 666 auf 3.400.',
        },
        takeaway: {
          en: 'S&P 500 is in a bull market 70%+ of all trading days historically. Bulls win long-term.',
          de: 'S&P 500 befindet sich historisch an 70%+ aller Handelstage im Bullenmarkt. Bullen gewinnen langfristig.',
        },
      },
      {
        title: { en: 'Bear Market = falling prices', de: 'Bärenmarkt = fallende Kurse' },
        body: {
          en: 'A bear market is a 20%+ drop from recent highs. They feel terrible but are normal and temporary. Average bear market lasts 9–18 months.',
          de: 'Ein Bärenmarkt ist ein Rückgang von 20%+ von den jüngsten Hochs. Sie fühlen sich schrecklich an, sind aber normal und vorübergehend. Durchschnittlicher Bärenmarkt dauert 9–18 Monate.',
        },
        example: {
          en: '2022 bear market: S&P 500 -25%. By end of 2023: full recovery + new highs. Every bear becomes a bull.',
          de: 'Bärenmarkt 2022: S&P 500 -25%. Ende 2023: vollständige Erholung + neue Hochs. Jeder Bär wird zum Bullen.',
        },
        takeaway: {
          en: 'The worst thing to do in a bear market: sell. The best: keep buying. Bears are sales on stocks.',
          de: 'Das Schlimmste was man in einem Bärenmarkt tun kann: verkaufen. Das Beste: weiter kaufen. Bärenmärkte sind Rabattaktionen auf Aktien.',
        },
      },
    ],
  },
  {
    lessonId: 'l1_4', // Diversifikation
    cards: [
      {
        title: { en: 'Don\'t put all eggs in one basket', de: 'Nicht alle Eier in einen Korb' },
        body: {
          en: 'Diversification = spreading investments across many different assets. If one crashes, the others cushion the blow. Lower risk, same expected return.',
          de: 'Diversifikation = Investments auf viele verschiedene Anlagen verteilen. Wenn eine crasht, federn die anderen den Schlag ab. Geringeres Risiko, gleiche erwartete Rendite.',
        },
        example: {
          en: 'If you owned only Nokia stock in 2007 (before iPhone): -90%. Owning 500 companies via S&P 500: Nokia\'s collapse barely visible.',
          de: 'Wenn du 2007 nur Nokia-Aktien hieltest (vor dem iPhone): -90%. 500 Unternehmen via S&P 500 halten: Nokias Kollaps kaum sichtbar.',
        },
        takeaway: {
          en: 'One ETF = instant diversification across 500–3,000 companies. The simplest form of diversification.',
          de: 'Ein ETF = sofortige Diversifikation über 500–3.000 Unternehmen. Die einfachste Form der Diversifikation.',
        },
      },
      {
        title: { en: 'Types of diversification', de: 'Arten der Diversifikation' },
        body: {
          en: 'You can diversify across: assets (stocks + bonds + real estate), sectors (tech + health + energy), countries (US + Europe + Asia), and time (invest monthly over years).',
          de: 'Du kannst diversifizieren über: Anlageklassen (Aktien + Anleihen + Immobilien), Sektoren (Tech + Gesundheit + Energie), Länder (USA + Europa + Asien) und Zeit (monatlich über Jahre investieren).',
        },
        example: {
          en: 'A classic "60/40 portfolio": 60% global stocks + 40% bonds. Historically: 8-9% annual return with lower volatility.',
          de: 'Ein klassisches "60/40 Portfolio": 60% globale Aktien + 40% Anleihen. Historisch: 8-9% Jahresrendite mit geringerer Volatilität.',
        },
        takeaway: {
          en: 'Perfect diversification is free insurance. The math proves: more assets = less risk for the same return.',
          de: 'Perfekte Diversifikation ist kostenlose Versicherung. Die Mathematik beweist: mehr Anlagen = weniger Risiko bei gleicher Rendite.',
        },
      },
    ],
  },
  {
    lessonId: 'l1_5', // ETFs
    cards: [
      {
        title: { en: 'ETF = basket of assets', de: 'ETF = Korb aus Wertpapieren' },
        body: {
          en: 'An ETF (Exchange-Traded Fund) bundles many investments into one tradeable unit. Buy 1 S&P 500 ETF = own tiny pieces of 500 companies at once.',
          de: 'Ein ETF (Exchange-Traded Fund) bündelt viele Investments in eine handelbare Einheit. 1 S&P-500-ETF kaufen = gleichzeitig winzige Anteile an 500 Unternehmen besitzen.',
        },
        example: {
          en: 'iShares Core S&P 500 ETF (IVV): €300 buys you exposure to Apple, Microsoft, Amazon, Google + 496 more. 0.03% annual fee.',
          de: 'iShares Core S&P 500 ETF (IVV): €300 gibt dir Zugang zu Apple, Microsoft, Amazon, Google + 496 weitere. 0,03% Jahresgebühr.',
        },
        takeaway: {
          en: 'Warren Buffett\'s advice for 99% of investors: just buy S&P 500 index funds. Simple, cheap, proven.',
          de: 'Warren Buffetts Rat für 99% der Anleger: einfach S&P-500-Indexfonds kaufen. Einfach, günstig, bewährt.',
        },
      },
      {
        title: { en: 'ETF vs. Active Fund', de: 'ETF vs. Aktiver Fonds' },
        body: {
          en: 'Active funds: managers pick stocks (fee: 1-2%). Most underperform the index over 20 years. ETFs: just track the index (fee: 0.03-0.2%). Boring wins.',
          de: 'Aktive Fonds: Manager picken Aktien (Gebühr: 1-2%). Die meisten liegen nach 20 Jahren unter dem Index. ETFs: bilden einfach den Index ab (Gebühr: 0,03-0,2%). Langweilig gewinnt.',
        },
        example: {
          en: '90% of actively managed funds underperform a simple S&P 500 ETF over any 20-year period (SPIVA study, 2024).',
          de: '90% der aktiv verwalteten Fonds liegen in einem beliebigen 20-Jahres-Zeitraum unter einem einfachen S&P-500-ETF (SPIVA-Studie, 2024).',
        },
        takeaway: {
          en: 'High fees kill returns. A 2% fee on €10,000 costs you ~€50,000 over 30 years vs. a 0.1% ETF.',
          de: 'Hohe Gebühren zerstören Renditen. Eine 2%-Gebühr auf €10.000 kostet dich ~€50.000 über 30 Jahre vs. einem 0,1%-ETF.',
        },
      },
    ],
  },
  {
    lessonId: 'l2_1', // Zinseszins
    cards: [
      {
        title: { en: 'The 8th wonder of the world', de: 'Das 8. Weltwunder' },
        body: {
          en: 'Compound interest = earning interest on your interest. Your money grows on itself. Each year\'s gains become next year\'s starting point. Einstein called it "the 8th wonder of the world."',
          de: 'Zinseszins = Zinsen auf deine Zinsen verdienen. Dein Geld wächst auf sich selbst. Die Gewinne eines Jahres werden zum Startpunkt des nächsten. Einstein nannte es "das 8. Weltwunder."',
        },
        example: {
          en: '€10,000 at 7%/year: After 10 years = €19,672. After 20 years = €38,697. After 30 years = €76,123. Double every decade.',
          de: '€10.000 bei 7%/Jahr: Nach 10 Jahren = €19.672. Nach 20 Jahren = €38.697. Nach 30 Jahren = €76.123. Verdopplung jede Dekade.',
        },
        takeaway: {
          en: 'Time is the most powerful ingredient. 10 years earlier = roughly double the result.',
          de: 'Zeit ist die mächtigste Zutat. 10 Jahre früher = ungefähr doppeltes Ergebnis.',
        },
      },
      {
        title: { en: 'The rule of 72', de: 'Die Regel der 72' },
        body: {
          en: 'Quick mental math: divide 72 by your annual return to find how many years it takes to double your money.',
          de: 'Schnelle Kopfrechnung: Teile 72 durch deine jährliche Rendite um zu erfahren wie viele Jahre es dauert bis dein Geld doppelt so viel wert ist.',
        },
        example: {
          en: '72 ÷ 7% = 10.3 years to double. 72 ÷ 10% = 7.2 years. 72 ÷ 12% = 6 years.',
          de: '72 ÷ 7% = 10,3 Jahre bis zur Verdopplung. 72 ÷ 10% = 7,2 Jahre. 72 ÷ 12% = 6 Jahre.',
        },
        takeaway: {
          en: 'Start now. Every decade you wait costs you one doubling. Age 20 vs 30 = potentially double the final wealth.',
          de: 'Jetzt starten. Jedes Jahrzehnt das du wartest kostet dich eine Verdopplung. Alter 20 vs 30 = potenziell doppelter Endreichtum.',
        },
      },
    ],
  },
  {
    lessonId: 'l2_2', // DCA
    cards: [
      {
        title: { en: 'Investing on autopilot', de: 'Investieren auf Autopilot' },
        body: {
          en: 'Dollar-Cost Averaging (DCA) = invest a fixed amount every month regardless of market price. When prices are high, you buy less. When low, you buy more. Automatically.',
          de: 'Dollar-Cost Averaging (DCA) = monatlich einen fixen Betrag investieren, unabhängig vom Marktpreis. Wenn Kurse hoch sind, kaufst du weniger. Wenn niedrig, kaufst du mehr. Automatisch.',
        },
        example: {
          en: '€200/month for 30 years at 7% = €240,000 invested → €243,000 total return → €483,000 final value.',
          de: '€200/Monat für 30 Jahre bei 7% = €72.000 eingezahlt → €243.000 Gesamtrendite → €315.000 Endwert.',
        },
        takeaway: {
          en: 'DCA removes emotion and timing from investing. The best time to invest: every month, automatically.',
          de: 'DCA entfernt Emotion und Timing aus dem Investieren. Der beste Zeitpunkt zu investieren: jeden Monat, automatisch.',
        },
      },
      {
        title: { en: 'Why timing the market fails', de: 'Warum Market-Timing scheitert' },
        body: {
          en: 'Studies show: missing just the 10 best days of the S&P 500 over 20 years cuts your return by 50%+. Nobody can predict those days. DCA ensures you\'re always invested.',
          de: 'Studien zeigen: nur die 10 besten Tage des S&P 500 über 20 Jahre zu verpassen halbiert deine Rendite. Niemand kann diese Tage vorhersagen. DCA stellt sicher, dass du immer investiert bist.',
        },
        example: {
          en: 'S&P 500 1990–2022: +1,680% fully invested. Miss 10 best days: +753%. Miss 25 best days: +218%.',
          de: 'S&P 500 1990–2022: +1.680% voll investiert. 10 beste Tage verpasst: +753%. 25 beste Tage verpasst: +218%.',
        },
        takeaway: {
          en: '"Time in the market beats timing the market." — The most proven rule in personal finance.',
          de: '"Im Markt bleiben schlägt den Markt timen." — Die am meisten bewährte Regel der privaten Finanzen.',
        },
      },
    ],
  },
];

export function getLessonContent(lessonId: string): LessonContent | null {
  return LESSON_CONTENT.find(c => c.lessonId === lessonId) ?? null;
}

export function getLocalizedCard(card: ConceptCard, language: Language) {
  const lang = (language === 'de' || language === 'es' || language === 'pt') ? 'de' : 'en';
  return {
    title: card.title[lang] ?? card.title.en,
    body: card.body[lang] ?? card.body.en,
    example: card.example[lang] ?? card.example.en,
    takeaway: card.takeaway[lang] ?? card.takeaway.en,
  };
}
