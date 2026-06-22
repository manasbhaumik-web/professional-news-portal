export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export const COUNTRY_FEEDS: Record<string, {name: string, url: string}[]> = {
  "India": [
    { name: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss" },
    { name: "NDTV", url: "https://feeds.feedburner.com/ndtvnews-top-stories" }
  ],
  "United Kingdom": [
    { name: "BBC UK", url: "http://feeds.bbci.co.uk/news/uk/rss.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/uk/rss" }
  ],
  "United States": [
    { name: "NY Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/US.xml" },
    { name: "NPR", url: "https://feeds.npr.org/1001/rss.xml" }
  ],
  "Canada": [
    { name: "CBC News", url: "https://www.cbc.ca/cmlink/rss-topstories" }
  ],
  "Australia": [
    { name: "ABC News", url: "https://www.abc.net.au/news/feed/51120/rss.xml" }
  ],
  "China": [
    { name: "SCMP", url: "https://www.scmp.com/rss/2/feed" }
  ],
  "Japan": [
    { name: "Japan Times", url: "https://www.japantimes.co.jp/news/feed/" }
  ],
  "Malaysia": [
    { name: "Free Malaysia Today", url: "https://www.freemalaysiatoday.com/feed/" },
    { name: "Malay Mail", url: "https://www.malaymail.com/feed/rss" }
  ],
  "South Africa": [
    { name: "News24", url: "http://feeds.news24.com/articles/news24/SouthAfrica/rss" }
  ],
  "France": [
    { name: "France 24", url: "https://www.france24.com/en/france/rss" }
  ],
  "Germany": [
    { name: "DW News", url: "https://rss.dw.com/rdf/rss-en-ger" }
  ]
};

export const FALLBACK_CODES: Record<string, string> = {
  "Argentina": "es-419&gl=AR&ceid=AR:es-419",
  "Brazil": "pt-BR&gl=BR&ceid=BR:pt-419",
  "Indonesia": "id&gl=ID&ceid=ID:id",
  "Italy": "it&gl=IT&ceid=IT:it",
  "Mexico": "es-419&gl=MX&ceid=MX:es-419",
  "Nigeria": "en-NG&gl=NG&ceid=NG:en",
  "Russia": "ru&gl=RU&ceid=RU:ru",
  "Saudi Arabia": "ar&gl=SA&ceid=SA:ar",
  "South Korea": "ko&gl=KR&ceid=KR:ko",
  "Spain": "es&gl=ES&ceid=ES:es",
  "Turkey": "tr&gl=TR&ceid=TR:tr"
};
