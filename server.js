import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import inventarioRoutes from './routes/inventario.routes.js'
import { inventarioLog } from './middleware/inventario.middleware.js'

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())
app.use(inventarioLog)

app.use('/', inventarioRoutes)

app.listen(PORT, console.log(`🔥 Server On http://localhost:${PORT}`))
