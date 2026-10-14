from flask import jsonify
from models.medicamento import Medicamento


def listar_medicamentos():
    medicamentos = Medicamento.query.order_by(Medicamento.id).all()

    return jsonify([
        medicamento.serialize()
        for medicamento in medicamentos
    ]), 200