/**
 * CSV export module
 * Generates a CSV file with the yearly schedule
 */

/**
 * Exports the yearly shifts to CSV
 * @param {Date} fechaInicio
 * @param {string} turnoInicio
 */
function exportarCSV(fechaInicio, turnoInicio) {
  const datos = generarTurnosAnuales(fechaInicio, turnoInicio);
  const { year, turnos } = datos;

  // Build CSV content
  let csvContent = 'Fecha,Turno\n';
  turnos.forEach(item => {
    csvContent += `${item.fechaStr},${item.turno}\n`;
  });

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Turnos_${year}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
