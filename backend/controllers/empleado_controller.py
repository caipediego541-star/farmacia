import re

from flask import jsonify, request
from sqlalchemy.exc import IntegrityError

from models.db import db
from models.empleado import Empleado

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
CAMPOS = ["nombre", "apellido", "dni", "email", "cargo"]


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

    if not datos["apellido"]:
        errores["apellido"] = "El apellido es obligatorio"
    elif len(datos["apellido"]) > 100:
        errores["apellido"] = "El apellido no puede superar los 100 caracteres"

    if not datos["dni"]:
        errores["dni"] = "El DNI es obligatorio"
    elif not datos["dni"].isdigit() or not 7 <= len(datos["dni"]) <= 8:
        errores["dni"] = "El DNI debe tener 7 u 8 numeros"

    if not datos["email"]:
        errores["email"] = "El email es obligatorio"
    elif len(datos["email"]) > 150 or not EMAIL_REGEX.match(datos["email"]):
        errores["email"] = "El email no es valido"

    if not datos["cargo"]:
        errores["cargo"] = "El cargo es obligatorio"
    elif len(datos["cargo"]) > 100:
        errores["cargo"] = "El cargo no puede superar los 100 caracteres"

    return errores


def _duplicados(datos, empleado_id=None):
    errores = {}

    consulta_dni = Empleado.query.filter(Empleado.dni == datos["dni"])
    consulta_email = Empleado.query.filter(Empleado.email == datos["email"])

    if empleado_id is not None:
        consulta_dni = consulta_dni.filter(Empleado.id != empleado_id)
        consulta_email = consulta_email.filter(Empleado.id != empleado_id)

    if consulta_dni.first():
        errores["dni"] = "Ya existe un empleado con ese DNI"
    if consulta_email.first():
        errores["email"] = "Ya existe un empleado con ese email"

    return errores


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


def listar_empleados():
    empleados = Empleado.query.order_by(Empleado.id).all()

    return jsonify([
        empleado.serialize()
        for empleado in empleados
    ]), 200


def obtener_empleado(empleado_id):
    empleado = db.session.get(Empleado, empleado_id)

    if empleado is None:
        return _error("Empleado no encontrado", 404)

    return jsonify(empleado.serialize()), 200


def crear_empleado():
    datos = _leer_json()
    if datos is None:
        return _error("El cuerpo de la peticion debe ser un JSON valido", 400)

    errores = _validar(datos)
    if errores:
        return _error("Datos invalidos", 400, errores)

    errores = _duplicados(datos)
    if errores:
        return _error("Empleado duplicado", 409, errores)

    try:
        empleado = Empleado(**datos)
        db.session.add(empleado)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return _error("DNI o email ya registrados", 409)
    except Exception:
        db.session.rollback()
        return _error("Error al crear el empleado", 500)

    return jsonify({
        "mensaje": "Empleado creado correctamente",
        "empleado": empleado.serialize()
    }), 201


def actualizar_empleado(empleado_id):
    empleado = db.session.get(Empleado, empleado_id)
    if empleado is None:
        return _error("Empleado no encontrado", 404)

    datos = _leer_json()
    if datos is None:
        return _error("El cuerpo de la peticion debe ser un JSON valido", 400)

    errores = _validar(datos)
    if errores:
        return _error("Datos invalidos", 400, errores)

    errores = _duplicados(datos, empleado_id)
    if errores:
        return _error("Empleado duplicado", 409, errores)

    try:
        for campo in CAMPOS:
            setattr(empleado, campo, datos[campo])
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return _error("DNI o email ya registrados", 409)
    except Exception:
        db.session.rollback()
        return _error("Error al actualizar el empleado", 500)

    return jsonify({
        "mensaje": "Empleado actualizado correctamente",
        "empleado": empleado.serialize()
    }), 200


def eliminar_empleado(empleado_id):
    empleado = db.session.get(Empleado, empleado_id)
    if empleado is None:
        return _error("Empleado no encontrado", 404)

    try:
        db.session.delete(empleado)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return _error("Error al eliminar el empleado", 500)

    return jsonify({"mensaje": "Empleado eliminado correctamente"}), 200