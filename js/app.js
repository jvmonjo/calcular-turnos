/**
 * Fitxer principal de l'aplicació
 * Gestiona la inicialització i els event listeners
 */

// Manejar el envío del formulario
document.getElementById('turnoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Leer las fechas y crear objetos Date en hora local
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

// Exportar turnos a CSV
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

// Exportar turnos a PDF
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

// Exportar turnos a ICS
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

// NOTA: El registre del Service Worker ara es gestiona a update-manager.js
// per poder detectar actualitzacions i notificar l'usuari
