# Sistema de Versionat Automàtic

Aquest projecte utilitza un sistema de versionat automàtic que incrementa la versió cada vegada que fas un commit.

## Com funciona

- **Versió actual**: Es mostra al peu de l'aplicació web
- **Increment automàtic**: Cada commit incrementa automàticament la versió patch (exemple: 1.0.0 → 1.0.1)
- **Fitxers sincronitzats**: `package.json` i `js/version.js` es mantenen sempre sincronitzats

## Configuració inicial

Executa una vegada després de clonar el repositori:

```bash
npm install
```

Això configurarà automàticament els Git hooks (gràcies al script `postinstall`).

O manualment:

```bash
npm run setup-hooks
```

## Increment manual de versió

Si vols incrementar la versió manualment sense fer commit:

```bash
# Increment patch: 1.0.0 → 1.0.1
npm run version:patch

# Increment minor: 1.0.0 → 1.1.0
npm run version:minor

# Increment major: 1.0.0 → 2.0.0
npm run version:major
```

## Desactivar l'increment automàtic

Si vols fer un commit sense incrementar la versió:

```bash
git commit --no-verify -m "missatge"
```

## Arquitectura

1. **Git Hook** (`.githooks/pre-commit`): S'executa abans de cada commit
2. **Script de versió** (`scripts/bump-version.js`): Incrementa la versió
3. **Fitxers actualitzats**:
   - `package.json`: Versió del projecte
   - `js/version.js`: Constants `APP_VERSION` i `CACHE_VERSION`

## Sistema d'actualitzacions PWA

La PWA detecta actualitzacions de dues maneres:

1. **Service Worker**: Mètode estàndard (Chrome, Firefox, Edge)
2. **localStorage**: Compatible amb Safari/iOS

Quan canvia `APP_VERSION`, els usuaris veuen automàticament un banner demanant-los que actualitzin l'aplicació.
