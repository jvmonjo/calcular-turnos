/**
 * Mòdul d'exportació PDF
 * Gestiona l'exportació dels torns a format PDF amb disseny elegant
 */

/**
 * Exporta los turnos anuales a formato PDF
 * @param {Date} fechaInicio - Fecha de inicio
 * @param {string} turnoInicio - Turno correspondiente a la fecha de inicio
 */
function exportarPDF(fechaInicio, turnoInicio) {
  const datos = generarTurnosAnuales(fechaInicio, turnoInicio);
  const { year, turnos } = datos;

  // Crear documento PDF en formato apaisado
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Configuración de colores
  const colores = {
    'A': [255, 220, 180], // Taronja clar
    'V': [255, 183, 140], // Taronja més intens
    'L': [255, 255, 255]  // Blanco
  };

  // Nombres de meses
  const nombresMeses = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                        'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

  // Agrupar turnos por mes
  const turnosPorMes = {};
  turnos.forEach(item => {
    const mes = item.fecha.getMonth();
    if (!turnosPorMes[mes]) {
      turnosPorMes[mes] = [];
    }
    turnosPorMes[mes].push({
      dia: item.fecha.getDate(),
      turno: item.turno,
      diaSemana: item.fecha.getDay()
    });
  });

  // Título principal
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(102, 126, 234);
  doc.text(`Calendari de Torns ${year}`, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  // Configuración de la cuadrícula
  const margenIzq = 15;
  const margenDer = 15;
  const margenSup = 25;
  const anchoDisponible = doc.internal.pageSize.getWidth() - margenIzq - margenDer;
  const anchoMes = 30;
  const anchoCelda = (anchoDisponible - anchoMes - 5) / 31;
  const altoCelda = 6;
  const espacioEntreMeses = 2;

  // Dibujar encabezado de días de la semana
  const diasSemana = ['DL', 'DM', 'DC', 'DJ', 'DV', 'DS', 'DG'];
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);

  const inicioCalendario = margenIzq + anchoMes + 5;
  for (let i = 0; i < 31; i++) {
    const x = inicioCalendario + (i * anchoCelda);
    doc.text(`${i + 1}`, x + anchoCelda / 2, margenSup - 2, { align: 'center' });
  }

  // Dibujar cada mes
  doc.setFontSize(9);
  let yPos = margenSup;

  for (let mes = 0; mes < 12; mes++) {
    // Nombre del mes
    doc.setFont(undefined, 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(nombresMeses[mes], margenIzq, yPos + altoCelda / 2 + 1.5);

    // Dibujar celdas de días
    if (turnosPorMes[mes]) {
      const diasEnMes = new Date(year, mes + 1, 0).getDate();

      for (let dia = 1; dia <= 31; dia++) {
        const x = inicioCalendario + ((dia - 1) * anchoCelda);

        if (dia <= diasEnMes) {
          const turnoData = turnosPorMes[mes].find(t => t.dia === dia);

          if (turnoData) {
            // Color de fondo según el turno
            const color = colores[turnoData.turno];
            doc.setFillColor(color[0], color[1], color[2]);
            doc.setDrawColor(200, 200, 200);
            doc.rect(x, yPos, anchoCelda, altoCelda, 'FD');

            // Texto del turno
            doc.setFont(undefined, 'bold');
            doc.setFontSize(7);

            if (turnoData.turno === 'A') {
              doc.setTextColor(204, 102, 0);
            } else if (turnoData.turno === 'V') {
              doc.setTextColor(153, 51, 0);
            } else {
              doc.setTextColor(150, 150, 150);
            }

            doc.text(turnoData.turno, x + anchoCelda / 2, yPos + altoCelda / 2 + 1.5, { align: 'center' });
          }
        } else {
          // Celda vacía para días que no existen en el mes
          doc.setFillColor(245, 245, 245);
          doc.setDrawColor(230, 230, 230);
          doc.rect(x, yPos, anchoCelda, altoCelda, 'FD');
        }
      }
    }

    yPos += altoCelda + espacioEntreMeses;
  }

  // Leyenda
  const yLeyenda = yPos + 5;
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Llegenda:', margenIzq, yLeyenda);

  // Cuadro A
  doc.setFillColor(255, 220, 180);
  doc.setDrawColor(200, 200, 200);
  doc.rect(margenIzq + 25, yLeyenda - 3, 8, 5, 'FD');
  doc.setTextColor(204, 102, 0);
  doc.setFont(undefined, 'bold');
  doc.text('A', margenIzq + 29, yLeyenda + 1, { align: 'center' });
  doc.setTextColor(60, 60, 60);
  doc.setFont(undefined, 'normal');
  doc.text('Torn A', margenIzq + 35, yLeyenda);

  // Cuadro V
  doc.setFillColor(255, 183, 140);
  doc.rect(margenIzq + 55, yLeyenda - 3, 8, 5, 'FD');
  doc.setTextColor(153, 51, 0);
  doc.setFont(undefined, 'bold');
  doc.text('V', margenIzq + 59, yLeyenda + 1, { align: 'center' });
  doc.setTextColor(60, 60, 60);
  doc.setFont(undefined, 'normal');
  doc.text('Torn V', margenIzq + 65, yLeyenda);

  // Cuadro L
  doc.setFillColor(255, 255, 255);
  doc.rect(margenIzq + 85, yLeyenda - 3, 8, 5, 'FD');
  doc.setTextColor(150, 150, 150);
  doc.setFont(undefined, 'bold');
  doc.text('L', margenIzq + 89, yLeyenda + 1, { align: 'center' });
  doc.setTextColor(60, 60, 60);
  doc.setFont(undefined, 'normal');
  doc.text('Lliure', margenIzq + 95, yLeyenda);

  // Descargar PDF
  doc.save(`Calendari_Torns_${year}.pdf`);
}
