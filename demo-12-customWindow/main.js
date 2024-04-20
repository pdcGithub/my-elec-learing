const {app, BrowserWindow, Menu, MenuItem} = require('electron')

//创建测试用的菜单
function myApplicationMenu(){
    let menu = new Menu();
    menu.append(new MenuItem({
        label:'无边框窗口',
        click:()=>{
            //创建一个无边框窗口
            let subWin = new BrowserWindow({width:300, height:300, frame:false})
            //因为无边框的弹窗，没法关闭，所以设置 3秒后自动关闭
            setTimeout(()=>{
                if(subWin && !subWin.isDestroyed()) {
                    subWin.close()
                    console.log('无边框窗口已关闭');
                }
            }, 3000)
        }
    }));
    menu.append(new MenuItem({
        label:'Overlay',
        click:()=>{
            //创建一个Overlay窗口
            new BrowserWindow({width:300, height:300, titleBarStyle:'hidden', titleBarOverlay:true})
        }
    }));
    menu.append(new MenuItem({
        label:'Overlay2',
        click:()=>{
            //创建一个Overlay窗口，并自定义样式
            new BrowserWindow({
                                width:300,
                                height:300, 
                                titleBarStyle:'hidden',
                                titleBarOverlay:{
                                                color: '#2f3241',
                                                symbolColor: '#74b1be',
                                                height: 60
                                                }
                            })
        }
    }));
    menu.append(new MenuItem({
        label:'透明窗口',
        click:()=>{
            //创建一个透明窗口
            let subWin ;
            let platform = process.platform.substring(0,3).toLocaleLowerCase();
            if(platform=='win'){
                //在Windows上，仅在无边框窗口下起作用。
                subWin = new BrowserWindow({width:300, height:300, transparent:true, frame:false})
            }else{
                subWin = new BrowserWindow({width:300, height:300, transparent:true})
            }
            //透明窗口无法看到，所以要自动关闭
            setTimeout(()=>{
                if(subWin && !subWin.isDestroyed()) {
                    subWin.close();
                    console.log('透明窗口已关闭');
                }
            }, 3000);
        }
    }));
    return menu;
}

//窗口创建函数
const createWindow = () => {
    //主窗口
    const win = new BrowserWindow({
        width:1000,
        height:600
    });
}

//设置一个主函数
async function main(){

    //启用全局沙盒化，安全设置
    app.enableSandbox();

    //设置应用的菜单信息
    Menu.setApplicationMenu(myApplicationMenu())

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