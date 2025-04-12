const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // 获取查询参数中的设备类型
    const { size = 'desktop' } = event.queryStringParameters || {};

    // 请求必应壁纸 API
    const apiUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN';
    const apiRes = await axios.get(apiUrl);
    const imagePath = apiRes.data.images[0].url;
    let imageUrl = `https://www.bing.com${imagePath}`;

    // 调整图片尺寸（根据必应 URL 结构修改）
    if (size === 'mobile') {
      imageUrl = imageUrl.replace('1920x1080', '1080x1920');
    }

    // 代理请求图片并返回数据
    const imageRes = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' } // 防止 403 错误
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': imageRes.headers['content-type'],
        'Cache-Control': 'public, max-age=86400', // 缓存一天
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(imageRes.data).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return { statusCode: 500, body: 'Failed to fetch wallpaper' };
  }
};