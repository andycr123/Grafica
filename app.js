
const apiUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const resultadoElemento = document.getElementById('container');

// Función para hacer la solicitud fetch a la API
function consumirAPI() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => mostrarResultado(data))
        .catch(error => console.error('Error:', error));
}

function mostrarResultado(data) {
    resultadoElemento.innerHTML = JSON.stringify(data, null, 2);
}


consumirAPI();
