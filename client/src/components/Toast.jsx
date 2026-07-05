export default function Toast({ message, type = "success" }) {
  if (!message) return null;

  return (
    <div className={`toast toast--${type}`} role="status">
      <span className="toast__dot" />
      {message}
    </div>
  );
}
