const {app, BrowserWindow, ipcMain, nativeTheme} = require('electron')
const path = require('node:path')

//窗口创建函数
const createWindow = () => {
    //主窗口
    const win = new BrowserWindow({
        width:1000,
        height:600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    //加载页面
    win.loadFile('index.html');
    //打开开发者工具
    win.webContents.openDevTools();
}

//设置一个主函数
async function main(){

    //启用全局沙盒化，安全设置
    app.enableSandbox();

    //Squirrel 在 程序在 安装、更新、卸载等阶段，会通过调起主程序的方式通知到主程序，
    //我们要把这些启动方式和用户主动打开的方式区别开来。
    if(require('electron-squirrel-startup')){
        app.quit()
        return ;
    }

    //捕捉处理，切换主题
    ipcMain.handle('dark-mode:toggle', ()=>{
        if(nativeTheme.shouldUseDarkColors){
            nativeTheme.themeSource = 'light'
        }else{
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })
    //捕捉处理，设置主题为系统默认值
    ipcMain.handle('dark-mode:system', ()=>{
        nativeTheme.themeSource = 'system'
    })

    await app.whenReady().then(()=>{

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

//主程序启动
main().catch(console.error)