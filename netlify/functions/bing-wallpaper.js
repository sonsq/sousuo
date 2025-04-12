const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    const { size = 'desktop' } = event.queryStringParameters || {};

    // 生成北京时间当日0点的时间戳（缓存标识）
    const now = new Date();
    const cnTimestamp = Math.floor((now.getTime() + 8*3600*1000) / 86400000 | 0;
    
    // 请求必应API（带缓存标识参数）
    const apiRes = await axios.get(
      `https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&_=${cnTimestamp}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    // 构建图片URL
    let imageUrl = `https://www.bing.com${apiRes.data.images[0].url}`;
    if (size === 'mobile') {
      imageUrl = imageUrl.replace('1920x1080', '1080x1920');
    }

    // 代理请求图片
    const imageRes = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': imageRes.headers['content-type'],
        'Cache-Control': 'public, max-age=86400', // 24小时缓存
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(imageRes.data).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return { statusCode: 500, body: 'Failed to fetch wallpaper' };
  }
};