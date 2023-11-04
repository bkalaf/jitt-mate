import * as fs from 'graceful-fs';

export const ApparelTaxonomy = {
    accessories: {
        mid: {
            tie: 'tie',
            belt: 'belt',
            cumberbund: 'cumberbund',
            suspenders: 'suspenders',
            wallet: 'wallet'
        },
        head: {
            baseball: 'baseball-cap',
            cowboy: 'cowboy hat',
            fedora: 'fedora',
            skull: 'skull-cap',
            sunglasses: 'sunglasses',
            visor: 'visor'
        },
        hands: {
            gloves: 'gloves',
            mittens: 'mittens',
            work: 'work-gloves',
            watch: 'watch'
        }
    },
    shoes: {
        heeled: {
            'high-heel': 'high-heel',
            stiletto: 'stiletto',
            wedge: 'wedge',
            sandal: 'sandal'
        },
        flats: {
            loafer: 'loafer',
            sandal: 'sandal',
            'flip-flop': 'flip-flop'
        },
        sneakers: {
            athletic: 'athletic sneakers',
            skate: 'skate sneaks',
            'high-top': 'high-top',
            runners: 'running sneakers',
            basketball: 'basketball sneakers'
        },
        boots: {
            cowboy: 'cowboy boots',
            hiking: 'hiking boots',
            work: 'work boots'
        }
    },
    tops: {
        shirts: {
            't-shirt': 't-shirt',
            camisole: 'camisole',
            'tank-top': 'tank-top',
            'tube-top': 'tube-top',
            halter: 'halter-top',
            sleeveless: 'sleeveless shirt',
            wrap: 'wrap',
            tunic: 'tunic'
        },
        jackets: {
            fleece: 'fleece jacket',
            bomber: 'bomber jacket',
            leather: 'leather jacket',
            windbreaker: 'windbreaker',
            trenchcoat: 'trenchcoat',
            raincoat: 'raincoat',
            denim: 'denim jacket',
            hoodie: 'hoodie',
            overcoat: 'overcoat',
            poncho: 'poncho'
        },
        'button-front': {
            polo: 'polo',
            rugby: 'rugby shirt',
            oxford: 'oxford shirt',
            'button-down': 'button-down',
            fitted: 'fitted shirt',
            flannel: 'flannel',
            henley: 'henley',
            hawaiian: 'hawaiian shirt',
            blouse: 'blouse',
            'dress-shirt': 'dress-shirt'
        },
        sweaters: {
            sweater: 'sweater',
            sweatshirt: 'sweatshirt',
            'pull-over': 'pull-over',
            tutleneck: 'turtleneck',
            cardigan: 'cardigan'
        },
        other: {}
    },
    bottoms: {
        'full-length': {
            carpenter: 'carpenter pants',
            cargo: 'cargo pants',
            leather: 'leather pants',
            chinos: 'chinos',
            khakis: 'khakis',
            pleated: 'pleated dress pants',
            fitted: 'fitted pants',
            casual: 'casual pants',
            corduroys: 'corduroys',
            trousers: 'trousers'
        },
        shorts: {
            DEFAULT: 'shorts',
            short: 'short-shorts',
            denim: 'denim shorts',
            board: 'board shorts',
            bermuda: 'bermuda-shorts',
            khaki: 'khaki shorts',
            casual: 'casual shorts',
            bike: 'bike shorts',
            surf: 'surf shorts',
            cargo: 'cargo shorts',
            gym: 'gymshorts'
        },
        jeans: {
            relaxed: 'relaxed fit jeans',
            boot: 'boot cut jeans',
            slim: 'slim fit jeans',
            skinny: 'skinny jeans',
            baggy: 'baggy jeans',
            flare: 'flare cut jeans',
            'slim-boot': 'slim boot cut jeans',
            'bell-bottom': 'bell bottom jeans',
            straight: 'straight cut jeans',
            casual: 'casual jeans'
        },
        other: {
            'cropped-pants': 'cropped pants',
            skort: 'skort',
            capris: 'capri pants',
            'track-pants': 'track pants',
            leggings: 'leggings',
            tights: 'tights',
            sweatpants: 'sweatpants',
            skirt: 'skirt'
        }
    },
    undergarments: {
        socks: {
            athletic: 'atheltic socks',
            mid: 'mid-rise socks',
            crew: 'crew socks',
            ankle: 'ankle socks',
            'knee-high': 'knee-high socks'
        },
        mens: {
            briefs: 'briefs',
            boxers: 'boxers',
            jock: 'jock strap'
        },
        womens: {
            bra: 'bras',
            panties: 'panties',
            stockings: 'stockings',
            'panty-hose': 'panty-hose'
        },
        lingerie: {
            negligee: 'negligee'
        }
    },
    sleepwear: {
        pajamas: {
            top: 'pajama-top',
            bottom: 'pajama-bottom',
            set: 'pajama top & bottom'
        },
        robes: {
            robe: 'robe',
            nightgown: 'nightgown',
            wrap: 'wrap'
        }
    },
    fullbody: {
        dresses: {},
        suits: {
            tuxedo: 'tuxedo',
            'double-breasted': 'double-breasted suit',
            '1-button': 'one-button suit',
            '2-button': 'two-button suit',
            '3-button': 'three-button suit',
            '4-button': 'four-button suit',
            bodysuit: 'bodysuit',
            'pant-suit': 'pant suit'
        },
        overalls: {
            jumpsuit: 'jumpsuit',
            romper: 'romper',
            denim: 'denim overalls',
            bodysuit: 'bodysuit'
        }
    }
};

export type TaxonomyFamily = keyof typeof ApparelTaxonomy;
export type TaxonomyOrder = { [P in TaxonomyFamily]: keyof typeof ApparelTaxonomy[P] }[TaxonomyFamily];
export type TaxonomyGenus =
    | keyof typeof ApparelTaxonomy.accessories.hands
    | keyof typeof ApparelTaxonomy.accessories.head
    | keyof typeof ApparelTaxonomy.accessories.mid
    | keyof typeof ApparelTaxonomy.bottoms['full-length']
    | keyof typeof ApparelTaxonomy.bottoms.jeans
    | keyof typeof ApparelTaxonomy.bottoms.other
    | keyof typeof ApparelTaxonomy.bottoms.shorts
    | keyof typeof ApparelTaxonomy.tops['button-front']
    | keyof typeof ApparelTaxonomy.tops.jackets
    | keyof typeof ApparelTaxonomy.tops.other
    | keyof typeof ApparelTaxonomy.tops.shirts
    | keyof typeof ApparelTaxonomy.tops.sweaters
    | keyof typeof ApparelTaxonomy.shoes.boots
    | keyof typeof ApparelTaxonomy.shoes.flats
    | keyof typeof ApparelTaxonomy.shoes.heeled
    | keyof typeof ApparelTaxonomy.shoes.sneakers
    | keyof typeof ApparelTaxonomy.fullbody.dresses
    | keyof typeof ApparelTaxonomy.fullbody.suits
    | keyof typeof ApparelTaxonomy.fullbody.overalls
    | keyof typeof ApparelTaxonomy.sleepwear.pajamas
    | keyof typeof ApparelTaxonomy.sleepwear.robes
    | keyof typeof ApparelTaxonomy.undergarments.lingerie
    | keyof typeof ApparelTaxonomy.undergarments.mens
    | keyof typeof ApparelTaxonomy.undergarments.womens
    | keyof typeof ApparelTaxonomy.undergarments.socks;

const family = Object.keys(ApparelTaxonomy);
const order = Object.keys(ApparelTaxonomy)
    .map((x) => Object.keys(ApparelTaxonomy[x as keyof typeof ApparelTaxonomy]))
    .reduce((pv, cv) => [...pv, ...cv], []);
const genus = family
    .map((x) => {
        const obj = ApparelTaxonomy[x as keyof typeof ApparelTaxonomy];
        const result = Object.keys(obj).map((y) => obj[y as keyof typeof obj]);
        return result.map((a) => Object.keys(a)).reduce((pv, cv) => [...pv, ...cv], []);
    })
    .reduce((pv, cv) => [...pv, ...cv], []);
console.log(family);
console.log(order);
console.log(genus);
const materializedPath = [Object.keys(ApparelTaxonomy), Object.keys(ApparelTaxonomy).map((k1) => {
    const value1 = ApparelTaxonomy[k1 as keyof typeof ApparelTaxonomy];
    const keys2 = Object.keys(value1);
    const obj1 = keys2.map((k2) => {
        const value2 = value1[k2 as keyof typeof value1];
        const key3 = Object.keys(value2);
        return { [k2]: key3 };
    });
    return {
        [k1]: [keys2, Object.fromEntries(keys2.map((k) => [k, obj1.reduce((pv, cv) => Object.assign(pv, cv), {})[k as any]] as [string, string[]]))]
    };
}).reduce((pv, cv) => Object.assign(pv, cv), {})];

const str = JSON.stringify(
    materializedPath,
    null,
    '\t'
);

console.log(JSON.stringify(materializedPath, null, '\t'));
fs.writeFileSync('/home/bobby/Desktop/jitt/jitt/src/taxonomyPath.json', str);
