/**
 * Mòdul d'exportació ICS (iCalendar)
 * Gestiona l'exportació dels torns a format ICS per a Google Calendar
 */

/**
 * Formatea una fecha en formato ICS (YYYYMMDD)
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha en formato ICS
 */
function formatearFechaICS(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Formatea una fecha/hora en formato ICS
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha/hora en formato ICS
 */
function formatearFechaHoraICS(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const hours = String(fecha.getHours()).padStart(2, '0');
  const minutes = String(fecha.getMinutes()).padStart(2, '0');
  const seconds = String(fecha.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Exporta los turnos anuales a formato ICS (iCalendar)
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {string} turnoInicio - Turno correspondiente a la fecha de inicio
 */
function exportarICS(fechaInicio, turnoInicio) {
  const config = obtenerConfiguracion();
  const datos = generarTurnosAnuales(fechaInicio, turnoInicio, config);
  const { year, turnos } = datos;

  // Generar contenido ICS
  let icsContent = 'BEGIN:VCALENDAR\r\n';
  icsContent += 'VERSION:2.0\r\n';
  icsContent += 'PRODID:-//Calculadora de Torns//ES\r\n';
  icsContent += 'CALSCALE:GREGORIAN\r\n';
  icsContent += 'METHOD:PUBLISH\r\n';
  icsContent += 'X-WR-CALNAME:Torns de Treball ' + year + '\r\n';
  icsContent += 'X-WR-TIMEZONE:Europe/Madrid\r\n';
  icsContent += 'X-WR-CALDESC:Calendari de torns de treball per a l\'any ' + year + '\r\n';

  const ahora = new Date();
  const dtstamp = formatearFechaHoraICS(ahora);

  // Solo incluir eventos de turnos (excluir días libres si existe 'L')
  turnos.forEach((item, index) => {
    // Excluir solo si el turno es 'L' (libre)
    if (item.turno !== 'L') {
      const fechaInicioEvento = formatearFechaICS(item.fecha);

      // Calcular fecha de fin (día siguiente)
      const fechaFin = new Date(item.fecha);
      fechaFin.setDate(fechaFin.getDate() + 1);
      const fechaFinStr = formatearFechaICS(fechaFin);

      const nombreTurno = `Torn ${item.turno}`;
      const descripcion = `${nombreTurno} - Jornada de treball`;

      icsContent += 'BEGIN:VEVENT\r\n';
      icsContent += 'UID:' + year + '-' + fechaInicioEvento + '-' + item.turno + '-' + index + '@calculadora-torns\r\n';
      icsContent += 'DTSTAMP:' + dtstamp + '\r\n';
      icsContent += 'DTSTART;VALUE=DATE:' + fechaInicioEvento + '\r\n';
      icsContent += 'DTEND;VALUE=DATE:' + fechaFinStr + '\r\n';
      icsContent += 'SUMMARY:' + nombreTurno + '\r\n';
      icsContent += 'DESCRIPTION:' + descripcion + '\r\n';
      icsContent += 'STATUS:CONFIRMED\r\n';
      icsContent += 'TRANSP:TRANSPARENT\r\n';
      icsContent += 'END:VEVENT\r\n';
    }
  });

  icsContent += 'END:VCALENDAR\r\n';

  // Crear blob y descargar
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Torns_${year}.ics`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
