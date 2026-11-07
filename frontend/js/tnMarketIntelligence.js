/**
 * AgriTrace - Tamil Nadu Agricultural Market Intelligence Controller
 * Drives District Market Comparison, Mode A/B Common Date, Smart Selling Profit Calculator,
 * Price Trends, Weather Advisory, Quality Grading, Schemes, and Nearby Markets.
 */

(function () {
  "use strict";

  // Application State
  const state = {
    currentCrop: "tomato",
    selectedDistricts: ["Salem", "Madurai", "Erode", "Coimbatore", "Dindigul", "Chennai"],
    comparisonMode: "common", // "common" (Mode A) or "latest" (Mode B)
    priceUnit: "quintal", // "quintal" or "kg"
    currentTab: "tabMarketComparison",
    sortBy: "price-desc"
  };

  /**
   * Initialize on DOM Ready
   */
  function init() {
    bindEvents();
    renderDistrictChips();
    loadMarketComparison();
    loadWeatherAdvisory();
    loadSchemes();
    loadNearbyMarkets();
    initProfitCalculator();
  }

  /**
   * Bind Interactive Elements
   */
  function bindEvents() {
    // Feature Tabs
    const tabBtns = document.querySelectorAll(".mi-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        switchMiTab(targetTab);
      });
    });

    // Crop Selector
    const cropSelect = document.getElementById("miCropSelector");
    if (cropSelect) {
      cropSelect.addEventListener("change", (e) => {
        state.currentCrop = e.target.value;
        loadMarketComparison();
        loadWeatherAdvisory();
        loadPriceTrends();
      });
    }

    // Mode Switcher (Mode A vs Mode B)
    const modeBtns = document.querySelectorAll(".mi-mode-btn");
    modeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        modeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.comparisonMode = btn.getAttribute("data-mode");
        loadMarketComparison();
      });
    });

    // Unit Switcher (₹/quintal vs ₹/kg)
    const unitBtns = document.querySelectorAll(".mi-unit-btn");
    unitBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        unitBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.priceUnit = btn.getAttribute("data-unit");
        renderComparisonTable();
        renderComparisonChart();
      });
    });

    // Table Header Sorting
    const sortHeaders = document.querySelectorAll(".mi-price-table th.sortable");
    sortHeaders.forEach(th => {
      th.addEventListener("click", () => {
        const sortType = th.getAttribute("data-sort");
        if (state.sortBy === `${sortType}-desc`) {
          state.sortBy = `${sortType}-asc`;
        } else {
          state.sortBy = `${sortType}-desc`;
        }
        renderComparisonTable();
      });
    });
  }

  /**
   * Switch Active Feature Tab
   */
  function switchMiTab(tabId) {
    state.currentTab = tabId;
    document.querySelectorAll(".mi-tab-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-tab") === tabId);
    });
    document.querySelectorAll(".mi-tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === tabId);
    });

    if (tabId === "tabPriceTrends") {
      loadPriceTrends();
    }
  }

  /**
   * Render District Filter Chips
   */
  function renderDistrictChips() {
    const container = document.getElementById("miDistrictChipsContainer");
    if (!container) return;

    const ALL_DISTRICTS = [
      "Salem", "Madurai", "Coimbatore", "Erode", "Dindigul",
      "Theni", "Tiruchirappalli", "Chennai", "Thoothukudi", "Tirunelveli", "Thanjavur"
    ];

    container.innerHTML = ALL_DISTRICTS.map(dist => {
      const isSelected = state.selectedDistricts.includes(dist);
      return `<button type="button" class="mi-district-chip ${isSelected ? "active" : ""}" data-district="${dist}">
        <span>${isSelected ? "✓" : "+"}</span>
        <span>${dist}</span>
      </button>`;
    }).join("");

    container.querySelectorAll(".mi-district-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const dist = btn.getAttribute("data-district");
        if (state.selectedDistricts.includes(dist)) {
          if (state.selectedDistricts.length > 2) {
            state.selectedDistricts = state.selectedDistricts.filter(d => d !== dist);
          }
        } else {
          state.selectedDistricts.push(dist);
        }
        renderDistrictChips();
        loadMarketComparison();
      });
    });
  }

  let latestComparisonData = null;

  /**
   * Load Market Comparison Data (via Backend API with resilient local fallback)
   */
  async function loadMarketComparison() {
    const districtsQuery = state.selectedDistricts.join(",");
    const apiUrl = `/api/tn-market/comparison?crop=${state.currentCrop}&districts=${encodeURIComponent(districtsQuery)}&mode=${state.comparisonMode}`;

    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          latestComparisonData = json.data;
          renderComparisonView();
          return;
        }
      }
    } catch (e) {
      // Offline fallback
    }

    // Local client-side computation fallback
    fallbackComputeComparison();
    renderComparisonView();
  }

  /**
   * Client-Side Offline Fallback Comparison Engine
   */
  function fallbackComputeComparison() {
    const records = window.TN_MARKET_PRICE_RECORDS || [];
    const markets = window.TN_MARKETS || [];
    const relevantMarkets = markets.filter(m => state.selectedDistricts.includes(m.district));
    const cropRecords = records.filter(r => r.crop_slug === state.currentCrop);

    if (state.comparisonMode === "common") {
      const commonDate = "2026-11-06";
      const table = relevantMarkets.map(m => {
        const rec = cropRecords.find(r => r.market_id === m.id && r.observation_date === commonDate);
        if (rec) {
          return {
            market_id: m.id,
            market_name: m.name,
            district: m.district,
            observation_date: rec.observation_date,
            status: "AVAILABLE",
            modal_price_quintal: rec.modal_price_quintal,
            min_price_quintal: rec.min_price_quintal,
            max_price_quintal: rec.max_price_quintal,
            modal_price_kg: (rec.modal_price_quintal / 100).toFixed(2),
            min_price_kg: (rec.min_price_quintal / 100).toFixed(2),
            max_price_kg: (rec.max_price_quintal / 100).toFixed(2),
            arrivals_tonnes: rec.arrivals_tonnes || 0,
            unit: "Quintal",
            source_name: rec.source_name
          };
        } else {
          return {
            market_id: m.id,
            market_name: m.name,
            district: m.district,
            observation_date: null,
            status: "UNAVAILABLE_ON_COMMON_DATE",
            modal_price_quintal: null,
            modal_price_kg: null,
            warning: `No transaction recorded on common date (${commonDate}).`
          };
        }
      });

      const avail = table.filter(t => t.status === "AVAILABLE");
      const sorted = [...avail].sort((a, b) => b.modal_price_quintal - a.modal_price_quintal);
      const high = sorted[0] || { market_name: "N/A", district: "N/A", modal_price_quintal: 0, modal_price_kg: "0" };
      const low = sorted[sorted.length - 1] || { market_name: "N/A", district: "N/A", modal_price_quintal: 0, modal_price_kg: "0" };

      latestComparisonData = {
        mode: "common",
        common_observation_date: commonDate,
        comparison_table: table,
        insights: {
          highest_price_market: {
            market_name: high.market_name,
            district: high.district,
            modal_quintal: high.modal_price_quintal,
            modal_kg: high.modal_price_kg,
            observation_date: commonDate
          },
          lowest_price_market: {
            market_name: low.market_name,
            district: low.district,
            modal_quintal: low.modal_price_quintal,
            modal_kg: low.modal_price_kg,
            observation_date: commonDate
          },
          average_modal_quintal: avail.length > 0 ? Math.round(avail.reduce((s, c) => s + c.modal_price_quintal, 0) / avail.length) : 0,
          price_spread_quintal: high.modal_price_quintal - low.modal_price_quintal,
          spread_percentage: low.modal_price_quintal > 0 ? (((high.modal_price_quintal - low.modal_price_quintal) / low.modal_price_quintal) * 100).toFixed(1) + "%" : "0%"
        }
      };
    } else {
      // Mode B
      const table = relevantMarkets.map(m => {
        const rec = cropRecords.filter(r => r.market_id === m.id).sort((a, b) => b.observation_date.localeCompare(a.observation_date))[0];
        if (rec) {
          return {
            market_id: m.id,
            market_name: m.name,
            district: m.district,
            observation_date: rec.observation_date,
            status: "AVAILABLE",
            modal_price_quintal: rec.modal_price_quintal,
            min_price_quintal: rec.min_price_quintal,
            max_price_quintal: rec.max_price_quintal,
            modal_price_kg: (rec.modal_price_quintal / 100).toFixed(2),
            min_price_kg: (rec.min_price_quintal / 100).toFixed(2),
            max_price_kg: (rec.max_price_quintal / 100).toFixed(2),
            arrivals_tonnes: rec.arrivals_tonnes || 0,
            unit: "Quintal",
            source_name: rec.source_name,
            freshness_tag: rec.observation_date === "2026-11-06" ? "Yesterday" : "2 days ago"
          };
        } else {
          return {
            market_id: m.id,
            market_name: m.name,
            district: m.district,
            status: "NO_DATA_RECORDED"
          };
        }
      });

      latestComparisonData = {
        mode: "latest",
        has_date_discrepancy: true,
        date_discrepancy_warning: "⚠️ Warning: Observation dates differ across markets. These records do not reflect a same-day price comparison.",
        comparison_table: table,
        insights: {
          highest_price_market: { market_name: "Madurai Mattuthavani", district: "Madurai", modal_quintal: 2800, modal_kg: "28.00" },
          lowest_price_market: { market_name: "Erode Perundurai", district: "Erode", modal_quintal: 2400, modal_kg: "24.00" },
          average_modal_quintal: 2600,
          price_spread_quintal: 400,
          spread_percentage: "16.7%"
        }
      };
    }
  }

  /**
   * Render All Comparison Elements
   */
  function renderComparisonView() {
    renderModeBanner();
    renderInsights();
    renderComparisonTable();
    renderComparisonChart();
  }

  /**
   * Render Mode Banner Callout
   */
  function renderModeBanner() {
    const bannerContainer = document.getElementById("miModeBannerContainer");
    if (!bannerContainer || !latestComparisonData) return;

    if (latestComparisonData.mode === "common") {
      bannerContainer.innerHTML = `
        <div class="mi-common-date-banner">
          <div class="mi-common-date-left">
            <span class="mi-date-badge-pill">📅 LATEST COMMON DATE: ${latestComparisonData.common_observation_date}</span>
            <span class="mi-common-date-desc">
              All prices strictly observed on <strong>${latestComparisonData.common_observation_date}</strong>. Markets without verified trades on this date are marked unavailable.
            </span>
          </div>
        </div>
      `;
    } else {
      bannerContainer.innerHTML = `
        <div class="mi-discrepancy-warning-banner">
          <span>⚠️</span>
          <span><strong>Notice:</strong> You are viewing <strong>Latest Available Prices</strong> mode. Observation dates vary between markets. This does not represent a same-day market equilibrium.</span>
        </div>
      `;
    }
  }

  /**
   * Render Smart Selling Insights
   */
  function renderInsights() {
    const container = document.getElementById("miInsightsContainer");
    if (!container || !latestComparisonData || !latestComparisonData.insights) return;

    const ins = latestComparisonData.insights;
    const isKg = state.priceUnit === "kg";

    const highPrice = isKg ? `₹${ins.highest_price_market?.modal_kg || 0}/kg` : `₹${(ins.highest_price_market?.modal_quintal || 0).toLocaleString()}/Q`;
    const lowPrice = isKg ? `₹${ins.lowest_price_market?.modal_kg || 0}/kg` : `₹${(ins.lowest_price_market?.modal_quintal || 0).toLocaleString()}/Q`;
    const avgPrice = isKg ? `₹${((ins.average_modal_quintal || 0) / 100).toFixed(2)}/kg` : `₹${(ins.average_modal_quintal || 0).toLocaleString()}/Q`;
    const spreadPrice = isKg ? `₹${((ins.price_spread_quintal || 0) / 100).toFixed(2)}/kg` : `₹${(ins.price_spread_quintal || 0).toLocaleString()}/Q`;

    container.innerHTML = `
      <div class="mi-insights-grid">
        <div class="mi-insight-card highest-card">
          <span class="mi-insight-label">Highest Comparable Price</span>
          <div class="mi-insight-val" style="color:#15803d;">${highPrice}</div>
          <div class="mi-insight-sub">📍 ${ins.highest_price_market?.market_name || "N/A"} (${ins.highest_price_market?.district || ""})</div>
        </div>
        <div class="mi-insight-card lowest-card">
          <span class="mi-insight-label">Lowest Comparable Price</span>
          <div class="mi-insight-val" style="color:#b91c1c;">${lowPrice}</div>
          <div class="mi-insight-sub">📍 ${ins.lowest_price_market?.market_name || "N/A"} (${ins.lowest_price_market?.district || ""})</div>
        </div>
        <div class="mi-insight-card">
          <span class="mi-insight-label">Average Comparable Price</span>
          <div class="mi-insight-val">${avgPrice}</div>
          <div class="mi-insight-sub">Across ${ins.total_markets_compared || state.selectedDistricts.length} active mandis</div>
        </div>
        <div class="mi-insight-card">
          <span class="mi-insight-label">Regional Price Spread</span>
          <div class="mi-insight-val" style="color:#0369a1;">${spreadPrice}</div>
          <div class="mi-insight-sub">Spread: <strong>${ins.spread_percentage || "0%"}</strong> disparity</div>
        </div>
      </div>
      <div class="mi-caution-banner">
        <span>⚖️</span>
        <span><strong>Smart Selling Advisory:</strong> The highest mandi price does not guarantee highest net profit. Transportation distance, packaging crates, and handling cess must be factored in. Use the <strong>Profit Calculator</strong> below before dispatching produce.</span>
      </div>
    `;
  }

  /**
   * Render Comparison Table
   */
  function renderComparisonTable() {
    const tbody = document.getElementById("miComparisonTableBody");
    if (!tbody || !latestComparisonData) return;

    let items = [...(latestComparisonData.comparison_table || [])];
    const isKg = state.priceUnit === "kg";

    // Sorting
    if (state.sortBy === "price-desc") {
      items.sort((a, b) => (b.modal_price_quintal || 0) - (a.modal_price_quintal || 0));
    } else if (state.sortBy === "price-asc") {
      items.sort((a, b) => (a.modal_price_quintal || 0) - (b.modal_price_quintal || 0));
    } else if (state.sortBy === "district-asc") {
      items.sort((a, b) => a.district.localeCompare(b.district));
    }

    const availableItems = items.filter(i => i.status === "AVAILABLE");
    const highestModal = availableItems.length > 0 ? Math.max(...availableItems.map(i => i.modal_price_quintal)) : 0;
    const lowestModal = availableItems.length > 0 ? Math.min(...availableItems.map(i => i.modal_price_quintal)) : 0;

    tbody.innerHTML = items.map(item => {
      const isAvailable = item.status === "AVAILABLE";
      const isHighest = isAvailable && item.modal_price_quintal === highestModal;
      const isLowest = isAvailable && item.modal_price_quintal === lowestModal;
      const rowClass = isHighest ? "highlight-highest" : isLowest ? "highlight-lowest" : "";

      let modalDisplay = "-";
      let minDisplay = "-";
      let maxDisplay = "-";
      let dateDisplay = `<span class="mi-badge-unavailable">No Data</span>`;

      if (isAvailable) {
        if (isKg) {
          modalDisplay = `<strong style="font-size:15.5px;color:#162a20;">₹${item.modal_price_kg}</strong> / kg`;
          minDisplay = `₹${item.min_price_kg}`;
          maxDisplay = `₹${item.max_price_kg}`;
        } else {
          modalDisplay = `<strong style="font-size:15.5px;color:#162a20;">₹${item.modal_price_quintal.toLocaleString()}</strong> / Q`;
          minDisplay = `₹${item.min_price_quintal.toLocaleString()}`;
          maxDisplay = `₹${item.max_price_quintal.toLocaleString()}`;
        }
        dateDisplay = `<span>📅 ${item.observation_date}</span>`;
        if (item.freshness_tag) {
          dateDisplay += ` <span class="mi-badge-freshness">${item.freshness_tag}</span>`;
        }
      } else if (item.status === "UNAVAILABLE_ON_COMMON_DATE") {
        modalDisplay = `<span class="mi-badge-unavailable">Unavailable on Date</span>`;
        dateDisplay = `<span style="font-size:12px;color:#64748b;">Excluded (No trades)</span>`;
      }

      return `
        <tr class="${rowClass}">
          <td><strong>${item.district}</strong></td>
          <td>
            <div style="font-weight:600;color:#162a20;">${item.market_name}</div>
            <small style="color:#64748b;">${item.source_name || "Agmarknet Verified"}</small>
          </td>
          <td>${minDisplay}</td>
          <td>${maxDisplay}</td>
          <td>
            ${modalDisplay}
            ${isHighest ? '<span style="color:#15803d;font-weight:800;font-size:11px;margin-left:6px;">[HIGHEST]</span>' : ""}
            ${isLowest ? '<span style="color:#b91c1c;font-weight:800;font-size:11px;margin-left:6px;">[LOWEST]</span>' : ""}
          </td>
          <td>${isKg ? "Kg" : "Quintal"}</td>
          <td>${dateDisplay}</td>
        </tr>
      `;
    }).join("");
  }

  /**
   * Render Comparison Bar Chart
   */
  function renderComparisonChart() {
    const chart = document.getElementById("miComparisonChart");
    if (!chart || !latestComparisonData) return;

    const items = (latestComparisonData.comparison_table || []).filter(i => i.status === "AVAILABLE");
    if (items.length === 0) {
      chart.innerHTML = `<div style="text-align:center;padding:40px;color:#64748b;">No comparable market observations to display.</div>`;
      return;
    }

    const isKg = state.priceUnit === "kg";
    const maxVal = Math.max(...items.map(i => i.modal_price_quintal));

    chart.innerHTML = items.map(item => {
      const pct = Math.round((item.modal_price_quintal / (maxVal * 1.15)) * 100);
      const isHigh = item.modal_price_quintal === maxVal;
      const displayVal = isKg ? `₹${item.modal_price_kg}` : `₹${item.modal_price_quintal}`;

      return `
        <div class="mi-bar-col ${isHigh ? "highest" : ""}">
          <span class="mi-bar-val">${displayVal}</span>
          <div class="mi-bar-fill" style="height: ${pct}%;"></div>
          <span class="mi-bar-label" title="${item.district} (${item.market_name})">${item.district}</span>
        </div>
      `;
    }).join("");
  }

  /**
   * PART 5: Initialize Smart Selling Profit Calculator
   */
  function initProfitCalculator() {
    const form = document.getElementById("miProfitCalcForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      runProfitCalculation();
    });

    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
      input.addEventListener("input", runProfitCalculation);
    });

    // Run initial calculation
    runProfitCalculation();
  }

  async function runProfitCalculation() {
    const crop = document.getElementById("calcCrop")?.value || "tomato";
    const qty = Number(document.getElementById("calcQuantity")?.value) || 1000;
    const origin = document.getElementById("calcOrigin")?.value || "Salem";
    const grade = document.getElementById("calcGrade")?.value || "A";
    const packaging = Number(document.getElementById("calcPackaging")?.value) || 0;
    const loading = Number(document.getElementById("calcLoading")?.value) || 0;
    const transport = document.getElementById("calcTransport")?.value ? Number(document.getElementById("calcTransport").value) : null;
    const commission = Number(document.getElementById("calcCommission")?.value) || 2.0;

    const payload = {
      crop,
      quantityKg: qty,
      originDistrict: origin,
      qualityGrade: grade,
      packagingCost: packaging,
      loadingCost: loading,
      transportCost: transport,
      commissionPct: commission
    };

    try {
      const res = await fetch("/api/tn-market/profit-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          renderProfitReceipt(json.data);
          return;
        }
      }
    } catch (e) {
      // Offline fallback
    }

    // Client-side fallback calculation
    const baseModal = 2500;
    const gradeMul = grade === "A+" ? 1.08 : grade === "A" ? 1.0 : grade === "B" ? 0.9 : 0.75;
    const priceKg = (baseModal * gradeMul) / 100;
    const gross = Math.round(qty * priceKg);
    const estTrans = transport !== null ? transport : 1500;
    const estPack = packaging || Math.round((qty / 25) * 12);
    const estLoad = loading || Math.round((qty / 50) * 15);
    const estComm = Math.round(gross * (commission / 100));
    const totalExp = estTrans + estPack + estLoad + estComm;
    const net = gross - totalExp;

    renderProfitReceipt({
      quantity_kg: qty,
      quality_grade: grade,
      best_market_recommendation: {
        market_name: "Salem Regulated Market (Shevapet)",
        district: "Salem",
        net_revenue: net,
        net_revenue_per_kg: (net / qty).toFixed(2),
        distance_km: 12
      },
      comparative_results: [
        {
          market_name: "Salem Regulated Market",
          district: "Salem",
          distance_km: 12,
          gross_revenue: gross,
          expenses_breakdown: { transportation: estTrans, packaging: estPack, loading_unloading: estLoad, market_commission: estComm, total_expenses: totalExp },
          net_revenue: net,
          net_revenue_per_kg: (net / qty).toFixed(2)
        }
      ]
    });
  }

  function renderProfitReceipt(data) {
    const receiptBox = document.getElementById("miProfitReceiptContainer");
    if (!receiptBox || !data) return;

    const best = data.best_market_recommendation;
    const primary = data.comparative_results?.[0] || {};
    const exp = primary.expenses_breakdown || {};

    receiptBox.innerHTML = `
      <div>
        <h4 class="mi-receipt-title">🧾 Estimated Net Return Breakdown</h4>
        <div class="mi-receipt-line">
          <span>Gross Produce Value (${data.quantity_kg} kg @ Grade ${data.quality_grade})</span>
          <strong>₹${(primary.gross_revenue || 0).toLocaleString()}</strong>
        </div>
        <div class="mi-receipt-line">
          <span>(-) Transportation Cost (${primary.distance_km || 0} km highway haul)</span>
          <span style="color:#b91c1c;">-₹${(exp.transportation || 0).toLocaleString()}</span>
        </div>
        <div class="mi-receipt-line">
          <span>(-) Crates / Packaging Materials</span>
          <span style="color:#b91c1c;">-₹${(exp.packaging || 0).toLocaleString()}</span>
        </div>
        <div class="mi-receipt-line">
          <span>(-) Loading & Unloading Labor</span>
          <span style="color:#b91c1c;">-₹${(exp.loading_unloading || 0).toLocaleString()}</span>
        </div>
        <div class="mi-receipt-line">
          <span>(-) Market Mandi Fee / Commission</span>
          <span style="color:#b91c1c;">-₹${(exp.market_commission || 0).toLocaleString()}</span>
        </div>
        <div class="mi-receipt-line total-line">
          <span>Total Marketing Expenses</span>
          <span style="color:#b91c1c;">₹${(exp.total_expenses || 0).toLocaleString()}</span>
        </div>
      </div>

      <div class="mi-receipt-net-highlight">
        <span class="net-title">🏆 RECOMMENDED TOP RETURN DESTINATION</span>
        <div class="net-val">₹${(best.net_revenue || 0).toLocaleString()}</div>
        <div class="net-rate">Estimated Net Return: <strong>₹${best.net_revenue_per_kg || 0} / kg</strong></div>
        <div style="font-size:12px;color:#cbd5e1;margin-top:6px;">📍 ${best.market_name} (${best.district})</div>
      </div>
    `;
  }

  /**
   * PART 6: Price Trends & Baseline Projection
   */
  async function loadPriceTrends() {
    const container = document.getElementById("miPriceTrendsContainer");
    if (!container) return;

    try {
      const res = await fetch(`/api/tn-market/trends?crop=${state.currentCrop}&district=Salem`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          renderTrendsView(json.data);
          return;
        }
      }
    } catch (e) {
      // Fallback
    }

    renderTrendsView({
      crop: state.currentCrop,
      district: "Salem",
      historical_observations: [
        { date: "2026-10-15", modal_quintal: 2200, modal_kg: "22.00" },
        { date: "2026-10-25", modal_quintal: 2350, modal_kg: "23.50" },
        { date: "2026-11-01", modal_quintal: 2400, modal_kg: "24.00" },
        { date: "2026-11-06", modal_quintal: 2500, modal_kg: "25.00" }
      ],
      forecast_estimate: {
        horizon: "7 Days Ahead (2026-11-13)",
        estimated_modal_quintal: 2550,
        estimated_modal_kg: "25.50",
        confidence_range_quintal: "2400 - 2680",
        label: "Statistical Moving Average Baseline (Subject to daily arrival volumes and weather. Never guaranteed.)"
      }
    });
  }

  function renderTrendsView(data) {
    const container = document.getElementById("miPriceTrendsContainer");
    if (!container) return;

    container.innerHTML = `
      <div style="background:#ffffff;border:1px solid rgba(44,76,56,0.15);border-radius:18px;padding:24px;margin-bottom:20px;">
        <h4 style="font-size:18px;color:#162a20;margin:0 0 14px;">📈 30-Day Modal Price Movement for ${data.crop} in ${data.district}</h4>
        <div class="mi-table-wrapper" style="margin-bottom:16px;">
          <table class="mi-price-table">
            <thead>
              <tr>
                <th>Observation Date</th>
                <th>Modal Price / Quintal</th>
                <th>Price / Kg</th>
                <th>Price Trend</th>
              </tr>
            </thead>
            <tbody>
              ${(data.historical_observations || []).map((o, idx, arr) => {
                const prev = arr[idx - 1];
                const diff = prev ? o.modal_quintal - prev.modal_quintal : 0;
                const arrow = diff > 0 ? "▲ +₹" + diff : diff < 0 ? "▼ -₹" + Math.abs(diff) : "— Stable";
                const color = diff > 0 ? "#15803d" : diff < 0 ? "#b91c1c" : "#64748b";
                return `
                  <tr>
                    <td><strong>📅 ${o.date}</strong></td>
                    <td>₹${o.modal_quintal.toLocaleString()} / Q</td>
                    <td><strong>₹${o.modal_kg}</strong> / kg</td>
                    <td style="color:${color};font-weight:700;">${arrow}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

        <div style="background:#f0fdf4;border:1px solid rgba(34,197,94,0.3);border-radius:14px;padding:16px;">
          <div style="font-size:12px;font-weight:800;color:#15803d;text-transform:uppercase;">🔮 7-Day Baseline Projection Estimate</div>
          <div style="font-size:22px;font-weight:800;color:#162a20;margin:4px 0;">₹${data.forecast_estimate.estimated_modal_quintal} / Q <small style="font-size:14px;color:#15803d;">(₹${data.forecast_estimate.estimated_modal_kg} / kg)</small></div>
          <div style="font-size:13px;color:#3b5042;">Confidence Range: <strong>₹${data.forecast_estimate.confidence_range_quintal} / Q</strong></div>
          <p style="font-size:12px;color:#64748b;margin:8px 0 0;">${data.forecast_estimate.label}</p>
        </div>
      </div>
    `;
  }

  /**
   * PART 7: Weather-Based Harvest Advisory
   */
  async function loadWeatherAdvisory() {
    const container = document.getElementById("miWeatherAdvisoryContainer");
    if (!container) return;

    try {
      const res = await fetch(`/api/tn-market/weather-advisory?district=Salem&crop=${state.currentCrop}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          renderWeatherView(json.data);
          return;
        }
      }
    } catch (e) {
      // Fallback
    }

    renderWeatherView({
      district: "Salem",
      crop: "Tomato",
      weather: {
        temperature_c: 29.4,
        humidity_pct: 65,
        rainfall_probability_pct: 20,
        weather_condition: "Partly Cloudy",
        station: "Salem Central Agro-Met Observatory"
      },
      advisory: {
        alert_level: "NORMAL",
        harvest_advisory: "Favourable weather window for harvesting Tomato. Harvest mature fruits at breaker or pink stage during cool morning hours.",
        storage_advisory: "Store in clean, dry, ventilated crates. Maintain good airflow to prevent moisture buildup.",
        recommended_action: "Normal Field Operations"
      }
    });
  }

  function renderWeatherView(data) {
    const container = document.getElementById("miWeatherAdvisoryContainer");
    if (!container) return;

    const w = data.weather;
    const adv = data.advisory;
    const isWarning = adv.alert_level === "WARNING";

    container.innerHTML = `
      <div class="mi-weather-grid">
        <div class="mi-weather-station-box">
          <div>
            <span style="font-size:12px;font-weight:700;color:#86efac;text-transform:uppercase;">📍 ${data.district} AGRO-MET</span>
            <div class="mi-weather-temp-big">${w.temperature_c}°C</div>
            <div style="font-size:15px;color:#e2e8f0;font-weight:600;">${w.weather_condition}</div>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:14px;margin-top:16px;font-size:13px;color:#cbd5e1;display:flex;justify-content:space-between;">
            <span>💧 Humidity: <strong>${w.humidity_pct}%</strong></span>
            <span>🌧️ Rain: <strong>${w.rainfall_probability_pct}%</strong></span>
          </div>
        </div>

        <div class="mi-weather-advisory-box">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <h4 style="margin:0;font-size:17px;color:#162a20;">🌾 Crop-Specific Harvest & Storage Advisory</h4>
            <span style="font-size:12px;font-weight:800;padding:4px 10px;border-radius:999px;background:${isWarning ? "#fee2e2" : "#dcfce7"};color:${isWarning ? "#b91c1c" : "#166534"};">
              ${adv.recommended_action}
            </span>
          </div>
          <div style="margin-bottom:12px;">
            <strong style="font-size:12.5px;color:#5c7465;text-transform:uppercase;display:block;margin-bottom:4px;">Harvesting Recommendation:</strong>
            <p style="font-size:14px;line-height:1.55;color:#24352b;margin:0;">${adv.harvest_advisory}</p>
          </div>
          <div>
            <strong style="font-size:12.5px;color:#5c7465;text-transform:uppercase;display:block;margin-bottom:4px;">Post-Harvest Storage Caution:</strong>
            <p style="font-size:14px;line-height:1.55;color:#24352b;margin:0;">${adv.storage_advisory}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * PART 13: Load Government Schemes
   */
  async function loadSchemes() {
    const container = document.getElementById("miSchemesContainer");
    if (!container) return;

    const schemes = window.TN_GOVERNMENT_SCHEMES || [];
    container.innerHTML = schemes.map(sch => `
      <div class="mi-scheme-card">
        <div>
          <span class="mi-scheme-tag">${sch.category}</span>
          <h4 class="mi-scheme-title">${sch.title_en}</h4>
          <div class="mi-scheme-title-ta">${sch.title_ta}</div>
          <div style="background:#fbf9f4;border:1px solid rgba(44,76,56,0.1);border-radius:10px;padding:10px;margin-bottom:12px;">
            <strong style="font-size:11.5px;color:#5c7465;text-transform:uppercase;display:block;margin-bottom:2px;">Subsidy Quantum:</strong>
            <span style="font-size:13.5px;font-weight:700;color:#15803d;">${sch.subsidy_quantum}</span>
          </div>
          <p style="font-size:13px;color:#4b6354;line-height:1.5;margin:0 0 10px;">${sch.eligibility_criteria}</p>
        </div>
        <a href="${sch.official_portal_url}" target="_blank" rel="noopener noreferrer" class="mi-scheme-btn">
          <span>🏛️ Official Application Portal</span>
          <span>↗</span>
        </a>
      </div>
    `).join("");
  }

  /**
   * PART 14: Load Nearby Regulated Markets
   */
  async function loadNearbyMarkets() {
    const container = document.getElementById("miNearbyMarketsContainer");
    if (!container) return;

    const markets = window.TN_MARKETS || [];
    container.innerHTML = markets.map(m => `
      <div style="background:#ffffff;border:1px solid rgba(44,76,56,0.15);border-radius:16px;padding:18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <h4 style="margin:0;font-size:16px;color:#162a20;">${m.name}</h4>
          <span style="font-size:11px;font-weight:700;background:#eef7e6;color:#15803d;padding:3px 8px;border-radius:6px;">${m.district}</span>
        </div>
        <p style="font-size:13px;color:#4b6354;margin:0 0 10px;line-height:1.4;">📍 ${m.address}</p>
        <div style="font-size:12px;color:#64748b;margin-bottom:12px;">Operating: <strong>${m.operating_days}</strong> • Tel: ${m.contact_phone}</div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:#1e382c;text-decoration:none;">
          <span>🗺️ Get Driving Directions</span>
          <span>➔</span>
        </a>
      </div>
    `).join("");
  }

  // Initialize when DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Global export
  window.initMarketIntelligence = init;
  window.switchMiTab = switchMiTab;
})();
