const { instrument } = require('@socket.io/admin-ui')
const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:5174', 'https://admin.socket.io'],
    credentials: true
  }
})

io.on('connection', socket => {
  console.log(socket.id)
  socket.on('send-message', message => {
    socket.broadcast.emit('receive-message', message)
    console.log(message)
  })

  
})

instrument(io, { auth: false})