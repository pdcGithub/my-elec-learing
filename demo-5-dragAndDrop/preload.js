const { contextBridge, ipcRenderer } = require('electron');

//这里将全局信息暴露出来，以供renderer.js 使用
contextBridge.exposeInMainWorld('electron', {
    //暴露一个被称为 startDrag 函数来触发该处理程序
    startDrag:(filename)=>ipcRenderer.send('ondragstart', filename)
});