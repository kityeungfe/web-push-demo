export default function Home() {
  return (
    <div>
      <h1>Push Notifications</h1>
      <button onClick={() => Notification.requestPermission()}>Request Permission</button>
      <button
        onClick={() => {
          if (Notification.permission === 'granted') {
            new Notification('Test Notification');
          }
        }}
      >
        Test Notification
      </button>
    </div>
  );
}
