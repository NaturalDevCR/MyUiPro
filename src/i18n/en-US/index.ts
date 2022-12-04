// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  connectionStatus: {
    'OPENING': 'Initializing',
    'OPEN': 'Connected',
    'CLOSING': 'Disconnecting',
    'CLOSE': 'Disconnected',
    'ERROR': 'Error',
    'RECONNECTING': 'Reconnecting'
  },
  validation: {
    required: 'This field is required',
    invalidIP: 'The IP is invalid'
  },
  misc: {
    continue: 'Continue',
    disconnect: 'Disconnect',
    back: 'Back',
    reload: 'Reload',
    settings: 'Settings',
    options: 'Opciones',
    layoutChooseMsg: "You've activated the {number} screens layout",
    disconnectedMsg: "Oops! we couldn't connect to the mixer, check that your mixer is turned on, also check if your device is connected to the mixer wifi, and finally check if the mixer IP is correct."
  },
  setupModal: {
    title: 'Soundcraft Ui - Setup',
    errors: {
      noModel: 'You need to define the Ui model first',
      noIP: 'The Mixer IP is mandatory'
    },
    stepper: {
      step1: {
        title: 'Ui Model',
        text: 'Please select your Soundcraft Ui Mixer model'
      },
      step2: {
        title: 'Mixer IP',
        text: 'First, make sure you are connected to your mixer wifi, then configure the mixer IP; The default IP usually is: 10.10.1.1'
      },
      step3: {
        title: 'Done!',
        text: "Great!, you have completed the app setup, please make sure your mixer is turned on, your device is connected to your mixer WiFi, and the ip you have configured is correct in order to connect, if you delete the app, or clear the cache, you'll have to reconfigure this app to connect again."
      }
    }
  }
};
