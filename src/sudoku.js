const isValidGuess = (n, guess, index, puzzle) => {
  // check row
  const row = Math.floor(index / n)
  if (puzzle.slice(row*n, row*n + n).includes(guess)) {
    return false
  }

  // check column
  const col = index % n
  for (let i = 0; i < n*n; i+=n) {
    if (puzzle[i + col] === guess) {
      return false
    }
  }

  // check segment
  const segmentN = Math.floor(Math.sqrt(n))
  const segmentX = Math.floor(col / segmentN)
  const segmentY = Math.floor(row / segmentN)

  const startSegment = (segmentX * segmentN) + (n * segmentN * segmentY)

  for (let i = 0; i < segmentN; i++) {
    for (let j = 0; j < segmentN; j++) {
      if (puzzle[startSegment + i*n + j] === guess) {
        return false
      }      
    }    
  }

  return true
}

export function* solve(puzzle) {
  const n = Math.sqrt(puzzle.length)

  if (!Number.isInteger(n)) {
    throw new Error("I solve only square puzzles")
  }

  // Find out which ones need solving
  const emptyPositions = puzzle.map((num, i) => num === 0 && i).filter(pos => pos !== false)
  const solved = Array.from(puzzle)

  let current = 0

  while (current < emptyPositions.length) {
    const position = emptyPositions[current]

    let solution = 0
    let guess = solved[position]

    while (guess < n) {
      if (isValidGuess(n, ++guess, position, solved)) {
        solution = guess
        break
      }
    }

    solved[position] = solution

    if (solution > 0) {
      current++
    } else {
      current--
    }

    yield {
      position,
      solution
    }
  }

  return solved
}