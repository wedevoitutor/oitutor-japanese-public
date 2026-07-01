import { createContext, useContext } from 'react';

export const sumiTokens = {
  paper:       '#f6f1e6',
  paperEdge:   '#eee6d4',
  cardCream:   '#fbf7ec',
  ink:         '#1a1613',
  inkSoft:     '#4a4038',
  inkFaint:    '#8a7f72',
  rule:        '#d9cfbb',
  lavender:    '#ede5ff',
  lavenderMid: '#d9c8ff',
  violet:      '#7c3aed',
  violetDeep:  '#6d28d9',
  violetInk:   '#3a2566',
  vermilion:   '#c03a2b',
  vermDeep:    '#9a2e21',
  correct:     '#3a6b3a',
  fontJP:      '"Shippori Mincho", "Noto Serif JP", serif',
  fontUI:      '"Inter", system-ui, sans-serif',
  fontMono:    '"JetBrains Mono", ui-monospace, monospace',
};

export const SumiContext = createContext(null);
export const useSumiTheme = () => useContext(SumiContext);
