<template>
    <view class="container">
      <!-- 头部 -->
      <view class="header">
        <!-- <image src="/static/icon_planet.svg" class="header-icon"></image> -->
        <text class="header-title">用户列表</text>
        <!-- <image src="/static/icon_cake.svg" class="header-icon"></image> -->
      </view>
  
      <!-- 搜索栏 -->
      <view class="search-bar">
        <input type="text" placeholder="请输入搜索的内容" class="search-input" />
        <button class="search-button">筛选</button>
      </view>
  
      <!-- 内容区域 -->
      <scroll-view class="content" style="padding-bottom: 50px;" scroll-y>
        <view v-for="(item, index) in contentItems" :key="index" class="item-view" @click="toItem(index)">
          <view class="left-section">
            <text class="case-gender">{{ item.case + ' ' + item.gender }}</text>
            <text class="date">{{ item.date }}</text>
          </view>
          <view class="right-section">
            <view class="bazi-text">
              <text>{{ item.bazi.substring(0, 4) }}</text>
              <text>{{ item.bazi.substring(4) }}</text>
            </view>
            <image :src="item.icon" class="zodiac-icon" mode="aspectFit"></image>
          </view>
        </view>
      </scroll-view>
      </view>
      <yx-foot></yx-foot>
  </template>
  
<script setup>
import {getUrl, GetChineseZodiac} from "@/utils/file";
import {computed, ref, reactive} from 'vue';
import {getLocalStorage} from "@/utils/cache";
import { toPages } from "@/utils/router";
import {useDetailStore} from "@/store/detail";
import { useBookStore } from '@/store/book';
import { usePredictStore } from '@/store/predict'; // 引入修改后的 store

const bookStore = useBookStore();
const predictStore = usePredictStore();
const detailStore = useDetailStore();

const contentItems = computed(()=>{
  const result = [];
  const examples = getLocalStorage("cases");
  for (const example of examples) {
    const bazi = example.top.year + example.top.month + example.top.day + example.top.time +
                example.bottom.year + example.bottom.month + example.bottom.day + example.bottom.time
    result.push({
      case: example.realname,
      gender: example.gender === 1 ? "男" : "女",
      date: "阳历 " + example.datetime.solar.split(" ")[0],
      bazi: bazi,
      icon: GetChineseZodiac(example.zodiac)
    });
  }
  return result;
});

function toItem(index) {
  const item = getLocalStorage("cases")[index];
  detailStore.set(item);

  const book = getLocalStorage("books")[index];
  bookStore.set(book);

  const predict = getLocalStorage("predict")[index]
  predictStore.set(predict)

  toPages("pages/detail/index");
}
</script>
  
<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #000;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f8f8f8;
}

.search-input {
  flex: 1;
  height: 60rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 30rpx;
}

.search-button {
  width: 100rpx;
  height: 60rpx;
  margin-left: 20rpx;
  background-color: #fff;
  border: 1px solid #d4a373;
  color: #d4a373;
  font-size: 24rpx;
  border-radius: 30rpx;
}

.content {
  flex: 1; /* 占据剩余空间 */
  height: 1000rpx; /* 固定高度，确保可滚动，实际开发中可动态调整 */
}

.item-view {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 3px solid #eee;
}

.left-section {
  display: flex;
  flex-direction: column;
}

.case-gender {
  font-size: 32rpx;
  color: #333;
}

.date {
  font-size: 28rpx;
  color: #666;
  margin-top: 10rpx;
}

.right-section {
  display: flex;
  align-items: center;
}

.bazi-text {
  margin-right: 20rpx;
  text-align: center;
}

.bazi-text text {
  display: block;
  font-size: 24rpx;
  color: #0066cc;
}

.zodiac-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #000;
}

.footer {
  padding: 10rpx 0;
  border-top: 1px solid #eee;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-icon {
  width: 40rpx;
  height: 40rpx;
}

.tab-text {
  font-size: 22rpx;
  color: #666;
}
</style>