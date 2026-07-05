// Generates a random anonymous ID once per browser and remembers it,
// so "like" actions can be tied to a "user" without building real auth.
export function getUserId() {
  let id = localStorage.getItem("nook_user_id");
  if (!id) {
    id = "user_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("nook_user_id", id);
  }
  return id;
}
