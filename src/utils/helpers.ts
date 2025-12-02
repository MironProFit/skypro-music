export function formatTime(time: number) {
  if (isNaN(time) || time < 0) return '0:00'
  const totalSeconds = Math.floor(time)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds)}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds)}`
}

export const getTimePanel = ({
  currentTime,
  duration,
}: {
  currentTime: number
  duration: number | undefined
}) => {
  if (duration) {
    return `${formatTime(currentTime)} / ${formatTime(duration)}`
  }

  return formatTime(currentTime)
}
