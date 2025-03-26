document.addEventListener('DOMContentLoaded', () => {
  const shortcutList = document.querySelector('.shortcut-list');
  const addButton = document.getElementById('add-shortcut');

  const { ipcRenderer } = require('electron');

  ipcRenderer.send('get-shortcuts');

  ipcRenderer.on('shortcuts', (_, data) => {
    displayShortcuts(data.shortcuts);
  });

  addButton.addEventListener('click', () => {
    const key = document.getElementById('key').value.trim();
    const description = document.getElementById('description').value.trim();
    const command = document.getElementById('command').value.trim();

    if (!key || !description || !command) {
      alert('All fields are required');
      return;
    }

    ipcRenderer.send('add-shortcut', { key, description, command });

    document.getElementById('key').value = '';
    document.getElementById('description').value = '';
    document.getElementById('command').value = '';
  });

  ipcRenderer.on('shortcut-added', (_, success) => {
    if (success) {
      ipcRenderer.send('get-shortcuts');
    } else {
      alert('Failed to add shortcut');
    }
  });

  function displayShortcuts(shortcuts) {
    shortcutList.innerHTML = '';

    if (Object.keys(shortcuts).length === 0) {
      shortcutList.innerHTML = '<p>No shortcuts configured</p>';
      return;
    }

    Object.entries(shortcuts).forEach(([key, shortcut]) => {
      const shortcutItem = document.createElement('div');
      shortcutItem.className = 'shortcut-item';
      shortcutItem.innerHTML = `
        <span class="shortcut-key">${key}</span>
        <span class="shortcut-action">${shortcut.description}</span>
      `;
      shortcutList.appendChild(shortcutItem);
    });
  }
});