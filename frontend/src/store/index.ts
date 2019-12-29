import Vue from 'vue';
import VueX from 'vuex';

Vue.use(VueX);

interface User {
    name: string;
    color: string;
    remember: boolean;
}

interface RootState {
    sessionId: string|null;
    user: User|null
}

export default new VueX.Store<RootState>({
    state: {
        sessionId: null,
        user: null
    },
    mutations: {
        setSessionId(state, id: string) {
            state.sessionId = id;
        },
        setUser(state, user: User) {
            state.user = user;
        }
    }
});
