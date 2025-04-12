<script>
// 获取北京时间当日0点的时间戳
function getDayStamp() {
  const now = new Date()
  return Math.floor((now.getTime() + 8*3600*1000) / 86400000)
}

// 设置背景并启动刷新检测
function setWallpaper() {
  const isMobile = window.innerWidth <= 768
  const url = `/.netlify/functions/bing-wallpaper?size=${isMobile ? 'mobile' : 'desktop'}`
  document.body.style.backgroundImage = `url("${url}")`
}

// 每日0点自动刷新
function startRefreshTimer() {
  const now = new Date()
  const cnTime = new Date(now.getTime() + 8*3600*1000)
  const nextRefresh = new Date(cnTime)
  nextRefresh.setUTCHours(24, 0, 0, 0)
  
  setTimeout(() => {
    setWallpaper()    // 软刷新背景
    startRefreshTimer() // 重置定时器
  }, nextRefresh - cnTime)
}

// 初始化
setWallpaper()
startRefreshTimer()

// 窗口尺寸变化监听（保持响应式）
let lastMobileState = window.innerWidth <= 768
window.addEventListener('resize', () => {
  const newState = window.innerWidth <= 768
  if (lastMobileState !== newState) {
    lastMobileState = newState
    setWallpaper()
  }
})
</script>