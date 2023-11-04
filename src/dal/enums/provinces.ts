export interface Provinces {
    AR: string;
    AK: string;
    AL: string;
    AZ: string;
    CA: string;
    CO: string;
    CT: string;
    DE: string;
    FL: string;
    GA: string;
    HI: string;
    IA: string;
    ID: string;
    IL: string;
    IN: string;
    KS: string;
    KY: string;
    LA: string;
    MA: string;
    ME: string;
    MT: string;
    MN: string;
    MO: string;
    MI: string;
    MD: string;
    MS: string;
    NV: string;
    NE: string;
    NH: string;
    NY: string;
    NM: string;
    NJ: string;
    NC: string;
    ND: string;
    OH: string;
    OK: string;
    OR: string;
    PA: string;
    RI: string;
    SD: string;
    SC: string;
    TN: string;
    TX: string;
    UT: string;
    VA: string;
    VT: string;
    WV: string;
    WY: string;
    WI: string;
    WA: string;
    DC: string;
    ON: string;
    QC: string;
    MB: string;
    NL: string;
    BC: string;
    YT: string;
    NT: string;
    PE: string;
    NS: string;
    AB: string;
    SK: string;
    NU: string;
    NB: string;
    PR: string;
}

export const Provinces = {
    AR: 'Arkansas',
    AK: 'Alaska',
    AL: 'Alabama',
    AZ: 'Arizona',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Deleware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    IA: 'Iowa',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    MA: 'Massachusettes',
    ME: 'Maine',
    MT: 'Montana',
    MN: 'Minnesota',
    MO: 'Missouri',
    MI: 'Michigan',
    MD: 'Maryland',
    MS: 'Mississippi',
    NV: 'Nevada',
    NE: 'Nebraska',
    NH: 'New Hampshire',
    NY: 'New York',
    NM: 'New Mexico',
    NJ: 'New Jersey',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SD: 'South Dakota',
    SC: 'South Carolina',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VA: 'Virginia',
    VT: 'Vermont',
    WV: 'West Virginia',
    WY: 'Wyoming',
    WI: 'Wisconsin',
    WA: 'Washington',
    DC: 'District of Columbia',
    ON: 'Ontario',
    QC: 'Quebec',
    MB: 'Manitoba',
    NL: 'Newfoundland and Labrador',
    BC: 'British Columbia',
    YT: 'Yukon',
    NT: 'Northwest Territory',
    PE: 'Prince Edward Island',
    NS: 'Nova Scotia',
    AB: 'Alberta',
    SK: 'Sasketchewan',
    NU: 'Nunavut',
    NB: 'New Brunswick',
    PR: 'Puerto Rico'
};

export type ProvincesKey = keyof Provinces;

export function lookupByLongName(str?: string): Optional<ProvincesKey> {
    return str == null ? undefined : Object.fromEntries(Object.entries(Provinces).map(([k, v]) => [v.toUpperCase(), k] as [string, string]))[str.toUpperCase()] as ProvincesKey;
}