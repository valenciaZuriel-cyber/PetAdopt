require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const swaggerUi = require('swagger-ui-express');

// Importaciones de tus rutas
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
        tags: ['Usuarios'],
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
        tags: ['Usuarios'],
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
    '/auth/profile': {
      get: {
        tags: ['Usuarios'],
        summary: 'Obtener el perfil del usuario logueado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Perfil obtenido con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                    name: { type: 'string', example: 'Zuriel' },
                    lastName: { type: 'string', example: 'Valencia' },
                    age: { type: 'number', example: 22 },
                    email: { type: 'string', example: 'zuriel@utr.edu.mx' },
                    income: { type: 'number', example: 15000 },
                    haveyard: { type: 'boolean', example: true },
                    isAdmin: { type: 'boolean', example: false }
                  }
                }
              }
            }
          }
        }
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
                  gender: { type: 'string', example: 'Macho' },
                  size: { type: 'string', example: 'Grande' },
                  color: { type: 'string', example: 'Dorado' },
                  description: { type: 'string', example: 'Amigable y muy activo' },
                  imageUrl: { type: 'string', example: 'https://rutadeimagen.com/rex.jpg' },
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
        summary: 'Catálogo público de mascotas disponibles',
        responses: { 200: { description: 'Lista de mascotas' } }
      }
    },
    '/pets/{id}': {
      get: {
        tags: ['Mascotas'],
        summary: 'Ver el detalle de una mascota específica',
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID de la mascota', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Detalles de la mascota' } }
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
                 petName: { type: 'string', example: 'Rex' }, 
                  motive: { type: 'string', example: 'Quiero un compañero de vida, para todas mis aventuras' },
                  income: { type: 'number', example: 15000 },
                  haveyard: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Resultado de la evaluación inteligente' } }
      }
    },
    '/adoptions/my-requests': {
      get: {
        tags: ['Adopciones'],
        summary: 'Historial de solicitudes del usuario',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Lista de solicitudes' } }
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
    '/adoptions/admin/status/{id}': {
      patch: {
        tags: ['Adopciones - Admin'],
        summary: 'Actualizar estado de trámite (Solo Admins)',
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
                  status: { type: 'string', example: 'aprobado' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Estado actualizado correctamente' } }
      }
    },
    '/adoptions/admin/cancel/{id}': {
      delete: {
        tags: ['Adopciones - Admin'],
        summary: 'Cancelar proceso de adopción (Solo Admins)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'ID de la solicitud', schema: { type: 'string' } }
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