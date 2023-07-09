import express from 'express';
import path from 'path';
import hbs from 'hbs';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import { createServer } from "http";
import Filter from 'bad-words';
import { generateLocationMessage, generateMessage } from './utils/messages.js';
import { getUserInRoom, removeUser, getUser, addUser } from './utils/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const publicPath = express.static(path.join(__dirname, '../public'));
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use(publicPath);
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
    res.render('index', {
        title: "Chat app"
    });
})

app.get('/chat', (req, res) => {
    res.render('chat', {
        data: 'user name'
    })
});

io.on("connection", (socket) => {
    socket.on('join', (options, cb) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return cb(error);
        }

        socket.join(user.room);
        
        socket.emit('message', generateMessage("Welcome to out app"));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`));
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room),
        })
        cb();
    })
    
    socket.on('messageSent', (message, cb) => {
        const user = getUser(socket.id);
        if (!user) {
            return cb({error: 'User not found'});
        }

        const filter = new Filter();
        
        if (filter.isProfane(message)) {
            return cb('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(message, user.username));
        cb();
    });
    
    socket.on('sendLocation', ({latitude, longitude}, cb) => {
        const user = getUser(socket.id);

        if (!user) {
            return cb({error: 'User not found'});
        }

        const filter = new Filter();
        
        if (filter.isProfane(JSON.stringify({latitude, longitude}))) {
            return cb({error: 'Profanity not allowed'});
        }

        io.to(user.room).emit('locationMessage', generateLocationMessage({
            url: `https://google.com/maps?q=${latitude},${longitude}`,
            username: user.username
        }));
        cb();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage(`User ${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server started at ${PORT} 🔥🔥🔥`)
})