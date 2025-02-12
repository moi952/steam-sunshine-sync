global.window = Object.create(window);
global.window.electron = {
  getSettings: jest.fn().mockResolvedValue({ themeMode: "system" }),
  saveSettings: jest.fn(),
};
