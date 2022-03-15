const { app, BrowserWindow, Menu, dialog } = require("electron");
const { ipcMain } = require("electron/main");
const pdf2table = require("pdf2table");
const fs = require("fs");
const { beautifyJSON, searchHelper } = require("./utils/index");
const DUMP_PATH = "./assets/filedump.json";

let win;
let readFileWin;
let searchPartsWindow;
let generateBillWindow;
let invoiceData;

const createGenerateBillWin = () => {
  generateBillWindow = new BrowserWindow({
    width: 1024,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  generateBillWindow.loadFile("./html/generate-bill.html");
  generateBillWindow.webContents.openDevTools();
  generateBillWindow.webContents.send("generate-bill-table", "tableData");
  generateBillWindow.on("closed", () => (generateBillWindow = null));
  generateBillWindow.webContents.once("dom-ready", () =>
    generateBillWindow.webContents.send("invoice-data", invoiceData)
  );
};

const createReadFileWindow = () => {
  readFileWin = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  readFileWin.loadFile("./html/read-file.html");

  readFileWin.on("closed", () => {
    readFileWin = null;
  });
};

const createSearchPartsWindow = () => {
  searchPartsWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  searchPartsWindow.loadFile("./html/search-parts.html");
  searchPartsWindow.webContents.openDevTools();
  searchPartsWindow.on("closed", () => {
    searchPartsWindow = null;
  });
};

const createWindow = async () => {
  win = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("./html/index.html");

  win.webContents.openDevTools();

  const menu = Menu.buildFromTemplate(template);

  win.on("closed", () => {
    app.quit();
  });

  Menu.setApplicationMenu(menu);
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const template = [];

ipcMain.handle("read-file", async () => {
  const files = dialog.showOpenDialogSync(readFileWin, {
    properties: ["openFile"],
    filters: [
      {
        name: "PDF",
        extensions: ["pdf"],
      },
    ],
  });
  if (!files) return;
  const file = files[0];
  return file;
});

ipcMain.on("asynchronous-message", (event, filePathToRead) => {
  fs.readFile(filePathToRead, function (err, buffer) {
    if (err) return console.log(err);
    event.reply("asynchronous-reply", "parsing-file");
    pdf2table.parse(buffer, function (err, rows) {
      if (err) return console.log(err);
      let beatJSON = beautifyJSON(rows);
      event.reply("asynchronous-reply", "parsing-complete");
      event.reply("asynchronous-reply", "dumping-file");
      // check if the file exists
      if (fs.existsSync(DUMP_PATH)) {
        fs.unlinkSync(DUMP_PATH);
      }
      event.reply("asynchronous-reply", "dumping-complete");
      fs.writeFileSync(DUMP_PATH, JSON.stringify(beatJSON));
      event.reply("asynchronous-reply", "done");
      readFileWin.close();
    });
  });
});

ipcMain.on("search-string-query", (event, searchString) => {
  // if (searchString.length < 5) return;
  fs.readFile(DUMP_PATH, "utf8", function (err, buffer) {
    if (err) return console.log(err);
    event.reply("search-string-query", "initiating search");
    const res = searchHelper(searchString, JSON.parse(buffer));
    event.reply("search-string-query", JSON.stringify(res));
  });
});

ipcMain.on("open-search-window", () => {
  createSearchPartsWindow();
});

ipcMain.on("open-add-file-window", () => {
  createReadFileWindow();
});

ipcMain.on("selected-parts-array", (e, selectedParts) => {
  win.webContents.send("selected-parts-array", selectedParts);
  searchPartsWindow.close();
});

ipcMain.on("generate-bill-window", (e, tableData) => {
  invoiceData = tableData;
  // we need to generate the bill and send the data to bill generate window
  createGenerateBillWin();
});
