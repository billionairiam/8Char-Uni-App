import { defineStore } from 'pinia';

export const usePredictStore = defineStore('predict', {
    state: () => {
        return {
            predictions: {} // 存储结构：{ 0: 数据, 1: 数据, ... }
        };
    },
    actions: {
        setPrediction(tabIndex, data) {
            this.predictions[tabIndex] = data; // 设置指定 tab 的数据
        },
        getPrediction(tabIndex) {
            return this.predictions[tabIndex] || null; // 获取指定 tab 的数据，无数据返回 null
        }
    },
});
