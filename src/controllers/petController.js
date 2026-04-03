const Pet = require('../models/pet');

exports.registerPet = async (req, res) => {
    try {
        const { name, dogbreed, age, description, gender, size, color, imageUrl, healtStatus } = req.body;

        const nuevaMascota = new Pet({ name, dogbreed, age, description, gender, size, color, imageUrl, healtStatus });

        await nuevaMascota.save();
        res.status(201).json({ msg: 'Mascota registrada exitosamente', pet: nuevaMascota });
    } catch (error) {
        res.status(500).json({ msg: 'Error al registrar mascota', error: error.message });
    }
};

exports.getAvailablePets = async (req, res) => {
    try {
        const mascotas = await Pet.find();
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener catálogo', error: error.message });
    }
};

exports.getPetById = async (req, res) => {
 try {
 const pet = await Pet.findById(req.params.id);
 res.json(pet);
 } catch (error) {
 res.status(404).json({ msg: 'Mascota no encontrada' });
 }
}