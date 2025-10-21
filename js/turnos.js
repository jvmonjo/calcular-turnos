/**
 * Mòdul de càlcul de torns
 * Conté la lògica principal per calcular els torns segons el patró configurable
 */

/**
 * Configuració per defecte del patró de torns
 */
const CONFIG_DEFAULT = {
  duracionCiclo: 28,
  nombresTurnos: ['A', 'V', 'L'],
  secuenciaTurnos: [
    // Semana 1: Larga A (empieza lunes)
    "A", "L", "V", "L", "A", "A", "A",
    // Semana 2: Corta V
    "L", "V", "L", "A", "L", "L", "L",
    // Semana 3: Larga V
    "V", "L", "A", "L", "V", "V", "V",
    // Semana 4: Corta A
    "L", "A", "L", "V", "L", "L", "L"
  ]
};

/**
 * Obtiene la configuración actual (desde localStorage o por defecto)
 */
function obtenerConfiguracion() {
  const configGuardada = localStorage.getItem('configuracionTurnos');
  if (configGuardada) {
    try {
      return JSON.parse(configGuardada);
    } catch (e) {
      console.error('Error al cargar configuración:', e);
      return CONFIG_DEFAULT;
    }
  }
  return CONFIG_DEFAULT;
}

/**
 * Guarda la configuración en localStorage
 */
function guardarConfiguracion(config) {
  localStorage.setItem('configuracionTurnos', JSON.stringify(config));
}

/**
 * Valida que la configuración sea correcta
 */
function validarConfiguracion(config) {
  if (!config.duracionCiclo || config.duracionCiclo < 1) {
    return { valido: false, mensaje: 'La duración del ciclo debe ser al menos 1 día' };
  }

  if (!config.nombresTurnos || config.nombresTurnos.length === 0) {
    return { valido: false, mensaje: 'Debe definir al menos un nombre de turno' };
  }

  if (!config.secuenciaTurnos || config.secuenciaTurnos.length !== config.duracionCiclo) {
    return { valido: false, mensaje: `El patrón debe tener exactamente ${config.duracionCiclo} días` };
  }

  // Verificar que todos los turnos del patrón estén en los nombres definidos
  for (let turno of config.secuenciaTurnos) {
    if (!config.nombresTurnos.includes(turno)) {
      return { valido: false, mensaje: `El turno "${turno}" no está definido en los nombres de turnos` };
    }
  }

  return { valido: true };
}

/**
 * Función para calcular el índice inicial basándose en la fecha de inicio y el turno
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {string} turnoInicio - Turno correspondiente a la fecha de inicio
 * @param {Object} config - Configuración del patrón (opcional, usa la guardada por defecto)
 * @returns {number} - Índice del turno inicial en el ciclo
 */
function calcularIndiceInicio(fechaInicio, turnoInicio, config = null) {
  if (!config) {
    config = obtenerConfiguracion();
  }

  // Obtener día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
  let diaSemana = fechaInicio.getDay();
  // Convertir a formato donde Lunes = 0, Martes = 1, ..., Domingo = 6
  diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;

  // Buscar todas las posiciones donde el día de la semana y el turno coinciden
  const posiblesIndices = [];
  for (let i = 0; i < config.secuenciaTurnos.length; i++) {
    const diaSemanaEnCiclo = i % 7;
    if (diaSemanaEnCiclo === diaSemana && config.secuenciaTurnos[i] === turnoInicio) {
      posiblesIndices.push(i);
    }
  }

  // Si solo hay una coincidencia, usarla
  if (posiblesIndices.length === 1) {
    return posiblesIndices[0];
  }

  // Si hay múltiples coincidencias, retornar la primera
  // (el usuario deberá asegurarse de que la fecha de inicio esté bien configurada)
  return posiblesIndices.length > 0 ? posiblesIndices[0] : -1;
}

/**
 * Función para calcular el turno que corresponde a una fecha específica
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {string} turnoInicio - Turno correspondiente a la fecha de inicio
 * @param {Date} fechaObjetivo - Fecha para calcular el turno
 * @param {Object} config - Configuración del patrón (opcional, usa la guardada por defecto)
 * @returns {string} - Turno correspondiente
 */
function calcularTurno(fechaInicio, turnoInicio, fechaObjetivo, config = null) {
  if (!config) {
    config = obtenerConfiguracion();
  }

  // Normalizar fechas a medianoche para evitar problemas con horas
  const inicio = new Date(fechaInicio);
  inicio.setHours(0, 0, 0, 0);

  const objetivo = new Date(fechaObjetivo);
  objetivo.setHours(0, 0, 0, 0);

  // Calcular diferencia en días usando UTC para evitar problemas con cambio de hora
  const inicioUTC = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const objetivoUTC = Date.UTC(objetivo.getFullYear(), objetivo.getMonth(), objetivo.getDate());
  const diferenciaDias = Math.floor((objetivoUTC - inicioUTC) / (1000 * 60 * 60 * 24));

  // Obtener índice inicial en el ciclo
  const indiceInicio = calcularIndiceInicio(inicio, turnoInicio, config);

  if (indiceInicio === -1) {
    throw new Error("No se pudo determinar el índice inicial. Verifica la fecha y el turno de inicio.");
  }

  // Calcular índice objetivo en el ciclo
  const totalTurnos = config.secuenciaTurnos.length;
  let indiceObjetivo = (indiceInicio + diferenciaDias) % totalTurnos;

  // Ajustar para índices negativos (fechas anteriores a la fecha de inicio)
  if (indiceObjetivo < 0) {
    indiceObjetivo = totalTurnos + indiceObjetivo;
  }

  return config.secuenciaTurnos[indiceObjetivo];
}

/**
 * Genera los datos de turnos para todo un año
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {string} turnoInicio - Turno correspondiente a la fecha de inicio
 * @param {Object} config - Configuración del patrón (opcional, usa la guardada por defecto)
 * @returns {Object} Objeto con el año y array de turnos
 */
function generarTurnosAnuales(fechaInicio, turnoInicio, config = null) {
  if (!config) {
    config = obtenerConfiguracion();
  }

  const year = fechaInicio.getFullYear();
  const turnos = [];

  // Crear una fecha temporal para iterar
  const fechaActual = new Date(year, 0, 1);

  while (fechaActual.getFullYear() === year) {
    try {
      // Crear una copia de la fecha actual para pasarla a calcularTurno
      const fechaCopia = new Date(fechaActual);
      const turno = calcularTurno(fechaInicio, turnoInicio, fechaCopia, config);

      turnos.push({
        fecha: new Date(fechaActual),
        fechaStr: fechaActual.toLocaleDateString('es-ES'),
        turno: turno
      });
    } catch (error) {
      turnos.push({
        fecha: new Date(fechaActual),
        fechaStr: fechaActual.toLocaleDateString('es-ES'),
        turno: "Error"
      });
    }

    // Avanzar al día siguiente
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  return { year, turnos };
}
