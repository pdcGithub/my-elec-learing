//设置切换主题按钮
document.getElementById('toggle-dark-mode').addEventListener('click', async ()=>{
    const isDarkMode = await window.darkmode.toggle();
    document.getElementById('theme-source').innerText = isDarkMode ? 'Dark' : 'Light'
})
//设置恢复默认按钮
document.getElementById('reset-to-system').addEventListener('click', async ()=>{
    window.darkmode.system();
    document.getElementById('theme-source').innerText = "System"
})