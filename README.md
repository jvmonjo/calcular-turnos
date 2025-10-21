# Calculadora de Torns

Aplicació web progressiva (PWA) per calcular i gestionar torns de treball amb un patró de 28 dies.

## 🚀 Característiques

- ✅ Càlcul de torns segons un patró personalitzat de 4 setmanes
- 📅 Exportació a múltiples formats:
  - **CSV**: Per a fulles de càlcul
  - **PDF**: Calendari anual visualment elegant en format apaisat
  - **ICS**: Per a Google Calendar, Apple Calendar, Outlook, etc.
- 📱 Progressive Web App (PWA): Instal·lable i funcional sense connexió
- 🎨 Disseny modern i responsive
- ⚡ Ràpid i eficient

## 📁 Estructura del Projecte

```
calcular-turnos/
├── index.html              # Pàgina principal
├── manifest.json           # Manifest de la PWA
├── sw.js                   # Service Worker per a funcionament offline
├── css/
│   └── styles.css          # Estils de l'aplicació
├── js/
│   ├── turnos.js           # Lògica de càlcul de torns
│   ├── export-csv.js       # Exportació a CSV
│   ├── export-pdf.js       # Exportació a PDF
│   ├── export-ics.js       # Exportació a ICS (iCalendar)
│   └── app.js              # Inicialització i event listeners
├── icons/
│   ├── icon.svg            # Icona vectorial
│   ├── generate-icons.html # Generador d'icones PNG
│   └── README.md           # Instruccions per generar icones
└── README.md               # Aquest fitxer
```

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

## 🛠️ Instal·lació i Ús

### Ús Local

1. Clona o descarrega el projecte
2. Obre `icons/generate-icons.html` en un navegador
3. Descarrega totes les icones generades i desa-les a la carpeta `icons/`
4. Obre `index.html` en un navegador web
5. L'aplicació ja està llesta per utilitzar!

### Instal·lar com a PWA

1. Obre l'aplicació en Chrome, Edge o Safari
2. Fes clic a la icona d'instal·lar a la barra d'adreces
3. Confirma la instal·lació
4. L'aplicació s'afegirà al teu escriptori/pantalla d'inici
5. Poràs utilitzar-la sense connexió a Internet!

### Desplegar en un Servidor

Per desplegar l'aplicació en un servidor web:

1. Puja tots els fitxers a un servidor web (Apache, Nginx, GitHub Pages, etc.)
2. Assegura't que el servidor serveix els fitxers amb HTTPS (requerit per a PWA)
3. Accedeix a la URL del servidor
4. L'aplicació estarà disponible i instal·lable com a PWA

## 📖 Com Funciona

### Exportacions

#### CSV
Format simple de text separat per comes, ideal per importar a Excel o Google Sheets.

#### PDF
Calendari anual elegant en format apaisat amb:
- Tots els 12 mesos en una sola pàgina A4
- Colors diferenciats per a cada torn (taronja clar per A, taronja intens per V)
- Llegenda clara i disseny professional

#### ICS (iCalendar)
Format estàndard de calendari compatible amb:
- Google Calendar
- Apple Calendar
- Microsoft Outlook
- Qualsevol aplicació compatible amb iCalendar

Els esdeveniments es creen com a "tot el dia" perquè apareguin a la part superior del calendari.

## 🔧 Tecnologies Utilitzades

- **HTML5**: Estructura semàntica
- **CSS3**: Estils moderns amb gradients i animacions
- **JavaScript (ES6+)**: Lògica de l'aplicació
- **jsPDF**: Generació de PDFs
- **Service Worker**: Funcionament offline
- **Web App Manifest**: PWA

## 📱 Compatibilitat

- ✅ Chrome/Edge (versió 67+)
- ✅ Firefox (versió 63+)
- ✅ Safari (versió 11.1+)
- ✅ Opera (versió 54+)
- ✅ Dispositius mòbils (iOS i Android)

## 🤝 Contribuir

Les contribucions són benvingudes! Si vols millorar l'aplicació:

1. Fes un fork del projecte
2. Crea una branca per a la teva funcionalitat (`git checkout -b feature/nova-funcionalitat`)
3. Fes commit dels canvis (`git commit -m 'Afegir nova funcionalitat'`)
4. Puja els canvis (`git push origin feature/nova-funcionalitat`)
5. Obre un Pull Request

## 📄 Llicència

Aquest projecte és de codi obert i està disponible sota la llicència MIT.

## 📧 Contacte

Per a preguntes o suggeriments, si us plau obre un issue al repositori.

---

Fet amb ❤️ per facilitar la gestió de torns de treball
