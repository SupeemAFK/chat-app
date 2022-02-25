const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
const moment = require('moment');

let rooms = []

function run() {
    io.on('connection', (socket) => {
        socket.on('join', ({ username, room }) => {
            const roomObj = rooms.find(roomObj => roomObj.name === room)
            if (roomObj) { //already has that room
                socket.join(room) //join user to that room
                const user = { socketId: socket.id, username }
                roomObj.users.push(user) //upadte users in that room
                io.in(room).emit("user_joined", { users: roomObj.users, newUser: user, time: moment().format('h:mm a') })
                return 
            }
            const user = { socketId: socket.id, username }
            const newRoomObj = { name: room, users: [user] } //create room and push user in 
            rooms.push(newRoomObj) //add new room to array
            socket.join(room)
            io.in(room).emit("user_joined", { users: newRoomObj.users, newUser: user, time: moment().format('h:mm a') })
        })
        socket.on('leave', ({ room }) => {
            const roomObj = rooms.find(roomObj => roomObj.name === room)
            const left_user = roomObj.users.find(user => user.socketId === socket.id)
            const newUsers = roomObj.users.filter(user => user.socketId !== socket.id)
            rooms = rooms.map(roomObj => roomObj.name === room ? {...roomObj, users: newUsers} : roomObj)

            socket.leave(room)
            socket.to(room).emit("user_left", { users: newUsers, left_user, time: moment().format('h:mm a') })
        })
        socket.on('send-message', ({ messageObj, room }) => {
            socket.to(room).emit("receive-message", messageObj)
        })
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
    });
}

run()