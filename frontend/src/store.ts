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
    user: User|null;
    map: LeafletMap|null;
}

export default new VueX.Store<RootState>({
    state: {
        sessionId: null,
        user: null,
        map: null,
        features: []
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
        }
    }
});
