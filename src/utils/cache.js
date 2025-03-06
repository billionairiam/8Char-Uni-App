import { CACHE_PREFIX } from "@/config";

// 获取带前缀的键
export const getPrefixKey = key => {
    return `${CACHE_PREFIX}-${key}`;
};

// 设置本地存储（支持直接覆盖）
export const setLocalStorage = (key, value) => {
    uni.setStorageSync(getPrefixKey(key), value);
};

// 新增方法：向存储的数组中 push 数据
export const pushToLocalStorage = (key, item) => {
    // 先获取当前存储的值
    let currentValue = uni.getStorageSync(getPrefixKey(key));
    
    // 如果没有值或不是数组，初始化为数组
    if (!currentValue || !Array.isArray(currentValue)) {
        currentValue = [];
    }
    
    // 将新元素 push 到数组中
    currentValue.push(item);
    
    // 存储更新后的数组
    uni.setStorageSync(getPrefixKey(key), currentValue);
};

// 获取本地存储
export const getLocalStorage = key => {
    return uni.getStorageSync(getPrefixKey(key));
};

// 删除本地存储
export const deleteLocalStorage = key => {
    uni.removeStorageSync(getPrefixKey(key));
};

// 清除所有带前缀的本地存储
export const clearLocalStorage = () => {
    const { keys } = uni.getStorageInfoSync();
    for (let key of keys) {
        if (key.indexOf(CACHE_PREFIX) === 0) {
            uni.removeStorageSync(key);
        }
    }
};
