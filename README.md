# 🐾 PetAdopt API

## 📖 Descripción del Proyecto
**PetAdopt** es una API RESTful desarrollada bajo una arquitectura limpia (N-Capas) diseñada para digitalizar y optimizar el proceso de adopción en refugios de animales. 

**Lógica Inteligente Integrada:** Más allá de un simple registro (CRUD), el sistema incorpora un algoritmo de evaluación automática. Al recibir una solicitud de adopción, la API cruza los datos del usuario (ingresos y disponibilidad de patio) con las características de la mascota solicitada (raza, tamaño) para emitir pre-aprobaciones o rechazos automáticos, agilizando el trabajo de los administradores.

**Equipo de Desarrollo:**
- Zuriel Valencia
- Angel Gúzman
- Osvaldo de la Cruz
- Iván Chávez

## 🛠️ Tecnologías Utilizadas
- **Node.js & Express.js:** Entorno de ejecución y framework backend.
- **MongoDB Atlas & Mongoose:** Base de datos NoSQL en la nube y modelado de datos (ODM).
- **JSON Web Tokens (JWT):** Autenticación *Stateless* y protección de rutas.
- **Bcrypt.js:** Hashing seguro de contraseñas de usuarios.
- **Swagger UI (OpenAPI 3.0):** Interfaz gráfica interactiva para la documentación de la API.

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo local:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-de-tu-repositorio>
   cd petadopt

2. **Instalar dependencias:**
    npm install

3. **Configurar variables de entorno (Archivo .env):**
    PORT=3000
    MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/petAdopt?retryWrites=true&w=majority
    JWT_SECRET=tu_secreto_super_seguro

4. **Enciende el servidor:**
    node index.js