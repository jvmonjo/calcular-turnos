/**
 * Fitxer principal de l'aplicació
 * Gestiona la inicialització i els event listeners
 */

// Manejar el envío del formulario
document.getElementById('turnoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const fechaInicio = new Date(document.getElementById('inicio').value);
  const turnoInicio = document.getElementById('turnoInicio').value;
  const fechaObjetivo = new Date(document.getElementById('fecha').value);

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

// Exportar turnos a CSV
document.getElementById('exportarCSV').addEventListener('click', function() {
  const fechaInicio = new Date(document.getElementById('inicio').value);
  const turnoInicio = document.getElementById('turnoInicio').value;

  if (isNaN(fechaInicio)) {
    alert('Por favor, introduce una fecha de inicio válida.');
    return;
  }

  exportarCSV(fechaInicio, turnoInicio);
});

// Exportar turnos a PDF
document.getElementById('exportarPDF').addEventListener('click', function() {
  const fechaInicio = new Date(document.getElementById('inicio').value);
  const turnoInicio = document.getElementById('turnoInicio').value;

  if (isNaN(fechaInicio)) {
    alert('Por favor, introduce una fecha de inicio válida.');
    return;
  }

  exportarPDF(fechaInicio, turnoInicio);
});

// Exportar turnos a ICS
document.getElementById('exportarICS').addEventListener('click', function() {
  const fechaInicio = new Date(document.getElementById('inicio').value);
  const turnoInicio = document.getElementById('turnoInicio').value;

  if (isNaN(fechaInicio)) {
    alert('Por favor, introduce una fecha de inicio válida.');
    return;
  }

  exportarICS(fechaInicio, turnoInicio);
});

// Registrar Service Worker per a PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registrat correctament:', registration.scope);
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}
