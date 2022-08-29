const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  try {
    //when ceonnect
    console.log('a user connected.');

    //take userId and socketId from user
    socket.on('addUser', (userId) => {
      console.log('[Event addUser]: ', JSON.stringify(userId));
      addUser(userId, socket.id);
      io.emit('getUsers', users);
      console.log('users::::::::::: ', users);
    });

    //send and get message
    socket.on('sendMessage', ({ senderId, receiverId, text, fileUrl }) => {
      const user = getUser(receiverId);
      console.log('[Event sendMessage]: ', JSON.stringify({ senderId, receiverId, text, fileUrl }));
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
        fileUrl,
      });
    });

    //when disconnect
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
      removeUser(socket.id);
      io.emit('getUsers', users);
    });
  } catch (error) {
    console.log(error);
  }
});
