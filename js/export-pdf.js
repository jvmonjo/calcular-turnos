/**
 * MÃ²dul d'exportaciÃ³ PDF
 * Gestiona l'exportaciÃ³ dels torns a format PDF amb disseny elegant
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

  // Generar colores dinÃ¡micamente para cada turno
  const colores = generarColoresTurnos(config.nombresTurnos);

  // Nombres de meses
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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

  // TÃ­tulo principal
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Calendario de Turnos ${year}`, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  // ConfiguraciÃ³n de la cuadrÃ­cula
  const margenIzq = 15;
  const margenDer = 15;
  const margenSup = 25;
  const anchoDisponible = doc.internal.pageSize.getWidth() - margenIzq - margenDer;
  const anchoMes = 30;
  const anchoCelda = (anchoDisponible - anchoMes - 5) / 31;
  const altoCelda = 6;
  const espacioEntreMeses = 2;

  // Dibujar encabezado de dÃ­as de la semana
  const diasSemana = ['DL', 'DM', 'DC', 'DJ', 'DV', 'DS', 'DG'];
  doc.setFontSize(7);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(80, 80, 80);

  const inicioCalendario = margenIzq + anchoMes + 5;
  for (let i = 0; i < 31; i++) {
    const x = inicioCalendario + (i * anchoCelda);
    doc.text(`${i + 1}`, x + anchoCelda / 2, margenSup - 2, { align: 'center' });
  }

  // OpciÃ³ de patrÃ³ per caps de setmana: 'rayas' o 'puntos'
  const patronFondoCapDeSetmana = 'rayas';

  // Dibujar cada mes
  doc.setFontSize(9);
  let yPos = margenSup;

  for (let mes = 0; mes < 12; mes++) {
    // Nombre del mes
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(nombresMeses[mes], margenIzq, yPos + altoCelda / 2 + 1.5);

    // Dibujar celdas de dÃ­as
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
              // Celï¿½les lliures sense fons per reduir cï¿½rrega visual
              doc.setDrawColor(220, 220, 220);
              doc.rect(x, yPos, anchoCelda, altoCelda, 'S');

              if (esCapDeSetmana) {
                aplicarPatronFondo(doc, x, yPos, anchoCelda, altoCelda, patronFondoCapDeSetmana);
              }
            } else {
              // Fons de la celï¿½la segons el torn
              doc.setFillColor(color[0], color[1], color[2]);
              doc.setDrawColor(200, 200, 200);
              doc.rect(x, yPos, anchoCelda, altoCelda, 'FD');

              // Patrï¿½ per a caps de setmana sobreposat al fons
              if (esCapDeSetmana) {
                aplicarPatronFondo(doc, x, yPos, anchoCelda, altoCelda, patronFondoCapDeSetmana);
              }

              // Texto del turno
              doc.setFont(undefined, 'bold');
              doc.setFontSize(7);
              const colorTextoTurno = obtenerColorTextoTurno(turnoData.turno);
              doc.setTextColor(colorTextoTurno[0], colorTextoTurno[1], colorTextoTurno[2]);
              doc.text(turnoData.turno, x + anchoCelda / 2, yPos + altoCelda / 2 + 1.5, { align: 'center' });
            }
          }
        } else {
          // Celda vacÃ­a para dÃ­as que no existen en el mes
          doc.setFillColor(245, 245, 245);
          doc.setDrawColor(230, 230, 230);
          doc.rect(x, yPos, anchoCelda, altoCelda, 'FD');
        }
      }
    }

    yPos += altoCelda + espacioEntreMeses;
  }

  // Leyenda
  const separacionLeyenda = 12; // espai addicional per separar de la graella
  const yLeyenda = yPos + separacionLeyenda;
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Leyenda:', margenIzq, yLeyenda);

  // Dibujar leyenda dinÃ¡micamente segÃºn los turnos configurados
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

  // Indicador de caps de setmana amb ratlles
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(255, 255, 255);
  doc.rect(xLeyenda, yLeyenda - 3, 8, 5, 'S');
  aplicarPatronFondo(doc, xLeyenda, yLeyenda - 3, 8, 5, patronFondoCapDeSetmana);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Fin de semana', xLeyenda + 12, yLeyenda);

  // Peu de pÃ gina amb data de generaciÃ³
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generado: ${new Date().toLocaleDateString('ca-ES')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

  // Descargar PDF
  doc.save(`Calendario_Turnos_${year}.pdf`);
}

/**
 * Genera colores automÃ¡ticamente para cada turno
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
 * Obtiene el color de texto apropiado segÃºn el color de fondo
 */
function obtenerColorTexto(colorFondo) {
  // Si el color es muy claro, usar texto oscuro
  const luminancia = (colorFondo[0] * 0.299 + colorFondo[1] * 0.587 + colorFondo[2] * 0.114);
  if (luminancia > 186) {
    return [60, 60, 60]; // Texto oscuro
  }
  return [255, 255, 255]; // Texto claro
}

/**
 * Retorna el color de text emprat per a cada codi de torn
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
 * Dibuixa un patrÃ³ de fons dins d'un rectangle (caps de setmana)
 * tipus: 'rayas' | 'puntos'
 */
function aplicarPatronFondo(doc, x, y, w, h, tipus = 'rayas') {
  // Color suau per al patro perque funcioni sobre colors clars (mes difuminat)
  const colorPatron = [160, 160, 160];

  if (tipus === 'puntos') {
    // Graella de punts
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
    // Ratlles obliques (45 graus) amb angle constant a tota la cella
    doc.setDrawColor(colorPatron[0], colorPatron[1], colorPatron[2]);
    if (typeof doc.setLineCap === 'function') {
      doc.setLineCap('round');
    }
    doc.setLineWidth(0.12);

    const pas = 2.4; // separacio regular entre ratlles (mm)
    // Construir totes les rectes de 45 graus garantint el mateix angle a tota la cella
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

