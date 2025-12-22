/**
 * Exchange suffixes for international stock symbols
 * Used to search stocks across different global exchanges
 */
export const EXCHANGE_SUFFIXES = [
  { suffix: '', exchange: 'US (NYSE/NASDAQ)', flag: '🇺🇸' },
  { suffix: '.SW', exchange: 'Schweiz (SIX)', flag: '🇨🇭' },
  { suffix: '.DE', exchange: 'Deutschland (XETRA)', flag: '🇩🇪' },
  { suffix: '.F', exchange: 'Frankfurt', flag: '🇩🇪' },
  { suffix: '.L', exchange: 'London (LSE)', flag: '🇬🇧' },
  { suffix: '.PA', exchange: 'Paris (Euronext)', flag: '🇫🇷' },
  { suffix: '.AS', exchange: 'Amsterdam (Euronext)', flag: '🇳🇱' },
  { suffix: '.MI', exchange: 'Mailand (Borsa Italiana)', flag: '🇮🇹' },
  { suffix: '.MC', exchange: 'Madrid (BME)', flag: '🇪🇸' },
  { suffix: '.VI', exchange: 'Wien (Wiener Börse)', flag: '🇦🇹' },
  { suffix: '.TO', exchange: 'Toronto (TSX)', flag: '🇨🇦' },
  { suffix: '.AX', exchange: 'Sydney (ASX)', flag: '🇦🇺' },
  { suffix: '.HK', exchange: 'Hong Kong (HKEX)', flag: '🇭🇰' },
  { suffix: '.T', exchange: 'Tokyo (TSE)', flag: '🇯🇵' },
];

/**
 * Time periods for chart data with their duration in seconds
 */
export const TIME_PERIODS = {
  '1M': 30 * 24 * 60 * 60,
  '3M': 90 * 24 * 60 * 60,
  '6M': 180 * 24 * 60 * 60,
  '1Y': 365 * 24 * 60 * 60,
  '2Y': 730 * 24 * 60 * 60,
  '5Y': 1825 * 24 * 60 * 60,
};

/**
 * Available chart intervals
 */
export const CHART_INTERVALS = [
  { value: '1d', label: 'Tag' },
  { value: '1h', label: '1h' },
  { value: '15m', label: '15m' },
];
