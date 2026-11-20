const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1050, minHeight: 700,
    backgroundColor: '#080d19',
    title: 'ViralClip Studio PRO',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}
app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('pick-video', async () => {
  const r = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{name:'Videos', extensions:['mp4','mov','mkv','webm','avi','m4v']} ] });
  if (r.canceled || !r.filePaths[0]) return null;
  const p = r.filePaths[0]; return { path:p, name:path.basename(p), url:'file://' + p.replace(/\\/g,'/') };
});
ipcMain.handle('export-clip', async (_event, data) => {
  const { input, start, end, crop } = data;
  if (!input || !fs.existsSync(input)) throw new Error('Selecciona un video válido.');
  const a = Number(start), b = Number(end);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b <= a) throw new Error('El tiempo final debe ser mayor que el inicial.');
  const out = await dialog.showSaveDialog({ defaultPath: `ViralClip-${Date.now()}.mp4`, filters:[{name:'MP4',extensions:['mp4']}] });
  if (out.canceled || !out.filePath) return { canceled:true };
  const args = ['-y','-ss',String(a),'-i',input,'-t',String(b-a)];
  if (crop) args.push('-vf','crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920');
  args.push('-c:v','libx264','-preset','veryfast','-crf','20','-c:a','aac','-movflags','+faststart',out.filePath);
  return await new Promise((resolve,reject) => {
    const proc = spawn(ffmpegPath,args,{windowsHide:true});
    let err=''; proc.stderr.on('data',d=>err+=d.toString());
    proc.on('error',reject);
    proc.on('close',code => code===0 ? resolve({canceled:false,path:out.filePath}) : reject(new Error(err.slice(-1200)||'Falló la exportación FFmpeg.')));
  });
});
