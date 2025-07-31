// This is just an example,
// so you can safely delete all default props below

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  connectionStatus: {
    OPENING: 'Inicializando',
    OPEN: 'Conectado',
    CLOSING: 'Desconectandose',
    CLOSE: 'Desconectado',
    ERROR: 'Error',
    RECONNECTING: 'Reconectando',
  },
  validation: {
    required: 'Este campo es requerido',
    invalidIP: 'La ip ingresada es inválida',
  },
  // Add missing errors section
  errors: {
    connectionFailed: 'Falló la conexión',
    maxRetriesReached: 'Máximo de reintentos alcanzado',
  },
  misc: {
    midiSettings: 'Configuración MIDI',
    continue: 'Continuar',
    connect: 'Conectar',
    disconnect: 'Desconectar',
    back: 'Regresar',
    settings: 'Ajustes',
    options: 'Opciones',
    reload: 'Recargar',
    supportMe: 'Apoyame con una donación',
    layoutChooseMsg: 'Has activado el layout de {number} pantallas',
    disconnectedMsg:
      'Ups! parece que no estás conectado a tu mixer, revisa que esté encendida, que estes conectado al wifi de la mixer, y que la IP de la mixer es correcta.',
    connecting: 'Conectando',
    retry: 'Reintentar',
  },
  shortcutsModal: {
    title: 'Soundcraft Ui - Atajos',
    muteAllMsg: 'Seguro que quieres silenciar todos los canales?',
  },
  setupModal: {
    title: 'Soundcraft Ui - Configuración',
    errors: {
      noModel: 'Primero define cuál es el modelo de tu Ui',
      noIP: 'Debes definir la IP de tu mixer para poder continuar',
    },
    advice:
      'Por favor, asegurate que tu mixer esté encendida, revisa que estés conectado al wifi de tu mixer, y verifica que la IP de tu mixer es la correcta',
  },
};
