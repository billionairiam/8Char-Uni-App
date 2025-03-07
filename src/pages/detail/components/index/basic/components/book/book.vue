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
      <view class="u-p-30" v-if="!checkExist(current)">
        <u-button
          type="primary"
          :loading="isLoading"
          @click="startPrediction(current)"
        >
          {{ isLoading ? '测算中...' : '点 击 测 算' }}
        </u-button>
      </view>

      <!-- 显示预测数据 -->
      <view v-else>
        <!-- <view v-for="item in predictStore.getPrediction(current)" class="u-m-b-40"> -->
          <view class="u-flex u-m-b-20">
            <text class="yx-text-weight-b u-font-28">{{ checkExist(current).title }}</text>
          </view>
          <!-- <view v-for="litem in item.data">
            <view>
              <text class="yx-text-weight-b u-font-26">{{ litem.label }}</text>
            </view>
            <view class="u-m-t-10 u-m-b-20">
              <text class="u-font-26" decode>{{ litem.content }}</text>
            </view>
          </view> -->
        </view>
      <!-- </view> -->
    </yx-sheet>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useBookStore } from '@/store/book';
import { usePredictStore } from '@/store/predict';
import { useDetailStore } from '@/store/detail';

const bookStore = useBookStore();
const predictStore = usePredictStore();
const detailStore = useDetailStore();

const current = ref(0);
const isLoading = ref(false);
let socketTask = null;

//初始化预测数据结构
const initPrediction = (tabIndex) => {
  if (tabIndex === 0) {
    predictStore.set({
      wealth : {
        title: "事业与财运"
      }
    });
  }

  if (tabIndex === 1) {
    predictStore.set({
      education : {
        title: "学业与学历"
      }
    });
  }

  if (tabIndex === 2) {
    predictStore.set({
      health : {
        title: "健康状况"
      }
    });
  }

  if (tabIndex === 3) {
    predictStore.set({
      emotion : {
        title: "感情与婚姻"
      }
    });
  }

  if (tabIndex === 4) {
    predictStore.set({
      parents : {
        title: "六亲情况"
      }
    });
  }

  if (tabIndex === 5) {
    predictStore.set({
      child : {
        title: "子女情况"
      }
    });
  }
};

const checkExist = (tabIndex) => {
  if (tabIndex === 0) {
    return predictStore.wealth;
  }

  if (tabIndex === 1) {
    return predictStore.education;
  }

  if (tabIndex === 2) {
    return predictStore.health;
  }

  if (tabIndex === 3) {
    return predictStore.emotion;
  }

  if (tabIndex === 4) {
    return predictStore.parents;
  }

  if (tabIndex === 5) {
    return predictStore.child;
  }
}

const setTitle = (tabIndex, data) => {
  if (tabIndex === 0) {
    predictStore.wealth.title += data;
  }

  if (tabIndex === 1) {
    predictStore.education.title += data;
  }

  if (tabIndex === 2) {
    predictStore.health.title += data;
  }

  if (tabIndex === 3) {
    predictStore.emotion.title += data;
  }

  if (tabIndex === 4) {
    predictStore.parents.title += data;
  }

  if (tabIndex === 5) {
    predictStore.child.title += data;
  }
}

// 核心预测方法
const startPrediction = async (tabIndex) => {
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    initPrediction(tabIndex);
    // 创建WebSocket连接
    socketTask = uni.connectSocket({
      url: 'wss://0x311008.com/8char/get-prediction',
      complete: () => {}
    });

    // 监听事件
    socketTask.onOpen(() => {
      socketTask.send({
        data: JSON.stringify(detailStore.defaultPredictPayload(tabIndex)),
        success: () => console.log('请求发送成功'),
        fail: (err) => {
          throw new Error('请求发送失败');
        }
      });
    });

    socketTask.onMessage(res => {
      console.log(res.data)
      setTitle(tabIndex, res.data);
    });

    socketTask.onClose(() => {
      isLoading.value = false;
      socketTask = null;
    });

    socketTask.onError(err => {
      throw new Error(`连接错误: ${err.errMsg}`);
    });

  } catch (err) {
    uni.$u.toast(err.message || '预测失败');
    isLoading.value = false;
    socketTask?.close();
  }
};

</script>
