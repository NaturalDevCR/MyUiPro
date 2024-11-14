<template>
  <q-dialog :full-height="$q.platform.is.mobile" v-model="commonStore.modal.layoutSelector">
    <q-card style="width: 500px;">
      <q-card-section class="row items-center">
        <div class="text-h6">Layout Selector</div>
        <q-space />
        <q-btn icon="mdi-close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <q-scroll-area dark class="q-pa-sm" :visible="false" style="height: 500px; max-width: 500px;">
          <div class="row q-col-gutter-sm">
            <div class="col-12 text-center">
              <q-expansion-item
                dense
                class="shadow-1 overflow-hidden q-my-md"
                style="border-radius: 5px"
                icon="mdi-sync"
                label="Sync Frames"
                expand-icon="mdi-arrow-down"
                header-class="bg-black text-white"
                expand-icon-class="text-white"
              >
                <q-card>
                  <q-card-section>
                    <p>
                      For the SYNC Frames function to work, you need to activate
                      the feature in your mixer settings first. Settings => Local => turn Sync Selected Channel <b>ON</b>.
                    </p>
                    <p>
                      Then, set the SYNC_ID right in your mixer on each frame, you can have multiple frames synced in
                      groups or all together please, refer to your mixer manual for more information.
                    </p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>

            <div v-for="(layout, key) in layoutsStore.layoutOptions" :key="key" class="col-6 row q-col-gutter-xs text-center">
              <div class="col-12">{{ titleMap[key.toString()] }}</div>
              <div @click="selectLayout(key)" v-for="(section, index) in layout" :key="index" class="col-12 row">
                <template v-if="section.subFrames">
                  <div v-for="subFrameIndex in section.subFrames" :key="subFrameIndex" :class="section.selector.class">
                    <q-skeleton animation-speed="0" class="cursor-pointer" bordered :height="section.selector.height" />
                  </div>
                </template>
                <div v-else :class="section.selector.class">
                  <q-skeleton animation-speed="0" class="cursor-pointer" bordered :height="section.selector.height" />
                </div>
              </div>
              <div class="col-12">
                <q-separator spaced />
              </div>
            </div>

          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useCommonStore } from 'stores/common-store';
import { useLayoutsStore } from 'stores/layouts-store';

const commonStore = useCommonStore();
const layoutsStore = useLayoutsStore();

const selectLayout = (value: any) => {
  layoutsStore.selectedLayout = layoutsStore.layoutOptions[value];
};

const titleMap:any = {
  one: '1 Frame',
  two: '2 Frames',
  threeV1: '3 Frames (v1)',
  threeV2: '3 Frames (v2)',
  four: '4 Frames',
  fiveV1: '5 Frames (v1)',
  fiveV2: '5 Frames (v2)',
  fiveV3: '5 Frames (v3)',
  sixV1: '6 Frames (v1)',
  sixV2: '6 Frames (v2)',

}
</script>
