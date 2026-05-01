import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = process.env.SITE_URL || 'https://aarenor.github.io/tehisabiline/';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const failures = [];

function assert(condition, message) {
    if (!condition) failures.push(message);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tagWithAttr(tagName, attr, value) {
    const pattern = new RegExp(`<${tagName}\\s+[^>]*\\b${attr}=["']${escapeRegExp(value)}["'][^>]*>`, 'i');
    return html.match(pattern)?.[0] || '';
}

function attrValue(tag, attr) {
    return tag.match(new RegExp(`\\b${attr}=["']([^"']+)["']`, 'i'))?.[1] || '';
}

function metaValue(key) {
    const tag = tagWithAttr('meta', 'name', key) || tagWithAttr('meta', 'property', key);
    return attrValue(tag, 'content');
}

function localPathExists(pathname) {
    const cleanPath = pathname.replace(/^\/tehisabiline\//, '').replace(/^\.\//, '');
    return existsSync(join(root, decodeURIComponent(cleanPath)));
}

const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || '';
const description = metaValue('description');
const canonical = attrValue(tagWithAttr('link', 'rel', 'canonical'), 'href');

assert(title.length >= 30 && title.length <= 70, 'Title should be descriptive and stay within search-result length.');
assert(description.length >= 90 && description.length <= 165, 'Meta description should be clear and within search-result length.');
assert(canonical === siteUrl, `Canonical URL should be ${siteUrl}.`);
assert(attrValue(tagWithAttr('link', 'rel', 'alternate'), 'hreflang') === 'et', 'Estonian hreflang alternate link is missing.');
assert(metaValue('robots').includes('max-image-preview:large'), 'Robots meta should allow large image previews.');

for (const key of ['og:type', 'og:locale', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) {
    assert(Boolean(metaValue(key)), `${key} metadata is missing.`);
}

const ogImage = metaValue('og:image');
assert(metaValue('og:url') === siteUrl, 'og:url should match the canonical URL.');
assert(ogImage.startsWith(siteUrl), 'og:image should use an absolute URL.');
if (ogImage) {
    assert(localPathExists(new URL(ogImage).pathname), 'og:image should point to a committed local asset.');
}
assert(metaValue('twitter:card') === 'summary_large_image', 'Twitter card should use summary_large_image.');
assert(Boolean(metaValue('twitter:title')), 'twitter:title is missing.');
assert(Boolean(metaValue('twitter:description')), 'twitter:description is missing.');
assert(Boolean(metaValue('twitter:image')), 'twitter:image is missing.');

const jsonLdBlocks = [...html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map(match => match[1].trim());
assert(jsonLdBlocks.length > 0, 'JSON-LD structured data block is missing.');

for (const block of jsonLdBlocks) {
    try {
        const data = JSON.parse(block);
        const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
        const types = graph.flatMap(item => Array.isArray(item['@type']) ? item['@type'] : [item['@type']]);
        assert(types.includes('Organization') || types.includes('LocalBusiness'), 'JSON-LD should describe the business.');
        assert(types.includes('WebSite'), 'JSON-LD should describe the website.');
        assert(types.includes('Service'), 'JSON-LD should describe the services.');
    } catch (error) {
        failures.push(`JSON-LD should be valid JSON: ${error.message}`);
    }
}

for (const requiredFile of ['robots.txt', 'sitemap.xml', 'site.webmanifest', '.nojekyll']) {
    assert(existsSync(join(root, requiredFile)), `${requiredFile} is missing.`);
}

if (existsSync(join(root, 'robots.txt'))) {
    const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
    assert(robots.includes(`Sitemap: ${siteUrl}sitemap.xml`), 'robots.txt should point at the sitemap.');
}

if (existsSync(join(root, 'sitemap.xml'))) {
    const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
    assert(sitemap.includes(`<loc>${siteUrl}</loc>`), 'sitemap.xml should include the canonical homepage.');
}

if (existsSync(join(root, 'site.webmanifest'))) {
    try {
        const manifest = JSON.parse(readFileSync(join(root, 'site.webmanifest'), 'utf8'));
        assert(manifest.name === 'Tehisabiline ÕF', 'Manifest should use the full site name.');
        assert(manifest.lang === 'et', 'Manifest language should be Estonian.');
        assert(manifest.start_url === '/tehisabiline/', 'Manifest start_url should match GitHub Pages path.');
        assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'Manifest should define favicon icons.');
        for (const icon of manifest.icons || []) {
            assert(localPathExists(icon.src), `Manifest icon does not exist: ${icon.src}`);
        }
    } catch (error) {
        failures.push(`site.webmanifest should be valid JSON: ${error.message}`);
    }
}

if (failures.length) {
    console.error(`SEO check failed with ${failures.length} issue(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
}

console.log('SEO check passed.');
