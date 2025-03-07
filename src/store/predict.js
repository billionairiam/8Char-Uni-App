import { defineStore } from 'pinia';

export const usePredictStore = defineStore('predict', {
    state: () => {
        return {
            predictions: {
                wealth: {
                    title:""
                },
                education: {
                    title:""
                },
                health: {
                    title:""
                },
                emotion: {
                    title:""
                },
                parents: {
                    title:""
                },
                child: {
                    title:""
                },
            }
        };
    },
    actions: {
        set(data) {
            for (let key in data) {
                this[key] = data[key];
            }
        },
    },
});
