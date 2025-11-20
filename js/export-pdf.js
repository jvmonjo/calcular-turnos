/**
 * PDF export module
 * Builds an annual schedule in PDF with a clean layout
 */

/**
 * Exports the yearly shifts to PDF
 * @param {Date} fechaInicio - Start date
 * @param {string} turnoInicio - Shift assigned to the start date
 */
function exportarPDF(fechaInicio, turnoInicio) {
  const config = obtenerConfiguracion();
  const datos = generarTurnosAnuales(fechaInicio, turnoInicio, config);
  const { year, turnos } = datos;

  // Create landscape PDF document
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('landscape', 'mm', 'a4');

  // Generate colors dynamically for each shift
  const colores = generarColoresTurnos(config.nombresTurnos);

  // Month names
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Group shifts by month
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

  // Main title
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Calendario de Turnos ${year}`, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  // Grid configuration
  const margenIzq = 15;
  const margenDer = 15;
  const margenSup = 25;
  const anchoDisponible = doc.internal.pageSize.getWidth() - margenIzq - margenDer;
  const anchoMes = 30;
  const anchoCelda = (anchoDisponible - anchoMes - 5) / 31;
  const altoCelda = 6;
  const espacioEntreMeses = 2;

  // Draw weekday header
  const diasSemana = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);

  const inicioCalendario = margenIzq + anchoMes + 5;
  for (let i = 0; i < 31; i++) {
    const x = inicioCalendario + (i * anchoCelda);
    doc.text(`${i + 1}`, x + anchoCelda / 2, margenSup - 2, { align: 'center' });
  }

  // Weekend background pattern: 'rayas' or 'puntos'
  const patronFondoCapDeSetmana = 'rayas';

  // Draw each month
  doc.setFontSize(9);
  let yPos = margenSup;

  for (let mes = 0; mes < 12; mes++) {
    // Month name
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(nombresMeses[mes], margenIzq, yPos + altoCelda / 2 + 1.5);

    // Draw day cells
    if (turnosPorMes[mes]) {
      const diasEnMes = new Date(year, mes + 1, 0).getDate();

      for (let dia = 1; dia <= 31; dia++) {
        const x = inicioCalendario + ((dia - 1) * anchoCelda);

        if (dia <= diasEnMes) {
          const turnoData = turnosPorMes[mes].find(t => t.dia === dia);

          if (turnoData) {
            const color = colores[turnoData.turno] || [255, 255, 255];
            const esCapDeSetmana = turnoData.diaSemana === 0 || turnoData.diaSemana === 6;
            const esLliure = turnoData.turno === 'L';

            if (esLliure) {
              // Empty cells for days off to reduce visual noise
              doc.setDrawColor(220, 220, 220);
              doc.rect(x, yPos, anchoCelda, altoCelda, 'S');

              if (esCapDeSetmana) {
                aplicarPatronFondo(doc, x, yPos, anchoCelda, altoCelda, patronFondoCapDeSetmana);
              }
            } else {
              // Fill cell based on the shift color
              doc.setFillColor(color[0], color[1], color[2]);
              doc.setDrawColor(200, 200, 200);
              doc.rect(x, yPos, anchoCelda, altoCelda, 'FD');

              // Overlay weekend pattern on top of the cell
              if (esCapDeSetmana) {
                aplicarPatronFondo(doc, x, yPos, anchoCelda, altoCelda, patronFondoCapDeSetmana);
              }

              // Shift label
              doc.setFont(undefined, 'bold');
              doc.setFontSize(7);
              const colorTextoTurno = obtenerColorTextoTurno(turnoData.turno);
              doc.setTextColor(colorTextoTurno[0], colorTextoTurno[1], colorTextoTurno[2]);
              doc.text(turnoData.turno, x + anchoCelda / 2, yPos + altoCelda / 2 + 1.5, { align: 'center' });
            }
          }
        } else {
          // Empty cell for days that do not exist in the month
          doc.setFillColor(245, 245, 245);
          doc.setDrawColor(230, 230, 230);
          doc.rect(x, yPos, anchoCelda, altoCelda, 'FD');
        }
      }
    }

    yPos += altoCelda + espacioEntreMeses;
  }

  // Legend
  const separacionLeyenda = 12; // extra spacing to keep the legend away from the grid
  const yLeyenda = yPos + separacionLeyenda;
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Leyenda:', margenIzq, yLeyenda);

  // Draw legend dynamically using the configured shifts
  let xLeyenda = margenIzq + 25;
  config.nombresTurnos.forEach((turno, index) => {
    const color = colores[turno];
    const esLliure = turno === 'L';

    doc.setDrawColor(200, 200, 200);
    if (esLliure) {
      doc.setFillColor(255, 255, 255);
      doc.rect(xLeyenda, yLeyenda - 3, 8, 5, 'S');
      doc.setTextColor(130, 130, 130);
    } else {
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(xLeyenda, yLeyenda - 3, 8, 5, 'FD');
    }
    const colorTextoTurno = esLliure ? [130, 130, 130] : obtenerColorTextoTurno(turno);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(colorTextoTurno[0], colorTextoTurno[1], colorTextoTurno[2]);
    doc.text(turno, xLeyenda + 4, yLeyenda + 1, { align: 'center' });
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    doc.text(`Turno ${turno}`, xLeyenda + 10, yLeyenda);

    xLeyenda += 30;
  });

  // Weekend indicator with stripes
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(255, 255, 255);
  doc.rect(xLeyenda, yLeyenda - 3, 8, 5, 'S');
  aplicarPatronFondo(doc, xLeyenda, yLeyenda - 3, 8, 5, patronFondoCapDeSetmana);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Fin de semana', xLeyenda + 12, yLeyenda);

  // Footer with generation date
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Download PDF
  doc.save(`Calendario_Turnos_${year}.pdf`);
}

/**
 * Generates default colors for each shift
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
 * Returns the proper text color for a given background
 */
function obtenerColorTexto(colorFondo) {
  // Use dark text when the background is very light
  const luminancia = (colorFondo[0] * 0.299 + colorFondo[1] * 0.587 + colorFondo[2] * 0.114);
  if (luminancia > 186) {
    return [60, 60, 60]; // Dark text
  }
  return [255, 255, 255]; // Light text
}

/**
 * Returns the custom text color for each shift code
 */
function obtenerColorTextoTurno(turno) {
  if (turno === 'A') {
    return [204, 102, 0];
  }
  if (turno === 'V') {
    return [153, 51, 0];
  }
  return [150, 150, 150];
}

/**
 * Draws a background pattern inside a rectangle (used for weekends)
 * type: 'rayas' | 'puntos'
 */
function aplicarPatronFondo(doc, x, y, w, h, tipus = 'rayas') {
  // Soft tone for the pattern so it works on light cells
  const colorPatron = [160, 160, 160];

  if (tipus === 'puntos') {
    // Dot grid
    doc.setFillColor(colorPatron[0], colorPatron[1], colorPatron[2]);
    const pasX = 2.5;
    const pasY = 2.5;
    const radi = 0.3;
    for (let yy = y + pasY / 2; yy < y + h; yy += pasY) {
      for (let xx = x + pasX / 2; xx < x + w; xx += pasX) {
        doc.circle(xx, yy, radi, 'F');
      }
    }
  } else {
    // Diagonal stripes (45 degrees) with a constant angle across the cell
    doc.setDrawColor(colorPatron[0], colorPatron[1], colorPatron[2]);
    if (typeof doc.setLineCap === 'function') {
      doc.setLineCap('round');
    }
    doc.setLineWidth(0.12);

    const pas = 2.4; // regular spacing between stripes (mm)
    // Build every diagonal line so the angle stays consistent across the cell
    for (let offset = -h; offset <= w; offset += pas) {
      const punts = [];

      const yEsquerra = -offset;
      if (yEsquerra >= 0 && yEsquerra <= h) punts.push({ x: 0, y: yEsquerra });

      const yDreta = w - offset;
      if (yDreta >= 0 && yDreta <= h) punts.push({ x: w, y: yDreta });

      const xSuperior = offset;
      if (xSuperior >= 0 && xSuperior <= w) punts.push({ x: xSuperior, y: 0 });

      const xInferior = h + offset;
      if (xInferior >= 0 && xInferior <= w) punts.push({ x: xInferior, y: h });

      const puntsUnics = [];
      for (const punt of punts) {
        if (!puntsUnics.some(p => Math.abs(p.x - punt.x) < 0.01 && Math.abs(p.y - punt.y) < 0.01)) {
          puntsUnics.push(punt);
        }
      }

      if (puntsUnics.length >= 2) {
        const [p1, p2] = puntsUnics;
        doc.line(x + p1.x, y + p1.y, x + p2.x, y + p2.y);
      }
    }
  }
}










