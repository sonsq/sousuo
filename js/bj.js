// 根据屏幕尺寸选择壁纸类型
const isMobile = window.innerWidth <= 768;
const size = isMobile ? 'mobile' : 'desktop';
const wallpaperUrl = `/.netlify/functions/bing-wallpaper?size=${size}`;

// 设置背景图片
document.body.style.backgroundImage = `url("${wallpaperUrl}")`;

/* // 可选：窗口大小变化时重新加载（根据需求调整）
window.addEventListener('resize', () => {
  const newIsMobile = window.innerWidth <= 768;
  if (isMobile !== newIsMobile) location.reload();
}); */
