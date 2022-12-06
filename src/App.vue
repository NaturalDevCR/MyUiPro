<template>
  <router-view />
</template>

<script setup lang="ts">
import {useQuasar} from 'quasar';
import {useCommonStore} from 'stores/common-store';
import {onMounted} from 'vue';
import {useI18n} from 'vue-i18n';

const { locale } = useI18n({ useScope: 'global' })

const $q = useQuasar()
const commonStore = useCommonStore()
onMounted(() => {
  if (!commonStore.lang){
    const quasarLocale:string = $q.lang.getLocale()?.substring(0, 2) || 'en'
    commonStore.lang = quasarLocale
  }else {
    locale.value = ['en', 'es'].includes(commonStore.lang) ? commonStore.lang : 'en'
  }
})
</script>
