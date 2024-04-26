import 'dotenv/config.js'
import jwt from 'jsonwebtoken'


/**
 * Middleware function to check if user is authenticated.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Promise that resolves when authentication check is complete.
 */
export const authCheck = async (req, res, next) => {
    try {
        const { token = false } = req.cookies
        if ( token ) {
            const payload = jwt.verify(token, process.env.SECRET)
            req.payload = payload
            next()
        } else {
            throw "Not Logged In"
        }
    } catch (error) {
        res.status(400).json({ "error": error })
    }
}