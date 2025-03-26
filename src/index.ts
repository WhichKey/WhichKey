import { app } from 'electron';
import { ShortcutManager } from './shortcuts';
import { TrayManager } from './tray';

let shortcutManager: ShortcutManager;
let trayManager: TrayManager;

function initialize() {
  shortcutManager = new ShortcutManager();
  trayManager = new TrayManager();
}

app.whenReady().then(() => {
  initialize();
});

app.on('before-quit', () => {
  shortcutManager.cleanup();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});