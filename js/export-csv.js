/**
 * Mòdul d'exportació CSV
 * Gestiona l'exportació dels torns a format CSV
 */

/**
 * Exporta los turnos anuales a formato CSV
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {string} turnoInicio - Turno correspondiente a la fecha de inicio
 */
function exportarCSV(fechaInicio, turnoInicio) {
  const datos = generarTurnosAnuales(fechaInicio, turnoInicio);
  const { year, turnos } = datos;

  // Crear contenido CSV
  let csvContent = "Fecha,Turno\n";
  turnos.forEach(item => {
    csvContent += `${item.fechaStr},${item.turno}\n`;
  });

  // Crear blob y descargar
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
