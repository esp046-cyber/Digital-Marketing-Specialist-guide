/* ==========================================================================
   Digital Marketing Specialist Guide — Practical Marketing Application
   4 Navigation Tabs:
   01. Daily Tasks (Step-by-step checklists across 6 marketing areas)
   02. Content Planner (Weekly campaign schedule + backup & print/PDF)
   03. Marketing Terms (24 plain-English definitions, formulas & examples)
   04. Calculators (ROAS, Profit/ROI, CPC/CTR, Conversion Rate, Sales Goal, Engagement, Email)
   ========================================================================== */

(function () {
  'use strict';

  const STATE_KEY = 'dms_marketing_guide_v3';
  const DEFAULT_TASKS = [
  {
    "id": "task-seo-1",
    "title": "Check Website Page Speed & Mobile Loading",
    "category": "Website & SEO",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Pages load in under 3 seconds on mobile phones",
    "tools": "Google PageSpeed Insights",
    "steps": [
      "Test your top 5 most visited pages on a mobile phone",
      "Compress large photos so they load quickly without losing quality",
      "Make sure buttons and text are easy to read without zooming in"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "task-seo-2",
    "title": "Write Clear Page Titles & Search Descriptions",
    "category": "Website & SEO",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Get more people to click your website link on Google",
    "tools": "Google Search Console",
    "steps": [
      "Include the main topic phrase naturally in your page title (under 60 characters)",
      "Write a clear 1-2 sentence summary (under 155 characters) explaining how the page helps",
      "Make sure every page on your site has its own unique title"
    ],
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "task-seo-3",
    "title": "Fix Broken Website Links (404 Pages)",
    "category": "Website & SEO",
    "frequency": "Monthly",
    "priority": "Medium Priority",
    "goal": "Zero dead links that frustrate visitors",
    "tools": "Google Search Console, Broken Link Checker",
    "steps": [
      "Check for any links that lead to a 'Page Not Found' screen",
      "Update old links so they point to the right live page",
      "Add helpful links between related blog posts and product pages"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "task-seo-4",
    "title": "Update Google Business Profile for Local Customers",
    "category": "Website & SEO",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Rank in the top 3 local results on Google Maps",
    "tools": "Google Business Profile",
    "steps": [
      "Confirm your business hours, phone number, and address are accurate",
      "Upload 2-3 fresh photos of your products, team, or store",
      "Reply warmly to every new customer review within 24 hours"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "task-seo-5",
    "title": "Research Questions Customers Are Searching For",
    "category": "Website & SEO",
    "frequency": "Monthly",
    "priority": "Medium Priority",
    "goal": "Create 4 new helpful blog articles or FAQ guides each month",
    "tools": "Google Search 'People Also Ask', Google Trends, AnswerThePublic",
    "steps": [
      "List the top 10 questions customers ask before buying your product",
      "Look up those questions on Google to see what pages currently show up",
      "Write a clearer, more helpful answer with step-by-step examples"
    ],
    "completed": true,
    "bookmarked": false
  },
  {
    "id": "task-ads-1",
    "title": "Review Daily Ad Spend & Pause Non-Performing Ads",
    "category": "Paid Ads",
    "frequency": "Daily",
    "priority": "High Priority",
    "goal": "Keep ad spending on budget and stop wasting money on weak ads",
    "tools": "Google Ads, Meta Ads Manager, TikTok Ads",
    "steps": [
      "Check how much money was spent yesterday vs your daily budget target",
      "Pause any ad that has spent 2x your target cost per sale without getting results",
      "Move budget toward the ads bringing in the most sales or leads"
    ],
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "task-ads-2",
    "title": "Remove Irrelevant Search Words from Google Ads",
    "category": "Paid Ads",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Save 15%+ of your ad budget by blocking wrong searches",
    "tools": "Google Ads Search Terms Report",
    "steps": [
      "Open the list of actual words people typed before clicking your ad",
      "Add unrelated words (like 'free', 'jobs', or 'cheap DIY') to your block list",
      "Put your best-performing search phrases into their own focused ad group"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "task-ads-3",
    "title": "Refresh Ad Videos & Headlines When People Get Tired of Them",
    "category": "Paid Ads",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Keep click rates above 1.5% on social media ads",
    "tools": "Canva, CapCut, Meta Ads Manager",
    "steps": [
      "Check if the same audience has seen your ad more than 3-4 times",
      "Create 3 new opening hooks (the first 3 seconds of your video)",
      "Test a customer testimonial photo against a clean product demonstration"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "task-ads-4",
    "title": "Set Up Follow-Up Ads (Retargeting) for Window Shoppers",
    "category": "Paid Ads",
    "frequency": "Campaign Launch",
    "priority": "High Priority",
    "goal": "Bring back visitors who viewed a product or cart but didn't buy",
    "tools": "Meta Ads, Google Ads Audience Manager",
    "steps": [
      "Show a helpful reminder ad to people who visited in the last 14 days",
      "Exclude people who already bought so you don't waste money showing them the same ad",
      "Include customer reviews or a small first-order bonus to answer doubts"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "task-social-1",
    "title": "Film & Edit Short Vertical Videos (Reels, TikTok & Shorts)",
    "category": "Social Media & Content",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Keep viewers watching past the first 3 seconds",
    "tools": "CapCut, Instagram Reels, TikTok, YouTube Shorts",
    "steps": [
      "Start with a strong question or visual result in the very first 2 seconds",
      "Add clear on-screen captions so people can watch with their sound off",
      "End with one simple instruction (e.g., 'Comment GUIDE' or 'Tap link in bio')"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "task-social-2",
    "title": "Turn One Big Topic into a Full Week of Social Posts",
    "category": "Social Media & Content",
    "frequency": "Weekly",
    "priority": "Medium Priority",
    "goal": "Publish consistently across 3-4 platforms without burnout",
    "tools": "Canva, Notion, Meta Business Suite",
    "steps": [
      "Take 1 helpful guide or customer story as your main weekly theme",
      "Turn the key points into a 5-slide swipeable carousel post",
      "Record a 30-second talking-head video summarizing the #1 takeaway"
    ],
    "completed": true,
    "bookmarked": false
  },
  {
    "id": "task-social-3",
    "title": "Reply to Comments, Direct Messages & Brand Mentions",
    "category": "Social Media & Content",
    "frequency": "Daily",
    "priority": "Medium Priority",
    "goal": "Reply to potential customers within 1 hour during work hours",
    "tools": "Instagram, TikTok, Facebook, LinkedIn Inbox",
    "steps": [
      "Answer questions on your posts and Ads with friendly, helpful replies",
      "Send direct links to people who asked about pricing or availability in DMs",
      "Write down common customer questions to use as future post ideas"
    ],
    "completed": true,
    "bookmarked": false
  },
  {
    "id": "task-email-1",
    "title": "Check Automated Welcome & Abandoned Cart Emails",
    "category": "Email & Customer Follow-Up",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Convert new email signups and recover unfinished shopping carts",
    "tools": "Mailchimp, Klaviyo, or HubSpot",
    "steps": [
      "Sign up with a test email to make sure the Welcome Email arrives immediately",
      "Check that all buttons and discount codes inside the email work on mobile",
      "Test two different subject lines to see which one gets more opens"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "task-email-2",
    "title": "Send Weekly Value Newsletter to Email Subscribers",
    "category": "Email & Customer Follow-Up",
    "frequency": "Weekly",
    "priority": "Medium Priority",
    "goal": "Achieve 30%+ open rate and steady clicks to your website",
    "tools": "Email Marketing Platform",
    "steps": [
      "Share 1 useful tip or story alongside 1 clear product or service offer",
      "Keep paragraphs short (1-2 sentences) with a single clear call-to-action button",
      "Preview the email in both Light Mode and Dark Mode before sending"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "task-email-3",
    "title": "Clean Out Inactive Email Addresses to Protect Deliverability",
    "category": "Email & Customer Follow-Up",
    "frequency": "Monthly",
    "priority": "Medium Priority",
    "goal": "Keep your emails landing in the main Inbox instead of the Spam folder",
    "tools": "Email List Cleaning / Segment Tool",
    "steps": [
      "Find subscribers who haven't opened a single email in the last 90 days",
      "Send one short 'Still want to hear from us?' check-in email",
      "Remove addresses that bounce or never respond so email providers trust your sender name"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "task-cro-1",
    "title": "Simplify Your Landing Page & Checkout Steps",
    "category": "Sales Page & Conversion",
    "frequency": "Monthly",
    "priority": "High Priority",
    "goal": "Increase the percentage of visitors who buy or sign up",
    "tools": "Microsoft Clarity (Free Heatmaps), Mobile Browser",
    "steps": [
      "Make sure the main headline clearly states what you offer and who it helps",
      "Place customer reviews and star ratings near the 'Buy' or 'Book Now' button",
      "Remove unnecessary form fields so customers can check out in under 60 seconds"
    ],
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "task-ana-1",
    "title": "Add Tracking Links (UTM Tags) to Every Campaign Link",
    "category": "Tracking & Results",
    "frequency": "Campaign Launch",
    "priority": "High Priority",
    "goal": "Know exactly which post, email, or ad brought in each sale",
    "tools": "Campaign URL Builder, Google Analytics",
    "steps": [
      "Tag every shared link with its source (e.g., instagram, newsletter, google_ads)",
      "Test the link on your phone to make sure it opens the right page quickly",
      "Keep a simple list of your campaign links so your team uses consistent names"
    ],
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "task-ana-2",
    "title": "Review Weekly Marketing Results & Best-Performing Channels",
    "category": "Tracking & Results",
    "frequency": "Weekly",
    "priority": "High Priority",
    "goal": "Double down on what works and stop doing what doesn't",
    "tools": "Google Analytics, Tab 04 ROI Calculators",
    "steps": [
      "Compare total marketing money spent against total sales revenue earned",
      "Identify the #1 social post, #1 email, and #1 ad from the past 7 days",
      "Write down 3 clear action steps for next week's marketing plan"
    ],
    "completed": false,
    "bookmarked": true
  }
];
  const DEFAULT_PLANNER = [
  {
    "id": "plan-mon",
    "day": "Monday \u2014 Strategy & Ad Check",
    "title": "Weekly Performance Review & Ad Budget Check",
    "channel": "Google Ads + Meta Ads + Analytics",
    "format": "Weekly Metrics & Budget Adjustment",
    "notes": "Review last week's total sales, check Cost Per Lead in the Calculator tab, and shift budget to your top-performing ads.",
    "bookmarked": true
  },
  {
    "id": "plan-tue",
    "day": "Tuesday \u2014 Search & Website Content",
    "title": "Publish 1 Helpful Guide or Answer a Customer FAQ",
    "channel": "Website Blog + Google Business Profile",
    "format": "Article + Google Business Update",
    "notes": "Write a clear article answering a common customer question and share a short summary on your Google Business Profile.",
    "bookmarked": false
  },
  {
    "id": "plan-wed",
    "day": "Wednesday \u2014 Short-Form Video",
    "title": "Post Educational Reel / TikTok / YouTube Short",
    "channel": "Instagram Reels + TikTok + Shorts",
    "format": "30-45 sec Vertical Video with Captions",
    "notes": "Hook viewers in the first 3 seconds, demonstrate how your product solves a problem, and invite viewers to click the link in your bio.",
    "bookmarked": true
  },
  {
    "id": "plan-thu",
    "day": "Thursday \u2014 Email Marketing",
    "title": "Send Weekly Value Newsletter & Promotional Offer",
    "channel": "Email List Subscribers",
    "format": "1 Quick Tip + 1 Featured Offer",
    "notes": "Write a curiosity-driven subject line, keep paragraphs brief for mobile readers, and include one bold button linking to your offer.",
    "bookmarked": true
  },
  {
    "id": "plan-fri",
    "day": "Friday \u2014 Social Proof & Community",
    "title": "Share Customer Review Carousel & Reply to All DMs",
    "channel": "Instagram + Facebook + LinkedIn",
    "format": "Customer Story / Before-and-After Carousel",
    "notes": "Highlight real customer results, follow up with anyone who asked questions in your comments or messages this week, and schedule weekend posts.",
    "bookmarked": false
  },
  {
    "id": "plan-launch",
    "day": "Monthly Campaign Launch Day",
    "title": "New Promo Launch Checklist & Retargeting Setup",
    "channel": "All Channels (Ads, Email, Social, Website)",
    "format": "Full Campaign Rollout",
    "notes": "Double-check all checkout buttons on mobile, test promo codes, turn on retargeting ads for window shoppers, and calculate target ROAS.",
    "bookmarked": true
  }
];
  const GLOSSARY_TERMS = [
  {
    "term": "ROAS (Return on Ad Spend)",
    "category": "Paid Ads & Budget",
    "simple": "How many dollars (or pesos) you earn back for every $1 or \u20b11 you spend on ads.",
    "formula": "ROAS = Revenue from Ads \u00f7 Ad Spend",
    "example": "If you spend \u20b15,000 on Facebook Ads and get \u20b120,000 in sales, your ROAS is 4.0x (you earned 4 times what you spent)."
  },
  {
    "term": "ROI (Return on Investment)",
    "category": "Paid Ads & Budget",
    "simple": "Your actual net profit percentage after subtracting both your product costs and marketing costs.",
    "formula": "ROI (%) = ((Net Profit \u00f7 Total Cost) \u00d7 100)",
    "example": "If a campaign costs \u20b110,000 total and brings in \u20b115,000 in profit after product costs, your ROI is +50%."
  },
  {
    "term": "CPC (Cost Per Click)",
    "category": "Paid Ads & Budget",
    "simple": "The average amount you pay each time someone clicks on your ad.",
    "formula": "CPC = Total Ad Spend \u00f7 Total Clicks",
    "example": "Spending \u20b11,000 on an ad that gets 200 clicks means your Cost Per Click is \u20b15.00."
  },
  {
    "term": "CTR (Click-Through Rate)",
    "category": "Paid Ads & Budget",
    "simple": "Out of every 100 people who see your ad, email, or link, how many actually click it.",
    "formula": "CTR (%) = (Total Clicks \u00f7 Total Views) \u00d7 100",
    "example": "If 1,000 people see your post and 25 click your link, your CTR is 2.5%."
  },
  {
    "term": "CPA / CAC (Cost Per Acquisition / Customer)",
    "category": "Paid Ads & Budget",
    "simple": "How much marketing money it costs you to win 1 paying customer.",
    "formula": "CPA = Total Ad Spend \u00f7 Number of New Customers",
    "example": "If you spend \u20b13,000 on ads and get 10 buyers, your Cost Per Customer is \u20b1300."
  },
  {
    "term": "CPL (Cost Per Lead)",
    "category": "Paid Ads & Budget",
    "simple": "How much you pay to get 1 interested person's contact info (like their email or phone number).",
    "formula": "CPL = Total Ad Spend \u00f7 Total Leads Collected",
    "example": "Spending \u20b12,000 to get 40 people to sign up for a free quote gives you a \u20b150 Cost Per Lead."
  },
  {
    "term": "CPM (Cost Per 1,000 Views)",
    "category": "Paid Ads & Budget",
    "simple": "The price an ad platform charges to show your ad 1,000 times.",
    "formula": "CPM = (Ad Spend \u00f7 Impressions) \u00d7 1,000",
    "example": "If you spend \u20b1500 and your ad is shown 10,000 times, your CPM is \u20b150."
  },
  {
    "term": "Conversion Rate (CVR)",
    "category": "Website & Sales",
    "simple": "The percentage of website visitors who take action (buy a product, book a call, or sign up).",
    "formula": "Conversion Rate (%) = (Conversions \u00f7 Total Visitors) \u00d7 100",
    "example": "If 500 people visit your product page and 15 buy, your Conversion Rate is 3.0%."
  },
  {
    "term": "Landing Page",
    "category": "Website & Sales",
    "simple": "A focused web page designed for one specific goal \u2014 such as getting a visitor to buy one product or sign up for a free guide.",
    "formula": "1 Clear Headline + Benefits + Social Proof + 1 Action Button",
    "example": "Sending ad clicks to a dedicated offer page instead of a busy homepage usually doubles your sales."
  },
  {
    "term": "CTA (Call to Action)",
    "category": "Website & Sales",
    "simple": "The specific button or instruction telling people what step to take next.",
    "formula": "Action Verb + Clear Benefit",
    "example": "'Get My Free Price Quote', 'Shop the Summer Sale', or 'Comment GUIDE below'."
  },
  {
    "term": "AOV (Average Order Value)",
    "category": "Website & Sales",
    "simple": "The average amount a customer spends each time they place an order with you.",
    "formula": "AOV = Total Revenue \u00f7 Total Orders",
    "example": "If 10 orders bring in \u20b112,000 total, your Average Order Value is \u20b11,200."
  },
  {
    "term": "CLV / LTV (Customer Lifetime Value)",
    "category": "Website & Sales",
    "simple": "The total amount of money a typical customer spends with your business over the entire time they buy from you.",
    "formula": "LTV = Average Order Value \u00d7 Repeat Purchases Per Year \u00d7 Years",
    "example": "A coffee shop customer who spends \u20b1200 twice a week is worth over \u20b120,000 per year."
  },
  {
    "term": "SEO (Search Engine Optimization)",
    "category": "Search & Content",
    "simple": "Improving your website so it shows up higher for free when people search on Google.",
    "formula": "Helpful Content + Fast Mobile Site + Clear Keywords",
    "example": "Writing a detailed page titled 'Best Wedding Photographer in Manila' so couples find you on Google without paid ads."
  },
  {
    "term": "Keywords (Search Phrases)",
    "category": "Search & Content",
    "simple": "The exact words and questions people type into Google, YouTube, or TikTok when looking for something.",
    "formula": "Topic + Customer Intent (e.g., 'buy', 'best', 'how to')",
    "example": "'Affordable dental clinic Pasig' is a high-intent keyword because the searcher is ready to book."
  },
  {
    "term": "Organic Traffic vs. Paid Traffic",
    "category": "Search & Content",
    "simple": "Organic traffic comes to your site naturally for free (from search or regular posts); Paid traffic comes from ads you pay for.",
    "formula": "Total Traffic = Organic Visitors + Paid Ad Visitors",
    "example": "A viral TikTok video brings free organic traffic; a boosted Facebook post brings paid traffic."
  },
  {
    "term": "Retargeting (Remarketing)",
    "category": "Paid Ads & Budget",
    "simple": "Showing follow-up ads to warm prospects who already visited your website or watched your videos.",
    "formula": "Past Visitors \u2192 Reminder Ad \u2192 Completed Purchase",
    "example": "When you look at a pair of shoes online and see an ad for those exact shoes on Instagram 10 minutes later."
  },
  {
    "term": "Sales Funnel",
    "category": "Website & Sales",
    "simple": "The journey a stranger takes from first discovering your brand to becoming a loyal paying customer.",
    "formula": "1. Awareness (Discover) \u2192 2. Consideration (Trust) \u2192 3. Conversion (Buy)",
    "example": "Someone watches your helpful Reel (Awareness), downloads your price guide (Consideration), and books a package (Conversion)."
  },
  {
    "term": "Lead Magnet",
    "category": "Email & Social",
    "simple": "A free, useful resource you give away in exchange for a visitor's email address or phone number.",
    "formula": "Free Checklist / Discount / Sample = New Email Subscriber",
    "example": "'Enter your email to get 10% off your first order' or 'Download our free 7-day meal planner'."
  },
  {
    "term": "Open Rate & Click Rate (Email)",
    "category": "Email & Social",
    "simple": "Open Rate is the % of subscribers who open your email; Click Rate is the % who tap a link inside it.",
    "formula": "Open Rate = (Opens \u00f7 Delivered) \u00d7 100",
    "example": "Out of 1,000 subscribers, 350 open the email (35% Open Rate) and 40 click the product link (4% Click Rate)."
  },
  {
    "term": "Engagement Rate (Social Media)",
    "category": "Email & Social",
    "simple": "How actively people interact with your post through likes, comments, shares, and saves.",
    "formula": "Engagement Rate (%) = ((Likes + Comments + Shares + Saves) \u00f7 Reach) \u00d7 100",
    "example": "A post seen by 1,000 people that gets 60 likes, comments, and saves has a strong 6.0% Engagement Rate."
  },
  {
    "term": "A/B Split Testing",
    "category": "Website & Sales",
    "simple": "Showing two versions of an ad, email subject line, or page (Version A vs. Version B) to see which one performs better.",
    "formula": "Change 1 Thing at a Time \u2192 Measure Winner",
    "example": "Testing a red 'Buy Now' button against a green 'Claim Offer' button to see which gets more clicks."
  },
  {
    "term": "UTM Tracking Link",
    "category": "Search & Content",
    "simple": "Small labels added to the end of a web link so Google Analytics can tell you exactly which post or ad brought the visitor.",
    "formula": "website.com/?utm_source=instagram&utm_medium=bio",
    "example": "Helps you prove whether your sales came from your Instagram bio link, your Thursday email, or your Facebook ad."
  },
  {
    "term": "Bounce Rate",
    "category": "Website & Sales",
    "simple": "The percentage of visitors who open your page and leave right away without clicking anything or taking action.",
    "formula": "Single-Page Exits \u00f7 Total Visits \u00d7 100",
    "example": "If a page takes 10 seconds to load or looks confusing on mobile, visitors leave immediately (high bounce rate)."
  },
  {
    "term": "UGC (User-Generated Content)",
    "category": "Email & Social",
    "simple": "Authentic photos, unboxing videos, or reviews filmed by real customers or creators rather than polished studio commercials.",
    "formula": "Real Person + Honest Product Demo = High Trust",
    "example": "A smartphone video of a happy customer showing how they use your skincare routine at home."
  }
];

  /* ------------------------------------------------------------------------
     1. HAPTICS & CLIPBOARD HELPERS
     ------------------------------------------------------------------------ */
  const Haptics = {
    tap() {
      try {
        if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
          navigator.vibrate(15);
        }
      } catch (_) {}
    }
  };

  const Toast = {
    show(message, duration = 2800) {
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

  const ClipboardUtil = {
    async copy(text, label = 'Copied') {
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
        Haptics.tap();
        Toast.show(`${label}!`);
      } catch (_) {
        Toast.show('Could not copy automatically');
      }
    }
  };

  /* ------------------------------------------------------------------------
     2. TYPO-TOLERANT SEARCH HELPER
     ------------------------------------------------------------------------ */
  const SmartSearch = {
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
    match(query, text) {
      if (!query || !query.trim()) return { matched: true, score: 100, isFuzzy: false };
      const q = query.toLowerCase().trim();
      const target = text.toLowerCase();
      if (target.includes(q)) return { matched: true, score: 100, isFuzzy: false };

      const qWords = q.split(/\s+/).filter(Boolean);
      const tWords = target.split(/[^a-z0-9]+/).filter(Boolean);
      let score = 0;
      let fuzzy = false;

      for (const qw of qWords) {
        if (target.includes(qw)) {
          score += 30;
          continue;
        }
        let best = Infinity;
        for (const tw of tWords) {
          if (Math.abs(tw.length - qw.length) > 3) continue;
          const d = this.levenshtein(qw, tw);
          if (d < best) best = d;
        }
        const maxDist = qw.length <= 4 ? 1 : 2;
        if (best <= maxDist) {
          score += 18 - best * 4;
          fuzzy = true;
        } else {
          return { matched: false, score: 0, isFuzzy: false };
        }
      }
      return { matched: score > 0, score, isFuzzy: fuzzy };
    }
  };

  /* ------------------------------------------------------------------------
     3. MARKETING CALCULATORS ENGINE
     ------------------------------------------------------------------------ */
  const MarketingCalculators = {
    fmt(num, decimals = 2) {
      if (!isFinite(num)) return '0';
      return Number(num).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    },
    init() {
      const inputs = document.querySelectorAll('#panel-calculators input');
      inputs.forEach((inp) => inp.addEventListener('input', () => this.computeAll()));
      document.getElementById('btn-reset-calculators')?.addEventListener('click', () => {
        document.getElementById('calc-roas-spend').value = 5000;
        document.getElementById('calc-roas-revenue').value = 22500;
        document.getElementById('calc-roas-cog').value = 7500;
        document.getElementById('calc-cpc-spend').value = 2500;
        document.getElementById('calc-cpc-impressions').value = 20000;
        document.getElementById('calc-cpc-clicks').value = 500;
        document.getElementById('calc-cvr-visitors').value = 800;
        document.getElementById('calc-cvr-orders').value = 32;
        document.getElementById('calc-cvr-spend').value = 6400;
        document.getElementById('calc-goal-rev').value = 100000;
        document.getElementById('calc-goal-aov').value = 1250;
        document.getElementById('calc-goal-cvr').value = 2.5;
        document.getElementById('calc-eng-reach').value = 4500;
        document.getElementById('calc-eng-interactions').value = 270;
        document.getElementById('calc-email-sent').value = 2000;
        document.getElementById('calc-email-opens').value = 680;
        document.getElementById('calc-email-clicks').value = 84;
        this.computeAll();
        Toast.show('Sample calculator numbers restored');
      });
      this.computeAll();
    },
    computeAll() {
      // 1. ROAS & Profit
      const spend = parseFloat(document.getElementById('calc-roas-spend')?.value) || 0;
      const rev = parseFloat(document.getElementById('calc-roas-revenue')?.value) || 0;
      const cog = parseFloat(document.getElementById('calc-roas-cog')?.value) || 0;
      const roas = spend > 0 ? rev / spend : 0;
      const totalCost = spend + cog;
      const netProfit = rev - totalCost;
      const roiPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

      document.getElementById('out-roas-mult').textContent = `${this.fmt(roas, 2)}x`;
      document.getElementById('out-roas-profit').textContent = `${netProfit >= 0 ? '+' : ''}${this.fmt(netProfit, 0)}`;
      document.getElementById('out-roas-roi').textContent = `${roiPct >= 0 ? '+' : ''}${this.fmt(roiPct, 1)}%`;
      const roasVerdict = document.getElementById('out-roas-verdict');
      if (roasVerdict) {
        if (roas >= 4) roasVerdict.textContent = 'Excellent Return (4.0x+ is strong and profitable for most brands)';
        else if (roas >= 2) roasVerdict.textContent = 'Moderate Return (Check your product margins to ensure profit)';
        else roasVerdict.textContent = 'Low Return — Test stronger ad hooks or improve your landing page offer';
      }

      // 2. CPC, CTR & CPM
      const cpcSpend = parseFloat(document.getElementById('calc-cpc-spend')?.value) || 0;
      const imps = parseFloat(document.getElementById('calc-cpc-impressions')?.value) || 1;
      const clicks = parseFloat(document.getElementById('calc-cpc-clicks')?.value) || 1;
      const cpc = cpcSpend / clicks;
      const ctr = (clicks / imps) * 100;
      const cpm = (cpcSpend / imps) * 1000;

      document.getElementById('out-cpc-val').textContent = `${this.fmt(cpc, 2)} per click`;
      document.getElementById('out-ctr-val').textContent = `${this.fmt(ctr, 2)}%`;
      document.getElementById('out-cpm-val').textContent = `${this.fmt(cpm, 2)}`;
      const ctrVerdict = document.getElementById('out-ctr-verdict');
      if (ctrVerdict) {
        ctrVerdict.textContent = ctr >= 1.5
          ? 'Strong Click Rate (People find your ad interesting)'
          : 'Click Rate below 1.5% — Try a clearer headline or brighter image/video hook';
      }

      // 3. Conversion Rate & CPA
      const visitors = parseFloat(document.getElementById('calc-cvr-visitors')?.value) || 1;
      const orders = parseFloat(document.getElementById('calc-cvr-orders')?.value) || 0;
      const cvrSpend = parseFloat(document.getElementById('calc-cvr-spend')?.value) || 0;
      const cvr = (orders / visitors) * 100;
      const cpa = orders > 0 ? cvrSpend / orders : 0;

      document.getElementById('out-cvr-rate').textContent = `${this.fmt(cvr, 2)}%`;
      document.getElementById('out-cpa-cost').textContent = orders > 0 ? `${this.fmt(cpa, 2)} each` : '0 orders';
      const cvrVerdict = document.getElementById('out-cvr-verdict');
      if (cvrVerdict) {
        cvrVerdict.textContent = cvr >= 2.5
          ? 'Healthy Conversion Rate (Your page is turning visitors into buyers)'
          : 'Tip: Add customer reviews and simplify checkout to lift conversions above 2.5%';
      }

      // 4. Monthly Sales Goal Planner
      const goalRev = parseFloat(document.getElementById('calc-goal-rev')?.value) || 0;
      const aov = parseFloat(document.getElementById('calc-goal-aov')?.value) || 1;
      const goalCvr = parseFloat(document.getElementById('calc-goal-cvr')?.value) || 1;
      const neededOrders = Math.ceil(goalRev / aov);
      const neededVisitors = Math.ceil(neededOrders / (goalCvr / 100));

      document.getElementById('out-goal-orders').textContent = `${neededOrders.toLocaleString()} orders (${this.fmt(neededOrders / 30, 1)} / day)`;
      document.getElementById('out-goal-visitors').textContent = `${neededVisitors.toLocaleString()} visitors`;

      // 5. Social Engagement Rate
      const reach = parseFloat(document.getElementById('calc-eng-reach')?.value) || 1;
      const inter = parseFloat(document.getElementById('calc-eng-interactions')?.value) || 0;
      const engRate = (inter / reach) * 100;
      document.getElementById('out-eng-rate').textContent = `${this.fmt(engRate, 2)}%`;
      const engVerdict = document.getElementById('out-eng-verdict');
      if (engVerdict) {
        engVerdict.textContent = engRate >= 3.0
          ? 'Great Engagement! Your audience is actively interacting with this post.'
          : 'Tip: Ask a simple question at the end of your caption to boost comments and saves.';
      }

      // 6. Email Open & Click Rate
      const sent = parseFloat(document.getElementById('calc-email-sent')?.value) || 1;
      const opens = parseFloat(document.getElementById('calc-email-opens')?.value) || 0;
      const eClicks = parseFloat(document.getElementById('calc-email-clicks')?.value) || 0;
      const openRate = (opens / sent) * 100;
      const eCtr = (eClicks / sent) * 100;
      const ctor = opens > 0 ? (eClicks / opens) * 100 : 0;

      document.getElementById('out-email-open').textContent = `${this.fmt(openRate, 1)}%`;
      document.getElementById('out-email-ctr').textContent = `${this.fmt(eCtr, 2)}%`;
      document.getElementById('out-email-ctor').textContent = `${this.fmt(ctor, 1)}%`;
    }
  };

  /* ------------------------------------------------------------------------
     4. MAIN APPLICATION CONTROLLER
     ------------------------------------------------------------------------ */
  const App = {
    tasks: [],
    planner: [],
    themes: ['dark', 'light', 'contrast'],
    themeIdx: 0,
    activeTab: 'tasks',
    deferredInstallPrompt: null,

    init() {
      this.loadState();
      this.initThemeAndTabs();
      MarketingCalculators.init();
      this.bindEvents();
      this.renderAll();
      this.registerServiceWorker();
    },

    loadState() {
      try {
        const raw = localStorage.getItem(STATE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.tasks = Array.isArray(parsed.tasks) && parsed.tasks.length ? parsed.tasks : DEFAULT_TASKS;
          this.planner = Array.isArray(parsed.planner) && parsed.planner.length ? parsed.planner : DEFAULT_PLANNER;
          return;
        }
      } catch (_) {}
      this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
      this.planner = JSON.parse(JSON.stringify(DEFAULT_PLANNER));
    },

    saveState() {
      try {
        localStorage.setItem(
          STATE_KEY,
          JSON.stringify({
            updatedAt: new Date().toISOString(),
            tasks: this.tasks,
            planner: this.planner
          })
        );
      } catch (_) {}
    },

    initThemeAndTabs() {
      const savedTheme = localStorage.getItem('dms_theme_pref');
      if (savedTheme && this.themes.includes(savedTheme)) {
        this.themeIdx = this.themes.indexOf(savedTheme);
      }
      this.applyTheme(this.themes[this.themeIdx]);

      const rawHash = (window.location.hash || '#tasks').replace('#', '').split('?')[0];
      const validTabs = ['tasks', 'planner', 'glossary', 'calculators'];
      this.switchTab(validTabs.includes(rawHash) ? rawHash : 'tasks', false);

      window.addEventListener('popstate', () => {
        const h = (window.location.hash || '#tasks').replace('#', '').split('?')[0];
        if (validTabs.includes(h)) this.switchTab(h, false);
      });
    },

    applyTheme(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      const lbl = document.getElementById('theme-icon-label');
      if (lbl) lbl.textContent = `Theme: ${themeName.toUpperCase()}`;
      const meta = document.getElementById('dynamic-theme-color');
      if (meta) {
        meta.setAttribute('content', themeName === 'light' ? '#0284C7' : '#0F172A');
      }
    },

    switchTab(tabId, pushHash = true) {
      this.activeTab = tabId;
      document.body.setAttribute('data-active-tab', tabId);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    renderAll() {
      this.renderSummary();
      this.renderTasks();
      this.renderPlanner();
      this.renderGlossary();
    },

    renderSummary() {
      const total = this.tasks.length || 1;
      const done = this.tasks.filter((t) => t.completed).length;
      const pct = Math.round((done / total) * 100);
      const starred =
        this.tasks.filter((t) => t.bookmarked).length +
        this.planner.filter((p) => p.bookmarked).length;

      const pctEl = document.getElementById('metric-completion-pct');
      const fillEl = document.getElementById('metric-progress-fill');
      const bmEl = document.getElementById('metric-bookmarked-count');
      const navTasks = document.getElementById('nav-badge-tasks');
      const navPlan = document.getElementById('nav-badge-planner');
      const navGloss = document.getElementById('nav-badge-glossary');

      if (pctEl) pctEl.textContent = `${pct}% (${done}/${this.tasks.length})`;
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (bmEl) bmEl.textContent = `${starred} Starred`;
      if (navTasks) navTasks.textContent = `${done}/${this.tasks.length}`;
      if (navPlan) navPlan.textContent = `${this.planner.length} Days`;
      if (navGloss) navGloss.textContent = `${GLOSSARY_TERMS.length} Terms`;
    },

    renderTasks() {
      const grid = document.getElementById('tasks-grid');
      const empty = document.getElementById('tasks-empty-state');
      const fuzzyBadge = document.getElementById('fuzzy-match-indicator');
      if (!grid) return;

      const query = (document.getElementById('task-search-input')?.value || '').trim();
      const cat = document.getElementById('filter-pillar')?.value || 'ALL';
      const freq = document.getElementById('filter-cadence')?.value || 'ALL';
      const status = document.getElementById('filter-status')?.value || 'ALL';

      let usedFuzzy = false;
      const matches = [];

      for (const t of this.tasks) {
        if (cat !== 'ALL' && t.category !== cat) continue;
        if (freq !== 'ALL' && t.frequency !== freq) continue;
        if (status === 'PENDING' && t.completed) continue;
        if (status === 'COMPLETED' && !t.completed) continue;
        if (status === 'BOOKMARKED' && !t.bookmarked) continue;

        const hay = `${t.title} ${t.category} ${t.goal} ${t.tools} ${(t.steps || []).join(' ')}`;
        const res = SmartSearch.match(query, hay);
        if (res.matched) {
          if (res.isFuzzy) usedFuzzy = true;
          matches.push({ task: t, score: res.score });
        }
      }

      matches.sort((a, b) => b.score - a.score);
      if (fuzzyBadge) fuzzyBadge.hidden = !usedFuzzy;

      if (!matches.length) {
        grid.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;

      grid.innerHTML = matches
        .map(({ task }) => {
          const stepsHtml = (task.steps || [])
            .map((s) => `<li>${this.escapeHtml(s)}</li>`)
            .join('');
          return `
          <article class="task-card ${task.completed ? 'is-completed' : ''}">
            <div>
              <div class="task-card__top">
                <div class="task-card__badges">
                  <span class="badge badge--accent">${this.escapeHtml(task.category)}</span>
                  <span class="badge">${this.escapeHtml(task.frequency)}</span>
                  <span class="badge ${task.priority.includes('High') ? 'badge--warning' : ''}">${this.escapeHtml(task.priority)}</span>
                </div>
              </div>
              <h3 class="task-card__title">${this.escapeHtml(task.title)}</h3>
              <div class="task-card__meta">
                <span><strong>Goal:</strong> ${this.escapeHtml(task.goal)}</span>
                <span><strong>Helpful Tool:</strong> ${this.escapeHtml(task.tools)}</span>
              </div>
              <ul class="task-card__sop">${stepsHtml}</ul>
            </div>
            <div class="task-card__footer">
              <button type="button" class="btn btn--sm ${task.completed ? 'btn--secondary' : 'btn--primary'}" data-action="toggle-task" data-id="${this.escapeHtml(task.id)}">
                ${task.completed ? '✓ Done' : 'Mark Done'}
              </button>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn--sm btn--secondary" data-action="bookmark-task" data-id="${this.escapeHtml(task.id)}">
                  ${task.bookmarked ? '★ Starred' : '☆ Star'}
                </button>
                <button type="button" class="btn btn--sm btn--ghost" data-action="copy-task" data-id="${this.escapeHtml(task.id)}">
                  Copy Checklist
                </button>
              </div>
            </div>
          </article>`;
        })
        .join('');
    },

    renderPlanner() {
      const list = document.getElementById('itinerary-list');
      if (!list) return;
      list.innerHTML = this.planner
        .map(
          (item) => `
        <article class="itinerary-card">
          <div class="itinerary-card__header">
            <span class="itinerary-card__time">${this.escapeHtml(item.day)}</span>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <span class="badge badge--accent">${this.escapeHtml(item.channel)}</span>
              <span class="badge">${this.escapeHtml(item.format)}</span>
            </div>
          </div>
          <h3 style="margin:0; font-size:1.12rem;">${this.escapeHtml(item.title)}</h3>
          <p style="margin:0; color:var(--text-secondary); font-size:0.95rem;">${this.escapeHtml(item.notes)}</p>
          <div class="itinerary-card__actions">
            <button type="button" class="btn btn--sm btn--secondary" data-action="bookmark-plan" data-id="${this.escapeHtml(item.id)}">
              ${item.bookmarked ? '★ Starred Day' : '☆ Star Day'}
            </button>
            <button type="button" class="btn btn--sm btn--ghost" data-action="copy-plan" data-id="${this.escapeHtml(item.id)}">
              Copy Plan
            </button>
          </div>
        </article>`
        )
        .join('');
    },

    renderGlossary() {
      const grid = document.getElementById('glossary-grid');
      if (!grid) return;
      const query = (document.getElementById('glossary-search-input')?.value || '').trim();
      const cat = document.getElementById('filter-glossary-cat')?.value || 'ALL';

      const filtered = GLOSSARY_TERMS.filter((item) => {
        if (cat !== 'ALL' && item.category !== cat) return false;
        const hay = `${item.term} ${item.category} ${item.simple} ${item.formula} ${item.example}`;
        return SmartSearch.match(query, hay).matched;
      });

      grid.innerHTML = filtered
        .map(
          (item) => `
        <article class="task-card">
          <div>
            <div class="task-card__badges">
              <span class="badge badge--accent">${this.escapeHtml(item.category)}</span>
            </div>
            <h3 class="task-card__title">${this.escapeHtml(item.term)}</h3>
            <p style="margin:6px 0; color:var(--text-primary); font-size:0.96rem;">
              ${this.escapeHtml(item.simple)}
            </p>
            <div class="glossary-formula">
              <strong>Formula:</strong> ${this.escapeHtml(item.formula)}
            </div>
            <div class="glossary-example">
              <strong>Real Example:</strong> ${this.escapeHtml(item.example)}
            </div>
          </div>
          <div class="task-card__footer">
            <button type="button" class="btn btn--sm btn--secondary" data-action="copy-term" data-term="${this.escapeHtml(item.term)}">
              Copy Definition
            </button>
          </div>
        </article>`
        )
        .join('');
    },

    exportBackupJson() {
      const payload = {
        guide: 'Digital Marketing Specialist Guide',
        exportedAt: new Date().toISOString(),
        tasks: this.tasks,
        planner: this.planner
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `digital-marketing-plan-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Toast.show('Marketing backup downloaded!');
    },

    importBackupJson(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data.tasks)) this.tasks = data.tasks;
          if (Array.isArray(data.planner)) this.planner = data.planner;
          this.saveState();
          this.renderAll();
          Toast.show('Marketing plan backup restored!');
        } catch (_) {
          Toast.show('Please select a valid backup .json file');
        }
      };
      reader.readAsText(file);
    },

    bindEvents() {
      document.querySelectorAll('.nav-tab').forEach((btn) => {
        btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
      });

      document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
        this.themeIdx = (this.themeIdx + 1) % this.themes.length;
        const next = this.themes[this.themeIdx];
        localStorage.setItem('dms_theme_pref', next);
        this.applyTheme(next);
        Toast.show(`Switched to ${next.toUpperCase()} theme`);
      });

      const onboardModal = document.getElementById('onboarding-overlay');
      document.getElementById('btn-open-onboarding')?.addEventListener('click', () => {
        if (onboardModal) onboardModal.hidden = false;
      });
      document.getElementById('btn-close-onboarding')?.addEventListener('click', () => {
        if (onboardModal) onboardModal.hidden = true;
      });
      document.getElementById('btn-onboarding-next')?.addEventListener('click', () => {
        if (onboardModal) onboardModal.hidden = true;
      });

      document.getElementById('btn-copy-deeplink')?.addEventListener('click', () => {
        const url = `https://esp046-cyber.github.io/Digital-Marketing-Specialist-guide/#${this.activeTab}`;
        ClipboardUtil.copy(url, 'Link copied');
      });

      ['task-search-input', 'filter-pillar', 'filter-cadence', 'filter-status'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.renderTasks());
      });

      document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
        document.getElementById('task-search-input').value = '';
        document.getElementById('filter-pillar').value = 'ALL';
        document.getElementById('filter-cadence').value = 'ALL';
        document.getElementById('filter-status').value = 'ALL';
        this.renderTasks();
      });

      ['glossary-search-input', 'filter-glossary-cat'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.renderGlossary());
      });

      // Task Card Actions
      document.getElementById('tasks-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const task = this.tasks.find((t) => t.id === btn.dataset.id);
        if (!task) return;

        if (btn.dataset.action === 'toggle-task') {
          task.completed = !task.completed;
          Haptics.tap();
          this.saveState();
          this.renderSummary();
          this.renderTasks();
          Toast.show(task.completed ? 'Task marked complete!' : 'Task reopened');
        } else if (btn.dataset.action === 'bookmark-task') {
          task.bookmarked = !task.bookmarked;
          Haptics.tap();
          this.saveState();
          this.renderSummary();
          this.renderTasks();
        } else if (btn.dataset.action === 'copy-task') {
          const text = `${task.title} (${task.category})\nGoal: ${task.goal}\nSteps:\n- ${(task.steps || []).join('\n- ')}`;
          ClipboardUtil.copy(text, 'Task checklist copied');
        }
      });

      // Content Planner Actions
      document.getElementById('itinerary-list')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const item = this.planner.find((p) => p.id === btn.dataset.id);
        if (!item) return;

        if (btn.dataset.action === 'bookmark-plan') {
          item.bookmarked = !item.bookmarked;
          Haptics.tap();
          this.saveState();
          this.renderSummary();
          this.renderPlanner();
        } else if (btn.dataset.action === 'copy-plan') {
          ClipboardUtil.copy(`${item.day}: ${item.title} (${item.channel}) - ${item.notes}`, 'Planner day copied');
        }
      });

      // Glossary Copy Action
      document.getElementById('glossary-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="copy-term"]');
        if (!btn) return;
        const item = GLOSSARY_TERMS.find((g) => g.term === btn.dataset.term);
        if (!item) return;
        const text = `${item.term}: ${item.simple}\nFormula: ${item.formula}\nExample: ${item.example}`;
        ClipboardUtil.copy(text, `Copied "${item.term}"`);
      });

      // Print / PDF Buttons
      ['btn-print-tasks', 'btn-print-itinerary', 'btn-print-glossary'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => window.print());
      });

      // Export / Import Backup
      document.getElementById('btn-export-json')?.addEventListener('click', () => this.exportBackupJson());
      document.getElementById('input-import-json')?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) this.importBackupJson(file);
      });

      // Add Custom Task Modal
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
      document.getElementById('custom-item-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('custom-title').value.trim();
        const category = document.getElementById('custom-pillar').value;
        const frequency = document.getElementById('custom-cadence').value;
        const goal = document.getElementById('custom-kpi').value.trim() || 'Grow clicks and customer sales';
        const stepsRaw = document.getElementById('custom-steps').value.trim();
        const steps = stepsRaw
          ? stepsRaw.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Prepare creative and copy', 'Publish and review results'];

        this.tasks.unshift({
          id: 'task-custom-' + Date.now(),
          title,
          category,
          frequency,
          priority: 'High Priority',
          goal,
          tools: 'Custom Marketing Workflow',
          steps,
          completed: false,
          bookmarked: true
        });
        this.planner.unshift({
          id: 'plan-custom-' + Date.now(),
          day: `${frequency} Campaign Task`,
          title,
          channel: category,
          format: 'Custom Action Item',
          notes: `Goal: ${goal} | Steps: ${steps.join(' -> ')}`,
          bookmarked: true
        });
        this.saveState();
        this.renderAll();
        e.target.reset();
        if (customModal) customModal.hidden = true;
        Toast.show('Added to your Tasks and Content Planner!');
      });

      // Online / Offline Pill
      const updateNet = () => {
        const pill = document.getElementById('network-status-pill');
        if (pill) {
          pill.textContent = navigator.onLine ? 'Saved on Device' : 'Offline Mode (Saved)';
        }
      };
      window.addEventListener('online', updateNet);
      window.addEventListener('offline', updateNet);

      // Install Prompt
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
          navigator.serviceWorker.register('./service-worker.js').catch(() => {});
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
