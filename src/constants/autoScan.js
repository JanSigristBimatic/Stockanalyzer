/**
 * Stock symbol categories for auto-scanning
 * Organized by market indices and sectors
 */
export const SCAN_CATEGORIES = {
  schweiz: {
    label: 'Schweiz',
    description: 'SMI und grosse SMIM-Titel',
    symbols: [
      'ABBN.SW', 'ALC.SW', 'CFR.SW', 'GEBN.SW', 'GIVN.SW', 'HOLN.SW', 'KNIN.SW', 'LOGN.SW', 'LONN.SW', 'NESN.SW',
      'NOVN.SW', 'PGHN.SW', 'ROP.SW', 'SIKA.SW', 'SOON.SW', 'SLHN.SW', 'SREN.SW', 'SCMN.SW', 'UBSG.SW', 'ZURN.SW',
      'SGSN.SW', 'SCHP.SW', 'GALD.SW', 'SDZ.SW', 'STMN.SW', 'SPSN.SW', 'LISN.SW', 'BAER.SW', 'TEMN.SW', 'VACN.SW',
      'BEAN.SW', 'HBAN.SW', 'ADEN.SW', 'CLN.SW', 'EMSN.SW', 'BARN.SW', 'GF.SW', 'SIGN.SW', 'UHR.SW', 'TECN.SW',
      'FHZN.SW', 'AVOL.SW', 'BANB.SW', 'PSPN.SW', 'DKSH.SW'
    ]
  },
  deutschland: {
    label: 'Deutschland',
    description: 'DAX und weitere grosse Titel',
    symbols: [
      'ADS.DE', 'AIR.DE', 'ALV.DE', 'BAS.DE', 'BAYN.DE', 'BEI.DE', 'BMW.DE', 'BNR.DE', 'CBK.DE', 'CON.DE',
      'DTG.DE', 'DBK.DE', 'DB1.DE', 'DHL.DE', 'DTE.DE', 'EOAN.DE', 'FRE.DE', 'FME.DE', 'G1A.DE', 'HNR1.DE',
      'HEI.DE', 'HEN3.DE', 'IFX.DE', 'MBG.DE', 'MRK.DE', 'MTX.DE', 'MUV2.DE', 'P911.DE', 'PAH3.DE', 'QIA.DE',
      'RHM.DE', 'RWE.DE', 'SAP.DE', 'SRT3.DE', 'SIE.DE', 'ENR.DE', 'SHL.DE', 'SY1.DE', 'VOW3.DE', 'VNA.DE',
      'ZAL.DE', 'G24.DE'
    ]
  },
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
      'LRCX', 'PLD', 'SCHW', 'ZTS', 'C', 'ADP', 'TMUS', 'MRSH', 'CB', 'ETN',
      'SO', 'PANW', 'CI', 'FISV', 'DUK', 'MO', 'BSX', 'BDX', 'PGR', 'CME',
      'SNPS', 'EOG', 'CL', 'EQIX', 'ICE', 'SLB', 'ITW', 'NOC', 'AON', 'WM',
      'CDNS', 'CSX', 'PNC', 'HUM', 'MCO', 'APD', 'PYPL', 'EMR', 'FCX', 'USB',
      'MSI', 'TGT', 'ORLY', 'SHW', 'MMM', 'COP', 'AZO', 'KLAC', 'GD', 'NSC',
      'ROP', 'ADM', 'PCAR', 'NXPI', 'CTAS', 'PSA', 'GM', 'AJG', 'MPC', 'MCHP',
      'TFC', 'F', 'OXY', 'CARR', 'AMAT', 'MAR', 'HLT', 'AFL', 'AEP', 'SRE',
      'TRV', 'D', 'DXCM', 'MRNA', 'KMB', 'PSX', 'MSCI', 'FTNT', 'PAYX', 'EW',
      'FDX', 'AIG', 'O', 'EXC', 'TEL', 'APH', 'CMG', 'NEM', 'VLO', 'DLR',
      'JCI', 'MNST', 'IQV', 'GIS', 'SPG', 'COF', 'PH', 'KMI', 'PRU',
      'A', 'YUM', 'CTVA', 'IDXX', 'CMI', 'ALL', 'HAL', 'WELL', 'DOW', 'KEYS',
      'KR', 'DD', 'BNY', 'EL', 'DG', 'GWW', 'KHC', 'WEC', 'ED', 'DVN',
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
      'ABNB', 'MRVL', 'EXC', 'ODFL', 'CSGP', 'DLTR', 'XEL', 'IDXX', 'BKR',
      'BIIB', 'VRSK', 'CTSH', 'FAST', 'GEHC', 'DDOG', 'ON', 'FANG', 'WBD', 'CEG',
      'ILMN', 'ZS', 'TTD', 'CDW', 'GFS', 'TEAM', 'ALGN', 'ZM',
      'CRWD', 'ENPH', 'SIRI', 'LCID', 'RIVN', 'JD', 'PDD', 'BIDU', 'NTES'
    ]
  },
  techGrowth: {
    label: 'Tech Growth',
    description: 'Wachstumsstarke Tech-Aktien',
    symbols: [
      'PLTR', 'SNOW', 'NET', 'CRWD', 'DDOG', 'ZS', 'MDB', 'PANW', 'TEAM', 'SHOP',
      'XYZ', 'ROKU', 'COIN', 'RBLX', 'U', 'ABNB', 'UBER', 'LYFT', 'DASH', 'SNAP',
      'PINS', 'TWLO', 'OKTA', 'GTM', 'DOCN', 'PATH', 'GTLB', 'BRZE', 'HUBS',
      'WDAY', 'NOW', 'VEEV', 'ESTC', 'BILL', 'MNDY', 'PCTY', 'PAYC',
      'DOCU', 'FIVN', 'RNG', 'TOST', 'APP', 'TTD', 'MGNI', 'PUBM',
      'SE', 'GRAB', 'BABA', 'JD', 'PDD', 'MELI', 'GLOB', 'DLO', 'STNE', 'PAGS',
      'NU', 'SOFI', 'UPST', 'AFRM', 'HOOD', 'OPEN', 'COUR', 'DUOL', 'CHGG',
      'AI', 'BBAI', 'ASAN', 'IOT', 'S'
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
      'AMBA', 'SIMO', 'AOSL', 'INDI', 'NVTS', 'ACMR', 'ALGM', 'SMTC', 'VSH'
    ]
  },
  biotech: {
    label: 'Biotech & Pharma',
    description: 'Biotechnologie & Pharmazeutika',
    symbols: [
      'LLY', 'NVO', 'JNJ', 'MRK', 'ABBV', 'PFE', 'TMO', 'ABT', 'DHR', 'AMGN',
      'GILD', 'VRTX', 'REGN', 'ISRG', 'BMY', 'ZTS', 'SYK', 'BSX', 'BDX', 'MDT',
      'CI', 'HUM', 'ELV', 'MRNA', 'BIIB', 'ILMN', 'DXCM', 'IDXX', 'ALGN', 'IQV',
      'A', 'EW', 'TECH', 'MTD', 'WAT', 'RGEN', 'BIO', 'RVTY', 'QGEN',
      'NBIX', 'SRPT', 'ALNY', 'BMRN', 'JAZZ', 'UTHR', 'INCY', 'HALO',
      'IONS', 'PCVX', 'PTCT', 'RARE', 'RCKT', 'ARWR', 'ARVN', 'BEAM', 'NTLA',
      'CRSP', 'EDIT', 'KYMR', 'FATE', 'PRTA'
    ]
  },
  energy: {
    label: 'Energie',
    description: 'Öl, Gas & Erneuerbare',
    symbols: [
      'XOM', 'CVX', 'COP', 'EOG', 'SLB', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL',
      'DVN', 'KMI', 'WMB', 'BKR', 'FANG', 'APA',
      'OKE', 'TRGP', 'LNG', 'ET', 'EPD', 'PAA', 'MPLX', 'ENB', 'TRP', 'SU',
      'CNQ', 'IMO', 'CVE', 'WES', 'AM', 'HESM', 'USAC', 'GEL',
      // Renewables
      'NEE', 'ENPH', 'SEDG', 'FSLR', 'RUN', 'SPWR', 'CSIQ', 'JKS', 'ARRY',
      'STEM', 'BLNK', 'CHPT', 'EVGO', 'PLUG', 'BE', 'BLDP', 'FCEL', 'CLNE', 'NFE'
    ]
  },
  finance: {
    label: 'Finanzsektor',
    description: 'Banken, Versicherungen & Fintech',
    symbols: [
      'JPM', 'BAC', 'WFC', 'C', 'GS', 'MS', 'SCHW', 'BLK', 'AXP', 'USB',
      'PNC', 'TFC', 'COF', 'BNY', 'STT', 'FITB', 'HBAN', 'KEY', 'RF', 'CFG',
      'MTB', 'NTRS', 'ZION', 'FHN', 'ALLY', 'BANC', 'WAL', 'EWBC',
      // Insurance
      'BRK-B', 'CB', 'PGR', 'TRV', 'AIG', 'MET', 'PRU', 'AFL', 'ALL', 'MRSH',
      'AON', 'AJG', 'WRB', 'L', 'HIG', 'EG', 'RNR', 'CINF', 'GL', 'ORI',
      // Fintech
      'V', 'MA', 'PYPL', 'XYZ', 'COIN', 'SOFI', 'UPST', 'AFRM', 'HOOD', 'NU',
      'FIS', 'FISV', 'ADP', 'PAYX', 'GPN', 'CPAY', 'WEX', 'JKHY', 'NCNO', 'BILL'
    ]
  },
  consumer: {
    label: 'Konsum',
    description: 'Konsumgüter & Einzelhandel',
    symbols: [
      // Retail
      'WMT', 'COST', 'TGT', 'HD', 'LOW', 'TJX', 'ROST', 'DLTR', 'DG', 'FIVE',
      'BBY', 'ULTA', 'AZO', 'ORLY', 'AAP', 'W', 'BURL', 'KSS', 'M',
      'GAP', 'ANF', 'URBN', 'AEO', 'PSMT', 'BJ', 'OLLI', 'BOOT', 'PLCE',
      // Consumer Goods
      'PG', 'KO', 'PEP', 'PM', 'MO', 'MDLZ', 'KHC', 'GIS', 'CAG',
      'SJM', 'HSY', 'HRL', 'MKC', 'CHD', 'CLX', 'CL', 'KMB', 'EL', 'COTY',
      // Restaurants & Leisure
      'MCD', 'SBUX', 'CMG', 'YUM', 'DPZ', 'QSR', 'WING', 'SHAK', 'JACK', 'TXRH',
      'DRI', 'BLMN', 'EAT', 'CAKE', 'BJRI', 'PLAY', 'FUN'
    ]
  },
  realestate: {
    label: 'Immobilien (REITs)',
    description: 'Immobilien-Investments',
    symbols: [
      'PLD', 'AMT', 'EQIX', 'CCI', 'PSA', 'O', 'WELL', 'SPG', 'DLR', 'VICI',
      'VTR', 'ARE', 'MAA', 'UDR', 'ESS', 'INVH', 'SUI', 'ELS',
      'WY', 'SBAC', 'GLPI', 'STAG', 'FR', 'COLD', 'REXR', 'TRNO', 'EGP',
      'BXP', 'KRC', 'DEI', 'HIW', 'CBRE', 'JLL', 'CWK', 'NMRK', 'MMI',
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
      'MMM', 'JCI', 'CARR', 'TDG', 'HWM', 'AXON', 'LDOS', 'CACI', 'SAIC'
    ]
  },
  chinaADR: {
    label: 'China ADRs',
    description: 'Chinesische Unternehmen an US-Börsen',
    symbols: [
      'BABA', 'JD', 'PDD', 'BIDU', 'NIO', 'XPEV', 'LI', 'BILI', 'TME', 'VIPS',
      'IQ', 'NTES', 'ZTO', 'YUMC', 'TAL', 'EDU', 'QFIN', 'FUTU', 'TIGR',
      'BEKE', 'KC', 'LU', 'YMM', 'MNSO', 'WB', 'BZUN', 'YSG', 'LEGN', 'ZLAB',
      'ONC', 'HTHT', 'ATHM', 'VNET', 'DOYU', 'HUYA', 'GDS', 'API', 'DAO'
    ]
  },
  europe: {
    label: 'Europa (ADRs)',
    description: 'Europäische Unternehmen',
    symbols: [
      // Germany
      'SAP', 'DB', 'SIEGY', 'BASFY', 'BAYRY', 'MBGYY', 'VONOY', 'ADDYY',
      // UK
      'SHEL', 'BP', 'AZN', 'GSK', 'UL', 'RIO', 'BHP', 'HSBC', 'LYG', 'BTI',
      'DEO', 'NVS', 'SNY', 'SONY', 'TM', 'HMC', 'STLA', 'RACE', 'NVO', 'ABBNY',
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
      'PINS', 'SNAP', 'MTCH', 'BMBL', 'YELP', 'GRPN', 'ZG', 'OPEN', 'CVNA',
      'CARG', 'KMX', 'AN', 'ABG', 'LAD', 'SAH', 'GPI', 'PAG', 'RUSHA', 'RUSHB',
      'CELH', 'FIZZ', 'MNST', 'COKE', 'WDFC', 'FRPT', 'MGPI', 'VITL', 'SMPL',
      'PGNY', 'GDRX', 'SDGR', 'CERT', 'HIMS', 'DOCS', 'AMWL', 'TDOC',
      'ENPH', 'SEDG', 'RUN', 'SHLS', 'ARRY', 'SPWR', 'CSIQ', 'JKS',
      'PLUG', 'FCEL', 'BE', 'BLDP', 'BLNK', 'CHPT', 'EVGO', 'LCID', 'RIVN'
    ]
  }
};

/**
 * Unique symbols of the selected categories; unknown ids are ignored
 * @param {Object} categories - Categories by id, e.g. SCAN_CATEGORIES plus the watchlist
 * @param {string[]} categoryIds - Selected category ids
 * @returns {string[]}
 */
export function getSymbolsFromCategories(categories, categoryIds) {
  return [...new Set(categoryIds.flatMap(id => categories[id]?.symbols ?? []))];
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
