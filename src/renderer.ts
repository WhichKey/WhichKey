import { ipcRenderer } from 'electron';

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
    ipcRenderer.on('listening-started', () => {
      this.showUI();
    });

    ipcRenderer.on('listening-stopped', () => {
      this.hideUI();
    });
  }

  private showUI() {
    this.container.style.display = 'block';
    this.container.innerHTML = `
      <h2 style="margin: 0 0 10px 0;">Available Shortcuts</h2>
      <div style="display: grid; gap: 10px;">
        <div>[t] - Open Terminal</div>
        <!-- Add more shortcuts here -->
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