//添加一个按钮点击事件，用于发送消息
document.getElementById('myNotif').addEventListener('click', (event)=>{
    event.preventDefault();
    if(window.Notification){
        new window.Notification('标题', {
            body:"这是一条由按钮触发的 渲染进程的消息。"
        })
    }else{
        alert("你的浏览器不支持 Notification 处理，所以弹出这个消息");
    }
})