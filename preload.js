const { contextBridge, ipcRenderer } = require('electron');

//这里将全局信息暴露出来，以供renderer.js 使用
contextBridge.exposeInMainWorld('versions', {
    node:()=>process.versions.node,
    chrome:()=>process.versions.chrome,
    electron:()=>process.versions.electron,
    //暴露一个被称为 ipcRenderer.invoke 的ping函数来触发该处理程序
    ping:()=>ipcRenderer.invoke('ping')
});

window.addEventListener('DOMContentLoaded', ()=>{
    const replaceText = (selector, text)=>{
        const element = document.getElementById(selector)
        if(element) element.innerText = text;
    }
    for(const dependency of ['chrome', 'node', 'electron']){
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
});