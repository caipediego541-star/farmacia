from flask import jsonify
from models.categoria import Categoria


def listar_categorias():
    categorias = Categoria.query.order_by(Categoria.id).all()

    return jsonify([
        categoria.serialize()
        for categoria in categorias
    ]), 200