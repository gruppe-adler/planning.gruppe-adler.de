import Vue from 'vue';
import VueX from 'vuex';
import { Feature, User as SharedUser } from '@/services/shared';
import { Map as LeafletMap } from 'leaflet';
import FeatureService from './services/feature';

Vue.use(VueX);

interface User extends SharedUser {
    remember: boolean;
}

export interface RootState {
    sessionId: string|null;
    features: Feature[];
    user: User|null;
    map: LeafletMap|null;
    featureService: FeatureService|null;
}

export default new VueX.Store<RootState>({
    state: {
        sessionId: null,
        user: null,
        map: null,
        featureService: null,
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
        },
        setFeatureService(state, service: FeatureService) {
            state.featureService = service;
        }
    }
});
