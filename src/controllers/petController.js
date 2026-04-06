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

exports.deletePet = async (req, res) => {
    try {
        const petId = req.params.id;
        const mascotaEliminada = await Pet.findByIdAndDelete(petId);
        if (!mascotaEliminada) {
            return res.status(404).json({ msg: 'Mascota no encontrada' });
        }
        res.status(200).json({ msg: 'Mascota eliminada exitosamente del sistema' });
    } catch (error) {
        console.log("Error al eliminar mascota:", error);        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Mascota no encontrada (formato de ID inválido)' });
        }
        res.status(500).json({ msg: 'Error interno del servidor al intentar eliminar la mascota' });
    }
};