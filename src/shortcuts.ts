import { globalShortcut, BrowserWindow, ipcMain } from "electron";
import { exec } from "child_process";
import { ConfigLoader } from "./config/configLoader";

interface ShortcutAction {
  description: string;
  action: () => void;
}

interface ShortcutMap {
  [key: string]: ShortcutAction;
}

export class ShortcutManager {
  private isListening: boolean = false;
  private keySequence: string = "";
  private shortcuts: ShortcutMap = {};
  private timeoutId: NodeJS.Timer | null = null;
  private prefix: string = "";
  private configLoader: ConfigLoader;

  constructor() {
    this.configLoader = new ConfigLoader();

    if (process.platform === "darwin") {
      this.prefix = "open";
    } else if (process.platform === "win32") {
      this.prefix = "start";
    } else {
      this.prefix = "xdg-open";
    }

    this.initializeShortcuts();

    ipcMain.on("shortcut-added", () => {
      this.reloadShortcuts();
    });
  }

  private initializeShortcuts() {
    const config = this.configLoader.loadConfig();
    this.shortcuts = {};

    Object.entries(config.shortcuts).forEach(([key, shortcutConfig]) => {
      this.shortcuts[key] = {
        description: shortcutConfig.description,
        action: () => {
          exec(`${this.prefix} ${shortcutConfig.command}`);
        },
      };
    });

    globalShortcut.register("F24", () => {
      this.startListening();
    });
  }

  private reloadShortcuts() {
    const config = this.configLoader.loadConfig();
    this.shortcuts = {};

    Object.entries(config.shortcuts).forEach(([key, shortcutConfig]) => {
      this.shortcuts[key] = {
        description: shortcutConfig.description,
        action: () => {
          exec(`${this.prefix} ${shortcutConfig.command}`);
        },
      };
    });
  }

  private registeredShortcuts: string[] = [];

  private startListening() {
    if (this.isListening) {
      return;
    }

    this.isListening = true;
    this.keySequence = "";

    console.log("Listening for shortcuts");

    const letters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialKeys = ["esc", "enter", "space", "tab"];

    [...letters, ...numbers, ...specialKeys].forEach((key) => {
      if (!globalShortcut.isRegistered(key)) {
        globalShortcut.register(key, () => {
          if (this.isListening) {
            this.handleKeyPress(key);
            this.resetTimeout();
          }
        });
        this.registeredShortcuts.push(key);
      }
    });

    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send("listening-started", this.getShortcutsInfo());
    });

    this.resetTimeout();
  }

  private getShortcutsInfo() {
    return Object.entries(this.shortcuts).map(([key, action]) => ({
      key,
      description: action.description,
    }));
  }

  private resetTimeout() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      if (this.isListening) {
        this.stopListening();
      }
    }, 3000);
  }

  private stopListening() {
    this.isListening = false;
    this.keySequence = "";

    this.registeredShortcuts.forEach((key) => {
      globalShortcut.unregister(key);
    });
    this.registeredShortcuts = [];

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send("listening-stopped");
    });
  }

  public handleKeyPress(key: string) {
    if (!this.isListening) {
      return;
    }

    const normalizedKey = this.normalizeKey(key);
    if (!normalizedKey) {
      return;
    }

    this.keySequence += normalizedKey;

    const action = this.shortcuts[this.keySequence];

    if (action) {
      action.action();
      this.stopListening();
    } else {
      const hasMatchingPrefix = Object.keys(this.shortcuts).some((shortcut) =>
        shortcut.startsWith(this.keySequence)
      );

      if (!hasMatchingPrefix) {
        this.keySequence = "";
      }
    }
  }

  private normalizeKey(key: string): string | null {
    const specialKeys: { [key: string]: string } = {
      escape: "esc",
      return: "enter",
      " ": "space",
      control: "ctrl",
    };

    key = key.toLowerCase();
    return specialKeys[key] || key;
  }

  public cleanup() {
    globalShortcut.unregisterAll();
  }
}
