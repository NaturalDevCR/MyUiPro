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
  $q.dark.set(true)
  if (!commonStore.lang){
    commonStore.lang = $q.lang.getLocale()?.substring(0, 2) || 'en'
  }else {
    locale.value = ['en', 'es'].includes(commonStore.lang) ? commonStore.lang : 'en'
  }
})
</script>
