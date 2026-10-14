from flask import Blueprint
from controllers.categoria_controller import listar_categorias

categorias_bp = Blueprint("categorias_bp", __name__)


@categorias_bp.route("/", methods=["GET"])
def obtener_categorias():
    return listar_categorias()