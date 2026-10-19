# Sistema de Gestión para Farmacia

**Trabajo Práctico de Programación II**

## Integrantes

- Diego Daniel Caipe
- Tomas Caballero

## 1. Descripción del proyecto

El Sistema de Gestión para Farmacia es una aplicación web que permite administrar medicamentos, categorías y empleados desde una interfaz desarrollada con React y Material UI. El frontend se comunica con una API REST implementada en Flask, que realiza las operaciones sobre una base de datos MySQL.

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

- **Python:** lenguaje utilizado para desarrollar la lógica del servidor.
- **Flask:** framework utilizado para crear la API REST.
- **Flask-SQLAlchemy / SQLAlchemy:** herramientas para trabajar con modelos y consultas a la base de datos.
- **PyMySQL:** conector para la comunicación con MySQL.
- **Flask-CORS:** configuración de solicitudes entre el frontend y el backend.

### Frontend

- **React:** biblioteca para construir la interfaz de usuario.
- **JavaScript:** lenguaje utilizado en el frontend.
- **Material UI (MUI):** biblioteca de componentes visuales.
- **Fetch API:** utilizada para realizar solicitudes HTTP al backend.
- **Vite:** herramienta utilizada para el servidor de desarrollo.

### Base de datos y control de versiones

- **MySQL:** sistema gestor de base de datos relacional.
- **Git:** control de versiones.
- **GitHub:** alojamiento del repositorio y colaboración entre integrantes.
- **uv:** herramienta utilizada para administrar las dependencias del backend.
- **npm:** herramienta utilizada para instalar las dependencias del frontend.

## 4. Requisitos previos

Antes de ejecutar el proyecto, es necesario disponer de:

- Python 3.14 o una versión compatible con `backend/pyproject.toml`.
- `uv` instalado.
- Node.js y npm.
- MySQL o MariaDB.
- Git.
- Un navegador web moderno.

## 5. Estructura del proyecto


farmacia/
├── .gitignore
├── README.md
├── assets/
│   └── capturas/
│       ├── dashboard.png
│       ├── categorias.png
│       ├── medicamentos.png
│       └── empleados.png
├── backend/
│   ├── .gitignore
│   ├── .env          # Configuración local; no debesubirse a GitHub
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── app.py
│   ├── config.py
│   ├── run.py
│   ├── models/
│   │   ├── db.py
│   │   ├── categoria.py
│   │   ├── medicamento.py
│   │   └── empleado.py
│   ├── controllers/
│   │   ├── categoria_controller.py
│   │   ├── medicamento_controller.py
│   │   └── empleado_controller.py
│   └── routes/
│       ├── routes_categoria.py
│       ├── routes_medicamento.py
│       ├── routes_empleado.py
│       └── dashboard_routes.py
├── database/
│   └── farmacia_db.sql
└── frontend/
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── public/
    └── src/
        ├── components/
        │   ├── Encabezado.jsx
        │   └── TituloSeccion.jsx
        ├── pages/
        │   ├── DashboardPage.jsx
        │   ├── CategoriasPage.jsx
        │   ├── MedicamentosPage.jsx
        │   └── EmpleadosPage.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        └── theme.js


`backend/.env` es un archivo de configuración local y no debe publicarse si contiene credenciales. `frontend/node_modules/` y los entornos virtuales se generan localmente al instalar las dependencias y no necesitan incluirse en el repositorio.

## 6. Base de datos

El archivo `database/farmacia_db.sql` se utiliza para crear la estructura y cargar los datos iniciales del sistema. Antes de ejecutarlo, comprobar que se está utilizando la base de datos correcta y realizar una copia de seguridad si ya existen datos que se quieran conservar.

El sistema contiene las siguientes entidades:

**Tabla `categorias`**

- Campos principales: `id`, `nombre` y `descripcion`.
- Relación: una categoría puede tener varios medicamentos asociados.

**Tabla `medicamentos`**

- Campos principales: `id`, `nombre`, `descripcion`, `precio`, `stock`, `fecha_vencimiento` y `categoria_id`.
- Relación: `categoria_id` es una clave foránea que referencia a `categorias.id`.

**Tabla `empleados`**

- Campos principales: `id`, `nombre`, `apellido`, `dni`, `email` y `cargo`.
- Almacena los datos del personal de la farmacia.

La relación entre categorías y medicamentos es de uno a muchos: una categoría puede estar asociada con varios medicamentos, y cada medicamento pertenece a una categoría existente.

Los datos iniciales previstos por el trabajo práctico son cinco categorías, diez medicamentos y cinco empleados.

## 7. Configuración de MySQL

1. Iniciar el servicio MySQL o MariaDB.
2. Abrir `database/farmacia_db.sql` mediante MySQL Workbench u otra herramienta compatible.
3. Ejecutar el script en la base de datos de prueba o en la base destinada al proyecto.
4. Verificar que se hayan creado las tablas y cargado los datos iniciales.
5. Revisar la configuración de conexión del backend en `backend/config.py` y `backend/.env`, según corresponda.

El backend utiliza la variable `DATABASE_CONNECTION_URI`. El formato habitual de SQLAlchemy con PyMySQL es:

mysql+pymysql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BASE

Reemplazar los valores por los correspondientes al entorno local. El puerto depende de la configuración de MySQL o MariaDB.

**Seguridad:** no publicar contraseñas reales ni credenciales privadas en el repositorio. El archivo `.env` debe mantenerse local y excluido de Git.

## 8. Instalación y ejecución del backend

El backend está desarrollado en Python con Flask y utiliza `uv` para administrar las dependencias declaradas en `backend/pyproject.toml`.

### Requisitos

- Python compatible con `backend/pyproject.toml`.
- `uv` instalado.
- MySQL o MariaDB en funcionamiento.

### Instalación

Desde la carpeta principal del repositorio, ingresar a `backend` y sincronizar las dependencias:


cd backend
uv sync


`uv sync` instala las dependencias declaradas en `pyproject.toml` y utiliza `uv.lock` para fijar las versiones resueltas.

### Ejecución

Desde la carpeta `backend`, ejecutar:


uv run python run.py


Este comando inicia el servidor Flask utilizando el entorno administrado por `uv`. La API queda disponible localmente en `http://localhost:5000`.

La terminal del backend debe permanecer abierta mientras se utiliza la aplicación. Para detener el servidor, presionar `Ctrl + C`.

## 9. Instalación y ejecución del frontend

Abrir una segunda terminal desde la carpeta principal del proyecto y ejecutar:


cd frontend
npm install
npm run dev


- `npm install` instala las dependencias declaradas en `package.json`.
- `npm run dev` inicia el servidor de desarrollo de Vite.

Vite muestra la dirección local en la terminal; normalmente es `http://localhost:5173/`.

El frontend utiliza `frontend/services/api.js` para comunicarse con Flask. La dirección base de la API se define mediante `API_URL` en ese archivo.

Para utilizar la aplicación localmente, mantener encendidos MySQL, Flask y el servidor de desarrollo del frontend.

## 10. Arquitectura del backend y comunicación

El backend se organiza siguiendo el patrón MVC:

- **Models (`models/`):** representan las entidades y permiten trabajar con las tablas mediante SQLAlchemy.
- **Controllers (`controllers/`):** contienen la lógica de negocio, las validaciones y las operaciones sobre los registros.
- **Routes (`routes/`):** definen los endpoints HTTP y llaman a los controladores.

El recorrido de una operación es:


React (páginas y componentes)
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

Las siguientes rutas corresponden a las operaciones principales de la API. Los parámetros `<id>` representan el identificador del registro.

### Medicamentos

- `GET /api/medicamentos`: listar todos los medicamentos.
- `GET /api/medicamentos/<id>`: consultar un medicamento por su identificador.
- `POST /api/medicamentos`: registrar un medicamento.
- `PUT /api/medicamentos/<id>`: modificar un medicamento existente.
- `DELETE /api/medicamentos/<id>`: eliminar un medicamento.

### Categorías

- `GET /api/categorias`: listar categorías.
- `GET /api/categorias/<id>`: consultar una categoría y sus medicamentos asociados.
- `POST /api/categorias`: crear una categoría.
- `PUT /api/categorias/<id>`: modificar una categoría existente.
- `DELETE /api/categorias/<id>`: eliminar una categoría que no tenga medicamentos asociados.

### Empleados

- `GET /api/empleados`: listar empleados.
- `GET /api/empleados/<id>`: consultar un empleado por su identificador.
- `POST /api/empleados`: registrar un empleado.
- `PUT /api/empleados/<id>`: modificar un empleado existente.
- `DELETE /api/empleados/<id>`: eliminar un empleado.

### Dashboard

- `GET /api/dashboard/`: obtener las cantidades del resumen general de la farmacia.

## 12. Validaciones y manejo de errores

El sistema aplica validaciones en el frontend para ayudar al usuario y en el backend para validar los datos recibidos por la API.

- **Medicamentos:** nombre obligatorio; precio mayor que cero; stock entero no negativo; fecha de vencimiento válida; categoría existente y obligatoria.
- **Categorías:** nombre obligatorio y control de duplicados; una categoría con medicamentos asociados no se puede eliminar.
- **Empleados:** nombre, apellido y cargo obligatorios; DNI y email obligatorios; validación del formato del email y control de DNI y email duplicados.

La interfaz utiliza componentes de Material UI como `Alert`, `Snackbar` y `Dialog` para mostrar errores, notificaciones y confirmaciones.

## 13. Capturas de pantalla

Las capturas de la aplicación están almacenadas en `assets/capturas/`. GitHub las mostrará cuando los archivos estén incluidos en el repositorio con estos nombres.

### Dashboard

![Dashboard de la farmacia](assets/capturas/dashboard.png)

### Gestión de categorías

![Gestión de categorías](assets/capturas/categorias.png)

### Gestión de medicamentos

![Gestión de medicamentos](assets/capturas/medicamentos.png)

### Gestión de empleados

![Gestión de empleados](assets/capturas/empleados.png)

## 14. Control de versiones y trabajo colaborativo

El proyecto se administra mediante Git y GitHub. Se utilizaron ramas para separar el trabajo y una rama de integración:

- `main`: versión principal del repositorio y rama preparada para la entrega.
- `develop`: integración de las funcionalidades.
- `feature/empleados`: desarrollo de la gestión de empleados.
- `feature/categorias`: desarrollo de la gestión de categorías.
- `feature/medicamentos`: desarrollo de la gestión de medicamentos.

Los cambios se registran con commits descriptivos y se integran mediante merge. El historial del repositorio permite revisar los aportes realizados por cada integrante.

**Repositorio:** [https://github.com/caipediego541-star/farmacia](https://github.com/caipediego541-star/farmacia)

## 15. Integrantes y distribución del trabajo

- **Diego Daniel Caipe:** desarrollo de categorías y medicamentos, validaciones, integración con la API, implementación de las pantallas correspondientes y pruebas de esas funcionalidades.
- **Tomas Caballero:** desarrollo de la gestión de empleados y su integración con el resto de la aplicación.
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
