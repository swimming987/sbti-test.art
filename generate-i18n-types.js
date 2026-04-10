const fs = require('fs');
const path = require('path');
const OpenCC = require('opencc-js');

// Initialize converters
const s2t = OpenCC.Converter({ from: 'cn', to: 'tw' }); // Simplified to Traditional
const s2hk = OpenCC.Converter({ from: 'cn', to: 'hk' }); // Can use tw or hk

// Read source files
const types = JSON.parse(fs.readFileSync('./data/types.json', 'utf-8'));
const dimensions = JSON.parse(fs.readFileSync('./data/dimensions.json', 'utf-8'));

// Helper function to create i18n version of text fields
function createI18nText(zhCNText) {
  return {
    'zh-CN': zhCNText,
    'zh-TW': s2t(zhCNText),
    'en': zhCNText // Placeholder - needs manual translation
  };
}

// Convert types to i18n format
const typesI18n = {
  types: {},
  images: types.images,
  normalTypes: types.normalTypes,
  patternMatches: types.patternMatches,
  drunkActivation: types.drunkActivation,
  hhhhFallback: types.hhhhFallback
};

for (const [code, typeData] of Object.entries(types.types)) {
  typesI18n.types[code] = {
    code: typeData.code,
    cn: createI18nText(typeData.cn),
    intro: createI18nText(typeData.intro),
    desc: createI18nText(typeData.desc)
  };
  
  // Add pattern if exists
  if (typeData.pattern) {
    typesI18n.types[code].pattern = typeData.pattern;
  }
}

// Convert dimensions to i18n format
const dimensionsI18n = {
  dimensionMeta: {},
  dimensionOrder: dimensions.dimensionOrder,
  dimExplanations: {}
};

for (const [dim, data] of Object.entries(dimensions.dimensionMeta)) {
  dimensionsI18n.dimensionMeta[dim] = {
    name: createI18nText(data.name),
    model: createI18nText(data.model)
  };
}

for (const [dim, levels] of Object.entries(dimensions.dimExplanations)) {
  dimensionsI18n.dimExplanations[dim] = {};
  for (const [level, text] of Object.entries(levels)) {
    dimensionsI18n.dimExplanations[dim][level] = createI18nText(text);
  }
}

// Write i18n files
fs.writeFileSync(
  './data/types-i18n.json',
  JSON.stringify(typesI18n, null, 2),
  'utf-8'
);

fs.writeFileSync(
  './data/dimensions-i18n.json',
  JSON.stringify(dimensionsI18n, null, 2),
  'utf-8'
);

console.log('✅ Generated types-i18n.json and dimensions-i18n.json');
console.log('⚠️  Note: English translations are placeholders. Please update manually or use a translation service.');
