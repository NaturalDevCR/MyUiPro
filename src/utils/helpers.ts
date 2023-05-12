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

export const velocityToToggle: any = {
  0: 0,
  127: 1,
}
export const toggleToVelocity: any = {
  0: 0,
  1: 127
}


const velocityRange = {
  min: 0,
  max: 127,
}

export const velocityToPercentage = (velocity: number) => {
  const { min, max } = velocityRange;
  return (velocity - min) / (max - min) * 100;
};

export const percentageToVelocity = (percentage: number) => {
  const { min, max } = velocityRange;
  return min + (percentage / 100) * (max - min);
};

const mixerRanges:any = {
  level: {
    min: -101, //A lower value to match the mixer 0 fader position maybe?
    max: 10,
  },
  gain: {
    min: -40,
    max: 63
  }
}

export const dbToPercentage = (db: number, type: string) => {
  const { min, max } = mixerRanges[type];
  return (db - min) / (max - min) * 100;
};

export const percentageToDb = (percentage: number, type: string) => {
  if (percentage === 0 && type === 'level'){
    return -Infinity
  }
  const { min, max } = mixerRanges[type];
  return min + (percentage / 100) * (max - min);
};

export const velocityToDb = (velocity:number, dbType: string) => {
  const velocityPercentage = velocityToPercentage(velocity)
  return percentageToDb(velocityPercentage, dbType)
}
export const dbToVelocity = (db:number, dbType:string) => {
  if (db === -Infinity){
    return 0
  }
  const dbPercentage = dbToPercentage(db, dbType)
  return percentageToVelocity(dbPercentage)
}

/** Clamp numeric value to min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
/**
 * Convert gain from dB to linear float value between 0 and 1
 * @param gain
 */
export function DBToGainValue(gain: number): number {
  const result = (gain + 6) / 63;
  return clamp(result, 0, 1);
}

/**
 * Convert gain from linear float value (between 0 and 1) to dB value (between -6 and 57)
 * @param value linear gain value
 */
export function gainValueToDB(value: number): number {
  const result = Math.round((value * 63 - 6) * 10) / 10; // round to 1 decimal place
  return clamp(result, -6, 57);
}


