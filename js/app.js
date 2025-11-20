/**
 * Main application file
 * Handles initialization and event listeners
 */

// Handle form submission
document.getElementById('turnoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Read dates and create Date objects in local time
  const inicioValue = document.getElementById('inicio').value;
  const fechaInicio = new Date(inicioValue + 'T00:00:00');
  const turnoInicio = document.getElementById('turnoInicio').value;
  const objetivoValue = document.getElementById('fecha').value;
  const fechaObjetivo = new Date(objetivoValue + 'T00:00:00');

  if (isNaN(fechaInicio) || isNaN(fechaObjetivo)) {
    document.getElementById('resultado').textContent = 'Por favor, introduce fechas válidas.';
    return;
  }

  try {
    const turno = calcularTurno(fechaInicio, turnoInicio, fechaObjetivo);
    document.getElementById('resultado').textContent = `El turno para el día ${fechaObjetivo.toLocaleDateString()} es: ${turno}`;
  } catch (error) {
    document.getElementById('resultado').textContent = error.message;
  }
});

// Export shifts to CSV
document.getElementById('exportarCSV').addEventListener('click', function() {
  const inicioValue = document.getElementById('inicio').value;
  const fechaInicio = new Date(inicioValue + 'T00:00:00');
  const turnoInicio = document.getElementById('turnoInicio').value;

  if (isNaN(fechaInicio)) {
    alert('Por favor, introduce una fecha de inicio válida.');
    return;
  }

  exportarCSV(fechaInicio, turnoInicio);
});

// Export shifts to PDF
document.getElementById('exportarPDF').addEventListener('click', function() {
  const inicioValue = document.getElementById('inicio').value;
  const fechaInicio = new Date(inicioValue + 'T00:00:00');
  const turnoInicio = document.getElementById('turnoInicio').value;

  if (isNaN(fechaInicio)) {
    alert('Por favor, introduce una fecha de inicio válida.');
    return;
  }

  exportarPDF(fechaInicio, turnoInicio);
});

// Export shifts to ICS
document.getElementById('exportarICS').addEventListener('click', function() {
  const inicioValue = document.getElementById('inicio').value;
  const fechaInicio = new Date(inicioValue + 'T00:00:00');
  const turnoInicio = document.getElementById('turnoInicio').value;

  if (isNaN(fechaInicio)) {
    alert('Por favor, introduce una fecha de inicio válida.');
    return;
  }

  exportarICS(fechaInicio, turnoInicio);
});

// Display version in footer
document.addEventListener('DOMContentLoaded', function() {
  const versionElement = document.getElementById('app-version');
  if (versionElement) {
    versionElement.textContent = `v${APP_VERSION}`;
  }
});

// NOTE: Service Worker registration now lives in update-manager.js
// to detect new versions and notify the user
