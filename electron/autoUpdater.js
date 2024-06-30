const { autoUpdater } = require("electron-updater")

module.exports = {
  async control (mainWindow) {

    function sendMessage ({ type, result, error }) {
      mainWindow.webContents.send('electron-updater', { type, info: result })
    }

    autoUpdater.checkForUpdatesAndNotify()
    .then(result => {
      sendMessage({ type: 'check-result', result })

      autoUpdater.once('checking-for-update', (result) => { // GÜNCEL VERSİYON KONTROL EDİLİYOR
        sendMessage({ type: 'checking-for-update', result })
      })
  
      autoUpdater.once('update-not-available', (result) => { // GÜNCEL VERSİYON YOKSA
        sendMessage({ type: 'update-not-available', result })
      })
  
      autoUpdater.once('update-available', (result) => { // GÜNCEL VERSİYON VARSA, SONUNCUNDA VERSİYON BİLGİSİ DÖNDER
        sendMessage({ type: 'update-available', result })
      })
  
      autoUpdater.once('update-cancelled', (result) => { // GÜNCELLEME İPTAL EDİLMİŞ İSE
        sendMessage({ type: 'update-cancelled', result })
      })
  
      autoUpdater.once('update-downloaded', (result) => { // GÜNCEL VERSİYON İNDİRİLMİŞ İSE
        sendMessage({ type: 'update-downloaded', result })
        autoUpdater.quitAndInstall()
      })
  
      autoUpdater.once('error', (result) => {
        // VERSİYON KONTROLÜ VEYA GÜNCEL VERSİYONU İNDİRME SIRASINDA
        // BİR HATA OLUŞMUŞ İSE
        sendMessage({ type: 'error', result })
      })
  
      autoUpdater.on('download-progress', (result) => {
        // GÜNCEL VERSİYONU İNDİRME SIRASINDA DOSYA BOYUTU, İNDİRME YÜZDESİ, İNDİRİLEN BOYUT GİBİ BİLGİLERİ DÖNDER
        sendMessage({ type: 'download-progress', result })
      })

    })
    .catch(e => sendMessage({ type: 'check-error', result: e, error: true })) // KONTROL SIRASINDA BİR HATA OLUŞMUŞ İSE
  }
}