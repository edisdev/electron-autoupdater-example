async function setVersion () {
  const version = await window.electron.ipcRenderer.invoke('get-current-version')
  document.getElementById('version').innerText = version
}

function controlVersion () {
  window.electron.ipcRenderer.invoke('control-version')
  window.electron.ipcRenderer.on('electron-updater', (event, data) => {
    const { type, info } = data
    let message = ''
    function getControlMessage () {
      if (info && info?.versionInfo?.version !== version) {
        return 'Yeni Versiyon Mevcut'
      } else {
        return 'Güncel Versiyonu kullanıyorsunuz.'
      }
    }

    const percent = parseFloat(info?.percent || 0).toFixed(2)

    switch (type) {
      case 'download-progress':
        message = `Güncel versiyon indiriliyor %${percent}`
        break;
      case 'check-result':
        message = getControlMessage()
        break;
      case 'update-available' :
        message = `Yeni version Mevcut ${info.version}`
        break;
      case 'update-downloaded':
        message = `Versiyon ${info.version} yüklendi. Uygulama yeniden başlatılacak`
        break;
      case 'update-not-available':
        message = 'Güncel Versiyonu kullanıyorsunuz.'
        break;
      case 'error':
        message = 'Güncelleme alınırken edilirken bir hata oluştu'
        break;
      case 'check-error':
        message = 'Versiyon kontrolü yapılırken bir hata oluştu'
        break;
      default:
        break;
    }

    const updaterEl = document.getElementById('updaterResult')
    updaterEl.className = type
    updaterEl.innerText = message
  })
}

function initApp () {
  setVersion()
}

window.addEventListener('DOMContentLoaded', initApp)