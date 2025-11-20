/**
 * ICS export module (iCalendar)
 * Generates an ICS file compatible with Google Calendar, Apple Calendar, etc.
 */

/**
 * Formats a date in ICS format (YYYYMMDD)
 */
function formatearFechaICS(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Formats a date/time string for ICS payloads
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
 * Exports the yearly shifts to ICS (iCalendar)
 */
function exportarICS(fechaInicio, turnoInicio) {
  const config = obtenerConfiguracion();
  const datos = generarTurnosAnuales(fechaInicio, turnoInicio, config);
  const { year, turnos } = datos;

  // Build ICS payload
  let icsContent = 'BEGIN:VCALENDAR\r\n';
  icsContent += 'VERSION:2.0\r\n';
  icsContent += 'PRODID:-//Calculadora de Turnos//ES\r\n';
  icsContent += 'CALSCALE:GREGORIAN\r\n';
  icsContent += 'METHOD:PUBLISH\r\n';
  icsContent += 'X-WR-CALNAME:Turnos de trabajo ' + year + '\r\n';
  icsContent += 'X-WR-TIMEZONE:Europe/Madrid\r\n';
  icsContent += 'X-WR-CALDESC:Calendario de turnos de trabajo para el año ' + year + '\r\n';

  const ahora = new Date();
  const dtstamp = formatearFechaHoraICS(ahora);

  // Only include shifts that are not marked as "L" (Libre)
  turnos.forEach((item, index) => {
    if (item.turno !== 'L') {
      const fechaInicioEvento = formatearFechaICS(item.fecha);

      // The end date is the following day because events are full-day blocks
      const fechaFin = new Date(item.fecha);
      fechaFin.setDate(fechaFin.getDate() + 1);
      const fechaFinStr = formatearFechaICS(fechaFin);

      const nombreTurno = `${item.turno}`;
      const descripcion = `${nombreTurno} - Jornada de trabajo`;

      icsContent += 'BEGIN:VEVENT\r\n';
      icsContent += 'UID:' + year + '-' + fechaInicioEvento + '-' + item.turno + '-' + index + '@calculadora-turnos\r\n';
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

  // Trigger download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `Turnos_${year}.ics`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
