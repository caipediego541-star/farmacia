from flask import Blueprint
from controllers.empleado_controller import listar_empleados

empleados_bp = Blueprint("empleados_bp", __name__)


@empleados_bp.route("/", methods=["GET"])
def obtener_empleados():
    return listar_empleados()