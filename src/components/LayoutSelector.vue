<template>
  <q-dialog :full-height="$q.platform.is.mobile" v-model="commonStore.modal.layoutSelector">
    <q-card style="width: 500px;">
      <q-card-section class="row items-center">
        <div class="text-h6">Layout Selector</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <q-scroll-area dark class="q-pa-sm" :visible="false" style="height: 600px; max-width: 500px;">
          <div class="row q-col-gutter-sm">
            <div class="col-12 text-center">
              <q-expansion-item
                dense
                class="shadow-1 overflow-hidden q-my-md"
                style="border-radius: 5px"
                icon="explore"
                label="Sync Frames"
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
            <div @click="selectLayout('one')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">1 Frame</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="100px" />
              </div>
            </div>
            <div @click="selectLayout('two')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">2 Frames</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
          </div>

          <div class="col-12 q-my-lg">
            <q-separator spaced />
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6 row q-col-gutter-xs text-center" @click="selectLayout('threeV1')">
              <div class="col-12">3 Frames (v1)</div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
            <div class="col-6 row  q-col-gutter-xs text-center" @click="selectLayout('threeV2')">
              <div class="col-12">3 Frames (v2)</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
          </div>

          <div class="col-12 q-my-lg">
            <q-separator spaced />
          </div>

          <div class="row q-col-gutter-sm">
            <!-- Quad Frame -->
            <div @click="selectLayout('four')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">4 Frames</div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
            <!-- Quintuple Frame V1 -->
            <div @click="selectLayout('fiveV1')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">5 Frames (v1)</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px" />
              </div>
            </div>
          </div>
        </q-scroll-area>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useCommonStore} from 'stores/common-store';
import {useLayoutsStore} from 'stores/layouts-store';

const commonStore = useCommonStore()
const layoutsStore = useLayoutsStore()

const selectLayout = (value:any) => {
  layoutsStore.selectedLayout = layoutsStore.layoutOptions[value]
}

</script>
