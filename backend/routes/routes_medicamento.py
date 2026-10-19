from flask import Blueprint

from controllers.medicamento_controller import (
    listar_medicamentos,
    obtener_medicamento,
    crear_medicamento,
    actualizar_medicamento,
    eliminar_medicamento,
)

medicamentos_bp = Blueprint("medicamentos_bp", __name__)


# GET: listar todos los medicamentos
@medicamentos_bp.route("", methods=["GET"], strict_slashes=False)
def obtener_medicamentos():
    return listar_medicamentos()


# GET: consultar un medicamento por ID
@medicamentos_bp.route(
    "/<int:medicamento_id>",
    methods=["GET"],
    strict_slashes=False,
)
def obtener_medicamento_por_id(medicamento_id):
    return obtener_medicamento(medicamento_id)


# POST: registrar un medicamento
@medicamentos_bp.route("", methods=["POST"], strict_slashes=False)
def agregar_medicamento():
    return crear_medicamento()


# PUT: actualizar un medicamento
@medicamentos_bp.route(
    "/<int:medicamento_id>",
    methods=["PUT"],
    strict_slashes=False,
)
def modificar_medicamento(medicamento_id):
    return actualizar_medicamento(medicamento_id)


# DELETE: eliminar un medicamento
@medicamentos_bp.route(
    "/<int:medicamento_id>",
    methods=["DELETE"],
    strict_slashes=False,
)
def borrar_medicamento(medicamento_id):
    return eliminar_medicamento(medicamento_id)