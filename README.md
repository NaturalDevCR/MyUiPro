# My Ui Pro (my-ui-pro)

Soundcraft Ui Multiframe Interface

## What is this?
With My Ui Pro you can use your Soundcraft Ui Mixer with multiple frames on a single screen.

It is also possible to control some aspects of the mixer using a shortcuts modal window (on development)

## Compatibility
IT should work on the 3 Ui models right away (Ui12, Ui16, Ui24r), but I personally only have a Ui16, so it's only tested widely on that model, you can try by yourself with your Ui mixer and let me know if there's something missing.

## Get started
* Download the latest HTML file in the releases page.
* Connect your device to the mixer network (wifi or wired).
* Open the downloaded HTML file
* Set your mixer's IP address in the setup window
* Play around with the options.

## Did you lost your Mixer access password?
Usually if you forget your mixer's password, you'll need to reset the password with a USB drive, and a txt file...

But with My Ui Pro app you can recover it easily, just follow the get started instructions to connect to your mixer, then click on the settings button in the top right of the screen (within the My Ui Pro top bar) and you'll see in the setup screen a big red button labeled **SHOW MASTER PASSWORD**, click on it, and you'll be able to see your current password.

### **How the heck can this be possible?**

Well, the guys from Soundcraft expose it in plain text, and it can be retrieved with ease by just connecting to the mixer via websocket connection.


## Limitations
* Keyboard shortcuts won't work and will never work, this is a known limitation for iframes.
* HTML single file version works only on Chrome and Edge, Appearently some firefox versions seem to have problems reported by users

## Build for local access without a server
`yarn run build:spa`

## Tested on
 * Ui16
 * Chrome
 * Firefox

## Working on
* MIDI support (this is in a very alpha state):
The idea is to be able to map some functions to midi devices.
* Shortcuts Modal Window:
A modal window where you'll have some shortcuts ready to use
* Design your own multi-frame layouts

## Want to support my job?
### [Buy me a coffee](https://www.paypal.com/donate/?hosted_button_id=A8MKF5RNGQ77U).

## Credits
Make sure you check and say thanks to @fmalcher for his [Connection Library](https://github.com/fmalcher/soundcraft-ui/tree/main/packages/mixer-connection). which I'm using to connect to the mixer
and don't forget you support his awesome job! ;)

## Want to join the Ui Community?
[Soundcraft Ui24r Community](https://www.facebook.com/groups/SoundcraftUimixerusers)
<br/>
[Soundcraft Ui12/16 Community](https://www.facebook.com/groups/SoundcraftUi16Users)
<br/>
[Soundcraft Comunidad en Español](https://www.facebook.com/groups/1793309550686408)
