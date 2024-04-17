window.addEventListener('keyup', (event)=>{
    document.getElementById("last-keypress").innerText = event.key;
    console.log(`你摁下了，${event.key}`);
}, true)