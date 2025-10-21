/**
 * Gestor d'actualitzacions de la PWA
 * Detecta quan hi ha una nova versió disponible i notifica l'usuari
 */

let newWorker = null;

/**
 * Inicialitza el gestor d'actualitzacions
 */
function initUpdateManager() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registrat:', registration.scope);

        // Detectar quan hi ha una actualització esperant
        registration.addEventListener('updatefound', () => {
          newWorker = registration.installing;
          console.log('Nova versió detectada, instal·lant...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Hi ha una nova versió disponible
              console.log('Nova versió instal·lada i esperant');
              mostrarNotificacioActualitzacio();
            }
          });
        });

        // Comprovar actualitzacions cada hora
        setInterval(() => {
          console.log('Comprovant actualitzacions...');
          registration.update();
        }, 60 * 60 * 1000); // 1 hora

        // Comprovar actualitzacions quan es recarrega la pàgina
        registration.update();
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });

    // Detectar quan el Service Worker pren control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log('Service Worker actualitzat, recarregant...');
      window.location.reload();
    });
  }
}

/**
 * Mostra la notificació d'actualització
 */
function mostrarNotificacioActualitzacio() {
  // Crear el banner de notificació
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.innerHTML = `
    <div class="update-content">
      <span class="update-icon">🔄</span>
      <div class="update-text">
        <strong>Nova versió disponible!</strong>
        <p>Fes clic a "Actualitzar" per obtenir les últimes millores.</p>
      </div>
      <div class="update-buttons">
        <button id="update-reload" class="update-btn primary">Actualitzar</button>
        <button id="update-dismiss" class="update-btn secondary">Més tard</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Event listeners
  document.getElementById('update-reload').addEventListener('click', () => {
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  document.getElementById('update-dismiss').addEventListener('click', () => {
    banner.remove();
  });

  // Animar l'entrada
  setTimeout(() => {
    banner.classList.add('show');
  }, 100);
}

// Inicialitzar quan carrega el DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUpdateManager);
} else {
  initUpdateManager();
}
