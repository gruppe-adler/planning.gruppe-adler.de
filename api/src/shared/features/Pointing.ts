import Feature from './Feature';
import { User } from '../users';

export default interface Pointing extends Feature {
    type: 'pointing';

    /** user pointing belongs to */
    user: User;

    /** position [latitude, longitude] */
    pos: [number, number];
};
