// scripts/update-dashboard.js
// Fetches simple metrics from GitHub API and updates the dashboard block in README.md

const fs = require('fs');
const path = require('path');
const https = require('https');

const USERNAME = 'SaumilP';
const README_PATH = path.join(__dirname, '..', 'README.md');
const START_MARKER = '<!-- DASHBOARD:START -->';
const END_MARKER = '<!-- DASHBOARD:END -->';

function githubRequest(pathname, token) {
  const options = {
    hostname: 'api.github.com',
    path: pathname,
    headers: {
      'User-Agent': 'dashboard-script',
      'Accept': 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  return new Promise((resolve, reject) => {
    https
      .get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            console.error('GitHub API error:', res.statusCode, data);
            reject(new Error(`GitHub API error: ${res.statusCode}`));
          }
        });
      })
      .on('error', reject);
  });
}

async function fetchMetrics(token) {
  // 1. Public repos
  const user = await githubRequest(`/users/${USERNAME}`, token);
  const publicRepos = user.public_repos ?? 'N/A';

  // 2. Recent events (approx last activity)
  const events = await githubRequest(`/users/${USERNAME}/events/public?per_page=1`, token);
  let recentActivity = 'No recent public activity';
  if (Array.isArray(events) && events.length > 0) {
    const evt = events[0];
    const type = evt.type || 'Event';
    const repoName = evt.repo?.name || 'unknown repo';
    const date = evt.created_at ? new Date(evt.created_at).toISOString().split('T')[0] : 'unknown date';
    recentActivity = `${type} on ${repoName} (${date})`;
  }

  const lastUpdated = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

  return { publicRepos, recentActivity, lastUpdated };
}

function updateReadme(metrics) {
  const { publicRepos, recentActivity, lastUpdated } = metrics;
  const readme = fs.readFileSync(README_PATH, 'utf8');

  const startIndex = readme.indexOf(START_MARKER);
  const endIndex = readme.indexOf(END_MARKER);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Dashboard markers not found in README.md');
  }

  const before = readme.substring(0, startIndex + START_MARKER.length);
  const after = readme.substring(endIndex);

  const table = `
| Metric | Value |
|--------|-------|
| 🚀 Repositories (public) | ${publicRepos} |
| 🌱 Recent Activity | ${recentActivity} |
| 🧪 Last Updated | ${lastUpdated} |
`.trim();

  const newContent = `${before}
${table}
${after}`;

  fs.writeFileSync(README_PATH, newContent, 'utf8');
  console.log('README.md dashboard section updated.');
}

async function main() {
  try {
    const token = process.env.GH_DASHBOARD_TOKEN || process.env.GITHUB_TOKEN;
    const metrics = await fetchMetrics(token);
    updateReadme(metrics);
  } catch (err) {
    console.error('Error updating dashboard:', err);
    process.exit(1);
  }
}

main();
