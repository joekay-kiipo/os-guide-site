/* Designing Inclusive Digital Solutions — open-source guide.
 *
 * A dependency-free SPA that renders the Markdown sources in docs/ at runtime.
 * Structure, copy and tokens follow the "Designing Inclusive Digital Solutions"
 * design canvas; routing, figures and responsive behaviour are the code-side
 * completions of it (see README).
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------ DOM helper */

  function add(parent, kid) {
    if (kid === null || kid === undefined || kid === false || kid === true) return;
    if (Array.isArray(kid)) { kid.forEach(function (k) { add(parent, k); }); return; }
    parent.appendChild(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }

  function h(tag, props) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, String(v));
      });
    }
    for (var i = 2; i < arguments.length; i++) add(node, arguments[i]);
    return node;
  }

  function icon(cls) { return h('i', { class: cls, 'aria-hidden': 'true' }); }

  function fill(host, content) {
    host.textContent = '';
    add(host, content);
  }

  var $ = function (sel) { return document.querySelector(sel); };

  /* ------------------------------------------------------------------ data */

  var SECTIONS = [
    { n: 1, tag: 'Context', title: 'Introduction and Background', desc: 'What the project set out to do, how it ran, and the coding scheme used throughout.' },
    { n: 2, tag: 'Context', title: 'Understanding the Users', desc: 'Who the entrepreneurs are, region by region, and how digital readiness varies.' },
    { n: 3, tag: 'Standing reference', title: 'Principles for Gender-Responsive Design', desc: 'Principles to design against, with field evidence for each.' },
    { n: 4, tag: 'Method', title: 'UI/UX Design Best Practices', desc: 'The full method: Part A for existing products, Part B for new ideas.' },
    { n: 5, tag: 'Evidence', title: 'Insights and Learnings', desc: 'What worked, what did not, and why — the evidence behind the findings.' },
    { n: 6, tag: 'Standing reference', title: 'Open-Source Toolkit and Resources', desc: 'Templates, scripts and checklists you can copy and run with.' },
    { n: 7, tag: 'Standing reference', title: 'Recommendations', desc: 'What hubs, providers and funders should do differently next.' },
    { n: 8, tag: 'Method', title: 'Offering User Testing as a Business', desc: 'Pricing, packaging and capacity for hubs turning testing into a service.' },
    { n: 9, tag: 'Governance', title: 'Sustaining the Open-Source Guide', desc: 'How the guide is maintained, licensed and contributed to.' }
  ];

  var SECTION_FILES = [
    '01-introduction', '02-understanding-users', '03-principles', '04-design-practices',
    '05-insights', '06-toolkit', '07-recommendations', '08-business-model', '09-sustaining'
  ];

  var PAGES = [{ id: 'home', kind: 'home', title: 'Overview' }]
    .concat(SECTIONS.map(function (s) {
      return {
        id: 's' + s.n, kind: 'section', n: s.n, tag: s.tag, title: s.title,
        desc: s.desc, file: SECTION_FILES[s.n - 1] + '.md'
      };
    }))
    .concat([
      { id: 'references', kind: 'article', tag: 'About', title: 'References', file: 'references.md' },
      { id: 'acknowledgements', kind: 'article', tag: 'About', title: 'Acknowledgements', file: 'acknowledgements.md' },
      { id: 'disclaimer', kind: 'article', tag: 'About', title: 'Disclaimer', file: 'disclaimer.md' },
      { id: 'imprint', kind: 'article', tag: 'About', title: 'Imprint', file: 'imprint.md' }
    ]);

  var STATS = [
    ['2023–26', 'Three years of project work'],
    ['6', 'Regions across both phases'],
    ['18', 'Existing products adapted, Phase 1'],
    ['12', 'New ideas validated, Phase 2']
  ];

  var ROLES = [
    { label: 'A hub or intermediary new to running user testing', start: 'Section 1 and Section 2', then: 'Section 4, Part A (Steps 1–3); Section 6', icon: 'ph ph-buildings' },
    { label: 'A hub considering offering user testing as a paid service', start: 'Section 8', then: 'Section 4, Part A; Section 6', icon: 'ph ph-currency-circle-dollar' },
    { label: 'A startup or solution provider preparing for user testing', start: 'Section 2', then: 'Section 4, Part A; Section 5', icon: 'ph ph-rocket-launch' },
    { label: 'A designer or developer adapting an existing product', start: 'Section 3 and Section 4, Part A', then: 'Section 5; Section 6', icon: 'ph ph-pen-nib' },
    { label: 'A GIZ, donor, or government stakeholder reviewing project results', start: 'Section 1 and Section 5', then: 'Section 7', icon: 'ph ph-chart-bar' },
    { label: 'Someone designing a new digital product from the ground up', start: 'Section 3 and Section 4, Part B', then: 'Section 6', icon: 'ph ph-lightbulb' },
    { label: 'Anyone wanting to contribute to or maintain this guide', start: 'Section 9', then: 'Section 6', icon: 'ph ph-git-pull-request' }
  ];

  var DAYS = [
    {
      tab: 'Day 1 · Prepare', title: 'Prepare', label: 'Day 1',
      deeper: 'Section 4, Part A/B, Step 1 · Screening Template (Section 6.5)',
      items: [
        'Define 3 to 5 concrete tasks you want participants to attempt.',
        'Confirm the solution or prototype works end to end.',
        'Write your screening questions.'
      ]
    },
    {
      tab: 'Day 2 · Recruit', title: 'Recruit and set logistics', label: 'Day 2',
      deeper: 'Section 4, Step 2',
      items: [
        'Confirm 5 to 8 people who match your target user profile — not staff, not friends, not anyone already familiar with the product.',
        'Book times and places.',
        'Line up a note-taker.'
      ]
    },
    {
      tab: 'Day 3–4 · Conduct', title: 'Conduct sessions', label: 'Day 3 to 4',
      deeper: 'Section 4, Step 3',
      items: [
        'Run 45 to 60 minute sessions.',
        'One person leads, one takes notes.',
        'Debrief 10 minutes after each session.'
      ]
    },
    {
      tab: 'Day 5 · Analyse', title: 'Analyse and share', label: 'Day 5',
      deeper: 'Section 4, Step 3 · Templates in Sections 6.5 and 6.6',
      items: [
        'Group notes by theme.',
        'Pick the top 3 to 5 issues.',
        'Send them to the provider.'
      ]
    }
  ];

  var CHECK_TEXTS = [
    'Access to the solution or prototype you’re testing (working login, test account, or clickable prototype)',
    'At least 5 people who match your target user profile: not staff, not friends, not anyone already familiar with the product',
    'A quiet space to run sessions, in person or by phone',
    'A way to take notes during the session (paper, phone, laptop — whatever you’ll actually use consistently)',
    'Permission from each participant to take notes on the session (see the Screening Template for the wording)'
  ];

  var FINDINGS = [
    ['01', 'Trust, not technical sophistication, was the biggest driver of adoption',
      'A small, verifiable promise — a fixed password flow, a specific booking time — did more for uptake than any amount of feature depth.', 'Section 5.6'],
    ['02', 'Language and literacy were the highest-leverage fixes available',
      'Solutions tested in participants’ first language consistently produced more honest feedback and higher task completion than English-only equivalents.', 'Section 5.2'],
    ['03', 'Small, evidence-backed changes consistently beat large redesigns',
      'The clearest documented improvement in the project came from one targeted fix, not a rebuild.', 'Section 5.4'],
    ['04', 'Accessibility fixes helped everyone, not just the group they targeted',
      'Larger text, simplified navigation and voice guidance measurably benefited users with no stated accessibility need.', 'Sections 3.3, 5.5'],
    ['05', 'Co-creation only improved products where providers could act on findings',
      'Provider readiness turned out to matter as much as the quality of the research itself.', 'Sections 5.4, 5.7'],
    ['06', 'The same principles held across two very different tracks',
      'Adapting eighteen existing products and validating twelve new ideas before they fully existed — despite different constraints, pace, and starting points.', 'Section 5.6']
  ];

  // [step number, title, section reference]
  var PHASE1 = [
    ['1', 'Project Start', 'Sections 3 & 4'],
    ['2', 'Recruitment & Research', 'Section 4, Part A, Step 1'],
    ['3', 'Co-creation', 'Section 4, Part A, Step 2'],
    ['4', 'Validation', 'Section 4, Part A, Step 3']
  ];
  var PHASE2 = [
    ['5', 'Ideation', 'Section 4, Part B, Step 1'],
    ['6', 'Incubation & Prototyping', 'Section 4, Part B, Step 2'],
    ['7', 'Validation', 'Section 4, Part B, Step 3']
  ];

  /* ----------------------------------------------------------------- state */

  var state = {
    pageId: 'home',
    anchor: null,
    copied: false,
    dark: true,
    roleIdx: 0,
    dayIdx: 0,
    checks: [true, false, false, false, false],
    docs: {},
    panelOpen: false,
    searchOpen: false,
    q: '',
    selIdx: 0,
    guideOpen: null
  };

  var searchIndex = [];
  var copyTimer = null;

  function pageById(id) {
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === id) return PAGES[i];
    return null;
  }

  function currentPage() { return pageById(state.pageId) || PAGES[0]; }

  /* -------------------------------------------------------------- scrolling */

  function smoothTo(top) {
    // Animation frames are throttled while the tab is hidden — jump instead of stalling.
    if (document.visibilityState === 'hidden'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, top);
      return;
    }
    var start = window.scrollY;
    var dist = top - start;
    var dur = Math.min(600, Math.max(250, Math.abs(dist) * 0.35));
    var t0 = performance.now();
    var ease = function (x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
    var step = function (now) {
      var p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function scrollToId(id) {
    var node = document.getElementById(id);
    if (node) smoothTo(node.getBoundingClientRect().top + window.scrollY - 88);
  }

  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }

  function scrollToAnchor(anchor, tries) {
    var key = norm(anchor);
    var nodes = document.querySelectorAll('[data-anchor]');
    for (var i = 0; i < nodes.length; i++) {
      if (norm(nodes[i].getAttribute('data-anchor')) === key) {
        smoothTo(nodes[i].getBoundingClientRect().top + window.scrollY - 88);
        return;
      }
    }
    if (document.getElementById(anchor)) { scrollToId(anchor); return; }
    if ((tries || 0) < 12) setTimeout(function () { scrollToAnchor(anchor, (tries || 0) + 1); }, 250);
  }

  function scrollToSection(num, tries) {
    var rx = new RegExp('^' + num.split('.').join('[-.]') + '(?!\\d)');
    var nodes = document.querySelectorAll('[data-anchor]');
    for (var i = 0; i < nodes.length; i++) {
      if (rx.test(String(nodes[i].getAttribute('data-anchor')))) {
        smoothTo(nodes[i].getBoundingClientRect().top + window.scrollY - 88);
        return;
      }
    }
    if ((tries || 0) < 12) setTimeout(function () { scrollToSection(num, (tries || 0) + 1); }, 250);
  }

  function updateBackToTop() {
    var btn = $('#back-to-top');
    if (!btn) return;
    var visible = window.scrollY > 480;
    btn.classList.toggle('is-visible', visible);
    btn.setAttribute('aria-hidden', visible ? 'false' : 'true');
    btn.setAttribute('tabindex', visible ? '0' : '-1');
  }

  /* ------------------------------------------------------------- navigation */

  function go(id, anchor) {
    var next = '#/' + id + (anchor ? '/' + anchor : '');
    if (location.hash === next) applyRoute(id, anchor);
    else location.hash = next;
  }

  function goSection(num) {
    var pid = 's' + num.split('.')[0];
    var sub = num.indexOf('.') > 0 ? num : null;
    if (pid === state.pageId) {
      if (sub) scrollToSection(sub);
      else window.scrollTo({ top: 0 });
      return;
    }
    go(pid);
    if (sub) setTimeout(function () { scrollToSection(sub); }, 200);
  }

  function parseHash() {
    var raw = String(location.hash || '').replace(/^#\/?/, '');
    if (!raw) return { id: 'home', anchor: null };
    var bits = raw.split('/');
    var id = decodeURIComponent(bits[0]);
    if (!pageById(id)) return { id: 'home', anchor: decodeURIComponent(raw) };
    return { id: id, anchor: bits.length > 1 ? decodeURIComponent(bits.slice(1).join('/')) : null };
  }

  function applyRoute(id, anchor) {
    var changedPage = state.pageId !== id;
    state.pageId = id;
    state.anchor = anchor || null;
    state.copied = false;
    if (/^s\d/.test(id)) state.guideOpen = true;
    closeNavDrawer();
    loadDoc(id);
    render();
    if (changedPage || !anchor) window.scrollTo({ top: 0 });
    if (anchor) setTimeout(function () { scrollToAnchor(anchor, 0); }, 120);
  }

  /* ----------------------------------------------------------- markdown i/o */

  function docPath(file) { return 'docs/' + file + '?v=29'; }

  function loadDoc(id) {
    var p = pageById(id);
    if (!p || !p.file || state.docs[p.file]) return;
    fetch(docPath(p.file))
      .then(function (r) {
        if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
        return r.text();
      })
      .then(function (md) {
        state.docs[p.file] = parseDoc(md);
        if (state.pageId === id) render();
      })
      .catch(function () {
        state.docs[p.file] = { error: true, title: p.title, desc: '', blocks: [], toc: [], raw: '' };
        if (state.pageId === id) render();
      });
  }

  /* -------------------------------------------------------- markdown parsing */

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function mkLink(text, href) {
    var children = parseInline(text);
    var m = href.match(/^(?:\.\/)?([\w-]+?)(?:\.md|\/+)(?:#([\w.-]+))?$/) || href.match(/^(?:\.\/)?([\w-]+)$/);
    if (m) {
      var page = null;
      for (var i = 0; i < PAGES.length; i++) if (PAGES[i].file === m[1] + '.md') page = PAGES[i];
      var anchor = m[2];
      if (page) {
        return h('a', {
          href: '#/' + page.id + (anchor ? '/' + anchor : ''),
          onclick: function (e) {
            e.preventDefault();
            if (page.id === state.pageId) { if (anchor) scrollToAnchor(anchor); }
            else go(page.id, anchor);
          }
        }, children);
      }
    }
    if (href.charAt(0) === '#') {
      return h('a', {
        href: href,
        onclick: function (e) { e.preventDefault(); scrollToAnchor(href.slice(1)); }
      }, children);
    }
    if (href.indexOf('http') === 0) {
      return h('a', { href: href, target: '_blank', rel: 'noreferrer' }, children);
    }
    if (href.indexOf('mailto:') === 0) {
      return h('a', { href: href }, children);
    }
    return h('span', null, children);
  }

  /* Turns "Section 4" / "Sections 5.4, 5.7" in running copy into live links. */
  function linkSections(str) {
    var out = [];
    var s = String(str);
    var num = '\\d{1,2}(?:\\.\\d+){0,2}';
    var sep = '\\s*(?:,\\s*and|,|and|&|–|-|to)\\s*';
    var rx = new RegExp('\\bSections?\\s+(' + num + '(?:' + sep + num + ')*)', 'i');
    var isNum = function (x) { return /^\d{1,2}(?:\.\d+){0,2}$/.test(x); };

    var mk = function (label, target) {
      return h('a', {
        class: 'xref',
        href: '#/s' + target.split('.')[0],
        onclick: function (e) { e.preventDefault(); goSection(target); }
      }, label);
    };

    while (s.length) {
      var m = s.match(rx);
      if (!m) { out.push(s); break; }
      if (m.index > 0) out.push(s.slice(0, m.index));
      var word = m[0].slice(0, m[0].length - m[1].length);
      var parts = m[1].split(new RegExp('(' + sep + ')'));
      var nums = parts.filter(isNum);
      var valid = nums.filter(function (x) { return !!pageById('s' + x.split('.')[0]); });
      if (!valid.length) { out.push(m[0]); s = s.slice(m.index + m[0].length); continue; }
      if (nums.length === 1) {
        out.push(mk(word + nums[0], nums[0]));
      } else {
        out.push(word);
        parts.forEach(function (part) {
          if (isNum(part) && valid.indexOf(part) >= 0) out.push(mk(part, part));
          else out.push(part);
        });
      }
      s = s.slice(m.index + m[0].length);
    }
    return out;
  }

  function parseInline(text, opts) {
    var s = String(text)
      .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&rarr;/g, '→')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/<(https?:\/\/[^>\s]+)>/g, '[$1]($1)');
    var out = [];
    var rx = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/;
    while (s.length) {
      var m = s.match(rx);
      if (!m) { out.push.apply(out, linkSections(s)); break; }
      if (m.index > 0) out.push.apply(out, linkSections(s.slice(0, m.index)));
      if (m[1]) out.push(mkLink(m[2], m[3]));
      else if (m[4]) out.push(h('strong', { style: { fontWeight: 600, color: (opts && opts.strongColor) || '' } }, parseInline(m[5], opts)));
      else if (m[6]) out.push(h('em', null, parseInline(m[7], opts)));
      else if (m[8]) out.push(h('code', null, m[9]));
      s = s.slice(m.index + m[0].length);
    }
    return out;
  }

  function admonClass(tone) {
    if (tone === 'tip' || tone === 'success') return 'admon admon--tip';
    if (tone === 'quote' || tone === 'example') return 'admon admon--voice';
    if (tone === 'warning' || tone === 'danger') return 'admon admon--caution';
    return 'admon admon--plain';
  }

  function admonIcon(tone) {
    if (tone === 'tip' || tone === 'success') return 'ph-duotone ph-lightbulb';
    if (tone === 'quote' || tone === 'example') return 'ph-duotone ph-quotes';
    if (tone === 'warning' || tone === 'danger') return 'ph-duotone ph-warning';
    return 'ph-duotone ph-info';
  }

  function parseDoc(md) {
    var lines = md.replace(/\r/g, '').split('\n');
    var blocks = [];
    var title = '';
    var desc = '';
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];
      var m;
      if (!line.trim()) { i++; continue; }

      if ((m = line.match(/^#\s+(.*)/))) {
        title = m[1].trim();
        i++;
        var j = i;
        while (j < lines.length && !lines[j].trim()) j++;
        var sm = (lines[j] || '').match(/^\*([^*].*)\*\s*$/);
        if (sm) { desc = sm[1]; i = j + 1; }
        continue;
      }

      if ((m = line.match(/^(#{2,4})\s+(.*)/))) {
        var text = m[2].trim();
        var id = '';
        var am = text.match(/\{:\s*#([\w.-]+)\s*\}/);
        if (am) { id = am[1]; text = text.replace(am[0], '').trim(); }
        if (!id) id = slug(text);
        blocks.push({ type: m[1].length === 2 ? 'h2' : 'h3', text: text, id: id });
        i++;
        continue;
      }

      if ((m = line.match(/^!!!\s+(\w+)(?:\s+"([^"]*)")?/))) {
        var tone = m[1].toLowerCase();
        i++;
        var paras = [];
        var abuf = [];
        while (i < lines.length) {
          var l = lines[i];
          if (l.indexOf('    ') === 0) { abuf.push(l.trim()); i++; }
          else if (!l.trim()) {
            if (abuf.length) { paras.push(abuf.join(' ')); abuf = []; }
            if (i + 1 < lines.length && lines[i + 1].indexOf('    ') === 0) { i++; } else { i++; break; }
          } else break;
        }
        if (abuf.length) paras.push(abuf.join(' '));
        blocks.push({
          type: 'admon',
          tone: tone,
          title: m[2] || (tone.charAt(0).toUpperCase() + tone.slice(1)),
          paras: paras
        });
        continue;
      }

      if ((m = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/))) {
        blocks.push({ type: 'figure', caption: m[1], src: m[2] });
        i++;
        continue;
      }

      if (line.trim().charAt(0) === '|') {
        var rows = [];
        while (i < lines.length && lines[i].trim().charAt(0) === '|') { rows.push(lines[i].trim()); i++; }
        var parse = function (r) {
          return r.replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
        };
        var headers = parse(rows[0]);
        var body = rows.slice(1);
        if (body[0] && /^[\s|:-]+$/.test(body[0])) body = body.slice(1);
        blocks.push({
          type: 'table',
          hasHeader: headers.some(function (x) { return !!x; }),
          headers: headers,
          rows: body.map(parse)
        });
        continue;
      }

      if (line.charAt(0) === '>') {
        var qbuf = [];
        while (i < lines.length && lines[i].charAt(0) === '>') { qbuf.push(lines[i].replace(/^>\s?/, '').trim()); i++; }
        var qt = qbuf.join(' ').trim();
        if (/^\*[^*]/.test(qt) && /\*$/.test(qt)) qt = qt.slice(1, -1);
        blocks.push({ type: 'quote', text: qt });
        continue;
      }

      if (line.match(/^[-*]\s+/)) {
        var uitems = [];
        while (i < lines.length) {
          var um = lines[i].match(/^[-*]\s+(.*)/);
          if (um) uitems.push(um[1]);
          else if (/^\s{2,}\S/.test(lines[i]) && uitems.length) uitems[uitems.length - 1] += ' ' + lines[i].trim();
          else break;
          i++;
        }
        blocks.push({ type: 'ul', items: uitems });
        continue;
      }

      if (line.match(/^\d+\.\s+/)) {
        var oitems = [];
        while (i < lines.length) {
          var om = lines[i].match(/^\d+\.\s+(.*)/);
          if (om) oitems.push(om[1]);
          else if (/^\s{2,}\S/.test(lines[i]) && oitems.length) oitems[oitems.length - 1] += ' ' + lines[i].trim();
          else break;
          i++;
        }
        blocks.push({ type: 'ol', items: oitems });
        continue;
      }

      if (/^---+\s*$/.test(line.trim())) { i++; continue; }
      if ((m = line.trim().match(/^<div\s+id="(dteg-(?:region-locator|solutions-explorer))"><\/div>$/))) {
        blocks.push({ type: 'embed', id: m[1] });
        i++;
        continue;
      }
      if (/^<.+>\s*$/.test(line.trim())) { i++; continue; }

      var pbuf = [line.trim()];
      i++;
      while (i < lines.length && lines[i].trim() && !/^(#|!\[|!!!|\||>|[-*]\s|\d+\.\s|---|<)/.test(lines[i].trim())) {
        pbuf.push(lines[i].trim());
        i++;
      }
      var raw = pbuf.join(' ');
      blocks.push({ type: 'p', text: raw, lead: /^\*\*[^*]+\*\*/.test(raw) && raw.length < 130 });
    }

    // The design's rail lists h2s only. Several sections carry most of their
    // structure at h3 (Section 4's steps, Section 6's templates), which would
    // leave a two-item rail on a long page — so h3s are listed too, indented.
    var toc = blocks.filter(function (b) { return b.type === 'h2' || b.type === 'h3'; })
      .map(function (b) { return { text: b.text, id: b.id, sub: b.type === 'h3' }; });

    return { title: title, desc: desc, blocks: blocks, toc: toc, raw: md };
  }

  /* ------------------------------------------------------- markdown → nodes */

  function renderBlocks(blocks) {
    var frag = document.createDocumentFragment();
    blocks.forEach(function (b) {
      if (b.type === 'h2' || b.type === 'h3') {
        frag.appendChild(h(b.type, { id: b.id, 'data-anchor': b.id }, b.text));
        return;
      }
      if (b.type === 'p') {
        frag.appendChild(h('p', { class: b.lead ? 'lead' : null },
          parseInline(b.text, b.lead ? { strongColor: 'var(--accent)' } : null)));
        return;
      }
      if (b.type === 'ul' || b.type === 'ol') {
        var checklist = b.type === 'ul' && b.items.every(function (t) { return /^☐\s*/.test(t); });
        frag.appendChild(h(b.type, { class: checklist ? 'checklist' : null }, b.items.map(function (t) {
          if (checklist) {
            var label = t.replace(/^☐\s*/, '');
            return h('li', null,
              h('label', null,
                h('input', { type: 'checkbox' }),
                h('span', null, parseInline(label))));
          }
          return h('li', null, parseInline(t));
        })));
        return;
      }
      if (b.type === 'quote') {
        frag.appendChild(h('blockquote', null, parseInline(b.text, { strongColor: 'var(--accent)' })));
        return;
      }
      if (b.type === 'admon') {
        frag.appendChild(h('div', { class: admonClass(b.tone) },
          h('div', { class: 'admon-head' },
            icon(admonIcon(b.tone)),
            h('div', { class: 'admon-title' }, b.title)),
          h('div', { class: 'admon-body' },
            b.paras.map(function (p) { return h('p', null, parseInline(p)); }))));
        return;
      }
      if (b.type === 'figure') {
        frag.appendChild(h('figure', { class: 'figure' },
          h('div', { class: 'figure-frame' },
            h('img', { src: docPath(b.src), alt: b.caption, loading: 'lazy', decoding: 'async' })),
          h('figcaption', null, b.caption)));
        return;
      }
      if (b.type === 'table') {
        var cols = b.headers.length;
        var isScreeningTemplate = cols === 2
          && String(b.headers[0]).replace(/\*/g, '').trim().toLowerCase() === 'question'
          && String(b.headers[1]).replace(/\*/g, '').trim().toLowerCase() === 'response';
        var isSessionDetails = cols === 2
          && String(b.headers[0]).replace(/\*/g, '').trim().toLowerCase() === 'field'
          && String(b.headers[1]).replace(/\*/g, '').trim().toLowerCase() === 'entry';
        var gridCols = isScreeningTemplate
          ? 'minmax(240px,42%) minmax(0,1fr)'
          : (isSessionDetails
            ? 'minmax(220px,36%) minmax(0,1fr)'
            : (cols === 2 ? 'minmax(120px,180px) 1fr' : 'repeat(' + cols + ',minmax(0,1fr))'));
        var table = h('div', { class: 'tbl' });
        if (b.hasHeader) {
          add(table, h('div', { class: 'tbl-row tbl-head', style: { gridTemplateColumns: gridCols } },
            b.headers.map(function (hd) { return h('div', { class: 'cell' }, parseInline(hd)); })));
        }
        b.rows.forEach(function (r) {
          add(table, h('div', { class: 'tbl-row', style: { gridTemplateColumns: gridCols } },
            r.map(function (c) { return h('div', { class: 'cell' }, parseInline(c)); })));
        });
        frag.appendChild(h('div', { class: 'tablewrap' }, h('div', { class: 'tablescroll' }, table)));
        return;
      }
      if (b.type === 'embed') {
        frag.appendChild(h('div', { id: b.id }));
      }
    });
    return frag;
  }

  /* ------------------------------------------------------------ search index */

  function cleanText(t) {
    return String(t)
      .replace(/\{:\s*#[\w.-]+\s*\}/g, '')
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/!!!\s*\w+/g, '')
      .replace(/[*_`>#|]/g, '')
      .replace(/^[\s—–-]+/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildHomeIndex() {
    [
      ['About this guide', 'about', 'What the project was, who ran it, and how the findings were gathered.'],
      ['How to use this document', 'how-to-use', 'Reading routes by role: hubs, startups, designers, funders and contributors.'],
      ['The project journey, mapped to guide sections', 'journey', 'Phase 1 and Phase 2 stages mapped to the sections that cover them.'],
      ['Key findings at a glance', 'findings', 'Six compressed findings on trust, language, small fixes, accessibility and co-creation.'],
      ['Quick start: first test in 5 days', 'quick-start', 'A five-day plan to prepare, recruit, run and analyse your first usability test.'],
      ['The guide, section by section', 'sections', 'The nine sections of the guide and what each one covers.'],
      ['Licence and contributing', 'licence', 'CC BY 4.0 terms, exclusions, and how to contribute to the guide.']
    ].forEach(function (row) {
      searchIndex.push({
        kind: 'home', pageId: 'home', pageTitle: 'Overview',
        title: row[0], anchor: row[1], body: row[2], weight: 2
      });
    });

    SECTIONS.forEach(function (sec) {
      searchIndex.push({
        kind: 'page', pageId: 's' + sec.n, pageTitle: sec.title, title: sec.title,
        crumb: 'Section ' + sec.n, body: sec.desc + ' ' + sec.tag, weight: 3
      });
    });

    PAGES.filter(function (p) { return p.kind === 'article'; }).forEach(function (p) {
      searchIndex.push({
        kind: 'page', pageId: p.id, pageTitle: p.title, title: p.title,
        crumb: 'About', body: '', weight: 3
      });
    });
  }

  function indexDoc(pg, md) {
    var lines = md.replace(/\r/g, '').split('\n');
    var heading = null;
    var hid = null;
    var buf = [];
    var crumb = pg.kind === 'section' ? 'Section ' + pg.n : pg.title;

    var flush = function () {
      var text = cleanText(buf.join(' '));
      buf = [];
      if (text.length < 24) return;
      searchIndex.push({
        kind: 'text', pageId: pg.id, pageTitle: pg.title,
        title: heading || pg.title, anchor: hid, crumb: crumb, body: text, weight: 0
      });
    };

    lines.forEach(function (ln) {
      var hm = ln.match(/^(#{2,3})\s+(.*)$/);
      if (hm) {
        flush();
        var am = hm[2].match(/\{:\s*#([\w.-]+)\s*\}/);
        heading = cleanText(hm[2]);
        hid = am ? am[1] : slug(heading);
        searchIndex.push({
          kind: 'heading', pageId: pg.id, pageTitle: pg.title,
          title: heading, anchor: hid, crumb: crumb, body: '', weight: 1
        });
        return;
      }
      if (/^\s*$/.test(ln)) { flush(); return; }
      if (/^(---|```)/.test(ln)) return;
      buf.push(ln);
    });
    flush();
  }

  function searchResults() {
    var q = state.q.trim().toLowerCase();
    if (!q) {
      return searchIndex.filter(function (e) { return e.weight >= 2; }).slice(0, 12);
    }
    var terms = q.split(/\s+/).filter(Boolean);
    var out = [];
    searchIndex.forEach(function (e) {
      var t = e.title.toLowerCase();
      var b = (e.body || '').toLowerCase();
      var score = 0;
      var missed = false;
      terms.forEach(function (term) {
        if (t.indexOf(term) === 0) score += 60;
        else if (t.indexOf(term) >= 0) score += 40;
        else if (b.indexOf(term) >= 0) score += 12;
        else missed = true;
      });
      if (missed || !score) return;
      out.push(Object.assign({}, e, { score: score + e.weight * 8 }));
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 24);
  }

  function highlight(text, q) {
    var src = String(text || '');
    var terms = String(q || '').trim().toLowerCase().split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) return [src];
    var rx = new RegExp('(' + terms.map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'ig');
    return src.split(rx).map(function (part) {
      return terms.indexOf(part.toLowerCase()) >= 0 ? h('mark', null, part) : part;
    });
  }

  function snippet(body, q) {
    var src = String(body || '');
    if (!src) return [''];
    var term = String(q || '').trim().toLowerCase().split(/\s+/).filter(Boolean)[0];
    var start = 0;
    if (term) {
      var at = src.toLowerCase().indexOf(term);
      if (at > 60) start = at - 50;
    }
    var cut = src.slice(start, start + 130);
    if (start > 0) cut = '…' + cut;
    if (start + 130 < src.length) cut = cut + '…';
    return highlight(cut, q);
  }

  /* --------------------------------------------------------------- sidebar */

  function navButton(page, label, iconClass) {
    var active = page.id === state.pageId;
    return h('button', {
      class: 'nav-item' + (active ? ' is-active' : ''),
      type: 'button',
      'aria-current': active ? 'page' : null,
      onclick: function () { go(page.id); }
    }, iconClass ? icon(iconClass.replace(/^ph\s+/, 'ph-duotone ')) : null, h('span', null, label));
  }

  // The nav groups, built fresh each call so the same markup can go into both
  // the persistent left sidebar and the home page's below-hero menu.
  function buildNavGroups() {
    var onSection = /^s\d/.test(state.pageId);
    var guideOpen = state.guideOpen === null ? onSection : state.guideOpen;

    var guideToggle = h('button', {
      class: 'nav-item' + (onSection ? ' is-active' : ''),
      type: 'button',
      'aria-expanded': guideOpen ? 'true' : 'false',
      onclick: function () { state.guideOpen = !guideOpen; render(); }
    },
      icon('ph-duotone ph-list-numbers'),
      h('span', null, 'Browse all sections'),
      icon('ph-fill ph-caret-right nav-caret' + (guideOpen ? ' is-open' : '')));

    var subs = guideOpen ? h('div', { class: 'nav-subs' }, SECTIONS.map(function (sec) {
      var act = state.pageId === 's' + sec.n;
      return h('button', {
        class: 'nav-sub' + (act ? ' is-active' : ''),
        type: 'button',
        'aria-current': act ? 'page' : null,
        onclick: function () { go('s' + sec.n); }
      }, h('span', { class: 'num' }, String(sec.n)), h('span', null, sec.title));
    })) : null;

    return [
      h('div', { class: 'nav-group' },
        h('div', { class: 'nav-group-label' }, 'Getting started'),
        h('div', { class: 'nav-list' }, navButton(pageById('home'), 'Overview', 'ph ph-house'))),
      h('div', { class: 'nav-group' },
        h('div', { class: 'nav-group-label' }, 'The guide'),
        h('div', { class: 'nav-list' }, h('div', null, guideToggle, subs))),
      h('div', { class: 'nav-group' },
        h('div', { class: 'nav-group-label' }, 'About'),
        h('div', { class: 'nav-list' },
          navButton(pageById('references'), 'References', 'ph ph-books'),
          navButton(pageById('acknowledgements'), 'Acknowledgements', 'ph ph-heart'),
          navButton(pageById('disclaimer'), 'Disclaimer', 'ph ph-shield-check'),
          navButton(pageById('imprint'), 'Imprint', 'ph ph-file-text')))
    ];
  }

  function renderSidebar() {
    fill($('#sidebar'), buildNavGroups());
  }

  /* ------------------------------------------------------------- home page */

  var photoCache = {};
  function photo(src, alt) {
    if (!photoCache[src]) {
      photoCache[src] = h('img', { src: src, alt: alt, decoding: 'async' });
    }
    return photoCache[src];
  }

  function renderHome() {
    var readyCount = state.checks.filter(Boolean).length;
    var day = DAYS[Math.max(0, state.dayIdx)];

    var heroBg = photo('docs/assets/field-shop-couple.jpg', '');
    heroBg.className = 'hero-full-bg';

    var hero = h('div', { class: 'hero-full' },
      heroBg,
      h('div', { class: 'hero-full-overlay', 'aria-hidden': 'true' }),
      h('div', { class: 'hero-full-inner' },
        h('div', { class: 'hero-full-content' },
          h('div', { class: 'hero-kicker' }, 'First Edition · CC BY 4.0'),
          h('h1', { class: 'hero-full-title' },
            h('span', { class: 'hero-nowrap' }, 'Designing ', h('span', { class: 'hero-mark' }, 'inclusive')),
            h('br'),
            'digital solutions'),
          h('p', { class: 'hero-full-lede' }, 'An open-source UI/UX guide for designing context-aware and gender-responsive digital solutions in Ghana. Built from three years of field testing with informal entrepreneurs.'),
          h('div', { class: 'hero-actions' },
            h('button', { class: 'btn-lg btn-lg--green', type: 'button', onclick: function () { scrollToId('quick-start'); } },
              'Run your first test in 5 days'),
            h('button', { class: 'btn-lg btn-lg--onphoto', type: 'button', onclick: function () { scrollToId('findings'); } },
              'Read the key findings'))),
        h('div', { class: 'hero-stats' }, STATS.map(function (s) {
          return h('div', { class: 'hero-stat' },
            h('div', { class: 'hero-stat-num' }, s[0]),
            h('div', { class: 'hero-stat-label' }, s[1]));
        }))));

    var sectionIndex = h('div', null,
      h('h2', { id: 'sections', style: { marginBottom: '6px' } }, 'The guide, section by section'),
      h('p', { class: 'section-note' }, 'Nine sections, each usable on its own. ',
        linkSections('Sections 3, 6 and 7 are standing references — return to them at any stage of a project.')),
      h('div', { class: 'sec-rows' }, SECTIONS.map(function (s) {
        return h('button', { class: 'sec-row', type: 'button', onclick: function () { go('s' + s.n); } },
          h('span', { class: 'sec-row-num' }, String(s.n)),
          h('span', null,
            h('span', { class: 'sec-row-title' }, s.title),
            h('span', { class: 'sec-row-tag' }, s.tag)),
          h('span', { class: 'sec-row-desc' }, s.desc));
      })));

    var about = h('div', { class: 'about' },
      h('h2', { id: 'about' }, 'About this guide'),
      h('p', { class: 'about-lead' },
        'The Open-Source Guide is the final output of more than three years of work on the project ',
        h('em', null, 'User Testing and Support to the Adaptation of Digital Solutions for Informal Micro-Entrepreneurs'),
        ' (2023–2026). The project, launched by GIZ, was implemented under the Digital Transformation for Inclusive Entrepreneurship in Ghana (DTEG) programme to promote inclusive digital transformation by ensuring that digital solutions are designed around the needs of informal micro-entrepreneurs, particularly women-led enterprises.'),
      h('div', { class: 'about-cols' },
        h('div', null,
          h('p', null, 'Recognizing that many existing digital products fail to address the realities of informal businesses — including low digital literacy, limited connectivity, affordability constraints, and cultural context — the project adopted a user-centred design approach to improve the relevance, accessibility, and adoption of digital technologies.'),
          h('p', null, 'This guide translates strategies and insights from field-based user research, usability testing, innovation and co-creation activities conducted under the project. It synthesizes learnings from across the project, covering the Upper East, Northern, Eastern, and Ashanti regions of Ghana in Phase 1 and extending into Upper West and North East Region in Phase 2 — drawing on validation reports, co-creation records, input submissions, and direct contributions from participating intermediary organizations.')),
        h('div', null,
          h('p', null, 'All findings trace directly to documented project activity. To protect privacy ahead of open-source publication, this edition generalizes and anonymizes examples throughout: no individual participant, staff member, or founder is named. Intermediaries and solutions are referred to by consistent reference codes — for example, “Intermediary N1” and “Solution S1”. ',
            linkSections('Section 1.3 explains the coding scheme.')),
          h('p', null, 'The guide is intended to be practical, honest, and specific. It does not summarize international design literature. It reports what happened in the field: what worked, what did not, and why.'))));

    var howTo = h('div', null,
      h('h2', { id: 'how-to-use' }, 'How to use this document'),
      h('p', { class: 'section-note section-note--body' }, 'Open the row that describes you. ',
        linkSections('Sections 3, 6, and 7 are written as standing references — return to them at any stage of a project.')),
      h('div', { class: 'roles' }, ROLES.map(function (r, i) {
        var open = i === state.roleIdx;
        return h('div', { class: 'role' + (open ? ' is-open' : '') },
          h('button', {
            class: 'role-head', type: 'button', 'aria-expanded': open ? 'true' : 'false',
            onclick: function () { state.roleIdx = open ? -1 : i; renderMain(); }
          },
            icon('ph-fill ph-caret-right role-caret'),
            icon(r.icon + ' role-icon'),
            h('span', { class: 'role-label' }, r.label)),
          open ? h('div', { class: 'role-body' },
            h('div', null,
              h('div', { class: 'role-key' }, 'Start with'),
              h('div', { class: 'role-val' }, linkSections(r.start))),
            h('div', null,
              h('div', { class: 'role-key' }, 'Then read'),
              h('div', { class: 'role-val' }, linkSections(r.then)))) : null);
      })),
      h('div', { class: 'legend' },
        h('span', null, 'Tinted boxes throughout the guide flag three kinds of content:'),
        h('span', { class: 'legend-item' }, h('span', { class: 'swatch', style: { background: 'var(--tip)' } }), 'practical tips'),
        h('span', { class: 'legend-item' }, h('span', { class: 'swatch', style: { background: 'var(--voice)' } }), 'voices from the field'),
        h('span', { class: 'legend-item' }, h('span', { class: 'swatch', style: { background: 'var(--caution)' } }), 'common mistakes')));

    var journey = h('figure', { id: 'journey', class: 'journey-figure' },
      h('img', {
        src: 'docs/assets/project_journey.png?v=16',
        alt: 'The project journey, mapped to guide sections. Phase 1 (adapting existing products): Project Start (Sections 3 & 4), Recruitment & Research (Section 4, Part A, Step 1), Co-creation (Part A, Step 2), Validation (Part A, Step 3). Challenges and insights carry forward into Phase 2 (new solutions, developed later): Ideation (Part B, Step 1), Incubation & Prototyping (Part B, Step 2), Validation (Part B, Step 3). The two tracks overlapped only towards the end; they were not planned to run in parallel.',
        loading: 'lazy',
        decoding: 'async'
      }));

    var findings = h('div', null,
      h('h2', { id: 'findings' }, 'Key findings at a glance'),
      h('p', { class: 'section-note section-note--body' },
        linkSections('A compressed summary of Section 5 for a general read before diving into the full sections — not a substitute for it.')),
      h('div', { class: 'findings' }, FINDINGS.map(function (f) {
        return h('div', { class: 'finding' },
          h('div', { class: 'finding-num' }, f[0]),
          h('div', { class: 'finding-title' }, f[1]),
          h('div', { class: 'finding-desc' }, f[2]),
          h('div', { class: 'finding-ref' }, linkSections(f[3])));
      })));

    var quickStart = h('div', null,
      h('h2', { id: 'quick-start' }, 'Quick start: running your first user test in 5 days'),
      h('p', { class: 'section-note section-note--body' }, 'If this is your first time running a test and you do not have time to read the full guide first, start here. This gets you through one complete test. Come back to the full section once you have run a session — the details will make more sense with a real test behind you.'),
      h('div', { class: 'qs-bar' },
        h('div', { class: 'qs-tabs', role: 'tablist' }, DAYS.map(function (d, i) {
          var active = i === state.dayIdx;
          return h('button', {
            class: 'qs-tab' + (active ? ' is-active' : ''),
            type: 'button', role: 'tab', 'aria-selected': active ? 'true' : 'false',
            onclick: function () { state.dayIdx = i; renderMain(); }
          }, d.tab);
        })),
        h('button', { class: 'qs-check-btn', type: 'button', onclick: openChecklist },
          icon('ph ph-list-checks'),
          h('span', null, 'Before you start'),
          h('span', { class: 'qs-check-count' }, readyCount + '/5'))),
      h('div', { class: 'qs-panel', role: 'tabpanel' },
        h('div', { class: 'qs-panel-head' },
          h('div', { class: 'qs-panel-title' }, day.title),
          h('div', { class: 'qs-panel-day' }, day.label)),
        h('ul', null, day.items.map(function (it) { return h('li', null, it); })),
        h('div', { class: 'qs-deeper' },
          h('span', { class: 'label' }, 'Go deeper'),
          linkSections(day.deeper))),
      h('figure', { class: 'qs-strip' },
        h('img', {
          src: 'docs/assets/five_day_path.png?v=17',
          alt: 'Your first user test in five days: Day 1 prepare, Day 2 recruit, Days 3 to 4 conduct, and Day 5 analyse and share.',
          loading: 'lazy',
          decoding: 'async'
        })),
      h('div', { class: 'qs-caption' }, linkSections('Full detail in Section 4. Templates in Sections 6.5 and 6.6.')),
      h('div', { class: 'caution-box' },
        icon('ph-fill ph-warning'),
        h('div', null,
          h('div', { class: 'caution-title' }, 'Common mistakes that undermine a first test'),
          h('div', { class: 'caution-body' }, 'Testing with people who already know the product — colleagues, friends, or anyone familiar with how it works — produces polite, useless feedback. So do leading questions (“Was that easy to use?” instead of “Walk me through what you just did”), and skipping the 10-minute debrief right after each session, where most detail is captured. Feedback that never reaches the solution provider changes nothing.'))),
      h('p', { class: 'qs-outro' }, 'This quick start deliberately leaves out screening rigor, bias mitigation, and the differences between testing an existing product (Part A) and a brand-new one (Part B). ',
        linkSections('Section 4 covers all of that in full once you’re ready for it.')));

    var licence = h('div', { class: 'cta', id: 'licence' },
      h('div', null,
        h('div', { class: 'cta-kicker' }, 'Open source'),
        h('div', { class: 'cta-title' }, 'Built to be used, adapted and added to'),
        h('p', null, 'Published under a Creative Commons Attribution 4.0 International (CC BY 4.0) licence. Photographs, logos, and third-party figures are excluded from the licence. ',
          linkSections('See the Imprint and Section 9.5 for full terms and attribution wording.')),
        h('div', { class: 'cta-actions' },
          h('button', { class: 'btn-md btn-md--white', type: 'button', onclick: function () { go('s9', '92-contribution-guidelines'); } }, 'Contribute to the guide'),
          h('button', { class: 'btn-md btn-md--outline', type: 'button', onclick: function () { go('imprint'); } }, 'Imprint and licence'))),
      h('div', { class: 'cta-photo' },
        photo('docs/assets/field-market-phone.jpg', 'A market trader in Ghana on a phone call at her stall')));

    var foot = h('div', { class: 'page-foot' },
      h('span', null, '© 2026 GIZ GmbH and GFA Consulting Group GmbH · Licensed under CC BY 4.0'),
      h('span', null, 'Photographs, logos and third-party figures excluded'));

    return h('div', { class: 'home' },
      hero,
      h('div', { class: 'home-below' },
        h('nav', { class: 'home-nav', 'aria-label': 'Guide navigation' }, buildNavGroups()),
        h('div', { class: 'home-body' },
          sectionIndex, about, howTo, journey, findings, quickStart, licence, foot)));
  }

  // Builds the numbered step boxes for one phase of the journey diagram.
  // markStep (1-based within the phase) gets the dashed "challenges" connector.
  function journeySteps(steps, phase, markStep) {
    var out = [];
    steps.forEach(function (s, i) {
      if (i) out.push(h('div', { class: 'jflow-arrow', 'aria-hidden': 'true' }, icon('ph-bold ph-arrow-right')));
      out.push(h('div', { class: 'jstep jstep--' + phase },
        h('div', { class: 'jstep-num' }, s[0]),
        h('div', { class: 'jstep-title' }, s[1]),
        h('div', { class: 'jstep-rule' }),
        h('div', { class: 'jstep-ref' }, linkSections(s[2])),
        (i + 1 === markStep) ? h('div', { class: 'jstep-carry', 'aria-hidden': 'true' },
          icon('ph-bold ph-arrow-down'),
          h('span', null, 'challenges & insights')) : null));
    });
    return out;
  }

  /* ---------------------------------------------------------- article page */

  function renderArticle(page) {
    var doc = page.file ? state.docs[page.file] : null;
    var loaded = !!doc;
    var failed = doc && doc.error;
    var idx = PAGES.indexOf(page);
    var prev = idx > 0 ? PAGES[idx - 1] : null;
    var next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

    var desc = (doc && doc.desc) || page.desc || '';
    var headingTitle = (doc && doc.title) || page.title;

    var body;
    if (!loaded) {
      body = h('div', { class: 'skeleton' },
        h('div', { style: { width: '70%' } }),
        h('div', { style: { width: '90%' } }),
        h('div', { style: { width: '60%' } }));
    } else if (failed) {
      body = h('div', { class: 'admon admon--caution' },
        h('div', { class: 'admon-title' }, 'This section could not be loaded'),
        h('p', null, 'The page reads ', h('code', null, docPath(page.file)),
          ' over HTTP. Serve the folder (see the README) rather than opening index.html from the filesystem.'));
    } else {
      body = renderBlocks(doc.blocks);
    }

    return h('div', { class: 'article' },
      h('div', { class: 'article-kicker' },
        page.kind === 'section' ? 'Section ' + page.n + ' · ' + page.tag : (page.tag || '')),
      h('div', { class: 'article-head' },
        h('h1', null, headingTitle),
        h('div', { class: 'article-actions' },
          h('a', {
            class: 'copy-btn',
            href: 'https://github.com/joekay-kiipo/os-guide-site/edit/main/docs/' + page.file,
            target: '_blank',
            rel: 'noreferrer'
          }, icon('ph-duotone ph-pencil-simple'), h('span', null, 'Edit this page')),
          h('button', { class: 'copy-btn', type: 'button', onclick: function () { copyPage(page); } },
            icon('ph ph-copy'),
            h('span', null, state.copied ? 'Copied' : 'Copy page')))),
      desc ? h('p', { class: 'article-desc' }, desc) : null,
      h('div', { class: 'doc' }, body),
      h('div', { class: 'pager' },
        h('div', null, prev ? h('button', {
          class: 'pager-btn', type: 'button', onclick: function () { go(prev.id); }
        }, h('div', { class: 'pager-dir' }, '← Previous'), h('div', { class: 'pager-title' }, prev.title)) : null),
        h('div', null, next ? h('button', {
          class: 'pager-btn pager-btn--next', type: 'button', onclick: function () { go(next.id); }
        }, h('div', { class: 'pager-dir' }, 'Next →'), h('div', { class: 'pager-title' }, next.title)) : null)),
      h('div', { class: 'page-foot' },
        h('span', null, 'Designing Inclusive Digital Solutions — open-source guide'),
        h('span', null, 'CC BY 4.0')));
  }

  function copyPage(page) {
    var doc = page.file ? state.docs[page.file] : null;
    var text = doc && doc.raw ? doc.raw : page.title;
    try { navigator.clipboard.writeText(text); } catch (e) {}
    state.copied = true;
    renderMain();
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () { state.copied = false; renderMain(); }, 1600);
  }

  /* ------------------------------------------------------------------ rail */

  function renderRail() {
    var rail = $('#rail');
    var page = currentPage();
    if (page.kind === 'home') { rail.hidden = true; rail.textContent = ''; return; }

    var doc = page.file ? state.docs[page.file] : null;
    var items = doc && doc.toc ? doc.toc : [];

    if (!items.length) { rail.hidden = true; rail.textContent = ''; return; }

    rail.hidden = false;
    fill(rail, [
      h('div', { class: 'rail-head' }, icon('ph ph-list-dashes'), h('span', null, 'On this page')),
      h('div', { class: 'rail-list' }, items.map(function (t) {
        return h('button', {
          class: 'rail-item' + (t.sub ? ' rail-item--sub' : ''),
          type: 'button',
          onclick: function () { scrollToAnchor(t.id); }
        }, t.text);
      }))
    ]);
  }

  /* ---------------------------------------------------------------- drawer */

  function renderDrawer() {
    var readyCount = state.checks.filter(Boolean).length;
    fill($('#drawer'), [
      h('div', { class: 'drawer-head' },
        h('div', null,
          h('div', { class: 'drawer-kicker' }, 'Quick start'),
          h('div', { class: 'drawer-title' }, 'Before you start')),
        h('button', { class: 'drawer-close', type: 'button', 'aria-label': 'Close', onclick: closeChecklist },
          icon('ph-bold ph-x'))),
      h('p', { class: 'drawer-intro' }, 'Have these five things in place before you schedule anything.'),
      h('div', { class: 'drawer-count' }, readyCount + ' of 5 ready'),
      h('div', { class: 'drawer-bar' }, h('span', { style: { width: (readyCount / 5 * 100) + '%' } })),
      h('div', { class: 'drawer-checks' }, CHECK_TEXTS.map(function (text, i) {
        var on = !!state.checks[i];
        return h('button', {
          class: 'check' + (on ? ' is-on' : ''),
          type: 'button', 'aria-pressed': on ? 'true' : 'false',
          onclick: function () {
            state.checks[i] = !state.checks[i];
            renderDrawer();
            if (currentPage().kind === 'home') renderMain();
          }
        },
          h('span', { class: 'check-box' }, on ? icon('ph-bold ph-check') : null),
          h('span', { class: 'check-text' }, text));
      })),
      h('div', { class: 'drawer-note' }, 'If any of these are missing, get them in place before scheduling anything — a rushed test without them produces data you can’t trust.'),
      h('button', { class: 'drawer-done', type: 'button', onclick: closeChecklist }, 'Done')
    ]);
  }

  function openChecklist() {
    state.panelOpen = true;
    $('#drawer').classList.add('is-open');
    $('#drawer').setAttribute('aria-hidden', 'false');
    $('#drawer-scrim').classList.add('is-open');
    var close = $('#drawer').querySelector('.drawer-close');
    if (close) close.focus();
  }

  function closeChecklist() {
    state.panelOpen = false;
    $('#drawer').classList.remove('is-open');
    $('#drawer').setAttribute('aria-hidden', 'true');
    $('#drawer-scrim').classList.remove('is-open');
  }

  /* ---------------------------------------------------------------- search */

  var searchInput = null;

  function buildSearch() {
    var overlay = $('#search-overlay');
    searchInput = h('input', {
      class: 'search-input',
      type: 'text',
      placeholder: 'Search sections, headings and content…',
      'aria-label': 'Search the guide',
      oninput: function (e) { state.q = e.target.value; state.selIdx = 0; renderSearchResults(); }
    });

    fill(overlay, h('div', { class: 'search-dialog', onclick: function (e) { e.stopPropagation(); } },
      h('div', { class: 'search-input-row' },
        icon('ph ph-magnifying-glass'),
        searchInput,
        h('button', { class: 'search-esc', type: 'button', onclick: closeSearch }, 'ESC')),
      h('div', { class: 'search-results', id: 'search-results' }),
      h('div', { class: 'search-foot' },
        h('span', null, '↑↓ navigate'),
        h('span', null, '↵ open'),
        h('span', { class: 'count', id: 'search-count' }, ''))));

    overlay.addEventListener('click', closeSearch);
  }

  function renderSearchResults() {
    var res = searchResults();
    var host = $('#search-results');
    var count = $('#search-count');
    if (!host) return;

    if (!res.length) {
      fill(host, h('div', { class: 'search-empty' }, 'No matches for “' + state.q + '”'));
    } else {
      fill(host, res.map(function (r, i) {
        var sel = i === state.selIdx;
        var iconClass = r.kind === 'text' ? 'ph ph-text-align-left'
          : r.kind === 'heading' ? 'ph ph-hash'
            : r.kind === 'home' ? 'ph ph-house' : 'ph ph-book-open';
        return h('button', {
          class: 'search-result' + (sel ? ' is-sel' : ''),
          type: 'button',
          onclick: function () { gotoResult(r); },
          onmouseenter: function () { state.selIdx = i; markSelection(); }
        },
          icon(iconClass),
          h('span', { class: 'search-result-body' },
            h('span', { class: 'search-result-title' }, highlight(r.title, state.q)),
            h('span', { class: 'search-result-snippet' }, snippet(r.body, state.q))),
          h('span', { class: 'search-crumb' }, r.crumb || r.pageTitle));
      }));
    }
    count.textContent = res.length + (res.length === 1 ? ' result' : ' results');
  }

  function markSelection() {
    var rows = document.querySelectorAll('#search-results .search-result');
    for (var i = 0; i < rows.length; i++) rows[i].classList.toggle('is-sel', i === state.selIdx);
    var active = rows[state.selIdx];
    if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' });
  }

  function openSearch() {
    state.searchOpen = true;
    state.selIdx = 0;
    $('#search-overlay').hidden = false;
    renderSearchResults();
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 40);
  }

  function closeSearch() {
    state.searchOpen = false;
    state.q = '';
    state.selIdx = 0;
    if (searchInput) searchInput.value = '';
    $('#search-overlay').hidden = true;
    var btn = $('#search-btn');
    if (btn) btn.focus();
  }

  function gotoResult(r) {
    closeSearch();
    if (r.pageId === state.pageId) {
      if (r.anchor) scrollToAnchor(r.anchor, 0);
      else window.scrollTo({ top: 0 });
      return;
    }
    go(r.pageId, r.anchor);
  }

  /* ------------------------------------------------------- mobile nav drawer */

  function openNavDrawer() {
    $('#sidebar').classList.add('is-open');
    $('#nav-scrim').hidden = false;
    $('#menu-btn').setAttribute('aria-expanded', 'true');
    $('#menu-btn').setAttribute('aria-label', 'Close navigation');
  }

  function closeNavDrawer() {
    $('#sidebar').classList.remove('is-open');
    $('#nav-scrim').hidden = true;
    $('#menu-btn').setAttribute('aria-expanded', 'false');
    $('#menu-btn').setAttribute('aria-label', 'Open navigation');
  }

  /* ----------------------------------------------------------------- theme */

  function applyTheme(dark) {
    state.dark = dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('ids-docs-theme', dark ? 'dark' : 'light'); } catch (e) {}
    var btn = $('#theme-btn');
    fill(btn, icon(dark ? 'ph ph-sun' : 'ph ph-moon'));
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  /* ---------------------------------------------------------------- render */

  function renderMain() {
    var page = currentPage();
    fill($('#main'), page.kind === 'home' ? renderHome() : renderArticle(page));
    if (window.DTEGInteractive) window.DTEGInteractive.renderAll();
  }

  function render() {
    // On home the left sidebar moves below the full-width hero, so the shell
    // switches to a single full-width column (see .is-home in the stylesheet).
    document.body.classList.toggle('is-home', currentPage().kind === 'home');
    renderSidebar();
    renderMain();
    renderRail();
    document.title = currentPage().kind === 'home'
      ? 'Designing Inclusive Digital Solutions'
      : currentPage().title + ' — Designing Inclusive Digital Solutions';
  }

  /* ------------------------------------------------------------------ init */

  function init() {
    var stored = 'light';
    try { stored = localStorage.getItem('ids-docs-theme') || 'light'; } catch (e) {}
    applyTheme(stored === 'dark');

    buildHomeIndex();
    buildSearch();
    renderDrawer();

    $('#search-btn').addEventListener('click', openSearch);
    $('#theme-btn').addEventListener('click', function () { applyTheme(!state.dark); });
    $('#menu-btn').addEventListener('click', function () {
      if ($('#sidebar').classList.contains('is-open')) closeNavDrawer();
      else openNavDrawer();
    });
    $('#nav-scrim').addEventListener('click', closeNavDrawer);
    $('#drawer-scrim').addEventListener('click', closeChecklist);
    $('#back-to-top').addEventListener('click', function () { smoothTo(0); });
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();

    window.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === 'k') {
        e.preventDefault();
        if (state.searchOpen) closeSearch(); else openSearch();
        return;
      }
      if (e.key === 'Escape') {
        if (state.searchOpen) { e.preventDefault(); closeSearch(); return; }
        if (state.panelOpen) { e.preventDefault(); closeChecklist(); return; }
        if ($('#sidebar').classList.contains('is-open')) { closeNavDrawer(); return; }
      }
      if (!state.searchOpen) return;
      var res = searchResults();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.selIdx = Math.min(res.length - 1, state.selIdx + 1);
        markSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.selIdx = Math.max(0, state.selIdx - 1);
        markSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (res[state.selIdx]) gotoResult(res[state.selIdx]);
      }
    });

    window.addEventListener('hashchange', function () {
      var r = parseHash();
      applyRoute(r.id, r.anchor);
    });

    var route = parseHash();
    state.pageId = route.id;
    state.anchor = route.anchor;
    if (/^s\d/.test(route.id)) state.guideOpen = true;
    loadDoc(route.id);
    render();
    if (route.anchor) setTimeout(function () { scrollToAnchor(route.anchor, 0); }, 200);

    // Warm the search index from every Markdown source.
    PAGES.filter(function (p) { return p.file; }).forEach(function (p) {
      fetch(docPath(p.file))
        .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
        .then(function (md) { indexDoc(p, md); })
        .catch(function () {});
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
