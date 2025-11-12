# Sistema d'Actualitzacions de la PWA

## 🔄 Com Funciona

L'aplicació ara inclou un sistema automàtic de detecció i notificació d'actualitzacions.

### Funcionament Automàtic

1. **Detecció automàtica**: L'aplicació comprova actualitzacions cada hora i quan es recarrega la pàgina
2. **Notificació visual**: Quan hi ha una nova versió, apareix un banner a la part inferior de la pantalla
3. **Actualització fàcil**: L'usuari pot actualitzar amb un clic o posposar-ho

### Banner d'Actualització

Quan hi ha una nova versió disponible, apareix un banner amb:
- 🔄 Icona animada
- Missatge clar: "Nova versió disponible!"
- Botó **"Actualitzar"**: Aplica la nova versió immediatament
- Botó **"Més tard"**: Amaga el banner (tornarà a aparèixer en recarregar)

## 📱 Compatibilitat per Plataforma

### ✅ Desktop (Chrome, Edge, Firefox, Opera)
- **Funcionament**: Complet
- **Actualitzacions**: Automàtiques
- **Banner**: Es mostra correctament

### ✅ Android (Chrome, Edge, Samsung Internet)
- **Funcionament**: Complet
- **Actualitzacions**: Automàtiques
- **Banner**: Es mostra correctament

### ⚠️ iOS / Safari
- **Funcionament**: Limitat
- **Actualitzacions**: NOMÉS quan la PWA està instal·lada a la pantalla d'inici
- **Navegador Safari**: Els Service Workers NO funcionen
- **PWA instal·lada**: Funciona correctament

#### Important per a usuaris iOS:

1. **Si uses Safari** (navegador):
   - Els Service Workers no funcionen
   - NO rebràs notificacions d'actualització
   - Has de refrescar manualment (Ctrl+R)

2. **Si tens la PWA instal·lada** (icona a la pantalla d'inici):
   - Els Service Workers funcionen perfectament
   - Rebràs notificacions d'actualització
   - El sistema funciona com a Android/Desktop

### Com instal·lar la PWA a iOS:

1. Obre l'aplicació amb Safari
2. Toca el botó "Compartir" (quadrat amb fletxa cap amunt)
3. Desplaça't cap avall i toca "Afegir a la pantalla d'inici"
4. Toca "Afegir"
5. Ara tens la PWA instal·lada amb suport complet!

## 🛠️ Per a Desenvolupadors

### Canviar la Versió

Per desplegar una nova versió:

1. Modifica els fitxers necessaris
2. **Canvia `CACHE_NAME` a `sw.js`**:
   ```javascript
   const CACHE_NAME = 'calculadora-torns-v7'; // Incrementa el número
   ```
3. Desplega els canvis
4. Els usuaris rebran automàticament la notificació

### Fluxe de l'Actualització

```
1. Usuari visita l'app
   ↓
2. update-manager.js comprova actualitzacions
   ↓
3. Service Worker detecta nova versió (nou CACHE_NAME)
   ↓
4. Nova versió s'instal·la en segon pla
   ↓
5. Banner apareix amb notificació
   ↓
6. Usuari fa clic a "Actualitzar"
   ↓
7. Nova versió s'activa i pàgina es recarrega
```

### Fitxers Clau

- **`sw.js`**: Service Worker amb gestió de caché
- **`js/update-manager.js`**: Detecció i notificació d'actualitzacions
- **`css/styles.css`**: Estils del banner (#update-banner)

## 🧪 Provar el Sistema

1. Desplega la versió actual
2. Obre l'aplicació
3. Canvia `CACHE_NAME` a una nova versió
4. Desplega els canvis
5. Recarrega l'aplicació (NO tancar-la)
6. En uns segons hauria d'aparèixer el banner

## 📝 Notes

- Les actualitzacions es descarreguen en segon pla
- No interrompen l'ús de l'aplicació
- L'usuari sempre té control sobre quan aplicar-les
- Si l'usuari tanca el banner, pot actualitzar manualment recarregant la pàgina
