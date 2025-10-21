# Calculadora de Torns

Aplicació web progressiva (PWA) per calcular i gestionar torns de treball amb patrons personalitzables.

## 🚀 Característiques

- ⚙️ **Configuració Personalitzable**:
  - Defineix la durada del cicle (de 1 a 365 dies)
  - Crea els teus propis noms de torns (A, V, L, M, T, N, etc.)
  - Personalitza el patró de torns segons les teves necessitats
  - Configuració guardada localment al navegador
- ✅ Càlcul automàtic de torns per a qualsevol data
- 📅 Exportació a múltiples formats:
  - **CSV**: Per a fulles de càlcul
  - **PDF**: Calendari anual visualment elegant amb colors dinàmics
  - **ICS**: Per a Google Calendar, Apple Calendar, Outlook, etc.
- 🔄 Suport per a cicles de qualsevol durada (múltiples de 7 i altres)
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
│   ├── config.js           # Gestió de configuració personalitzable
│   ├── export-csv.js       # Exportació a CSV
│   ├── export-pdf.js       # Exportació a PDF amb colors dinàmics
│   ├── export-ics.js       # Exportació a ICS (iCalendar)
│   └── app.js              # Inicialització i event listeners
├── icons/
│   ├── icon.svg            # Icona vectorial
│   ├── generate-icons.html # Generador d'icones PNG
│   └── README.md           # Instruccions per generar icones
└── README.md               # Aquest fitxer
```

## ⚙️ Configuració de Patrons de Torns

L'aplicació inclou un sistema de configuració flexible que permet personalitzar completament els patrons de torns.

### Patró per Defecte (28 dies)

El sistema ve configurat amb un cicle de 4 setmanes amb alternància entre setmanes llargues i curtes:

**Setmana 1 - Llarga A:** A, L, V, L, A, A, A
**Setmana 2 - Curta V:** L, V, L, A, L, L, L
**Setmana 3 - Llarga V:** V, L, A, L, V, V, V
**Setmana 4 - Curta A:** L, A, L, V, L, L, L

**Llegenda:** A = Torn A | V = Torn V | L = Lliure

### Personalitzar el Patró

Pots crear el teu propi patró de torns:

1. Fes clic a **"Personalizar Patrón"**
2. Defineix:
   - **Durada del cicle**: Nombre de dies del patró (ex: 5, 7, 14, 28, etc.)
   - **Noms dels torns**: Lletres o codis per identificar cada torn (ex: M, T, N, L)
   - **Patró**: Seqüència de torns separats per comes
3. Fes clic a **"Guardar Configuración"**

#### Exemples de Configuracions

**Cicle de 5 dies (torn rotatiu de matí/tarda/nit):**
- Durada: 5
- Noms: M, T, N, L
- Patró: M, T, N, L, L

**Cicle de 7 dies (setmana completa):**
- Durada: 7
- Noms: A, B, L
- Patró: A, A, A, B, B, L, L

**Cicle de 14 dies:**
- Durada: 14
- Noms: D, N, L
- Patró: D, D, D, D, D, N, N, N, N, N, L, L, L, L

### Notes Importants

- **Cicles múltiples de 7 dies** (7, 14, 21, 28...): L'algoritme alinea automàticament el patró amb els dies de la setmana
- **Altres cicles** (5, 6, 10...): La data d'inici ha de correspondre a la primera aparició del torn al patró

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

### Càlcul de Torns

1. Configura el patró de torns (o utilitza el per defecte)
2. Selecciona una **data d'inici** i el **torn** corresponent
3. Selecciona qualsevol **data futura o passada** per calcular el torn
4. L'aplicació calcula automàticament quin torn correspon

### Exportacions

#### CSV
Format simple de text separat per comes, ideal per importar a Excel o Google Sheets.
- Conté totes les dates de l'any amb el torn corresponent
- Compatible amb qualsevol fulls de càlcul

#### PDF
Calendari anual elegant en format apaisat amb:
- Tots els 12 mesos en una sola pàgina A4
- **Colors dinàmics** generats automàticament per a cada torn
- Llegenda adaptativa segons els torns configurats
- Disseny professional i fàcil de llegir

#### ICS (iCalendar)
Format estàndard de calendari compatible amb:
- Google Calendar
- Apple Calendar
- Microsoft Outlook
- Qualsevol aplicació compatible amb iCalendar

Els esdeveniments es creen com a "tot el dia" i només s'inclouen els dies de treball (excloent els dies lliures "L").

## 🔧 Tecnologies Utilitzades

- **HTML5**: Estructura semàntica
- **CSS3**: Estils moderns amb gradients i animacions
- **JavaScript (ES6+)**: Lògica de l'aplicació
- **localStorage**: Persistència de configuracions
- **jsPDF**: Generació de PDFs amb colors dinàmics
- **Service Worker**: Funcionament offline i caché intel·ligent
- **Web App Manifest**: PWA completa

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
