import { $css } from './$css';
import { writeFileSync } from 'graceful-fs';

// export const key1 = 'apparelType';
// export const key2 = 'sleeveType';

// console.log(toProperFromCamel(key1))
// console.log(toProperFromCamel(key2));

const testid = $css.testid;

const values = {
    1: testid('ConditionNew'),
    2: testid('ConditionLikeNew'),
    3: testid('ConditionGood'),
    4: testid('ConditionFair'),
    5: testid('ConditionPoor')
};

writeFileSync('/home/bobby/Desktop/jitt/jitt/src/enums/item-condition.json', JSON.stringify(values, null, '\t'))

/*
{
	"mercari": "www.mercari.com",
	"ebay": "www.ebay.com"
}
{
	"closed": null,
	"open": "open-back",
	"u": "u-shape-back",
	"v": "v-shape-back",
	"bare": "bare-back",
	"x": "x-cross-back",
	"bow": "bow-back",
	"strappy": "strappy-back"
}
{
	"hb": "hardback",
	"pb": "paperback",
	"bb": "board-book"
}
{
	"RP": "Rating Pending",
	"E": "Everyone",
	"E10+": "Everyone 10+",
	"T": "Teen",
	"M": "Mature 17+",
	"AO": "Adults Only 18+"
}
{
	"1-button": "one-button-cuff",
	"2-button": "two-button-cuff",
	"rounded": "rounded-cuff",
	"french": "french-cuff",
	"neapolitan": "neopolitan-cuff",
	"angle-cut": "angle-cut-cuff"
}
{
	"AF": "Afghanistan",
	"AX": "Åland Islands",
	"AL": "Albania",
	"DZ": "Algeria",
	"AS": "American Samoa",
	"AD": "Andorra",
	"AO": "Angola",
	"AI": "Anguilla",
	"AQ": "Antarctica",
	"AG": "Antigua and Barbuda",
	"AR": "Argentina",
	"AM": "Armenia",
	"AW": "Aruba",
	"AU": "Australia",
	"AT": "Austria",
	"AZ": "Azerbaijan",
	"BS": "Bahamas",
	"BH": "Bahrain",
	"BD": "Bangladesh",
	"BB": "Barbados",
	"BY": "Belarus",
	"BE": "Belgium",
	"BZ": "Belize",
	"BJ": "Benin",
	"BM": "Bermuda",
	"BT": "Bhutan",
	"BO": "Bolivia",
	"BQ": "Bonaire, Sint Eustatius and Saba",
	"BA": "Bosnia and Herzegovina",
	"BW": "Botswana",
	"BV": "Bouvet Island",
	"BR": "Brazil",
	"IO": "British Indian Ocean Territory",
	"BN": "Brunei Darussalam",
	"BG": "Bulgaria",
	"BF": "Burkina Faso",
	"BI": "Burundi",
	"CV": "Cabo Verde",
	"KH": "Cambodia",
	"CM": "Cameroon",
	"CA": "Canada",
	"KY": "Cayman Islands",
	"CF": "Central African Republic",
	"TD": "Chad",
	"CL": "Chile",
	"CN": "China",
	"CX": "Christmas Island",
	"CC": "Cocos (Keeling) Islands",
	"CO": "Colombia",
	"KM": "Comoros",
	"CD": "Congo",
	"CG": "Congo",
	"CK": "Cook Islands",
	"CR": "Costa Rica",
	"CI": "Côte d'Ivoire",
	"HR": "Croatia",
	"CU": "Cuba",
	"CW": "Curaçao",
	"CY": "Cyprus",
	"CZ": "Czechia",
	"DK": "Denmark",
	"DJ": "Djibouti",
	"DM": "Dominica",
	"DO": "Dominican Republic",
	"EC": "Ecuador",
	"EG": "Egypt",
	"SV": "El Salvador",
	"GQ": "Equatorial Guinea",
	"ER": "Eritrea",
	"EE": "Estonia",
	"SZ": "Eswatini",
	"ET": "Ethiopia",
	"FK": "Falkland Islands",
	"FO": "Faroe Islands",
	"FJ": "Fiji",
	"FI": "Finland",
	"FR": "France",
	"GF": "French Guiana",
	"PF": "French Polynesia",
	"TF": "French Southern Territories",
	"GA": "Gabon",
	"GM": "Gambia",
	"GE": "Georgia",
	"DE": "Germany",
	"GH": "Ghana",
	"GI": "Gibraltar",
	"GR": "Greece",
	"GL": "Greenland",
	"GD": "Grenada",
	"GP": "Guadeloupe",
	"GU": "Guam",
	"GT": "Guatemala",
	"GG": "Guernsey",
	"GN": "Guinea",
	"GW": "Guinea-Bissau",
	"GY": "Guyana",
	"HT": "Haiti",
	"HM": "Heard Island and McDonald Islands",
	"VA": "Holy See",
	"HN": "Honduras",
	"HK": "Hong Kong",
	"HU": "Hungary",
	"IS": "Iceland",
	"IN": "India",
	"ID": "Indonesia",
	"IR": "Iran",
	"IQ": "Iraq",
	"IE": "Ireland",
	"IM": "Isle of Man",
	"IL": "Israel",
	"IT": "Italy",
	"JM": "Jamaica",
	"JP": "Japan",
	"JE": "Jersey",
	"JO": "Jordan",
	"KZ": "Kazakhstan",
	"KE": "Kenya",
	"KI": "Kiribati",
	"KP": "North Korea",
	"KR": "South Korea",
	"KW": "Kuwait",
	"KG": "Kyrgyzstan",
	"LA": "Laos",
	"LV": "Latvia",
	"LB": "Lebanon",
	"LS": "Lesotho",
	"LR": "Liberia",
	"LY": "Libya",
	"LI": "Liechtenstein",
	"LT": "Lithuania",
	"LU": "Luxembourg",
	"MO": "Macao [s]",
	"MK": "North Macedonia",
	"MG": "Madagascar",
	"MW": "Malawi",
	"MY": "Malaysia",
	"MV": "Maldives",
	"ML": "Mali",
	"MT": "Malta",
	"MH": "Marshall Islands",
	"MQ": "Martinique",
	"MR": "Mauritania",
	"MU": "Mauritius",
	"YT": "Mayotte",
	"MX": "Mexico",
	"FM": "Micronesia",
	"MD": "Moldova",
	"MC": "Monaco",
	"MN": "Mongolia",
	"ME": "Montenegro",
	"MS": "Montserrat",
	"MA": "Morocco",
	"MZ": "Mozambique",
	"MM": "Myanmar",
	"NA": "Namibia",
	"NR": "Nauru",
	"NP": "Nepal",
	"NL": "Netherlands",
	"NC": "New Caledonia",
	"NZ": "New Zealand",
	"NI": "Nicaragua",
	"NE": "Niger",
	"NG": "Nigeria",
	"NU": "Niue",
	"NF": "Norfolk Island",
	"MP": "Northern Mariana Islands",
	"NO": "Norway",
	"OM": "Oman",
	"PK": "Pakistan",
	"PW": "Palau",
	"PS": "Palestine",
	"PA": "Panama",
	"PG": "Papua New Guinea",
	"PY": "Paraguay",
	"PE": "Peru",
	"PH": "Philippines",
	"PN": "Pitcairn",
	"PL": "Poland",
	"PT": "Portugal",
	"PR": "Puerto Rico",
	"QA": "Qatar",
	"RE": "Réunion",
	"RO": "Romania",
	"RU": "Russia",
	"RW": "Rwanda",
	"BL": "Saint Barthélemy",
	"SH": "Saint Helena, Ascension and Tristan da Cunha",
	"KN": "Saint Kitts and Nevis",
	"LC": "Saint Lucia",
	"MF": "Saint Martin",
	"PM": "Saint Pierre and Miquelon",
	"VC": "Saint Vincent and the Grenadines",
	"WS": "Samoa",
	"SM": "San Marino",
	"ST": "Sao Tome and Principe",
	"SA": "Saudi Arabia",
	"SN": "Senegal",
	"RS": "Serbia",
	"SC": "Seychelles",
	"SL": "Sierra Leone",
	"SG": "Singapore",
	"SX": "Sint Maarten",
	"SK": "Slovakia",
	"SI": "Slovenia",
	"SB": "Solomon Islands",
	"SO": "Somalia",
	"ZA": "South Africa",
	"GS": "South Georgia and the South Sandwich Islands",
	"SS": "South Sudan",
	"ES": "Spain",
	"LK": "Sri Lanka",
	"SD": "Sudan",
	"SR": "Suriname",
	"SJ": "Svalbard and Jan Mayen",
	"SE": "Sweden",
	"CH": "Switzerland",
	"SY": "Syria",
	"TW": "Taiwan",
	"TJ": "Tajikistan",
	"TZ": "Tanzania",
	"TH": "Thailand",
	"TL": "Timor-Leste",
	"TG": "Togo",
	"TK": "Tokelau",
	"TO": "Tonga",
	"TT": "Trinidad and Tobago",
	"TN": "Tunisia",
	"TR": "Turkey",
	"TM": "Turkmenistan",
	"TC": "Turks and Caicos Islands",
	"TV": "Tuvalu",
	"UG": "Uganda",
	"UA": "Ukraine",
	"AE": "United Arab Emirates",
	"GB": "United Kingdom",
	"UM": "United States Minor Outlying Islands",
	"US": "United States",
	"UY": "Uruguay",
	"UZ": "Uzbekistan",
	"VU": "Vanuatu",
	"VE": "Venezuela",
	"VN": "Vietnam",
	"VG": "Virgin Islands (British)",
	"VI": "Virgin Islands (U.S.)",
	"WF": "Wallis and Futuna",
	"EH": "Western Sahara",
	"YE": "Yemen",
	"ZM": "Zambia",
	"ZW": "Zimbabwe"
}
{
	"classic": "classic-collar",
	"button-down": "button-down-collar",
	"spread": "spread-collar",
	"club": "club-collar",
	"mandarin": "mandarin-collar",
	"wing-tip": "wing-tip-collar"
}
{
	"1": "[data-testid=\"ConditionNew\"]",
	"2": "[data-testid=\"ConditionLikeNew\"]",
	"3": "[data-testid=\"ConditionGood\"]",
	"4": "[data-testid=\"ConditionFair\"]",
	"5": "[data-testid=\"ConditionPoor\"]"
}
{
	"A": "acrylic",
	"C": "cotton",
	"CS": "cashmere",
	"D": "denim",
	"E": "polyurethane",
	"H": "leather",
	"K": "silk",
	"L": "linen",
	"M": "modal",
	"N": "nylon",
	"OC": "organic cotton",
	"P": "polyester",
	"R": "rayon",
	"U": "suede",
	"W": "wool",
	"X": "spandex"
}
{
	"CD": "CD",
	"VHS": "VHS",
	"DVD": "DVD",
	"BluRay": "Blu-Ray"
}
[
	{
		"min": 0,
		"max": 0.25,
		"media-mail": {
			"price": 4.3,
			"carrier": "USPS Media Mail",
			"id": 1635
		},
		"standard": {
			"price": 4.3,
			"carrier": "USPS Ground Advantage",
			"id": 1581
		}
	},
	{
		"min": 0.25,
		"max": 0.5,
		"media-mail": {
			"price": 4.3,
			"carrier": "USPS Media Mail",
			"id": 1635
		},
		"standard": {
			"price": 4.99,
			"carrier": "USPS Ground Advantage",
			"id": 1582
		}
	},
	{
		"min": 0.5,
		"max": 1,
		"media-mail": {
			"price": 4.3,
			"carrier": "USPS Media Mail",
			"id": 1635
		},
		"standard": {
			"price": 7.4,
			"carrier": "USPS Ground Advantage",
			"id": 1583
		}
	},
	{
		"min": 1,
		"max": 2,
		"media-mail": {
			"price": 5,
			"carrier": "USPS Media Mail",
			"id": 1636
		},
		"standard": {
			"price": 7.99,
			"carrier": "UPS SurePost",
			"id": 1661
		}
	},
	{
		"min": 2,
		"max": 3,
		"media-mail": {
			"price": 5.7,
			"carrier": "USPS Media Mail",
			"id": 1637
		},
		"standard": {
			"price": 7.99,
			"carrier": "UPS SurePost",
			"id": 1662
		}
	},
	{
		"min": 3,
		"max": 4,
		"media-mail": {
			"price": 6.4,
			"carrier": "USPS Media Mail",
			"id": 1638
		},
		"standard": {
			"price": 10.59,
			"carrier": "UPS SurePost",
			"id": 1663
		}
	},
	{
		"min": 4,
		"max": 5,
		"media-mail": {
			"price": 7.1,
			"carrier": "USPS Media Mail",
			"id": 1639
		},
		"standard": {
			"price": 10.99,
			"carrier": "FedEx Ground Economy",
			"id": 1580
		}
	},
	{
		"min": 5,
		"max": 6,
		"media-mail": {
			"price": 8.65,
			"carrier": "USPS Media Mail",
			"id": 1640
		},
		"standard": {
			"price": 13.5,
			"carrier": "UPS Ground",
			"id": 1610
		}
	},
	{
		"min": 6,
		"max": 7,
		"media-mail": {
			"price": 9.35,
			"carrier": "USPS Media Mail",
			"id": 1641
		},
		"standard": {
			"price": 13.5,
			"carrier": "UPS Ground",
			"id": 1611
		}
	},
	{
		"min": 7,
		"max": 8,
		"media-mail": {
			"price": 10.05,
			"carrier": "USPS Media Mail",
			"id": 1642
		},
		"standard": {
			"price": 14,
			"carrier": "UPS Ground",
			"id": 1612
		}
	},
	{
		"min": 8,
		"max": 9,
		"media-mail": {
			"price": 10.75,
			"carrier": "USPS Media Mail",
			"id": 1643
		},
		"standard": {
			"price": 14,
			"carrier": "UPS Ground",
			"id": 1613
		}
	},
	{
		"min": 9,
		"max": 10,
		"media-mail": {
			"price": 11.45,
			"carrier": "USPS Media Mail",
			"id": 1644
		},
		"standard": {
			"price": 17.25,
			"carrier": "UPS Ground",
			"id": 1614
		}
	},
	{
		"min": 10,
		"max": 11,
		"media-mail": {
			"price": 14.35,
			"carrier": "USPS Media Mail",
			"id": 1645
		},
		"standard": {
			"price": 17.25,
			"carrier": "UPS Ground",
			"id": 1615
		}
	},
	{
		"min": 11,
		"max": 12,
		"media-mail": {
			"price": 15.05,
			"carrier": "USPS Media Mail",
			"id": 1646
		},
		"standard": {
			"price": 17.25,
			"carrier": "UPS Ground",
			"id": 1616
		}
	},
	{
		"min": 12,
		"max": 13,
		"media-mail": {
			"price": 15.75,
			"carrier": "USPS Media Mail",
			"id": 1647
		},
		"standard": {
			"price": 20,
			"carrier": "UPS Ground",
			"id": 1617
		}
	},
	{
		"min": 13,
		"max": 14,
		"media-mail": {
			"price": 16.45,
			"carrier": "USPS Media Mail",
			"id": 1648
		},
		"standard": {
			"price": 20,
			"carrier": "UPS Ground",
			"id": 1618
		}
	},
	{
		"min": 14,
		"max": 15,
		"media-mail": {
			"price": 16.45,
			"carrier": "USPS Media Mail",
			"id": 1649
		},
		"standard": {
			"price": 25,
			"carrier": "FedEx Home",
			"id": 1565
		}
	},
	{
		"min": 15,
		"max": 16,
		"media-mail": {
			"price": 17.15,
			"carrier": "USPS Media Mail",
			"id": 1650
		},
		"standard": {
			"price": 28,
			"carrier": "FedEx Home",
			"id": 1566
		}
	},
	{
		"min": 16,
		"max": 17,
		"media-mail": {
			"price": 17.85,
			"carrier": "USPS Media Mail",
			"id": 1651
		},
		"standard": {
			"price": 28,
			"carrier": "FedEx Home",
			"id": 1567
		}
	},
	{
		"min": 17,
		"max": 18,
		"media-mail": {
			"price": 18.55,
			"carrier": "USPS Media Mail",
			"id": 1652
		},
		"standard": {
			"price": 28,
			"carrier": "FedEx Home",
			"id": 1568
		}
	},
	{
		"min": 18,
		"max": 19,
		"media-mail": {
			"price": 19.25,
			"carrier": "USPS Media Mail",
			"id": 1653
		},
		"standard": {
			"price": 28,
			"carrier": "FedEx Home",
			"id": 1569
		}
	},
	{
		"min": 19,
		"max": 20,
		"media-mail": {
			"price": 19.95,
			"carrier": "USPS Media Mail",
			"id": 1654
		},
		"standard": {
			"price": 30,
			"carrier": "UPS Ground",
			"id": 1624
		}
	},
	{
		"min": 20,
		"max": 30,
		"standard": {
			"price": 35,
			"carrier": "UPS Ground",
			"id": 1625
		}
	},
	{
		"min": 30,
		"max": 40,
		"standard": {
			"price": 60,
			"carrier": "UPS Ground",
			"id": 1626
		}
	},
	{
		"min": 40,
		"max": 50,
		"standard": {
			"price": 85,
			"carrier": "UPS Ground",
			"id": 1627
		}
	}
]
{
	"G": "G",
	"PG": "PG",
	"PG-13": "PG-13",
	"R": "R",
	"X": "X",
	"NR": "NR"
}
{
	"asymmetric": "asymmetric",
	"boat": "boatneck",
	"collar": "collared",
	"cowl": "cowl neck",
	"crew": "crew neck",
	"halter": "halter",
	"illusion": "illusion",
	"jewel": "jewel",
	"keyhole": "keyhole",
	"ots": "off-the-shoulder",
	"plunging": "plunging",
	"queen": "queen anne",
	"low": "low-neck",
	"scallop": "scallop",
	"scoop": "scoop neck",
	"semi": "semi-sweetheart",
	"spaghetti": "spaghetti strap",
	"square": "square",
	"strapless": "strapless",
	"ss": "strapless sweetheart",
	"sweet": "sweetheart",
	"surplice": "surplice",
	"turtle": "turtleneck",
	"v": "v-neck"
}
{
	"F": "film",
	"TV": "tv-show",
	"M": "music"
}

*/