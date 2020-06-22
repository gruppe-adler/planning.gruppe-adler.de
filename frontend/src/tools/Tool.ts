import { GradMap } from '@gruppe-adler/maps-frontend-utils';

export default abstract class Tool extends EventTarget {
    protected map: GradMap;

    constructor(m: GradMap) {
        super();
        this.map = m;

        this.setup();
    }

    protected abstract setup(): void;
    public abstract destroy(): void;
}
