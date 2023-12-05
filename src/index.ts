import  express  from 'express'

const app = express()

app.use('/', (req, res) => {
  console.log('Root route hit')

  res.send('Hello world!')
})

app.listen(3030, () => {
  console.log('Server listening on port 3030')
})