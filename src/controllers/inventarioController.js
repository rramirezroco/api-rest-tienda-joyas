import { getInventarioFilterModel, getinventarioHATEOASModel, getJoyaInventarioModel, getPaginatedInventarioModel } from "../models/inventarioModel.js"

export const getJoyaInventario = async (req, res) => {
    try {
        const { id } = req.params
        const joya = await getJoyaInventarioModel({ id })
        return res.status(201).json(joya)
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' })
    }
}

export const inventarioFilter = async (req, res) => {
    try {
        const filters = req.query
        const inventario = await getInventarioFilterModel(filters)
        res.status(200).json(inventario)
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' })
        console.error('Error =>', error)
    }
}

// Paginación
export const getPaginatedInventario = async (req, res) => {
    try {
        const { order_by, limits, page } = req.query

        const isPage = /^[1-9]\d*$/.test(page)
        if (!isPage) {
            return res.status(400).json({ message: 'Invalid page number' })
        }

        // const travels = await getPaginatedInventarioModel({ order_by, limits, page })
        const travels = await getinventarioHATEOASModel({ order_by, limits, page })
        res.status(200).json({ travels })
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' })
        console.error('Error =>', error)
    }
}