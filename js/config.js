/**
 * Configuration module
 * Handles the UI for editing the shift pattern
 */
function inicializarConfiguracion() {
  const config = obtenerConfiguracion();

  // Populate fields with the current configuration
  document.getElementById('duracionCiclo').value = config.duracionCiclo;
  document.getElementById('nombresTurnos').value = config.nombresTurnos.join(',');
  document.getElementById('patronTurnos').value = config.secuenciaTurnos.join(',');

  // Populate the select element used in the main form
  actualizarSelectTurnos(config.nombresTurnos);

  // Event listeners
  document.getElementById('toggleConfig').addEventListener('click', toggleConfigPanel);
  document.getElementById('guardarConfig').addEventListener('click', guardarConfiguracionDesdeUI);
  document.getElementById('resetConfig').addEventListener('click', resetearConfiguracion);

  // Update placeholders when the cycle length changes
  document.getElementById('duracionCiclo').addEventListener('input', function() {
    const duracion = parseInt(this.value, 10);
    document.getElementById('patronTurnos').placeholder =
      `Introduce ${duracion} turnos separados por comas`;

    // Show a warning when the cycle is not a multiple of 7
    const mensaje = document.getElementById('configMensaje');
    if (duracion % 7 !== 0) {
      mensaje.innerHTML = '<div style="color: orange; margin-top: 10px;">⚠️ Nota: para ciclos que no son múltiplos de 7 días, la fecha de inicio debe corresponder a la primera aparición del turno en el patrón.</div>';
    } else {
      mensaje.innerHTML = '';
    }
  });
}

/**
 * Toggles the configuration panel visibility
 */
function toggleConfigPanel() {
  const panel = document.getElementById('configPanel');
  const button = document.getElementById('toggleConfig');

  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    button.textContent = 'Ocultar configuración';
  } else {
    panel.style.display = 'none';
    button.textContent = 'Personalizar patrón';
  }
}

/**
 * Refreshes the select element used to choose the starting shift
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
 * Saves the configuration based on the UI inputs
 */
function guardarConfiguracionDesdeUI() {
  const duracionCiclo = parseInt(document.getElementById('duracionCiclo').value, 10);
  const nombresTurnosStr = document.getElementById('nombresTurnos').value;
  const patronTurnosStr = document.getElementById('patronTurnos').value;

  // Parse the list of shift codes
  const nombresTurnos = nombresTurnosStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // Parse the configured pattern
  const secuenciaTurnos = patronTurnosStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

  // Build the configuration object
  const config = {
    duracionCiclo,
    nombresTurnos,
    secuenciaTurnos
  };

  // Validate
  const validacion = validarConfiguracion(config);
  const mensaje = document.getElementById('configMensaje');

  if (!validacion.valido) {
    mensaje.innerHTML = `<div style="color: red; margin-top: 10px;">⚠️ ${validacion.mensaje}</div>`;
    return;
  }

  // Persist
  guardarConfiguracion(config);
  actualizarSelectTurnos(nombresTurnos);

  mensaje.innerHTML = '<div style="color: green; margin-top: 10px;">✅ Configuración guardada correctamente.</div>';

  setTimeout(() => {
    mensaje.innerHTML = '';
  }, 3000);
}

/**
 * Restores the default configuration
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
    mensaje.innerHTML = '<div style="color: green; margin-top: 10px;">✅ Configuración restaurada por defecto.</div>';

    setTimeout(() => {
      mensaje.innerHTML = '';
    }, 3000);
  }
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarConfiguracion);
} else {
  inicializarConfiguracion();
}
