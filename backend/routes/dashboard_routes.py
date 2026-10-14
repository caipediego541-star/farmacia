from flask import Blueprint
from controllers.dashboard_controller import obtener_resumen

dashboard_bp = Blueprint("dashboard_bp", __name__)


@dashboard_bp.route("/", methods=["GET"])
def obtener_dashboard():
    return obtener_resumen()