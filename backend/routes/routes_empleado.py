from flask import Blueprint
from controllers.empleado_controller import (
    listar_empleados,
    obtener_empleado,
    crear_empleado,
    actualizar_empleado,
    eliminar_empleado,
)

empleados_bp = Blueprint("empleados_bp", __name__)

@empleados_bp.route("", methods=["GET"], strict_slashes=False)
def obtener_empleados():
    return listar_empleados()


@empleados_bp.route("/<int:empleado_id>", methods=["GET"], strict_slashes=False)
def obtener_empleado_por_id(empleado_id):
    return obtener_empleado(empleado_id)


@empleados_bp.route("", methods=["POST"], strict_slashes=False)
def agregar_empleado():
    return crear_empleado()


@empleados_bp.route("/<int:empleado_id>", methods=["PUT"], strict_slashes=False)
def modificar_empleado(empleado_id):
    return actualizar_empleado(empleado_id)


@empleados_bp.route("/<int:empleado_id>", methods=["DELETE"], strict_slashes=False)
def borrar_empleado(empleado_id):
    return eliminar_empleado(empleado_id)