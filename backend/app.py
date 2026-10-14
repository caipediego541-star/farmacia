from flask import Flask
from flask_cors import CORS
from config import DATABASE_CONNECTION_URI
from models.db import db
from routes.routes_categoria import categorias_bp
from routes.routes_medicamento import medicamentos_bp
from routes.routes_empleado import empleados_bp

from routes.dashboard_routes import dashboard_bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_CONNECTION_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # Importar los modelos para registrar las tablas
    from models.categoria import Categoria
    from models.medicamento import Medicamento
    from models.empleado import Empleado

    # Registrar la ruta de ejemplo
    app.register_blueprint(categorias_bp, url_prefix="/api/categorias")
    app.register_blueprint(medicamentos_bp, url_prefix="/api/medicamentos")
    app.register_blueprint(empleados_bp, url_prefix="/api/empleados")

    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    
    # Crear las tablas que todavía no existan
    with app.app_context():
        db.create_all()

    @app.route("/")
    def inicio():
        return {"mensaje": "API funcionando"}

    return app