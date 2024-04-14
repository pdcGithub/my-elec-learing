const {app, BrowserWindow, ipcMain} = require('electron')
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
        ipcMain.handle('ping', (obj, strParam1, strParam2)=>{
            return '接收到了,'+strParam1+','+strParam2+'||||'+new Date();
        });
    
        //创建主窗口
        createWindow()
    
        //窗口全部关闭事件
        app.on('window-all-closed', ()=>{
            //如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
            if(process.platform !== 'darwin') app.quit();
        })
        
        app.on('activate', ()=>{
            if(BrowserWindow.getAllWindows().length()===0) createWindow()
        })
    })
}

main().catch(console.error)