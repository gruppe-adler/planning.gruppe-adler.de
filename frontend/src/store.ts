import Vue from 'vue';
import VueX from 'vuex';
import { Feature } from '@/services/shared';

Vue.use(VueX);

interface User {
    name: string;
    color: string;
    remember: boolean;
}

interface RootState {
    sessionId: string|null;
    features: Feature[];
    user: User|null
}

export default new VueX.Store<RootState>({
    state: {
        sessionId: null,
        user: null,
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
        }
    }
});
