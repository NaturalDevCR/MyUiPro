// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  connectionStatus: {
    'OPENING': 'Inicializando',
    'OPEN': 'Conectado',
    'CLOSING': 'Desconectandose',
    'CLOSE': 'Desconectado',
    'ERROR': 'Error',
    'RECONNECTING': 'Reconectando'
  },
  validation: {
    required: 'Este campo es requerido',
    invalidIP: 'La ip ingresada es inválida'
  },
  misc: {
    continue: 'Continuar',
    disconnect: 'Desconectar',
    back: 'Regresar',
    settings: 'Ajustes',
    options: 'Opciones',
    reload: 'Recargar',
    layoutChooseMsg: 'Has activado el layout de {number} pantallas',
    disconnectedMsg: 'Ups! parece que no estás conectado a tu mixer, revisa que esté encendida, que estes conectad@ al wifi de la mixer, y que la IP de la mixer es correcta.'
  },
  shortcutsModal: {
    title: 'Soundcraft Ui - Atajos',
    muteAllMsg: 'Segur@ que quieres silenciar todos los canales?'
  },
  setupModal: {
    title: 'Soundcraft Ui - Configuración',
    errors: {
      noModel: 'Primero define cuál es el modelo de tu Ui',
      noIP: 'Debes definir la IP de tu mixer para poder continuar'
    },
    stepper: {
      step1: {
        title: 'Modelo de Ui',
        text: 'Por favor selecciona el modelo de tu mixer Soundcraft Ui'
      },
      step2: {
        title: 'Mixer IP',
        text: 'Primero asegurate de estar conectado al wifi de tu mixer, luego configura la IP a continuación para establecer la conexión, la ip por defecto usualmente es: 10.10.1.1'
      },
      step3: {
        title: 'Listo!',
        text: 'Perfecto, has configurado la aplicación, asegurate que tu mixer esté encendida, que tu dispositivo esté conectado a la red wifi de tu mixer, y que la IP que has configurado sea la correcta, si borras la aplicación o la caché de la misma, tendrás que volver a configurar estos datos'
      }
    }
  }
};
