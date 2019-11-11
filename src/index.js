const cleanMatrix = (matrix, matrixSize) => {
    let x = Math.floor(Math.random() * (matrixSize - 1))
    let y = Math.floor(Math.random() * (matrixSize - 1))

    const matrixElements = size * size
    let cleanOnes = []
    let visitedOnes = []
    let totalCleaned = 0
    const startTime = new Date().getTime()

    



    const endTime = new Date().getTime()
    return (endTime - startTime)
}

const buildMatrix = (matrixSize) => {
    let matrix = []

    for(var i=0; i<matrixSize; i++) {
        matrix[i] = []

        for (var j=0; j<matrixSize; j++) {
            // If Math.random() generates a number less than 0.5 the result will be 0 otherwise it should be 1.
            matrix[i][j] = Math.round(Math.random())
        }
    }
    
    return matrix
}

const renderMatrix = (matrix) => {
    const tableDiv = document.getElementById('tableDiv')

    // Remove all childs of the tableDiv (previously tables)
    while (tableDiv.firstChild) tableDiv.removeChild(tableDiv.firstChild)

    //create a Table Object
    let table = document.createElement('table')
    //iterate over every array(row) within matrix
    for (let row of matrix) {
        //Insert a new row element into the table element
        table.insertRow()
        //Iterate over every index(cell) in each array(row)
        for (let cell of row) {
            //While iterating over the index(cell)
            //insert a cell into the table element
            let newCell = table.rows[table.rows.length - 1].insertCell()
            //add text to the created cell element
            newCell.textContent = cell
        }
    }
    //append the compiled table to the DOM
    tableDiv.appendChild(table)
}

document.getElementById('runButton').addEventListener('click', function () {
    var size = document.getElementById("size").value
    let matrix = buildMatrix(size)
    renderMatrix(matrix)
    var timeConsumed = cleanMatrix(matrix, size)
    document.getElementById("time").innerHTML = timeConsumed
});
