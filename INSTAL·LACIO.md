# Guia d'Instal·lació i Configuració

## 📋 Passos Inicials

### 1. Generar les Icones de la PWA

Les icones són necessàries perquè l'aplicació es pugui instal·lar com a PWA:

1. Obre el fitxer `icons/generate-icons.html` en el teu navegador web
2. Les icones es generaran automàticament al carregar la pàgina
3. Fes clic al botó "Descarregar" sota cada icona
4. Desa totes les icones (8 fitxers) a la carpeta `icons/` amb els noms:
   - `icon-72x72.png`
   - `icon-96x96.png`
   - `icon-128x128.png`
   - `icon-144x144.png`
   - `icon-152x152.png`
   - `icon-192x192.png`
   - `icon-384x384.png`
   - `icon-512x512.png`

> **Nota:** Si no generes les icones, l'aplicació funcionarà igualment però no tindrà una icona personalitzada quan s'instal·li.

### 2. Provar l'Aplicació Localment

1. Obre el fitxer `index.html` directament en el teu navegador
2. L'aplicació hauria de carregar correctament
3. Prova totes les funcionalitats:
   - Càlcul de torns
   - Exportació CSV
   - Exportació PDF
   - Exportació ICS

> **Important:** Algunes funcionalitats de PWA (com el Service Worker) poden no funcionar correctament si obres el fitxer directament. Per provar completament la PWA, necessites un servidor web local.

### 3. Servidor Web Local (Recomanat per PWA)

Per provar completament la PWA, necessites servir l'aplicació des d'un servidor web:

#### Opció A: Usar Python (si el tens instal·lat)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Després obre `http://localhost:8000` al navegador.

#### Opció B: Usar Node.js amb http-server

```bash
# Instal·lar http-server globalment
npm install -g http-server

# Executar el servidor
http-server -p 8000
```

Després obre `http://localhost:8000` al navegador.

#### Opció C: Usar l'extensió Live Server de VS Code

1. Instal·la l'extensió "Live Server" a VS Code
2. Fes clic dret a `index.html`
3. Selecciona "Open with Live Server"

### 4. Provar la Funcionalitat PWA

Un cop tinguis l'aplicació servida des d'un servidor web:

1. Obre l'aplicació en Chrome o Edge
2. Busca la icona d'instal·lar (⊕) a la barra d'adreces
3. Fes clic per instal·lar l'aplicació
4. L'aplicació s'obrirà en una finestra independent
5. Ara pots utilitzar-la sense connexió!

**Provar el mode offline:**
1. Amb l'aplicació instal·lada, obre DevTools (F12)
2. Vés a la pestanya "Application" → "Service Workers"
3. Marca la casella "Offline"
4. Recarrega la pàgina - hauria de seguir funcionant!

## 🌐 Desplegar a Internet

### GitHub Pages (Gratuït)

1. Puja el projecte a un repositori de GitHub
2. Vés a "Settings" → "Pages"
3. Selecciona la branca `main` o `master`
4. Desa i espera uns minuts
5. La teva aplicació estarà disponible a `https://usuari.github.io/calcular-turnos/`

### Netlify (Gratuït)

1. Crea un compte a [Netlify](https://www.netlify.com/)
2. Arrossega la carpeta del projecte a Netlify Drop
3. La teva aplicació estarà disponible immediatament
4. Netlify et donarà una URL com `https://nom-aleatori.netlify.app/`

### Vercel (Gratuït)

1. Crea un compte a [Vercel](https://vercel.com/)
2. Connecta el teu repositori de GitHub
3. Desplega amb un clic
4. URL: `https://nom-projecte.vercel.app/`

## ✅ Verificació Final

Després de desplegar, verifica:

- [ ] L'aplicació es carrega correctament
- [ ] Els estils es veuen bé
- [ ] El càlcul de torns funciona
- [ ] Les exportacions (CSV, PDF, ICS) funcionen
- [ ] Apareix la icona d'instal·lar a la barra d'adreces
- [ ] L'aplicació funciona offline després d'instal·lar-la
- [ ] Les icones de la PWA es veuen correctament

## 🐛 Problemes Comuns

### La PWA no es pot instal·lar

- Assegura't que estàs servint l'aplicació amb HTTPS (GitHub Pages, Netlify i Vercel ho fan automàticament)
- Comprova que el fitxer `manifest.json` sigui accessible
- Verifica que les icones estiguin generades i a la carpeta `icons/`

### El Service Worker no funciona

- Comprova la consola del navegador per errors
- Assegura't que estàs servint des d'un servidor web (no obrint el fitxer directament)
- El Service Worker només funciona amb HTTPS o localhost

### Les exportacions no funcionen

- Comprova que les llibreries jsPDF s'estan carregant correctament
- Verifica la consola del navegador per errors
- Assegura't que tens una connexió a Internet per carregar les llibreries CDN

## 📞 Suport

Si tens problemes:

1. Revisa la consola del navegador (F12) per errors
2. Comprova que tots els fitxers estiguin al lloc correcte
3. Verifica que les icones s'hagin generat correctament
4. Consulta el README.md per més informació

---

**Fet! Ara tens una PWA completament funcional per gestionar torns de treball! 🎉**
