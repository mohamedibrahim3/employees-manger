const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  downloadImage: (imageUrl, filename) =>
    ipcRenderer.invoke("download-image", { imageUrl, filename }),
  viewImage: (imageUrl) => ipcRenderer.invoke("view-image", imageUrl),
});
