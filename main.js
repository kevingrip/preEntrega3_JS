let empanadasData; // Variable para almacenar los datos de las empanadas

// Realiza la solicitud para obtener el archivo JSON
fetch('base.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo JSON.');
    }
    
    return response.json();
  })
  .then(data => {
    // Almacena los datos de las empanadas en la variable empanadasData
    empanadasData = data.empanadas;

    // Inicializa la lista de empanadas disponibles
    const empanadasList = document.getElementById('empanadasList');

    // Recorre cada empanada en los datos y crea elementos <li> para mostrarlos
    empanadasData.forEach(empanada => {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('col-md-3', 'mb-4');

      const card = document.createElement('div');
      card.classList.add('card');

      const cardImage = document.createElement('img');
      cardImage.classList.add('card-img-top');
      cardImage.src = empanada.imagen;
      cardImage.alt = 'Imagen de Empanada';

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardTitle = document.createElement('h2');
      cardTitle.textContent = empanada.catalogo;

      const cardTipo = document.createElement('p');
      cardTipo.textContent = `Tipo: ${empanada.tipo}`;

      const cardHornoBtn = document.createElement('button');
      cardHornoBtn.classList.add('btn', 'btn-primary', 'm-1');
      cardHornoBtn.textContent = `Horno: $${empanada.precioHorno}`;
      cardHornoBtn.addEventListener('click', () => agregarAlCarrito(empanada.id, 'Horno'));

      const cardFritaBtn = document.createElement('button');
      cardFritaBtn.classList.add('btn', 'btn-primary', 'm-1');
      cardFritaBtn.textContent = `Frita: $${empanada.precioFrita}`;
      cardFritaBtn.addEventListener('click', () => agregarAlCarrito(empanada.id, 'Frita'));

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardTipo);
      cardBody.appendChild(cardHornoBtn);
      cardBody.appendChild(cardFritaBtn);

      card.appendChild(cardImage);
      card.appendChild(cardBody);

      cardContainer.appendChild(card);

      empanadasList.appendChild(cardContainer);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

const carrito = [];

// Función para agregar una empanada al carrito
function agregarAlCarrito(empanadaId, tipo) {
    const empanadaSeleccionada = empanadasData.find(empanada => empanada.id === empanadaId);
    
    if (empanadaSeleccionada) {
        // Clona la empanada para evitar modificar la original
        const empanadaEnCarrito = { ...empanadaSeleccionada };
        empanadaEnCarrito.tipo = tipo;
        
        // Verificar si la empanada ya está en el carrito
        const existeEnCarrito = carrito.find(item => item.id === empanadaEnCarrito.id && item.tipo === tipo);

        if (existeEnCarrito) {
            // Si existe, aumenta la cantidad en 1
            existeEnCarrito.cantidad++;
        } else {
            // Si no existe, agrega la empanada al carrito con cantidad 1
            empanadaEnCarrito.cantidad = 1;
            carrito.push(empanadaEnCarrito);
        }

        actualizarCarrito();
    }
}

// Función para incrementar la cantidad de una empanada en el carrito
function incrementarCantidad(empanadaId, tipo) {
    const empanadaEnCarrito = carrito.find(empanada => empanada.id === empanadaId && empanada.tipo === tipo);
    
    if (empanadaEnCarrito && empanadaEnCarrito.cantidad) {
        empanadaEnCarrito.cantidad++;
        actualizarCarrito();
    }
}

// Función para decrementar la cantidad de una empanada en el carrito
function decrementarCantidad(empanadaId, tipo) {
    const empanadaEnCarrito = carrito.find(empanada => empanada.id === empanadaId && empanada.tipo === tipo);
    
    if (empanadaEnCarrito && empanadaEnCarrito.cantidad > 1) {
        empanadaEnCarrito.cantidad--;
        actualizarCarrito();
    }
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const carritoList = document.getElementById("carritoList");
    const totalElement = document.getElementById("total");
    const mostrarCarrito = document.getElementById('mostrarCarrito');
    const botonPagar = document.getElementById('pagar');
    const vaciarCarrito = document.getElementById('vaciarCarrito');
    const mostrarTotal = document.getElementById('mostrartotal');
    const datoInput = document.getElementById('datoInput');

    // Limpia el contenido anterior del carrito
    carritoList.innerHTML = "";
    
    // Calcula el total
    let total = 0;
    
    // Recorre las empanadas en el carrito
    carrito.forEach(empanada => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<div class = "anchoLinea"><div class = "anchoTexto">
        Cantidad: ${empanada.cantidad} - Tipo: ${empanada.tipo} - $${(empanada.tipo === 'Horno' ? empanada.precioHorno : empanada.precioFrita) * empanada.cantidad} - ${empanada.catalogo} </div>
        ${empanada.tipo === 'Horno' ? `<button id='boton' class="btn btn-dark" onclick="incrementarCantidad(${empanada.id}, 'Horno')">+</button> <button id='boton'  class="btn btn-dark" onclick="decrementarCantidad(${empanada.id}, 'Horno')">-</button>` : `<button id='boton' class="btn btn-dark" onclick="incrementarCantidad(${empanada.id}, 'Frita')">+</button> <button id='boton' class="btn btn-dark" onclick="decrementarCantidad(${empanada.id}, 'Frita')">-</button></div>`}`;
        carritoList.appendChild(listItem);
        total += (empanada.tipo === 'Horno' ? empanada.precioHorno : empanada.precioFrita) * empanada.cantidad;
    });
    
    // Actualiza el total en el HTML
    totalElement.innerText = total.toFixed(2);

    if (carrito.length > 0){
        mostrarCarrito.style.display = 'block'; 
        botonPagar.style.display = 'block';    
        vaciarCarrito.style.display = 'block';
        mostrarTotal.style.display = 'block';
        datoInput.style.display = 'block';
    }else{
        mostrarCarrito.style.display = 'none'; 
        botonPagar.style.display = 'none';
        vaciarCarrito.style.display = 'none';
        mostrarTotal.style.display = 'none';
        datoInput.style.display = 'none';
    }
}

const pagado = document.getElementById('pagado');

// vaciar el carrito
document.getElementById("vaciarCarrito").addEventListener("click", () => {
    carrito.length = 0;
    pagado.innerHTML = ``
    actualizarCarrito();
    location.reload();
});

// pagar
document.getElementById("pagar").addEventListener("click", () => {

    const total = parseFloat(document.getElementById("total").innerText.replace("$", ""));
    const pagoCon = parseFloat(document.getElementById("datoInput").value);
    
    if (!isNaN(total) && !isNaN(pagoCon) && pagoCon >= total) {
        const vuelto = pagoCon - total;

        
        pagado.innerHTML = `Pago exitoso. Su vuelto es: $${vuelto.toFixed(2)}`;
        
    } else {
        pagado.innerHTML = `El monto ingresado es insuficiente.`;
    }
    
});

// Inicializa la vista del carrito
actualizarCarrito();