onmessage = (e) => {
    //输出接收到的信息
    console.log('我是 worker-2, 我收到了主进程发来的信息：'+e.data)
    let randomStr = Math.random()+""
    randomStr = randomStr.substring(randomStr.length-4)
    //发送一个消息给主进程。。。
    postMessage("你好，我是worker-2，有什么可以帮到您？"+randomStr)
}