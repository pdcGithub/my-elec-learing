const {app, BrowserWindow, Notification} = require('electron')
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

//窗口创建函数
const createWindow = () => {

    //主窗口
    const win = new BrowserWindow({
        width:1000,
        height:600
    });

    //设置缩略图工具栏（鼠标悬停在任务栏的图标上，即可看见）
    win.setThumbarButtons([
        {
            icon: path.join(__dirname, 'left.png'),
            tooltip:'向左',
            click : () => {showNotification('你点击了，左键')}
        },
        {
            icon: path.join(__dirname, 'right.png'),
            tooltip:'向右',
            click : () => {showNotification('你点击了，右键')}
        }
    ]);

    //任务栏中的图标叠加
    win.setOverlayIcon(path.join(__dirname, 'circle.png'), '这是一段描述信息...')

    //任务栏中的图标闪烁（windows下，效果不是很明显）
    win.flashFrame(true);
    setTimeout(()=>{
        win.flashFrame(false);/* 5秒后停止闪烁 */
    }, 5000);
}

//设置一个主函数
async function main(){

    //启用全局沙盒化，安全设置
    app.enableSandbox();

    //设置任务列表（在任务栏的图标上，右键点击即可看见）
    app.setUserTasks([
        {
            program  : process.execPath,
            arguments: '--new-window',
            iconPath : process.execPath,
            iconIndex: 0,
            title    : '任务1',
            description: '创建一个新窗口'
        },
        {
            program  : process.execPath,
            arguments: '--new-window',
            iconPath : process.execPath,
            iconIndex: 0,
            title    : '任务2',
            description: '创建一个新窗口'
        }
    ]);

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