import { splitAt } from '../../common/text/splitAt';
import { pluralize } from './pluralize';
import { toCamelCase } from './toCamelCase';
import * as fs from 'graceful-fs';

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
export function toNode<T extends Record<string, any>>(name: string, obj: T, override?: string): TaxaNode<T>;
export function toNode<T extends Record<string, any>>(name: string, obj?: T, override?: string): string | TaxaNode<T> {
    if (obj == null) return override ? override : (name as string);
    return Object.assign(() => (override ? override : name), obj) as TaxaNode<T>;
}
// const toNode2= (name: string) => (obj?: Record<any, any>) => obj == null ? name : Object.assign(() => name, obj);

export const taxonomy = {
    apparel: toNode('apparel', {
        men: toNode('men', {
            tops: toNode('tops', {
                'pull-over': toNode('pull-over', {
                    'tee-shirt': toNode('tee-shirt'),
                    camisole: toNode('camisole'),
                    sleeveless: toNode('sleeveless'),
                    'tank-top': toNode('tank-top'),
                    'tube-top': toNode('tube-top'),
                    'halter-top': toNode('halter-top')
                }),
                jackets: toNode('jackets', {
                    windbreaker: toNode('windbreaker'),
                    fleece: toNode('fleece'),
                    bomber: toNode('bomber'),
                    raincoat: toNode('raincoat'),
                    trenchcoat: toNode('trenchcoat'),
                    leather: toNode('leather'),
                    hoodie: toNode('hoodie'),
                    denim: toNode('denim'),
                    overcoat: toNode('overcoat'),
                    poncho: toNode('poncho')
                }),
                'button-front': toNode('button-front', {
                    'button-down': toNode('button-down'),
                    'dress-shirt': toNode('dress-shirt'),
                    'fitted-shirt': toNode('fitted-shirt'),
                    flannel: toNode('flannel'),
                    blouse: toNode('blouse'),
                    henley: toNode('henley'),
                    'hawaiian-shirt': toNode('hawaiian-shirt'),
                    'oxford-shirt': toNode('oxford-shirt'),
                    'rugby-shirt': toNode('rugby-shirt'),
                    polo: toNode('polo')
                }),
                'outer-wear': toNode('outer-wear', {
                    sweater: toNode('sweater'),
                    'turtle-neck': toNode('turtle-neck'),
                    'pull-over': toNode('pull-over'),
                    cardigan: 'cardigan',
                    sweatshirt: 'sweatshirt'
                }),
                other: toNode('other', {
                    tunic: toNode('tunic'),
                    wrap: toNode('wrap'),
                    jersey: toNode('jersey')
                })
            }),
            bottoms: toNode('bottoms', {
                pants: toNode('pants', {
                    carpenter: toNode('carpenter'),
                    cargo: toNode('cargo'),
                    leather: toNode('leather'),
                    chino: toNode('chino'),
                    khaki: toNode('khaki'),
                    pleated: toNode('pleated'),
                    fitted: toNode('fitted'),
                    casual: toNode('casual'),
                    corduroy: toNode('corduroy'),
                    trouser: toNode('trouser')
                }),
                shorts: toNode('shorts', {
                    'short-shorts': toNode('short-shorts'),
                    denim: toNode('denim'),
                    board: toNode('board'),
                    surf: toNode('surf'),
                    khaki: toNode('khaki'),
                    bermuda: toNode('bermuda'),
                    cargo: toNode('cargo'),
                    casual: toNode('casual'),
                    bike: toNode('bike'),
                    gym: toNode('gym')
                }),
                jeans: toNode('jeans', {
                    'relaxed-fit': toNode('relaxed-fit'),
                    'boot-cut': toNode('boot-cut'),
                    'slim-boot-cut': toNode('slim-boot-cut'),
                    'slim-fit': toNode('slim-fit'),
                    skinny: toNode('skinny'),
                    flare: toNode('flare'),
                    'bell-bottom': toNode('bell-bottom'),
                    'straight-fit': toNode('straight-fit'),
                    casual: toNode('casual'),
                    baggy: toNode('baggy')
                })
            }),
            footwear: toNode('footwear', {
                other: toNode('other', {
                    specialty: toNode('specialty'),
                    work: toNode('work'),
                    fashion: toNode('fashion'),
                    safety: toNode('safety')
                }),
                boots: toNode('boots', {
                    work: toNode('work'),
                    cowboy: toNode('cowboy'),
                    hiking: toNode('hiking')
                }),
                sneakers: toNode('sneakers', {
                    athletic: toNode('athletic'),
                    skate: toNode('skate'),
                    'high-tops': toNode('high-tops'),
                    runner: toNode('runner'),
                    basketball: toNode('basketball'),
                    golf: toNode('golf'),
                    cleat: toNode('cleat')
                }),
                heeled: toNode('heeled', {
                    'high-heel': toNode('high-heel'),
                    wedge: toNode('wedge'),
                    sandal: toNode('sandal'),
                    stiletto: toNode('stiletto')
                }),
                flats: toNode('flats', {
                    loafers: toNode('loafers'),
                    derbys: toNode('derbys'),
                    oxfords: toNode('oxfords'),
                    sandals: toNode('sandals'),
                    'flip-flops': toNode('flip-flops'),
                    mules: toNode('mules'),
                    clogs: toNode('clogs'),
                    dress: toNode('dress')
                })
            }),
            undergarment: toNode('undergarment', {
                socks: toNode('socks', {
                    athletic: toNode('athletic'),
                    crew: toNode('crew'),
                    ankle: toNode('ankle'),
                    'knee-high': toNode('knee-high'),
                    mid: toNode('mid')
                }),
                intimates: toNode('intimates', {
                    brief: toNode('brief'),
                    boxer: toNode('boxer'),
                    jock: toNode('jock')
                })
            }),
            accessories: toNode('accessories', {
                mid: toNode('mid', {
                    belt: toNode('belt'),
                    suspender: toNode('suspender'),
                    bowtie: toNode('bowtie'),
                    necktie: toNode('necktie'),
                    wallet: toNode('wallet')
                }),
                head: toNode('head', {
                    'baseball-cap': toNode('baseball-cap'),
                    'cowboy-hat': toNode('cowboy-hat'),
                    fedora: toNode('fedora'),
                    'skull-cap': toNode('skull-cap'),
                    sunglasses: toNode('sunglasses'),
                    headband: toNode('headband'),
                    visor: toNode('visor')
                }),
                hand: toNode('hand', {
                    glove: toNode('glove'),
                    mitten: toNode('mitten'),
                    'utility-glove': toNode('utility-glove'),
                    watch: toNode('watch')
                })
            }),
            outfits: toNode('outfit', {
                dresses: toNode('dresses'),
                suits: toNode('suits', {
                    tuxedo: toNode('tuxedo'),
                    'double-breasted': toNode('double-breasted'),
                    'one-button': toNode('one-button'),
                    'two-button': toNode('two-button'),
                    'three-button': toNode('three-button'),
                    'four-button': toNode('four-button')
                }),
                overalls: toNode('overalls', {
                    jumpsuit: toNode('jumpsuit'),
                    romper: toNode('romper'),
                    denim: toNode('denim'),
                    bodysuit: toNode('bodysuit')
                }),
                sleepwear: toNode('sleepwear', {
                    'pajama-top-bottom': toNode('pajama-top-bottom'),
                    'pajama-top': toNode('pajama-top'),
                    'pajama-bottom': toNode('pajama-bottom'),
                    robe: toNode('robe'),
                    nightgown: toNode('nightgown')
                })
            })
        }),
        women: toNode('women', {
            tops: toNode('tops', {
                'pull-over': toNode('shirts', {
                    'tee-shirt': toNode('tee-shirt'),
                    camisole: toNode('camisole'),
                    sleeveless: toNode('sleeveless'),
                    'tank-top': toNode('tank-top'),
                    'tube-top': toNode('tube-top'),
                    'halter-top': toNode('halter-top')
                }),
                jackets: toNode('jackets', {
                    windbreaker: toNode('windbreaker'),
                    fleece: toNode('fleece'),
                    bomber: toNode('bomber'),
                    raincoat: toNode('raincoat'),
                    trenchcoat: toNode('trenchcoat'),
                    leather: toNode('leather'),
                    hoodie: toNode('hoodie'),
                    denim: toNode('denim'),
                    overcoat: toNode('overcoat'),
                    poncho: toNode('poncho')
                }),
                'button-front': toNode('button-front', {
                    'button-down': toNode('button-down'),
                    'dress-shirt': toNode('dress-shirt'),
                    'fitted-shirt': toNode('fitted-shirt'),
                    flannel: toNode('flannel'),
                    blouse: toNode('blouse'),
                    henley: toNode('henley'),
                    'hawaiian-shirt': toNode('hawaiian-shirt'),
                    'oxford-shirt': toNode('oxford-shirt'),
                    'rugby-shirt': toNode('rugby-shirt'),
                    polo: toNode('polo')
                }),
                'outer-wear': toNode('outer-wear', {
                    sweater: toNode('sweater'),
                    'turtle-neck': toNode('turtle-neck'),
                    'pull-over': toNode('pull-over'),
                    cardigan: 'cardigan',
                    sweatshirt: 'sweatshirt'
                }),
                other: toNode('other', {
                    tunic: toNode('tunic'),
                    wrap: toNode('wrap'),
                    jersey: toNode('jersey')
                })
            }),
            bottoms: toNode('bottoms', {
                pants: toNode('pants', {
                    carpenter: toNode('carpenter'),
                    cargo: toNode('cargo'),
                    leather: toNode('leather'),
                    chino: toNode('chino'),
                    khaki: toNode('khaki'),
                    pleated: toNode('pleated'),
                    fitted: toNode('fitted'),
                    casual: toNode('casual'),
                    corduroy: toNode('corduroy'),
                    trouser: toNode('trouser')
                }),
                shorts: toNode('shorts', {
                    'short-shorts': toNode('short-shorts'),
                    denim: toNode('denim'),
                    board: toNode('board'),
                    surf: toNode('surf'),
                    khaki: toNode('khaki'),
                    bermuda: toNode('bermuda'),
                    cargo: toNode('cargo'),
                    casual: toNode('casual'),
                    bike: toNode('bike'),
                    gym: toNode('gym')
                }),
                jeans: toNode('jeans', {
                    'relaxed-fit': toNode('relaxed-fit'),
                    'boot-cut': toNode('boot-cut'),
                    'slim-boot-cut': toNode('slim-boot-cut'),
                    'slim-fit': toNode('slim-fit'),
                    skinny: toNode('skinny'),
                    flare: toNode('flare'),
                    'bell-bottom': toNode('bell-bottom'),
                    'straight-fit': toNode('straight-fit'),
                    casual: toNode('casual'),
                    baggy: toNode('baggy')
                }),
                other: toNode('other', {
                    'cropped-pants': toNode('cropped-pants'),
                    skort: toNode('skort'),
                    capri: toNode('capri'),
                    legging: toNode('legging'),
                    'track-pants': toNode('track-pants'),
                    'track-suit': toNode('track-suit'),
                    sweatpants: toNode('sweatpants'),
                    tights: toNode('tights'),
                    skirt: toNode('skirt')
                })
            }),
            footwear: toNode('footwear', {
                other: toNode('other', {
                    specialty: toNode('specialty'),
                    work: toNode('work'),
                    fashion: toNode('fashion'),
                    safety: toNode('safety')
                }),
                boots: toNode('boots', {
                    work: toNode('work'),
                    cowboy: toNode('cowboy'),
                    hiking: toNode('hiking')
                }),
                sneakers: toNode('sneakers', {
                    athletic: toNode('athletic'),
                    skate: toNode('skate'),
                    'high-tops': toNode('high-tops'),
                    runner: toNode('runner'),
                    basketball: toNode('basketball'),
                    golf: toNode('golf'),
                    cleat: toNode('cleat')
                }),
                heeled: toNode('heeled', {
                    'high-heel': toNode('high-heel'),
                    wedge: toNode('wedge'),
                    sandal: toNode('sandal'),
                    stiletto: toNode('stiletto')
                }),
                flats: toNode('flats', {
                    loafers: toNode('loafers'),
                    derbys: toNode('derbys'),
                    oxfords: toNode('oxfords'),
                    sandals: toNode('sandals'),
                    'flip-flops': toNode('flip-flops'),
                    mules: toNode('mules'),
                    clogs: toNode('clogs'),
                    dress: toNode('dress')
                })
            }),
            undergarment: toNode('undergarment', {
                socks: toNode('socks', {
                    athletic: toNode('athletic'),
                    crew: toNode('crew'),
                    ankle: toNode('ankle'),
                    'knee-high': toNode('knee-high'),
                    mid: toNode('mid')
                }),
                intimates: toNode('intimates', {
                    bra: toNode('bra'),
                    panties: toNode('panties'),
                    stockings: toNode('stockings'),
                    'panty-hose': toNode('panty-hose')
                }),
                lingerie: toNode('lingerie', {
                    negligee: toNode('negligee')
                })
            }),
            accessories: toNode('accessories', {
                mid: toNode('mid', {
                    belt: toNode('belt'),
                    suspender: toNode('suspender'),
                    bowtie: toNode('bowtie'),
                    necktie: toNode('necktie'),
                    wallet: toNode('wallet')
                }),
                head: toNode('head', {
                    'baseball-cap': toNode('baseball-cap'),
                    'cowboy-hat': toNode('cowboy-hat'),
                    fedora: toNode('fedora'),
                    'skull-cap': toNode('skull-cap'),
                    sunglasses: toNode('sunglasses'),
                    headband: toNode('headband'),
                    visor: toNode('visor')
                }),
                hand: toNode('hand', {
                    glove: toNode('glove'),
                    mitten: toNode('mitten'),
                    'utility-glove': toNode('utility-glove'),
                    watch: toNode('watch')
                })
            }),
            outfits: toNode('outfit', {
                dresses: toNode('dresses'),
                suits: toNode('suits', {
                    tuxedo: toNode('tuxedo'),
                    'double-breasted': toNode('double-breasted'),
                    'one-button': toNode('one-button'),
                    'two-button': toNode('two-button'),
                    'three-button': toNode('three-button'),
                    'four-button': toNode('four-button')
                }),
                overalls: toNode('overalls', {
                    jumpsuit: toNode('jumpsuit'),
                    romper: toNode('romper'),
                    denim: toNode('denim'),
                    bodysuit: toNode('bodysuit')
                }),
                sleepwear: toNode('sleepwear', {
                    'pajama-top-bottom': toNode('pajama-top-bottom'),
                    'pajama-top': toNode('pajama-top'),
                    'pajama-bottom': toNode('pajama-bottom'),
                    robe: toNode('robe'),
                    nightgown: toNode('nightgown')
                })
            })
        }),
        boys: toNode('boys', {
            tops: toNode('tops', {
                'tee-shirt': toNode('tee-shirt', {
                    '<2years': toNode('<2years'),
                    '2-4years': toNode('2-4years'),
                    '>5years': toNode('>5years')
                }),
                'pull-over': toNode('pull-over', {
                    '<2years': toNode('<2years'),
                    '2-4years': toNode('2-4years'),
                    '>5years': toNode('>5years')
                })
            }),
            bottoms: toNode('bottoms', {}),
            footwear: toNode('footwear', {})
        }),
        girls: toNode('girls', {
            tops: toNode('tops', {
                'tee-shirt': toNode('tee-shirt', {
                    '<2years': toNode('<2years'),
                    '2-4years': toNode('2-4years'),
                    '>5years': toNode('>5years')
                }),
                'pull-over': toNode('pull-over', {
                    '<2years': toNode('<2years'),
                    '2-4years': toNode('2-4years'),
                    '>5years': toNode('>5years')
                })
            }),
            bottoms: toNode('bottoms', {}),
            footwear: toNode('footwear', {})
        })
    }),
    media: toNode(
        'media',
        {
            books: toNode('books', {}),
            videos: toNode('videos', {
                vhs: toNode(
                    'vhs',
                    {
                        drama: toNode('drama'),
                        action: toNode('action'),
                        documentary: toNode('documentary'),
                        kids: toNode('kids'),
                        horror: toNode('horror'),
                        scifi: toNode('scifi')
                    },
                    'vhs'
                ),
                dvds: toNode('dvds', {
                    drama: toNode('drama'),
                    action: toNode('action'),
                    documentary: toNode('documentary'),
                    kids: toNode('kids'),
                    horror: toNode('horror'),
                    'sci-fi': toNode('sci-fi')
                }),
                'blu-ray': toNode('blu-ray', {
                    drama: toNode('drama'),
                    action: toNode('action'),
                    documentary: toNode('documentary'),
                    kids: toNode('kids'),
                    horror: toNode('horror'),
                    'sci-fi': toNode('sci-fi')
                })
            })
        },
        'media'
    )
};
function setNode(obj: Record<string, any>): AnyObject {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, typeof v === 'string' ? { text: v } : { text: v(), options: setNode(v) }] as [string, any]));
}
// fs.writeFileSync('taxonomy.json', JSON.stringify(setNode(taxonomy), null, '\t'))
// console.log(taxonomy.apparel.men.tops);
// console.log(taxonomy.apparel.men.tops());
// console.log(taxonomy.apparel.men.tops.shirts);
// console.log(taxonomy.apparel.men.tops.sweaters['']);
// console.log(taxonomy.apparel.men.tops.shirts.tShirts);
// console.log(taxonomy.apparel.men.outfits());
// console.log(taxonomy.apparel.men.outfits.suits());
// console.log(taxonomy.apparel.men.outfits.suits.oneButton);

// console.log(toCamelCase('word'));
// console.log(toCamelCase('oneButton'));
// console.log(toCamelCase('teeShirt'));
// console.log(toCamelCase('doubleBreastedSuit'));
// console.log(pluralize('watch'));
// console.log(pluralize('sunglasses'));
// console.log(pluralize('stiletto'));
// console.log(pluralize('chino'));
// console.log(pluralize('khaki'));
// console.log(pluralize('corduroy'));
// console.log(pluralize('trouser'));
// console.log('\u2109');
