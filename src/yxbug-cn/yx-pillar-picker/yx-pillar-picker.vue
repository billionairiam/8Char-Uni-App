<template>
  <u-popup
      ref="drawer"
      v-model="show"
      mode="bottom"
      placement="bottom"
      @close="close"
      @update:show="show = $event"
  >
    <view class="u-text-center u-m-y-30">
      <text class="yx-text-weight-b">{{ isPillar ? '请选择四柱进行检索' : '选择时间进行排盘' }}</text>
    </view>

    <view v-if="isPillar">
      <u-tabs v-model="tabCurrent" swiper :list="tabs.list" :show-bar="false" class="u-m-b-20" @change="tabsChange"></u-tabs>

      <view class="u-flex u-row-top-center u-p-x-30" style="flex-flow: row wrap;">
        <view
            v-for="(item, index) in pillar"
            :key="item + index"
            class="u-m-b-20 u-flex u-row-center u-col-center"
            style="width:25%;"
            @click="pickerClick(index)"
        >
          <view class="pillar-title">
            <text class="u-line-1 u-font-38">{{item}}</text>
          </view>
        </view>
      </view>

      <view class="u-p-30">
        <u-button type="primary" @click="getPillar">检索四柱</u-button>
      </view>
    </view>

    <view v-else>
      <view class="u-picker-body">
        <picker-view :value="time.current" class="u-picker-view" indicator-style="height:100rpx;">
          <picker-view-column>
            <view v-for="(item, index) in time.list" :key="index" class="u-column-item">
              <view class="u-line-1">{{ item.text }}</view>
            </view>
          </picker-view-column>
        </picker-view>
      </view>

      <view class="u-p-30">
        <u-button type="primary" @click="confirm">确认选择</u-button>
      </view>

    </view>
  </u-popup>
</template>

<script setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {LunarUtil, Solar} from "lunar-javascript";
import {deleteFirstElement} from "@/utils/transform";

const TOPS = deleteFirstElement(LunarUtil.GAN);
const TOPS_YANG = ["甲", "丙", "戊", "庚", "壬"];
const TOPS_YING = ["乙", "丁", "己", "辛", "癸"];

const BOTTOMS = deleteFirstElement(LunarUtil.ZHI);
const BOTTOMS_YANG = ['子', '寅', '辰', '午', '申', '戌'];
const BOTTOMS_YING = ['丑', '卯', '巳', '未', '酉', '亥'];

const drawer = ref();

const emits = defineEmits(["confirm"]);
const props = defineProps({
  defaultValue: {
    type: String,
    default: "",
  },
});

const show = ref(false);
const pickerCurrent = ref(0);

const isPillar = ref(true);

const pillar = ref(retriveEightChar(props.defaultValue));

const tabCurrent = ref(0);

const tabs = ref({
  list:[],
  current:0,
})

const time = ref({
  list:[],
  current:[0]
})

watch(
    () => props.defaultValue,
    (val) => {
      if (val !== "" && val.length === 8) {
        pillar.value = val.split("");
      }
    },
);

onMounted(() => {
  const model = pickerCurrent.value > 3 ? BOTTOMS : TOPS;
  pullTabsList(model)
  pullTabs(0);
});

function pickerClick(i) {
  pickerCurrent.value = i;
  pullTabs(i);
}

function retriveEightChar(eightChar) {
  const groups = eightChar.split(" ");
  // 用来存放天干和地支
  const tiangan = [];
  const dizhi = [];

  for(var i = 0; i < groups.length; i++) {
    tiangan.push(groups[i][0]);
    dizhi.push(groups[i][1]);
  }

  const result = tiangan.concat(dizhi);
  return result;
}

function confirm() {
  const index = time.value.current[0];
  isPillar.value = true;
  emits("confirm", time.value.list[index]);
  drawer.value.close();
}

function open(){
  show.value = true;
}

function close() {
  isPillar.value = true;
  time.value.value = [];
}

function pullTabs(e) {
  const model = e > 3 ? (TOPS_YANG.includes(pillar.value[e-4]) ? BOTTOMS_YANG : BOTTOMS_YING) : TOPS;
  pullTabsList(model)
  nextTick();
  tabsChange(model.indexOf(pillar.value[e]));
}

function pullTabsList(model){
  const list = [];
  for (let key of model) {
    list.push({name: key});
  }
  tabs.value.list = list;
}

function tabsChange(e) {
  tabCurrent.value = e;
  const picker = pickerCurrent.value;
  if (tabs.value.list[e]?.name) {
    // 根据所选 tab 的内容更新 pillar 数组对应位置的值
    pillar.value[picker] = tabs.value.list[e]?.name;
    if (picker <= 3) {
      if (TOPS_YANG.includes(pillar.value[picker]) && BOTTOMS_YING.includes(pillar.value[picker+4])) {
        pillar.value[picker+4] = BOTTOMS_YANG[0];
      }

      if (TOPS_YING.includes(pillar.value[picker]) && BOTTOMS_YANG.includes(pillar.value[picker+4])) {
        pillar.value[picker+4] = BOTTOMS_YING[0];
      }
    }
  }
}

function getPillar() {
  const list = pillar.value;
  const option = {
    year:list[0] + list[4],
    month:list[1] + list[5],
    day:list[2] + list[6],
    time:list[3] + list[7]
  };
  uni.showLoading({
    title:"检索四柱中！"
  })

  setTimeout(()=>{
    const result = Solar.fromBaZi(option.year, option.month, option.day, option.time, 2, 0);
    if (result.length) {
      const list = [];
      for(let item of result){
        const datetime = item.toYmdHms();
        list.push({text: datetime, value: new Date(datetime).getTime()});
      }
      time.value.list = list;
      isPillar.value = false;
    } else {
      setTimeout(()=>{
        uni.$u.toast("暂无匹配当前四柱的时间，请检查是否正确！",5000);
      },800)
    }
    uni.hideLoading()
  },1000)
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.u-picker-body {
  width: 100%;
  height: 500rpx;
  overflow: hidden;
  background-color: #fff;
}

.u-picker-view {
  height: 100%;
  box-sizing: border-box;
}

.u-column-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: $u-main-color;
  padding: 0 8rpx;
}

.pillar-title{
  /* #ifndef APP-NVUE */
  display: inline-flex;
  /* #endif */
  align-items: center;
  justify-content: center;
  color: #F8F8F8;
  position: relative;

  height: 90rpx;
  width: 90rpx;
  flex: 0 0 90rpx;
  background-color: rgb(41, 121, 255);
  border-radius: 100%;
  padding: 0 6rpx;
}
</style>
