const {app, BrowserWindow, Notification, Tray, Menu} = require('electron')
const path = require('node:path')

//增加一个函数，在主进程调用消息提示
function showNotification(message){
    //如果支持 Notification 则提示，否则将在后台打印
    if(Notification.isSupported){
        new Notification({title: app.name, body : message}).show();
    } else {
        console.log("你的操作系统不支持 Notification 消息提示，所以消息显示在后台，如下："+message);
    }
}

//设置我自定义的托盘图标以及功能
function setMyTray(){
    //设置图标
    let tray = new Tray(path.join(__dirname, 'application.png'))
    //设置菜单
    let myMenu = Menu.buildFromTemplate([
        {label:'Item 1', type:'radio'},
        {label:'Item 2', type:'radio', checked:true},
        {label:'Item 3', type:'radio'},
        {label:'Item 4', type:'radio'}
    ])
    tray.setContextMenu(myMenu);
    tray.setTitle("My Title");
    tray.setToolTip("My tooltip info.");
    //消息提示
    showNotification('系统托盘创建成功...')
}

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

        //创建系统托盘
        setMyTray();

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