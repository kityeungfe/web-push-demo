import webPush from 'web-push';

// VAPID Keys
const PUBLIC_VAPID_KEY = 'BBBPRNAdc92JbUOQo4kpvMLKDfKoMG2yJSxeYWary9xZ2XrH9Xprfup0A2U2c9ib5yBM2TZhHlglJxDTlq4IcVo';
const PRIVATE_VAPID_KEY = 'EH56pQLvdd57_xL5P1MHDIWGwxb71A3YP-rEtkCUJAw';

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

const subscriptions = []; // 暂存订阅，建议使用数据库存储

export default function handler(req, res) {
  if (req.method === 'POST') {
    const subscription = req.body;

    if (!subscription) {
      return res.status(400).json({ error: 'Subscription details are required.' });
    }

    console.log('subscription', subscription);

    // 保存订阅
    subscriptions.push(subscription);

    res.status(201).json({ message: 'Subscription added successfully.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
