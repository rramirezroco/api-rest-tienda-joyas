import format from 'pg-format'
import pool from '../../db/config.js'
import 'dotenv/config'

// GET
export const getJoyaInventarioModel = async ({ id }) => {
    const sqlQuery = {
        text: 'Select * from inventario WHERE id = $1',
        values: [id]
    }
    const response = await pool.query(sqlQuery)
    return response.rows
}

// Aplicación de filtros
export const getInventarioFilterModel = async ({ precio_min, precio_max, categoria, metal }) => {
    const filtros = []
    if (precio_min) {
        filtros.push(`precio >= ${precio_min}`)
    }
    if (precio_max) {
        filtros.push(`precio <= ${precio_max}`)
    }
    if (categoria) {
        filtros.push(`categoria = '${categoria}'`)
    }
    if (metal) {
        filtros.push(`metal = '${metal}'`)
    }

    let consulta = 'SELECT * FROM inventario'
    if (filtros.length > 0) {
        consulta += ' WHERE ' + filtros.join(' AND ')
    }

    const result = await pool.query(consulta)
    return result.rows
}

// Paginado
export const getPaginatedInventarioModel = async ({ order_by = 'id_ASC', limits = 10, page = 1 }) => {
    const [attribute, direction] = order_by.split('_')
    const offset = (page - 1) * limits
    // Pagina 1 = ( 1 - 1) * 10 = registro inicial 0
    // Pagina 2 = ( 2 - 1) * 10 = registro inicial 10,
    // Pagina 2 = ( 3 - 1) * 10 = registro inicial 20,

    const formatQuery = format(
        'SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s',
        attribute,
        direction,
        limits,
        offset
    )
    const response = await pool.query(formatQuery)
    return response.rows
}



const BASE_URL = process.env.DOMAIN_URL_APP || `http://localhost:${process.env.PORT}`;

export const getinventarioHATEOASModel = async ({ order_by = 'id_ASC', limits = 10, page = 1 }) => {
    // Consulta para contar el número total de filas en la tabla 'inventario'
    const countQuery = "SELECT COUNT(*) FROM inventario";
    const { rows: countResult } = await pool.query(countQuery);
    const total_joyas = parseInt(countResult[0].count, 10);
    // Calcula el número total de páginas
    const total_pages = Math.ceil(total_joyas / limits);
    const query = "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s";
    const offset = (page - 1) * limits;
    const [attribute, direction] = order_by.split('_')
    const formattedQuery = format(query, attribute, direction, limits, offset);
    const { rows } = await pool.query(formattedQuery);
    // Devuelve un array con los resultados y un enlace a cada uno de ellos
    let stockTotal = 0;
    const results = rows.map((row) => {
        stockTotal += row.stock
        return {
            ...row,
            href: `${BASE_URL}/joyas/joya/${row.id}`,
        };
    });

    const nextPage = parseInt(page) + 1
    const previousPage = parseInt(page) - 1

    // Devuelve un objeto con los resultados, el número total de páginas y los enlaces a la página siguiente y anterior

    return {
        'total_joyas': rows.length,
        'stockTotal': stockTotal,
        total_pages,
        page,
        limits,
        next:
            total_pages <= page
                ? null
                : `${BASE_URL}/joyas?limits=${limits}&page=${nextPage}&order_by=${order_by}`,
        previous:
            page <= 1 ? null : `${BASE_URL}/joyas?limits=${limits}&page=${previousPage}&order_by=${order_by}`,
        results,
    };
};