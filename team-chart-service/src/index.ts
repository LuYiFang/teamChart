import express, { response } from "express"

const app = express()
const PORT = 3000

app.get('/', (request, response) => {
    response.send('Hello, ts!')
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})