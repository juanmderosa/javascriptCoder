//Produtos en venta
const stockProductos = [

    {
        id: 1,
        nombreProducto: "Guitarra Clásica",
        precio : 1000,
        img: "./assets/img/tienda1.png",
        cantidad: 1,
        descripcion: "Marca: Antigua Casa Nuñez"
    },
    {
        id: 2,
        nombreProducto: "Guitarra Acústica",
        precio : 1500,
        img: "./assets/img/tienda2.png",
        cantidad: 1,
        descripcion: "Marca: Fender"
    },
    {
        id: 3,
        nombreProducto: "Guitarra Eléctrica",
        precio : 2000,
        img: "./assets/img/tienda3.png",
        cantidad: 1,
        descripcion: "Marca: Fender"
    },
    {
        id: 4,
        nombreProducto: "Bajo Eléctrico",
        precio : 2500,
        img: "./assets/img/tienda4.png",
        cantidad: 1,
        descripcion: "Marca: Fender"
    },
    {
        id: 5,
        nombreProducto: "Piano Eléctrico",
        precio : 3000,
        img: "./assets/img/tienda5.png",
        cantidad: 1,
        descripcion: "Marca: Artesia"
    },
    {
        id: 6,
        nombreProducto: "Batería",
        precio : 5000,
        img: "./assets/img/tienda6.png",
        cantidad: 1,
        descripcion: "Marca: Yamaha"
    }

]

let carrito = [];

const API = "../stock.json";

const getData = async () => {
    try {
        const response = await fetch(API);
        const data = await response.json();
        return data;

    } catch (error) {
        alert("Hubo un error en la petición", error);
    }
}


//Función que renderiza los Productos
function mostrarProductos(){

    const contenedorProductos = document.getElementById('contenedor-productos')

    stockProductos.forEach((producto) => {
        const div = document.createElement('div')
        div.classList.add('productos')
        div.innerHTML = 
        `
    
            <div class="mb-5 d-flex justify-content-center">
            <div class="card text-dark">
                <img class="card-img-top" src="${producto.img}" alt="Card image cap">
                <div class="cardBody">
                    <h5 class="card-title">${producto.nombreProducto}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="cardPrice">$${producto.precio}</p>
                    <button id="agregar${producto.id}" class="btn btn-primary boton-agregar">Agregar al Carrito</button>
                </div>
            </div>
            </div>
            `
        
        contenedorProductos.appendChild(div);

        const boton = document.getElementById(`agregar${producto.id}`)
    
    
        boton.addEventListener('click', () => {
            agregarAlCarrito(producto.id)
        })

        boton.addEventListener("click", ()=>{
            Toastify({
                text: "Producto agregado al carrito",
                duration: 500,
                gravity: "top",
                position: "right",
            }).showToast()
        })


    })
}

//Función para mostrar los productos en el DOM
document.addEventListener("DOMContentLoaded", ()=>{
    mostrarProductos()
})


//Función para mostrar el carrito en el Offcanvas
const mostrarCarrito = () => {

    const carritoContenedor = document.getElementById("carritoContenedor");
    carritoContenedor.innerHTML =""

    carrito.forEach((producto, id) =>{
        const divMostrarCarrito = document.createElement("div");
        divMostrarCarrito.className =  ("descripcionCardCarrito");
        divMostrarCarrito.innerHTML = `
        <div id="totalCarrito"></div>   
        <div id="cantidadTotal"></div>   
        <div id="descuentos"></div>
        <div class="detalleCarritoContainer">
            <div class="text-dark cardCarritoContainer">
                <img class="imgCardCarrito" src="${producto.img}" alt="Card image cap">
                <p>${producto.nombreProducto}</p>
                <div class= "descripcionCardCarrito">
                    <p>$${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                </div>
                    <button id="btnEliminar${producto.id}" class="btn btn-danger" onclick="eliminarProductoDelCarrito(${id})">Eliminar</button>
                </div>  
        </div>
        `
        carritoContenedor.appendChild(divMostrarCarrito);

        const botonEliminar = document.getElementById(`btnEliminar${producto.id}`)

        botonEliminar.addEventListener("click", ()=>{
            Toastify({
                text: "Producto Eliminado del Carrito",
                duration: 1000,
                gravity: "top",
                position: "right",
            }).showToast()
        }) 

        totalCarrito();
        cantidadTotalCarrito ()
        eliminarCarritoCompleto()
        
    })
    
}

//Función para agregar productos al carrito
const agregarAlCarrito = (prodId) => {

    const producto = stockProductos.find((prod) => prod.id === prodId);

    const productoAgregado = carrito.find((prod) => prod.id === prodId);


    if (productoAgregado){

        productoAgregado.cantidad++
        
    }else{
        producto.cantidad =1;
        carrito.push(producto)
    }


    mostrarCarrito()
    guardarCarritoStorage(carrito)
    obtenerCarritoStorage()
}


//Función para eliminar productos del carrito
const eliminarProductoDelCarrito = (prodId) => {

    carrito[prodId].cantidad--;

    carrito[prodId].cantidad === 0 && carrito.splice(prodId,1);

    mostrarCarrito();

}

//Función para calcular el total del carrito
const totalCarrito = () =>{

    const totalCarrito = carrito.reduce((acc, {precio,cantidad})=> acc + precio*cantidad, 0);

    const mostrarTotalCarrito = document.getElementById("totalCarrito");

    mostrarTotalCarrito.innerHTML = `<p class="totalPedido">El total de tu carrito es ${totalCarrito}</p>`;

}

//Función para calcular la cantidad total de productos del carrito
const cantidadTotalCarrito = () =>{

    const cantidadTotal = carrito.reduce((acc, {cantidad})=> acc + cantidad, 0);

    const mostrarcantidadTotal = document.getElementById('cantidadTotal');

    mostrarcantidadTotal.innerHTML = `<p class="totalPedido">Tenés ${cantidadTotal} productos en tu carrito</p>`;
    
}

//Función para eliminar el carrito completo. Además si se elimina el carrito completo borra el storage para que cuando se recargue el carrito esté vacío.
const eliminarCarritoCompleto = () =>{

const vaciarCarrito = document.getElementById('vaciarCarrito');

vaciarCarrito.addEventListener('click', () => {

    carrito.length = 0;

    if (vaciarCarrito){
        localStorage.clear()
    }
    mostrarCarrito()
})}

//Guardar Carrito en Storage
const guardarCarritoStorage = (carrito) => {
    localStorage.setItem("guardarCarritoStorage", JSON.stringify(carrito))
}

//Obtener Carrito del Storage y mostrarlo en el DOM
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("guardarCarritoStorage")) {
    
    carrito= JSON.parse(localStorage.getItem("guardarCarritoStorage"));
    mostrarCarrito()
    }
})


