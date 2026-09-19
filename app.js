/* CariPark — simple spots UI */
(function () {
  "use strict";

  const FALLBACK_DATA = {"updated": "2026-09-19", "rateDisclaimer": "Prices are rough guesses from 2024–2026 tips. Always check the board.", "spots": [{"name": "Suria KLCC basement", "tagline": "Skip for long days", "area": "KLCC", "near": "Suria KLCC", "type": "Basement", "difficulty": "Hard", "sentiment": "Skip", "priceNote": "About RM40+ for a full work day", "tips": "Park at Avenue K or Kampung Baru and walk.", "sourceLinks": "https://www.reddit.com/r/KualaLumpur/comments/1f3rzhh/where_do_you_park_your_car_including_510_minute/"}, {"name": "Kampung Baru + Saloma Bridge", "tagline": "Good cheap hack", "area": "KLCC", "near": "Saloma Link / Kampung Baru", "type": "Street", "difficulty": "Medium", "sentiment": "Good", "priceNote": "About street rates (cheaper than Suria)", "tips": "Park near Saloma Link, walk ~5 min to KLCC.", "sourceLinks": "https://www.reddit.com/r/KualaLumpur/comments/1f3rzhh/where_do_you_park_your_car_including_510_minute/"}, {"name": "Outdoor lot behind Avenue K", "tagline": "Okay if early", "area": "KLCC", "near": "Avenue K", "type": "Open lot", "difficulty": "Hard", "sentiment": "Okay", "priceNote": "About RM15/day", "tips": "Come early; outdoor lot, fills fast.", "sourceLinks": "https://www.reddit.com/r/KualaLumpur/comments/1f3rzhh/where_do_you_park_your_car_including_510_minute/"}, {"name": "Avenue K mall", "tagline": "Good pick", "area": "KLCC", "near": "Opposite Suria KLCC", "type": "Mall", "difficulty": "Easy", "sentiment": "Good", "priceNote": "About RM7 flat after 7pm", "tips": "After 7pm it’s a cheap flat rate; short walk to KLCC.", "sourceLinks": "https://kualalumpurinsider.com/parking/avenue-k-parking-rate/"}, {"name": "Pavilion KL", "tagline": "Skip if staying long", "area": "Bukit Bintang", "near": "Jalan Bukit Bintang", "type": "Mall", "difficulty": "Hard", "sentiment": "Skip", "priceNote": "About RM4/hr, up to ~RM40/day", "tips": "Park at Lot 10, Starhill, Sungei Wang, or HLA instead.", "sourceLinks": "https://www.reddit.com/r/KualaLumpur/comments/1el7lsj/parking_at_bukit_bintang/"}, {"name": "Lot 10 / Starhill", "tagline": "Good near Pavilion", "area": "Bukit Bintang", "near": "Opposite Pavilion", "type": "Mall", "difficulty": "Easy", "sentiment": "Good", "priceNote": "About RM7 evening / ~RM15 weekend max", "tips": "Cheaper than Pavilion; walk over.", "sourceLinks": "https://www.reddit.com/r/KualaLumpur/comments/1mc1asm/affordable_parking_spots_at_bukit_bintang_on/"}, {"name": "Sungei Wang / Low Yat", "tagline": "Good at night", "area": "Bukit Bintang", "near": "Sungei Wang / Low Yat", "type": "Mall", "difficulty": "Easy", "sentiment": "Good", "priceNote": "About RM5–RM6 evening flat", "tips": "Evening flat rate; great for Jalan Alor.", "sourceLinks": "https://kualalumpurinsider.com/bukit-bintang-cheaper-parking-and-rates-near-pavilion/"}, {"name": "HLA near Pavilion", "tagline": "Good evenings/weekends", "area": "Bukit Bintang", "near": "Near Pavilion", "type": "Basement", "difficulty": "Easy", "sentiment": "Good", "priceNote": "About RM6 evenings/weekends", "tips": "Cheap entry; short walk to Pavilion.", "sourceLinks": "https://www.reddit.com/r/KualaLumpur/comments/1el7lsj/parking_at_bukit_bintang/"}, {"name": "Mid Valley / Gardens", "tagline": "Okay for shopping", "area": "Mid Valley", "near": "Mid Valley Megamall", "type": "Mall", "difficulty": "Medium", "sentiment": "Okay", "priceNote": "About RM3–4 first hours (check board)", "tips": "Fine to shop; expensive for a full work day.", "sourceLinks": "https://wahpiang.com/mid-valley-kl-revise-new-parking-rates-jan-2026/"}, {"name": "MBMR / KTM lots", "tagline": "Good for work days", "area": "Mid Valley", "near": "Near Mid Valley KTM", "type": "Open lot", "difficulty": "Hard", "sentiment": "Good", "priceNote": "About RM7–RM10/day", "tips": "Arrive before 8am; walk the bridge in.", "sourceLinks": "https://www.reddit.com/r/malaysians/comments/1cx3scu/cheap_car_parking_option_near_midvalley/"}, {"name": "Telawi street vs Bangsar Village", "tagline": "Skip Telawi street", "area": "Bangsar", "near": "Jalan Telawi / Bangsar Village", "type": "Street", "difficulty": "Hard", "sentiment": "Skip", "priceNote": "Bangsar Village about RM2–3 first hour", "tips": "Park at Bangsar Village and walk to food.", "sourceLinks": "https://kualalumpurinsider.com/bangsar-village-2-latest-parking-rates-and-guide/"}, {"name": "DBKL street apps", "tagline": "Okay, use the right apps", "area": "Other", "near": "DBKL street bays", "type": "App / Smart", "difficulty": "Medium", "sentiment": "Okay", "priceNote": "About zone rates via app", "tips": "Use EZ KL Smart Park / Flexi / TnG — not JomParking.", "sourceLinks": "https://paultan.org/2025/01/03/dbkl-no-longer-accepting-jomparking-for-payment-in-2025-six-other-apps-retained-for-public-parking/"}]};

  const FACE = { Easy: "🙂", Medium: "😐", Hard: "😣" };
  const SENT_FACE = { Good: "🙂", Okay: "😐", Skip: "😕" };
  const SENT_CLASS = { Good: "chip-good", Okay: "chip-okay", Skip: "chip-skip" };

  const grid = document.getElementById("spots-grid");
  const empty = document.getElementById("empty-state");
  const countEl = document.getElementById("spots-count");
  const areaSelect = document.getElementById("filter-area");
  const sentimentSelect = document.getElementById("filter-sentiment");
  const searchInput = document.getElementById("filter-q");
  const heroCount = document.getElementById("hero-count");
  const disclaimer = document.getElementById("rate-disclaimer");

  let spots = [];

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fillAreas(list) {
    const areas = [...new Set(list.map((s) => s.area))].sort();
    areaSelect.innerHTML = '<option value="all">All areas</option>' +
      areas.map((a) => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join("");
  }

  function cardHtml(s) {
    const sent = s.sentiment || "Okay";
    const diff = s.difficulty || "Medium";
    const sentChip = SENT_CLASS[sent] || "chip-okay";
    const tip = s.tips || "";
    const price = s.priceNote || "";
    const tag = s.tagline || "";
    const link = s.sourceLinks
      ? `<a class="card-more" href="${escapeHtml(s.sourceLinks)}" target="_blank" rel="noopener">More info →</a>`
      : "";
    return `<article class="spot-card sentiment-${escapeHtml(sent).toLowerCase()}" data-area="${escapeHtml(s.area)}" data-sentiment="${escapeHtml(sent)}">
      <header class="card-header">
        <span class="chip ${sentChip}">${escapeHtml(sent)} ${SENT_FACE[sent] || ""}</span>
        <span class="diff-pill" title="How hard">${FACE[diff] || "😐"} ${escapeHtml(diff)}</span>
      </header>
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(s.name)}</h3>
        ${tag ? `<p class="card-tagline">${escapeHtml(tag)}</p>` : ""}
        <p class="card-where"><span class="where-label">Where</span> ${escapeHtml(s.area)}${s.near ? " · " + escapeHtml(s.near) : ""}</p>
        <div class="card-tip-box">
          <span class="tip-label">Tip</span>
          <p class="card-tip">${escapeHtml(tip)}</p>
        </div>
      </div>
      ${price ? `<div class="card-price-box"><span class="price-label">Price</span><p class="card-price">${escapeHtml(price)}</p></div>` : ""}
      ${link ? `<footer class="card-footer">${link}</footer>` : ""}
    </article>`;
  }

  function matchesQuery(s, q) {
    if (!q) return true;
    const hay = [s.name, s.area, s.near, s.tagline, s.tips].filter(Boolean).join(" ").toLowerCase();
    return q.split(/\s+/).filter(Boolean).every((word) => hay.includes(word));
  }

  function render() {
    const area = areaSelect.value;
    const sentiment = sentimentSelect.value;
    const q = (searchInput && searchInput.value || "").trim().toLowerCase();
    const filtered = spots.filter((s) => {
      if (area !== "all" && s.area !== area) return false;
      if (sentiment !== "all" && s.sentiment !== sentiment) return false;
      if (!matchesQuery(s, q)) return false;
      return true;
    });
    grid.innerHTML = filtered.map(cardHtml).join("");
    countEl.textContent = "Showing " + filtered.length + " spot" + (filtered.length === 1 ? "" : "s");
    empty.hidden = filtered.length > 0;
  }

  function boot(data) {
    spots = data.spots || [];
    if (disclaimer && data.rateDisclaimer) disclaimer.textContent = data.rateDisclaimer;
    if (heroCount) heroCount.textContent = String(spots.length);
    fillAreas(spots);
    render();
  }

  areaSelect.addEventListener("change", render);
  sentimentSelect.addEventListener("change", render);
  if (searchInput) {
    searchInput.addEventListener("input", render);
    searchInput.addEventListener("search", render);
  }

  fetch("data/spots.json")
    .then((r) => {
      if (!r.ok) throw new Error("bad status");
      return r.json();
    })
    .then(boot)
    .catch(() => boot(FALLBACK_DATA));
})();
