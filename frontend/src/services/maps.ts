import { makeJSONRequest } from '.';

const MAPS_URL = 'https://maps.gruppe-adler.de';

export interface Map {
    displayName: string;
    id: string;
};

export const fetchMaps = async (): Promise<Map[]> => {
    type returnType = { displayName: string, worldName: string };

    const maps = [
        { displayName: 'Altis', worldName: 'altis' },
        { displayName: 'Bukovina', worldName: 'bootcamp_acr' },
        { displayName: 'Chernarus (Autumn)', worldName: 'chernarus' },
        { displayName: 'Chernarus (Summer)', worldName: 'chernarus_summer' },
        { displayName: 'Chernarus (Winter)', worldName: 'chernarus_winter' },
        { displayName: 'Desert', worldName: 'desert_e' },
        { displayName: 'Livonia', worldName: 'enoch' },
        { displayName: 'Weferlingen', worldName: 'gm_weferlingen_summer' },
        { displayName: 'Weferlingen (Winter)', worldName: 'gm_weferlingen_winter' },
        { displayName: 'Rahmadi', worldName: 'intro' },
        { displayName: 'Lythium ,FFAA', worldName: 'lythium' },
        { displayName: 'Malden 2035', worldName: 'malden' },
        { displayName: 'Takistan Mountains', worldName: 'mountains_acr' },
        { displayName: 'Porto', worldName: 'porto' },
        { displayName: 'Prei Khmaoch Luong', worldName: 'prei_khmaoch_luong' },
        { displayName: 'Proving Grounds', worldName: 'provinggrounds_pmc' },
        { displayName: 'Ruha', worldName: 'ruha' },
        { displayName: 'Sahrani', worldName: 'sara' },
        { displayName: 'Southern Sahrani', worldName: 'saralite' },
        { displayName: 'Shapur', worldName: 'shapur_baf' },
        { displayName: 'Stratis', worldName: 'stratis' },
        { displayName: 'Takistan', worldName: 'takistan' },
        { displayName: 'Tanoa', worldName: 'tanoa' },
        { displayName: 'Anizay', worldName: 'tem_anizay' },
        { displayName: 'Cham', worldName: 'tem_cham' },
        { displayName: 'Tembelan Island', worldName: 'tembelan' },
        { displayName: 'Utes', worldName: 'utes' },
        { displayName: 'Virtual Reality', worldName: 'vr' },
        { displayName: 'Wake', worldName: 'wake' },
        { displayName: 'Rosche, Germany (1.1)', worldName: 'wl_rosche' },
        { displayName: 'Bystrica', worldName: 'woodland_acr' },
        { displayName: 'Zargabad', worldName: 'zargabad' }
    ];
    // const maps = await makeJSONRequest<returnType[]>(`${MAPS_URL}/maps`);
    // return maps.map(m => ({ displayName: m.displayName, id: m.worldName }));

    return new Promise((resolve) => {
        window.setTimeout(() => resolve(maps.map(m => ({ displayName: m.displayName, id: m.worldName }))), 2000);
    });
};

/**
 * Returns url for preview picture of given map
 * @param id id of map
 */
export const getPreviewPicture = (id: string): string => {
    return `https://maps.gruppe-adler.de/${id}/sat/thumbnail.png`;
};
