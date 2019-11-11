const cleanMatrix = (matrixSize) => {
    console.log(matrixSize, 'MATRIX SIZE');
}


document.getElementById('runButton').addEventListener('click', function () {
    var size = document.getElementById("size").value;
    var timeConsumed = cleanMatrix(size);
    document.getElementById("time").innerHTML = timeConsumed;
});