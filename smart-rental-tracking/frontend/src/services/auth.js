// Very simple "auth" — just role selection stored in localStorage. No JWT.

export function saveSession(session) {
  localStorage.setItem("srt_session", JSON.stringify(session));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem("srt_session"));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("srt_session");
}
