import hash from 'hash-it'

// Using this function to optimize memory usage for Map keys
function hashLongString(str: string): string {
  if (str.length < 1000) {
    return str
  }
  return `h-${hash(str)}`
}

function firstUnique(arr: string[]): string | null {
  // Create a frequency map to count occurrences of each string
  const frequencyMap = new Map<string, number>()

  // First pass: Count occurrences of each string
  for (const element of arr) {
    const key = hashLongString(element)
    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1)
  }

  // Second pass: Find the first string with count 1
  for (const element of arr) {
    const key = hashLongString(element)
    if (frequencyMap.get(key) === 1) {
      return element
    }
  }

  // If no unique element is found, return null
  return null
}

// Example usage
console.log(firstUnique(['apple', 'banana', 'apple', 'orange', 'banana', 'grape'])) // Output: "orange"
console.log(firstUnique(['a', 'b', 'a', 'b', 'c', 'd', 'c'])) // Output: "d"
console.log(firstUnique(['x', 'y', 'x', 'y'])) // Output: null

export { firstUnique }
/*
Time Complexity:
- O(N) where N is the length of the array.
- The first loop builds the frequency map in O(N).
- The second loop scans the array to find the first unique element in O(N).

Space Complexity:
- O(U) where U is the number of unique strings in the array, due to the frequency map.

This approach ensures optimal efficiency and maintains readability!
*/
