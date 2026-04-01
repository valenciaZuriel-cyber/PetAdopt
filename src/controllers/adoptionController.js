const AdoptionRequest = require('../models/AdoptionRequest');
const Validation = require('../models/validation'); 
const Pet = require('../models/pet');

exports.requestAdoption = async (req, res) => {
    try {
        const { petId, motive, ingresos, tienePatio } = req.body;
        const userId = req.user.id; // Viene del token JWT

        // 1. Buscar la mascota
        const pet = await Pet.findById(petId);
        if (!pet) return res.status(404).json({ msg: 'Mascota no encontrada' });

        // === 2. LÓGICA DE NEGOCIO (FILTRO INTELIGENTE) ===
        let estadoCalculado = 'pendiente';
        let observaciones = 'Evaluación manual requerida.';

        // Regla A: Si los ingresos son muy bajos, se rechaza automáticamente.
        if (ingresos < 4000) {
            estadoCalculado = 'rechazado';
            observaciones = 'Rechazo automático: Los ingresos no son suficientes para la manutención adecuada.';
        } 
        // Regla B: Mascotas grandes requieren patio obligatoriamente.
        else if (!tienePatio && (pet.dogbreed.includes('Golden') || pet.dogbreed.includes('Husky') || pet.dogbreed.includes('Pastor'))) {
            estadoCalculado = 'rechazado';
            observaciones = `Rechazo automático: La raza ${pet.dogbreed} requiere de un patio obligatoriamente.`;
        }
        // Regla C: Condiciones ideales (Ingresos altos y con patio).
        else if (ingresos >= 12000 && tienePatio) {
            estadoCalculado = 'aprobado';
            observaciones = 'Aprobación automática: El usuario cumple con el perfil ideal (Espacio e ingresos).';
        }

        // 3. Guardar el registro de validación
        const nuevaValidacion = new Validation({
            userId,
            income: ingresos,
            haveyard: tienePatio,
            observations: observaciones
        });
        await nuevaValidacion.save();

        // 4. Crear la solicitud de adopción
        const nuevaSolicitud = new AdoptionRequest({
            userId,
            petId,
            motive,
            status: estadoCalculado
        });
        await nuevaSolicitud.save();

        res.status(201).json({ 
            msg: 'Solicitud procesada', 
            status: estadoCalculado,
            observaciones,
            solicitud: nuevaSolicitud 
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al procesar adopción', error: error.message });
    }
};

exports.updateAdoptionStatus = async (req, res) => {
    try {
        const { id } = req.params; // ID de la solicitud en la URL
        const { status } = req.body; // 'aprobado' o 'rechazado'

        // Validar que el status sea correcto
        if (!['aprobado', 'rechazado'].includes(status.toLowerCase())) {
            return res.status(400).json({ msg: 'Estado inválido. Usa: aprobado o rechazado' });
        }

        // Buscar y actualizar la solicitud
        const solicitud = await AdoptionRequest.findById(id);
        if (!solicitud) {
            return res.status(404).json({ msg: 'Solicitud no encontrada' });
        }

        solicitud.status = status.toLowerCase();
        await solicitud.save();

        res.status(200).json({ 
            msg: `La solicitud ha sido actualizada a: ${status}`, 
            solicitud 
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el estado', error: error.message });
    }
};

// PUT: Validar / Actualizar requisitos del usuario
exports.validateAdoption = async (req, res) => {
    try {
        const { id } = req.params;
        const { motive, ingresos, tienePatio } = req.body;

        // Buscar la solicitud
        const solicitud = await AdoptionRequest.findById(id);
        if (!solicitud) {
            return res.status(404).json({ msg: 'Solicitud no encontrada' });
        }

        // Validar que el usuario que intenta actualizar sea el dueño de la solicitud
        if (solicitud.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado para modificar esta solicitud' });
        }

        // Actualizar el motivo en la solicitud
        if (motive) solicitud.motive = motive;
        await solicitud.save();

        // Buscar y actualizar la validación ligada a ese usuario
        const validacion = await Validation.findOne({ userId: req.user.id });
        if (validacion) {
            if (ingresos) validacion.income = ingresos;
            if (tienePatio !== undefined) validacion.haveyard = tienePatio;
            await validacion.save();
        }

        res.status(200).json({ 
            msg: 'Requisitos validados y actualizados exitosamente', 
            solicitud,
            validacion
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al validar requisitos', error: error.message });
    }
};

// DELETE: Cancelar / Eliminar proceso de adopción (Solo Admin)
exports.cancelAdoption = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar y eliminar
        const solicitud = await AdoptionRequest.findByIdAndDelete(id);
        if (!solicitud) {
            return res.status(404).json({ msg: 'Solicitud no encontrada' });
        }

        res.status(200).json({ msg: 'El proceso de adopción ha sido cancelado y eliminado del sistema' });

    } catch (error) {
        res.status(500).json({ msg: 'Error al cancelar la adopción', error: error.message });
    }
};