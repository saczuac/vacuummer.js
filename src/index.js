const DIRTY = '🗑'
const CLEAN = '✔'

const STATES = [CLEAN, DIRTY]
const VACUUM = '🔥'


// Sleeps the ms passed by param
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const cleanMatrix = async (matrix, matrixSize) => {
    // Take initial position of vacuum randomly
    let x = Math.floor(Math.random() * (matrixSize - 1))
    let y = Math.floor(Math.random() * (matrixSize - 1))

    const matrixElements = matrixSize * matrixSize
    let cleanOnes = new Set([])
    let visitedOnes = new Set([])
    let totalCleaned = 0
    const startTime = new Date().getTime()

    // Check the if all the elements of matrix are clean
    while (cleanOnes.size < matrixElements) {
        let nearCleanOnes = new Set([])
        let nearDirtyOnes = new Set([])

        // Add this position to visiteds
        visitedOnes.add([x, y])

        // Render the matrix with the vacuum in the actual position
        renderMatrix(matrix, [x, y])

        // Sleep 500ms for visual purposes
        await sleep(500);

        // If the position is dirty clean it! and increase totalCleaned counter
        if (matrix[x][y] == DIRTY) {
            totalCleaned++
            console.log(`%c Cleaning position  x:${x}, y:${y}`, 'background: #222; color: #bada55')
            matrix[x][y] = CLEAN
        } else {
            console.log(`%c The place x:${x}, y:${y} is already clean`, 'background: #222; color: #bada55')
        }

        // Add the actual position to near clean positions (in order to be added on cleanOnes Set after)
        nearCleanOnes.add([x, y])

        // Check near positions and then add this positions to near clean/dirty sets
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

        // If there is one near dirty position at least, take it for the next position
        if (nearDirtyOnes.size > 0) {
            // Take the last near dirty place
            let nearDirtyOnesItems = Array.from(nearDirtyOnes)
            let dirtyPlace = nearDirtyOnesItems[nearDirtyOnesItems.length - 1]

            x = dirtyPlace[0]
            y = dirtyPlace[1]
        // If no near dirty positions, take a clean position
        } else {
            let diff = new Set(nearCleanOnes)

            // Calculate difference between near clean positions and visited positions
            for (var elem of nearCleanOnes) {
                let visitedOnesJson = JSON.stringify(Array.from(visitedOnes))
                let elemJson = JSON.stringify(elem)

                if (visitedOnesJson.indexOf(elemJson) != -1)
                    diff.delete(elem)
            }

            let cleanPlace = null
            
            // If difference has at least one position take it for check (a position no visited)
            if (diff.size > 0) {
                // Takes the first clean place that are not visited
                let diffItems = Array.from(diff)
                cleanPlace = diffItems[0]
            } else {
                // Else, take randomly near clean place (all near clean positions are visited)
                let nearCleanOnesItems = Array.from(nearCleanOnes)
                cleanPlace = nearCleanOnesItems[Math.floor(Math.random() * nearCleanOnesItems.length)]
            }

            x = cleanPlace[0]
            y = cleanPlace[1]
        }

        // Update the clean set with the near clean positions
        nearCleanOnes.forEach((value) => {
            let cleanOnesJson = JSON.stringify(Array.from(cleanOnes))
            let valueJson = JSON.stringify(value)

            if (cleanOnesJson.indexOf(valueJson) == -1) 
                cleanOnes.add(value)

            nearCleanOnes.delete(value)
        })
    }

    console.log(`%c Cleaned places: ${totalCleaned}`, 'background: #222; color: #bada55')

    // Final rendering
    renderMatrix(matrix)

    const endTime = new Date().getTime()
    return (endTime - startTime)
}

// Builds a matrix of matrixSize (matrixSize * matrixSize)
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

// Render the matrix passed by params as a table on the DOM, if vacuumPosition is not null render it
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

// Click listener
document.getElementById('runButton').addEventListener('click', function () {
    // Take size from the DOM
    var size = document.getElementById("size").value
    // Build Matrix
    let matrix = buildMatrix(size)
    // Clean Matrix with the vacuum, and then render the time consumed
    cleanMatrix(matrix, size).then(timeConsumed => 
        document.getElementById("time").innerHTML = `${timeConsumed} ms`
    )
});
