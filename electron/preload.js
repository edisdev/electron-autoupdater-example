const {
  contextBridge,
  ipcRenderer,
  shell
} = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on () {
      return ipcRenderer.on(...arguments)
    },
    once () {
      return ipcRenderer.once(...arguments)
    },
    removeListener () {
      return ipcRenderer.removeListener(...arguments)
    },
    removeAllListeners () {
      return ipcRenderer.removeAllListeners(...arguments)
    },
    send () {
      return ipcRenderer.send(...arguments)
    },
    invoke () {
      return ipcRenderer.invoke(...arguments)
    }
  }
})