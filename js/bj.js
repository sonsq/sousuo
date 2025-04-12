// 根据屏幕尺寸选择壁纸类型
const isMobile = window.innerWidth <= 768;
const size = isMobile ? 'mobile' : 'desktop';
//const wallpaperUrl = `/.netlify/functions/bing-wallpaper?size=${size}`;

// 添加时间戳到URL（防止HTML页面缓存）
const wallpaperUrl = `/.netlify/functions/bing-wallpaper?size=${size}&t=${new Date().getHours()}`;

// 定时每天0点强制刷新
setInterval(() => {
  if (new Date().getHours() === 0 && new Date().getMinutes() === 0) {
    location.reload();
  }
}, 60000); // 每分钟检查一次
// 设置背景图片
document.body.style.backgroundImage = `url("${wallpaperUrl}")`;

// 可选：窗口大小变化时重新加载（根据需求调整）
 window.addEventListener('resize', () => {
  const newIsMobile = window.innerWidth <= 768;
  if (isMobile !== newIsMobile) location.reload();
});