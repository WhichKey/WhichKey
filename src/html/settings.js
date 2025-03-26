document.addEventListener('DOMContentLoaded', () => {
  const shortcutList = document.querySelector('.shortcut-list');

  const shortcuts = {
    't': 'Open Terminal',
  };

  shortcutList.innerHTML = '';

  Object.entries(shortcuts).forEach(([key, action]) => {
    const shortcutItem = document.createElement('div');
    shortcutItem.className = 'shortcut-item';
    shortcutItem.innerHTML = `
      <span class="shortcut-key">${key}</span>
      <span class="shortcut-action">${action}</span>
    `;
    shortcutList.appendChild(shortcutItem);
  });
});