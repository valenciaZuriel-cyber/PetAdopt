const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Leer el token del header
    const token = req.header('Authorization');

    // Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    try {
        // Formato esperado: "Bearer <token>"
        const tokenLimpio = token.replace('Bearer ', '');
        const cifrado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        
        req.user = cifrado.user; // Agregamos el payload del token al request
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido o expirado' });
    }
};