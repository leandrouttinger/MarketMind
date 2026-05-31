import { Language } from '../i18n/translations';
import { Question } from '../data/questions';

interface LocalizedQ {
  text: string;
  options: { id: string; text: string }[];
  explanation: string;
}

// German translations for the most common beginner questions
const DE: Record<string, LocalizedQ> = {
  q001: {
    text: 'Was ist eine Aktie?',
    options: [
      { id: 'A', text: 'Ein Kredit an ein Unternehmen' },
      { id: 'B', text: 'Ein Eigentumsanteil an einem Unternehmen' },
      { id: 'C', text: 'Ein staatliches Sparkonto' },
      { id: 'D', text: 'Eine Art Versicherung' },
    ],
    explanation: 'Eine Aktie = Eigentum. 1 Apple-Aktie kaufen → du besitzt einen kleinen Teil von Apple und profitierst von dessen Wachstum.',
  },
  q002: {
    text: 'Was ist eine Dividende?',
    options: [
      { id: 'A', text: 'Eine Gebühr, die Broker erheben' },
      { id: 'B', text: 'Eine Steuer auf Kapitalgewinne' },
      { id: 'C', text: 'Ein Teil des Unternehmensgewinns, der an Aktionäre ausgeschüttet wird' },
      { id: 'D', text: 'Der Kursanstieg einer Aktie' },
    ],
    explanation: 'Dividenden = Barzahlungen an Aktionäre, meist quartalsweise. Apple zahlt eine, Tesla nicht.',
  },
  q003: {
    text: 'Was ist Inflation?',
    options: [
      { id: 'A', text: 'Steigende Aktienkurse' },
      { id: 'B', text: 'Der allgemeine Preisanstieg über die Zeit' },
      { id: 'C', text: 'Eine Währung, die an Wert gegenüber Gold verliert' },
      { id: 'D', text: 'Ein Zinssatz der Zentralbank' },
    ],
    explanation: 'Inflation = Geld kauft weniger mit der Zeit. Was 2000 für $100 zu haben war, kostet heute ~$170.',
  },
  q004: {
    text: 'Was ist ein ETF?',
    options: [
      { id: 'A', text: 'Ein börsengehandelter Fonds, der einen Korb von Wertpapieren abbildet' },
      { id: 'B', text: 'Eine Art Staatsanleihe' },
      { id: 'C', text: 'Eine elektronische Handelsgebühr' },
      { id: 'D', text: 'Ein Finanzderivat' },
    ],
    explanation: 'ETF = hält viele Wertpapiere (wie alle 500 S&P-500-Unternehmen) in einem einzigen Handel. Niedrige Gebühren, sofortige Diversifikation.',
  },
  q005: {
    text: 'Was ist Zinseszins?',
    options: [
      { id: 'A', text: 'Zinsen, die nur auf den Hauptbetrag berechnet werden' },
      { id: 'B', text: 'Zinsen auf Zinsen — Wachstum wächst sich selbst' },
      { id: 'C', text: 'Ein staatlich garantierter Zinssatz' },
      { id: 'D', text: 'Eine Gebühr für Kontoüberziehungen' },
    ],
    explanation: '10.000 € bei 7% p.a. wachsen in 30 Jahren auf 76.000 € — ohne weiteres Einzahlen. Zeit ist dein stärkstes Werkzeug.',
  },
  q006: {
    text: 'Was ist Diversifikation?',
    options: [
      { id: 'A', text: 'Nur in eine Aktie investieren, die man kennt' },
      { id: 'B', text: 'Investitionen auf viele Anlagen verteilen, um das Risiko zu senken' },
      { id: 'C', text: 'Täglich kaufen und verkaufen' },
      { id: 'D', text: 'Nur in staatliche Anleihen investieren' },
    ],
    explanation: 'Diversifikation verteilt das Risiko. Wenn ein Bereich einbricht, können andere den Verlust ausgleichen.',
  },
  q007: {
    text: 'Was ist ein Bullenmarkt?',
    options: [
      { id: 'A', text: 'Fallende Kurse über Monate' },
      { id: 'B', text: 'Steigende Kurse über einen anhaltenden Zeitraum' },
      { id: 'C', text: 'Hohe Volatilität ohne klaren Trend' },
      { id: 'D', text: 'Sehr geringes Handelsvolumen' },
    ],
    explanation: 'Bullenmarkt = Kurse steigen über einen anhaltenden Zeitraum (20%+ Gewinne). Der S&P 500 befindet sich an über 70% aller Handelstage im Bullenmarkt.',
  },
  q008: {
    text: 'Was ist ein Bärenmarkt?',
    options: [
      { id: 'A', text: 'Steigende Kurse über 6 Monate' },
      { id: 'B', text: 'Ein Rückgang von 20%+ gegenüber Höchstständen' },
      { id: 'C', text: 'Ein stabiler Seitwärtsmarkt' },
      { id: 'D', text: 'Ein Markt nur für Profi-Investoren' },
    ],
    explanation: 'Bärenmarkt = Rückgang von 20%+ von Höchstständen. Sie dauern meist 9–18 Monate. Jeder bisherige Bärenmarkt wurde von neuen Allzeithochs gefolgt.',
  },
  q009: {
    text: 'Was bedeutet P/KGV (Kurs-Gewinn-Verhältnis)?',
    options: [
      { id: 'A', text: 'Aktienkurs geteilt durch jährlichen Gewinn je Aktie' },
      { id: 'B', text: 'Jahresgewinn multipliziert mit Aktienkurs' },
      { id: 'C', text: 'Dividende geteilt durch Aktienkurs' },
      { id: 'D', text: 'Marktkapitalisierung minus Gesamtschulden' },
    ],
    explanation: 'P/KGV = wie viel Anleger pro 1 € Jahresgewinn zahlen. KGV 20 bedeutet: du zahlst das 20-fache des Jahresgewinns. S&P 500 historisch: 15–20.',
  },
  q010: {
    text: 'Was ist Dollar-Cost Averaging (DCA)?',
    options: [
      { id: 'A', text: 'Alles auf einmal investieren wenn der Markt hoch ist' },
      { id: 'B', text: 'Regelmässig einen fixen Betrag investieren, unabhängig vom Preis' },
      { id: 'C', text: 'Nur in USD-Anlagen investieren' },
      { id: 'D', text: 'Täglich kleine Gewinne mitnehmen' },
    ],
    explanation: 'DCA = 200 €/Monat investieren, egal ob Markt hoch oder tief. Du kaufst mehr wenn günstig, weniger wenn teuer. Entfernt Emotion aus dem Investieren.',
  },
  q011: {
    text: 'Was ist eine Anleihe (Bond)?',
    options: [
      { id: 'A', text: 'Ein Eigentumsanteil an einem Unternehmen' },
      { id: 'B', text: 'Ein Kredit den du einer Regierung oder einem Unternehmen gibst' },
      { id: 'C', text: 'Ein Terminkontrakt auf Rohstoffe' },
      { id: 'D', text: 'Eine staatliche Rente' },
    ],
    explanation: 'Anleihe = Kredit an Staat oder Unternehmen. Sie zahlen feste Zinsen und geben den Betrag am Ende zurück. Sicherer als Aktien, aber geringere Rendite.',
  },
  q012: {
    text: 'Wenn die Zinsen steigen, was passiert mit Anleihenkursen?',
    options: [
      { id: 'A', text: 'Kurse steigen proportional' },
      { id: 'B', text: 'Kurse bleiben gleich' },
      { id: 'C', text: 'Kurse fallen' },
      { id: 'D', text: 'Anleihen werden automatisch eingelöst' },
    ],
    explanation: 'Anleihen und Zinsen bewegen sich umgekehrt. Steigende Zinsen → bestehende Anleihen verlieren an Wert, weil neue Anleihen besser zahlen.',
  },
  q013: {
    text: 'Was ist eine Rezession?',
    options: [
      { id: 'A', text: 'Ein Anstieg des BIP über zwei Quartale' },
      { id: 'B', text: 'Zwei aufeinanderfolgende Quartale mit negativem BIP-Wachstum' },
      { id: 'C', text: 'Eine Währungsabwertung' },
      { id: 'D', text: 'Ein Rückgang der Aktienmärkte um 10%' },
    ],
    explanation: 'Rezession = zwei Quartale negatives BIP-Wachstum in Folge. Die USA hatten ~13 Rezessionen seit 1945, durchschnittlich eine alle 6 Jahre.',
  },
  q014: {
    text: 'Was macht die Zentralbank (z.B. EZB oder Fed)?',
    options: [
      { id: 'A', text: 'Verkauft Aktien direkt an Privatanleger' },
      { id: 'B', text: 'Steuert Zinssätze und Geldmenge zur Wirtschaftskontrolle' },
      { id: 'C', text: 'Versichert alle Bankeinlagen' },
      { id: 'D', text: 'Legt Mindestlöhne fest' },
    ],
    explanation: 'Zentralbanken steuern Zinsen um Inflation und Wachstum zu kontrollieren. Hohe Zinsen = teures Borgen = langsamere Wirtschaft. "Kämpfe nicht gegen die Fed."',
  },
  q015: {
    text: 'Was ist Kryptowährung?',
    options: [
      { id: 'A', text: 'Eine staatlich besicherte digitale Währung' },
      { id: 'B', text: 'Digitales Geld auf dezentralen Blockchain-Netzwerken' },
      { id: 'C', text: 'Eine Art Bankgeheimnis' },
      { id: 'D', text: 'Virtuelle Währung nur für Online-Spiele' },
    ],
    explanation: 'Crypto = digitales Geld auf dezentralen Blockchains. Bitcoin, Ethereum und Tausende Altcoins bilden einen Markt von 2+ Billionen USD. Hoch volatil.',
  },
  q016: {
    text: 'Was ist eine Call-Option?',
    options: [
      { id: 'A', text: 'Die Pflicht, eine Aktie zu kaufen' },
      { id: 'B', text: 'Das Recht, eine Aktie zu einem fixen Preis zu verkaufen' },
      { id: 'C', text: 'Das Recht, eine Aktie zu einem fixen Preis zu kaufen' },
      { id: 'D', text: 'Eine garantierte Dividendenzahlung' },
    ],
    explanation: 'Call = Recht (keine Pflicht) zu KAUFEN zum Strike-Preis. Put = Recht zu VERKAUFEN. Optionen verfallen wertlos wenn der Markt gegen dich läuft.',
  },
  q017: {
    text: 'Was ist ein REIT?',
    options: [
      { id: 'A', text: 'Eine Art Hedgefonds' },
      { id: 'B', text: 'Ein börsengehandelter Immobilientrust' },
      { id: 'C', text: 'Ein Staatsanleihen-Portfolio' },
      { id: 'D', text: 'Ein Rohstoff-Terminkontrakt' },
    ],
    explanation: 'REIT = investiere in Immobilien ohne Immobilien zu besitzen. Wie Aktien handelbar, müssen 90% des Einkommens als Dividenden ausschütten. Durchschnittsrendite: 3–6%.',
  },
  q018: {
    text: 'Was ist Leerverkauf (Short Selling)?',
    options: [
      { id: 'A', text: 'Aktien schnell kaufen und wieder verkaufen' },
      { id: 'B', text: 'Aktien borgen und verkaufen, um sie günstiger zurückzukaufen' },
      { id: 'C', text: 'Aktien unter dem Marktpreis verkaufen' },
      { id: 'D', text: 'Ein Langzeit-Investment für über 10 Jahre' },
    ],
    explanation: 'Short Selling = Aktien borgen und verkaufen, Hoffnung: Preis fällt → günstiger zurückkaufen. Verluste theoretisch unbegrenzt. GameStop 2021 zeigte die Risiken.',
  },
  q019: {
    text: 'Was ist der S&P 500?',
    options: [
      { id: 'A', text: 'Die 500 grössten Schweizer Unternehmen' },
      { id: 'B', text: 'Ein Index der 500 grössten börsennotierten US-Unternehmen' },
      { id: 'C', text: '500 staatlich garantierte Anleihen' },
      { id: 'D', text: 'Eine Kreditwürdigkeitsbewertung' },
    ],
    explanation: 'S&P 500 = Index der 500 grössten US-Unternehmen. Historische Durchschnittsrendite: ~10%/Jahr. Warren Buffett empfiehlt ihn für die meisten Anleger.',
  },
  q020: {
    text: 'Was ist Kaufkraft?',
    options: [
      { id: 'A', text: 'Der Marktwert einer Aktie' },
      { id: 'B', text: 'Die Menge an Gütern, die man mit einer bestimmten Geldsumme kaufen kann' },
      { id: 'C', text: 'Das Verhältnis von Schulden zu Eigenkapital' },
      { id: 'D', text: 'Die Kreditwürdigkeit eines Unternehmens' },
    ],
    explanation: 'Kaufkraft = was du für dein Geld kaufen kannst. Inflation mindert die Kaufkraft: $100 kaufen heute nur noch $59 wert an Gütern gegenüber dem Jahr 2000.',
  },
};

export function getLocalizedQuestion(question: Question, language: Language): { text: string; options: { id: string; text: string }[]; explanation: string } {
  if (language === 'de' && DE[question.id]) {
    return DE[question.id];
  }
  // Fallback to English
  return {
    text: question.text,
    options: question.options,
    explanation: question.explanation,
  };
}
