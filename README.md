# Calculadora de Turnos

Aplicación web progresiva (PWA) para calcular y gestionar turnos de trabajo con patrones totalmente personalizables.

## Contenido

1. [Características principales](#características-principales)
2. [Arquitectura del proyecto](#arquitectura-del-proyecto)
3. [Instalación y despliegue](#instalación-y-despliegue)
4. [Uso y configuración](#uso-y-configuración)
5. [Exportaciones disponibles](#exportaciones-disponibles)
6. [Sistema de actualizaciones PWA](#sistema-de-actualizaciones-pwa)
7. [Versionado automático](#versionado-automático)
8. [Problemas comunes y soporte](#problemas-comunes-y-soporte)
9. [Tecnologías y compatibilidad](#tecnologías-y-compatibilidad)
10. [Contribuir](#contribuir)
11. [Licencia y contacto](#licencia-y-contacto)

## Características principales

- ⚙️ **Configuración personalizable**: duración del ciclo (1-365 días), nombres de turnos y patrón completo; se guarda en `localStorage`.
- ✅ **Cálculo inmediato** para cualquier fecha pasada o futura.
- 📤 **Exportaciones múltiples**: CSV, PDF anual con colores dinámicos e ICS compatible con Google/Apple/Outlook.
- 🔁 **Soporte para cualquier ciclo** (múltiplos de 7 u otros) con alineado automático cuando aplica.
- 📱 **PWA completa**: instalable, funciona offline y detecta nuevas versiones con un banner.
- ⚡ **Rendimiento ligero** gracias a JavaScript puro, sin dependencias pesadas.

## Arquitectura del proyecto

```
calcular-turnos/
├── index.html              # Interfaz principal
├── manifest.json           # Manifest PWA
├── sw.js                   # Service Worker para caché y offline
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── app.js              # Eventos de UI
│   ├── turnos.js           # Lógica de cálculo
│   ├── config.js           # Panel de personalización
│   ├── export-*.js         # Exportaciones CSV/PDF/ICS
│   ├── update-manager.js   # Detección de nuevas versiones
│   └── version.js          # Constantes APP_VERSION/CACHE_VERSION
├── icons/                  # Iconos PWA (generados con npm run generate-icons)
├── scripts/                # Scripts auxiliares (hooks y versionado)
└── README.md               # Este documento
```

## Instalación y despliegue

### Prueba local rápida

1. Clona o descarga el repositorio.
2. Si necesitas regenerar los iconos, ejecuta `npm install` (solo la primera vez) y luego `npm run generate-icons` para recrearlos a partir de `icons/icon.svg`.
3. Abre `index.html` en tu navegador para una prueba básica.

> Para probar todas las capacidades PWA (Service Worker, instalación, modo offline) sirve el proyecto desde un servidor local: `python -m http.server 8000`, `http-server -p 8000` o la extensión **Live Server** de VS Code.

### Instalación como PWA

1. Con la app servida mediante HTTPS/localhost, abre Chrome/Edge/Safari.
2. Pulsa el icono de instalación de la barra de direcciones.
3. La aplicación se añadirá a tu escritorio y funcionará offline.
4. Para probar el modo offline marca "Offline" en *DevTools → Application → Service Workers* y recarga.

### Despliegue en producción

- **GitHub Pages**: activa `Settings → Pages` sobre `main` y espera unos minutos.
- **Netlify/Vercel**: arrastra la carpeta o conecta el repo; sirven HTTPS automáticamente.
- **Servidor propio**: sube todos los archivos estáticos y habilita HTTPS.

## Uso y configuración

### Configuración del patrón

1. Haz clic en **“Personalizar Patrón”**.
2. Define duración del ciclo, nombres de turnos y la secuencia (separada por comas).
3. Guarda los cambios. Si el ciclo no es múltiplo de 7 se muestra una advertencia recordando que la fecha inicial debe coincidir con la primera aparición del turno.

**Patrón por defecto (28 días)**

- Semana 1 (Larga A): `A, L, V, L, A, A, A`
- Semana 2 (Corta V): `L, V, L, A, L, L, L`
- Semana 3 (Larga V): `V, L, A, L, V, V, V`
- Semana 4 (Corta A): `L, A, L, V, L, L, L`

Puedes restablecerlo en cualquier momento con **“Restaurar por defecto”**.

### Flujo de uso

1. Configura (opcional) el patrón.
2. Selecciona la **fecha de inicio** y el **turno que le corresponde**.
3. Introduce la fecha objetivo y pulsa **“Calcular turno”**.
4. Usa los botones de exportación cuando quieras generar el calendario anual.

## Exportaciones disponibles

- **CSV**: listado completo `Fecha,Turno`, ideal para Excel/Sheets.
- **PDF**: calendario anual en una página A4 con leyenda dinámica, indicadores de fin de semana (“Fin de semana”) y colores asignados automáticamente.
- **ICS**: genera eventos de día completo para turnos distintos de `L`, listos para cualquier calendario iCal.

## Sistema de actualizaciones PWA

- La app comprueba nuevas versiones **cada hora** y en cada recarga.
- Cuando detecta cambios (por Service Worker o por `localStorage` en Safari/iOS) aparece un banner con dos acciones: **Actualizar** (recarga o `SKIP_WAITING`) y **Más tarde**.
- En iOS, los Service Workers solo funcionan cuando la PWA está instalada en la pantalla de inicio; Safari puro requiere refrescar manualmente.
- El banner se muestra una única vez por versión y desaparece al actualizar o cerrarlo.

**Flujo resumido:** visita → `update-manager.js` consulta → nuevo `CACHE_NAME` → Service Worker instala en segundo plano → banner → clic en “Actualizar” → `SKIP_WAITING` → recarga automática.

## Versionado automático

- La versión visible en el footer proviene de `APP_VERSION` (`js/version.js`).
- Git hooks automáticos incrementan la versión según el prefijo del commit (`feat` → *minor*, `fix/chore` → *patch*, `!*` o BREAKING → *major*).
- El script `scripts/bump-version.js` mantiene sincronizados `package.json` y `js/version.js`.
- Para incrementos manuales: `npm run version:patch|minor|major`.
- Si necesitas omitir el hook en un commit, usa `git commit --no-verify`.

## Problemas comunes y soporte

| Problema | Solución sugerida |
| --- | --- |
| La PWA no se puede instalar | Sirve la app mediante HTTPS, revisa que `manifest.json` y los iconos estén accesibles. |
| El Service Worker no se registra | Asegúrate de usar un servidor (no `file://`) y revisa la consola del navegador. |
| Exportaciones fallan | Comprueba que las librerías jsPDF del CDN se cargan correctamente; necesitas conexión. |
| Banner de actualización no aparece | Incrementa `CACHE_NAME`, despliega y recarga sin cerrar la pestaña; revisa la consola para ver si el SW detecta la nueva versión. |

Si tienes dudas:
1. Abre DevTools (F12) y revisa la consola.
2. Comprueba que todos los archivos estén en su ruta correcta.
3. Revisa este README para confirmar pasos de instalación/despliegue.
4. Crea un issue en el repositorio si necesitas ayuda adicional.

## Tecnologías y compatibilidad

- **Tecnologías**: HTML5, CSS3, JavaScript ES6+, `localStorage`, jsPDF, Service Worker, Web App Manifest.
- **Compatibilidad**: Chrome/Edge 67+, Firefox 63+, Safari 11.1+, Opera 54+, iOS y Android (como PWA o en navegador moderno).

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/mi-funcionalidad`).
3. Realiza tus cambios y commits (los hooks ajustarán la versión si procede).
4. `git push` a tu fork y abre un Pull Request.

## Licencia y contacto

- Proyecto publicado bajo licencia **MIT**.
- Para preguntas o sugerencias abre un issue; estaremos atentos.

---

Creado para facilitar la planificación de turnos de trabajo.
