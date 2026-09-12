import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // Cho phép gọi API từ mọi tên miền (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const { action } = req.query;
    let count;

    if (action === 'hit') {
      // Tăng biến đếm lên 1 khi người dùng vào trang
      count = await redis.incr('site_visitor_count');
    } else {
      // Chỉ lấy số lượng hiện tại
      count = await redis.get('site_visitor_count');
      count = count ? Number(count) : 0;
    }

    return res.status(200).json({ success: true, count });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
