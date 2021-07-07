const GRID_WIDTH = 7
const GRID_HEIGHT = 5
const NODE_VALUE = {
    START: 'S',
    END: 'E',
    ROCK: '#',
    EMPTY: '.'
}

const ADJACENCY_MATRIX = [
    [-1, 0],
    [+1, 0],
    [0, +1],
    [0, -1],
]

const getStartingNode = (matrix) => {
    for (let y = 0; y < GRID_WIDTH; y++) {
        for (let x = 0; x < GRID_HEIGHT; x++) {
            if (matrix[y][x] === NODE_VALUE.START)
                return { x, y }
        }
    }
}

const solve = (startCoordinates, matrix) => {
    const queue = []
    const visited = {}
    const previous = {}

    queue.push(startCoordinates)
    while (queue.length > 0) {
        const current = queue.shift()

        for (let i = 0; i < 4; i++) {
            const [transformX, transformY] = ADJACENCY_MATRIX[i]
            const neighbourX = current.x + transformX
            const neighbourY = current.y + transformY

            if (
                neighbourX < 0
                || neighbourX >= GRID_WIDTH
                || neighbourY < 0
                || neighbourY >= GRID_HEIGHT
            ) {
                continue
            }

            const mapIdx = `(${neighbourX},${neighbourY})`
            if (visited[mapIdx]) {
                continue
            }

            if (matrix[neighbourY][neighbourX] === NODE_VALUE.ROCK) {
                continue
            }

            queue.push({ x: neighbourX, y: neighbourY })
            visited[mapIdx] = true
            previous[mapIdx] = current

            if (matrix[neighbourY][neighbourX] === NODE_VALUE.END) {
                return { previous, end: { x: neighbourX, y: neighbourY } }
            }
        }
    }

    return { previous, end: null }
}

const reversePreviousPath = (startCoordinates, endCoordinates, previousMap) => {
    const path = []
    let currIdx = `(${endCoordinates.x},${endCoordinates.y})`
    path.push(endCoordinates)

    while (currIdx) {
        const previous = previousMap[currIdx]
        if (previous === startCoordinates) break
        path.push(previous)
        currIdx = `(${previous.x},${previous.y})`
    }

    return path.reverse()
}

const bfs = (matrix) => {
    const startCoordinates = getStartingNode(matrix)
    const { previous, end: endingCoordinates } = solve(startCoordinates, matrix)
    return reversePreviousPath(startCoordinates, endingCoordinates, previous)
}

console.log(bfs([
    ['S', '.', '.', '#', '.', '.', '.'],
    ['.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '.', '.', '.', '.'],
    ['.', '.', '#', '#', '.', '.', '.'],
    ['#', '.', '#', 'E', '.', '.', '.'],
]))