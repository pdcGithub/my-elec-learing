const infomation = document.getElementById('info');
infomation.innerText = `本应用正在使用 Chrome (${versions.chrome()}), Node (${versions.node()}), Electron (${versions.electron()})`;

const func = async ()=>{
    const response = await window.versions.ping();
    console.log(response);
}

func();