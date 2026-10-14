from models.categoria import Categoria
from models.medicamento import Medicamento
from models.empleado import Empleado


def obtener_resumen():
    return {
        "total_categorias": Categoria.query.count(),
        "total_medicamentos": Medicamento.query.count(),
        "total_empleados": Empleado.query.count()
    }, 200