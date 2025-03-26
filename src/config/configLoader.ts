import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

interface ShortcutConfig {
  description: string;
  command: string;
}

interface ShortcutsConfig {
  shortcuts: {
    [key: string]: ShortcutConfig;
  };
}

export class ConfigLoader {
  private configPath: string;
  private defaultConfigPath: string;

  constructor() {
    const userConfigDir = path.join(app.getPath('userData'), 'config');

    if (!fs.existsSync(userConfigDir)) {
      fs.mkdirSync(userConfigDir, { recursive: true });
    }

    this.configPath = path.join(userConfigDir, 'shortcuts.json');
    this.defaultConfigPath = path.join(app.getAppPath(), 'src', 'config', 'shortcuts.json');

    if (!fs.existsSync(this.configPath)) {
      this.copyDefaultConfig();
    }
  }

  private copyDefaultConfig(): void {
    try {
      if (fs.existsSync(this.defaultConfigPath)) {
        const defaultConfig = fs.readFileSync(this.defaultConfigPath, 'utf-8');
        fs.writeFileSync(this.configPath, defaultConfig);
      }
    } catch (error) {
      console.error('Failed to copy default config:', error);
    }
  }

  public loadConfig(): ShortcutsConfig {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      return JSON.parse(configData) as ShortcutsConfig;
    } catch (error) {
      console.error('Failed to load config, using default config:', error);

      try {
        const defaultData = fs.readFileSync(this.defaultConfigPath, 'utf-8');
        return JSON.parse(defaultData) as ShortcutsConfig;
      } catch (defaultError) {
        console.error('Failed to load default config:', defaultError);
        return { shortcuts: {} };
      }
    }
  }

  public saveConfig(config: ShortcutsConfig): void {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  public getConfigPath(): string {
    return this.configPath;
  }
}
