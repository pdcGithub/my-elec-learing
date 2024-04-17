const {app, BrowserWindow, Menu, MenuItem, Notification, globalShortcut} = require('electron')

//窗口创建函数
const createWindow = () => {
    //主窗口
    const win = new BrowserWindow({
        width:1000,
        height:600
    });
    //加载页面
    win.loadFile('index.html');
    //打开开发者工具
    win.webContents.openDevTools();

    //在调度页面中的keydown和keyup事件之前，会发出before-input-event事件。 它可以用于捕获和处理在菜单中不可见的自定义快捷方式。
    win.webContents.on('before-input-event', (event, input)=>{
        if(input.control && input.key.toLowerCase()==='i'){
            console.log("你按下了 Ctrl + I ");
            event.preventDefault();
        }
    })
}

//创建一个自定义的菜单（设置菜单的同时，设置本地快捷键）
const menu = new Menu()
menu.append(new MenuItem({
    label:"Electron",
    submenu:[
        {
            role:'help',
            accelerator: process.platform==='darwin'? 'Alt+Cmd+I' : 'Alt+Shift+I',
            click:()=>{
                //如果支持 Notification 则提示，否则将在后台打印
                if(Notification.isSupported){
                    let myAlert = new Notification({
                        title: app.name,
                        body : "本地快捷键触发了。。。"
                    })
                    myAlert.show();
                } else {
                    console.log('本地快捷键触发了。。。');
                }
            }
        }
    ]
}))
//添加到应用的菜单栏
Menu.setApplicationMenu(menu)

//设置一个函数，用于注册全局快捷键
function myGlobalHotkeys(){
    //注册快捷键 Alt + CmdOrCtrl + P
    let register1 = globalShortcut.register("Alt+CommandOrControl+P", ()=>{
        //如果支持 Notification 则提示，否则将在后台打印
        if(Notification.isSupported){
            let myAlert = new Notification({
                title: app.name,
                body : "全局快捷键触发了。。。"
            })
            myAlert.show();
        } else {
            console.log('全局快捷键触发了。。。');
        }
    })
    if(!register1){
        console.log("全局快捷键 register1 注册失败");
    }else if(!globalShortcut.isRegistered("Alt+CommandOrControl+P")){
        console.log("全局快捷键 register1 注册失败，快捷键已经被其他应用程序注册");
    }else{
        console.log("全局快捷键 register1 注册成功");
    }
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

        //注册一个该应用的全局快捷键
        myGlobalHotkeys();

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

        //当app即将退出，取消全局快捷键的注册
        app.on('will-quit', ()=>{
            //清空该应用程序的所有全局快捷键
            globalShortcut.unregisterAll();
        })
        
    })
}

//主程序启动
main().catch(console.error)