<template>
  <view>
    <u-tabs
        v-model="current"
        :list="bookStore.books"
        name="title"
        swiper
    ></u-tabs>
    <yx-sheet :margin="[0, 0]" :padding="[30, 10]">
      <!-- 显示 tab 的内容 -->
      <view v-for="item in bookStore.books[current]?.content" class="u-m-b-40">
        <view v-if="item.title" class="u-p-b-10">
          <text class="yx-text-weight-b u-font-28 u-type-warning-dark">{{ item.title }}</text>
        </view>
      </view>
      <!-- 如果当前 tab 无预测数据，显示按钮 -->
      <view class="u-p-30" v-if="!predictStore.getPrediction(current)">
        <u-button type="primary" @click="Computed(current)">点 击 测 算</u-button>
      </view>
      <!-- 显示预测数据 -->
      <view v-else>
        <view v-for="item in predictStore.getPrediction(current)" class="u-m-b-40">
          <view class="u-flex u-m-b-20">
            <text class="yx-text-weight-b u-font-28">{{ item.title }}</text>
          </view>
          <view v-for="litem in item.data">
            <view>
              <text class="yx-text-weight-b u-font-26">{{ litem.label }}</text>
            </view>
            <view class="u-m-t-10 u-m-b-20">
              <text class="u-font-26" decode>{{ litem.content }}</text>
            </view>
          </view>
        </view>
      </view>
    </yx-sheet>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useBookStore } from '@/store/book';
import { usePredictStore } from '@/store/predict'; // 引入修改后的 store
import { GetPrediction } from '@/api/default';
import { useDetailStore } from '@/store/detail';

const bookStore = useBookStore();
const predictStore = usePredictStore();
const detailStore = useDetailStore();

const current = ref(0);

// 获取并存储预测数据
function Computed(tabIndex) {
  uni.showLoading({
    title: '网络请求中！',
  });
  GetPrediction(detailStore.defaultPredictPayload(tabIndex))
    .then((res) => {
      predictStore.setPrediction(tabIndex, res); // 存储到 Pinia store
      uni.hideLoading();
    })
    .catch(() => {
      uni.hideLoading();
      setTimeout(() => {
        uni.$u.toast('网络请求失败！');
      }, 5000);
    });
}
</script>
