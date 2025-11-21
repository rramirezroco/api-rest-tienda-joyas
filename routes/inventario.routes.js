import { Router } from 'express'
import { inventarioFilter, getPaginatedInventario, getJoyaInventario } from '../src/controllers/inventarioController.js'

const router = Router()

router.get('/joyas/filtros', inventarioFilter)
router.get('/joyas', getPaginatedInventario)
router.get('/joyas/joya/:id', getJoyaInventario)

export default router