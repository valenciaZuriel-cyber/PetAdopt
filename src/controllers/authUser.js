const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, lastName, age, income, email, password, haveyard, isAdmin } = req.body;

        // Validar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya está registrado' });
        }

        // Crear nuevo usuario
        user = new User({ name, lastName, age, income, email, password, haveyard, isAdmin });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Revisar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Crear Payload del JWT
        const payload = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin
            }
        };

        // Firmar JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '2h' },
            (error, token) => {
                if (error) throw error;
                res.json({ msg: 'Login exitoso', token });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener perfil' });
    }
}