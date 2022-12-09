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
    midiSettings: 'MIDI Settings',
    continue: 'Continue',
    connect: 'Connect',
    disconnect: 'Disconnect',
    back: 'Back',
    reload: 'Reload',
    settings: 'Settings',
    options: 'Opciones',
    supportMe: 'Buy me a coffee',
    layoutChooseMsg: "You've activated the {number} screens layout",
    disconnectedMsg: "Oops! we couldn't connect to the mixer, check that your mixer is turned on, also check if your device is connected to the mixer wifi, and finally check if the mixer IP is correct."
  },
  shortcutsModal: {
    title: 'Soundcraft Ui - Shortcuts',
    muteAllMsg: 'Are you sure you want to mute all channels?'
  },
  setupModal: {
    title: 'Soundcraft Ui - Setup',
    errors: {
      noModel: 'You need to define the Ui model first',
      noIP: 'The Mixer IP is mandatory'
    },
    advice: 'Please make sure your mixer is turned on, also check if you are connected to your mixer wifi, and verify that your mixer IP is correct.',
  }
};
