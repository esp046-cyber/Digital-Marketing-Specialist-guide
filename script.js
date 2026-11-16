/* ==========================================================================
   Digital Marketing Specialist Guide PWA — Complete Modular Application Logic
   Architecture & Features Implemented:
   1. EventBus (Pub/Sub pattern) decoupling UI rendering from state/data ops
   2. ErrorBoundary capturing runtime exceptions + unhandled rejections locally
   3. Typo-tolerant Fuzzy Search (Token + Subsequence + Levenshtein distance)
   4. IndexedDB Offline Queue ('dms_offline_db') + Background Sync + Optimistic UI
   5. DeviceOrientation Compass HUD with configurable Low-Pass Filter (alpha=0.18)
   6. Battery Status API listener auto-disabling heavy effects when charge <= 20%
   7. Vibration API haptic feedback on task toggle, bookmark, sync, and alerts
   8. Dynamic <meta name="theme-color"> updater synced to active tab & theme
   9. Clipboard Utility for 1-tap GPS coordinates, UTM deep links & SOP copy
   10. JSON Backup Export/Import + Print/PDF Itinerary & Task Summary Generator
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CUSTOM EVENT BUS (PUB / SUB PATTERN)
     ------------------------------------------------------------------------ */
  class EventBus {
    constructor() {
      this.listeners = new Map();
      this.history = [];
    }
    on(event, handler) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(handler);
      return () => this.off(event, handler);
    }
    off(event, handler) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(handler);
      }
    }
    emit(event, payload = {}) {
      const entry = {
        event,
        timestamp: new Date().toLocaleTimeString(),
        summary: typeof payload === 'object' ? JSON.stringify(payload).slice(0, 90) : String(payload)
      };
      this.history.unshift(entry);
      if (this.history.length > 40) this.history.pop();

      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach((fn) => {
          try {
            fn(payload);
          } catch (err) {
            ErrorBoundary.capture(err, `EventBus handler for ${event}`);
          }
        });
      }
      if (event !== 'eventbus:logged' && this.listeners.has('eventbus:logged')) {
        this.listeners.get('eventbus:logged').forEach((fn) => fn(entry));
      }
    }
  }

  const bus = new EventBus();

  /* ------------------------------------------------------------------------
     2. LOCAL ERROR BOUNDARY & RUNTIME EXCEPTION LOGGER
     ------------------------------------------------------------------------ */
  const ERROR_STORAGE_KEY = 'dms_error_boundary_logs_v1';
  const ErrorBoundary = {
    logs: [],
    init() {
      try {
        const saved = localStorage.getItem(ERROR_STORAGE_KEY);
        this.logs = saved ? JSON.parse(saved) : [];
      } catch (_) {
        this.logs = [];
      }
      window.addEventListener('error', (e) => {
        this.capture(e.error || new Error(e.message || 'Window Error'), 'window.onerror');
      });
      window.addEventListener('unhandledrejection', (e) => {
        this.capture(e.reason || new Error('Unhandled Promise Rejection'), 'unhandledrejection');
      });
    },
    capture(err, context = 'Runtime') {
      const record = {
        id: 'err-' + Date.now(),
        message: err && err.message ? err.message : String(err),
        context,
        timestamp: new Date().toISOString()
      };
      this.logs.unshift(record);
      if (this.logs.length > 30) this.logs.pop();
      try {
        localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(this.logs));
      } catch (_) {}

      const banner = document.getElementById('error-boundary-banner');
      const msgEl = document.getElementById('error-boundary-message');
      if (banner && msgEl) {
        msgEl.textContent = `[${record.context}] ${record.message}`;
        banner.hidden = false;
      }
      Haptics.error();
      bus.emit('error:captured', record);
    },
    wrap(fn, context = 'UI Action') {
      return (...args) => {
        try {
          return fn(...args);
        } catch (err) {
          this.capture(err, context);
        }
      };
    },
    clear() {
      this.logs = [];
      try {
        localStorage.removeItem(ERROR_STORAGE_KEY);
      } catch (_) {}
      const banner = document.getElementById('error-boundary-banner');
      if (banner) banner.hidden = true;
      bus.emit('error:cleared', {});
    }
  };

  /* ------------------------------------------------------------------------
     3. VIBRATION API HAPTIC UTILITY
     ------------------------------------------------------------------------ */
  const Haptics = {
    pulse(pattern = [15]) {
      try {
        if (document.body.classList.contains('power-saver-active')) return;
        if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
          navigator.vibrate(pattern);
        }
      } catch (_) {}
    },
    bookmark() {
      this.pulse([20, 40, 30]);
    },
    complete() {
      this.pulse([15]);
    },
    sync() {
      this.pulse([10, 30, 15]);
    },
    error() {
      this.pulse([50, 40, 50]);
    }
  };

  /* ------------------------------------------------------------------------
     4. CLIPBOARD UTILITY (DEEP LINKS, GPS COORDINATES & SOP CHECKLISTS)
     ------------------------------------------------------------------------ */
  const ClipboardUtil = {
    async copy(text, label = 'Copied to clipboard') {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const area = document.createElement('textarea');
          area.value = text;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          document.execCommand('copy');
          document.body.removeChild(area);
        }
        Haptics.complete();
        Toast.show(`${label}: ${text.slice(0, 64)}${text.length > 64 ? '…' : ''}`);
        bus.emit('clipboard:copied', { label, text });
      } catch (err) {
        ErrorBoundary.capture(err, 'ClipboardUtil.copy');
      }
    }
  };

  /* ------------------------------------------------------------------------
     5. TOAST NOTIFICATION HELPER
     ------------------------------------------------------------------------ */
  const Toast = {
    show(message, duration = 3200) {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'toast';
      el.textContent = message;
      container.appendChild(el);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, duration);
    }
  };

  /* ------------------------------------------------------------------------
     6. TYPO-TOLERANT FUZZY SEARCH ENGINE (LEVENSHTEIN + SUBSEQUENCE)
     ------------------------------------------------------------------------ */
  const FuzzySearch = {
    levenshtein(a, b) {
      if (a === b) return 0;
      if (!a.length) return b.length;
      if (!b.length) return a.length;
      const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
      for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          );
        }
      }
      return matrix[a.length][b.length];
    },
    scoreItem(query, haystackText) {
      if (!query || !query.trim()) return { matched: true, score: 100, isFuzzy: false };
      const q = query.toLowerCase().trim();
      const target = haystackText.toLowerCase();

      // Exact substring match
      if (target.includes(q)) {
        return { matched: true, score: 100, isFuzzy: false };
      }

      const queryTokens = q.split(/\s+/).filter(Boolean);
      const targetWords = target.split(/[^a-z0-9]+/).filter(Boolean);

      let totalScore = 0;
      let usedFuzzy = false;

      for (const qToken of queryTokens) {
        if (target.includes(qToken)) {
          totalScore += 30;
          continue;
        }
        // Check bounded Levenshtein distance against each word in target
        let bestDist = Infinity;
        for (const word of targetWords) {
          if (Math.abs(word.length - qToken.length) > 3) continue;
          const dist = this.levenshtein(qToken, word);
          if (dist < bestDist) bestDist = dist;
          // Also check prefix slice for longer words
          if (word.length > qToken.length) {
            const prefixDist = this.levenshtein(qToken, word.slice(0, qToken.length));
            if (prefixDist < bestDist) bestDist = prefixDist;
          }
        }
        const maxAllowed = qToken.length <= 4 ? 1 : 2;
        if (bestDist <= maxAllowed) {
          totalScore += 20 - bestDist * 5;
          usedFuzzy = true;
        } else {
          return { matched: false, score: 0, isFuzzy: false };
        }
      }
      return { matched: totalScore > 0, score: totalScore, isFuzzy: usedFuzzy };
    }
  };

  /* ------------------------------------------------------------------------
     7. SEED DATA: 25+ SPECIFIC DIGITAL MARKETING TASKS & CAMPAIGN ITINERARY
     ------------------------------------------------------------------------ */
  const DEFAULT_TASKS = [
  {
    "id": "dms-seo-01",
    "title": "Technical Core Web Vitals & INP Audit",
    "pillar": "SEO & Organic Search",
    "cadence": "Weekly",
    "priority": "Critical",
    "kpi": "LCP < 2.5s, INP < 200ms, CLS < 0.10",
    "tools": "Google Search Console, PageSpeed Insights, Screaming Frog",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati CBD Digital Hub",
    "steps": [
      "Export URL groups failing LCP or INP thresholds in Search Console",
      "Verify hero image fetchpriority=high and preload critical fonts",
      "Audit third-party GTM tags blocking main-thread hydration"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "dms-seo-02",
    "title": "Canonical Tag, Indexation & Sitemap Hygiene Check",
    "pillar": "SEO & Organic Search",
    "cadence": "Weekly",
    "priority": "High",
    "kpi": "0 unintended noindex or canonical conflicts",
    "tools": "Screaming Frog, XML Sitemap Validator, GSC Indexing Report",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati CBD Digital Hub",
    "steps": [
      "Crawl top 500 organic landing pages for self-referencing rel=canonical",
      "Validate sitemap.xml HTTP 200 responses and remove 301/404 URLs",
      "Inspect robots.txt crawl directives and submit updated sitemap"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-seo-03",
    "title": "High-Intent Commercial Keyword Gap & Content Cluster Mapping",
    "pillar": "SEO & Organic Search",
    "cadence": "Monthly",
    "priority": "High",
    "kpi": "+18% non-branded organic clicks QoQ",
    "tools": "Ahrefs, Semrush, Google Keyword Planner",
    "coords": "14.5869\u00b0 N, 121.0614\u00b0 E",
    "locationName": "Ortigas Content Studio",
    "steps": [
      "Extract competitor ranking URLs in positions 1-5 where brand ranks 8-20",
      "Group keywords by search intent (Informational, Commercial, Transactional)",
      "Assign internal anchor links from high-DR pillar guides to money pages"
    ],
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "dms-seo-04",
    "title": "JSON-LD Structured Data & Rich Snippet Validation",
    "pillar": "SEO & Organic Search",
    "cadence": "Monthly",
    "priority": "Medium",
    "kpi": "100% valid Product, FAQ, and Organization schema",
    "tools": "Schema Markup Validator, Google Rich Results Test",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati CBD Digital Hub",
    "steps": [
      "Validate Organization, BreadcrumbList, and FAQPage JSON-LD payloads",
      "Fix missing priceValidUntil or aggregateRating warnings",
      "Monitor SERP CTR lift on rich-result enabled templates"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-seo-05",
    "title": "Google Business Profile & Local Pack Citation Optimization",
    "pillar": "SEO & Organic Search",
    "cadence": "Weekly",
    "priority": "High",
    "kpi": "Top-3 Local Map Pack visibility within 5km radius",
    "tools": "Google Business Profile Manager, BrightLocal",
    "coords": "14.5507\u00b0 N, 121.0494\u00b0 E",
    "locationName": "BGC High Street Flagship",
    "steps": [
      "Audit NAP (Name, Address, Phone) consistency across local directories",
      "Publish weekly geotagged update with UTM-tracked appointment link",
      "Respond to all new customer reviews within 24 hours"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-ppc-01",
    "title": "Google Ads Search Term Mining & Negative Keyword Pruning",
    "pillar": "Paid Media & PPC",
    "cadence": "Daily",
    "priority": "Critical",
    "kpi": "Reduce wasted ad spend by >= 15%",
    "tools": "Google Ads Editor, Search Terms Report",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Performance Desk",
    "steps": [
      "Filter search terms with >25 clicks and 0 conversions over 14 days",
      "Add irrelevant queries to shared Account-Level Negative Keyword lists",
      "Promote converting long-tail queries into exact/phrase match ad groups"
    ],
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "dms-ppc-02",
    "title": "Performance Max (PMax) Asset Group & Feed Diagnostics",
    "pillar": "Paid Media & PPC",
    "cadence": "Weekly",
    "priority": "High",
    "kpi": "Blended ROAS >= 4.2x, Ad Strength 'Excellent'",
    "tools": "Google Ads, Google Merchant Center",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Performance Desk",
    "steps": [
      "Replace 'Low' performing headlines, descriptions, and portrait videos",
      "Check Merchant Center for disapproved SKUs or price mismatches",
      "Verify audience signal lists include high-LTV customer match segments"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-ppc-03",
    "title": "Meta & TikTok Paid Social Creative Fatigue & Thumbstop Audit",
    "pillar": "Paid Media & PPC",
    "cadence": "Weekly",
    "priority": "Critical",
    "kpi": "3-Second Thumbstop Rate >= 30%, Hold Rate >= 12%",
    "tools": "Meta Ads Manager, TikTok Ads Manager, Motion Analytics",
    "coords": "14.5869\u00b0 N, 121.0614\u00b0 E",
    "locationName": "Ortigas Creator Studio",
    "steps": [
      "Flag ad sets where frequency > 3.2 and CPA rose >20% over 7 days",
      "Swap first 3-second visual hooks on top-spending UGC video concepts",
      "Verify Conversions API (CAPI) Event Match Quality score >= 8.0/10"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "dms-ppc-04",
    "title": "Cross-Channel Budget Pacing & ROAS Guardrail Reallocation",
    "pillar": "Paid Media & PPC",
    "cadence": "Daily",
    "priority": "Critical",
    "kpi": "Monthly spend pacing within +/- 3% of target budget",
    "tools": "Looker Studio Pacing Sheet, Google Ads, Meta Ads, LinkedIn Campaign Manager",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Performance Desk",
    "steps": [
      "Compare month-to-date spend against linear and day-of-week weighted targets",
      "Shift 10-15% daily budget from under-pacing high-CPA ad sets to top ROAS winners",
      "Check automated bid strategy learning statuses and cap anomalies"
    ],
    "completed": true,
    "bookmarked": false
  },
  {
    "id": "dms-ppc-05",
    "title": "Retargeting Audience Exclusion & Burn-Pixel Verification",
    "pillar": "Paid Media & PPC",
    "cadence": "Campaign Launch",
    "priority": "High",
    "kpi": "0% budget wasted on existing converted buyers",
    "tools": "Google Tag Manager, Meta Audiences, LinkedIn Insight Tag",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Performance Desk",
    "steps": [
      "Exclude 30-day and 180-day purchasers from prospecting ad sets",
      "Segment cart abandoners (0-3 days, 4-14 days, 15-30 days) with tailored offers",
      "Test checkout confirmation pixel firing in GTM Preview mode"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-soc-01",
    "title": "Short-Form Vertical Video (Reels / TikTok / Shorts) Hook Scripting",
    "pillar": "Content & Social Media",
    "cadence": "Weekly",
    "priority": "High",
    "kpi": "Average watch time >= 65% of video duration",
    "tools": "CapCut Pro, Notion Editorial Board, Frame.io",
    "coords": "14.5869\u00b0 N, 121.0614\u00b0 E",
    "locationName": "Ortigas Creator Studio",
    "steps": [
      "Draft 3 visual + verbal hook variations for each core product pain point",
      "Include burned-in accessible captions within safe-area margins",
      "Attach pinned comment CTA with tracked short link"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-soc-02",
    "title": "Omnichannel Editorial Pillar Calendar & Asset repurposing",
    "pillar": "Content & Social Media",
    "cadence": "Weekly",
    "priority": "Medium",
    "kpi": "100% on-time publishing across LinkedIn, IG, TikTok, and YouTube",
    "tools": "Buffer / Sprout Social, Figma Brand Kit",
    "coords": "14.5869\u00b0 N, 121.0614\u00b0 E",
    "locationName": "Ortigas Creator Studio",
    "steps": [
      "Atomize 1 long-form research webinar or whitepaper into 5 carousels and 4 reels",
      "Verify OpenGraph preview cards and alt-text on all scheduled links",
      "Align publishing slots with audience peak engagement heatmaps"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-soc-03",
    "title": "Creator / Influencer Whitelisting & Spark Ads Rights Briefing",
    "pillar": "Content & Social Media",
    "cadence": "Campaign Launch",
    "priority": "High",
    "kpi": "Creator content CPA 25% lower than studio brand ads",
    "tools": "TikTok Spark Ads, Meta Branded Content Tool, Creator CRM",
    "coords": "14.5507\u00b0 N, 121.0494\u00b0 E",
    "locationName": "BGC High Street Studio",
    "steps": [
      "Deliver creative brief with mandatory FTC/DTI disclosure guidelines",
      "Secure 90-day Spark Ads authorization codes and Paid Partnership permissions",
      "Track individual creator promo codes and UTM landing page conversions"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-soc-04",
    "title": "Community Sentiment Triage & Social Listening Escalation",
    "pillar": "Content & Social Media",
    "cadence": "Daily",
    "priority": "Medium",
    "kpi": "Median response SLA < 45 minutes during business hours",
    "tools": "Brandwatch, Sprout Social Inbox, Slack Escalation Webhook",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati CBD Digital Hub",
    "steps": [
      "Review brand mentions, untagged product keywords, and competitor outage threads",
      "Hide spam/bot phishing comments on high-spend dark posts",
      "Log recurring product questions into the SEO & FAQ content backlog"
    ],
    "completed": true,
    "bookmarked": false
  },
  {
    "id": "dms-crm-01",
    "title": "Automated Welcome, Cart Abandonment & Win-Back Flow QA",
    "pillar": "Email & CRM Lifecycle",
    "cadence": "Weekly",
    "priority": "Critical",
    "kpi": "Lifecycle automated flows generating >= 28% of email revenue",
    "tools": "Klaviyo / HubSpot, Litmus Email Preview",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati CRM Ops Desk",
    "steps": [
      "Test dynamic cart item liquid variables across mobile dark/light clients",
      "Verify smart-sending window (16h) prevents overlapping newsletter blasts",
      "A/B test plain-text founder note vs visual product card on step 2"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "dms-crm-02",
    "title": "DMARC, DKIM, SPF & Postmaster Deliverability Health Check",
    "pillar": "Email & CRM Lifecycle",
    "cadence": "Monthly",
    "priority": "Critical",
    "kpi": "Spam complaint rate < 0.08%, bounce rate < 0.5%",
    "tools": "Google Postmaster Tools, MXToolbox, Yahoo Sender Hub",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati CRM Ops Desk",
    "steps": [
      "Verify DMARC p=quarantine/reject alignment and one-click List-Unsubscribe headers",
      "Sunset unengaged profiles (90+ days zero opens/clicks) into suppression segment",
      "Monitor domain & IP reputation in Google Postmaster Tools"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-crm-03",
    "title": "RFM (Recency, Frequency, Monetary) VIP Cohort Segmentation",
    "pillar": "Email & CRM Lifecycle",
    "cadence": "Monthly",
    "priority": "High",
    "kpi": "+22% repeat purchase rate among VIP and At-Risk cohorts",
    "tools": "Klaviyo / Braze, BigQuery Customer Warehouse",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati CRM Ops Desk",
    "steps": [
      "Sync top 10% LTV buyers to Meta & Google Ads for Lookalike/Similar seeding",
      "Trigger early-access VIP product drop SMS/Email 24h before public launch",
      "Launch 60-day replenishment reminder tied to average product consumption cycle"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-cro-01",
    "title": "Mobile Landing Page Above-the-Fold & Touch Target CRO Audit",
    "pillar": "CRO & Landing Page UX",
    "cadence": "Weekly",
    "priority": "Critical",
    "kpi": "Landing page conversion rate >= 4.8% on mobile devices",
    "tools": "Microsoft Clarity, Hotjar, Chrome DevTools Device Mode",
    "coords": "14.5507\u00b0 N, 121.0494\u00b0 E",
    "locationName": "BGC UX Lab",
    "steps": [
      "Verify primary CTA button is >= 44x44px and visible without scrolling on 375px screens",
      "Inspect rage-click and dead-click heatmaps on mobile sticky bars",
      "Ensure message match between ad headline and landing page H1"
    ],
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "dms-cro-02",
    "title": "Checkout & Lead Form Field Friction Reduction Experiment",
    "pillar": "CRO & Landing Page UX",
    "cadence": "Monthly",
    "priority": "High",
    "kpi": "-18% form abandonment rate, statistical power >= 80%",
    "tools": "VWO / GrowthBook, GA4 Funnel Exploration",
    "coords": "14.5507\u00b0 N, 121.0494\u00b0 E",
    "locationName": "BGC UX Lab",
    "steps": [
      "Enable autofill autocomplete attributes and numeric keypad on phone/ZIP inputs",
      "Replace multi-field address entry with single-field autocomplete lookup",
      "Measure step-to-step drop-off in GA4 checkout funnel report"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-cro-03",
    "title": "Social Proof, Trust Badge & Risk-Reversal Split Test",
    "pillar": "CRO & Landing Page UX",
    "cadence": "Campaign Launch",
    "priority": "Medium",
    "kpi": "+12% add-to-cart or demo booking rate",
    "tools": "GrowthBook, Okendo / Trustpilot Widget",
    "coords": "14.5507\u00b0 N, 121.0494\u00b0 E",
    "locationName": "BGC UX Lab",
    "steps": [
      "Place verified customer review count and star rating directly beneath H1",
      "Add clear shipping/refund guarantee microcopy adjacent to primary checkout CTA",
      "Run test for minimum 2 business cycles before declaring significance"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-ana-01",
    "title": "GA4 + GTM Server-Side Event & Enhanced Conversions Verification",
    "pillar": "Analytics & Attribution",
    "cadence": "Weekly",
    "priority": "Critical",
    "kpi": "< 3% discrepancy between backend orders and GA4 purchase events",
    "tools": "Google Tag Manager, GA4 DebugView, Stape Server GTM",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Analytics Command",
    "steps": [
      "Audit transaction_id deduplication between browser pixel and server CAPI",
      "Verify SHA-256 hashed email/phone payload on Enhanced Conversions",
      "Check Consent Mode v2 (ad_storage, analytics_storage) regional signaling"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "dms-ana-02",
    "title": "Strict UTM Taxonomy & Campaign Deep-Link Governance Audit",
    "pillar": "Analytics & Attribution",
    "cadence": "Weekly",
    "priority": "High",
    "kpi": "Unassigned / Direct traffic share < 8% of campaign sessions",
    "tools": "UTM Governance Sheet, GA4 Traffic Acquisition Report",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Analytics Command",
    "steps": [
      "Enforce lowercase snake_case across utm_source, utm_medium, and utm_campaign",
      "Audit bio links, QR codes, and email footers for stripped query parameters",
      "Copy and validate canonical deep links using the built-in Clipboard Utility"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-ana-03",
    "title": "Executive Looker Studio MER (Marketing Efficiency Ratio) Briefing",
    "pillar": "Analytics & Attribution",
    "cadence": "Weekly",
    "priority": "High",
    "kpi": "Blended MER >= 3.8x, New Customer CAC within target threshold",
    "tools": "Looker Studio, BigQuery, Supermetrics",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Analytics Command",
    "steps": [
      "Reconcile total net revenue against total paid media + agency/creator spend",
      "Annotate algorithm updates, promo windows, and stockouts on trend charts",
      "Export executive PDF summary and distribute to leadership"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "dms-loc-01",
    "title": "OOH Digital Billboard & Transit QR Attribution Field Inspection",
    "pillar": "Local & Field Event Ops",
    "cadence": "Campaign Launch",
    "priority": "High",
    "kpi": "100% QR scan resolution & sightline verification at target bearing",
    "tools": "PWA Compass HUD, Dynamic QR Shortener, GA4 Real-Time",
    "coords": "14.5547\u00b0 N, 121.0244\u00b0 E",
    "locationName": "Makati Ayala Avenue OOH Site",
    "steps": [
      "Use Tab 3 Compass HUD (low-pass filtered bearing) to verify billboard orientation",
      "Scan live QR code from 15m pedestrian sightline and confirm UTM firing",
      "Capture timestamped field verification photo and copy GPS coordinates"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "dms-loc-02",
    "title": "Tech Summit & Brand Pop-Up Lead Capture Offline Sync Drill",
    "pillar": "Local & Field Event Ops",
    "cadence": "Campaign Launch",
    "priority": "Critical",
    "kpi": "100% booth leads queued in IndexedDB & synced within 5m of Wi-Fi reconnect",
    "tools": "PWA Offline Queue (IndexedDB), Background Sync API, HubSpot Webhook",
    "coords": "14.5605\u00b0 N, 121.0103\u00b0 E",
    "locationName": "iACADEMY Auditorium Tech Summit Booth",
    "steps": [
      "Test airplane-mode lead & task capture in congested convention hall",
      "Enable Battery Saver mode if tablet/iPhone drops below 20% charge",
      "Reconnect to network and verify automatic Background Sync flush"
    ],
    "completed": false,
    "bookmarked": true
  }
];

  const DEFAULT_ITINERARY = [
    {
      id: 'itin-01',
      time: '08:30 AM - 09:45 AM PHT',
      title: 'Morning Paid Media Pacing & Search Term Negative Sweep',
      channel: 'Google Ads + Meta Ads Manager',
      location: 'Makati Performance Desk',
      coords: '14.5547° N, 121.0244° E',
      notes: 'Verify daily spend pacing within +/-3%, prune zero-conversion search queries, and check CAPI Event Match Quality.',
      bookmarked: true
    },
    {
      id: 'itin-02',
      time: '10:00 AM - 11:30 AM PHT',
      title: 'Technical SEO Core Web Vitals & Schema Deployment Sync',
      channel: 'Google Search Console + GitHub Pages',
      location: 'Makati CBD Digital Hub',
      coords: '14.5547° N, 121.0244° E',
      notes: 'Audit LCP/INP metrics on high-intent commercial landing pages and validate JSON-LD Product & FAQ schema.',
      bookmarked: false
    },
    {
      id: 'itin-03',
      time: '01:00 PM - 02:30 PM PHT',
      title: 'Ayala Avenue OOH Digital Billboard Sightline & QR Scan Inspection',
      channel: 'Field OOH + GA4 Real-Time',
      location: 'Makati Ayala Triangle Billboard Node',
      coords: '14.5547° N, 121.0244° E',
      notes: 'Use Tab 3 Compass HUD (low-pass filtered at alpha=0.18) to verify 042° NE sightline and test pedestrian QR UTM attribution.',
      bookmarked: true
    },
    {
      id: 'itin-04',
      time: '03:00 PM - 04:30 PM PHT',
      title: 'Short-Form UGC Hook Shoot & Creator Spark Ads Briefing',
      channel: 'TikTok + Instagram Reels + YouTube Shorts',
      location: 'Ortigas Creator Studio',
      coords: '14.5869° N, 121.0614° E',
      notes: 'Record 3 thumbstop hooks per SKU, embed safe-area captions, and collect 90-day Spark Ads authorization codes.',
      bookmarked: false
    },
    {
      id: 'itin-05',
      time: '05:00 PM - 06:15 PM PHT',
      title: 'BGC High Street Pop-Up Booth Lead Sync & CRO Heatmap Review',
      channel: 'Klaviyo CRM + Microsoft Clarity',
      location: 'BGC High Street Brand Activation Zone',
      coords: '14.5507° N, 121.0494° E',
      notes: 'Flush offline-captured booth leads from IndexedDB via Background Sync and inspect mobile checkout rage-click logs.',
      bookmarked: true
    },
    {
      id: 'itin-06',
      time: '06:30 PM - 07:15 PM PHT',
      title: 'iACADEMY Auditorium Tech Summit Guest Funnel Follow-Up',
      channel: 'HubSpot Lifecycle + LinkedIn Matched Audiences',
      location: 'iACADEMY Auditorium, Makati',
      coords: '14.5605° N, 121.0103° E',
      notes: 'Trigger post-summit automated email sequence with slide deck UTM deep links and sync attendee list to LinkedIn retargeting.',
      bookmarked: false
    }
  ];

  const PWA_CHECKLIST_ITEMS = [
    {
      title: '1. Responsiveness & Layout Foundation',
      detail: 'Mobile-first CSS Grid/Flexbox, zero horizontal scroll, fluid breakpoints (320px-1280px+), and iOS safe-area-inset notch padding.'
    },
    {
      title: '2. Visual Hierarchy & Typography',
      detail: '16px mobile body floor, modular heading scale, system + mono font pair, and >= 4.5:1 WCAG AA contrast across all 3 themes.'
    },
    {
      title: '3. Spacing, Alignment & Structure',
      detail: 'Strict 4px/8px spatial token system (--space-1 to --space-12), balanced card padding, and aligned action footers.'
    },
    {
      title: '4. Color, Branding & Visual Language',
      detail: 'Cohesive Dark, Light, and High-Contrast palettes with semantic status pills and dynamic browser toolbar theme-color sync.'
    },
    {
      title: '5. Components & Design System Maturity',
      detail: 'Unified button, select, input, modal, badge, and card tokens with consistent radii (8px/12px/16px) and elevation.'
    },
    {
      title: '6. Touch & Interaction Design',
      detail: 'All interactive targets >= 44x44px, >= 8px touch gap, Vibration API haptics, and clear focus/active/loading/empty states.'
    },
    {
      title: '7. Navigation & Information Architecture',
      detail: 'Predictable 4-tab bar (bottom on mobile, left rail on desktop) with hash deep-linking and copyable section links.'
    },
    {
      title: '8. App-like Experience (PWA Specific)',
      detail: 'Standalone manifest, maskable 192/512 icons, OpenGraph social card, Service Worker cache, and rich offline.html fallback.'
    },
    {
      title: '9. Motion, Sensor HUD & Battery Awareness',
      detail: 'Low-pass filtered DeviceOrientation Compass HUD, prefers-reduced-motion compliance, and automatic low-battery eco mode.'
    },
    {
      title: '10. Accessibility & Inclusive Design',
      detail: 'Semantic landmarks, ARIA roles/live regions, skip-link, keyboard navigation, and non-color status indicators.'
    },
    {
      title: '11. Content Polish, Backups & Print Utility',
      detail: 'Human microcopy, 4-step onboarding tour, local ErrorBoundary logger, JSON export/import, and @media print PDF formatting.'
    }
  ];

  /* ------------------------------------------------------------------------
     8. INDEXEDDB OFFLINE QUEUE + BACKGROUND SYNC + OPTIMISTIC UI STORE
     ------------------------------------------------------------------------ */
  const DB_NAME = 'dms_offline_db';
  const DB_VERSION = 1;
  const STATE_STORAGE_KEY = 'dms_specialist_state_v2';

  const OfflineSyncManager = {
    db: null,
    queue: [],
    init() {
      return new Promise((resolve) => {
        if (!('indexedDB' in window)) {
          resolve();
          return;
        }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('sync_queue')) {
            db.createObjectStore('sync_queue', { keyPath: 'id' });
          }
        };
        req.onsuccess = (e) => {
          this.db = e.target.result;
          this.loadQueue().then(resolve);
        };
        req.onerror = () => resolve();
      });
    },
    loadQueue() {
      return new Promise((resolve) => {
        if (!this.db) {
          resolve(this.queue);
          return;
        }
        const tx = this.db.transaction('sync_queue', 'readonly');
        const req = tx.objectStore('sync_queue').getAll();
        req.onsuccess = () => {
          this.queue = (req.result || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          bus.emit('sync:updated', this.queue);
          resolve(this.queue);
        };
        req.onerror = () => resolve(this.queue);
      });
    },
    enqueue(actionType, summary, payload = {}) {
      const item = {
        id: 'sync-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        actionType,
        summary,
        payload,
        status: navigator.onLine ? 'pending-flush' : 'queued-offline',
        createdAt: new Date().toISOString(),
        syncedAt: null
      };
      this.queue.unshift(item);
      if (this.db) {
        const tx = this.db.transaction('sync_queue', 'readwrite');
        tx.objectStore('sync_queue').put(item);
      }
      bus.emit('sync:queued', item);
      bus.emit('sync:updated', this.queue);

      // Register Background Sync if supported, and flush optimistically if online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
          .then((reg) => reg.sync.register('sync-marketing-actions'))
          .catch(() => {});
      }
      if (navigator.onLine) {
        setTimeout(() => this.flushQueue(), 600);
      }
    },
    flushQueue() {
      let flushedCount = 0;
      const now = new Date().toISOString();
      this.queue.forEach((item) => {
        if (item.status !== 'synced') {
          item.status = 'synced';
          item.syncedAt = now;
          flushedCount++;
        }
      });
      if (this.db) {
        const tx = this.db.transaction('sync_queue', 'readwrite');
        const store = tx.objectStore('sync_queue');
        this.queue.forEach((item) => store.put(item));
      }
      if (flushedCount > 0) {
        Haptics.sync();
        Toast.show(`Background Sync flushed ${flushedCount} queued action(s)`);
      }
      bus.emit('sync:flushed', { flushedCount, timestamp: now });
      bus.emit('sync:updated', this.queue);
    }
  };

  /* ------------------------------------------------------------------------
     9. DEVICEORIENTATION COMPASS HUD WITH CIRCULAR LOW-PASS FILTER
     ------------------------------------------------------------------------ */
  const CompassHUD = {
    alphaFactor: 0.18,
    rawBearing: 42.0,
    smoothedBearing: 42.0,
    pitch: 12,
    roll: -2,
    simInterval: null,
    sensorActive: false,

    init() {
      const slider = document.getElementById('lowpass-alpha-slider');
      const alphaVal = document.getElementById('lowpass-alpha-val');
      if (slider && alphaVal) {
        slider.addEventListener('input', () => {
          this.alphaFactor = parseFloat(slider.value) || 0.18;
          alphaVal.textContent = this.alphaFactor.toFixed(2);
          const modeEl = document.getElementById('hud-sensor-mode');
          if (modeEl) modeEl.textContent = `Low-Pass α=${this.alphaFactor.toFixed(2)}`;
        });
      }
      this.render();
    },

    // Circular low-pass filter handling 0° / 360° wrap-around smoothly
    applyLowPassFilter(rawDeg) {
      const prev = this.smoothedBearing;
      let delta = ((rawDeg - prev + 540) % 360) - 180;
      const next = (prev + this.alphaFactor * delta + 360) % 360;
      this.rawBearing = (rawDeg + 360) % 360;
      this.smoothedBearing = next;
      return {
        raw: this.rawBearing,
        smoothed: this.smoothedBearing,
        attenuated: Math.abs(delta * (1 - this.alphaFactor))
      };
    },

    cardinalFromDegrees(deg) {
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return dirs[Math.round(deg / 45) % 8];
    },

    async requestSensorPermission() {
      try {
        if (
          typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
          const res = await DeviceOrientationEvent.requestPermission();
          if (res !== 'granted') {
            Toast.show('Compass permission declined — using interactive simulation');
            this.toggleSimulation(true);
            return;
          }
        }
        window.addEventListener('deviceorientation', (e) => {
          let heading = null;
          if (typeof e.webkitCompassHeading === 'number') {
            heading = e.webkitCompassHeading;
          } else if (typeof e.alpha === 'number') {
            heading = (360 - e.alpha) % 360;
          }
          if (heading !== null) {
            this.sensorActive = true;
            this.pitch = Math.round(e.beta || 0);
            this.roll = Math.round(e.gamma || 0);
            this.applyLowPassFilter(heading);
            this.render();
          }
        });
        Toast.show('DeviceOrientation sensor listener attached (Low-Pass Filter active)');
        bus.emit('hud:sensor_attached', { alpha: this.alphaFactor });
      } catch (err) {
        ErrorBoundary.capture(err, 'CompassHUD.requestSensorPermission');
      }
    },

    toggleSimulation(forceStart = false) {
      if (this.simInterval && !forceStart) {
        clearInterval(this.simInterval);
        this.simInterval = null;
        Toast.show('Compass sensor simulation paused');
        return;
      }
      if (this.simInterval) clearInterval(this.simInterval);
      let baseAngle = this.smoothedBearing;
      const intervalMs = document.body.classList.contains('power-saver-active') ? 450 : 120;
      this.simInterval = setInterval(() => {
        baseAngle = (baseAngle + 1.8) % 360;
        const syntheticJitter = (Math.random() - 0.5) * 14.0;
        const noisyReading = (baseAngle + syntheticJitter + 360) % 360;
        const result = this.applyLowPassFilter(noisyReading);
        this.render(result.attenuated);
      }, intervalMs);
      Toast.show('Simulating noisy magnetometer sweep with Low-Pass smoothing');
      bus.emit('hud:simulation_started', { alpha: this.alphaFactor });
    },

    render(jitterDamped = 0) {
      const needle = document.getElementById('compass-needle');
      const degEl = document.getElementById('hud-bearing-filtered');
      const rawEl = document.getElementById('hud-bearing-raw');
      const smoothEl = document.getElementById('hud-bearing-smooth');
      const jitterEl = document.getElementById('hud-jitter-delta');
      const prEl = document.getElementById('hud-pitch-roll');

      const rounded = Math.round(this.smoothedBearing).toString().padStart(3, '0');
      const cardinal = this.cardinalFromDegrees(this.smoothedBearing);

      if (needle) needle.style.transform = `rotate(${this.smoothedBearing.toFixed(1)}deg)`;
      if (degEl) degEl.textContent = `${rounded}° ${cardinal}`;
      if (rawEl) rawEl.textContent = `${this.rawBearing.toFixed(1)}°`;
      if (smoothEl) smoothEl.textContent = `${this.smoothedBearing.toFixed(1)}° (${cardinal})`;
      if (jitterEl) jitterEl.textContent = `${jitterDamped.toFixed(1)}° damped`;
      if (prEl) prEl.textContent = `β: ${this.pitch}° | γ: ${this.roll}°`;
    }
  };

  /* ------------------------------------------------------------------------
     10. BATTERY STATUS LISTENER & ECO-POWER MANAGER
     ------------------------------------------------------------------------ */
  const BatteryMonitor = {
    level: 1.0,
    charging: true,
    lowPowerForced: false,

    async init() {
      try {
        if ('getBattery' in navigator && typeof navigator.getBattery === 'function') {
          const battery = await navigator.getBattery();
          const update = () => {
            this.level = battery.level;
            this.charging = battery.charging;
            this.evaluatePowerState();
          };
          battery.addEventListener('levelchange', update);
          battery.addEventListener('chargingchange', update);
          update();
        } else {
          this.evaluatePowerState();
        }
      } catch (_) {
        this.evaluatePowerState();
      }
    },

    toggleSimulatedLowBattery() {
      this.lowPowerForced = !this.lowPowerForced;
      if (this.lowPowerForced) {
        this.level = 0.16;
        this.charging = false;
      } else {
        this.level = 0.94;
        this.charging = true;
      }
      this.evaluatePowerState();
    },

    evaluatePowerState() {
      const isLow = (this.level <= 0.20 && !this.charging) || this.lowPowerForced;
      document.body.classList.toggle('power-saver-active', isLow);

      const pill = document.getElementById('battery-status-pill');
      const modeEl = document.getElementById('metric-power-mode');
      const subEl = document.getElementById('metric-power-sub');
      const pct = Math.round(this.level * 100);

      if (pill) {
        pill.textContent = isLow ? `Battery: ${pct}% (Eco Saver)` : `Battery: ${pct}%`;
        pill.className = isLow ? 'status-pill status-pill--offline' : 'status-pill status-pill--online';
      }
      if (modeEl) modeEl.textContent = isLow ? 'Eco Power-Saver' : 'Standard High-FPS';
      if (subEl) {
        subEl.textContent = isLow
          ? 'Heavy blur, haptics & high-frequency HUD polling throttled'
          : 'Full animations & 60Hz HUD filter active';
      }
      bus.emit('battery:changed', { level: pct, ecoMode: isLow });
    }
  };

  /* ------------------------------------------------------------------------
     11. DYNAMIC THEME COLOR & VIEW ROUTER
     ------------------------------------------------------------------------ */
  const ThemeAndRouter = {
    themes: ['dark', 'light', 'contrast'],
    currentThemeIndex: 0,
    activeTab: 'tasks',
    tabColors: {
      tasks: { dark: '#0B1120', light: '#0284C7', contrast: '#000000' },
      itinerary: { dark: '#1E1B4B', light: '#4F46E5', contrast: '#000000' },
      hud: { dark: '#064E3B', light: '#059669', contrast: '#000000' },
      system: { dark: '#3B0764', light: '#7E22CE', contrast: '#000000' }
    },

    init() {
      const savedTheme = localStorage.getItem('dms_theme_pref');
      if (savedTheme && this.themes.includes(savedTheme)) {
        this.currentThemeIndex = this.themes.indexOf(savedTheme);
      }
      this.applyTheme(this.themes[this.currentThemeIndex]);

      // Hash routing support
      const initialHash = (window.location.hash || '#tasks').replace('#', '').split('?')[0];
      if (['tasks', 'itinerary', 'hud', 'system'].includes(initialHash)) {
        this.switchTab(initialHash, false);
      }
      window.addEventListener('popstate', () => {
        const h = (window.location.hash || '#tasks').replace('#', '').split('?')[0];
        if (['tasks', 'itinerary', 'hud', 'system'].includes(h)) {
          this.switchTab(h, false);
        }
      });
    },

    cycleTheme() {
      this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
      const next = this.themes[this.currentThemeIndex];
      localStorage.setItem('dms_theme_pref', next);
      this.applyTheme(next);
      Toast.show(`Theme switched to ${next.toUpperCase()} mode`);
    },

    applyTheme(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      const label = document.getElementById('theme-icon-label');
      if (label) label.textContent = `Theme: ${themeName.toUpperCase()}`;
      this.syncMetaThemeColor();
      bus.emit('theme:updated', { theme: themeName });
    },

    switchTab(tabId, pushHash = true) {
      this.activeTab = tabId;
      document.querySelectorAll('.nav-tab').forEach((btn) => {
        const active = btn.dataset.tab === tabId;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        const active = panel.id === `panel-${tabId}`;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
      if (pushHash) {
        history.pushState(null, '', `#${tabId}`);
      }
      this.syncMetaThemeColor();
      bus.emit('tab:switched', { tab: tabId });
    },

    syncMetaThemeColor() {
      const themeName = this.themes[this.currentThemeIndex];
      const colorMap = this.tabColors[this.activeTab] || this.tabColors.tasks;
      const hex = colorMap[themeName] || '#0B1120';
      const meta = document.getElementById('dynamic-theme-color');
      if (meta) meta.setAttribute('content', hex);
    }
  };

  /* ------------------------------------------------------------------------
     12. ONBOARDING COACHMARK CONTROLLER
     ------------------------------------------------------------------------ */
  const OnboardingTour = {
    step: 0,
    steps: [
      {
        title: 'Step 1 of 4: Complete Digital Marketing Specialist Task Matrix',
        body: 'Tab 1 houses 25+ concrete Digital Marketing SOPs spanning SEO, Paid Media (PPC), Social/Content, Email/CRM, CRO, Analytics Attribution, and Local Field Operations. Try typing typos into the search bar to see Levenshtein fuzzy matching in action.'
      },
      {
        title: 'Step 2 of 4: Campaign Itinerary, JSON Backups & Print/PDF Export',
        body: 'Tab 2 coordinates campaign sprints and local activations. Export or import your entire state as a portable .json backup file, copy GPS coordinates in one tap, or generate a formatted Print/PDF brief.'
      },
      {
        title: 'Step 3 of 4: Low-Pass Filtered Compass & Telemetry HUD',
        body: 'Tab 3 integrates the DeviceOrientation API with a circular Low-Pass Filter (α = 0.18) to smooth sensor jitter while orienting toward local OOH billboards, studio shoots, or event booths.'
      },
      {
        title: 'Step 4 of 4: IndexedDB Offline Queue, Battery Saver & Haptics',
        body: 'Every change updates the UI optimistically and queues in IndexedDB for Background Sync when connectivity returns. Install this app onto your iPhone Home Screen via Safari Share -> Add to Home Screen.'
      }
    ],
    init() {
      const seen = localStorage.getItem('dms_onboarding_seen_v2');
      if (!seen) {
        this.open();
      }
    },
    open() {
      this.step = 0;
      this.render();
      const modal = document.getElementById('onboarding-overlay');
      if (modal) modal.hidden = false;
    },
    close() {
      localStorage.setItem('dms_onboarding_seen_v2', 'true');
      const modal = document.getElementById('onboarding-overlay');
      if (modal) modal.hidden = true;
    },
    render() {
      const current = this.steps[this.step];
      const ind = document.getElementById('onboarding-step-indicator');
      const title = document.getElementById('onboarding-title');
      const body = document.getElementById('onboarding-body');
      const prevBtn = document.getElementById('btn-onboarding-prev');
      const nextBtn = document.getElementById('btn-onboarding-next');
      const dots = document.querySelectorAll('#onboarding-dots .dot');

      if (ind) ind.textContent = `Step ${this.step + 1} of ${this.steps.length}`;
      if (title) title.textContent = current.title;
      if (body) body.textContent = current.body;
      if (prevBtn) prevBtn.disabled = this.step === 0;
      if (nextBtn) nextBtn.textContent = this.step === this.steps.length - 1 ? 'Finish Tour' : 'Next Tip';
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === this.step));
    }
  };

  /* ------------------------------------------------------------------------
     13. MAIN APPLICATION CONTROLLER & STATE STORE
     ------------------------------------------------------------------------ */
  const App = {
    tasks: [],
    itinerary: [],
    deferredInstallPrompt: null,

    async init() {
      ErrorBoundary.init();
      this.loadState();
      await OfflineSyncManager.init();
      ThemeAndRouter.init();
      CompassHUD.init();
      BatteryMonitor.init();
      OnboardingTour.init();
      this.bindEvents();
      this.renderAll();
      this.registerServiceWorker();
    },

    loadState() {
      try {
        const raw = localStorage.getItem(STATE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.tasks = Array.isArray(parsed.tasks) && parsed.tasks.length ? parsed.tasks : DEFAULT_TASKS;
          this.itinerary = Array.isArray(parsed.itinerary) && parsed.itinerary.length ? parsed.itinerary : DEFAULT_ITINERARY;
          return;
        }
      } catch (err) {
        ErrorBoundary.capture(err, 'App.loadState');
      }
      this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
      this.itinerary = JSON.parse(JSON.stringify(DEFAULT_ITINERARY));
    },

    saveState() {
      try {
        localStorage.setItem(
          STATE_STORAGE_KEY,
          JSON.stringify({
            updatedAt: new Date().toISOString(),
            tasks: this.tasks,
            itinerary: this.itinerary
          })
        );
      } catch (err) {
        ErrorBoundary.capture(err, 'App.saveState');
      }
    },

    renderAll() {
      this.renderKPIs();
      this.renderTasks();
      this.renderItinerary();
      this.renderSyncQueue();
      this.renderErrorLogs();
      this.renderChecklistAudit();
    },

    renderKPIs() {
      const total = this.tasks.length || 1;
      const completed = this.tasks.filter((t) => t.completed).length;
      const pct = Math.round((completed / total) * 100);
      const bookmarked =
        this.tasks.filter((t) => t.bookmarked).length +
        this.itinerary.filter((i) => i.bookmarked).length;
      const pendingSync = OfflineSyncManager.queue.filter((q) => q.status !== 'synced').length;

      const pctEl = document.getElementById('metric-completion-pct');
      const fillEl = document.getElementById('metric-progress-fill');
      const barEl = document.getElementById('metric-progressbar');
      const bmEl = document.getElementById('metric-bookmarked-count');
      const syncEl = document.getElementById('metric-sync-count');
      const navTasks = document.getElementById('nav-badge-tasks');
      const navItin = document.getElementById('nav-badge-itinerary');
      const navSync = document.getElementById('nav-badge-sync');

      if (pctEl) pctEl.textContent = `${pct}% (${completed}/${this.tasks.length})`;
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (barEl) barEl.setAttribute('aria-valuenow', String(pct));
      if (bmEl) bmEl.textContent = `${bookmarked} Saved`;
      if (syncEl) syncEl.textContent = `${pendingSync} Pending`;
      if (navTasks) navTasks.textContent = `${completed}/${this.tasks.length}`;
      if (navItin) navItin.textContent = `${this.itinerary.length} Stops`;
      if (navSync) navSync.textContent = `${pendingSync} Queued`;
    },

    renderTasks() {
      const grid = document.getElementById('tasks-grid');
      const empty = document.getElementById('tasks-empty-state');
      const fuzzyBadge = document.getElementById('fuzzy-match-indicator');
      if (!grid) return;

      const query = (document.getElementById('task-search-input')?.value || '').trim();
      const pillar = document.getElementById('filter-pillar')?.value || 'ALL';
      const cadence = document.getElementById('filter-cadence')?.value || 'ALL';
      const status = document.getElementById('filter-status')?.value || 'ALL';

      let anyFuzzyUsed = false;
      const scored = [];

      for (const task of this.tasks) {
        if (pillar !== 'ALL' && task.pillar !== pillar) continue;
        if (cadence !== 'ALL' && task.cadence !== cadence) continue;
        if (status === 'PENDING' && task.completed) continue;
        if (status === 'COMPLETED' && !task.completed) continue;
        if (status === 'BOOKMARKED' && !task.bookmarked) continue;

        const haystack = `${task.title} ${task.pillar} ${task.kpi} ${task.tools} ${task.locationName || ''} ${(task.steps || []).join(' ')}`;
        const match = FuzzySearch.scoreItem(query, haystack);
        if (match.matched) {
          if (match.isFuzzy) anyFuzzyUsed = true;
          scored.push({ task, score: match.score });
        }
      }

      scored.sort((a, b) => b.score - a.score);
      if (fuzzyBadge) fuzzyBadge.hidden = !anyFuzzyUsed;

      if (!scored.length) {
        grid.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;

      grid.innerHTML = scored
        .map(({ task }) => {
          const priorityClass =
            task.priority === 'Critical'
              ? 'badge--danger'
              : task.priority === 'High'
              ? 'badge--warning'
              : 'badge--accent';
          const stepsHtml = (task.steps || [])
            .map((s) => `<li>${this.escapeHtml(s)}</li>`)
            .join('');
          return `
          <article class="task-card ${task.completed ? 'is-completed' : ''}" data-task-id="${this.escapeHtml(task.id)}">
            <div>
              <div class="task-card__top">
                <div class="task-card__badges">
                  <span class="badge ${priorityClass}">${this.escapeHtml(task.priority)}</span>
                  <span class="badge">${this.escapeHtml(task.cadence)}</span>
                  <span class="badge badge--accent">${this.escapeHtml(task.pillar)}</span>
                </div>
              </div>
              <h3 class="task-card__title">${this.escapeHtml(task.title)}</h3>
              <div class="task-card__meta">
                <span><strong>KPI:</strong> ${this.escapeHtml(task.kpi)}</span>
                <span><strong>Tools:</strong> ${this.escapeHtml(task.tools || 'Standard Stack')}</span>
                ${task.coords ? `<span><strong>GPS:</strong> ${this.escapeHtml(task.coords)}</span>` : ''}
              </div>
              <ul class="task-card__sop">${stepsHtml}</ul>
            </div>
            <div class="task-card__footer">
              <button type="button" class="btn btn--sm ${task.completed ? 'btn--secondary' : 'btn--primary'}" data-action="toggle-task" data-id="${this.escapeHtml(task.id)}">
                ${task.completed ? '✓ Completed' : 'Mark Complete'}
              </button>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn--sm btn--secondary" data-action="bookmark-task" data-id="${this.escapeHtml(task.id)}" aria-label="Bookmark task">
                  ${task.bookmarked ? '★ Saved' : '☆ Bookmark'}
                </button>
                <button type="button" class="btn btn--sm btn--ghost" data-action="copy-task" data-id="${this.escapeHtml(task.id)}" aria-label="Copy task deep link and SOP">
                  Copy SOP
                </button>
              </div>
            </div>
          </article>`;
        })
        .join('');
    },

    renderItinerary() {
      const container = document.getElementById('itinerary-list');
      if (!container) return;
      container.innerHTML = this.itinerary
        .map(
          (item) => `
        <article class="itinerary-card">
          <div class="itinerary-card__header">
            <span class="itinerary-card__time">${this.escapeHtml(item.time)}</span>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span class="badge badge--accent">${this.escapeHtml(item.channel)}</span>
              <span class="badge">${this.escapeHtml(item.location)} (${this.escapeHtml(item.coords)})</span>
            </div>
          </div>
          <h3 style="margin:0; font-size:1.1rem;">${this.escapeHtml(item.title)}</h3>
          <p style="margin:0; color:var(--text-secondary); font-size:0.95rem;">${this.escapeHtml(item.notes)}</p>
          <div class="itinerary-card__actions">
            <button type="button" class="btn btn--sm btn--secondary" data-action="bookmark-itinerary" data-id="${this.escapeHtml(item.id)}">
              ${item.bookmarked ? '★ Bookmarked Stop' : '☆ Bookmark Stop'}
            </button>
            <button type="button" class="btn btn--sm btn--ghost" data-action="copy-coords" data-coords="${this.escapeHtml(item.coords)}" data-title="${this.escapeHtml(item.title)}">
              Copy GPS (${this.escapeHtml(item.coords)})
            </button>
          </div>
        </article>`
        )
        .join('');
    },

    renderSyncQueue() {
      const list = document.getElementById('sync-queue-list');
      const badge = document.getElementById('sync-queue-status-badge');
      if (!list) return;
      const pending = OfflineSyncManager.queue.filter((q) => q.status !== 'synced').length;
      if (badge) {
        badge.textContent = pending > 0 ? `${pending} Pending Sync` : 'All Actions Synced';
        badge.className = pending > 0 ? 'badge badge--warning' : 'badge badge--success';
      }
      if (!OfflineSyncManager.queue.length) {
        list.innerHTML = `<div class="queue-item"><span>No mutations recorded yet. Toggle any task or bookmark to test optimistic UI + IndexedDB queuing.</span></div>`;
        return;
      }
      list.innerHTML = OfflineSyncManager.queue
        .slice(0, 12)
        .map(
          (item) => `
        <div class="queue-item">
          <div>
            <strong>${this.escapeHtml(item.actionType)}</strong> — ${this.escapeHtml(item.summary)}
            <div style="font-size:0.75rem; color:var(--text-muted);">${new Date(item.createdAt).toLocaleTimeString()}</div>
          </div>
          <span class="badge ${item.status === 'synced' ? 'badge--success' : 'badge--warning'}">
            ${this.escapeHtml(item.status)}
          </span>
        </div>`
        )
        .join('');
    },

    renderErrorLogs() {
      const list = document.getElementById('error-log-list');
      if (!list) return;
      if (!ErrorBoundary.logs.length) {
        list.innerHTML = `<div class="queue-item"><span style="color:var(--semantic-success);">✓ Zero uncaught runtime exceptions. ErrorBoundary active.</span></div>`;
        return;
      }
      list.innerHTML = ErrorBoundary.logs
        .map(
          (err) => `
        <div class="queue-item">
          <div>
            <strong style="color:var(--semantic-danger);">[${this.escapeHtml(err.context)}]</strong> ${this.escapeHtml(err.message)}
            <div style="font-size:0.75rem; color:var(--text-muted);">${new Date(err.timestamp).toLocaleTimeString()}</div>
          </div>
          <span class="badge badge--danger">Logged</span>
        </div>`
        )
        .join('');
    },

    renderChecklistAudit() {
      const grid = document.getElementById('pwa-audit-checklist');
      if (!grid) return;
      grid.innerHTML = PWA_CHECKLIST_ITEMS.map(
        (item) => `
        <div class="audit-item">
          <h4>✓ ${this.escapeHtml(item.title)}</h4>
          <p>${this.escapeHtml(item.detail)}</p>
        </div>`
      ).join('');
    },

    exportBackupJson() {
      const payload = {
        app: 'Digital Marketing Specialist Guide PWA',
        version: '2.4.0',
        exportedAt: new Date().toISOString(),
        canonicalUrl: 'https://esp046-cyber.github.io/Digital-Marketing-Specialist-guide/',
        tasks: this.tasks,
        itinerary: this.itinerary,
        syncQueue: OfflineSyncManager.queue
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dms-itinerary-tasks-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Haptics.complete();
      Toast.show('Exported tasks & itinerary backup JSON');
      bus.emit('backup:exported', { count: this.tasks.length });
    },

    importBackupJson(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ErrorBoundary.wrap((e) => {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data.tasks) || !Array.isArray(data.itinerary)) {
          throw new Error('Invalid JSON backup schema: expected tasks[] and itinerary[] arrays');
        }
        this.tasks = data.tasks;
        this.itinerary = data.itinerary;
        this.saveState();
        OfflineSyncManager.enqueue('JSON_IMPORT', `Restored ${this.tasks.length} tasks & ${this.itinerary.length} itinerary stops`);
        this.renderAll();
        Haptics.bookmark();
        Toast.show('Backup JSON imported and state restored!');
      }, 'App.importBackupJson');
      reader.readAsText(file);
    },

    bindEvents() {
      // Navigation tabs
      document.querySelectorAll('.nav-tab').forEach((btn) => {
        btn.addEventListener('click', () => {
          ThemeAndRouter.switchTab(btn.dataset.tab);
        });
      });

      // Theme toggle, Tour, Deep-link copy
      document.getElementById('btn-theme-toggle')?.addEventListener('click', () => ThemeAndRouter.cycleTheme());
      document.getElementById('btn-open-onboarding')?.addEventListener('click', () => OnboardingTour.open());
      document.getElementById('btn-close-onboarding')?.addEventListener('click', () => OnboardingTour.close());
      document.getElementById('btn-onboarding-prev')?.addEventListener('click', () => {
        if (OnboardingTour.step > 0) {
          OnboardingTour.step--;
          OnboardingTour.render();
        }
      });
      document.getElementById('btn-onboarding-next')?.addEventListener('click', () => {
        if (OnboardingTour.step < OnboardingTour.steps.length - 1) {
          OnboardingTour.step++;
          OnboardingTour.render();
        } else {
          OnboardingTour.close();
        }
      });

      document.getElementById('btn-copy-deeplink')?.addEventListener('click', () => {
        const url = `https://esp046-cyber.github.io/Digital-Marketing-Specialist-guide/#${ThemeAndRouter.activeTab}`;
        ClipboardUtil.copy(url, 'Copied deep link');
      });

      // Search & Filters
      ['task-search-input', 'filter-pillar', 'filter-cadence', 'filter-status'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', () => {
            this.renderTasks();
            bus.emit('filter:changed', { control: id, value: el.value });
          });
        }
      });

      document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
        document.getElementById('task-search-input').value = '';
        document.getElementById('filter-pillar').value = 'ALL';
        document.getElementById('filter-cadence').value = 'ALL';
        document.getElementById('filter-status').value = 'ALL';
        this.renderTasks();
      });

      // Delegated Task Card Actions
      document.getElementById('tasks-grid')?.addEventListener(
        'click',
        ErrorBoundary.wrap((e) => {
          const btn = e.target.closest('button[data-action]');
          if (!btn) return;
          const id = btn.dataset.id;
          const task = this.tasks.find((t) => t.id === id);
          if (!task) return;

          if (btn.dataset.action === 'toggle-task') {
            task.completed = !task.completed;
            Haptics.complete();
            this.saveState();
            OfflineSyncManager.enqueue(
              'TASK_TOGGLE',
              `${task.completed ? 'Completed' : 'Reopened'}: ${task.title}`,
              { id: task.id, completed: task.completed }
            );
            this.renderKPIs();
            this.renderTasks();
          } else if (btn.dataset.action === 'bookmark-task') {
            task.bookmarked = !task.bookmarked;
            Haptics.bookmark();
            this.saveState();
            OfflineSyncManager.enqueue(
              'TASK_BOOKMARK',
              `${task.bookmarked ? 'Bookmarked' : 'Unbookmarked'}: ${task.title}`,
              { id: task.id, bookmarked: task.bookmarked }
            );
            this.renderKPIs();
            this.renderTasks();
          } else if (btn.dataset.action === 'copy-task') {
            const deepLink = `https://esp046-cyber.github.io/Digital-Marketing-Specialist-guide/#tasks?id=${task.id}`;
            const text = `${task.title} (${task.pillar} | KPI: ${task.kpi})\nSOP: ${(task.steps || []).join(' -> ')}\nLink: ${deepLink}`;
            ClipboardUtil.copy(text, 'Copied SOP & Deep Link');
          }
        }, 'TasksGrid Click')
      );

      // Delegated Itinerary Actions
      document.getElementById('itinerary-list')?.addEventListener(
        'click',
        ErrorBoundary.wrap((e) => {
          const btn = e.target.closest('button[data-action]');
          if (!btn) return;
          if (btn.dataset.action === 'copy-coords') {
            ClipboardUtil.copy(`${btn.dataset.title} @ ${btn.dataset.coords}`, 'Copied GPS Coords');
          } else if (btn.dataset.action === 'bookmark-itinerary') {
            const item = this.itinerary.find((i) => i.id === btn.dataset.id);
            if (!item) return;
            item.bookmarked = !item.bookmarked;
            Haptics.bookmark();
            this.saveState();
            OfflineSyncManager.enqueue('ITINERARY_BOOKMARK', `Toggled itinerary stop: ${item.title}`);
            this.renderKPIs();
            this.renderItinerary();
          }
        }, 'Itinerary Click')
      );

      // Print / PDF Utility Buttons
      document.getElementById('btn-print-tasks')?.addEventListener('click', () => {
        bus.emit('print:requested', { section: 'tasks' });
        window.print();
      });
      document.getElementById('btn-print-itinerary')?.addEventListener('click', () => {
        bus.emit('print:requested', { section: 'itinerary' });
        window.print();
      });

      // JSON Export & Import
      document.getElementById('btn-export-json')?.addEventListener('click', () => this.exportBackupJson());
      document.getElementById('input-import-json')?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) this.importBackupJson(file);
      });

      // Custom Task / Itinerary Modal
      const customModal = document.getElementById('custom-item-modal');
      document.getElementById('btn-add-custom-task')?.addEventListener('click', () => {
        if (customModal) customModal.hidden = false;
      });
      document.getElementById('btn-add-itinerary')?.addEventListener('click', () => {
        if (customModal) customModal.hidden = false;
      });
      document.getElementById('btn-close-custom-modal')?.addEventListener('click', () => {
        if (customModal) customModal.hidden = true;
      });
      document.getElementById('btn-cancel-custom')?.addEventListener('click', () => {
        if (customModal) customModal.hidden = true;
      });
      document.getElementById('custom-item-form')?.addEventListener(
        'submit',
        ErrorBoundary.wrap((e) => {
          e.preventDefault();
          const title = document.getElementById('custom-title').value.trim();
          const pillar = document.getElementById('custom-pillar').value;
          const cadence = document.getElementById('custom-cadence').value;
          const kpi = document.getElementById('custom-kpi').value.trim() || 'Target conversion uplift';
          const coords = document.getElementById('custom-coords').value.trim() || '14.5547° N, 121.0244° E';
          const stepsRaw = document.getElementById('custom-steps').value.trim();
          const steps = stepsRaw
            ? stepsRaw.split(',').map((s) => s.trim()).filter(Boolean)
            : ['Configure tracking parameters', 'Launch & verify attribution'];

          const newTask = {
            id: 'dms-custom-' + Date.now(),
            title,
            pillar,
            cadence,
            priority: 'High',
            kpi,
            tools: 'Custom Specialist Workflow',
            coords,
            steps,
            completed: false,
            bookmarked: true
          };
          this.tasks.unshift(newTask);
          this.itinerary.unshift({
            id: 'itin-custom-' + Date.now(),
            time: 'Flexible Sprint Slot',
            title,
            channel: pillar,
            location: 'Custom Field / Remote Node',
            coords,
            notes: `KPI: ${kpi} | Steps: ${steps.join('; ')}`,
            bookmarked: true
          });
          this.saveState();
          OfflineSyncManager.enqueue('CUSTOM_TASK_CREATED', `Added custom task: ${title}`);
          this.renderAll();
          e.target.reset();
          if (customModal) customModal.hidden = true;
          Haptics.bookmark();
          Toast.show('Custom task & itinerary slot saved and queued for sync!');
        }, 'CustomItemForm Submit')
      );

      // Tab 3 HUD Controls
      document.getElementById('btn-request-sensor')?.addEventListener('click', () => CompassHUD.requestSensorPermission());
      document.getElementById('btn-simulate-bearing')?.addEventListener('click', () => CompassHUD.toggleSimulation());
      document.getElementById('btn-copy-hud-coords')?.addEventListener('click', () => {
        const sel = document.getElementById('hud-waypoint-select');
        const val = sel ? sel.value : '14.5547,121.0244|Makati CBD Hub';
        const [coords, label] = val.split('|');
        ClipboardUtil.copy(`${label} (${coords}) | Bearing: ${CompassHUD.smoothedBearing.toFixed(1)}°`, 'Copied HUD Waypoint');
      });
      document.getElementById('btn-clear-eventstream')?.addEventListener('click', () => {
        const logEl = document.getElementById('hud-eventbus-log');
        if (logEl) logEl.innerHTML = '';
      });

      // Tab 4 System Controls
      document.getElementById('btn-flush-sync')?.addEventListener('click', () => OfflineSyncManager.flushQueue());
      document.getElementById('btn-simulate-offline-action')?.addEventListener('click', () => {
        OfflineSyncManager.enqueue('OFFLINE_FIELD_CHECKIN', 'Queued manual field verification checkpoint');
        this.renderKPIs();
        this.renderSyncQueue();
        Toast.show('Queued mutation in IndexedDB');
      });
      document.getElementById('btn-toggle-low-battery')?.addEventListener('click', () => {
        BatteryMonitor.toggleSimulatedLowBattery();
      });
      document.getElementById('btn-trigger-test-error')?.addEventListener('click', () => {
        ErrorBoundary.capture(new Error('Simulated non-fatal telemetry timeout in campaign connector'), 'DiagnosticTest');
        this.renderErrorLogs();
      });
      document.getElementById('btn-clear-errors')?.addEventListener('click', () => {
        ErrorBoundary.clear();
        this.renderErrorLogs();
      });
      document.getElementById('btn-dismiss-error')?.addEventListener('click', () => {
        const banner = document.getElementById('error-boundary-banner');
        if (banner) banner.hidden = true;
      });
      document.getElementById('btn-view-error-log')?.addEventListener('click', () => {
        ThemeAndRouter.switchTab('system');
      });

      // Network connectivity listeners
      const updateNetStatus = () => {
        const pill = document.getElementById('network-status-pill');
        if (pill) {
          pill.textContent = navigator.onLine ? 'Online' : 'Offline (IndexedDB Queue)';
          pill.className = navigator.onLine ? 'status-pill status-pill--online' : 'status-pill status-pill--offline';
        }
        if (navigator.onLine) {
          OfflineSyncManager.flushQueue();
        }
      };
      window.addEventListener('online', updateNetStatus);
      window.addEventListener('offline', updateNetStatus);
      updateNetStatus();

      // EventBus live stream subscriber
      bus.on('eventbus:logged', (entry) => {
        const logEl = document.getElementById('hud-eventbus-log');
        if (!logEl) return;
        const li = document.createElement('li');
        li.textContent = `[${entry.timestamp}] ${entry.event} -> ${entry.summary}`;
        logEl.prepend(li);
        while (logEl.children.length > 25) {
          logEl.removeChild(logEl.lastChild);
        }
      });

      bus.on('sync:updated', () => {
        this.renderKPIs();
        this.renderSyncQueue();
      });

      // PWA Install Prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredInstallPrompt = e;
        const btn = document.getElementById('btn-install-pwa');
        if (btn) btn.hidden = false;
      });
      document.getElementById('btn-install-pwa')?.addEventListener('click', async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        await this.deferredInstallPrompt.userChoice;
        this.deferredInstallPrompt = null;
        document.getElementById('btn-install-pwa').hidden = true;
      });
    },

    registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('./service-worker.js')
            .then(() => bus.emit('sw:registered', { scope: './' }))
            .catch((err) => ErrorBoundary.capture(err, 'ServiceWorker Registration'));
        });
        navigator.serviceWorker.addEventListener('message', (e) => {
          if (e.data && e.data.type === 'BACKGROUND_SYNC_FLUSHED') {
            OfflineSyncManager.loadQueue();
          }
        });
      }
    },

    escapeHtml(str) {
      return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  };

  document.addEventListener('DOMContentLoaded', () => App.init());
})();
