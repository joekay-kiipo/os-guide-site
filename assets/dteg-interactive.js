/* Interactive regional locator + solutions explorer for the Open-Source UI/UX Guide.
   Both components read from window.DTEG_REGIONS / window.DTEG_SOLUTIONS (dteg-data.js)
   and render into the empty container divs left in the Markdown source. Vanilla JS,
   no dependencies, so it survives being copied into any static host without a build step. */

(function () {
  "use strict";

  var REGION_SHADES = ["#144A73", "#1F6BA5", "#3E8EC4", "#5B9BD5", "#79ACDD", "#9EC3E6", "#C7DDF0"];

  var filterState = {
    search: "",
    region: "All",
    phase: "All",
    evidence: "All",
    finalistOnly: false,
    sortKey: "code",
    sortDir: "asc"
  };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === "class") {
        node.className = attrs[key];
      } else if (key === "text") {
        node.textContent = attrs[key];
      } else {
        node.setAttribute(key, attrs[key]);
      }
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  /* Natural sort for codes like S1, S2 ... S18, P1 ... P12 (plain alphabetical
     would put S10 before S2, which is wrong for a human reading this table). */
  function codeSortValue(code) {
    var match = /^([A-Za-z]+)(\d+)$/.exec(code);
    if (!match) return [code, 0];
    return [match[1], parseInt(match[2], 10)];
  }

  function compareSolutions(a, b, key, dir) {
    var result;
    if (key === "code") {
      var av = codeSortValue(a.code), bv = codeSortValue(b.code);
      result = av[0] === bv[0] ? av[1] - bv[1] : av[0].localeCompare(bv[0]);
    } else {
      result = String(a[key]).localeCompare(String(b[key]));
    }
    return dir === "asc" ? result : -result;
  }

  /* ---------------- Regional locator ---------------- */

  function renderRegionLocator(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var wrap = el("div", { class: "dteg-region-locator" });
    var caption = el("p", {
      class: "dteg-region-caption",
      text: "Schematic north-to-south layout, matching Section 1.3 — not to scale or geographically precise. Click a region to filter the solutions table below."
    });
    wrap.appendChild(caption);

    var grid = el("div", { class: "dteg-region-grid" });
    window.DTEG_REGIONS.forEach(function (r, i) {
      var shade = REGION_SHADES[i] || REGION_SHADES[REGION_SHADES.length - 1];
      var band = el("button", {
        type: "button",
        class: "dteg-region-band" + (r.secondary ? " dteg-region-band--secondary" : ""),
        "data-region": r.region,
        "aria-pressed": "false"
      });
      band.style.setProperty("--band-color", shade);

      var title = el("div", { class: "dteg-region-band-title", text: r.name });
      var meta = el("div", {
        class: "dteg-region-band-meta",
        text: r.secondary ? "Secondary site" : (r.intermediaries + " intermediar" + (r.intermediaries === 1 ? "y" : "ies") + " · " + r.solutions + " solution" + (r.solutions === 1 ? "" : "s"))
      });
      band.appendChild(title);
      band.appendChild(meta);

      band.addEventListener("click", function () {
        var alreadySelected = band.getAttribute("aria-pressed") === "true";
        grid.querySelectorAll(".dteg-region-band").forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
          b.classList.remove("dteg-region-band--active");
        });
        if (alreadySelected) {
          filterState.region = "All";
        } else {
          band.setAttribute("aria-pressed", "true");
          band.classList.add("dteg-region-band--active");
          filterState.region = r.region;
        }
        var select = document.querySelector('[data-dteg-role="region-select"]');
        if (select) select.value = filterState.region;
        renderTable();
        var explorer = document.getElementById("dteg-solutions-explorer");
        if (explorer && !alreadySelected) {
          explorer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      grid.appendChild(band);
    });

    wrap.appendChild(grid);
    container.innerHTML = "";
    container.appendChild(wrap);
  }

  /* ---------------- Solutions explorer ---------------- */

  function badge(text, kind) {
    return el("span", { class: "dteg-badge dteg-badge--" + kind, text: text });
  }

  function buildControls(container) {
    var controls = el("div", { class: "dteg-explorer-controls" });

    var searchWrap = el("label", { class: "dteg-control dteg-control--search" });
    searchWrap.appendChild(el("span", { class: "dteg-control-label", text: "Search" }));
    var searchInput = el("input", {
      type: "text",
      placeholder: "Code, business field, or insight…",
      "data-dteg-role": "search"
    });
    searchInput.addEventListener("input", function (e) {
      filterState.search = e.target.value.trim().toLowerCase();
      renderTable();
    });
    searchWrap.appendChild(searchInput);
    controls.appendChild(searchWrap);

    function buildSelect(label, role, options, currentValue) {
      var wrap = el("label", { class: "dteg-control" });
      wrap.appendChild(el("span", { class: "dteg-control-label", text: label }));
      var select = el("select", { "data-dteg-role": role });
      options.forEach(function (opt) {
        var optionEl = el("option", { value: opt, text: opt });
        if (opt === currentValue) optionEl.selected = true;
        select.appendChild(optionEl);
      });
      wrap.appendChild(select);
      controls.appendChild(wrap);
      return select;
    }

    var regions = ["All"].concat(window.DTEG_REGIONS.map(function (r) { return r.region; }));
    var regionSelect = buildSelect("Region", "region-select", regions, "All");
    regionSelect.addEventListener("change", function (e) {
      filterState.region = e.target.value;
      document.querySelectorAll(".dteg-region-band").forEach(function (b) {
        var active = b.getAttribute("data-region") === filterState.region && filterState.region !== "All";
        b.setAttribute("aria-pressed", active ? "true" : "false");
        b.classList.toggle("dteg-region-band--active", active);
      });
      renderTable();
    });

    var phaseSelect = buildSelect("Phase", "phase-select", ["All", "Phase 1", "Phase 2"], "All");
    phaseSelect.addEventListener("change", function (e) {
      filterState.phase = e.target.value;
      renderTable();
    });

    var evidenceSelect = buildSelect("Evidence", "evidence-select", ["All", "Full field evidence", "Roster only"], "All");
    evidenceSelect.addEventListener("change", function (e) {
      filterState.evidence = e.target.value;
      renderTable();
    });

    var finalistWrap = el("label", { class: "dteg-control dteg-control--checkbox" });
    var finalistCheckbox = el("input", { type: "checkbox", "data-dteg-role": "finalist-only" });
    finalistCheckbox.addEventListener("change", function (e) {
      filterState.finalistOnly = e.target.checked;
      renderTable();
    });
    finalistWrap.appendChild(finalistCheckbox);
    finalistWrap.appendChild(el("span", { text: " Finalists only" }));
    controls.appendChild(finalistWrap);

    container.appendChild(controls);
  }

  var COLUMNS = [
    { key: "code", label: "Code" },
    { key: "field", label: "Business field" },
    { key: "region", label: "Region" },
    { key: "phase", label: "Phase" },
    { key: "evidence", label: "Evidence" },
    { key: "insight", label: "Major user insight", sortable: false }
  ];

  function buildTableShell(container) {
    var wrapper = el("div", { class: "dteg-table-wrapper" });
    var table = el("table", { class: "dteg-table" });
    var thead = el("thead");
    var headRow = el("tr");

    COLUMNS.forEach(function (col) {
      var th = el("th", {});
      if (col.sortable === false) {
        th.textContent = col.label;
      } else {
        var btn = el("button", { type: "button", class: "dteg-sort-btn", text: col.label });
        btn.addEventListener("click", function () {
          if (filterState.sortKey === col.key) {
            filterState.sortDir = filterState.sortDir === "asc" ? "desc" : "asc";
          } else {
            filterState.sortKey = col.key;
            filterState.sortDir = "asc";
          }
          renderTable();
        });
        th.appendChild(btn);
        th.setAttribute("data-col", col.key);
      }
      headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);
    table.appendChild(el("tbody", { "data-dteg-role": "tbody" }));
    wrapper.appendChild(table);
    container.appendChild(wrapper);
    container.appendChild(el("p", { class: "dteg-result-count", "data-dteg-role": "result-count" }));
  }

  function updateSortIndicators() {
    document.querySelectorAll(".dteg-table th[data-col]").forEach(function (th) {
      th.classList.remove("dteg-sort-asc", "dteg-sort-desc");
      if (th.getAttribute("data-col") === filterState.sortKey) {
        th.classList.add(filterState.sortDir === "asc" ? "dteg-sort-asc" : "dteg-sort-desc");
      }
    });
  }

  function renderTable() {
    var tbody = document.querySelector('[data-dteg-role="tbody"]');
    var countEl = document.querySelector('[data-dteg-role="result-count"]');
    if (!tbody) return;

    var rows = window.DTEG_SOLUTIONS.filter(function (s) {
      if (filterState.region !== "All" && s.region !== filterState.region) return false;
      if (filterState.phase !== "All" && s.phase !== filterState.phase) return false;
      if (filterState.evidence !== "All" && s.evidence !== filterState.evidence) return false;
      if (filterState.finalistOnly && !s.finalist) return false;
      if (filterState.search) {
        var haystack = (s.code + " " + s.field + " " + s.insight + " " + s.region).toLowerCase();
        if (haystack.indexOf(filterState.search) === -1) return false;
      }
      return true;
    });

    rows.sort(function (a, b) { return compareSolutions(a, b, filterState.sortKey, filterState.sortDir); });

    tbody.innerHTML = "";

    if (rows.length === 0) {
      var emptyMessage = "No solutions match these filters.";
      if (filterState.region !== "All") {
        var regionInfo = window.DTEG_REGIONS.filter(function (r) { return r.region === filterState.region; })[0];
        if (regionInfo && regionInfo.secondary) {
          emptyMessage = regionInfo.note;
        }
      }
      var emptyRow = el("tr", {});
      var emptyCell = el("td", { colspan: String(COLUMNS.length), class: "dteg-empty-state", text: emptyMessage });
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      rows.forEach(function (s) {
        var tr = el("tr", {});
        tr.appendChild(el("td", { class: "dteg-code-cell", text: s.code }));
        tr.appendChild(el("td", { text: s.field }));
        tr.appendChild(el("td", { text: s.region }));
        tr.appendChild(el("td", {}, [badge(s.phase, s.phase === "Phase 1" ? "phase1" : "phase2")]));

        var evidenceCell = el("td", {});
        evidenceCell.appendChild(badge(s.evidence === "Roster only" ? "Roster only" : "Full evidence", s.evidence === "Roster only" ? "roster" : "full"));
        if (s.status === "Discontinued") evidenceCell.appendChild(badge("Discontinued", "discontinued"));
        if (s.finalist) evidenceCell.appendChild(badge(s.finalist === "Finalist" ? "Finalist" : "Finalist — " + s.finalist, "finalist"));
        tr.appendChild(evidenceCell);

        tr.appendChild(el("td", { class: "dteg-insight-cell", text: s.insight }));
        tbody.appendChild(tr);
      });
    }

    if (countEl) {
      countEl.textContent = "Showing " + rows.length + " of " + window.DTEG_SOLUTIONS.length + " solutions.";
    }
    updateSortIndicators();
  }

  function renderSolutionsExplorer(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    buildControls(container);
    buildTableShell(container);
    renderTable();
  }

  function renderAll() {
    renderRegionLocator("dteg-region-locator");
    renderSolutionsExplorer("dteg-solutions-explorer");
  }

  window.DTEGInteractive = { renderAll: renderAll };
  document.addEventListener("DOMContentLoaded", renderAll);
})();
