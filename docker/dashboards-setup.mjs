// Runs after Dashboards is healthy, including before the CVs have been loaded.
const baseUrl = process.env.DASHBOARDS_URL || 'http://dashboards:5601';
const patternId = 'cvs';

async function request(path, body) {
  return fetch(`${baseUrl}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', 'osd-xsrf': 'true' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
}

async function requireSuccess(response) {
  if (!response.ok) {
    throw new Error(`Dashboards returned HTTP ${response.status}: ${await response.text()}`);
  }
}

const path = `/api/saved_objects/index-pattern/${patternId}`;
const existing = await request(path);
if (existing.status === 404) {
  // Leave fields uncached so Discover fetches the mapping after CV ingestion.
  // No timeFieldName: CVs have no timestamp and need no time filter.
  const created = await request(path, { attributes: { title: 'cvs' } });
  // Another setup invocation may have created the same pattern meanwhile.
  if (created.status !== 409) await requireSuccess(created);
  console.log('Created cvs index pattern.');
} else {
  await requireSuccess(existing);
  console.log('cvs index pattern already exists.');
}

await requireSuccess(await request('/api/opensearch-dashboards/settings', {
  changes: { defaultIndex: patternId },
}));
console.log('Set cvs as the default index pattern.');
