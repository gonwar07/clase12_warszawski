const socket = io();
const productsTable = document.getElementById('productsTable');
const container = document.getElementById('container');
const btnProductsView = document.getElementById('btnProductsView');

socket.on('products', (data) => {
    const emptyProd = `
                    <div class="bg-light p-5">
                        <h3 class="text-primary">Ingresa tus datos</h3>
                        <br>
                        <form action="/productos" method="post">
                            <div class="form-group">
                                <label for="name">Nombre</label>
                                <input type="text" name="name" id="name" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="price">Precio</label>
                                <input type="number" name="price" id="price" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="url">Foto URL</label>
                                <input type="url" name="url" id="url" class="form-control">
                            </div>
                            <input type="submit" value="Enviar" class="btn btn-success mt-4">
                            <a class="btn btn-success text-light text-decoration-none mt-4 ms-4" id="btnProductsView" href="/productos" role="button">Ver Productos</a>
                        </form>
                    </div>
                    <h3 class="text-primary pt-4">Historial</h3>
                    <h3 class="alert alert-danger">No se encontraron productos</h3>
                    <div class="bg-light p-5 mt-4" id="chatBox">
                        <form action="/" method="post">
                            <h3 class="text-primary">Centro de Mensajes</h3>
                            <div class="form-group mb-4">
                                <input class="form-control" style="max-width:30%" type="email" name="name" id="name" placeholder="Indica tu correo electrónico">
                            </div>
                            <div class="form-group" style="min-height:10vh;">
                                <input class="form-control" style="min-height:20vh; max-width:30%" type="textarea" name="text" id="text" placeholder="Indica tu mensaje">
                            </div>
                            <input type="submit" value="Enviar" class="btn btn-success mt-4">
                        </form>
                        <div id="messagesContainer"></div>
                    </div>



                    `

    if(data.length == 0){
        container.innerHTML = emptyProd;
    }
    else{
        const lista = data.map(prod => {
            return `
                    <tr>
                        <td class="align-middle">${prod.name}</td>
                        <td class="align-middle">${prod.price}</td>
                        <td><img src=${prod.url} style="max-width:10%;" alt="foto-producto"></td>
                    </tr>`
        });
    
        const html = `<h3 class="text-primary">Ingrese datos</h3>
                    <br>
                    <form class="bg-light p-5" action="/productos" method="post">
                        <div class="form-group">
                            <label for="name">Nombre</label>
                            <input type="text" name="name" id="name" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="price">Precio</label>
                            <input type="number" name="price" id="price" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="url">Foto URL</label>
                            <input type="url" name="url" id="url" class="form-control">
                        </div>
                        <input type="submit" value="Enviar" class="btn btn-success mt-4">
                        <a class="btn btn-success text-light text-decoration-none mt-4 ms-4" id="btnProductsView" href="/productos" role="button">Ver Productos</a>
                    </form>
                    <h3 class="text-primary pt-4">Historial</h3>
                    <div class="table-responsive" id="productsTable"></div>
                    <table class="table table-dark mb-5">
                        <tr class="text-warning">
                            <th class="font-weight-bold">Nombre</th>
                            <th class="font-weight-bold">Precio</th>
                            <th class="font-weight-bold">Foto</th>
                        </tr>
                        <tr id="prodList">${lista.join("")}</tr>
                        <button class="btn btn-success text-light text-decoration-none mt-4 mb-4" id="btnEmptyProd">Eliminar productos</button>
                    </table>
                    <div class="bg-light p-5 mt-4" id="chatBox">
                        <form action="/" method="post">
                            <h3 class="text-primary">Centro de Mensajes</h3>
                            <div class="form-group">
                                <input class="form-control" style="max-width:30%" type="email" name="name" id="name" placeholder="Indica tu correo electrónico">
                            </div>
                            <div class="form-group">
                                <input class="form-control" style="min-heigth:10vh;" type="textarea" name="text" id="text" placeholder="Indica tu mensaje">
                            </div>
                            <input type="submit" value="Enviar" class="btn btn-success mt-4">
                        </form>
                        <div id="messagesContainer"></div>
                    </div>
                     `
        container.innerHTML = html;

        // Manejo de botón eliminar productos
        const btnEmptyProd = document.getElementById('btnEmptyProd');
        btnEmptyProd.addEventListener('click', () => {
            data.splice(0, data.length);
            container.innerHTML = emptyProd;
            socket.emit('emptyProd', data);
        });
    }
});

socket.on('messages', (data) => {
    const messagesContainer = document.getElementById('messagesContainer');
    console.log(messagesContainer);
    const html = data.map(msg => {
        let chat = `<span style="color:blue;"><b>${msg.name}:</b><span style="color:green;"><span style="color:brown;"> ${msg.text}</span><br>`
        return chat
    }).join('\n');
    messagesContainer.innerHTML = html;
})