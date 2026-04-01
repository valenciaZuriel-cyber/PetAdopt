require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./src/routes/user');
const petRoutes = require('./src/routes/petRoutes');
const adoptionRoutes = require('./src/routes/adoptionRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos
connectDB();

// --- CONFIGURACIÓN DE SWAGGER ---
const swaggerDocument = {
  openapi: '3.0.0',
  info: { 
    title: 'PetAdopt API', 
    version: '1.0.0',
    description: 'API para adopción y gestión de mascotas (Sistema de validación inteligente)'
  },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un nuevo adoptante',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Zuriel' },
                  lastName: { type: 'string', example: 'Valencia' },
                  age: { type: 'number', example: 22 },
                  income: { type: 'number', example: 15000 },
                  email: { type: 'string', example: 'zuriel@utr.edu.mx' },
                  password: { type: 'string', example: 'password123' },
                  haveyard: { type: 'boolean', example: true },
                  isAdmin: { type: 'boolean', example: false }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Usuario registrado' } }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'zuriel@utr.edu.mx' },
                  password: { type: 'string', example: 'password123' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Login exitoso, retorna token' } }
      }
    },
    '/pets/admin/register': {
      post: {
        tags: ['Mascotas'],
        summary: 'Registrar nueva mascota (Solo Admins)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Rex' },
                  dogbreed: { type: 'string', example: 'Golden Retriever' },
                  age: { type: 'string', example: '2 años' },
                  description: { type: 'string', example: 'Amigable y activo' },
                  healtStatus: { type: 'string', example: 'Vacunado' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Mascota registrada' } }
      }
    },
    '/pets/available': {
      get: {
        tags: ['Mascotas'],
        summary: 'Catálogo de mascotas disponibles',
        responses: { 200: { description: 'Lista de mascotas' } }
      }
    },
    '/adoptions/request': {
      post: {
        tags: ['Adopciones'],
        summary: 'Enviar solicitud de adopción (Filtro Inteligente)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                   petName: { type: String, required: true },
                   motive: { type: String, required: true }, 
                   income: { type: Number, required: true },
                   haveyard: { type: Boolean, required: true },
                   status: { type: String, enum: ['pendiente', 'aprobado', 'rechazado'], default: 'pendiente' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Resultado de la evaluación inteligente' } }
      }
    },
    '/adoptions/validate/{id}': {
      put: {
        tags: ['Adopciones'],
        summary: 'Validar/Actualizar requisitos del usuario',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID de la solicitud', schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  motive: { type: 'string', example: 'Actualizo mi motivo, ya tengo más espacio.' },
                  ingresos: { type: 'number', example: 18000 },
                  tienePatio: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Requisitos actualizados' } }
      }
    },
    '/adoptions/admin/cancel/{id}': {
      delete: {
        tags: ['Adopciones - Admin'],
        summary: 'Cancelar proceso de adopción (Solo Admins)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID de la solicitud a eliminar', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Proceso cancelado' } }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ASIGNACIÓN DE RUTAS ---
app.use('/auth', authRoutes);
app.use('/pets', petRoutes); 
app.use('/adoptions', adoptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación Swagger: http://localhost:${PORT}/api-docs`);
});