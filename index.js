import express from 'express'
import dotenv from 'dotenv/config'
import { dbConnection } from './Database/db.js'
import { userRoute } from './Routes/User.js'
import cors from 'cors'
import { ProductRoute } from './Routes/Products.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use(userRoute)
app.use(ProductRoute)
const PORT =process.env.PORT || 8089
dbConnection()
app.listen(PORT, ()=>console.log(`Listening on port :  ${PORT}`))

