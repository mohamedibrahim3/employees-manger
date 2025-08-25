// Electron API types for renderer process
interface ElectronAPI {
  openExternal: (url: string) => Promise<void>;
  getVersion: () => Promise<string>;
  // Add more methods as needed
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

// Check if running in Electron
declare const __IS_ELECTRON__: boolean;

export {};