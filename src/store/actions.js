import axios from 'axios';

const FIREBASE_URL = 'https://us-central1-gamebrary-8c736.cloudfunctions.net';

export default {
    LOAD_GAMES({ commit }, gameList) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/games?games=${gameList}`)
                .then(({ data }) => {
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_PUBLIC_GAMES({ commit }, gameList) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/games?games=${gameList}`)
                .then(({ data }) => {
                    commit('SET_PUBLIC_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_GAME({ commit }, gameId) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/game?gameId=${gameId}`)
                .then(({ data }) => {
                    commit('SET_ACTIVE_GAME', data);
                    resolve();
                }).catch(reject);
        });
    },

    SEARCH({ commit, state }, searchText) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/search?searchText=${searchText}&platformId=${state.platform.id}`)
                .then(({ data }) => {
                    commit('SET_SEARCH_RESULTS', data);
                    commit('CACHE_GAME_DATA', data);
                    resolve();
                }).catch(reject);
        });
    },

    LOAD_PLATFORM({ state }) {
        return new Promise((resolve, reject) => {
            axios.get(`${FIREBASE_URL}/platform?&platformId=${state.platform.id}`)
                .then(({ data }) => {
                    resolve(data);
                }).catch(reject);
        });
    },
};
