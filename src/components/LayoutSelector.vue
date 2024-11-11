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
<!--            <div class="col-12 text-center">-->
<!--              <q-toggle-->
<!--                v-model="layoutsStore.defaultSyncID"-->
<!--                label="Sync ALL Frames"-->
<!--              />-->
<!--            </div>-->
            <div class="col-12 text-center">
              <q-expansion-item
                dense
                class="shadow-1 overflow-hidden q-my-md"
                style="border-radius: 5px"
                icon="explore"
                label="Important"
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
                      Then, set the SYNC_ID right in your mixer on each frame, and you'll have it synchronized.
                    </p>

<!--                    <p>-->
<!--                      Don't change the SYNC ID in the mixer's settings,-->
<!--                      set one or multiple ID's on the layout selector on each frame,-->
<!--                      you can pair as many frames as you want in any combination you might need.-->
<!--                    </p>-->
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
            <div @click="selectLayout('singleFrame')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">1 Frame</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="100px" />
              </div>
            </div>
            <div @click="selectLayout('doubleFrame')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">2 Frames</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.doubleFrame[0].id || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.doubleFrame[0].id" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.doubleFrame[1].id || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.doubleFrame[1].id" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
            </div>
          </div>

          <div class="col-12 q-my-lg">
            <q-separator spaced />
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6 row q-col-gutter-xs text-center" @click="selectLayout('tripleFrameV1')">
              <div class="col-12">3 Frames (v1)</div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.tripleFrameV1[0].frameIDs[0] || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.tripleFrameV1[0].frameIDs[0]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.tripleFrameV1[0].frameIDs[1] || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.tripleFrameV1[0].frameIDs[1]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.tripleFrameV1[1].id || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.tripleFrameV1[1].id" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
            </div>
            <div class="col-6 row  q-col-gutter-xs text-center" @click="selectLayout('tripleFrameV2')">
              <div class="col-12">3 Frames (v2)</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.tripleFrameV2[0].id || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.tripleFrameV2[0].id" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.tripleFrameV2[1].frameIDs[0] || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.tripleFrameV2[1].frameIDs[0]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{layoutsStore.layoutOptions.tripleFrameV2[1].frameIDs[1] || defaultID}}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.tripleFrameV2[1].frameIDs[1]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
            </div>
          </div>

          <div class="col-12 q-my-lg">
            <q-separator spaced />
          </div>

          <div class="row q-col-gutter-sm">
            <!-- Quad Frame -->
            <div @click="selectLayout('quadFrame')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">4 Frames</div>
              <div class="col-6" v-for="(frameID, index) in layoutsStore.layoutOptions.quadFrame[0].frameIDs" :key="'quadFrame-0-' + index">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{ layoutsStore.layoutOptions.quadFrame[0].frameIDs[index] || defaultID }}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.quadFrame[0].frameIDs[index]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div class="col-6" v-for="(frameID, index) in layoutsStore.layoutOptions.quadFrame[1].frameIDs" :key="'quadFrame-1-' + index">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="50px">
<!--                  <div class="absolute-center">{{ layoutsStore.layoutOptions.quadFrame[1].frameIDs[index] || defaultID }}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.quadFrame[1].frameIDs[index]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
            </div>
            <!-- Quintuple Frame V1 -->
            <div @click="selectLayout('quintupleFrameV1')" class="col-6 row  q-col-gutter-xs text-center">
              <div class="col-12">5 Frames (v1)</div>
              <div class="col-12">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px">
<!--                  <div class="absolute-center">{{ layoutsStore.layoutOptions.quintupleFrameV1[0].id || defaultID }}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.quintupleFrameV1[0].id" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div v-for="(frameID, index) in layoutsStore.layoutOptions.quintupleFrameV1[1].frameIDs" :key="'quintupleFrameV1-1-' + index" class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px">
<!--                  <div class="absolute-center">{{ frameID || defaultID }}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.quintupleFrameV1[1].frameIDs[index]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
              </div>
              <div v-for="(frameID, index) in layoutsStore.layoutOptions.quintupleFrameV1[2].frameIDs" :key="'quintupleFrameV1-2-' + index" class="col-6">
                <q-skeleton animation-speed="0" class="cursor-pointer" bordered height="33px">
<!--                  <div class="absolute-center">{{ frameID || defaultID }}</div>-->
<!--                  <q-popup-edit style="width: 10px" :disable="layoutsStore.defaultSyncID" class="q-pa-sm" v-model="layoutsStore.layoutOptions.quintupleFrameV1[2].frameIDs[index]" auto-save v-slot="scope">-->
<!--                    <q-input outlined color="teal" label="SYNC ID" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />-->
<!--                  </q-popup-edit>-->
                </q-skeleton>
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

const defaultID = 'SYNC_ID'

</script>
