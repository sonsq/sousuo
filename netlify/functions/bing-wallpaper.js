// netlify/functions/bing-wallpaper.js
const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    const { size = 'desktop' } = event.queryStringParameters || {};

    // 获取北京时间日期（必应壁纸按中国时区更新）
    const now = new Date();
    const cnTime = new Date(now.getTime() + (8 * 3600 * 1000)); // UTC+8
    const dateStamp = cnTime.toISOString().slice(0,10).replace(/-/g,'');
    
    // 请求带缓存的必应API（idx=0表示今日壁纸）
    const apiRes = await axios.get(
      `https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&ts=${dateStamp}&mkt=zh-CN`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    // 构建图片URL（通过日期参数控制客户端缓存）
    let imageUrl = `https://www.bing.com${apiRes.data.images[0].url}`;
    if (size === 'mobile') {
      imageUrl = imageUrl.replace('1920x1080', '1080x1920');
    }
    imageUrl += `?d=${dateStamp}`; // 添加日期参数

    // 代理请求图片
    const imageRes = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': imageRes.headers['content-type'],
        'Cache-Control': 'public, max-age=866400', // 缓存一天
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(imageRes.data).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return { statusCode: 500, body: 'Failed to fetch wallpaper' };
  }
};