/**
 * Stock symbol categories for auto-scanning
 * Organized by market indices and sectors
 */
export const SCAN_CATEGORIES = {
  sp500: {
    label: 'S&P 500',
    description: 'Top 500 US-Unternehmen',
    symbols: [
      'AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'META', 'TSLA', 'BRK-B', 'UNH', 'XOM',
      'JNJ', 'JPM', 'V', 'PG', 'MA', 'HD', 'CVX', 'MRK', 'ABBV', 'LLY',
      'PEP', 'KO', 'COST', 'AVGO', 'WMT', 'MCD', 'CSCO', 'TMO', 'ACN', 'ABT',
      'DHR', 'NEE', 'LIN', 'ADBE', 'CRM', 'NKE', 'TXN', 'PM', 'WFC', 'UPS',
      'ORCL', 'RTX', 'QCOM', 'AMD', 'HON', 'LOW', 'IBM', 'SPGI', 'GE', 'CAT',
      'INTC', 'DE', 'BA', 'AMGN', 'INTU', 'SBUX', 'GS', 'BKNG', 'GILD', 'BLK',
      'AXP', 'MS', 'MDLZ', 'ADI', 'ISRG', 'VRTX', 'REGN', 'SYK', 'TJX', 'CVS',
      'LRCX', 'PLD', 'SCHW', 'ZTS', 'C', 'ADP', 'TMUS', 'MMC', 'CB', 'ETN',
      'SO', 'PANW', 'CI', 'FI', 'DUK', 'MO', 'BSX', 'BDX', 'PGR', 'CME',
      'SNPS', 'EOG', 'CL', 'EQIX', 'ICE', 'SLB', 'ITW', 'NOC', 'AON', 'WM',
      'CDNS', 'CSX', 'PNC', 'HUM', 'MCO', 'APD', 'PYPL', 'EMR', 'FCX', 'USB',
      'MSI', 'TGT', 'ORLY', 'SHW', 'MMM', 'COP', 'AZO', 'KLAC', 'GD', 'NSC',
      'ROP', 'ADM', 'PCAR', 'NXPI', 'CTAS', 'PSA', 'GM', 'AJG', 'MPC', 'MCHP',
      'TFC', 'F', 'OXY', 'CARR', 'AMAT', 'MAR', 'HLT', 'AFL', 'AEP', 'SRE',
      'TRV', 'D', 'DXCM', 'MRNA', 'KMB', 'PSX', 'MSCI', 'FTNT', 'PAYX', 'EW',
      'FDX', 'AIG', 'O', 'EXC', 'TEL', 'APH', 'CMG', 'NEM', 'VLO', 'DLR',
      'JCI', 'MNST', 'IQV', 'GIS', 'SPG', 'COF', 'PH', 'HES', 'KMI', 'PRU',
      'A', 'YUM', 'CTVA', 'IDXX', 'CMI', 'ALL', 'HAL', 'WELL', 'DOW', 'KEYS',
      'KR', 'DD', 'BK', 'EL', 'DG', 'GWW', 'KHC', 'WEC', 'ED', 'DVN',
      'STZ', 'AWK', 'HSY', 'MTD', 'ON', 'FAST', 'GEHC', 'ODFL', 'CSGP', 'DLTR'
    ]
  },
  nasdaq100: {
    label: 'NASDAQ-100',
    description: 'Top 100 NASDAQ-Unternehmen',
    symbols: [
      'AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'GOOG', 'META', 'TSLA', 'AVGO', 'COST',
      'PEP', 'ADBE', 'CSCO', 'NFLX', 'AMD', 'CMCSA', 'TMUS', 'TXN', 'INTC', 'QCOM',
      'INTU', 'AMGN', 'HON', 'AMAT', 'ISRG', 'BKNG', 'VRTX', 'SBUX', 'ADI', 'GILD',
      'MDLZ', 'LRCX', 'REGN', 'ADP', 'PANW', 'SNPS', 'CDNS', 'PYPL', 'KLAC', 'MELI',
      'MAR', 'MNST', 'CSX', 'ORLY', 'NXPI', 'CTAS', 'PCAR', 'MCHP', 'FTNT', 'DXCM',
      'MRNA', 'PAYX', 'AEP', 'LULU', 'ADSK', 'KDP', 'AZN', 'ROST', 'CPRT', 'KHC',
      'ABNB', 'MRVL', 'EXC', 'ODFL', 'CSGP', 'DLTR', 'EA', 'XEL', 'IDXX', 'BKR',
      'BIIB', 'VRSK', 'CTSH', 'FAST', 'GEHC', 'DDOG', 'ON', 'FANG', 'WBD', 'CEG',
      'ANSS', 'ILMN', 'ZS', 'TTD', 'CDW', 'GFS', 'WBA', 'TEAM', 'ALGN', 'ZM',
      'CRWD', 'ENPH', 'SIRI', 'LCID', 'RIVN', 'SGEN', 'JD', 'PDD', 'BIDU', 'NTES'
    ]
  },
  techGrowth: {
    label: 'Tech Growth',
    description: 'Wachstumsstarke Tech-Aktien',
    symbols: [
      'PLTR', 'SNOW', 'NET', 'CRWD', 'DDOG', 'ZS', 'MDB', 'PANW', 'TEAM', 'SHOP',
      'SQ', 'ROKU', 'COIN', 'RBLX', 'U', 'ABNB', 'UBER', 'LYFT', 'DASH', 'SNAP',
      'PINS', 'TWLO', 'OKTA', 'ZI', 'DOCN', 'PATH', 'CFLT', 'GTLB', 'BRZE', 'HUBS',
      'WDAY', 'NOW', 'VEEV', 'SPLK', 'ESTC', 'BILL', 'MNDY', 'PCTY', 'PAYC', 'COUP',
      'DOCU', 'ZEN', 'FIVN', 'RNG', 'TOST', 'SMAR', 'APP', 'TTD', 'MGNI', 'PUBM',
      'SE', 'GRAB', 'BABA', 'JD', 'PDD', 'MELI', 'GLOB', 'DLOCAL', 'STNE', 'PAGS',
      'NU', 'SOFI', 'UPST', 'AFRM', 'HOOD', 'OPEN', 'RDFN', 'COUR', 'DUOL', 'CHGG',
      'AI', 'BBAI', 'ASAN', 'ATLASSIAN', 'ATLASSIAN', 'IOT', 'SAMSARA', 'QUALTRICS', 'SPRK', 'S'
    ]
  },
  semiconductors: {
    label: 'Halbleiter',
    description: 'Chip-Hersteller & Zulieferer',
    symbols: [
      'NVDA', 'AMD', 'INTC', 'AVGO', 'QCOM', 'TXN', 'MU', 'AMAT', 'LRCX', 'KLAC',
      'NXPI', 'ADI', 'MCHP', 'ON', 'MRVL', 'MPWR', 'SWKS', 'QRVO', 'ASML', 'TSM',
      'GFS', 'UMC', 'SSNLF', 'CRUS', 'MKSI', 'ENTG', 'AMKR', 'OLED', 'WOLF', 'SITM',
      'ACLS', 'UCTT', 'COHU', 'FORM', 'AEHR', 'MTSI', 'RMBS', 'POWI', 'DIOD', 'SLAB',
      'AMBA', 'SIMO', 'AOSL', 'INDI', 'NVTS', 'ACMR', 'ALGM', 'SMTC', 'VSH', 'ROHM'
    ]
  },
  biotech: {
    label: 'Biotech & Pharma',
    description: 'Biotechnologie & Pharmazeutika',
    symbols: [
      'LLY', 'NVO', 'JNJ', 'MRK', 'ABBV', 'PFE', 'TMO', 'ABT', 'DHR', 'AMGN',
      'GILD', 'VRTX', 'REGN', 'ISRG', 'BMY', 'ZTS', 'SYK', 'BSX', 'BDX', 'MDT',
      'CI', 'HUM', 'ELV', 'MRNA', 'BIIB', 'ILMN', 'DXCM', 'IDXX', 'ALGN', 'IQV',
      'A', 'HOLX', 'EW', 'TECH', 'MTD', 'WAT', 'RGEN', 'BIO', 'PKI', 'QGEN',
      'SGEN', 'EXAS', 'NBIX', 'SRPT', 'ALNY', 'BMRN', 'JAZZ', 'UTHR', 'INCY', 'HALO',
      'IONS', 'PCVX', 'PTCT', 'RARE', 'RCKT', 'ARWR', 'FOLD', 'ARVN', 'BEAM', 'NTLA',
      'CRSP', 'EDIT', 'VERV', 'KYMR', 'FATE', 'BLUE', 'SGMO', 'APLS', 'PRTA', 'AKRO'
    ]
  },
  energy: {
    label: 'Energie',
    description: 'Öl, Gas & Erneuerbare',
    symbols: [
      'XOM', 'CVX', 'COP', 'EOG', 'SLB', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL',
      'DVN', 'HES', 'KMI', 'WMB', 'BKR', 'FANG', 'PXD', 'CTRA', 'APA', 'MRO',
      'OKE', 'TRGP', 'LNG', 'ET', 'EPD', 'PAA', 'MPLX', 'ENB', 'TRP', 'SU',
      'CNQ', 'IMO', 'CVE', 'WES', 'AM', 'DCP', 'HESM', 'USAC', 'NS', 'GEL',
      // Renewables
      'NEE', 'ENPH', 'SEDG', 'FSLR', 'RUN', 'NOVA', 'SPWR', 'CSIQ', 'JKS', 'ARRY',
      'STEM', 'BLNK', 'CHPT', 'EVGO', 'PLUG', 'BE', 'BLDP', 'FCEL', 'CLNE', 'NFE'
    ]
  },
  finance: {
    label: 'Finanzsektor',
    description: 'Banken, Versicherungen & Fintech',
    symbols: [
      'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'SCHW', 'BLK', 'AXP', 'USB',
      'PNC', 'TFC', 'COF', 'BK', 'STT', 'FITB', 'HBAN', 'KEY', 'RF', 'CFG',
      'MTB', 'NTRS', 'ZION', 'CMA', 'FHN', 'ALLY', 'SIVB', 'PACW', 'WAL', 'EWBC',
      // Insurance
      'BRK-B', 'CB', 'PGR', 'TRV', 'AIG', 'MET', 'PRU', 'AFL', 'ALL', 'MMC',
      'AON', 'AJG', 'WRB', 'L', 'HIG', 'EG', 'RNR', 'CINF', 'GL', 'ORI',
      // Fintech
      'V', 'MA', 'PYPL', 'SQ', 'COIN', 'SOFI', 'UPST', 'AFRM', 'HOOD', 'NU',
      'FIS', 'FISV', 'ADP', 'PAYX', 'GPN', 'FLT', 'WEX', 'JKHY', 'NCNO', 'BILL'
    ]
  },
  consumer: {
    label: 'Konsum',
    description: 'Konsumgüter & Einzelhandel',
    symbols: [
      // Retail
      'WMT', 'COST', 'TGT', 'HD', 'LOW', 'TJX', 'ROST', 'DLTR', 'DG', 'FIVE',
      'BBY', 'ULTA', 'AZO', 'ORLY', 'AAP', 'W', 'BURL', 'KSS', 'M', 'JWN',
      'GPS', 'ANF', 'URBN', 'AEO', 'EXPR', 'PSMT', 'BJ', 'OLLI', 'BOOT', 'PLCE',
      // Consumer Goods
      'PG', 'KO', 'PEP', 'PM', 'MO', 'MDLZ', 'KHC', 'GIS', 'K', 'CAG',
      'SJM', 'HSY', 'HRL', 'MKC', 'CHD', 'CLX', 'CL', 'KMB', 'EL', 'COTY',
      // Restaurants & Leisure
      'MCD', 'SBUX', 'CMG', 'YUM', 'DPZ', 'QSR', 'WING', 'SHAK', 'JACK', 'TXRH',
      'DRI', 'BLMN', 'EAT', 'CAKE', 'BJRI', 'DENN', 'PLAY', 'SIX', 'FUN', 'SEAS'
    ]
  },
  realestate: {
    label: 'Immobilien (REITs)',
    description: 'Immobilien-Investments',
    symbols: [
      'PLD', 'AMT', 'EQIX', 'CCI', 'PSA', 'O', 'WELL', 'SPG', 'DLR', 'VICI',
      'AVB', 'EQR', 'VTR', 'ARE', 'MAA', 'UDR', 'ESS', 'INVH', 'SUI', 'ELS',
      'WY', 'SBAC', 'GLPI', 'STOR', 'STAG', 'FR', 'COLD', 'REXR', 'TRNO', 'EGP',
      'BXP', 'KRC', 'DEI', 'HIW', 'OFC', 'CBRE', 'JLL', 'CWK', 'NMRK', 'MMI',
      'HST', 'SHO', 'PK', 'RLJ', 'XHR', 'INN', 'DRH', 'APLE', 'PEB', 'BHR'
    ]
  },
  industrial: {
    label: 'Industrie',
    description: 'Industrieunternehmen & Maschinenbau',
    symbols: [
      'CAT', 'DE', 'HON', 'GE', 'RTX', 'BA', 'LMT', 'NOC', 'GD', 'UPS',
      'UNP', 'CSX', 'NSC', 'FDX', 'JBHT', 'XPO', 'CHRW', 'EXPD', 'ODFL', 'SAIA',
      'PCAR', 'CMI', 'GNRC', 'EMR', 'ROK', 'ETN', 'ITW', 'SNA', 'SWK', 'TT',
      'PH', 'IR', 'AME', 'ROP', 'IEX', 'DOV', 'NDSN', 'GGG', 'FLS', 'FBIN',
      'MMM', 'JCI', 'CARR', 'TDG', 'HWM', 'SPR', 'AXON', 'LDOS', 'CACI', 'SAIC'
    ]
  },
  chinaADR: {
    label: 'China ADRs',
    description: 'Chinesische Unternehmen an US-Börsen',
    symbols: [
      'BABA', 'JD', 'PDD', 'BIDU', 'NIO', 'XPEV', 'LI', 'BILI', 'TME', 'VIPS',
      'IQ', 'NTES', 'ZTO', 'YUMC', 'TAL', 'EDU', 'DADA', 'QFIN', 'FUTU', 'TIGR',
      'BEKE', 'KC', 'LU', 'YMM', 'MNSO', 'WB', 'BZUN', 'YSG', 'LEGN', 'ZLAB',
      'BGNE', 'HTHT', 'ATHM', 'VNET', 'DOYU', 'HUYA', 'GDS', 'API', 'DAO', 'BEST'
    ]
  },
  europe: {
    label: 'Europa (ADRs)',
    description: 'Europäische Unternehmen',
    symbols: [
      // Germany
      'SAP', 'SAPSF', 'DB', 'SIEM', 'BASFY', 'BAYRY', 'DAIMY', 'BAMXY', 'VONOY', 'ADDYY',
      // UK
      'SHEL', 'BP', 'AZN', 'GSK', 'UL', 'RIO', 'BHP', 'HSBC', 'LYG', 'BTI',
      'DEO', 'NVS', 'SNY', 'SONY', 'TM', 'HMC', 'STLA', 'RACE', 'NVO', 'ABB',
      // France
      'TTE', 'LVMUY', 'LRLCY', 'BNPQY', 'AXAHY', 'DANOY', 'ENGIY', 'PUBGY', 'VIVHY', 'SBGSY',
      // Other
      'ASML', 'NKE', 'PHG', 'ING', 'ERIC', 'NOK', 'SPOT', 'SAN', 'BBVA', 'IBN'
    ]
  },
  etfs: {
    label: 'ETFs',
    description: 'Exchange Traded Funds',
    symbols: [
      // Broad Market
      'SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'VT', 'VEA', 'VWO', 'EFA',
      // Sector ETFs
      'XLK', 'XLF', 'XLE', 'XLV', 'XLI', 'XLP', 'XLY', 'XLB', 'XLU', 'XLRE',
      // Thematic
      'ARKK', 'ARKG', 'ARKW', 'ARKF', 'ARKQ', 'SOXX', 'SMH', 'KWEB', 'TAN', 'ICLN',
      // Bonds & Fixed Income
      'BND', 'AGG', 'TLT', 'IEF', 'SHY', 'LQD', 'HYG', 'JNK', 'VCIT', 'VCSH',
      // Commodity
      'GLD', 'SLV', 'USO', 'UNG', 'DBA', 'DBC', 'PDBC', 'COPX', 'LIT', 'REMX',
      // Leveraged
      'TQQQ', 'SQQQ', 'SPXL', 'SPXS', 'UPRO', 'UDOW', 'SDOW', 'TNA', 'TZA', 'FAS'
    ]
  },
  smallCap: {
    label: 'Small Caps',
    description: 'Kleinere Unternehmen mit Wachstumspotential',
    symbols: [
      'AXON', 'CROX', 'DECK', 'LULU', 'FIVE', 'WING', 'SHAK', 'CHWY', 'ETSY', 'W',
      'PINS', 'SNAP', 'MTCH', 'BMBL', 'YELP', 'GRPN', 'ZG', 'RDFN', 'OPEN', 'CVNA',
      'CARG', 'KMX', 'AN', 'ABG', 'LAD', 'SAH', 'GPI', 'PAG', 'RUSHA', 'RUSHB',
      'CELH', 'FIZZ', 'MNST', 'COKE', 'WDFC', 'FRPT', 'MGPI', 'VITL', 'SMPL', 'FARM',
      'PGNY', 'GDRX', 'SDGR', 'CERT', 'HIMS', 'DOCS', 'TALK', 'AMWL', 'TDOC', 'LVGO',
      'ENPH', 'SEDG', 'RUN', 'NOVA', 'SHLS', 'ARRY', 'MAXN', 'SPWR', 'CSIQ', 'JKS',
      'PLUG', 'FCEL', 'BE', 'BLDP', 'BLNK', 'CHPT', 'EVGO', 'LCID', 'RIVN', 'GOEV'
    ]
  }
};

/**
 * Get all unique symbols from selected categories
 */
export function getSymbolsFromCategories(categoryIds) {
  const symbolSet = new Set();
  categoryIds.forEach(catId => {
    const category = SCAN_CATEGORIES[catId];
    if (category) {
      category.symbols.forEach(sym => symbolSet.add(sym));
    }
  });
  return Array.from(symbolSet);
}

/**
 * Get all available symbols (all categories)
 */
export function getAllSymbols() {
  return getSymbolsFromCategories(Object.keys(SCAN_CATEGORIES));
}

/**
 * Time periods available for auto-scan
 */
export const AUTO_SCAN_PERIODS = [
  { value: '1M', label: '1 Monat' },
  { value: '3M', label: '3 Monate' },
  { value: '6M', label: '6 Monate' },
  { value: '1Y', label: '1 Jahr' }
];

/**
 * Minimum bullish percentage threshold options
 */
export const BULLISH_THRESHOLDS = [
  { value: 70, label: '70%' },
  { value: 80, label: '80%' },
  { value: 90, label: '90%' }
];
