import { app, BrowserWindow, Menu, shell, ipcMain } from "electron";
import * as isDev from "electron-is-dev";
import * as path from "path";
import * as fs from "fs";

let mainWindow: BrowserWindow | null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../public/icon.png"),
    show: false,
    titleBarStyle: "default",
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../out/index.html")}`;

  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow!.show();
    if (isDev) {
      mainWindow!.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();
  createMenu();

  // ✅ IPC handlers
  ipcMain.handle("download-image", (event, { imageUrl, filename }) => {
    try {
      const downloadsPath = app.getPath("downloads");
      const localPath = imageUrl.replace("file://", "");
      const destPath = path.join(downloadsPath, filename);

      fs.copyFileSync(localPath, destPath);

      return { success: true, destPath };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("view-image", (event, imageUrl) => {
    try {
      shell.openExternal(imageUrl);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ✅ Menu
const createMenu = (): void => {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => app.quit(),
        },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);
};
