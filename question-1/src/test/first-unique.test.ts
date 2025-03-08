import { firstUnique } from '../index' // Adjust the import path

describe('firstUnique', () => {
  test('should return first unique element for mixed fruits', () => {
    expect(firstUnique(['apple', 'banana', 'apple', 'orange', 'banana', 'grape'])).toBe('orange')
  })

  test('should find first unique after multiple duplicates', () => {
    expect(firstUnique(['a', 'b', 'a', 'b', 'c', 'd', 'c'])).toBe('d')
  })

  test('should return null when no unique elements', () => {
    expect(firstUnique(['x', 'y', 'x', 'y'])).toBe(null)
  })

  test('should return null for empty array', () => {
    expect(firstUnique([])).toBe(null)
  })

  test('should return single element', () => {
    expect(firstUnique(['unique'])).toBe('unique')
  })

  test('should return first element when all unique', () => {
    expect(firstUnique(['a', 'b', 'c'])).toBe('a')
  })

  test('should handle unique long string', () => {
    const longStr = 'a'.repeat(1000)
    expect(firstUnique([longStr, 'short'])).toBe(longStr)
  })

  test('should handle duplicate long strings', () => {
    const longStr = 'a'.repeat(1000)
    // Note: This test will fail due to the identified bug in the original code
    // The correct expectation should be null, but current implementation returns longStr
    expect(firstUnique([longStr, longStr])).toBe(null)
  })

  test('should handle mixed long and short duplicates', () => {
    const longStr = 'a'.repeat(1000)
    const arr = [longStr, 'short', longStr, 'short']
    // This test will also fail due to the bug with long string handling
    expect(firstUnique(arr)).toBe(null)
  })
})
