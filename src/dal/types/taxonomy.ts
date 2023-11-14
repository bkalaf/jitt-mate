import { IProductTaxonomy } from '.';
import Realm from 'realm';
(Symbol as any).metadata ??= Symbol('Symbol.metadata');
export function getMetadata(columnName: string, $propName: string) {
    return function (Ctor: { new (...args: any[]): typeof Ctor }) {
        const context = Ctor[Symbol.metadata];
        console.log(`context`, context);
        const obj1 = (context ?? {})[columnName];
        return obj1 != null ? (obj1 as any)[$propName] : undefined;
    };
}

function level(lvlNumber: number) {
    return function (_target: any, context: ClassFieldDecoratorContext) {
        const value = context.metadata[context.name];
        if (value == null) context.metadata[context.name] = {};
        (context.metadata[context.name] as Record<any, any>)['taxon'] = lvlNumber === 0 ? 'kingdom' : lvlNumber === 1 ? 'phylum' : lvlNumber === 2 ? 'klass' : 'order';
    };
// // }
// // export class Graph {
// //     @level(0) apparel() {
// //         return ['men', 'women', 'boys', 'girls', 'infants', 'toddlers'];
// //     }
// //     @level(1)
// //     mens() {
// //         return ['tops', 'bottoms', 'jackets', 'other'];
// //     }
// //     @level(1)
// //     women() {
// //         return ['tops', 'bottoms', 'jackets', 'other'];
// //     }
// //     @level(2) tops() {
// //         return ['buttonUp', 'halfPlacket', 'pullOvers'];
// //     }
// // }

// console.log(JSON.stringify(Graph[Symbol.metadata], null, '\t'));

// export const Graph2 = {
//     apparel: {
//         men: {
//             tops: {
//                 // 3
//                 shirts: {
//                     // 4
//                     buttonUp: {
//                         oxfords: {},
//                         fittedShirts: {},
//                         flannelShirts: {},
//                         hawaiianShirts: {},
//                         buttonDowns: {}
//                     },
//                     halfPlacket: {
//                         henleys: {},
//                         polos: {},
//                         rugbyShirts: {},
//                         tunics: {}
//                     },
//                     pullOvers: {
//                         blouses: {},
//                         tShirts: {},
//                         camisoles: {},
//                         tankTops: {},
//                         tubeTops: {},
//                         halterTops: {},
//                         sleeveless: {}
//                     }
//                 },
//                 jackets: {
//                     fashionInspired: {
//                         bomberJackets: {},
//                         leatherJacket: {},
//                         denimJackets: {}
//                     },
//                     everydayInspired: {
//                         trenchCoats: {},
//                         hoodies: {}
//                     },
//                     weatherInspired: {
//                         windbreakers: {},
//                         raincoats: {},
//                         ponchos: {},
//                         fleeceJacket: {}
//                     }
//                 },
//                 other: {
//                     cardigan: {},
//                     vests: {},
//                     sweatshirts: {},
//                     turtlenecks: {},
//                     sweaters: {}
//                 }
//             },
//             bottoms: {
//                 // 3
//                 pants: {
//                     // 4
//                     pleatedPants: {
//                         khakis: {},
//                         cargoPants: {},
//                         dressPants: {},
//                         trousers: {},
//                         corduroys: {}
//                     },
//                     fittedPants: {
//                         chinos: {},
//                         carpenterPants: {},
//                         leggings: {},
//                         jeans: {
//                             skinny: {},
//                             slimCut: {},
//                             bootCut: {},
//                             straight: {},
//                             baggy: {},
//                             flareCut: {},
//                             bellBottoms: {},
//                             relaxed: {},
//                             slimBootCut: {}
//                         } // 5
//                     },
//                     trackPants: {},
//                     sweatPants: {}
//                 },
//                 partialPants: {
//                     shorts: {
//                         bermudaShorts: {},
//                         boardShorts: {},
//                         surfShorts: {},
//                         cargoShorts: {},
//                         gymShorts: {},
//                         bikeShorts: {},
//                         denimShorts: {},
//                         khakiShorts: {},
//                         shortShorts: {}
//                     },
//                     skirts: {},
//                     skorts: {},
//                     capris: {}
//                 },
//                 other: {
//                     croppedPants: {},
//                     skirt: {}
//                 },
//                 undergarments: {}
//             },
//             shoes: {
//                 casual: {
//                     flats: {
//                         loafers: {},
//                         derbys: {},
//                         oxfords: {},
//                         slipOns: {
//                             clogs: {},
//                             mules: {}
//                         },
//                         sandals: {
//                             flipFlops: {},
//                             beachSandals: {}
//                         },
//                         sneakers: {
//                             athleticShoes: {
//                                 basketballSneakers: {},
//                                 runningSneakers: {},
//                                 walkingSnekers: {}
//                             },
//                             highTops: {},
//                             skateSneaks: {},
//                             tennisShoes: {}
//                         }
//                     },
//                     heels: {
//                         boots: {
//                             hikingBoots: {},
//                             steelToedBOots: {},
//                             cowboyBoots: {}
//                         },
//                         stilettos: {},
//                         sandals: {},
//                         wedges: {},
//                         highHeels: {}
//                     }
//                 },
//                 dressShoes: {
//                     flats: {
//                         lacedShoes: { loafers: {}, derbys: {}, oxfords: {} },
//                         slipOns: {
//                             flipFlops: {},
//                             sandals: {},
//                             clogs: {},
//                             mules: {}
//                         },
//                         sandals: {},
//                         athleticSneakers: {
//                             basketballSneakers: {},
//                             runningSneakers: {},
//                             walkingSnekers: {}
//                         },
//                         highTops: {},
//                         skateSneaks: {},
//                         tennisShoes: {}
//                     },
//                     heels: {
//                         boots: {
//                             hikingBoots: {},
//                             steelToedBOots: {},
//                             cowboyBoots: {}
//                         },
//                         stilettos: {},
//                         sandals: {},
//                         wedges: {},
//                         highHeels: {}
//                     }
//                 },
//                 speciality: {
//                     work: {},
//                     safety: {},
//                     fashionShoes: {}
//                 }
//             },
//             outfits: {
//                 dresses: {
//                     minis: { casual: {}, cocktail: {}, eveningWear: {} }, // mid-thigh
//                     kneeLengths: {
//                         casual: {},
//                         cocktail: {},
//                         eveningWear: {}
//                     },
//                     midis: { casual: {}, cocktail: {}, eveningWear: {} }, // mid-calf
//                     maxis: { casual: {}, cocktail: {}, eveningWear: {} }, // floor
//                     highLow: { casual: {}, cocktail: {}, eveningWear: {} },
//                     gowns: { casual: {}, cocktail: {}, eveningWear: {} }
//                 },
//                 suits: {
//                     tuxedo: {},
//                     '2piece': {
//                         oneButton: {},
//                         twoButton: {},
//                         threeButton: {},
//                         fourButton: {},
//                         doubleBreasted: {}
//                     },
//                     '3piece': {
//                         oneButton: {},
//                         twoButton: {},
//                         threeButton: {},
//                         fourButton: {},
//                         doubleBreasted: {}
//                     },
//                     trackSuits: {},
//                     pantSuits: {}
//                 },
//                 jumpers: {
//                     overalls: {},
//                     rompers: {},
//                     jumpsuits: {}
//                 },
//                 sleepwear: {
//                     robes: {},
//                     nightgowns: {},
//                     pajamas: {
//                         top: {},
//                         bottom: {},
//                         both: {}
//                     }
//                 }
//             },
//             accessories: {
//                 head: {
//                     baseballCap: {},
//                     fedora: {},
//                     visor: {},
//                     neckties: {
//                         ties: {},
//                         bowties: {}
//                     }
//                 },
//                 hand: {
//                     winterGloves: {},
//                     utilityGloves: {},
//                     mittens: {}
//                 },
//                 mid: {
//                     belts: {},
//                     suspenders: {},
//                     wallets: {}
//                 }
//             }
//         },
//         women: {
//             tops: {},
//             bottoms: {},
//             jackets: {},
//             shoes: {},
//             outfits: {},
//             accessories: {}
//         },
//         boys: {
//             tops: {},
//             bottoms: {},
//             jackets: {},
//             shoes: {},
//             outfits: {},
//             accessories: {}
//         },
//         girls: {
//             tops: {},
//             bottoms: {},
//             jackets: {},
//             shoes: {},
//             outfits: {},
//             accessories: {}
//         },
//         unisex: {
//             tops: {},
//             bottoms: {},
//             jackets: {},
//             shoes: {},
//             outfits: {},
//             accessories: {}
//         },
//         baby: {},
//         toddler: {}
//     },
//     media: {
//         book: {
//             textbook: {},
//             cookbook: {},
//             fiction: {
//                 romance: {}
//             },
//             nonfiction: {
//                 politics: {},
//                 business: {},
//                 selfHelp: {},
//                 travel: {},
//                 technology: {},
//                 religion: {
//                     scriptureBooks: {},
//                     spirtuality: {},
//                     gratitude: {}
//                 }
//             },
//             reference: {
//                 dictionaries: {},
//                 thesarus: {}
//             },
//             childrensBook: {
//                 boardBook: {},
//                 pictureBook: {},
//                 readAlong: {},
//                 popUp: {}
//             }
//         },
//         video: {
//             film: {
//                 comedy: {},
//                 action: {},
//                 documentary: {},
//                 horror: {},
//                 sciFi: {},
//                 trueCrime: {},
//                 drama: {},
//                 family: {},
//                 mystery: {},
//                 sports: {},
//                 animated: {
//                     kidsCartoon: {},
//                     anime: {},
//                     adultSwim: {}
//                 }
//             },
//             tvSeries: {
//                 comedy: {},
//                 action: {},
//                 documentary: {},
//                 horror: {},
//                 sciFi: {},
//                 trueCrime: {},
//                 drama: {},
//                 family: {},
//                 mystery: {},
//                 sports: {},
//                 soapOpera: {},
//                 talkShow: {}
//             },
//             concert: {}
//         },
//         audio: {
//             jazz: {},
//             rap: {},
//             rhythmNBlues: {},
//             country: {},
//             classical: {},
//             alternative: {},
//             metal: {},
//             classicRock: {},
//             edm: {},
//             pop: {},
//             dance: {},
//             spirtual: {},
//             holiday: {},
//             bookOnTape: {}
//         },
//         game: {
//             nintendo: {
//                 nes: {},
//                 snes: {},
//                 nintendo64: {},
//                 wii: {},
//                 ds: {},
//                 gameboy: {},
//                 gameboyAdvance: {},
//                 switch: {}
//             },
//             playstation: {
//                 ps1: {},
//                 ps2: {},
//                 ps3: {},
//                 ps4: {},
//                 ps5: {}
//             },
//             microsoft: {
//                 xbox: {}
//             }
//         }
//     }
// };
// export class ProductTaxonomy extends Realm.Object<ProductTaxonomy> implements IProductTaxonomy {
//     kingdom: Optional<string>;
//     phylum: Optional<string>;
//     klass: Optional<string>;
//     order: Optional<string>;
//     family: Optional<string>;
//     genus: Optional<string>;
//     species: Optional<string>;
// }
}