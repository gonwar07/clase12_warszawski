const http = require('http');
const socketIo = require('socket.io');
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
let { products, messages} = require('./utils/utils');
const { emit } = require('process');
const moment = require('moment');

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

// Middlewares
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Template engines{
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: path.resolve(__dirname, './views/layouts'),
    partialsDir: path.resolve(__dirname, './views/partials')
}));
app.set('views', './views');
app.set('view engine', 'hbs');

// Routes
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/productos', (req, res) => {
    products.push(req.body);
    res.render('index');
    res.redirect('/')
});
app.post('/', (req, res) => {
    messages.push(req.body);
    res.render('index');
    res.redirect('/')
});

// Listen
httpServer.listen(PORT, () => {
    console.log('Server is up and running on port: ', PORT);
});

// Sockets Events
io.on('connection', (socket) => {
    console.log('User connected!');
    io.emit('products', [...products]);
    
    //Eliminar productos
    socket.on('emptyProd', (data) => {
        products = data;
        io.emit('products', [...products]);
    })

    //Chat
    io.emit('messages', [...messages]);
});