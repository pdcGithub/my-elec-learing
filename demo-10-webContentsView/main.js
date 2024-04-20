const {app, BrowserWindow, WebContentsView} = require('electron')

//窗口创建函数
const createWindow = () => {

    //主窗口
    const win = new BrowserWindow({
        width:1000,
        height:600,
        backgroundColor: '#efefef' /*将窗口的背景设置为 灰色，以便观察边框*/
    });

    //加载子页面 view1 BrowserView 类已弃用，并替换为新的 WebContentsView 类。Electron v30.0.1
    const view1 = new WebContentsView();
    win.contentView.addChildView(view1);
    view1.webContents.loadURL('https://electronjs.org');
    view1.setBounds({ x: 0, y: 0, width: 400, height: 500 });

    //加载子页面 view2 BrowserView 类已弃用，并替换为新的 WebContentsView 类。Electron v30.0.1
    const view2 = new WebContentsView();
    win.contentView.addChildView(view2);
    view2.webContents.loadURL('https://www.mickarea.net'); /* 这是我的个人网站，有兴趣可以看看 */
    view2.setBounds({ x: 450, y: 0, width: 500, height: 500 });

    //打开开发者工具
    //win.webContents.openDevTools();
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