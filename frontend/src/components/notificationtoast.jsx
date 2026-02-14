// components/NotificationToast.jsx
import '../styles/NotificationToast.css';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export default function NotificationToast({ notifications, onDismiss }) {
  if (notifications.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`toast toast--${notif.type}`}
          role="alert"
        >
          <span className="toast-icon">{ICONS[notif.type] || ICONS.info}</span>
          <span className="toast-message">{notif.message}</span>
          <button
            className="toast-dismiss"
            onClick={() => onDismiss(notif.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}