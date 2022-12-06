<template>
  <q-dialog
    v-model="mixerStore.layoutsEditModal"
    persistent
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="background: #343434" class="text-white">
      <q-bar style="height: 50px">
        <q-space />
        <div>
          {{$t('shortcutsModal.title')}}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="row">
        <q-input
          :rules="[val => val <= 100 || 'El valor máximo es 100%']"
          outlined
          class="col-12 col-md-6"
          mask="#"
          fill-mask="0"
          reverse-fill-mask
          dark
          label="Top frame size"
          v-model="layouts[2].a.size"
          suffix="%"
          input-class="text-right"
          hint="Select the proportion"
        />
        <q-input
          outlined
          class="col-12 col-md-6"
          mask="#"
          fill-mask="0"
          reverse-fill-mask
          dark
          label="Top frame"
          v-model="layouts[2].a.size"
          suffix="%"
          input-class="text-right"
          hint=""
        />

      </q-card-section>
      <q-separator dark class="" />
      <q-card-actions class="row justify-center q-mb-md">
        <span class="text-center col-12 text-bold q-mt-md">My Ui Pro - v{{commonStore.version}}</span>
        <span class="text-center col-12">Made with ♥ by Josue Orozco A. | Costa Rica | Natural Cloud | @2022</span>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useMixerStore} from 'stores/mixer-store';
import {useCommonStore} from 'stores/common-store';
const commonStore = useCommonStore()

const mixerStore = useMixerStore()
const tab = ref<string>('mutes')

const layouts = ref<object>({
  2: {
    a: {
      size: '50%',
      type: 'big'
    },
    b: {
      size: '50%',
      type: 'big'
    }
  },
  3: {
    a: {
      size: '50%',
      type: 'big'
    },
    b: {
      size: '50%',
      type: 'big'
    },
    c: {
      size: '50%',
      type: 'big'
    }
  },
  4: {
    a: {
      size: '50%',
      type: 'big'
    },
    b: {
      size: '50%',
      type: 'big'
    },
    c: {
      size: '50%',
      type: 'big'
    },
    d: {
      size: '50%',
      type: 'big'
    }
  },
  5: {
    a: {
      size: '50%',
      type: 'big'
    },
    b: {
      size: '50%',
      type: 'big'
    },
    c: {
      size: '50%',
      type: 'big'
    },
    d: {
      size: '50%',
      type: 'big'
    },
    e: {
      size: '50%',
      type: 'big'
    }
  },
})
</script>
