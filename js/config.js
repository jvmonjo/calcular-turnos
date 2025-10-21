/**
 * Mòdul de configuració
 * Gestiona la interfície de configuració del patró de torns
 */

/**
 * Inicialitza la interfície de configuració
 */
function inicializarConfiguracion() {
  const config = obtenerConfiguracion();

  // Poblar els camps amb la configuració actual
  document.getElementById('duracionCiclo').value = config.duracionCiclo;
  document.getElementById('nombresTurnos').value = config.nombresTurnos.join(',');
  document.getElementById('patronTurnos').value = config.secuenciaTurnos.join(',');

  // Poblar el select de turnos
  actualizarSelectTurnos(config.nombresTurnos);

  // Event listeners
  document.getElementById('toggleConfig').addEventListener('click', toggleConfigPanel);
  document.getElementById('guardarConfig').addEventListener('click', guardarConfiguracionDesdeUI);
  document.getElementById('resetConfig').addEventListener('click', resetearConfiguracion);

  // Actualizar cuando cambie la duración del ciclo
  document.getElementById('duracionCiclo').addEventListener('input', function() {
    const duracion = parseInt(this.value);
    document.getElementById('patronTurnos').placeholder =
      `Introduce ${duracion} turnos separados por comas`;
  });
}

/**
 * Muestra/oculta el panel de configuración
 */
function toggleConfigPanel() {
  const panel = document.getElementById('configPanel');
  const button = document.getElementById('toggleConfig');

  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    button.textContent = 'Ocultar Configuración';
  } else {
    panel.style.display = 'none';
    button.textContent = 'Personalizar Patrón';
  }
}

/**
 * Actualiza el select de turnos según los nombres configurados
 */
function actualizarSelectTurnos(nombresTurnos) {
  const select = document.getElementById('turnoInicio');
  select.innerHTML = '';

  nombresTurnos.forEach(turno => {
    const option = document.createElement('option');
    option.value = turno;
    option.textContent = turno;
    select.appendChild(option);
  });
}

/**
 * Guarda la configuración desde la interfaz
 */
function guardarConfiguracionDesdeUI() {
  const duracionCiclo = parseInt(document.getElementById('duracionCiclo').value);
  const nombresTurnosStr = document.getElementById('nombresTurnos').value;
  const patronTurnosStr = document.getElementById('patronTurnos').value;

  // Parsear los nombres de turnos
  const nombresTurnos = nombresTurnosStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // Parsear el patrón
  const secuenciaTurnos = patronTurnosStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // Crear configuración
  const config = {
    duracionCiclo,
    nombresTurnos,
    secuenciaTurnos
  };

  // Validar
  const validacion = validarConfiguracion(config);
  const mensaje = document.getElementById('configMensaje');

  if (!validacion.valido) {
    mensaje.innerHTML = `<div style="color: red; margin-top: 10px;">❌ ${validacion.mensaje}</div>`;
    return;
  }

  // Guardar
  guardarConfiguracion(config);
  actualizarSelectTurnos(nombresTurnos);

  mensaje.innerHTML = '<div style="color: green; margin-top: 10px;">✅ Configuración guardada correctamente</div>';

  setTimeout(() => {
    mensaje.innerHTML = '';
  }, 3000);
}

/**
 * Resetea la configuración a los valores por defecto
 */
function resetearConfiguracion() {
  if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
    localStorage.removeItem('configuracionTurnos');

    const config = obtenerConfiguracion();
    document.getElementById('duracionCiclo').value = config.duracionCiclo;
    document.getElementById('nombresTurnos').value = config.nombresTurnos.join(',');
    document.getElementById('patronTurnos').value = config.secuenciaTurnos.join(',');

    actualizarSelectTurnos(config.nombresTurnos);

    const mensaje = document.getElementById('configMensaje');
    mensaje.innerHTML = '<div style="color: green; margin-top: 10px;">✅ Configuración restaurada por defecto</div>';

    setTimeout(() => {
      mensaje.innerHTML = '';
    }, 3000);
  }
}

// Inicializar cuando cargue el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarConfiguracion);
} else {
  inicializarConfiguracion();
}
