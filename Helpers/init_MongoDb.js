const mongoose = require('mongoose')
const uri = "mongodb+srv://aniket:abc%40123@authcluster.y2j86kw.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(
  process.env.MONGOOSE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})