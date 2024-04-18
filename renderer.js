//给页面的div一个拖拽事件
document.getElementById('drag1').ondragstart = (event)=>{
    event.preventDefault();
    window.electron.startDrag('README.md');
}