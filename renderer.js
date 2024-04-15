//这里，我们使用暴露的全局信息来获取版本号
const infomation = document.getElementById('info');
infomation.innerText = `本应用正在使用 Chrome (${versions.chrome()}), Node (${versions.node()}), Electron (${versions.electron()})`;

//一个简单的ping处理
const pingfunc = async ()=>{
    const response = await window.versions.ping('参数1', '参数2');
    alert(response);
}

//一个ping按钮
const btnPing = document.getElementById("testPing");
btnPing.onclick = pingfunc;

//一个set-title按钮
const btnSetTitle = document.getElementById("setTitle");
btnSetTitle.addEventListener('click', ()=>{
    //创建一个随机值
    let randomStr = (Math.random()+"");
    console.log();
    //把随机值传递过去，作为 title
    window.versions.setTitle(randomStr.substring(randomStr.length-4));
});

//一个btnOpenFile按钮
const btnOpenFile = document.getElementById("btnOpenFile");
btnOpenFile.addEventListener('click', async ()=>{
    //点击后，等待后台返回选择的结果
    const response = await window.versions.openFile();
    document.getElementById("fileInfo").innerText = response;
});