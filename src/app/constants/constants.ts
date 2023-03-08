/* message for proyect */
const MESSAGE = {
    NOT_FOUND: "Aún no se han creado registros.",
    NOT_FOUND_SEARCH: "No se han encontrado resultados para esta búsqueda.",
    NOT_FOUND_FILTER: 'No se encontrarón resultados con los párametros indicados.',
    ERROR_LOADING_DATA: "Error cargando información.",
    ADD_COMMENT: 'Añadir comentario',
    INTERVIEW: 'Entrevista',
    PRE_INTERVIEW: 'Pre-Entrevista',
    ANTECEDENT: 'Antecedente judicial',
    TEXT_SEARCH: "Buscar",
    TEXT_CREATE: "Crear",
    TEXT_UPDATE: "Actualizar",
    TEXT_EDIT: "Editar",
    TEXT_APPROVED: 'Aprobar',
    TEXT_REJECTED: 'Rechazar',
    TEXT_CANCEL: 'Cancelar',
    TEXT_CONFIG: 'Configurar',
    TEXT_SEND: 'Enviar',
    TEXT_ACCEPT: 'Aceptar'
}

/* database statuses for the project */
const STATUS = {
    UNREALIZED: 1,
    DONE: 2,
    PENDING: 3,
    APPROVED: 4,
    REJECTED: 5
}

/* colors for alerts */
const COLORS = {
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    INFO: 'info',
    BLACK: 'black'
}


const GRADES = {
    LOW: 'Bajo',
    VERYLOW: 'Muy bajo',
    MID: 'Promedio',
    HIGH: 'Alto',
    VERYHIGH: 'Muy alto'
}

export {
    MESSAGE,
    COLORS,
    STATUS,
    GRADES
}