# Generació automàtica d'icones

Aquest directori conté el sistema per generar automàticament totes les icones PWA a partir del fitxer `icon.svg`.

## Ús

### 1. Instal·lar dependències (només la primera vegada)

```bash
npm install
```

### 2. Generar les icones

```bash
npm run generate-icons
```

Aquest comando generarà automàticament totes les icones PNG a les mides següents:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

Les icones es desaran directament a la carpeta `icons/` sobreescrivint les existents.

## Editar la icona

1. Edita el fitxer `icons/icon.svg` amb el teu editor SVG preferit (Inkscape, Illustrator, etc.)
2. Executa `npm run generate-icons` per regenerar totes les icones PNG

## Fitxers

- `icon.svg` - Fitxer font de la icona (edita aquest fitxer)
- `generate-icons.js` - Script Node.js que genera les icones PNG
- `generate-icons.html` - (Obsolet) Eina antiga basada en canvas, ja no és necessària

## Notes tècniques

L'script utilitza la llibreria `sharp` per convertir SVG a PNG amb alta qualitat. Això garanteix que les icones es veuen nítides a totes les mides.
