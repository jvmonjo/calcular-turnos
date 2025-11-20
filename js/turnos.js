/**
 * Shift calculation module
 * Contains the core logic to compute shifts based on the configurable pattern
 */

/**
 * Default shift pattern configuration
 */
const CONFIG_DEFAULT = {
  duracionCiclo: 28,
  nombresTurnos: ['A', 'V', 'L'],
  secuenciaTurnos: [
    // Week 1: Long A (starts Monday)
    'A', 'L', 'V', 'L', 'A', 'A', 'A',
    // Week 2: Short V
    'L', 'V', 'L', 'A', 'L', 'L', 'L',
    // Week 3: Long V
    'V', 'L', 'A', 'L', 'V', 'V', 'V',
    // Week 4: Short A
    'L', 'A', 'L', 'V', 'L', 'L', 'L'
  ]
};

/**
 * Retrieves the active configuration (from localStorage or default)
 */
function obtenerConfiguracion() {
  const configGuardada = localStorage.getItem('configuracionTurnos');
  if (configGuardada) {
    try {
      return JSON.parse(configGuardada);
    } catch (e) {
      console.error('Error al cargar la configuración:', e);
      return CONFIG_DEFAULT;
    }
  }
  return CONFIG_DEFAULT;
}

/**
 * Persists the configuration in localStorage
 */
function guardarConfiguracion(config) {
  localStorage.setItem('configuracionTurnos', JSON.stringify(config));
}

/**
 * Validates the configuration
 */
function validarConfiguracion(config) {
  if (!config.duracionCiclo || config.duracionCiclo < 1) {
    return { valido: false, mensaje: 'La duración del ciclo debe ser al menos de 1 día.' };
  }

  if (!config.nombresTurnos || config.nombresTurnos.length === 0) {
    return { valido: false, mensaje: 'Debes definir al menos un nombre de turno.' };
  }

  if (!config.secuenciaTurnos || config.secuenciaTurnos.length !== config.duracionCiclo) {
    return { valido: false, mensaje: `El patrón debe tener exactamente ${config.duracionCiclo} días.` };
  }

  // Make sure every code used in the pattern exists in the declared names
  for (const turno of config.secuenciaTurnos) {
    if (!config.nombresTurnos.includes(turno)) {
      return { valido: false, mensaje: `El turno "${turno}" no está definido en la lista de nombres.` };
    }
  }

  return { valido: true };
}

/**
 * Calculates the starting index based on the provided date and shift
 * @param {Date} fechaInicio
 * @param {string} turnoInicio
 * @param {Object} config
 * @returns {number}
 */
function calcularIndiceInicio(fechaInicio, turnoInicio, config = null) {
  if (!config) {
    config = obtenerConfiguracion();
  }

  const duracionCiclo = config.secuenciaTurnos.length;

  // If the cycle is a multiple of 7 we can align it with weekdays
  if (duracionCiclo % 7 === 0) {
    // JS: 0 = Sunday, 1 = Monday ... 6 = Saturday
    let diaSemana = fechaInicio.getDay();
    // Convert so Monday = 0 ... Sunday = 6
    diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;

    // Collect every position where weekday and shift match
    const posiblesIndices = [];
    for (let i = 0; i < config.secuenciaTurnos.length; i++) {
      const diaSemanaEnCiclo = i % 7;
      if (diaSemanaEnCiclo === diaSemana && config.secuenciaTurnos[i] === turnoInicio) {
        posiblesIndices.push(i);
      }
    }

    if (posiblesIndices.length === 1) {
      return posiblesIndices[0];
    }

    return posiblesIndices.length > 0 ? posiblesIndices[0] : -1;
  } else {
    // For arbitrary cycles just find the first matching shift
    const indice = config.secuenciaTurnos.indexOf(turnoInicio);

    if (indice === -1) {
      throw new Error(`El turno "${turnoInicio}" no existe en el patrón configurado.`);
    }

    // NOTE: for cycles that are not multiples of 7 the start date must match
    // the first appearance of the chosen shift in the cycle
    return indice;
  }
}

/**
 * Calculates the shift assigned to a specific date
 * @param {Date} fechaInicio
 * @param {string} turnoInicio
 * @param {Date} fechaObjetivo
 * @param {Object} config
 * @returns {string}
 */
function calcularTurno(fechaInicio, turnoInicio, fechaObjetivo, config = null) {
  if (!config) {
    config = obtenerConfiguracion();
  }

  // Normalize dates to midnight to avoid DST issues
  const inicio = new Date(fechaInicio);
  inicio.setHours(0, 0, 0, 0);

  const objetivo = new Date(fechaObjetivo);
  objetivo.setHours(0, 0, 0, 0);

  // Calculate difference in days (using UTC to avoid DST issues)
  const inicioUTC = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const objetivoUTC = Date.UTC(objetivo.getFullYear(), objetivo.getMonth(), objetivo.getDate());
  const diferenciaDias = Math.floor((objetivoUTC - inicioUTC) / (1000 * 60 * 60 * 24));

  // Get the starting index
  const indiceInicio = calcularIndiceInicio(inicio, turnoInicio, config);

  if (indiceInicio === -1) {
    throw new Error('No se pudo determinar el índice inicial. Verifica la fecha y el turno de inicio.');
  }

  // Compute the index within the cycle
  const totalTurnos = config.secuenciaTurnos.length;
  let indiceObjetivo = (indiceInicio + diferenciaDias) % totalTurnos;

  // Adjust for negative indices (dates before the start date)
  if (indiceObjetivo < 0) {
    indiceObjetivo = totalTurnos + indiceObjetivo;
  }

  return config.secuenciaTurnos[indiceObjetivo];
}

/**
 * Generates the shift data for the whole year of the starting date
 * @param {Date} fechaInicio
 * @param {string} turnoInicio
 * @param {Object} config
 * @returns {{year: number, turnos: Array}}
 */
function generarTurnosAnuales(fechaInicio, turnoInicio, config = null) {
  if (!config) {
    config = obtenerConfiguracion();
  }

  const year = fechaInicio.getFullYear();
  const turnos = [];

  // Iterate day by day
  const fechaActual = new Date(year, 0, 1);

  while (fechaActual.getFullYear() === year) {
    try {
      const fechaCopia = new Date(fechaActual);
      const turno = calcularTurno(fechaInicio, turnoInicio, fechaCopia, config);

      turnos.push({
        fecha: new Date(fechaActual),
        fechaStr: fechaActual.toLocaleDateString('es-ES'),
        turno
      });
    } catch (error) {
      turnos.push({
        fecha: new Date(fechaActual),
        fechaStr: fechaActual.toLocaleDateString('es-ES'),
        turno: 'Error'
      });
    }

    // Move to the next day
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  return { year, turnos };
}
