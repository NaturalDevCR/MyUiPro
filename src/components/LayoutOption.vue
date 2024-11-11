<template>
  <div class="col-6 row text-center" @click="selectLayout">
    <div class="col-12">{{ title }}</div>
    <div v-for="(frame, index) in frames" :key="index" class="col-6">
      <q-skeleton :style="{ height: frame.height }" animation-speed="0" class="cursor-pointer" bordered>
        <div v-if="frame.id" class="absolute-center">{{ frame.id || 'SYNC_ID' }}</div>
        <q-popup-edit
          v-if="frame.id"
          :disable="syncAll"
          class="q-pa-sm"
          v-model="frame.id"
          auto-save
          v-slot="scope"
        >
          <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
        </q-popup-edit>
        <template v-else>
          <div v-for="(frameID, idx) in frame.frameIDs" :key="idx" class="absolute-center">{{ frameID || 'SYNC_ID' }}</div>
          <q-popup-edit
            v-for="(frameID, idx) in frame.frameIDs"
            :key="idx"
            :disable="syncAll"
            class="q-pa-sm"
            v-model="frame.frameIDs[idx]"
            auto-save
            v-slot="scope"
          >
            <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
          </q-popup-edit>
        </template>
      </q-skeleton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  layout: Object,
  title: String,
  syncAll: Boolean,
  onSelect: Function
});

const frames = computed(() => props.layout);
const selectLayout = () => props.onSelect();
</script>
