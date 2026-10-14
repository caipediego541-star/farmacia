from flask import jsonify
from models.empleado import Empleado


def listar_empleados():
    empleados = Empleado.query.order_by(Empleado.id).all()

    return jsonify([
        empleado.serialize()
        for empleado in empleados
    ]), 200