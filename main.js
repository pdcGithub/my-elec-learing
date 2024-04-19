const {app, BrowserWindow, Notification} = require('electron')

//增加一个函数，在主进程调用消息提示
function showNotification(message){
    //如果支持 Notification 则提示，否则将在后台打印
    if(Notification.isSupported){
        new Notification({title: app.name, body : message}).show();
    } else {
        console.log("你的操作系统不支持 Notification 消息提示，所以消息显示在后台，如下："+message);
    }
}

//任务栏的进度条处理
function showProgreeBar(win){
    //这里开始创建进度条
    let incre = 0.1;
    let oriVal = 0;
    //提示消息
    showNotification('进度条开始推进了...');
    //每隔1秒更新一次
    processInterval = setInterval(()=>{
        //设置进度条
        win.setProgressBar(oriVal);
        if(oriVal==-1){
            //如果进度条消失，则停止定时器
            clearInterval(processInterval);
            //提示消息
            showNotification('进度条已满，定时器关闭成功.')
        }
        oriVal += incre;
        if(oriVal>1) {
            //如果进度 大于 1，则已完成，设置为-1。-1时进度条消失
            oriVal = -1;
        }
    }, 1000);
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

    //显示任务栏进度条
    showProgreeBar(win);
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
}

//主程序启动
main().catch(console.error)