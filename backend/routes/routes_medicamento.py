from flask import Blueprint
from controllers.medicamento_controller import listar_medicamentos

medicamentos_bp = Blueprint("medicamentos_bp", __name__)


@medicamentos_bp.route("/", methods=["GET"])
def obtener_medicamentos():
    return listar_medicamentos()