from flask import Blueprint

from controllers.categoria_controller import (
    listar_categorias,
    obtener_categoria,
    crear_categoria,
    actualizar_categoria,
    eliminar_categoria,
)

categorias_bp = Blueprint("categorias_bp", __name__)


# GET: obtener todas las categorías
@categorias_bp.route("", methods=["GET"], strict_slashes=False)
def obtener_categorias():
    return listar_categorias()


# GET: obtener una categoría por su identificador real
@categorias_bp.route(
    "/<int:categoria_id>",
    methods=["GET"],
    strict_slashes=False
)
def obtener_categoria_por_id(categoria_id):
    return obtener_categoria(categoria_id)


# POST: registrar una categoría
@categorias_bp.route("", methods=["POST"], strict_slashes=False)
def agregar_categoria():
    return crear_categoria()


# PUT: actualizar una categoría existente
@categorias_bp.route(
    "/<int:categoria_id>",
    methods=["PUT"],
    strict_slashes=False
)
def modificar_categoria(categoria_id):
    return actualizar_categoria(categoria_id)


# DELETE: eliminar una categoría existente
@categorias_bp.route(
    "/<int:categoria_id>",
    methods=["DELETE"],
    strict_slashes=False
)
def borrar_categoria(categoria_id):
    return eliminar_categoria(categoria_id)