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
  const config = obtenerConfiguracion();
  const datos = generarTurnosAnuales(fechaInicio, turnoInicio, config);
  const { year, turnos } = datos;

  // Crear documento PDF en formato apaisado
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Generar colores dinámicamente para cada turno
  const colores = generarColoresTurnos(config.nombresTurnos);

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
            let color = colores[turnoData.turno];

            // Enfosquir les cel·les dels caps de setmana
            const esCapDeSetmana = turnoData.diaSemana === 0 || turnoData.diaSemana === 6;
            if (esCapDeSetmana) {
              // Enfosquir el color restant un 15% a cada component RGB
              color = [
                Math.max(0, color[0] - 40),
                Math.max(0, color[1] - 40),
                Math.max(0, color[2] - 40)
              ];
            }

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

  // Dibujar leyenda dinámicamente según los turnos configurados
  let xLeyenda = margenIzq + 25;
  config.nombresTurnos.forEach((turno, index) => {
    const color = colores[turno];
    const colorTexto = obtenerColorTexto(color);

    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(200, 200, 200);
    doc.rect(xLeyenda, yLeyenda - 3, 8, 5, 'FD');
    doc.setTextColor(colorTexto[0], colorTexto[1], colorTexto[2]);
    doc.setFont(undefined, 'bold');
    doc.text(turno, xLeyenda + 4, yLeyenda + 1, { align: 'center' });
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    doc.text(`Torn ${turno}`, xLeyenda + 10, yLeyenda);

    xLeyenda += 30;
  });

  // Peu de pàgina amb data de generació
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generat: ${new Date().toLocaleDateString('ca-ES')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Descargar PDF
  doc.save(`Calendari_Torns_${year}.pdf`);
}

/**
 * Genera colores automáticamente para cada turno
 */
function generarColoresTurnos(nombresTurnos) {
  const coloresPredefinidos = {
    'A': [255, 220, 180],
    'V': [255, 183, 140],
    'L': [255, 255, 255],
    'M': [180, 220, 255],
    'N': [220, 180, 255],
    'T': [180, 255, 220]
  };

  const colores = {};
  const coloresBase = [
    [255, 200, 200], [200, 255, 200], [200, 200, 255],
    [255, 255, 200], [255, 200, 255], [200, 255, 255],
    [255, 180, 180], [180, 255, 180], [180, 180, 255]
  ];

  nombresTurnos.forEach((turno, index) => {
    if (coloresPredefinidos[turno]) {
      colores[turno] = coloresPredefinidos[turno];
    } else {
      colores[turno] = coloresBase[index % coloresBase.length];
    }
  });

  return colores;
}

/**
 * Obtiene el color de texto apropiado según el color de fondo
 */
function obtenerColorTexto(colorFondo) {
  // Si el color es muy claro, usar texto oscuro
  const luminancia = (colorFondo[0] * 0.299 + colorFondo[1] * 0.587 + colorFondo[2] * 0.114);
  if (luminancia > 186) {
    return [60, 60, 60]; // Texto oscuro
  }
  return [255, 255, 255]; // Texto claro
}
