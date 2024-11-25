import webPush from 'web-push';

// VAPID Keys
const PUBLIC_VAPID_KEY = 'BBBPRNAdc92JbUOQo4kpvMLKDfKoMG2yJSxeYWary9xZ2XrH9Xprfup0A2U2c9ib5yBM2TZhHlglJxDTlq4IcVo';
const PRIVATE_VAPID_KEY = 'EH56pQLvdd57_xL5P1MHDIWGwxb71A3YP-rEtkCUJAw';

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

let subscriptions = [{
    endpoint: 'https://fcm.googleapis.com/fcm/send/dOWNN4HXA6s:APA91bFBAAs0KRw9bJC-lx2ieWRyDh07L0R0OfHeeuXjIFETe80NtqZ7gVet1_KPz_qqd_nHIpslQlEEPgIsKIKiIYtY3fG1rRM7podCLXqdNkGLJTqmiO4okWZksu6W68cMaCU7IWcv',
    expirationTime: null,
    keys: {
      p256dh: 'BCl8rv1DzLvKjpuozK6b8Jv7yp4aDOcN5Jtc0M63NY2DsdWtkfuQNrkYNm24uwg-TsGS4JTyGlKCXRuHCoisZbA',
      auth: 'BBVlMitYRNkoDSydpN-T2A'
    }
  }]; // 确保和订阅 API 共用存储

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required.' });
    }

    const payload = JSON.stringify({ title, body });

    // 向每个订阅者发送通知
    subscriptions = subscriptions.filter((subscription) => {
      return webPush
        .sendNotification(subscription, payload)
        .then(() => true)
        .catch((error) => {
          console.error('Error sending notification:', error);
          return false; // 移除无效的订阅
        });
    });

    res.status(200).json({ message: 'Notifications sent successfully.' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }
}
