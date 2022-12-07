# My Ui Pro (my-ui-pro)

Soundcraft Ui Interface

## Intro
This App has been made with the purpose of showing multiple frames in a single window to access the Ui interface, you can also switch between layers.

It's also possible to access quick shortcuts to interact directly with the Ui.

## Compatibility
IT should work on the 3 Ui models right away (Ui12, Ui16, Ui24r)

## Known bugs
Let me know if you find any.

## Feeling generous?
### [Buy me a coffee](https://www.paypal.com/donate/?hosted_button_id=A8MKF5RNGQ77U).

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

## Build for local access without a server
```bash
# ./quasar.config.js

vitePlugins: [
        //viteSingleFile(), //Uncomment to create an inlined single html file and run the app without a web server // Remember to fix assets routes from / to ./ directly in the html file
        ...
```

## Limitations
* Keyboard shortcuts won't work, this is due to iframes cross-origin limitation.
* HTML single file version works only on Chrome and Edge, Appearently some firefox versions seem to have problems reported by users

## Tested on
 * Ui16
 * Chrome v108.0.5359.94
 * Firefox v107.0.1

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Credits
Watch and say thanks to @fmalcher for his [Connection Library](https://github.com/fmalcher/soundcraft-ui/tree/main/packages/mixer-connection).

## Want to join the Ui Community?
[Soundcraft Ui24r Community](https://www.facebook.com/groups/SoundcraftUimixerusers)
<br/>
[Soundcraft Ui12/16 Community](https://www.facebook.com/groups/SoundcraftUi16Users)
<br/>
[Soundcraft Comunidad en Español](https://www.facebook.com/groups/1793309550686408)
