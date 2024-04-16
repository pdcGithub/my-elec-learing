const { contextBridge, ipcRenderer } = require('electron');

//暴露 api 给 渲染页面 
contextBridge.exposeInMainWorld('darkmode', {
    'toggle': ()=>ipcRenderer.invoke('dark-mode:toggle'),
    'system': ()=>ipcRenderer.invoke('dark-mode:system')
})