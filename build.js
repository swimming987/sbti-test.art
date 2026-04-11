const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const TMPL = path.join(ROOT, 'templates');
const DATA = path.join(ROOT, 'data');
const SITE_URL = 'https://sbti-test.art';

// ── helpers ──────────────────────────────────────────────
function read(f) { return fs.readFileSync(f, 'utf-8'); }
function readJSON(f) { return JSON.parse(read(f)); }
function mkdirp(d) { fs.mkdirSync(d, { recursive: true }); }
function write(f, c) { mkdirp(path.dirname(f)); fs.writeFileSync(f, c, 'utf-8'); }

function slugify(code) {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/,'');
}

// Simple template engine: {{key}}, {{key.sub}}, {{#each items}}...{{/each}}, {{#if val}}...{{/if}}

// Find matching closing tag handling nesting
function findMatchingClose(template, openTag, closeTag, startPos) {
  let depth = 1;
  let pos = startPos;
  while (pos < template.length && depth > 0) {
    const nextOpen = template.indexOf(openTag, pos);
    const nextClose = template.indexOf(closeTag, pos);
    if (nextClose === -1) return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + openTag.length;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      pos = nextClose + closeTag.length;
    }
  }
  return -1;
}

function render(template, data) {
  // Handle partials {{> name}}
  template = template.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
    const partialFile = path.join(TMPL, 'partials', `${name}.html`);
    if (fs.existsSync(partialFile)) return read(partialFile);
    return '';
  });

  // Handle {{#each key}}...{{/each}} with nesting support
  let eachRe = /\{\{#each\s+([\w.]+)\s*\}\}/;
  let match;
  while ((match = eachRe.exec(template)) !== null) {
    const key = match[1];
    const bodyStart = match.index + match[0].length;
    const bodyEnd = findMatchingClose(template, '{{#each', '{{/each}}', bodyStart);
    if (bodyEnd === -1) break;
    const body = template.substring(bodyStart, bodyEnd);
    const arr = resolve(data, key);
    let replacement = '';
    if (Array.isArray(arr)) {
      replacement = arr.map((item, index) => {
        const ctx = typeof item === 'object' ? { ...data, ...item, '@index': index } : { ...data, '.': item, '@index': index };
        return render(body, ctx);
      }).join('');
    }
    template = template.substring(0, match.index) + replacement + template.substring(bodyEnd + '{{/each}}'.length);
  }

  // Handle {{#if key}}...{{else}}...{{/if}} with nesting support
  let ifRe = /\{\{#if\s+([\w.]+)\s*\}\}/;
  while ((match = ifRe.exec(template)) !== null) {
    const key = match[1];
    const bodyStart = match.index + match[0].length;
    const bodyEnd = findMatchingClose(template, '{{#if', '{{/if}}', bodyStart);
    if (bodyEnd === -1) break;
    const body = template.substring(bodyStart, bodyEnd);
    const val = resolve(data, key);
    const parts = body.split('{{else}}');
    let replacement;
    if (val) {
      replacement = render(parts[0], data);
    } else {
      replacement = parts[1] ? render(parts[1], data) : '';
    }
    template = template.substring(0, match.index) + replacement + template.substring(bodyEnd + '{{/if}}'.length);
  }

  // Handle {{.}} for current item in each loops
  template = template.replace(/\{\{\.\}\}/g, () => {
    const val = data['.'];
    return val !== undefined && val !== null ? String(val) : '';
  });

  // Handle {{key}} and {{key.sub.sub}}
  template = template.replace(/\{\{([\w.@]+)\}\}/g, (_, key) => {
    const val = resolve(data, key);
    return val !== undefined && val !== null ? String(val) : '';
  });

  return template;
}

function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
}

// Replace Unicode curly quotes in all string values within an object
function replaceCurlyQuotes(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/"/g, '"').replace(/"/g, '"');
  } else if (Array.isArray(obj)) {
    return obj.map(replaceCurlyQuotes);
  } else if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      result[key] = replaceCurlyQuotes(obj[key]);
    }
    return result;
  }
  return obj;
}

// Safe JSON stringify for embedding in HTML <script> tags
function safeJSON(obj) {
  const cleaned = replaceCurlyQuotes(obj);
  return JSON.stringify(cleaned)
    .replace(/</g, '\\u003C')  // Prevent </script> injection
    .replace(/>/g, '\\u003E');
}

// ── load data ────────────────────────────────────────────
const typesI18n = readJSON(path.join(DATA, 'types-i18n.json'));
const dimensionsI18n = readJSON(path.join(DATA, 'dimensions-i18n.json'));
const questionsI18n = readJSON(path.join(DATA, 'questions-i18n.json'));

// Extract text for specific language
function extractText(obj, langCode) {
  if (typeof obj === 'string') return obj;
  if (obj && typeof obj === 'object' && obj[langCode]) return obj[langCode];
  if (obj && typeof obj === 'object' && obj['zh-CN']) return obj['zh-CN']; // fallback
  return obj;
}

// Extract questions for a specific language
function getQuestionsForLang(langCode) {
  const translateItem = (item) => {
    const result = { ...item };
    if (item.text) result.text = extractText(item.text, langCode);
    if (item.label) result.label = extractText(item.label, langCode);
    if (item.options) {
      result.options = item.options.map(opt => ({
        ...opt,
        label: extractText(opt.label, langCode)
      }));
    }
    return result;
  };

  return {
    questions: questionsI18n.questions.map(translateItem),
    specialQuestions: questionsI18n.specialQuestions.map(translateItem)
  };
}

// Extract types for a specific language
function getTypesForLang(langCode) {
  const types = {
    types: {},
    images: typesI18n.images,
    normalTypes: typesI18n.normalTypes,
    patternMatches: typesI18n.patternMatches,
    drunkActivation: typesI18n.drunkActivation,
    hhhhFallback: typesI18n.hhhhFallback
  };

  for (const [code, typeData] of Object.entries(typesI18n.types)) {
    types.types[code] = {
      code: typeData.code,
      cn: extractText(typeData.cn, langCode),
      intro: extractText(typeData.intro, langCode),
      desc: extractText(typeData.desc, langCode)
    };
    if (typeData.pattern) {
      types.types[code].pattern = typeData.pattern;
    }
  }

  return types;
}

// Extract dimensions for a specific language
function getDimensionsForLang(langCode) {
  const dimensions = {
    dimensionMeta: {},
    dimensionOrder: dimensionsI18n.dimensionOrder,
    dimExplanations: {}
  };

  for (const [dim, data] of Object.entries(dimensionsI18n.dimensionMeta)) {
    dimensions.dimensionMeta[dim] = {
      name: extractText(data.name, langCode),
      model: extractText(data.model, langCode)
    };
  }

  for (const [dim, levels] of Object.entries(dimensionsI18n.dimExplanations)) {
    dimensions.dimExplanations[dim] = {};
    for (const [level, text] of Object.entries(levels)) {
      dimensions.dimExplanations[dim][level] = extractText(text, langCode);
    }
  }

  return dimensions;
}

const LANGS = [
  { code: 'zh-CN', dir: '', file: 'zh-CN.json' },
  { code: 'zh-TW', dir: 'zh-TW', file: 'zh-TW.json' },
  { code: 'en', dir: 'en', file: 'en.json' }
];

const i18n = {};
for (const lang of LANGS) {
  i18n[lang.code] = readJSON(path.join(DATA, 'i18n', lang.file));
}

// ── load templates ───────────────────────────────────────
const templates = {};
const templateFiles = ['index', 'test', 'result', 'types', 'type-detail', 'about', 'faq', 'privacy-policy', 'terms-of-service', 'cookie-policy'];
for (const name of templateFiles) {
  const f = path.join(TMPL, `${name}.html`);
  if (fs.existsSync(f)) templates[name] = read(f);
}

// ── copy static assets ───────────────────────────────────
function copyDir(src, dest) {
  mkdirp(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    try {
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (err) {
      if (err.code === 'EPERM') {
        console.warn(`  ⚠ Skipped ${path.relative(ROOT, srcPath)} (file in use)`);
      } else {
        throw err;
      }
    }
  }
}

// ── build pages ──────────────────────────────────────────
function buildLang(lang) {
  const t = i18n[lang.code];
  const prefix = lang.dir ? `/${lang.dir}` : '';
  const distDir = lang.dir ? path.join(DIST, lang.dir) : DIST;

  // Get language-specific data
  const questions = getQuestionsForLang(lang.code);
  const types = getTypesForLang(lang.code);
  const dimensions = getDimensionsForLang(lang.code);

  // Common template data
  const common = {
    ...t,
    langCode: lang.code,
    prefix,
    siteUrl: SITE_URL,
    currentYear: new Date().getFullYear(),
    // Language alternates for hreflang
    altLangs: LANGS.map(l => ({
      code: l.code,
      dir: l.dir,
      name: i18n[l.code].langName,
      isCurrent: l.code === lang.code ? 'true' : ''
    })),
    // Type slugs for nav
    typesList: Object.values(types.types).map(tp => ({
      code: tp.code,
      cn: tp.cn,
      slug: slugify(tp.code),
      intro: tp.intro,
      image: types.images[tp.code] || '',
      desc: tp.desc.substring(0, 80) + '...'
    }))
  };

  // Inject questions/types/dimensions as JSON for test.js
  const dataJSON = {
    questionsJSON: safeJSON(questions.questions),
    specialQuestionsJSON: safeJSON(questions.specialQuestions),
    typesJSON: safeJSON(types.types),
    imagesJSON: safeJSON(types.images),
    normalTypesJSON: safeJSON(types.normalTypes),
    dimensionsJSON: safeJSON(dimensions),
    testI18nJSON: safeJSON({
      question: t.test.question,
      dimHidden: t.test.dimHidden,
      supplementary: t.test.supplementary,
      hintIncomplete: t.test.hintIncomplete,
      hintComplete: t.test.hintComplete,
      submit: t.test.submit,
      backHome: t.test.backHome
    }),
    resultI18nJSON: safeJSON({
      yourType: t.result.yourType,
      hiddenActivated: t.result.hiddenActivated,
      systemFallback: t.result.systemFallback,
      noteNormal: t.result.noteNormal,
      noteSpecial: t.result.noteSpecial,
      matchHigh: t.result.matchHigh,
      matchDrunk: t.result.matchDrunk,
      matchLow: t.result.matchLow,
      matchPercent: t.result.matchPercent,
      matchDrunkBadge: t.result.matchDrunkBadge,
      matchLowBadge: t.result.matchLowBadge,
      shareCopied: t.result.shareCopied,
      expand: t.result.expand,
      collapse: t.result.collapse,
      analysisTitle: t.result.analysisTitle,
      dimTitle: t.result.dimTitle,
      noteTitle: t.result.noteTitle,
      authorTitle: t.result.authorTitle,
      authorP1: t.result.authorP1,
      authorP2: t.result.authorP2,
      authorP3: t.result.authorP3,
      authorP4: t.result.authorP4,
      restart: t.result.restart,
      backHome: t.result.backHome,
      shareLink: t.result.shareLink,
      share: t.result.share,
      yourType: t.result.yourType,
      hiddenActivated: t.result.hiddenActivated,
      systemFallback: t.result.systemFallback,
      matchHigh: t.result.matchHigh,
      matchDrunk: t.result.matchDrunk,
      matchLow: t.result.matchLow,
      matchPercent: t.result.matchPercent,
      matchDrunkBadge: t.result.matchDrunkBadge,
      matchLowBadge: t.result.matchLowBadge,
      shareCopied: t.result.shareCopied
    })
  };

  // 1. Index page
  if (templates['index']) {
    const html = render(templates['index'], { ...common, ...dataJSON, pageType: 'home' });
    write(path.join(distDir, 'index.html'), html);
  }

  // 2. Test page
  if (templates['test']) {
    const html = render(templates['test'], { ...common, ...dataJSON, pageType: 'test' });
    write(path.join(distDir, 'test', 'index.html'), html);
  }

  // 3. Result page
  if (templates['result']) {
    const html = render(templates['result'], { ...common, ...dataJSON, pageType: 'result' });
    write(path.join(distDir, 'result', 'index.html'), html);
  }

  // 4. Types list page
  if (templates['types']) {
    const html = render(templates['types'], { ...common, pageType: 'types' });
    write(path.join(distDir, 'types', 'index.html'), html);
  }

  // 5. Type detail pages (27 × 3 langs)
  if (templates['type-detail']) {
    for (const tp of Object.values(types.types)) {
      const slug = slugify(tp.code);
      const patternObj = types.normalTypes.find(n => n.code === tp.code);
      const html = render(templates['type-detail'], {
        ...common,
        type: tp,
        typeCode: tp.code,
        typeCn: tp.cn,
        typeIntro: tp.intro,
        typeDesc: tp.desc,
        typeImage: types.images[tp.code] || '',
        typeSlug: slug,
        typePattern: patternObj ? patternObj.pattern : '',
        pageType: 'type-detail'
      });
      write(path.join(distDir, 'types', slug, 'index.html'), html);
    }
  }

  // 6. About page
  if (templates['about']) {
    const html = render(templates['about'], { ...common, pageType: 'about' });
    write(path.join(distDir, 'about', 'index.html'), html);
  }

  // 7. FAQ page
  if (templates['faq']) {
    const html = render(templates['faq'], { ...common, pageType: 'faq' });
    write(path.join(distDir, 'faq', 'index.html'), html);
  }

  // 8. Legal pages
  for (const page of ['privacy-policy', 'terms-of-service', 'cookie-policy']) {
    if (templates[page]) {
      const html = render(templates[page], { ...common, pageType: page });
      write(path.join(distDir, page, 'index.html'), html);
    }
  }

  console.log(`  ✓ ${lang.code}: ${distDir}`);
}

// ── generate sitemap.xml ─────────────────────────────────
function buildSitemap() {
  const pages = ['', '/test', '/types', '/about', '/faq', '/privacy-policy', '/terms-of-service', '/cookie-policy'];
  // Add type detail pages (use zh-CN for type codes)
  const typesZhCN = getTypesForLang('zh-CN');
  for (const tp of Object.values(typesZhCN.types)) {
    pages.push(`/types/${slugify(tp.code)}`);
  }

  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const pg of pages) {
    for (const lang of LANGS) {
      const prefix = lang.dir ? `/${lang.dir}` : '';
      const url = `${SITE_URL}${prefix}${pg}`;
      const priority = pg === '' ? '1.0' : pg === '/test' ? '0.9' : pg.startsWith('/types/') ? '0.7' : '0.6';
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      // hreflang alternates
      for (const alt of LANGS) {
        const altPrefix = alt.dir ? `/${alt.dir}` : '';
        const hreflang = alt.code === 'zh-CN' ? 'zh-Hans' : alt.code === 'zh-TW' ? 'zh-Hant' : alt.code;
        xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${SITE_URL}${altPrefix}${pg}" />\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${pg}" />\n`;
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>\n';
  write(path.join(DIST, 'sitemap.xml'), xml);
  console.log('  ✓ sitemap.xml');
}

// ── generate robots.txt ──────────────────────────────────
function buildRobots() {
  const txt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  write(path.join(DIST, 'robots.txt'), txt);
  console.log('  ✓ robots.txt');
}

// ── main ─────────────────────────────────────────────────
console.log('Building SBTI Test site...\n');

// Clean dist (with better error handling)
if (fs.existsSync(DIST)) {
  try {
    fs.rmSync(DIST, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (err) {
    console.warn('Warning: Could not clean dist folder (files may be in use). Will overwrite existing files.');
  }
}
mkdirp(DIST);

// Copy static assets
copyDir(path.join(ROOT, 'image'), path.join(DIST, 'image'));
if (fs.existsSync(path.join(ROOT, 'css'))) copyDir(path.join(ROOT, 'css'), path.join(DIST, 'css'));
if (fs.existsSync(path.join(ROOT, 'js'))) copyDir(path.join(ROOT, 'js'), path.join(DIST, 'js'));
// Copy logo and favicon
try {
  if (fs.existsSync(path.join(ROOT, 'logo.png'))) fs.copyFileSync(path.join(ROOT, 'logo.png'), path.join(DIST, 'logo.png'));
} catch (err) {
  if (err.code !== 'EPERM') throw err;
  console.warn('  ⚠ Skipped logo.png (file in use)');
}
try {
  if (fs.existsSync(path.join(ROOT, 'favicon.ico'))) fs.copyFileSync(path.join(ROOT, 'favicon.ico'), path.join(DIST, 'favicon.ico'));
} catch (err) {
  if (err.code !== 'EPERM') throw err;
  console.warn('  ⚠ Skipped favicon.ico (file in use)');
}
console.log('  ✓ Static assets copied\n');

// Build all languages
console.log('Building pages:');
for (const lang of LANGS) {
  buildLang(lang);
}

console.log('\nBuilding SEO files:');
buildSitemap();
buildRobots();

// Count output files
let fileCount = 0;
function countFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) countFiles(path.join(dir, entry.name));
    else fileCount++;
  }
}
countFiles(DIST);
console.log(`\n✅ Build complete! ${fileCount} files in dist/`);
