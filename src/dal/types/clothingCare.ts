import { toProperFromCamel } from '../../common/text/toProperCase';

export const degreeF = '\u2109';
export const degreeC = '\u2103';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const degreeCdegreeF = '\u2103\u2109'
export class CareInstructions {
    #instructions: string[] = [];
    static ctor() {
        return new CareInstructions();
    }
    next(i: ((() => string) & Record<string, string>) | string) {
        if (typeof i === 'string') {
            this.#instructions.push(i);
        } else {
            const result = i();
            this.#instructions.push(result);
        }
        return this;
    }
    eject(): string[] {
        return this.#instructions.map((x) => x.split(' ').map(toProperFromCamel).join(' '));
    }
}

export const Laundry = {
    tubWithWater: Object.assign(() => 'machine wash', {
        withOneLine: 'machine wash, permanent press',
        withTwoLines: 'machine wash, delicate',
        withHand: 'hand wash',
        withX: 'do not wash',
        with30deg: 'water temperature 30'.concat(degreeC).concat(' /86').concat(degreeF).concat(' '),
        with40deg: 'water temperature 40'.concat(degreeC).concat(' /104').concat(degreeF).concat(' '),
        with50deg: 'water temperature 50'.concat(degreeC).concat(' /122').concat(degreeF).concat(' '),
        with60deg: 'water temperature 60'.concat(degreeC).concat(' /140').concat(degreeF).concat(' '),
        with70deg: 'water temperature 70'.concat(degreeC).concat(' /158').concat(degreeF).concat(' '),
        with95deg: 'water temperature 95'.concat(degreeC).concat(' /203').concat(degreeF).concat(' '),
        with1dot: 'water temperature 30'.concat(degreeC).concat(' /86').concat(degreeF).concat(' '),
        with2dot: 'water temperature 40'.concat(degreeC).concat(' /104').concat(degreeF).concat(' '),
        with3dot: 'water temperature 50'.concat(degreeC).concat(' /122').concat(degreeF).concat(' '),
        with4dot: 'water temperature 60'.concat(degreeC).concat(' /140').concat(degreeF).concat(' '),
        with5dot: 'water temperature 70'.concat(degreeC).concat(' /158').concat(degreeF).concat(' '),
        with6dot: 'water temperature 95'.concat(degreeC).concat(' /203').concat(degreeF).concat(' ')
    }),
    iron: Object.assign(() => 'iron ok', {
        with1Dot: 'iron ok, low temperature',
        with2Dots: 'iron ok, medium temperature',
        with3Dots: 'iron ok, high temperature',
        withX: 'do not iron',
        withXAndSteam: 'do not steam'
    }),
    squareAndCircle: Object.assign(() => 'tumble dry', {
        with1Dot: 'tumble dry, low heat',
        with2Dots: 'tumble dry, medium heat',
        with3Dots: 'tumble dry, high heat',
        withHorizontalLineInMiddle: 'dry flat',
        with2LinesDiagonalUpperLeft: 'dry in the shade',
        withCircleBlack: 'no heat',
        with1LineUnder: 'permanent press',
        with2LinesUnder: 'delicate'
    }),
    square: Object.assign(() => '', {
        withCurvedLineOnTop: 'hang to dry',
        with3VerticalLines: 'drip dry',
        withX: 'do not tumble dry'
    }),
    circle: Object.assign(() => '', {
        withLineSW: 'short cycle',
        withLineNW: 'reduced moisture',
        withLineNE: 'no steam finishing',
        withLineSE: 'low heat',
        withX: 'do not dry clean',
        withBlackCircleAndX: 'do not wet clean',
        withAInside: 'any solvent',
        withPInside: 'any solvent except tetrachloroethylene',
        withFInside: 'petroleum solvent only',
        withWInside: 'wet cleaning'
    }),
    triangle: Object.assign(() => '', {
        with2LinesDiagonal: 'non chlorine bleach',
        withX: 'do not bleach'
    }),
    cloth: Object.assign(() => '', {
        withX: 'do not wring'
    })
};

// console.log(CareInstructions.ctor().next(Laundry.tubWithWater.with40deg).next(Laundry.iron.with1Dot).next(Laundry.triangle.withX).eject());
// console.log(degreeC);
// console.log(degreeF);
