import { boot } from 'quasar/wrappers'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app}) => {
  // something to do
  app.use(autoAnimatePlugin);

})
