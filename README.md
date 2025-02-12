# StreamSync

## Description

StreamSync is a tool that automatically exports Steam games (including non-Steam games added to Steam) to Sunshine's application list. This allows easy access to games via Moonlight or any other Sunshine-compatible solution.

## Features

- Automatic scan of Steam and non-Steam games.
- Directly adds detected games to Sunshine's `app.json`.
- Simple interface with game list and configuration options.
- Background execution with automatic detection of game installations/uninstallations (planned).

## Installation

1. **Clone the project**:
   ```sh
   git clone https://github.com/moi952/steam-sunshine-sync.git
   cd steam-sunshine-sync
   ```
2. **Install dependencies**:
   ```sh
   yarn install
   ```
3. **Start the application**:
   ```sh
   yarn electron:dev
   ```

## Configuration

In the application settings, you can configure:

- Steam user ID
- Steam installation path
- Sunshine directory (Apollo-compatible)

## Contributing

Contributions are welcome! If you want to add a feature or fix a bug, feel free to open an issue or pull request.

## License

MIT

---

### Author

Created by [moi952](https://github.com/moi952).
