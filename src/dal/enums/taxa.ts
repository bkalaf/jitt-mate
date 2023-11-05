import { splitAt } from '../../common/text/splitAt';
import { pluralize } from './pluralize';
import { toCamelCase } from './toCamelCase';

export const Taxa = {
    media: {
        children: ['book', 'video', 'audio'],
        map: {
            book: {
                children: ['textbook', 'cookbook', 'history', 'fiction', 'religion', 'self-improvement', 'travel', 'reference', 'fantasy', 'teen', 'technology', 'business', 'kids'],
                map: {
                    textbook: ['science', 'literature', 'social-sciences', 'mathematics'],
                    cookbook: ['hardback', 'paperback'],
                    fiction: ['hardback', 'paperback'],
                    religion: ['bibles', 'other'],
                    travel: ['coffe-table'],
                    reference: ['dictionary', 'thesarus', 'encyclopedia'],
                    fantasy: [],
                    teen: [],
                    technology: [],
                    business: [],
                    kids: ['hardback', 'paperback', 'board-book'],
                    politics: []
                }
            },
            video: {
                children: ['vhs', 'dvd', 'bluray'],
                map: {
                    vhs: ['tv', 'movie'],
                    dvd: ['tv', 'movie'],
                    bluray: ['tv', 'movie']
                }
                // map: {
                //     'tv-show': {
                //         children: ['comedy', 'drama', 'action', 'documentary', 'family', 'horror', 'sci-fi', 'classic']
                //     },
                //     movie: {
                //         children: ['comedy', 'drama', 'action', 'documentary', 'family', 'horror', 'sci-fi', 'classic']
                //     }
                // }
            },
            audio: {
                children: ['cd'],
                map: {
                    cd: ['album']
                }
            }
        }
    },
    apparel: {
        children: ['accessories', 'shoes', 'tops', 'bottoms', 'undergarments', 'sleepwear', 'outfits'],
        map: {
            accessories: {
                children: ['mid', 'head', 'hands'],
                map: {
                    mid: ['tie', 'belt', 'cumberbund', 'suspenders', 'wallet'],
                    head: ['baseball', 'cowboy', 'fedora', 'skull', 'sunglasses', 'visor'],
                    hands: ['gloves', 'mittens', 'work', 'watch']
                }
            },
            shoes: {
                children: ['heeled', 'flats', 'sneakers', 'boots'],
                map: {
                    heeled: ['high-heel', 'stiletto', 'wedge', 'sandal'],
                    flats: ['loafer', 'sandal', 'flip-flop'],
                    sneakers: ['athletic', 'skate', 'high-top', 'runners', 'basketball'],
                    boots: ['cowboy', 'hiking', 'work']
                }
            },
            tops: {
                children: ['shirts', 'jackets', 'button-front', 'sweaters', 'other'],
                map: {
                    shirts: ['t-shirt', 'camisole', 'tank-top', 'tube-top', 'halter', 'sleeveless', 'wrap', 'tunic'],
                    jackets: ['fleece', 'bomber', 'leather', 'windbreaker', 'trenchcoat', 'raincoat', 'denim', 'hoodie', 'overcoat', 'poncho'],
                    'button-front': ['polo', 'rugby', 'oxford', 'button-down', 'fitted', 'flannel', 'henley', 'hawaiian', 'blouse', 'dress-shirt'],
                    sweaters: ['sweater', 'sweatshirt', 'pull-over', 'tutleneck', 'cardigan'],
                    other: []
                }
            },
            bottoms: {
                children: ['full-length', 'shorts', 'jeans', 'other'],
                map: {
                    'full-length': ['carpenter', 'cargo', 'leather', 'chinos', 'khakis', 'pleated', 'fitted', 'casual', 'corduroys', 'trousers'],
                    shorts: ['DEFAULT', 'short', 'denim', 'board', 'bermuda', 'khaki', 'casual', 'bike', 'surf', 'cargo', 'gym'],
                    jeans: ['relaxed', 'boot', 'slim', 'skinny', 'baggy', 'flare', 'slim-boot', 'bell-bottom', 'straight', 'casual'],
                    other: ['cropped-pants', 'skort', 'capris', 'track-pants', 'leggings', 'tights', 'sweatpants', 'skirt']
                }
            },
            undergarments: {
                children: ['socks', 'mens', 'womens', 'lingerie'],
                map: {
                    socks: ['athletic', 'mid', 'crew', 'ankle', 'knee-high'],
                    mens: ['briefs', 'boxers', 'jock'],
                    womens: ['bra', 'panties', 'stockings', 'panty-hose'],
                    lingerie: ['negligee']
                }
            },
            outfits: {
                children: ['dresses', 'suits', 'overalls', 'sleepwear'],
                map: {
                    dresses: [],
                    suits: ['tuxedo', 'double-breasted', '1-button', '2-button', '3-button', '4-button', 'bodysuit', 'pant-suit'],
                    overalls: ['jumpsuit', 'romper', 'denim', 'bodysuit'],
                    sleepwear: ['robe', 'nightgown', 'pajama set', 'pajama top', 'pajama bottom']
                }
            }
        }
    }
};

export type Phylum = 'media' | 'apparel';

export type ApparelKlass = 'mens' | 'womens' | 'boys' | 'girls' | 'infants' | 'toddler';
export type MediaKlass = 'video' | 'video-game' | 'audio' | 'book';
export type Klass = ApparelKlass | MediaKlass;

export type ApparelAdultOrder = 'tops' | 'bottoms' | 'undergarments' | 'outfits' | 'shoes' | 'accessories';
export type ApparelKidsOrder = '0-24mos' | '4+' | '2T-5T';
export type ApparelOrder = ApparelAdultOrder | ApparelKidsOrder;

export type MediaVideoOrder = 'dvd' | 'blu-ray' | 'vhs';
export type MediaAudioOrder = 'cd';
export type MediaGameOrder = 'n64' | 'snes' | 'gameboy' | 'gameboy-advance' | 'ps1' | 'ps2' | 'ps3' | 'ps4' | 'nintendo-wii' | 'nintendo' | 'nintendo-ds';
export type MediaBookOrder = 'textbook' | 'cookbook' | 'reference' | 'fiction' | 'nonfiction' | 'religion';
export type MediaOrder = MediaVideoOrder | MediaBookOrder | MediaAudioOrder | MediaGameOrder;
export type Order = ApparelOrder | MediaOrder;

type TaxaNode<T extends Record<string, any>> = {
    (): string;
} & T;
export function toNode(name: string): string;
export function toNode<T extends Record<string, any>>(name: string, obj: T): TaxaNode<T>;
export function toNode<T extends Record<string, any>>(name: string, obj?: T): string | TaxaNode<T> {
    if (obj == null) return toCamelCase(pluralize(name)) as string;
    return Object.assign(() => toCamelCase(pluralize(name)), obj) as TaxaNode<T>;
}
// const toNode2= (name: string) => (obj?: Record<any, any>) => obj == null ? name : Object.assign(() => name, obj);
const taxonomy = {
    apparel: toNode('apparel', {
        mens: toNode('men', {
            tops: toNode('top', {
                shirts: toNode('shirt', {
                    tShirts: toNode('tShirt'),
                    camisoles: toNode('camisole'),
                    sleeveless: toNode('sleevelessShirt'),
                    tankTops: toNode('tankTop'),
                    tubeTops: toNode('tubeTop'),
                    halters: toNode('halterTop')
                }),
                jackets: toNode('jacket', {
                    windbreakers: toNode('windbreaker'),
                    fleeces: toNode('fleeceJacket'),
                    bombers: toNode('bomberJacket'),
                    raincoats: toNode('raincoat'),
                    trenchcoats: toNode('trenchcoat'),
                    leather: toNode('leatherJacket'),
                    hoodies: toNode('hoodie'),
                    denim: toNode('denimJacket'),
                    overcoats: toNode('overcoat'),
                    ponchos: toNode('poncho')
                }),
                buttonFronts: toNode('buttonFront', {
                    buttonDowns: toNode('buttonDown'),
                    dress: toNode('dressShirt'),
                    fitted: toNode('fittedShirt'),
                    flannels: toNode('flannelShirt'),
                    blouses: toNode('blouse'),
                    henleys: toNode('henley'),
                    hawaiians: toNode('hawaiianShirt'),
                    oxfords: toNode('oxfordShirt'),
                    rugbys: toNode('rugbyShirt'),
                    polos: toNode('polo')
                }),
                sweaters: toNode('sweater', {
                    '': toNode('sweater'),
                    turtleNecks: toNode('turtleNeck'),
                    pullOvers: toNode('pullOver'),
                    cardigans: 'cardigan',
                    sweatshirts: 'sweatshirt'
                }),
                other: toNode('other', {
                    tunics: toNode('tunic'),
                    wraps: toNode('wrap'),
                    jerseys: toNode('jersey')
                })
            }),
            bottoms: toNode('bottom', {
                pants: toNode('pants', {
                    carpenter: toNode('carpenterPant'),
                    cargo: toNode('cargoPant'),
                    leather: toNode('leatherPant'),
                    chino: toNode('chino'),
                    khaki: toNode('khaki'),
                    pleated: toNode('pleatedPant'),
                    fitted: toNode('fittedPant'),
                    casual: toNode('casualPant'),
                    corduroy: toNode('corduroy'),
                    trouser: toNode('trouser')
                }),
                shorts: toNode('shorts', {
                    '': toNode('short'),
                    denim: toNode('denimShort'),
                    board: toNode('boardShort'),
                    surf: toNode('surfShort'),
                    khaki: toNode('khakiShort'),
                    bermuda: toNode('BermudaShort'),
                    cargo: toNode('cargoShort'),
                    casual: toNode('casualShort'),
                    bike: toNode('bikeShort'),
                    gym: toNode('gymShort')
                }),
                jeans: toNode('jeans', {
                    relaxed: toNode('relaxedFitJean'),
                    bootCut: toNode('bootCutJean'),
                    slimBoot: toNode('slimBootCutJean'),
                    slim: toNode('slimFitJean'),
                    skinny: toNode('skinnyJean'),
                    flare: toNode('flareCutJean'),
                    bellBottom: toNode('bellBottom'),
                    straight: toNode('straightFitJean'),
                    casual: toNode('casualJean'),
                    baggy: toNode('baggyJean')
                }),
                other: toNode('other', {
                    croppedPant: toNode('croppedPant'),
                    skort: toNode('skort'),
                    capri: toNode('capri'),
                    legging: toNode('legging'),
                    trackPant: toNode('trackPant'),
                    trackSuit: toNode('trackSuit'),
                    sweatPant: toNode('sweatPant'),
                    tight: toNode('tight'),
                    skirt: toNode('skirt')
                })
            }),
            footwear: toNode('footwear', {
                other: toNode('other', {
                    speciality: toNode('specialityShoe'),
                    work: toNode('workShoe'),
                    fashion: toNode('fashionShoe'),
                    safety: toNode('safetyShoe')
                }),
                boots: toNode('boot', {
                    workBoot: toNode('workBoot'),
                    cowboy: toNode('cowboyBoot'),
                    hiking: toNode('hikingBoot')
                }),
                sneaker: toNode('sneaker', {
                    athletic: toNode('athleticSneaker'),
                    skate: toNode('skateSneaker'),
                    highTops: toNode('highTops'),
                    runner: toNode("runner'sSneaker"),
                    basketball: toNode('basketballSneaker'),
                    golf: toNode('golfShoe'),
                    cleat: toNode('cleat')
                }),
                withHeel: toNode('withHeel', {
                    highHeel: toNode('highHeel'),
                    wedge: toNode('wedge'),
                    sandal: toNode('heeledsandal'),
                    stiletto: toNode('stiletto')
                }),
                withoutHeel: toNode('withoutHeel', {
                    loafer: toNode('loader'),
                    derby: toNode('derby'),
                    oxford: toNode('oxford'),
                    sandal: toNode('sandal'),
                    flipFlop: toNode('flipFlop'),
                    mule: toNode('mule'),
                    clog: toNode('clog'),
                    dressFlat: toNode('dressFlat')
                })
            }),
            undergarmet: toNode('undergarment', {
                socks: toNode('socks', {
                    athletic: toNode('athleticSock'),
                    crew: toNode('crewSock'),
                    ankle: toNode('ankelSock'),
                    kneeHigh: toNode('kneeHighSock'),
                    mid: toNode('midSock')
                }),
                men: toNode('men', {
                    brief: toNode('brief'),
                    boxer: toNode('boxer'),
                    jock: toNode('jock')
                }),
                women: toNode('women', {
                    bra: toNode('bra'),
                    panty: toNode('panty'),
                    stocking: toNode('stocking'),
                    pantyHose: toNode('pantyHose')
                }),
                lingerie: toNode('lingerie', {
                    negligee: toNode('negligee')
                })
            }),
            accessory: toNode('accessory', {
                mid: toNode('mid', {
                    belt: toNode('belt'),
                    suspender: toNode('suspender'),
                    bowtie: toNode('bowtie'),
                    necktie: toNode('necktie'),
                    wallet: toNode('wallet')
                }),
                head: toNode('head', {
                    ballCap: toNode('baseballCap'),
                    cowboy: toNode('cowboyHat'),
                    fedora: toNode('fedora'),
                    skullCap: toNode('skullCap'),
                    sunglasses: toNode('sunglasses'),
                    headband: toNode('headband'),
                    visor: toNode('visor')
                }),
                hand: toNode('hand', {
                    glove: toNode('glove'),
                    mitten: toNode('mitten'),
                    utilityGlove: toNode('utilityGlove'),
                    watch: toNode('watch')
                })
            }),
            outfits: toNode('outfit', {
                dresses: toNode('dress'),
                suits: toNode('suit', {
                    tuxedo: toNode('tuxedo'),
                    doubleBreasted: toNode('double-breasted'),
                    oneButton: toNode('one-button'),
                    twoButton: toNode('two-button'),
                    threeButton: toNode('three-button'),
                    fourButton: toNode('four-button')
                }),
                overall: toNode('overalls', {
                    jumpsuit: toNode('jumpsuit'),
                    rompers: toNode('romper'),
                    denim: toNode('denim overall'),
                    bodysuit: toNode('bodysuit')
                }),
                sleepwear: toNode('sleepwear', {
                    pajamaBoth: toNode('pajama top & bottom'),
                    pajamaTop: toNode('pajama top'),
                    pajamaBottom: toNode('pajama bottom'),
                    robe: toNode('robe'),
                    nightgown: toNode('nightgown')
                })
            })
        }),
        womens: toNode('women', {
            tops: toNode('top', {
                shirts: toNode('shirt', {
                    tShirts: toNode('tShirt'),
                    camisoles: toNode('camisole'),
                    sleeveless: toNode('sleevelessShirt'),
                    tankTops: toNode('tankTop'),
                    tubeTops: toNode('tubeTop'),
                    halters: toNode('halterTop')
                }),
                jackets: toNode('jacket', {
                    windbreakers: toNode('windbreaker'),
                    fleeces: toNode('fleeceJacket'),
                    bombers: toNode('bomberJacket'),
                    raincoats: toNode('raincoat'),
                    trenchcoats: toNode('trenchcoat'),
                    leather: toNode('leatherJacket'),
                    hoodies: toNode('hoodie'),
                    denim: toNode('denimJacket'),
                    overcoats: toNode('overcoat'),
                    ponchos: toNode('poncho')
                }),
                buttonFronts: toNode('buttonFront', {
                    buttonDowns: toNode('buttonDown'),
                    dress: toNode('dressShirt'),
                    fitted: toNode('fittedShirt'),
                    flannels: toNode('flannelShirt'),
                    blouses: toNode('blouse'),
                    henleys: toNode('henley'),
                    hawaiians: toNode('hawaiianShirt'),
                    oxfords: toNode('oxfordShirt'),
                    rugbys: toNode('rugbyShirt'),
                    polos: toNode('polo')
                }),
                sweaters: toNode('sweater', {
                    '': toNode('sweater'),
                    turtleNecks: toNode('turtleNeck'),
                    pullOvers: toNode('pullOver'),
                    cardigans: 'cardigan',
                    sweatshirts: 'sweatshirt'
                }),
                other: toNode('other', {
                    tunics: toNode('tunic'),
                    wraps: toNode('wrap'),
                    jerseys: toNode('jersey')
                })
            }),
            bottoms: toNode('bottom', {
                pants: toNode('pants', {
                    carpenter: toNode('carpenterPant'),
                    cargo: toNode('cargoPant'),
                    leather: toNode('leatherPant'),
                    chino: toNode('chino'),
                    khaki: toNode('khaki'),
                    pleated: toNode('pleatedPant'),
                    fitted: toNode('fittedPant'),
                    casual: toNode('casualPant'),
                    corduroy: toNode('corduroy'),
                    trouser: toNode('trouser')
                }),
                shorts: toNode('shorts', {
                    '': toNode('short'),
                    denim: toNode('denimShort'),
                    board: toNode('boardShort'),
                    surf: toNode('surfShort'),
                    khaki: toNode('khakiShort'),
                    bermuda: toNode('BermudaShort'),
                    cargo: toNode('cargoShort'),
                    casual: toNode('casualShort'),
                    bike: toNode('bikeShort'),
                    gym: toNode('gymShort')
                }),
                jeans: toNode('jeans', {
                    relaxed: toNode('relaxedFitJean'),
                    bootCut: toNode('bootCutJean'),
                    slimBoot: toNode('slimBootCutJean'),
                    slim: toNode('slimFitJean'),
                    skinny: toNode('skinnyJean'),
                    flare: toNode('flareCutJean'),
                    bellBottom: toNode('bellBottom'),
                    straight: toNode('straightFitJean'),
                    casual: toNode('casualJean'),
                    baggy: toNode('baggyJean')
                }),
                other: toNode('other', {
                    croppedPant: toNode('croppedPant'),
                    skort: toNode('skort'),
                    capri: toNode('capri'),
                    legging: toNode('legging'),
                    trackPant: toNode('trackPant'),
                    trackSuit: toNode('trackSuit'),
                    sweatPant: toNode('sweatPant'),
                    tight: toNode('tight'),
                    skirt: toNode('skirt')
                })
            }),
            footwear: toNode('footwear', {
                other: toNode('other', {
                    speciality: toNode('specialityShoe'),
                    work: toNode('workShoe'),
                    fashion: toNode('fashionShoe'),
                    safety: toNode('safetyShoe')
                }),
                boots: toNode('boot', {
                    workBoot: toNode('workBoot'),
                    cowboy: toNode('cowboyBoot'),
                    hiking: toNode('hikingBoot')
                }),
                sneaker: toNode('sneaker', {
                    athletic: toNode('athleticSneaker'),
                    skate: toNode('skateSneaker'),
                    highTops: toNode('highTops'),
                    runner: toNode("runner'sSneaker"),
                    basketball: toNode('basketballSneaker'),
                    golf: toNode('golfShoe'),
                    cleat: toNode('cleat')
                }),
                withHeel: toNode('withHeel', {
                    highHeel: toNode('highHeel'),
                    wedge: toNode('wedge'),
                    sandal: toNode('heeledsandal'),
                    stiletto: toNode('stiletto')
                }),
                withoutHeel: toNode('withoutHeel', {
                    loafer: toNode('loader'),
                    derby: toNode('derby'),
                    oxford: toNode('oxford'),
                    sandal: toNode('sandal'),
                    flipFlop: toNode('flipFlop'),
                    mule: toNode('mule'),
                    clog: toNode('clog'),
                    dressFlat: toNode('dressFlat')
                })
            }),
            undergarmet: toNode('undergarment', {
                socks: toNode('socks', {
                    athletic: toNode('athleticSock'),
                    crew: toNode('crewSock'),
                    ankle: toNode('ankelSock'),
                    kneeHigh: toNode('kneeHighSock'),
                    mid: toNode('midSock')
                }),
                men: toNode('men', {
                    brief: toNode('brief'),
                    boxer: toNode('boxer'),
                    jock: toNode('jock')
                }),
                women: toNode('women', {
                    bra: toNode('bra'),
                    panty: toNode('panty'),
                    stocking: toNode('stocking'),
                    pantyHose: toNode('pantyHose')
                }),
                lingerie: toNode('lingerie', {
                    negligee: toNode('negligee')
                })
            }),
            accessory: toNode('accessory', {
                mid: toNode('mid', {
                    belt: toNode('belt'),
                    suspender: toNode('suspender'),
                    bowtie: toNode('bowtie'),
                    necktie: toNode('necktie'),
                    wallet: toNode('wallet')
                }),
                head: toNode('head', {
                    ballCap: toNode('baseballCap'),
                    cowboy: toNode('cowboyHat'),
                    fedora: toNode('fedora'),
                    skullCap: toNode('skullCap'),
                    sunglasses: toNode('sunglasses'),
                    headband: toNode('headband'),
                    visor: toNode('visor')
                }),
                hand: toNode('hand', {
                    glove: toNode('glove'),
                    mitten: toNode('mitten'),
                    utilityGlove: toNode('utilityGlove'),
                    watch: toNode('watch')
                })
            }),
            outfits: toNode('outfit', {
                dresses: toNode('dress'),
                suits: toNode('suit', {
                    tuxedo: toNode('tuxedo'),
                    doubleBreasted: toNode('double-breasted'),
                    oneButton: toNode('one-button'),
                    twoButton: toNode('two-button'),
                    threeButton: toNode('three-button'),
                    fourButton: toNode('four-button')
                }),
                overall: toNode('overalls', {
                    jumpsuit: toNode('jumpsuit'),
                    rompers: toNode('romper'),
                    denim: toNode('denim overall'),
                    bodysuit: toNode('bodysuit')
                }),
                sleepwear: toNode('sleepwear', {
                    pajamaBoth: toNode('pajama top & bottom'),
                    pajamaTop: toNode('pajama top'),
                    pajamaBottom: toNode('pajama bottom'),
                    robe: toNode('robe'),
                    nightgown: toNode('nightgown')
                })
            })
        }),
        boys: toNode('boys', {
            tops: toNode('tops', {
                tShirt: toNode('tShirt', {
                    under2yr: toNode('under2yr'),
                    between2and4yr: toNode('between2and4yr'),
                    over5yr: toNode('over5yr')
                }),
                pullOver: toNode('pullOver', {
                    under2yr: toNode('under2yr'),
                    between2and4yr: toNode('between2and4yr'),
                    over5yr: toNode('over5yr')
                })
            }),
            bottoms: toNode('bottoms', {}),
            footwear: toNode('footwear', {})
        })
    })
};

console.log(taxonomy.apparel.mens.tops);
console.log(taxonomy.apparel.mens.tops());
console.log(taxonomy.apparel.mens.tops.shirts);
console.log(taxonomy.apparel.mens.tops.sweaters['']);
console.log(taxonomy.apparel.mens.tops.shirts.tShirts);
console.log(taxonomy.apparel.mens.outfits());
console.log(taxonomy.apparel.mens.outfits.suits());
console.log(taxonomy.apparel.mens.outfits.suits.oneButton);

console.log(toCamelCase('word'));
console.log(toCamelCase('oneButton'));
console.log(toCamelCase('teeShirt'));
console.log(toCamelCase('doubleBreastedSuit'));
console.log(pluralize('watch'));
console.log(pluralize('sunglasses'));
console.log(pluralize('stiletto'));
console.log(pluralize('chino'));
console.log(pluralize('khaki'));
console.log(pluralize('corduroy'));
console.log(pluralize('trouser'));
console.log('\u2109');