from models.db import db


class Medicamento(db.Model):
    __tablename__ = "medicamentos"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.String(255), nullable=True)
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(
        db.Integer,
        nullable=False,
        default=0,
        server_default="0"
    )
    fecha_vencimiento = db.Column(db.Date, nullable=False)
    categoria_id = db.Column(
        db.Integer,
        db.ForeignKey("categorias.id"),
        nullable=False
    )

    categoria = db.relationship("Categoria", backref="medicamentos")

    def __init__(
        self,
        nombre,
        precio,
        stock,
        fecha_vencimiento,
        categoria_id,
        descripcion=None
    ):
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.stock = stock
        self.fecha_vencimiento = fecha_vencimiento
        self.categoria_id = categoria_id

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": float(self.precio),
            "stock": self.stock,
            "fecha_vencimiento": (
                self.fecha_vencimiento.isoformat()
                if self.fecha_vencimiento else None
            ),
            "categoria_id": self.categoria_id
        }