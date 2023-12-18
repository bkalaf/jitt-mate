import { useCallback, useMemo, useState } from 'react';
import SteamAsNeeded from '../../assets/laundrySVG/SteamAsNeeded';
import BleachingAllowed from '../../assets/laundrySVG/Bleaching';
import BleachWithChlorine from '../../assets/laundrySVG/BleachWithChlorine';
import DoNotDryClean from '../../assets/laundrySVG/DoNotDryClean';
import DoNotDryClean2 from '../../assets/laundrySVG/DoNotDryClean2';
import DoNotDry from '../../assets/laundrySVG/DoNotDry';
import DoNotIron from '../../assets/laundrySVG/DoNotIron';
import DoNotTumbleDry from '../../assets/laundrySVG/DoNotTumbleDry';
import DoNotWash from '../../assets/laundrySVG/DoNotWash';
import DoNotWring from '../../assets/laundrySVG/DoNotWring';
import DoNotSteam from '../../assets/laundrySVG/DoNotSteam';
import DripDry from '../../assets/laundrySVG/DripDry';
import DripDryDryInShade from '../../assets/laundrySVG/DripDryDryInShade';
import DryCleanAnySolvent from '../../assets/laundrySVG/DryCleanAnySolvent';
import DryCleanDelicate from '../../assets/laundrySVG/DryCleanDelicate';
import DryCleanLowHeat from '../../assets/laundrySVG/DryCleanLowHeat';
import DryCleanNoSteamFinishing from '../../assets/laundrySVG/DryCleanNoSteamFinishing';
import DryCleanPceOnly from '../../assets/laundrySVG/DryCleanPceOnly';
import DryCleanPermanentPress from '../../assets/laundrySVG/DryCleanPermanentPress';
import DryCleanPetroleumSolventDelicate from '../../assets/laundrySVG/DryCleanPetroleumSolventDelicate';
import DryCleanPetroleumSolventOnly from '../../assets/laundrySVG/DryCleanPetroleumSolventOnly';
import DryCleanPetroleumSolventPermanentPress from '../../assets/laundrySVG/DryCleanPetroleumSolventPermanentPress';
import DryCleanReducedMoisture from '../../assets/laundrySVG/DryCleanReducedMoisture';
import DryCleanShortCycle from '../../assets/laundrySVG/DryCleanShortCycle';
import DryFlat from '../../assets/laundrySVG/DryFlat';
import DryInShade from '../../assets/laundrySVG/DryInShade';
import Drying from '../../assets/laundrySVG/Drying';
import HandWash from '../../assets/laundrySVG/HandWash';
import HangToDry from '../../assets/laundrySVG/HangToDry';
import DryFlatDryInShade from '../../assets/laundrySVG/LayFlatDryInShade';
import HangToDryDryInShade from '../../assets/laundrySVG/HangToDryDryInShade';
import HighHeatTumbleDry from '../../assets/laundrySVG/HighHeatTumbleDry';
import IronAt110 from '../../assets/laundrySVG/IronAt110';
import IronAt150 from '../../assets/laundrySVG/IronAt150';
import IronAt200 from '../../assets/laundrySVG/IronAt200';
import WashAtOrBelow20Degrees from '../../assets/laundrySVG/WashAtOrBelow20';
import WashAtOrBelow30Degrees from '../../assets/laundrySVG/WashAtOrBelow30Degrees';
import WashAtOrBelow40Degrees from '../../assets/laundrySVG/WashAtOrBelow40Degrees';
import WashAtOrBelow50Degrees from '../../assets/laundrySVG/WashAtOrBelow50Degrees';
import WashAtOrBelow60Degrees from '../../assets/laundrySVG/WashAtOrBelow60Degrees';
import WashAtOrBelow70Degrees from '../../assets/laundrySVG/WashAtOrBelow70Degrees';
import WashAtOrBelow95Degrees from '../../assets/laundrySVG/WashAtOrBelow95Degrees';
import WashAtOrBelow90Degrees from '../../assets/laundrySVG/WashAtOrBelow90Degrees';
import IroningAllowed from '../../assets/laundrySVG/IroningAllowed';
import LowHeatTumbleDry from '../../assets/laundrySVG/LowHeatTumbleDry';
import MachineWashAllowed from '../../assets/laundrySVG/MachineWash';
import MachineWashGentleOrDelicate from '../../assets/laundrySVG/MachineWashGentleOrDelicate';
import MachineWashPermanentPress from '../../assets/laundrySVG/MachineWashPermanentPress';
import NonChlorineBleach from '../../assets/laundrySVG/NonChlorineBleach';
import MediumHeatTumbleDry from '../../assets/laundrySVG/MediumHeatTumbleDry';
import NoHeatTumbleDry from '../../assets/laundrySVG/NoHeatTumbleDry';
import SoakFirst from '../../assets/laundrySVG/SoakFirst';
import TumbleDryAllowed from '../../assets/laundrySVG/TumbleDryAllowed';
import TumbleDryGentleOrDelicate from '../../assets/laundrySVG/TumbleDryGentleOrDelicate';
import TumbleDryPermanentPress from '../../assets/laundrySVG/TumbleDryPermanentPress';
import WetCleanAllowed from '../../assets/laundrySVG/WetClean';
import WetCleanDelicate from '../../assets/laundrySVG/WetCleanDelicate';
import WetCleanPermanentPress from '../../assets/laundrySVG/WetCleanPermanentPress';
import DoNotBleach from '../../assets/laundrySVG/DoNotBleach';
import DoNotBleach2 from '../../assets/laundrySVG/DoNotBleach2';
import * as fs from 'graceful-fs';
import { capitalize } from '../../common/text/capitalize';
import { ClothingCareCluster } from './ClothingCareCluster';

export function LaundryCarePopup({ popFrame, onClosing }: { popFrame: () => void; onClosing: (instructions: string[]) => void; }) {
    const [state, setState] = useState<Record<string, boolean>>({});
    const getToggler = useCallback(
        (n: string) => () => {
            setState((prev) => {
                if (Object.getOwnPropertyNames(prev).includes(n)) {
                    const { [n]: flag, ...remain } = prev;
                    return { ...remain, [n]: !flag };
                }
                return { ...prev, [n]: true };
            });
        },
        []
    );
    const register = useCallback((name: string) => {
        if (!fs.existsSync('laundry-care.json')) fs.appendFileSync('laundry-care.json', JSON.stringify({}, null, '\t'));
        const registrar = JSON.parse(fs.readFileSync('laundry-care.json').toString());
        if (!Object.getOwnPropertyNames(registrar).includes(name)) {
            fs.writeFileSync('laundry-care.json', JSON.stringify({ ...registrar, [name]: name }, null, '\t'));
        }
    }, []);
    const isSelected = useCallback((n: string) => (Object.getOwnPropertyNames(state).includes(n) ? state[n] : false), [state]);
    const instructions = useMemo(() => JSON.parse(fs.readFileSync('care-instructions.json').toString()), []);
    return (
        <div className='flex flex-col'>
            <div className='grid w-full h-full grid-cols-3 gap-x-3'>
                <ClothingCareCluster
                    register={register}
                    title='Iron'
                    elements={[
                        { SvgElement: IroningAllowed, name: 'ironing-allowed' },
                        { SvgElement: DoNotIron, name: 'do-not-iron' },
                        { SvgElement: DoNotSteam, name: 'do-not-steam' },
                        { SvgElement: SteamAsNeeded, name: 'steam-as-needed' },
                        { SvgElement: IronAt110, name: 'iron-at-110' },
                        { SvgElement: IronAt150, name: 'iron-at-150' },
                        { SvgElement: IronAt200, name: 'iron-at-200' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster
                    register={register}
                    title='Dry Clean'
                    elements={[
                        { SvgElement: DoNotDryClean, name: 'do-not-dry-clean' },
                        { SvgElement: DoNotDryClean2, name: 'do-not-dry-clean-2' },
                        { SvgElement: DryCleanAnySolvent, name: 'dry-clean-any-solvent' },
                        { SvgElement: DryCleanPceOnly, name: 'dry-clean-pce-only' },
                        { SvgElement: DryCleanPetroleumSolventOnly, name: 'dry-clean-petroleum-solvent' },
                        { SvgElement: DryCleanLowHeat, name: 'dry-clean-low-heat' },
                        { SvgElement: DryCleanReducedMoisture, name: 'dry-clean-reduced-moisture' },
                        { SvgElement: DryCleanNoSteamFinishing, name: 'dry-clean-no-steam-finishing' },
                        { SvgElement: DryCleanShortCycle, name: 'dry-clean-short-cycle' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster
                    register={register}
                    title='Tumble Dry'
                    elements={[
                        { SvgElement: TumbleDryAllowed, name: 'tumble-dry-allowed' },
                        { SvgElement: DoNotTumbleDry, name: 'do-not-tumble-dry' },
                        { SvgElement: HighHeatTumbleDry, name: 'high-heat-tumble-dry' },
                        { SvgElement: MediumHeatTumbleDry, name: 'medium-heat-tumble-dry' },
                        { SvgElement: LowHeatTumbleDry, name: 'low-heat-tumble-dry' },
                        { SvgElement: NoHeatTumbleDry, name: 'no-heat-tumble-dry' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster
                    register={register}
                    title='Wash Temperature'
                    elements={[
                        { SvgElement: WashAtOrBelow20Degrees, name: 'wash-at-or-below-20-degrees' },
                        { SvgElement: WashAtOrBelow30Degrees, name: 'wash-at-or-below-30-degrees' },
                        { SvgElement: WashAtOrBelow40Degrees, name: 'wash-at-or-below-40-degrees' },
                        { SvgElement: WashAtOrBelow50Degrees, name: 'wash-at-or-below-50-degrees' },
                        { SvgElement: WashAtOrBelow60Degrees, name: 'wash-at-or-below-60-degrees' },
                        { SvgElement: WashAtOrBelow70Degrees, name: 'wash-at-or-below-70-degrees' },
                        { SvgElement: WashAtOrBelow90Degrees, name: 'wash-at-or-below-90-degrees' },
                        { SvgElement: WashAtOrBelow95Degrees, name: 'wash-at-or-below-95-degrees' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster
                    register={register}
                    title='Machine Wash'
                    elements={[
                        { SvgElement: MachineWashAllowed, name: 'machine-wash-allowed' },
                        { SvgElement: DoNotWash, name: 'do-not-wash' },
                        { SvgElement: HandWash, name: 'hand-wash' },
                        { SvgElement: SoakFirst, name: 'soak-first' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster
                    register={register}
                    title='Drying'
                    elements={[
                        { SvgElement: Drying, name: 'drying-allowed' },
                        { SvgElement: DoNotDry, name: 'do-not-dry' },
                        { SvgElement: DoNotWring, name: 'do-not-wring' },
                        { SvgElement: DripDry, name: 'drip-dry' },
                        { SvgElement: DryInShade, name: 'dry-in-shade' },
                        { SvgElement: DripDryDryInShade, name: 'drip-dry-in-shade' },
                        { SvgElement: DryFlat, name: 'dry-flat' },
                        { SvgElement: DryFlatDryInShade, name: 'dry-flat-dry-in-shade' },
                        { SvgElement: HangToDry, name: 'hang-to-dry' },
                        { SvgElement: HangToDryDryInShade, name: 'hang-to-dry-dry-in-shade' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster
                    register={register}
                    title='Bleach'
                    elements={[
                        { SvgElement: BleachingAllowed, name: 'bleaching-allowed' },
                        { SvgElement: DoNotBleach, name: 'do-not-bleach' },
                        { SvgElement: DoNotBleach2, name: 'do-not-bleach-2' },
                        { SvgElement: BleachWithChlorine, name: 'bleach-with-chlorine' },
                        { SvgElement: NonChlorineBleach, name: 'non-chlorine-bleach' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster register={register} title='Wet Clean' elements={[{ SvgElement: WetCleanAllowed, name: 'wet-clean-allowed' }]} getToggler={getToggler} isSelected={isSelected} />

                <ClothingCareCluster
                    register={register}
                    title='Permanent Press'
                    elements={[
                        { SvgElement: DryCleanPermanentPress, name: 'dry-clean-permanent-press' },                          
                        { SvgElement: DryCleanPetroleumSolventPermanentPress, name: 'dry-clean-petroleum-solvent-permanent-press' },
                        { SvgElement: TumbleDryPermanentPress, name: 'tumble-dry-permanent-press' },
                        { SvgElement: MachineWashPermanentPress, name: 'machine-wash-permanent-press' },
                        { SvgElement: WetCleanPermanentPress, name: 'wet-clean-permanent-press' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
                <ClothingCareCluster
                    register={register}
                    title='Gentle/Delicates'
                    elements={[
                        { SvgElement: DryCleanDelicate, name: 'dry-clean-delicate' },
                        { SvgElement: DryCleanPetroleumSolventDelicate, name: 'dry-clean-petroleum-solvent-delicate' },
                        { SvgElement: TumbleDryGentleOrDelicate, name: 'tumble-dry-gentle-or-delicate' },
                        { SvgElement: MachineWashGentleOrDelicate, name: 'machine-wash-gentle-or-delicate' },
                        { SvgElement: WetCleanDelicate, name: 'wet-clean-delicate' }
                    ]}
                    getToggler={getToggler}
                    isSelected={isSelected} />
            </div>
            <div className='flex w-full'>
                <button
                    type='button'
                    onClick={() => {
                        // let instructions = CareInstructions.ctor();
                        const lines = Object.entries(state)
                            .filter((x) => x[1])
                            .map(x => instructions[x[0]])
                            .map(x => capitalize(x).concat('.'));
                        console.log(lines.join(' '));
                        onClosing(lines);
                        popFrame();
                    }}>
                    Test Submit
                </button>
            </div>
        </div>
    );
}
