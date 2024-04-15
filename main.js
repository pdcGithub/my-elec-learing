const {app, BrowserWindow, ipcMain, dialog} = require('electron')
//
const path = require('node:path')

//窗口创建函数
const createWindow = () => {
    const win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            preload:path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html');
}

//增加一个函数，用于接收render传来的title值，然后设置新的title
function handleSetTitle(event, title){
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    console.log(title);
    win.setTitle(title);
}

//增加一个函数，用于打开一个本地窗口 ，并获取所选的路径
async function handleFileOpen(){
    const {canceled, filePaths} = await dialog.showOpenDialog();
    if(!canceled){
        return filePaths[0];
    }else{
        return "canceled...";
    }
}

//设置一个主函数
async function main(){
    //Squirrel 在 程序在 安装、更新、卸载等阶段，会通过调起主程序的方式通知到主程序，
    //我们要把这些启动方式和用户主动打开的方式区别开来。
    if(require('electron-squirrel-startup')){
        app.quit()
        return ;
    }
    await app.whenReady().then(()=>{

        //增加一个关于 ping 函数的捕捉器
        ipcMain.handle('ping', (event, strParam1, strParam2)=>{
            return '接收到了,'+strParam1+','+strParam2+'||||'+new Date();
        });

        //增加一个关于 set-title 的函数处理（单向）
        ipcMain.on('set-title', handleSetTitle);

        //增加一个关于 文件窗口处理的 捕捉器（双向）
        ipcMain.handle('dialog:openFile', handleFileOpen);

        //创建主窗口
        createWindow();

        //窗口全部关闭事件
        app.on('window-all-closed', ()=>{
            //如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
            if(process.platform !== 'darwin') app.quit();
        });
        
        app.on('activate', ()=>{
            if(BrowserWindow.getAllWindows().length()===0) createWindow()
        });
    })
}

main().catch(console.error)