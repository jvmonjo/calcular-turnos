const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Mides de les icones a generar
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Rutes
const inputSvg = path.join(__dirname, 'icon.svg');
const outputDir = __dirname;

async function generateIcons() {
  console.log('🎨 Generant icones a partir de icon.svg...\n');

  // Verificar que el fitxer SVG existeix
  if (!fs.existsSync(inputSvg)) {
    console.error(`❌ Error: No s'ha trobat el fitxer ${inputSvg}`);
    process.exit(1);
  }

  // Generar cada icona
  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);

    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputFile);

      console.log(`✅ Generada: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generant icon-${size}x${size}.png:`, error.message);
    }
  }

  console.log('\n🎉 Generació d\'icones completada!');
}

// Executar
generateIcons().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
