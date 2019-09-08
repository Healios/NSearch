import { app, protocol, BrowserWindow } from "electron";
import { createProtocol, installVueDevtools } from "vue-cli-plugin-electron-builder/lib";

// This is nessecary in order to define type-safe globals.
declare global {
    namespace NodeJS {
        interface Global {
            iconv : any;
        }
    }
}
global.iconv = require("iconv-lite");

protocol.registerSchemesAsPrivileged([{scheme: "app", privileges: { secure: true, standard: true } }]);
const isDevelopment = process.env.NODE_ENV !== "production";
let window : BrowserWindow | null;

async function createWindow()
{
    if (isDevelopment)
    {
        window = new BrowserWindow({ width: 900, height: 700, frame: false, hasShadow: true, webPreferences: { nodeIntegration: true } });
        window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        window.webContents.openDevTools();
        try {
            installVueDevtools();
        } catch (e) {
            console.error("Failed to install Vue Devtools!");
        }
    } else {
        createProtocol("app");
        window = new BrowserWindow({ width: 620, height: 700, frame: false, hasShadow: true, webPreferences: { nodeIntegration: true } });
        window.loadURL("app://./index.html");
    }

    window.removeMenu();
    window.on("closed", () => window = null);
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () =>
{
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q.
    if (process.platform !== "darwin")
        app.quit();
});

app.on("activate", () =>
{
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (window === null)
        createWindow();
});
