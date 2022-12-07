import {isIPv4} from 'is-ip';
const allowedURLs:Array<string> = [
  'https://soundcraft.com/ui-demo/mixer.html', // Ui12 / Ui16
  'https://www.soundcraft.com/ui-demo/mixer.html', // Ui12 / Ui16
  'https://soundcraft.com/ui24-software-demo/mixer.html', // Ui24r
  'https://www.soundcraft.com/ui24-software-demo/mixer.html' // Ui24r
]

export const isAllowedURL = (url:string) => {
  return allowedURLs.includes(url)
}

export const isValidMixerIp = (ip:string) => {
  return isIPv4(ip) || isAllowedURL(ip)
}

export const reload = (isHardReload = false) => {
  if (isHardReload) {
    localStorage.clear();
    sessionStorage.clear();
  }
  location.reload();
}
