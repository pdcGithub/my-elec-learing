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