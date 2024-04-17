function multiThreadTest(){

    console.log("==================================");
    console.log(" 多线程测试，开始了");
    console.log("==================================");

    //增加一个 web worker 测试一下 多线程处理
    let worker1 = new Worker('worker1.js');
    let worker2 = new Worker('worker2.js');
    //设置 主进程 接收消息
    worker1.onmessage = (e) => {
        console.log('>>> 主程序接收到信息-1：'+e.data);
    }
    worker2.onmessage = (e) => {
        console.log('>>> 主程序接收到信息-2：'+e.data);
    }

    //开始调用
    let workcount1 = 0;
    let workcount2 = 0;
    setInterval(()=>{
         worker1.postMessage('主程序测试1')
         workcount1++
         //调用10次后，关闭
         if(workcount1>10) worker1.terminate()
    }, 1000);
    setInterval(()=>{
        worker2.postMessage('主程序测试2')
        workcount2++
        //调用10次后，关闭
        if(workcount2>10) worker2.terminate()
    }, 3000);
}

//添加按钮点击事件
document.getElementById("startBtn").addEventListener('click', multiThreadTest)