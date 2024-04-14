const {app, BrowserWindow, ipcMain} = require('electron')
//
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            preload:path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html');
    //win.loadURL("https://www.mickarea.net");
}

app.whenReady().then(()=>{

    //增加一个关于 ping 函数的捕捉器
    ipcMain.handle('ping', ()=>'pong');

    //创建主窗口
    createWindow()

    //窗口全部关闭事件
    app.on('window-all-closed', ()=>{
        //如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
        if(process.platform !== 'darwin') app.quit();
    })
    //
    //app.on('activate', ()=>{
    //    if(BrowserWindow.getAllWindows().length()===0) createWindow()
    //})
})