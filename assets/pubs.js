// Shared publications rendering — loaded by index.html and publications.html.
// Data comes from data/publications.json (edit that file to add/update papers).

let _sortedPubs = [];

async function renderPublications(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const resp = await fetch('data/publications.json');
  const pubs = await resp.json();
  _sortedPubs = pubs.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  container.innerHTML = _sortedPubs.map((pub, i) => {
    const links = [
      pub.abstract    ? `<button class="btn-link" onclick="toggleAbstract(this)">Abstract</button>` : '',
      pub.pdf_link    ? `<a class="btn-link" href="${pub.pdf_link}" target="_blank" rel="noopener">PDF</a>` : '',
      pub.bibtex      ? `<button class="btn-link" onclick="copyBibtex(${i}, this)">BibTeX</button>` : '',
      pub.github_repo ? `<a class="btn-link" href="${pub.github_repo}" target="_blank" rel="noopener">Code</a>` : '',
      pub.poster      ? `<a class="btn-link" href="${pub.poster}" target="_blank" rel="noopener">Poster</a>` : '',
      pub.video       ? `<a class="btn-link" href="${pub.video}" target="_blank" rel="noopener">Video</a>` : '',
    ].filter(Boolean).join('');

    return `
      <li class="pub">
        <div class="title">${pub.title}
          <span class="badge">${pub.venue}</span>
        </div>
        <div class="meta">${pub.authors.join(', ')}</div>
        <div class="pub-links">${links}</div>
        ${pub.abstract ? `<div class="abstract-body" hidden><p>${pub.abstract}</p></div>` : ''}
      </li>`;
  }).join('');
}

function toggleAbstract(btn) {
  const body = btn.closest('.pub').querySelector('.abstract-body');
  const opening = body.hidden;
  body.hidden = !opening;
  btn.textContent = opening ? 'Hide Abstract' : 'Abstract';
  btn.classList.toggle('active', opening);
}

function copyBibtex(i, btn) {
  navigator.clipboard.writeText(_sortedPubs[i].bibtex).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}
