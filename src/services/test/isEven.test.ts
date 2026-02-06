import { isEven } from './isEven'
describe('isEven', () => {
  it('возвращает false для нечётного числа', () => {
    expect(isEven(1)).toBe(false)
    expect(isEven(3)).toBe(false)
    expect(isEven(5)).toBe(false)
  })

  it('возвращает true для чётного числа', () => {
    expect(isEven(2)).toBe(true)
    expect(isEven(4)).toBe(true)
    expect(isEven(6)).toBe(true)
  })

  it('возвращает true для нуля', () => {
    expect(isEven(0)).toBe(true)
  })

  it('работает с отрицательными числами', () => {
    expect(isEven(-1)).toBe(false)
    expect(isEven(-2)).toBe(true)
  })
})
