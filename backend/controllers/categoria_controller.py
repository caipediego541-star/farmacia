from flask import jsonify, request
from sqlalchemy.exc import IntegrityError

from models.db import db
from models.categoria import Categoria
from models.medicamento import Medicamento


CAMPOS = ["nombre", "descripcion"]


def _limpiar(datos):
    limpio = {}

    for campo in CAMPOS:
        valor = datos.get(campo)
        limpio[campo] = "" if valor is None else str(valor).strip()

    return limpio


def _validar(datos):
    errores = {}

    if not datos["nombre"]:
        errores["nombre"] = "El nombre es obligatorio"
    elif len(datos["nombre"]) > 100:
        errores["nombre"] = "El nombre no puede superar los 100 caracteres"

    if len(datos["descripcion"]) > 255:
        errores["descripcion"] = (
            "La descripción no puede superar los 255 caracteres"
        )

    return errores


def _duplicados(datos, categoria_id=None):
    consulta = Categoria.query.filter(
        Categoria.nombre == datos["nombre"]
    )

    if categoria_id is not None:
        consulta = consulta.filter(Categoria.id != categoria_id)

    if consulta.first():
        return {"nombre": "Ya existe una categoría con ese nombre"}

    return {}


def _leer_json():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return None

    return _limpiar(datos)


def _error(mensaje, codigo, errores=None):
    cuerpo = {"error": mensaje}

    if errores:
        cuerpo["errores"] = errores

    return jsonify(cuerpo), codigo


# READ: listar todas las categorías
def listar_categorias():
    categorias = Categoria.query.order_by(Categoria.id).all()

    return jsonify([
        _serializar_categoria(categoria)
        for categoria in categorias
    ]), 200


# READ: consultar una categoría por ID
def obtener_categoria(categoria_id):
    categoria = db.session.get(Categoria, categoria_id)

    if categoria is None:
        return _error("Categoría no encontrada", 404)

    return jsonify(
        _serializar_categoria(categoria, incluir_medicamentos=True)
    ), 200

# CREATE: crear una categoría
def crear_categoria():
    datos = _leer_json()

    if datos is None:
        return _error("El cuerpo de la petición debe ser un JSON válido", 400)

    errores = _validar(datos)

    if errores:
        return _error("Datos inválidos", 400, errores)

    errores = _duplicados(datos)

    if errores:
        return _error("Categoría duplicada", 409, errores)

    try:
        categoria = Categoria(**datos)

        db.session.add(categoria)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()
        return _error("Ya existe una categoría con ese nombre", 409)

    except Exception:
        db.session.rollback()
        return _error("Error al crear la categoría", 500)

    return jsonify({
        "mensaje": "Categoría creada correctamente",
        "categoria": categoria.serialize()
    }), 201

def _serializar_categoria(categoria, incluir_medicamentos=False):
    cantidad = Medicamento.query.filter_by(
        categoria_id=categoria.id
    ).count()

    resultado = categoria.serialize()
    resultado["cantidad_medicamentos"] = cantidad

    if incluir_medicamentos:
        medicamentos = Medicamento.query.filter_by(
            categoria_id=categoria.id
        ).order_by(Medicamento.id).all()

        resultado["medicamentos"] = [
            {
                "id": medicamento.id,
                "nombre": medicamento.nombre,
                "stock": medicamento.stock,
            }
            for medicamento in medicamentos
        ]

    return resultado

# UPDATE: actualizar una categoría
def actualizar_categoria(categoria_id):
    categoria = db.session.get(Categoria, categoria_id)

    if categoria is None:
        return _error("Categoría no encontrada", 404)

    datos = _leer_json()

    if datos is None:
        return _error("El cuerpo de la petición debe ser un JSON válido", 400)

    errores = _validar(datos)

    if errores:
        return _error("Datos inválidos", 400, errores)

    errores = _duplicados(datos, categoria_id)

    if errores:
        return _error("Categoría duplicada", 409, errores)

    try:
        for campo in CAMPOS:
            setattr(categoria, campo, datos[campo])

        db.session.commit()

    except IntegrityError:
        db.session.rollback()
        return _error("Ya existe una categoría con ese nombre", 409)

    except Exception:
        db.session.rollback()
        return _error("Error al actualizar la categoría", 500)

    return jsonify({
        "mensaje": "Categoría actualizada correctamente",
        "categoria": categoria.serialize()
    }), 200


# DELETE: eliminar una categoría
def eliminar_categoria(categoria_id):
    categoria = db.session.get(Categoria, categoria_id)

    if categoria is None:
        return _error("Categoría no encontrada", 404)

    # No permitir eliminar categorías utilizadas por medicamentos
    medicamento_asociado = Medicamento.query.filter_by(
        categoria_id=categoria_id
    ).first()

    if medicamento_asociado is not None:
        return _error(
            "No se puede eliminar la categoría porque tiene medicamentos asociados",
            409
        )

    try:
        db.session.delete(categoria)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()
        return _error(
            "No se puede eliminar la categoría porque está relacionada con otros registros",
            409
        )

    except Exception:
        db.session.rollback()
        return _error("Error al eliminar la categoría", 500)

    return jsonify({
        "mensaje": "Categoría eliminada correctamente"
    }), 200