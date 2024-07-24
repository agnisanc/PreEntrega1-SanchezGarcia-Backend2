const socket = io();

function $(selector) {
    return document.quetySelector(selector)
};

socket.on( 'statusError', data => {
    console.log(data);
    alert(data);
});

socket.on('loadProducts', data => {
    $('.products-container').innerHTML = '';

    let html = '';
    data.forEach(product => {
        html += `<div class="product">
                    <h3>${product.title}</h3>
                    <hr>
                    <p>Categoria: ${product.category}</p>
                    <p>Descripción: ${product.description}</p>
                    <p>Precio: $ ${product.price}</p>
                    <button id="button-delete" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </div>`
    });

    $('.products-container').innerHTML = html;
})