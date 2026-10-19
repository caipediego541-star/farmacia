from datetime import date
from decimal import Decimal, InvalidOperation

from flask import jsonify, request
from sqlalchemy.exc import IntegrityError

from models.db import db
from models.categoria import Categoria
from models.medicamento import Medicamento


def _error(mensaje, codigo, errores=None):
    cuerpo = {"error": mensaje}

    if errores:
        cuerpo["errores"] = errores

    return jsonify(cuerpo), codigo


def _leer_json():
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        return None

    return datos


def _preparar_datos(datos):
    errores = {}

    # Nombre
    nombre = str(datos.get("nombre") or "").strip()

    if not nombre:
        errores["nombre"] = "El nombre del medicamento es obligatorio"
    elif len(nombre) > 150:
        errores["nombre"] = (
            "El nombre no puede superar los 150 caracteres"
        )

    # Descripción
    descripcion_original = datos.get("descripcion")
    descripcion_texto = (
        str(descripcion_original).strip()
        if descripcion_original is not None
        else ""
    )

    descripcion = descripcion_texto or None

    if descripcion and len(descripcion) > 255:
        errores["descripcion"] = (
            "La descripción no puede superar los 255 caracteres"
        )

    # Precio
    precio = None
    precio_original = datos.get("precio")

    try:
        if precio_original is None or isinstance(precio_original, bool):
            raise InvalidOperation

        precio = Decimal(str(precio_original).strip())

        if not precio.is_finite():
            raise InvalidOperation

        if precio <= 0:
            errores["precio"] = "El precio debe ser mayor a cero"

    except (InvalidOperation, ValueError, TypeError):
        errores["precio"] = "Ingresá un precio válido mayor a cero"

    # Stock
    stock = None
    stock_original = datos.get("stock")

    try:
        if stock_original is None or isinstance(stock_original, bool):
            raise InvalidOperation

        stock_decimal = Decimal(str(stock_original).strip())

        if (
            not stock_decimal.is_finite()
            or stock_decimal != stock_decimal.to_integral_value()
        ):
            raise InvalidOperation

        stock = int(stock_decimal)

        if stock < 0:
            errores["stock"] = "El stock no puede ser negativo"

    except (InvalidOperation, ValueError, TypeError):
        errores["stock"] = (
            "El stock debe ser un número entero igual o mayor a cero"
        )

    # Fecha de vencimiento
    fecha_vencimiento = None
    fecha_original = datos.get("fecha_vencimiento")

    try:
        if not isinstance(fecha_original, str):
            raise ValueError

        fecha_texto = fecha_original.strip()
        fecha_vencimiento = date.fromisoformat(fecha_texto)

        if fecha_vencimiento.isoformat() != fecha_texto:
            raise ValueError

    except (ValueError, TypeError):
        errores["fecha_vencimiento"] = (
            "Ingresá una fecha de vencimiento válida"
        )

    # Categoría relacionada
    categoria_id = None
    categoria_original = datos.get("categoria_id")

    try:
        if categoria_original is None or isinstance(
            categoria_original, bool
        ):
            raise InvalidOperation

        categoria_decimal = Decimal(str(categoria_original).strip())

        if (
            not categoria_decimal.is_finite()
            or categoria_decimal != categoria_decimal.to_integral_value()
            or categoria_decimal <= 0
        ):
            raise InvalidOperation

        categoria_id = int(categoria_decimal)

    except (InvalidOperation, ValueError, TypeError):
        errores["categoria_id"] = "Seleccioná una categoría válida"

    if categoria_id is not None:
        categoria = db.session.get(Categoria, categoria_id)

        if categoria is None:
            errores["categoria_id"] = (
                "La categoría seleccionada no existe"
            )

    valores = {
        "nombre": nombre,
        "descripcion": descripcion,
        "precio": precio,
        "stock": stock,
        "fecha_vencimiento": fecha_vencimiento,
        "categoria_id": categoria_id,
    }

    return valores, errores


def _serializar_medicamento(medicamento):
    datos = medicamento.serialize()
    datos["categoria_nombre"] = (
        medicamento.categoria.nombre
        if medicamento.categoria
        else None
    )

    return datos


# READ: listar todos los medicamentos
def listar_medicamentos():
    medicamentos = Medicamento.query.order_by(
        Medicamento.id
    ).all()

    return jsonify([
        _serializar_medicamento(medicamento)
        for medicamento in medicamentos
    ]), 200


# READ: consultar un medicamento por ID
def obtener_medicamento(medicamento_id):
    medicamento = db.session.get(Medicamento, medicamento_id)

    if medicamento is None:
        return _error("Medicamento no encontrado", 404)

    return jsonify(
        _serializar_medicamento(medicamento)
    ), 200


# CREATE: registrar un medicamento
def crear_medicamento():
    datos = _leer_json()

    if datos is None:
        return _error(
            "El cuerpo de la petición debe ser un JSON válido",
            400
        )

    valores, errores = _preparar_datos(datos)

    if errores:
        return _error("Datos inválidos", 400, errores)

    try:
        medicamento = Medicamento(**valores)

        db.session.add(medicamento)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return _error(
            "No se pudo registrar el medicamento. "
            "Verificá los datos y la categoría seleccionada.",
            409
        )

    except Exception:
        db.session.rollback()
        return _error("Error al registrar el medicamento", 500)

    return jsonify({
        "mensaje": "Medicamento registrado correctamente",
        "medicamento": _serializar_medicamento(medicamento),
    }), 201


# UPDATE: actualizar un medicamento
def actualizar_medicamento(medicamento_id):
    medicamento = db.session.get(Medicamento, medicamento_id)

    if medicamento is None:
        return _error("Medicamento no encontrado", 404)

    datos = _leer_json()

    if datos is None:
        return _error(
            "El cuerpo de la petición debe ser un JSON válido",
            400
        )

    valores, errores = _preparar_datos(datos)

    if errores:
        return _error("Datos inválidos", 400, errores)

    try:
        for campo, valor in valores.items():
            setattr(medicamento, campo, valor)

        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return _error(
            "No se pudo actualizar el medicamento. "
            "Verificá los datos y la categoría seleccionada.",
            409
        )

    except Exception:
        db.session.rollback()
        return _error("Error al actualizar el medicamento", 500)

    return jsonify({
        "mensaje": "Medicamento actualizado correctamente",
        "medicamento": _serializar_medicamento(medicamento),
    }), 200


# DELETE: eliminar un medicamento
def eliminar_medicamento(medicamento_id):
    medicamento = db.session.get(Medicamento, medicamento_id)

    if medicamento is None:
        return _error("Medicamento no encontrado", 404)

    try:
        db.session.delete(medicamento)
        db.session.commit()

    except Exception:
        db.session.rollback()
        return _error("Error al eliminar el medicamento", 500)

    return jsonify({
        "mensaje": "Medicamento eliminado correctamente"
    }), 200