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
        children: ['accessories', 'shoes', 'tops', 'bottoms', 'undergarments', 'sleepwear', 'fullbody'],
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
            sleepwear: {
                children: ['pajamas', 'robes'],
                map: {
                    pajamas: ['top', 'bottom', 'set'],
                    robes: ['robe', 'nightgown', 'wrap']
                }
            },
            fullbody: {
                children: ['dresses', 'suits', 'overalls'],
                map: {
                    dresses: [],
                    suits: ['tuxedo', 'double-breasted', '1-button', '2-button', '3-button', '4-button', 'bodysuit', 'pant-suit'],
                    overalls: ['jumpsuit', 'romper', 'denim', 'bodysuit']
                }
            }
        }
    }
};

export type Phylum = keyof typeof Taxa;
export type T1 = keyof typeof Taxa['media']['map']; 
export type OrderMap = { [P in Phylum]: keyof typeof Taxa[P]['map'] };

export type Order = { [P in Phylum]: keyof typeof Taxa[P]['map'] }[Phylum];
export type Family = { [P in Phylum]: { [O in keyof typeof Taxa[P]['map']]: typeof Taxa[P]['map'][O] }[keyof typeof Taxa[P]['map']] }[Phylum];

