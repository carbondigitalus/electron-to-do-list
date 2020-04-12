// NPM Modules
const electron = require('electron');

// Variables
const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow;
let addWindow;

function createAddWindow() {
  addWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 600,
    height: 400,
    title: 'Add New To Do Item'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => {
    addWindow = null;
  });
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Create Item',
        accelerator: 'CmdOrCtrl+N',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear List',
        accelerator: 'CmdOrCtrl+G',
        click() {
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: 'Quit App',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => {
    app.quit();
  });
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

// For Mac computers, add app title menu
if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: 'My ToDo List'
  });
}
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle Dev Tools',
        accelerator: 'CmdOrCtrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
