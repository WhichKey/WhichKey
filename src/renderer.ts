import { ipcRenderer } from 'electron';

interface ShortcutInfo {
  key: string;
  description: string;
}

class ShortcutUI {
  private container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'shortcut-ui';
    this.container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      padding: 20px;
      border-radius: 8px;
      display: none;
      color: white;
      font-family: Arial, sans-serif;
    `;

    document.body.appendChild(this.container);
    this.initializeListeners();
  }

  private initializeListeners() {
    ipcRenderer.on('listening-started', (_, shortcuts: ShortcutInfo[]) => {
      this.showUI(shortcuts);
    });

    ipcRenderer.on('listening-stopped', () => {
      this.hideUI();
    });
  }

  private showUI(shortcuts: ShortcutInfo[] = []) {
    this.container.style.display = 'block';

    let shortcutsHtml = shortcuts.map(shortcut =>
      `<div>[${shortcut.key}] - ${shortcut.description}</div>`
    ).join('');

    if (!shortcutsHtml) {
      shortcutsHtml = '<div>No shortcuts configured</div>';
    }

    this.container.innerHTML = `
      <h2 style="margin: 0 0 10px 0;">Available Shortcuts</h2>
      <div style="display: grid; gap: 10px;">
        ${shortcutsHtml}
      </div>
    `;
  }

  private hideUI() {
    this.container.style.display = 'none';
  }
}

window.addEventListener('load', () => {
  new ShortcutUI();
});