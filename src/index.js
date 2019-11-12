const DIRTY = '🗑'
const CLEAN = '✔'

const STATES = [CLEAN, DIRTY]
const VACUUM = '🔥'


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const cleanMatrix = async (matrix, matrixSize) => {
    let x = Math.floor(Math.random() * (matrixSize - 1))
    let y = Math.floor(Math.random() * (matrixSize - 1))

    const matrixElements = matrixSize * matrixSize
    let cleanOnes = new Set([])
    let visitedOnes = new Set([])
    let totalCleaned = 0
    const startTime = new Date().getTime()

    while (cleanOnes.size < matrixElements) {
        console.log(`%c Cleaned places: ${cleanOnes.size}`, 'background: #222; color: #bada55')

        let nearCleanOnes = new Set([])
        let nearDirtyOnes = new Set([])
        visitedOnes.add([x, y])

        // Render the matrix with the vacuum in the actual position
        renderMatrix(matrix, [x, y])
        await sleep(500);

        if (matrix[x][y] == DIRTY) {
            totalCleaned++
            console.log(`%c Cleaning position  x:${x}, y:${y}`, 'background: #222; color: #fffff')
            matrix[x][y] = CLEAN
        } else {
            console.log(`%c The place x:${x}, y:${y} is already clean`, 'background: #222; color: #fffff')
        }

        nearCleanOnes.add([x, y])

        if (y < matrixSize - 1) {
            matrix[x][y + 1] == CLEAN ? nearCleanOnes.add([x, y + 1]) : nearDirtyOnes.add([x, y + 1])

            if (x < matrixSize - 1) {
                matrix[x + 1][y] == CLEAN ? nearCleanOnes.add([x + 1, y]) : nearDirtyOnes.add([x + 1, y])

                matrix[x + 1][y + 1] == CLEAN ? nearCleanOnes.add([x + 1, y + 1]) : nearDirtyOnes.add([x + 1, y + 1])
            }

            if (x > 0) {
                matrix[x - 1][y] == CLEAN ? nearCleanOnes.add([x - 1, y]) : nearDirtyOnes.add([x - 1, y])

                matrix[x - 1][y + 1] == CLEAN ? nearCleanOnes.add([x - 1, y + 1]) : nearDirtyOnes.add([x - 1, y + 1])
            }
        }

        if (y > 0) {
            matrix[x][y - 1] == CLEAN ? nearCleanOnes.add([x, y - 1]) : nearDirtyOnes.add([x, y - 1])

            if (x < matrixSize - 1) {
                matrix[x + 1][y - 1] == CLEAN ? nearCleanOnes.add([x + 1, y - 1]) : nearDirtyOnes.add([x + 1, y - 1])
            }

            if (x > 0) {
                matrix[x - 1][y - 1] == CLEAN ? nearCleanOnes.add([x - 1, y - 1]) : nearDirtyOnes.add([x - 1, y - 1])
            }
        }

        if (nearDirtyOnes.size > 0) {
            // Take the last near dirty place
            let nearDirtyOnesItems = Array.from(nearDirtyOnes)
            let dirtyPlace = nearDirtyOnesItems[nearDirtyOnesItems.length - 1]

            x = dirtyPlace[0]
            y = dirtyPlace[1]
        } else {
            let diff = new Set(nearCleanOnes)

            for (var elem of nearCleanOnes) {
                let visitedOnesJson = JSON.stringify(Array.from(visitedOnes))
                let elemJson = JSON.stringify(elem)

                if (visitedOnesJson.indexOf(elemJson) != -1)
                    diff.delete(elem)
            }

            let cleanPlace = null
            
            if (diff.size > 0) {
                // Takes the first clean place that are not visited
                let diffItems = Array.from(diff)
                cleanPlace = diffItems[0]
            } else {
                // Take randomly near clean place
                let nearCleanOnesItems = Array.from(nearCleanOnes)
                cleanPlace = nearCleanOnesItems[Math.floor(Math.random() * nearCleanOnesItems.length)]
            }

            x = cleanPlace[0]
            y = cleanPlace[1]
        }

        nearCleanOnes.forEach((value) => {
            let cleanOnesJson = JSON.stringify(Array.from(cleanOnes))
            let valueJson = JSON.stringify(value)

            if (cleanOnesJson.indexOf(valueJson) == -1) 
                cleanOnes.add(value)

            nearCleanOnes.delete(value)
        })
    }

    console.log(`%c Cleaned places: ${cleanOnes.size}`, 'background: #222; color: #bada55')

    // Final rendering
    renderMatrix(matrix)

    const endTime = new Date().getTime()
    return (endTime - startTime)
}

const buildMatrix = (matrixSize) => {
    let matrix = []

    for(var i=0; i<matrixSize; i++) {
        matrix[i] = []

        for (var j=0; j<matrixSize; j++) {
            // If Math.random() generates a number less than 0.5 the result will be 0 otherwise it should be 1.
            matrix[i][j] = STATES[Math.round(Math.random())]
        }
    }
    
    return matrix
}

const renderMatrix = (matrix, vacuumPosition=null) => {
    let tableDiv = document.getElementById('tableDiv')

    // Remove all childs of the tableDiv (previously tables)
    while (tableDiv.firstChild) tableDiv.removeChild(tableDiv.firstChild)

    //create a Table Object
    let table = document.createElement('table')
    //iterate over every array(row) within matrix
    for (let [x, row] of matrix.entries()) {
        //Insert a new row element into the table element
        table.insertRow()
        //Iterate over every index(cell) in each array(row)
        for (let [y, cell] of row.entries()) {
            //While iterating over the index(cell)
            //insert a cell into the table element
            let newCell = table.rows[table.rows.length - 1].insertCell()
            //add text to the created cell element, add vacuum if there is at this position
            if (vacuumPosition && vacuumPosition[0] === x  && vacuumPosition[1] === y)
                newCell.textContent = `${VACUUM} ${cell}`
            else
                newCell.textContent = `${cell}`
            
            let cellClass = cell === DIRTY ? 'dirty' : 'clean'
            newCell.className = cellClass
        }
    }
    //append the compiled table to the DOM
    tableDiv.appendChild(table)
}

document.getElementById('runButton').addEventListener('click', function () {
    var size = document.getElementById("size").value
    let matrix = buildMatrix(size)
    var timeConsumed = cleanMatrix(matrix, size)
    document.getElementById("time").innerHTML = timeConsumed
});
