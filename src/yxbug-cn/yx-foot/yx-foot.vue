<template>
  <view class="tab-bar">
    <view v-for="(item, index) in tabs" class="tab-item" @click="selectTab(index)">
      <image :src="item.iconPath" class="icon" />
      <text class="label">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import {toPages} from "@/utils/router";
import {reactive, ref, onMounted} from "vue";
import {getUrl} from "@/utils/file";

const selectedIndex = ref(0);

const tabs = reactive([
  { text: '排盘', iconPath: getUrl('static/icon/tabbar/taiji.png'), selectedIconPath: getUrl('static/icon/tabbar/taiji.png') },
  { text: '记录', iconPath: getUrl('static/icon/tabbar/notes.png'), selectedIconPath: getUrl('static/tabbar/notes.png') },
  { text: '学习', iconPath: getUrl('static/icon/tabbar/books.png'), selectedIconPath: getUrl('static/tabbar/books.png') },
  { text: '设置', iconPath: getUrl('static/icon/tabbar/setting.png'), selectedIconPath: getUrl('static/tabbar/setting.png') }
]);

const paths = ['pages/home/home', 'pages/record/index', 'pages/study/study', 'pages/settings/settings'];

const getPagePath = (index) => {
  return paths[index];
};

const selectTab = (index) => {
  if (selectedIndex.value != index) {
    toPages(getPagePath(index));
  }
};

onMounted(() => {
  const currentPages = getCurrentPages();
  const currentPage = currentPages[currentPages.length - 1];
  const currentPath = currentPage.route;
  const index = paths.indexOf(currentPath);
  if (index !== -1) {
    selectedIndex.value = index;
  }
});
</script>

<style>
.tab-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  background-color: #ffffff;
  position: fixed; /* Fix the bar to the bottom */
  bottom: 0; /* Anchor to the bottom of the screen */
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it stays above other content */
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
}
.icon {
  width: 40rpx;
  height: 40rpx;
}
.label {
  font-size: 24rpx;
}
.selected-line {
  width: 100%;
  height: 2rpx;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>