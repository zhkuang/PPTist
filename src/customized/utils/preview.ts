

function preventDefault(event) {
    event.preventDefault();
}

// 禁止鼠标行为和隐藏光标
function disableMouse() {
    document.body.style.cursor = 'none';
    document.body.addEventListener('mousemove', preventDefault);
    document.body.addEventListener('mousedown', preventDefault);
    document.body.addEventListener('mouseup', preventDefault);
    document.body.addEventListener('click', preventDefault);
    document.body.addEventListener('dblclick', preventDefault);
    document.body.addEventListener('contextmenu', preventDefault);
}

// 恢复鼠标行为和显示光标
function enableMouse() {
    document.body.style.cursor = 'default';
    document.body.removeEventListener('mousemove', preventDefault);
    document.body.removeEventListener('mousedown', preventDefault);
    document.body.removeEventListener('mouseup', preventDefault);
    document.body.removeEventListener('click', preventDefault);
    document.body.removeEventListener('dblclick', preventDefault);
    document.body.removeEventListener('contextmenu', preventDefault);
}


function onFullScreenChange() {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        console.log('进入全屏模式');
        disableMouse()
    } else {
        console.log('退出全屏模式');
        enableMouse()
    }
}

document.addEventListener('fullscreenchange', onFullScreenChange);
document.addEventListener('mozfullscreenchange', onFullScreenChange);
document.addEventListener('webkitfullscreenchange', onFullScreenChange);
document.addEventListener('msfullscreenchange', onFullScreenChange);
