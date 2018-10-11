import Player from '../player'

let fullscreen = function () {
  let player = this; let util = Player.util
  let scale = 0.03
  let iconPath = {
    active: 'M682 342h128v84h-212v-212h84v128zM598 810v-212h212v84h-128v128h-84zM342 342v-128h84v212h-212v-84h128zM214 682v-84h212v212h-84v-128h-128z',
    default: 'M598 214h212v212h-84v-128h-128v-84zM726 726v-128h84v212h-212v-84h128zM214 426v-212h212v84h-128v128h-84zM298 598v128h128v84h-212v-212h84z'
  }
  let btn = util.createDom('xg-fullscreen', `<xg-icon class="xgplayer-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
            <path transform="scale(${scale} ${scale})" d="${iconPath.default}"></path>
        </svg></xg-icon>`, {}, 'xgplayer-fullscreen')
  let tipsFull = player.config.lang && player.config.lang === "zh-cn" ? "全屏" : "Full screen"
  let tipsExitFull = player.config.lang && player.config.lang === "zh-cn" ? "退出全屏" : "Exit full screen"
  let root = player.controls; let container = player.root
  let tips = util.createDom('xg-tips', tipsFull, {}, 'xgplayer-tips')
  let path = btn.querySelector('path')
  btn.appendChild(tips)
  let isFullScreenEl = function (el) {
    let fullEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    return fullEl === el;
  };
  let getFullscreen = function (el) {
    if (el) {
      // 追加专有的结束全屏的方法
      try {
        el.querySelector('video').xgExitFullScreen = function () { exitFullscreen(el); };
      } catch (e) {
        //
      }
    }
    let fullscreeSupport = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled
    path.setAttribute('d', iconPath.active)
    tips.textContent = tipsExitFull
    if (fullscreeSupport) {
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitEnterFullscreen || el.webkitEnterFullScreen || el.enterFullScreen) {
        el.enterFullScreen && el.enterFullScreen();
        el.webkitEnterFullscreen && el.webkitEnterFullscreen();
        el.webkitEnterFullScreen && el.webkitEnterFullScreen();
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
      } else {
        util.addClass(el, 'xgplayer-fullscreen-active')
      }
    } else {
      util.addClass(el, 'xgplayer-fullscreen-active')
    }
    if (!isFullScreenEl(el)) {
      util.addClass(el, 'xgplayer-fullscreen-active')
    }
  }
  let exitFullscreen = function (el) {
    let fullscreeSupport = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled
    path.setAttribute('d', iconPath.default)
    tips.textContent = tipsFull
    if (fullscreeSupport) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      el.webkitExitFullScreen && el.webkitExitFullScreen();
      el.webkitExitFullscreen && el.webkitExitFullscreen();
    } else {
      util.removeClass(el, 'xgplayer-fullscreen-active')
    }
    util.removeClass(el, 'xgplayer-fullscreen-active');
  }
  root.appendChild(btn);
  ['click', 'touchstart'].forEach(item => {
    btn.addEventListener(item, function (e) {
      e.preventDefault()
      e.stopPropagation()
      if (util.hasClass(container, 'xgplayer-fullscreen-active') || util.hasClass(container, 'xgplayer-is-fullscreen')) {
        exitFullscreen(container)
      } else {
        getFullscreen(container)
      }
    })
  })

  let handle = function (e) {
    let fullscreenEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
    if (fullscreenEl && fullscreenEl === container) {
      util.addClass(container, 'xgplayer-is-fullscreen')
      path.setAttribute('d', iconPath.active)
      tips.textContent = tipsExitFull
    } else {
      util.removeClass(container, 'xgplayer-is-fullscreen')
      path.setAttribute('d', iconPath.default)
      tips.textContent = tipsFull
    }
  };

  btn.addEventListener('mouseenter', (e)=>{
      e.preventDefault();
      e.stopPropagation();
      tips.style.left = "50%"
      let rect = tips.getBoundingClientRect()
      let rootRect = container.getBoundingClientRect()
      if(rect.right > rootRect.right)  {
          tips.style.left = `${- rect.right + rootRect.right + 16}px`
      }
  });

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(item => {
    document.addEventListener(item, handle)
  })

  player.once('destroy', function () {
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(item => {
      document.removeEventListener(item, handle)
    })
    btn = null
  })
}

Player.install('fullscreen', fullscreen)
