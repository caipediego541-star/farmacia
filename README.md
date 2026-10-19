# Sistema de Gestión para Farmacia

**Trabajo Práctico de Programación II**

## Integrantes

- Diego Daniel Caipe
- Tomas caballero

## 1. Descripción del proyecto

Sistema web para administrar información de una farmacia. Permite gestionar medicamentos, categorías y empleados desde una interfaz desarrollada con React y Material UI. El frontend se comunica con una API REST implementada en Flask, que realiza las operaciones sobre una base de datos MySQL.

El proyecto aplica una organización MVC en el backend y utiliza Git y GitHub para el control de versiones y el trabajo colaborativo.

## 2. Funcionalidades

### Dashboard

- Muestra un resumen con la cantidad de medicamentos, categorías y empleados.
- Obtiene la información desde el backend.

### Categorías

- Listar y consultar categorías.
- Crear, modificar y eliminar categorías.
- Mostrar la cantidad de medicamentos asociados.
- Consultar los medicamentos que pertenecen a una categoría.
- Validar que el nombre sea obligatorio y evitar nombres duplicados.
- Impedir la eliminación de una categoría mientras tenga medicamentos asociados.

### Medicamentos

- Listar y consultar medicamentos.
- Crear, modificar y eliminar medicamentos.
- Asociar cada medicamento con una categoría existente.
- Mostrar nombre, categoría, precio, stock, descripción y fecha de vencimiento.
- Validar los campos obligatorios, el precio mayor que cero, el stock no negativo, la fecha y la categoría seleccionada.

### Empleados

- Listar y consultar empleados.
- Crear, modificar y eliminar empleados.
- Validar nombre, apellido, DNI, email y cargo.
- Evitar DNI y emails duplicados.

La interfaz utiliza mensajes de confirmación y notificaciones para informar el resultado de las operaciones y los errores.

## 3. Tecnologías utilizadas

### Backend

- Python
- Flask
- Flask-SQLAlchemy / SQLAlchemy
- PyMySQL
- Flask-CORS
- API REST

### Frontend

- React
- JavaScript
- Material UI (MUI)
- Fetch API
- Vite

### Base de datos y control de versiones

- MySQL
- Git
- GitHub

## 4. Requisitos previos

Antes de ejecutar el proyecto, instalar o disponer de:

- Python y `uv`.
- Node.js y npm.
- MySQL o MariaDB.
- Git.
- Un navegador web moderno.

## 5. Estructura del proyecto

farmacia/
│
├── backend/
│   ├── .gitignore
│   ├── app.py
│   ├── config.py
│   ├── run.py
│   │
│   ├── models/
│   │   ├── db.py
│   │   ├── categoria.py
│   │   ├── medicamento.py
│   │   └── empleado.py
│   │
│   ├── controllers/
│   │   ├── categoria_controller.py
│   │   ├── medicamento_controller.py
│   │   └── empleado_controller.py
│   │
│   └── routes/
│       ├── routes_categoria.py
│       ├── routes_medicamento.py
│       ├── routes_empleado.py
│       └── dashboard_routes.py
│
├── database/
│   └── farmacia_db.sql
│
├── frontend/
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   │
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       │   ├── Encabezado.jsx
│       │   └── TituloSeccion.jsx
│       │
│       ├── pages/
│       │   ├── DashboardPage.jsx
│       │   ├── CategoriasPage.jsx
│       │   ├── MedicamentosPage.jsx
│       │   └── EmpleadosPage.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── assets/
│   └── capturas/
│       ├── dashboard.png
│       ├── categorias.png
│       ├── medicamentos.png
│       └── empleados.png
│
└── README.md


## 6. Base de datos

El archivo `database/farmacia_db.sql` contiene la estructura y los datos iniciales requeridos para probar el sistema. Antes de ejecutarlo, asegurarse de estar usando la base de datos correcta y realizar una copia de seguridad si ya existen datos que se quieran conservar.

El sistema incluye estas entidades:

Tabla categorias
Campos principales: id, nombre y descripcion.
Relación: una categoría puede tener varios medicamentos asociados.


Tabla medicamentos
Campos principales: id, nombre, descripcion, precio, stock, fecha_vencimiento y categoria_id.
Relación: el campo categoria_id es una clave foránea que referencia al campo id de la tabla categorias.


Tabla empleados
Campos principales: id, nombre, apellido, dni, email y cargo.

La relación entre categorías y medicamentos es de uno a muchos: una categoría puede estar asociada con varios medicamentos, y cada medicamento pertenece a una categoría existente.

El conjunto de datos inicial previsto por el trabajo práctico contiene **5 categorías, 10 medicamentos y 5 empleados**.

## 7. Configuración de MySQL

1. Iniciar el servicio MySQL o MariaDB.
2. Abrir y ejecutar `database/farmacia_db.sql` mediante MySQL Workbench u otra herramienta compatible.
3. Verificar que la base de datos y las tablas se hayan creado y que estén cargados los datos iniciales.
4. Revisar la configuración de conexión del backend en `backend/config.py`.

El backend utiliza la variable `DATABASE_CONNECTION_URI`. Debe configurarse con los datos de la instalación local. El formato habitual de SQLAlchemy con PyMySQL es:

mysql+pymysql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BASE


Reemplazar los valores por los del entorno local. El puerto depende de la configuración de MySQL o MariaDB.

**Seguridad:** no publicar contraseñas reales ni credenciales privadas en el repositorio.

## 8. Instalación y ejecución del backend

Desde una terminal, ingresar a la carpeta del proyecto y luego a `backend`:

cd backend
uv sync
uv run python run.py


- `uv sync` instala las dependencias declaradas por el proyecto.
- `uv run python run.py` inicia el servidor Flask.

El backend utiliza `http://localhost:5000`. MySQL debe estar encendido y la conexión definida en `backend/config.py` debe ser válida antes de arrancar Flask.

## 9. Instalación y ejecución del frontend

Abrir una segunda terminal y ejecutar:


cd frontend
npm install
npm run dev


- `npm install` instala las dependencias del frontend.
- `npm run dev` inicia el servidor de desarrollo de Vite.

Vite muestra la dirección local en la terminal; en el entorno de desarrollo del proyecto es `http://localhost:5173/`.

El frontend utiliza `frontend/services/api.js` para comunicarse con Flask. La dirección base de la API se configura mediante `API_URL` en ese archivo.

Para utilizar la aplicación localmente, mantener encendidos MySQL, Flask y el servidor de desarrollo del frontend.

## 10. Arquitectura del backend y comunicación

El backend se organiza siguiendo el patrón MVC:

- **Models (`models/`):** representan las entidades y permiten trabajar con las tablas mediante SQLAlchemy.
- **Controllers (`controllers/`):** contienen la lógica de negocio, las validaciones y las operaciones sobre los registros.
- **Routes (`routes/`):** definen los endpoints HTTP y llaman a los controladores.

El recorrido de una operación es:


React (página y componentes)
        ↓
frontend/services/api.js
        ↓ HTTP / JSON
Flask Routes
        ↓
Controllers
        ↓
Models / SQLAlchemy
        ↓
MySQL


La respuesta vuelve desde Flask al frontend, donde React actualiza la interfaz y muestra el resultado de la operación.

## 11. Endpoints de la API REST

Medicamentos
- GET /api/medicamentos: listar todos los medicamentos.
- GET /api/medicamentos/<id>: consultar un medicamento por su identificador.
- POST /api/medicamentos: registrar un nuevo medicamento.
- PUT /api/medicamentos/<id>: modificar un medicamento existente.
- DELETE /api/medicamentos/<id>: eliminar un medicamento.
Categorías
- GET /api/categorias: listar todas las categorías.
- GET /api/categorias/<id>: consultar una categoría y sus medicamentos asociados.
- POST /api/categorias: crear una nueva categoría.
- PUT /api/categorias/<id>: modificar una categoría existente.
- DELETE /api/categorias/<id>: eliminar una categoría que no tenga medicamentos asociados.
Empleados
- GET /api/empleados: listar todos los empleados.
- GET /api/empleados/<id>: consultar un empleado por su identificador.
- POST /api/empleados: registrar un nuevo empleado.
- PUT /api/empleados/<id>: modificar un empleado existente.
- DELETE /api/empleados/<id>: eliminar un empleado.
Dashboard
- GET /api/dashboard/: obtener las cantidades del resumen general de la farmacia.


## 12. Validaciones y manejo de errores

El sistema aplica validaciones en el frontend para asistir al usuario y en el backend para proteger los datos recibidos por la API.

- **Medicamentos:** nombre obligatorio; precio mayor que cero; stock entero no negativo; fecha de vencimiento válida; categoría existente y obligatoria.
- **Categorías:** nombre obligatorio, límite de longitud y control de duplicados; una categoría con medicamentos asociados no se puede eliminar.
- **Empleados:** nombre, apellido y cargo obligatorios; DNI de 7 u 8 dígitos; email válido; DNI y email únicos.

La interfaz usa componentes de Material UI como `Alert`, `Snackbar` y `Dialog` para mostrar errores, notificaciones y confirmaciones.

## 13. Capturas de pantalla

Las imágenes se guardan dentro de `assets/capturas/`. Agregar allí las capturas reales de la aplicación y mantener los nombres de archivo que aparecen en los enlaces siguientes.

### Dashboard

![Dashboard de la farmacia](assets/capturas/dashboard.png)

### Gestión de categorías

![Gestión de categorías](assets/capturas/categorias.png)

### Gestión de medicamentos

![Gestión de medicamentos](assets/capturas/medicamentos.png)

### Gestión de empleados

![Gestión de empleados](assets/capturas/empleados.png)



## 14. Control de versiones y trabajo colaborativo

El proyecto se administra mediante Git y GitHub. Se utilizan ramas para separar el trabajo y una rama de integración:

- `main`: versión principal del repositorio.
- `develop`: integración de las funcionalidades.
- `feature/empleados`: trabajo de gestión de empleados.
- `feature/categorias`: trabajo de gestión de categorías.
- `feature/medicamentos`: trabajo de gestión de medicamentos.

Los cambios se registran con commits descriptivos y se integran mediante merge o Pull Request. El historial del repositorio permite identificar los aportes de cada integrante.

**Repositorio:** https://github.com/caipediego541-star/farmacia

## 15. Integrantes y distribución del trabajo

- **Diego Daniel Caipe:** desarrollo de categorías y medicamentos, validaciones, integración con la API, implementación de las pantallas correspondientes y pruebas de esas funcionalidades.
- **Tomas caballero:** desarrollo de la gestión de empleados y su integración con el resto de la aplicación.
- **Trabajo compartido:** organización del repositorio, integración de las ramas, pruebas de la aplicación completa y preparación de la presentación.

## 16. Demostración final

Durante la presentación se demostrará:

1. Crear una categoría.
2. Crear un medicamento.
3. Modificar un medicamento.
4. Eliminar un medicamento.
5. Crear un empleado.
6. Modificar un empleado.
7. Eliminar un empleado.
8. Visualizar el Dashboard.
9. Mostrar los datos almacenados en MySQL.
10. Mostrar el repositorio de GitHub, las ramas y el historial de commits.

