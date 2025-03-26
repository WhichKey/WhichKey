import { Tray, Menu, BrowserWindow, app } from 'electron';
import * as path from 'path';

export class TrayManager {
  private tray: Tray | null = null;
  private settingsWindow: BrowserWindow | null = null;

  constructor() {
    this.createTray();
  }

  private createTray() {
    try {
      const iconPath = path.join(app.getAppPath(), 'src', 'assets', 'icon.png');
      this.tray = new Tray(iconPath);
      this.tray.setToolTip('WhichKey');
      this.updateContextMenu();
    } catch (error) {
      console.error('Failed to create tray:', error);
      app.quit();
    }
  }

  private updateContextMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Settings',
        click: () => this.openSettings()
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          if (this.settingsWindow) {
            this.settingsWindow.close();
          }
          this.tray?.destroy();
          app.quit();
        }
      }
    ]);

    this.tray?.setContextMenu(contextMenu);
  }

  private openSettings() {
    if (this.settingsWindow) {
      this.settingsWindow.focus();
      return;
    }

    this.settingsWindow = new BrowserWindow({
      width: 400,
      height: 500,
      frame: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.settingsWindow.loadFile('src/html/settings.html');

    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });
  }
}