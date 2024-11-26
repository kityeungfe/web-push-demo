import { useState, useEffect } from 'react';

export default function Home() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/worker.js');
    }
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    if (!('serviceWorker' in navigator)) return alert('Service Worker is not supported in your browser.');

    const applicationServerKey = urlBase64ToUint8Array(
      'BBBPRNAdc92JbUOQo4kpvMLKDfKoMG2yJSxeYWary9xZ2XrH9Xprfup0A2U2c9ib5yBM2TZhHlglJxDTlq4IcVo'
    );
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    setIsSubscribed(true);
  };

  const sendNotification = async () => {
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Hello!', body: 'This is a test notification.' }),
    });
  };

  return (
    <div>
      <button onClick={subscribe} disabled={isSubscribed}>
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </button>
      <br />
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
}
