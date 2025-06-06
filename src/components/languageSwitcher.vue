<template>
  <q-fab
    v-show="!$q.platform.is.mobile"
    class="orientation-landscape"
    padding="5px"
    direction="down"
    color="dark"
    icon="mdi-earth"
  >
    <q-fab-action @click="commonStore.lang = 'es'" square padding="5px" class="text-center bg-dark">
      <div class="text-center row content-center justify-center items-center">
        <country-flag country='cr' size='normal'/>
        Español
      </div>
    </q-fab-action>
    <q-fab-action @click="commonStore.lang = 'en'" square padding="5px" class="text-center bg-dark">
      <div class="text-center row content-center justify-center items-center">
        <country-flag country='us' size='normal'/>
        English
      </div>
    </q-fab-action>
  </q-fab>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
import {useCommonStore} from 'stores/common-store';
const commonStore = useCommonStore()
import { useI18n } from 'vue-i18n'
import {watch} from 'vue';
const { locale } = useI18n({ useScope: 'global' })

watch(() => commonStore.lang, lang => {
  setLang(lang!)
})

const setLang = (lang:string) => {
  locale.value = ['en', 'es'].includes(lang) ? lang : 'en'
}
</script>
