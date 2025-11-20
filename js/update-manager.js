/**
 * PWA update manager
 * Detects when a new version is available and shows a banner to the user
 * Uses localStorage so the logic also works on Safari/iOS
 */

let newWorker = null;

/**
 * Checks if a new version is available using localStorage (Safari/iOS friendly)
 */
function comprovarVersioLocalStorage() {
  const versioActual = APP_VERSION;
  const versioGuardada = localStorage.getItem('app_version');

  console.log('Versión actual:', versioActual, '| Versión guardada:', versioGuardada);

  if (versioGuardada && versioGuardada !== versioActual) {
    console.log('Nueva versión detectada vía localStorage');
    mostrarNotificacioActualitzacio(true);
  }

  // Store the current version for the next visit
  localStorage.setItem('app_version', versioActual);
}

/**
 * Initializes the update manager
 */
function initUpdateManager() {
  // First check using localStorage (works on Safari/iOS)
  comprovarVersioLocalStorage();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registrado:', registration.scope);

        // Detect when a new update is waiting
        registration.addEventListener('updatefound', () => {
          newWorker = registration.installing;
          console.log('Nueva versión detectada, instalando...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('Nueva versión instalada y esperando');
              mostrarNotificacioActualitzacio(false);
            }
          });
        });

        // Check for updates every hour
        setInterval(() => {
          console.log('Comprobando actualizaciones...');
          registration.update();
        }, 60 * 60 * 1000);

        // Also check after each reload
        registration.update();
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });

    // Reload automatically when the Service Worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log('Service Worker actualizado, recargando...');
      window.location.reload();
    });
  }
}

/**
 * Shows the update notification banner
 * @param {boolean} forceReload - Forces a reload (used for Safari/iOS)
 */
function mostrarNotificacioActualitzacio(forceReload = false) {
  // Prevent duplicate banners
  if (document.getElementById('update-banner')) {
    return;
  }

  // Build banner content
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.innerHTML = `
    <div class="update-content">
      <span class="update-icon">⚡️</span>
      <div class="update-text">
        <strong>¡Nueva versión disponible!</strong>
        <p>Haz clic en "Actualizar" para obtener las últimas mejoras.</p>
      </div>
      <div class="update-buttons">
        <button id="update-reload" class="update-btn primary">Actualizar</button>
        <button id="update-dismiss" class="update-btn secondary">Más tarde</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Event listeners
  document.getElementById('update-reload').addEventListener('click', () => {
    if (forceReload || !newWorker) {
      // Force reload for Safari/iOS or when no SW is present yet
      window.location.reload(true);
    } else {
      // Activate the waiting Service Worker
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  document.getElementById('update-dismiss').addEventListener('click', () => {
    banner.remove();
  });

  // Animate banner entrance
  setTimeout(() => {
    banner.classList.add('show');
  }, 100);
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUpdateManager);
} else {
  initUpdateManager();
}
