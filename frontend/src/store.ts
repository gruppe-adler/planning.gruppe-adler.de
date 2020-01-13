import Vue from 'vue';
import VueX from 'vuex';
import { Feature, User as SharedUser } from '@/services/shared';
import { Map as LeafletMap } from 'leaflet';

Vue.use(VueX);

interface User extends SharedUser {
    remember: boolean;
}

interface RootState {
    sessionId: string|null;
    features: Feature[];
    hiddenFeatures: string[];
    user: User|null;
    map: LeafletMap|null;
}

export default new VueX.Store<RootState>({
    state: {
        sessionId: null,
        user: null,
        map: null,
        features: [],
        hiddenFeatures: []
    },
    mutations: {
        setSessionId(state, id: string) {
            state.sessionId = id;
        },
        setUser(state, user: User) {
            state.user = user;
        },
        setFeatures(state, features: Feature[]) {
            state.features = features;
        },
        setMap(state, map: LeafletMap) {
            state.map = map;
        },
        addHiddenFeature(state, feature: Feature) {
            if (state.hiddenFeatures.includes(feature.id)) return;

            state.hiddenFeatures.push(feature.id);
        },
        removeHiddenFeature(state, feature: Feature) {
            const index = state.hiddenFeatures.indexOf(feature.id);
            if (index > -1) state.hiddenFeatures.splice(index, 1);
        }
    }
});
