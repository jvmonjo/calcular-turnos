/**
 * Google Calendar export module
 * Generates a formatted CSV file for Google Calendar import
 * Headers: Subject, Start Date, Start Time, End Date, End Time, All Day Event, Description, Location
 */

/**
 * Formats a date to YYYY-MM-DD
 */
function formatearFechaGoogle(fecha) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Exports the yearly shifts to a Google Calendar compatible CSV
 * @param {Date} fechaInicio 
 * @param {string} turnoInicio 
 */
function exportarGoogleCalendar(fechaInicio, turnoInicio) {
    const datos = generarTurnosAnuales(fechaInicio, turnoInicio);
    const { year, turnos } = datos;

    // Google Calendar CSV Headers
    // Ref: https://support.google.com/calendar/answer/37118
    const headers = ['Subject', 'Start Date', 'Start Time', 'End Date', 'End Time', 'All Day Event', 'Description', 'Location'];
    let csvContent = headers.join(',') + '\n';

    turnos.forEach(item => {
        // Only export working days (skip 'L' = Libre)
        if (item.turno !== 'L') {
            const subject = `${item.turno}`;
            const startDate = formatearFechaGoogle(item.fecha);
            const startTime = ''; // All day event
            const endDate = startDate; // Same day for single day event
            const endTime = '';
            const allDayEvent = 'True';
            const description = `Jornada de trabajo - Turno ${item.turno}`;
            const location = '';

            const row = [
                subject,
                startDate,
                startTime,
                endDate,
                endTime,
                allDayEvent,
                description,
                location
            ];

            // Escape fields if necessary (simple approach for now as we control content)
            csvContent += row.join(',') + '\n';
        }
    });

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Turnos_Google_${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // UX Enhancement: Open Google Calendar Import page
    setTimeout(() => {
        window.open('https://calendar.google.com/calendar/u/0/r/settings/export', '_blank');
    }, 1000); // Small delay to ensure download starts first
}
