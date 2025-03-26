<div align="center">

# 🔑 WhichKey

**A keyboard-driven shortcut manager inspired by Vim's WhichKey**

[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)

</div>

## ✨ Overview

WhichKey is an **Electron app** that allows you to create and manage keyboard shortcuts similar to Vim's WhichKey plugin. You can hit a trigger key (in this case F24) and start typing a key sequence to execute a command. This is particularly useful for power users who want to speed up their workflow and reduce mouse usage.

## 📦 Installation

### Prerequisites

- 📋 [Node.js](https://nodejs.org/)
- 🏃 [Bun](https://bun.sh)

### Setup

```bash
# 🔽 Clone the repository
git clone https://github.com/yourusername/WhichKey.git
cd WhichKey

# 📥 Install dependencies
bun install

# 🚀 Launch the app
bun run start

# 🏗️ Build the app for production
bun run pack
bun run dist
```

## 📝 Usage

1. 🚀 Start the application (it will then run in the background)
2. ⌨️ Press the trigger key (F24 by default) to show the shortcuts overlay
3. 🔤 Press the key sequence for the shortcut you want to execute
4. ⚙️ To configure shortcuts, right-click the tray icon and select "Settings"

## ➕ Adding Shortcuts

1. 🔧 Open the settings window from the tray icon
2. 📝 Fill in the following fields:
   - **Shortcut Key**: The key or key combination (e.g., "wt")
   - **Description**: What this shortcut does
   - **Command**: The command to execute
3. 💾 Click "Add Shortcut" and restart the app

## 🏗️ Building from Source

```bash
# 🔨 Create an executable for your platform
bun run pack
bun run dist
```

The built application will be available in the `release` directory. ✅

## 💻 Development

This project uses the following technologies:
- ⚛️ **Electron** - Cross-platform desktop apps with web technologies
- 📘 **TypeScript** - Type-safe JavaScript
- 📄 **JSON** - Simple configuration storage

### Project Structure

```
WhichKey/
├── 📁 src/                # Source code
│   ├── 📁 config/         # Configuration handling
│   ├── 📁 html/           # UI templates
│   ├── 📄 index.ts        # Main entry point
│   ├── 📄 shortcuts.ts    # Shortcut management
│   ├── 📄 tray.ts         # System tray integration
│   └── 📄 renderer.ts     # UI rendering
└── 📄 README.md           # You are here!
```

## 👥 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- ✨ Request features
- 🔧 Submit pull requests

## 📜 License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.
