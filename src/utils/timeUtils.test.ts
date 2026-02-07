import { formatTime, getTimePanel } from './helpers'
describe('formatTime', () => {
  it('форматирует время в формате ММ:СС для времени меньше часа', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(1)).toBe('00:01')
    expect(formatTime(59)).toBe('00:59')
    expect(formatTime(60)).toBe('01:00')
    expect(formatTime(61)).toBe('01:01')
    expect(formatTime(120)).toBe('02:00')
    expect(formatTime(125)).toBe('02:05')
    expect(formatTime(3599)).toBe('59:59')
  })

  it('форматирует время в формате ЧЧ:ММ:СС для времени больше часа', () => {
    expect(formatTime(3600)).toBe('01:00:00')
    expect(formatTime(3601)).toBe('01:00:01')
    expect(formatTime(3660)).toBe('01:01:00')
    expect(formatTime(3661)).toBe('01:01:01')
    expect(formatTime(7200)).toBe('02:00:00')
    expect(formatTime(7265)).toBe('02:01:05')
    expect(formatTime(86400)).toBe('24:00:00')
  })

  it('обрабатывает некорректные значения', () => {
    expect(formatTime(NaN)).toBe('0:00')
    expect(formatTime(-1)).toBe('0:00')
    expect(formatTime(-100)).toBe('0:00')
    expect(formatTime(Infinity)).toBe('0:00') // Теперь работает!
    expect(formatTime(-Infinity)).toBe('0:00') // Теперь работает!
  })

  it('округляет дробные секунды', () => {
    expect(formatTime(1.5)).toBe('00:01')
    expect(formatTime(60.9)).toBe('01:00')
    expect(formatTime(125.99)).toBe('02:05')
  })
})

describe('getTimePanel', () => {
  it('возвращает только текущее время, если длительность не указана', () => {
    expect(getTimePanel({ currentTime: 65, duration: undefined })).toBe('01:05')
    expect(getTimePanel({ currentTime: 0, duration: undefined })).toBe('00:00')
  })

  it('возвращает строку "текущее / общее" время, если длительность указана', () => {
    expect(getTimePanel({ currentTime: 65, duration: 300 })).toBe(
      '01:05 / 05:00',
    )
    expect(getTimePanel({ currentTime: 0, duration: 120 })).toBe(
      '00:00 / 02:00',
    )
    expect(getTimePanel({ currentTime: 3600, duration: 7200 })).toBe(
      '01:00:00 / 02:00:00',
    )
  })

  it('корректно форматирует время с часами', () => {
    expect(getTimePanel({ currentTime: 3665, duration: 7265 })).toBe(
      '01:01:05 / 02:01:05',
    )
  })

  it('обрабатывает некорректные значения времени', () => {
    expect(getTimePanel({ currentTime: NaN, duration: 100 })).toBe(
      '0:00 / 01:40',
    )
    expect(getTimePanel({ currentTime: 50, duration: NaN })).toBe('00:50')
    expect(getTimePanel({ currentTime: NaN, duration: undefined })).toBe('0:00')
  })
})
