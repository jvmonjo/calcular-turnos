# Calculadora de Turnos

Aplicación web para calcular y gestionar turnos de trabajo basados en un patrón cíclico de 4 semanas (28 días).

## Características

- **Cálculo de turnos**: Calcula el turno correspondiente a cualquier fecha basándose en una fecha de inicio y su turno asociado
- **Interfaz moderna**: Diseño responsive con gradientes y animaciones suaves
- **Exportación múltiple**:
  - Exportar calendario anual completo en formato CSV
  - Exportar calendario anual completo en formato PDF (organizado por meses)

## Patrón de Turnos

El sistema utiliza un ciclo de 4 semanas con alternancia entre semanas largas y cortas:

### Semana 1 - Larga A
- Lunes: A, Martes: L, Miércoles: V, Jueves: L, Viernes: A, Sábado: A, Domingo: A

### Semana 2 - Corta V
- Lunes: L, Martes: V, Miércoles: L, Jueves: A, Viernes: L, Sábado: L, Domingo: L

### Semana 3 - Larga V
- Lunes: V, Martes: L, Miércoles: A, Jueves: L, Viernes: V, Sábado: V, Domingo: V

### Semana 4 - Corta A
- Lunes: L, Martes: A, Miércoles: L, Jueves: V, Viernes: L, Sábado: L, Domingo: L

**Leyenda:**
- **A**: Turno A
- **V**: Turno V
- **L**: Día libre

## Uso

1. **Configurar fecha de inicio**: Selecciona una fecha de referencia
2. **Seleccionar turno inicial**: Indica qué turno (A o V) corresponde a esa fecha
3. **Calcular turnos**:
   - Para una fecha específica: introduce la fecha y haz clic en "Calcular Turno"
   - Para todo el año: utiliza los botones de exportación

## Exportación

### CSV
Genera un archivo CSV simple con dos columnas:
- Fecha
- Turno

Compatible con Excel, Google Sheets y otras aplicaciones de hoja de cálculo.

### PDF
Genera un documento PDF profesional con:
- Título con el año
- Datos organizados por meses
- Tablas formateadas con colores
- Paginación automática

## Tecnologías

- HTML5
- CSS3 (con gradientes y animaciones)
- JavaScript vanilla
- [jsPDF](https://github.com/parallax/jsPDF) - Generación de PDFs
- [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) - Tablas en PDF

## Instalación

No requiere instalación. Simplemente abre el archivo `index.html` en tu navegador web.

## Compatibilidad

- Chrome/Edge (recomendado)
- Firefox
- Safari
- Opera

Funciona en dispositivos móviles y tablets con diseño responsive.

## Licencia

Proyecto de uso libre.
