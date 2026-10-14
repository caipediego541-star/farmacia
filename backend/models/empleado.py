from models.db import db


class Empleado(db.Model):
    __tablename__ = "empleados"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    dni = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    cargo = db.Column(db.String(100), nullable=False)

    def __init__(self, nombre, apellido, dni, email, cargo):
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.email = email
        self.cargo = cargo

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "dni": self.dni,
            "email": self.email,
            "cargo": self.cargo
        }