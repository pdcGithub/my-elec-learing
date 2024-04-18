const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const https = require('node:https')

//窗口创建函数
const createWindow = () => {
    //主窗口
    const win = new BrowserWindow({
        width:1000,
        height:600,
        webPreferences:{
            //可以在 Electron 的 Web Workers 里使用 Node.js的特性。
            //要用的话，需把 webPreferences 中的 nodeIntegrationInWorker 选项设置为 true
            nodeIntegrationInWorker:true,
            //预处理
            preload:path.join(__dirname, 'preload.js')
        }
    });
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

    //设置拖拽的效果图标
    const iconName = path.join(__dirname, "dragAndDrop.png")

    //处理拖拽js，根据传来的 filename 来获取文件路径
    ipcMain.on('ondragstart', (event, filename)=>{
        event.sender.startDrag({
            file: path.join(__dirname, filename),
            icon: iconName
        })
    })
}

//主程序启动
main().catch(console.error)