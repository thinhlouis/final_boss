function formatDurationVideo(seconds) {
  if (!seconds) return;
  const totalSeconds = Math.floor(seconds); // Cắt phần thập phân
  const hour = Math.floor(totalSeconds / 60 / 60);
  const mins = Math.floor((totalSeconds / 60) % 60);
  const secs = totalSeconds % 60;

  if (hour === 0) {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(hour).padStart(2, "")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
}

export default formatDurationVideo;
