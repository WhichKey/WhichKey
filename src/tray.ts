import { Tray, Menu, BrowserWindow, app, ipcMain } from "electron";
import * as path from "path";
import { ConfigLoader } from "./config/configLoader";

export class TrayManager {
  private tray: Tray | null = null;
  private settingsWindow: BrowserWindow | null = null;
  private configLoader: ConfigLoader;

  constructor() {
    this.configLoader = new ConfigLoader();
    this.createTray();
    this.setupIpcHandlers();
  }

  private createTray() {
    try {
      const iconPath = path.join(app.getAppPath(), "src", "assets", "icon.png");
      this.tray = new Tray(iconPath);
      this.tray.setToolTip("WhichKey");
      this.updateContextMenu();
    } catch (error) {
      console.error("Failed to create tray:", error);
      app.quit();
    }
  }

  private updateContextMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Settings",
        click: () => this.openSettings(),
      },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          if (this.settingsWindow) {
            this.settingsWindow.close();
          }
          this.tray?.destroy();
          app.quit();
        },
      },
    ]);

    this.tray?.setContextMenu(contextMenu);
  }

  private setupIpcHandlers() {
    ipcMain.on("get-shortcuts", (event) => {
      const config = this.configLoader.loadConfig();
      event.reply("shortcuts", config);
    });

    ipcMain.on("add-shortcut", (event, shortcut) => {
      try {
        const config = this.configLoader.loadConfig();

        config.shortcuts[shortcut.key] = {
          description: shortcut.description,
          command: shortcut.command,
        };

        this.configLoader.saveConfig(config);

        event.reply("shortcut-added", true);
      } catch (error) {
        console.error("Failed to add shortcut:", error);
        event.reply("shortcut-added", false);
      }
    });
  }

  private openSettings() {
    if (this.settingsWindow) {
      this.settingsWindow.focus();
      return;
    }

    this.settingsWindow = new BrowserWindow({
      width: 500,
      height: 600,
      frame: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.settingsWindow.loadFile("src/html/settings.html");

    this.settingsWindow.on("closed", () => {
      this.settingsWindow = null;
    });
  }
}
