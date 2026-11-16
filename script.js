/* ==========================================================================
   Digital Marketing Specialist Workstation (v4.0 Worldwide Edition)
   - Fixes task loading & auto-upgrades legacy localStorage schemas so tasks never show empty
   - 9-Point Workstation Guide inside every task card
   - Multi-Currency (USD, PHP, GBP, EUR, AUD, CAD, SGD), Market Region & Business Focus
   - Built-in UTM Builder, Campaign Brief Generator, Monthly Report Generator & AI Prompt Helper
   - Margin-aware Break-Even ROAS & Customizable Calculator Benchmarks
   ========================================================================== */

(function () {
  'use strict';

  const STATE_KEY = 'dms_workstation_state_v4';
  const PREFS_KEY = 'dms_workstation_prefs_v4';
  const DEFAULT_TASKS = [
  {
    "id": "ws-strat-01",
    "title": "Target Audience & Customer Persona Research",
    "category": "Marketing Strategy & Research",
    "frequency": "Monthly",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Create a clear profile of your ideal buyer\u2014including their biggest problem, buying triggers, objections, and favorite online channels.",
    "why": "When you know exactly who you are talking to and what problems keep them awake, your ads and posts get 2x\u20133x more clicks at a lower cost.",
    "when": "Before launching any new product, campaign, or quarterly marketing plan (and reviewed monthly).",
    "tools": "Customer Surveys, Google Analytics, Reviews (Trustpilot / Shopee / Lazada / Amazon), AnswerThePublic",
    "steps": [
      "Read 20 recent 5-star and 1-star customer reviews in your product category to spot exact phrases buyers use.",
      "Write down the top 3 problems your customer wants to solve and the #1 reason they hesitate to buy.",
      "List the top 2 platforms where this buyer spends time daily (e.g., TikTok & Shopee in PH, LinkedIn & Google in B2B US/UK).",
      "Summarize this into a 1-page Customer Persona card for your team."
    ],
    "expected": "A 1-page Customer Persona profile with 3 pain points, 3 buying triggers, and top channels.",
    "measure": "Higher Click-Through Rate (CTR) and lower Cost Per Lead/Sale on campaigns written for this persona.",
    "mistakes": "Guessing what customers want without reading real reviews or making the audience 'everyone aged 18\u201365'.",
    "example": "Persona: 'Busy Working Parent in Metro Manila / London' \u2014 Wants: 15-minute healthy dinner kits; Objection: Worried about delivery freshness; Channel: Instagram Reels & Google Search.",
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "ws-strat-02",
    "title": "Competitor Offer, Ad & Funnel Analysis",
    "category": "Marketing Strategy & Research",
    "frequency": "Monthly",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Review the top 3 competitors in your market to see what ads they are running, how they price their offer, and how their landing page converts visitors.",
    "why": "Shows you what is already working in your market and reveals gaps where your brand can stand out.",
    "when": "Once a month and before launching a major seasonal promotion.",
    "tools": "Meta Ad Library, Google Ads Transparency Center, TikTok Creative Center, Similarweb",
    "steps": [
      "Look up your top 3 competitors inside the free Meta Ad Library and Google Ads Transparency Center.",
      "Find ads they have kept running for 30+ days (long-running ads are usually profitable).",
      "Click through their landing page and sign up for their email list to see their follow-up sequence.",
      "Write down 2 strengths to learn from and 2 weaknesses your offer solves better."
    ],
    "expected": "A comparison table of 3 competitors showing their headline, offer/bonus, pricing, and ad hooks.",
    "measure": "New differentiated ad angles that beat your baseline click rate by 15\u201325%.",
    "mistakes": "Copying a competitor's ad word-for-word instead of highlighting what makes your offer stronger.",
    "example": "Competitor charges $15 shipping with 5-day delivery; we highlight 'Free Next-Day Shipping + 30-Day Guarantee' in our headline.",
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "ws-strat-03",
    "title": "Customer Journey & Funnel Stage Mapping",
    "category": "Marketing Strategy & Research",
    "frequency": "Quarterly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Map out the 3 steps a stranger takes from first discovering your brand (Awareness), to trusting you (Consideration), to buying (Conversion).",
    "why": "Most people do not buy the very first time they see an ad. Mapping the journey ensures you follow up at every stage.",
    "when": "At the start of each quarter or when launching a new product line.",
    "tools": "Notion / Google Docs, Tab 02 Campaign Planner, Google Analytics Funnel Report",
    "steps": [
      "Step 1 (Awareness): Choose content that attracts cold audiences (short videos, helpful blog guides, search ads).",
      "Step 2 (Consideration): Offer a low-risk next step (free sample, price guide, case study, customer reviews).",
      "Step 3 (Conversion): Present a clear offer with urgency, trust badges, and simple checkout or booking.",
      "Assign 1 metric to measure each stage (Reach -> Clicks/Leads -> Sales)."
    ],
    "expected": "A complete 3-stage marketing funnel diagram with matching content and ads for each step.",
    "measure": "Steady increase in returning visitor conversion rate and overall sales.",
    "mistakes": "Showing hard-sell 'Buy Now' ads to cold strangers without any proof or education.",
    "example": "Stage 1: 30s TikTok tip video -> Stage 2: Free PDF buying guide via email -> Stage 3: 10% first-order welcome voucher.",
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "ws-ads-01",
    "title": "Google Ads Search Term Cleanup & Negative Keywords",
    "category": "Advertising & Campaign Management",
    "frequency": "Weekly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Review the exact search phrases people typed into Google before clicking your paid ads, and block unrelated words.",
    "why": "Stops you from paying for accidental clicks from people looking for freebies, jobs, or unrelated products.",
    "when": "Twice a week for new campaigns; once a week for established campaigns.",
    "tools": "Google Ads (Insights & Reports -> Search Terms)",
    "steps": [
      "Open Google Ads and navigate to Campaigns -> Insights and Reports -> Search Terms.",
      "Sort by 'Cost' from highest to lowest over the last 7 to 14 days.",
      "Select any unrelated search phrases (e.g., 'free', 'salary', 'repair manual') and click 'Add as negative keyword'.",
      "Take high-converting search phrases and add them as Exact or Phrase match keywords."
    ],
    "expected": "A cleaner search campaign where 90%+ of paid clicks come from high-intent buyers.",
    "measure": "10% to 25% lower Cost Per Acquisition (CPA) and higher Conversion Rate.",
    "mistakes": "Using broad match keywords without adding negative keywords, which burns budget rapidly.",
    "example": "An online accounting software company blocks 'accounting jobs' and 'free excel template', saving $450/month in wasted clicks.",
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "ws-ads-02",
    "title": "Meta (Facebook/Instagram) & TikTok Ad Creative Testing",
    "category": "Advertising & Campaign Management",
    "frequency": "Weekly",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "LocalService"
    ],
    "what": "Launch and compare 3 different video or image ad angles to see which hook captures attention and drives the lowest cost per sale.",
    "why": "On social media, your creative (video/image) drives 70%+ of ad performance. Fresh hooks prevent ad fatigue.",
    "when": "Every week or whenever ad click rates drop and costs rise.",
    "tools": "Meta Ads Manager, TikTok Ads Manager, CapCut, Canva",
    "steps": [
      "Prepare 3 distinct ad concepts: (A) Problem/Solution demo, (B) Customer review/unboxing, (C) Before & After comparison.",
      "Make the first 3 seconds visually engaging with clear on-screen headline text.",
      "Run all 3 ads with equal budget for 3 to 5 days before turning off the losers.",
      "Scale budget on the winning ad that beats your target Cost Per Sale."
    ],
    "expected": "1 to 2 winning video or carousel ads that bring consistent daily sales within your target margin.",
    "measure": "Link Click-Through Rate (CTR) above 1.5% and Return on Ad Spend (ROAS) above your break-even target.",
    "mistakes": "Turning off an ad after only 3 hours or changing 5 things at once so you don't know what worked.",
    "example": "Hook A ('Tired of back pain at your desk?') got a 2.8% CTR and $12 CPA vs Hook B's 0.9% CTR.",
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "ws-ads-03",
    "title": "B2B LinkedIn Lead Generation & Account Targeting",
    "category": "Advertising & Campaign Management",
    "frequency": "Weekly",
    "difficulty": "Advanced",
    "regions": [
      "GLOBAL",
      "US",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "B2B",
      "SaaS",
      "ALL"
    ],
    "what": "Run targeted campaigns reaching decision-makers by Job Title, Industry, and Company Size on LinkedIn.",
    "why": "For B2B and high-ticket services, LinkedIn lets you put your offer directly in front of verified managers, directors, and founders.",
    "when": "Weekly optimization during active B2B lead generation campaigns.",
    "tools": "LinkedIn Campaign Manager, HubSpot / Salesforce CRM",
    "steps": [
      "Filter audience by specific Job Titles or Seniority (e.g., HR Director, Operations Manager) and Company Size (50\u2013500 employees).",
      "Disable 'Audience Expansion' so LinkedIn doesn't show ads outside your strict buyer criteria.",
      "Offer a high-value industry benchmark report, ROI calculator, or live demo using LinkedIn Lead Gen Forms.",
      "Sync leads automatically to your CRM for a 15-minute sales follow-up."
    ],
    "expected": "Qualified business leads with verified work emails, company names, and job titles.",
    "measure": "Cost Per Qualified Lead (CPQL) and percentage of leads that book a discovery call.",
    "mistakes": "Sending cold B2B traffic to a generic 'Contact Us' page instead of a specific case study or value offer.",
    "example": "Offering a '2026 Warehouse Automation Cost Guide' generated 42 qualified Operations Director leads at $38/lead.",
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "ws-ads-04",
    "title": "Daily Budget Pacing & Break-Even ROAS Check",
    "category": "Advertising & Campaign Management",
    "frequency": "Daily",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Check daily ad spending across all platforms to make sure you neither overspend your monthly budget nor run ads below your break-even profit margin.",
    "why": "Prevents costly billing surprises and protects your net profit margin.",
    "when": "10 minutes every morning.",
    "tools": "Tab 04 Break-Even & ROAS Calculator, Google Ads, Meta Ads",
    "steps": [
      "Calculate your true Break-Even ROAS in Tab 04 using your actual product profit margin.",
      "Check yesterday's spend and ROAS across Google, Meta, TikTok, or LinkedIn.",
      "Pause ad sets that spent 2x your target Cost Per Sale with 0 conversions.",
      "Increase budget by no more than 15\u201320% at a time on profitable campaigns."
    ],
    "expected": "Controlled monthly ad spend within +/- 3% of plan and positive net profit after ad costs.",
    "measure": "Net Profit ROI (%) and actual spend vs. planned monthly budget.",
    "mistakes": "Doubling an ad set's budget overnight (which resets the ad platform's learning phase) or ignoring product costs.",
    "example": "With a 50% gross margin, your Break-Even ROAS is 2.0x. Any campaign above 2.8x ROAS is generating healthy net profit.",
    "completed": true,
    "bookmarked": true
  },
  {
    "id": "ws-seo-01",
    "title": "High-Intent Keyword Research & Search Intent Mapping",
    "category": "SEO & Website Optimization",
    "frequency": "Monthly",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Find the exact phrases customers type into Google when they are ready to compare options or buy.",
    "why": "Ranking for 1 buyer-intent phrase (like 'best CRM for small agencies') brings more sales than 10 vague topics.",
    "when": "Monthly when planning new website pages and blog articles.",
    "tools": "Google Keyword Planner, Google Search Console, Ahrefs / Semrush / Ubersuggest",
    "steps": [
      "List 10 core products or services you offer and pair them with buyer words ('best', 'pricing', 'review', 'near me').",
      "Check monthly search volume and competition in Google Keyword Planner.",
      "Group similar keywords together so 1 strong page targets 1 main topic.",
      "Match your page type to what currently ranks on Page 1 (product page, comparison guide, or calculator)."
    ],
    "expected": "A prioritized list of 10\u201320 target keywords mapped to specific website pages.",
    "measure": "Top 10 Google rankings and month-over-month growth in non-branded organic clicks.",
    "mistakes": "Creating multiple weak pages targeting the exact same keyword (keyword cannibalization).",
    "example": "Targeting 'emergency plumber Pasig 24/7' on a dedicated service page with clear pricing and a click-to-call button.",
    "completed": true,
    "bookmarked": false
  },
  {
    "id": "ws-seo-02",
    "title": "On-Page SEO Audit (Titles, Headings, Internal Links & Alt Text)",
    "category": "SEO & Website Optimization",
    "frequency": "Weekly",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Optimize your page title, H1 heading, subheadings, image descriptions, and internal links so Google and readers immediately understand the page.",
    "why": "Simple on-page updates often jump a page from position #12 (Page 2) to position #4 (Page 1) within weeks.",
    "when": "Every time you publish a new page and weekly for existing top pages.",
    "tools": "Google Search Console, Yoast / RankMath, Screaming Frog",
    "steps": [
      "Place your primary keyword near the front of the Page Title (<60 chars) and H1 Heading.",
      "Write a compelling Meta Description (<155 chars) with a clear benefit so searchers click your link.",
      "Add descriptive alt text to images and compress them to WebP format.",
      "Add 3 internal links from your existing high-traffic pages pointing to the new page."
    ],
    "expected": "100% of priority landing pages have unique titles, fast images, and strong internal links.",
    "measure": "Higher organic Click-Through Rate (CTR) and average position in Google Search Console.",
    "mistakes": "Leaving default titles like 'Home - Company Name' or stuffing keywords unnaturally into every sentence.",
    "example": "Changing title from 'Services' to 'Commercial Solar Installation in Melbourne \u2014 Free Site Quote' lifted organic clicks by 48%.",
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "ws-seo-03",
    "title": "Landing Page Speed & Conversion Rate Optimization (CRO)",
    "category": "SEO & Website Optimization",
    "frequency": "Monthly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Make your landing page load in under 3 seconds on mobile and remove friction so more visitors turn into buyers or leads.",
    "why": "Doubling your conversion rate from 1.5% to 3.0% doubles your sales without spending a single extra dollar or peso on ads.",
    "when": "Monthly review of your top 5 highest-traffic landing pages.",
    "tools": "Google PageSpeed Insights, Microsoft Clarity (free heatmaps & recordings)",
    "steps": [
      "Open your landing page on a smartphone and check if the main headline, benefit, and button are visible without scrolling.",
      "Place real customer reviews, star ratings, or client logos right next to your call-to-action button.",
      "Watch 10 session recordings in Microsoft Clarity to see where mobile users get stuck or drop off.",
      "Remove non-essential form fields so checkout or lead signup takes under 45 seconds."
    ],
    "expected": "A fast, mobile-friendly landing page with clear trust signals and a frictionless checkout/form.",
    "measure": "Landing page Conversion Rate (CVR %) and bounce rate reduction.",
    "mistakes": "Sending paid ad traffic to a slow homepage with 15 different menu links instead of 1 focused offer page.",
    "example": "Cutting a B2B quote form from 9 fields down to 4 fields increased completed lead submissions by 37%.",
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "ws-ana-01",
    "title": "Google Analytics 4 (GA4) & Conversion Tracking Check",
    "category": "Analytics & Reporting",
    "frequency": "Weekly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Verify that every purchase, lead form submission, phone click, or chat inquiry is accurately recorded in Google Analytics 4 and your ad platforms.",
    "why": "If conversion tracking breaks, you and your ad algorithms are flying blind and cannot tell which ads bring real revenue.",
    "when": "Weekly and immediately after any website or checkout update.",
    "tools": "Google Analytics 4 (GA4), Google Tag Manager, Meta Pixel Helper",
    "steps": [
      "Complete a real test signup or test order on your website using your mobile phone.",
      "Confirm the conversion event fires once (and not twice) in GA4 Realtime / DebugView.",
      "Compare total orders/leads in GA4 against your actual store backend (Shopify, WooCommerce, CRM).",
      "Ensure cookie consent banners (GDPR in UK/EU) properly pass consent signals."
    ],
    "expected": "Accurate, deduplicated conversion tracking within 5% of actual backend orders/leads.",
    "measure": "Tracking accuracy % between backend sales records and analytics dashboard.",
    "mistakes": "Counting every 'Page View' as a conversion instead of tracking only the final 'Thank You / Order Confirmed' action.",
    "example": "Fixing a broken Thank-You page tag revealed that Email newsletters were driving 30% more purchases than previously reported.",
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "ws-ana-02",
    "title": "UTM Tracking Link Standardization for All Campaigns",
    "category": "Analytics & Reporting",
    "frequency": "Daily",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Attach consistent UTM tracking tags to every link you share in emails, social media bios, QR codes, and paid ads.",
    "why": "Without UTM tags, Google Analytics lumps your social media and email clicks into 'Direct / Unknown' traffic.",
    "when": "Every time you publish a campaign link (use the built-in UTM Builder in Tab 02!).",
    "tools": "Tab 02 Built-In UTM Builder, Google Analytics Traffic Acquisition Report",
    "steps": [
      "Open Tab 02 (Campaign & Content Hub) and scroll to the built-in UTM Link Builder.",
      "Enter your website URL, Traffic Source (e.g., `instagram`, `newsletter`), Medium (`social`, `email`, `cpc`), and Campaign Name (`summer_sale`).",
      "Always use lowercase letters and underscores so Analytics doesn't split `Facebook` and `facebook` into two rows.",
      "Copy the generated tracking link and test it in your browser before posting."
    ],
    "expected": "100% of campaign links tagged with clean, lowercase UTM parameters.",
    "measure": "Unassigned / Direct traffic share drops below 10% in Google Analytics.",
    "mistakes": "Using UTM tags on internal links inside your own website (which overwrites the original traffic source!).",
    "example": "`https://yourstore.com/promo?utm_source=tiktok&utm_medium=video_bio&utm_campaign=payday_sale`",
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "ws-ana-03",
    "title": "Monthly Executive Performance Report & ROI Summary",
    "category": "Analytics & Reporting",
    "frequency": "Monthly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Compile a clear 1-page monthly report showing Total Spend, Total Revenue/Leads, ROAS/ROI, Top 3 Wins, and Next Month's Action Plan.",
    "why": "Clients and managers don't want 40 pages of raw charts\u2014they want to know what money was spent, what returned, and what you are doing next.",
    "when": "First business day of every month.",
    "tools": "Tab 02 Monthly Report Generator, Google Looker Studio, Google Analytics",
    "steps": [
      "Gather total marketing spend, total revenue, and total leads/customers for the month.",
      "Use the Tab 02 Monthly Report Generator to calculate blended ROAS, CPA, and conversion rate automatically.",
      "List the Top 3 winning campaigns/posts and Top 2 lessons learned from underperforming tests.",
      "Outline 3 concrete priorities for the upcoming month and export/print as a clean PDF."
    ],
    "expected": "A concise, plain-English 1-page Monthly Marketing Report ready for clients or leadership.",
    "measure": "Stakeholder approval, clear budget decisions, and consistent month-over-month efficiency gains.",
    "mistakes": "Reporting only 'vanity metrics' (likes and impressions) without connecting them to leads, sales, or revenue.",
    "example": "'In October we invested $4,200 across Google & Meta Ads, generating 140 new customers and $18,900 in revenue (4.5x ROAS).'",
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "ws-crm-01",
    "title": "Automated Welcome & Abandoned Cart Email/SMS Flows",
    "category": "CRM & Marketing Automation",
    "frequency": "Monthly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Set up and test automated messages that greet new subscribers immediately and remind shoppers who left items in their cart.",
    "why": "Automated flows work 24/7 in the background and typically generate 25% to 40% of total email marketing revenue.",
    "when": "Set up once, then review and A/B test subject lines monthly.",
    "tools": "Klaviyo, Mailchimp, HubSpot, ActiveCampaign, Brevo",
    "steps": [
      "Email 1 (Sent immediately on signup): Deliver the promised welcome gift/guide and share your brand story.",
      "Email 2 (Sent 24 hours later): Highlight your best-selling products or top 3 customer case studies.",
      "Abandoned Cart Flow (Sent 1 hour & 20 hours after cart exit): Show the exact item left behind with a direct link back to checkout.",
      "Verify opt-in consent and include a 1-click Unsubscribe link in every footer (required by GDPR/CAN-SPAM)."
    ],
    "expected": "Live 3-part Welcome Flow and 2-part Abandoned Cart/Lead Follow-Up Flow.",
    "measure": "Click-Through Rate (CTR %) and Revenue or Bookings per recipient (avoid relying solely on Open Rate due to Apple Mail Privacy Protection).",
    "mistakes": "Sending a discount code in the very first hour of cart abandonment (which trains customers to abandon carts on purpose).",
    "example": "A 2-step Abandoned Cart flow recovered 14% of unfinished checkouts, adding \u20b185,000 / $1,500 in monthly sales automatically.",
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "ws-crm-02",
    "title": "Customer Segmentation (VIP Buyers, First-Timers & Win-Back)",
    "category": "CRM & Marketing Automation",
    "frequency": "Monthly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Group your customer list by buying behavior so VIP customers get early access, first-time buyers get usage tips, and inactive buyers get a win-back offer.",
    "why": "Segmented emails generate 3x higher click rates and half as many unsubscribes compared to blasting the same email to everyone.",
    "when": "Monthly list segmentation and hygiene check.",
    "tools": "Klaviyo, HubSpot, Salesforce, Shopify Customer Segments",
    "steps": [
      "Create Segment 1 (VIPs): Customers who bought 3+ times or spent in the top 15%.",
      "Create Segment 2 (Warm Prospects): Subscribers who clicked an email in the last 30 days but haven't bought yet.",
      "Create Segment 3 (Win-Back): Past buyers who haven't ordered in 60\u201390 days.",
      "Suppress unengaged addresses (no clicks in 120+ days) to keep inbox deliverability high."
    ],
    "expected": "4 clean customer segments in your CRM/email platform with tailored messaging.",
    "measure": "Repeat purchase rate (%), revenue per email recipient, and spam complaint rate under 0.08%.",
    "mistakes": "Blasting daily promo emails to cold inactive contacts, which pushes your domain into the Gmail/Yahoo Spam folder.",
    "example": "Giving the VIP segment 24-hour early access to a new product launch generated 40% of launch-week sales with $0 ad spend.",
    "completed": false,
    "bookmarked": false
  },
  {
    "id": "ws-cnt-01",
    "title": "Short-Form Vertical Video Production (TikTok, Reels & Shorts)",
    "category": "Content Production",
    "frequency": "Weekly",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Script, film, and caption 3 to 5 short vertical videos (15\u201345 seconds) that educate, entertain, or demonstrate your product in action.",
    "why": "Short vertical video is the #1 organic reach engine across TikTok, Instagram Reels, YouTube Shorts, and Facebook.",
    "when": "Batch-record once a week.",
    "tools": "Smartphone Camera, CapCut, Canva, TikTok / Instagram App",
    "steps": [
      "Hook (0\u20133 seconds): Start with a bold question, surprising visual, or specific customer problem.",
      "Value / Demo (3\u201325 seconds): Show the step-by-step fix or product demonstration with fast cuts every 3\u20134 seconds.",
      "Captions: Add large, high-contrast captions in the center safe zone so 80% of sound-off viewers can read along.",
      "Call to Action (Last 4 seconds): Tell viewers one clear next step ('Comment GUIDE' or 'Tap the link in our bio')."
    ],
    "expected": "3\u20135 ready-to-post vertical videos with captions and strong 3-second hooks.",
    "measure": "3-Second Hold Rate (>30%), Average Watch Time, Saves/Shares, and profile link clicks.",
    "mistakes": "Starting videos with a slow 5-second logo intro or 'Hi guys, welcome back'\u2014which causes viewers to swipe away immediately.",
    "example": "Starting a video with '3 mistakes costing small restaurants 20% of their delivery orders' reached 48,000 local viewers organically.",
    "completed": false,
    "bookmarked": true
  },
  {
    "id": "ws-cnt-02",
    "title": "Content Repurposing & Multi-Channel Scheduling",
    "category": "Content Production",
    "frequency": "Weekly",
    "difficulty": "Beginner",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Turn 1 core weekly topic (a blog guide, podcast, or customer case study) into 6+ pieces of content across social media and email.",
    "why": "Saves 10+ hours a week while keeping your brand message consistent across every platform.",
    "when": "Every Monday or Tuesday during weekly content planning.",
    "tools": "Canva, Buffer / Meta Business Suite / Later, Tab 02 Content Planner",
    "steps": [
      "Start with 1 high-value topic that answers a major customer question.",
      "Create 1 swipeable 5-slide carousel for Instagram & LinkedIn summarizing the main steps.",
      "Film 2 short 30-second vertical videos covering tip #1 and tip #2.",
      "Adapt the summary into your Thursday email newsletter and schedule all posts for peak hours."
    ],
    "expected": "A full week of scheduled posts across 3\u20134 platforms built from a single research topic.",
    "measure": "Publishing consistency (100% on-schedule) and total weekly organic website visits.",
    "mistakes": "Trying to invent a brand-new topic from scratch every single morning.",
    "example": "1 'Complete Guide to Home Espresso' article became 1 newsletter, 2 LinkedIn/IG carousels, and 3 TikTok brewing clips.",
    "completed": true,
    "bookmarked": false
  },
  {
    "id": "ws-cnt-03",
    "title": "High-Converting Copywriting (Headlines, Ad Copy & CTAs)",
    "category": "Content Production",
    "frequency": "Weekly",
    "difficulty": "Intermediate",
    "regions": [
      "GLOBAL",
      "US",
      "PH",
      "UK",
      "EU",
      "AU"
    ],
    "industries": [
      "ALL",
      "Ecommerce",
      "B2B",
      "SaaS",
      "LocalService"
    ],
    "what": "Write clear, benefit-driven headlines and ad copy using proven frameworks like PAS (Problem -> Agitate -> Solution) and AIDA.",
    "why": "Clear words sell. Focusing on how the customer's life improves beats listing technical product specs every time.",
    "when": "Whenever writing new ads, landing pages, emails, or social captions.",
    "tools": "Tab 02 Marketing Brief & AI Prompt Helper, Google Docs, Hemingway Editor",
    "steps": [
      "Lead with the customer's #1 desired outcome or problem in the first sentence.",
      "Replace vague claims ('high quality service') with specific numbers ('installed in 24 hours with a 5-year warranty').",
      "Address the top buying objection directly (shipping speed, setup ease, money-back guarantee).",
      "Read your copy out loud\u2014if a 12-year-old can understand it on the first read, it is ready to publish."
    ],
    "expected": "3 headline variations and 2 body copy options ready for A/B testing.",
    "measure": "Ad Click-Through Rate (CTR %) and Landing Page Conversion Rate (CVR %).",
    "mistakes": "Using complicated corporate buzzwords ('synergistic omnichannel solutions') instead of plain everyday language.",
    "example": "Instead of 'Next-Gen Cloud Invoicing Platform', write 'Send Invoices in 30 Seconds and Get Paid 2x Faster'.",
    "completed": false,
    "bookmarked": false
  }
];
  const DEFAULT_PLANNER = [
  {
    "id": "plan-mon",
    "day": "Monday \u2014 Strategy, Budget & Ad Audit",
    "title": "Review Weekly Ad Spend, Break-Even ROAS & Search Terms",
    "channel": "Google Ads + Meta Ads + GA4",
    "format": "Budget Pacing & Negative Keyword Check",
    "notes": "Compare last week's spend against your Break-Even ROAS in Tab 04, block irrelevant search terms, and shift budget to top winners.",
    "bookmarked": true
  },
  {
    "id": "plan-tue",
    "day": "Tuesday \u2014 SEO & Website Optimization",
    "title": "Publish High-Intent Article & Optimize Top Landing Page",
    "channel": "Website Blog + Google Search Console + GBP",
    "format": "SEO Guide + Mobile Page Speed Check",
    "notes": "Publish 1 helpful guide targeting a buyer keyword, add 3 internal links, and post an update on your Google Business Profile.",
    "bookmarked": false
  },
  {
    "id": "plan-wed",
    "day": "Wednesday \u2014 Short-Form Video & Creative Production",
    "title": "Film & Schedule 3 Vertical Videos (TikTok, Reels & Shorts)",
    "channel": "TikTok + Instagram Reels + YouTube Shorts",
    "format": "30s Problem/Solution Demo + Captions",
    "notes": "Hook viewers in the first 3 seconds, include clear captions in the center safe zone, and point viewers to your UTM-tagged bio link.",
    "bookmarked": true
  },
  {
    "id": "plan-thu",
    "day": "Thursday \u2014 Email & CRM Lifecycle",
    "title": "Send Segmented Value Newsletter & Check Automated Flows",
    "channel": "Email List + CRM Automation (Klaviyo / HubSpot)",
    "format": "1 Actionable Tip + 1 Clear Offer CTA",
    "notes": "Send to engaged subscribers, check Welcome and Abandoned Cart flow click rates (focus on CTR rather than Apple MPP inflated opens).",
    "bookmarked": true
  },
  {
    "id": "plan-fri",
    "day": "Friday \u2014 Analytics, A/B Testing & Reporting",
    "title": "Review A/B Split Tests, Lead Tracker & Weekly KPI Summary",
    "channel": "GA4 + Microsoft Clarity + Tab 02 Report Generator",
    "format": "Conversion Funnel & Executive Summary",
    "notes": "Check landing page conversion rates, record A/B test results, follow up with open leads, and prepare next week's campaign brief.",
    "bookmarked": false
  },
  {
    "id": "plan-launch",
    "day": "Monthly Campaign Launch Day",
    "title": "Full Campaign Rollout, UTM Tagging & Privacy Consent Check",
    "channel": "Omnichannel (Paid Ads, Email, Social, Landing Page)",
    "format": "Campaign Launch Checklist",
    "notes": "Generate clean UTM links in Tab 02, verify mobile checkout speed, confirm GDPR/privacy consent banner, and activate retargeting ads.",
    "bookmarked": true
  }
];
  const GLOSSARY_TERMS = [
  {
    "term": "ROAS (Return on Ad Spend)",
    "category": "Paid Ads & Profit",
    "simple": "How much gross revenue you earn back for every 1 unit of currency ($1, \u20b11, \u00a31, \u20ac1) spent on ads.",
    "formula": "ROAS = Revenue from Ads \u00f7 Ad Spend",
    "example": "Important: A 4.0x ROAS is NOT automatically profitable! If your product profit margin is only 20%, your break-even ROAS is 5.0x. Always compare ROAS against your Break-Even ROAS in Tab 04."
  },
  {
    "term": "Break-Even ROAS",
    "category": "Paid Ads & Profit",
    "simple": "The exact ROAS number you must hit so your ad campaign doesn't lose money after paying for product costs.",
    "formula": "Break-Even ROAS = 1 \u00f7 Gross Profit Margin (as a decimal)",
    "example": "If a product sells for $100 and costs $40 to make/deliver, your profit margin is 60% (0.60). Your Break-Even ROAS is 1 \u00f7 0.60 = 1.67x."
  },
  {
    "term": "ROI (Return on Investment) & Net Profit",
    "category": "Paid Ads & Profit",
    "simple": "Your true profit percentage after subtracting BOTH your product/service delivery costs AND your marketing costs.",
    "formula": "ROI (%) = ((Revenue - Product Cost - Ad Spend) \u00f7 Total Cost) \u00d7 100",
    "example": "If you earn $10,000 in sales, product cost is $4,000, and ad spend is $2,000, your Net Profit is $4,000 and your ROI is +66.7%."
  },
  {
    "term": "MER (Marketing Efficiency Ratio / Blended ROAS)",
    "category": "Paid Ads & Profit",
    "simple": "Your total store revenue divided by your total ad spend across all channels combined.",
    "formula": "MER = Total Business Revenue \u00f7 Total Marketing Spend",
    "example": "Because customers often see a TikTok video and later search on Google, MER shows the true big-picture health of all your marketing combined."
  },
  {
    "term": "CPC (Cost Per Click) & CTR (Click-Through Rate)",
    "category": "Paid Ads & Profit",
    "simple": "CPC is how much you pay for each click; CTR is the percentage of people who saw your ad and clicked it.",
    "formula": "CPC = Spend \u00f7 Clicks  |  CTR (%) = (Clicks \u00f7 Views) \u00d7 100",
    "example": "When your ad is relevant and has a higher CTR (e.g., 2.5% instead of 0.7%), ad platforms reward you with a lower Cost Per Click."
  },
  {
    "term": "CPA / CAC (Cost Per Acquisition / Customer)",
    "category": "Paid Ads & Profit",
    "simple": "How much marketing money you spend to win 1 paying customer.",
    "formula": "CPA = Total Ad Spend \u00f7 Number of New Customers",
    "example": "If your average customer brings $60 in gross profit on their first order, your CPA must stay below $60 to be profitable on day one."
  },
  {
    "term": "CPL (Cost Per Lead)",
    "category": "Paid Ads & Profit",
    "simple": "How much you spend to get 1 interested prospect's contact details (email, phone call, or quote request).",
    "formula": "CPL = Total Ad Spend \u00f7 Total Leads",
    "example": "If 1 out of every 5 leads turns into a $500 client, you can afford up to $50 per lead and still double your money."
  },
  {
    "term": "Conversion Rate (CVR %)",
    "category": "Website & SEO",
    "simple": "The percentage of website visitors who complete your goal (buy a product, book an appointment, or submit a form).",
    "formula": "CVR (%) = (Conversions \u00f7 Total Visitors) \u00d7 100",
    "example": "30 buyers out of 1,000 visitors equals a 3.0% Conversion Rate."
  },
  {
    "term": "AOV (Average Order Value) & LTV (Lifetime Value)",
    "category": "Website & SEO",
    "simple": "AOV is how much a buyer spends per order; LTV is the total amount they spend across all repeat orders over time.",
    "formula": "AOV = Total Revenue \u00f7 Total Orders",
    "example": "Adding a 'Buy 2, Save 15%' bundle often lifts AOV from $40 to $62 immediately."
  },
  {
    "term": "SEO (Search Engine Optimization) & Search Intent",
    "category": "Website & SEO",
    "simple": "Improving your website pages so they rank higher for free on Google when people search for your topic or service.",
    "formula": "Fast Mobile Page + Helpful Answer + Trusted Backlinks",
    "example": "Matching 'Search Intent' means giving a price table when someone searches 'dental braces cost', rather than a 2,000-word history of dentistry."
  },
  {
    "term": "Email Open Rate & Apple Mail Privacy Protection (MPP)",
    "category": "Email, CRM & Privacy",
    "simple": "Open Rate shows the % of emails opened\u2014but Apple devices often pre-load emails automatically, which inflates Open Rates.",
    "formula": "Click-Through Rate (CTR) = (Unique Clicks \u00f7 Delivered Emails) \u00d7 100",
    "example": "Worldwide Best Practice: Always judge email success by Click Rate (CTR) and Sales/Replies, not Open Rate alone."
  },
  {
    "term": "GDPR, CCPA & Data Privacy Laws (Worldwide Compliance)",
    "category": "Email, CRM & Privacy",
    "simple": "Laws in the UK/EU (GDPR), US (CCPA/CAN-SPAM), Philippines (DPA), and Australia that require clear user consent before tracking cookies or sending marketing emails.",
    "formula": "Clear Checkbox Consent + Cookie Banner + 1-Click Unsubscribe",
    "example": "Never buy email lists or pre-check consent boxes; always let visitors accept/decline tracking cookies and unsubscribe in 1 click."
  },
  {
    "term": "UTM Parameters (Campaign Tracking Tags)",
    "category": "Analytics & Tracking",
    "simple": "Short tags added to the end of a URL (`?utm_source=...`) so Google Analytics knows exactly which ad, email, or bio link brought the visitor.",
    "formula": "URL + ?utm_source=platform&utm_medium=type&utm_campaign=name",
    "example": "Use the UTM Link Builder in Tab 02 to create clean tracking links in 5 seconds."
  },
  {
    "term": "GA4 (Google Analytics 4) & Conversion Events",
    "category": "Analytics & Tracking",
    "simple": "Google's free website analytics platform that tracks how visitors find your site and which actions ('Events') they complete.",
    "formula": "Traffic Source -> Engagement -> Key Event (Purchase / Lead)",
    "example": "Marking `purchase` or `generate_lead` as a Key Event in GA4 lets you compare SEO, Email, and Paid Ads side by side."
  },
  {
    "term": "A/B Split Testing",
    "category": "Analytics & Tracking",
    "simple": "Testing one specific change (like Headline A vs. Headline B) with real traffic to prove which version gets more conversions.",
    "formula": "1 Variable Changed + Enough Traffic (100+ conversions) = Proven Winner",
    "example": "Testing a video testimonial against a static product photo on the same audience for 7 days."
  },
  {
    "term": "UGC (User-Generated Content) & Social Proof",
    "category": "Email, CRM & Privacy",
    "simple": "Authentic videos, photos, and reviews created by real customers or creators, which build immediate trust with new shoppers.",
    "formula": "Real Customer Experience + Clear Result = Higher Trust",
    "example": "A 25-second customer unboxing video often beats an expensive studio commercial on TikTok and Instagram Reels."
  }
];

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
        Toast.show(`${label}!`);
      } catch (_) {
        Toast.show('Copy complete');
      }
    }
  };

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
     WORKSTATION GENERATORS (UTM Builder, Campaign Brief, Monthly Report, AI Assistant)
     ------------------------------------------------------------------------ */
  const WorkstationTools = {
    init() {
      ['utm-url', 'utm-source', 'utm-medium', 'utm-campaign'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.updateUtm());
      });
      document.getElementById('btn-copy-utm')?.addEventListener('click', () => {
        const url = document.getElementById('utm-output-preview')?.textContent.trim() || '';
        ClipboardUtil.copy(url, 'UTM Tracking Link copied');
      });

      ['brief-name', 'brief-audience', 'brief-channels', 'brief-budget'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.updateBrief());
      });
      document.getElementById('btn-copy-brief')?.addEventListener('click', () => {
        const txt = document.getElementById('brief-output-preview')?.textContent.trim() || '';
        ClipboardUtil.copy(txt, 'Campaign Brief copied');
      });

      ['rep-spend', 'rep-rev', 'rep-leads', 'rep-winner'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.updateReport());
      });
      document.getElementById('btn-copy-report')?.addEventListener('click', () => {
        const txt = document.getElementById('rep-output-preview')?.textContent.trim() || '';
        ClipboardUtil.copy(txt, 'Monthly Report Summary copied');
      });

      ['ai-prompt-type', 'ai-product-input'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.updateAiPrompt());
      });
      document.getElementById('btn-copy-ai-prompt')?.addEventListener('click', () => {
        const txt = document.getElementById('ai-prompt-preview')?.textContent.trim() || '';
        ClipboardUtil.copy(txt, 'AI Prompt copied');
      });

      this.refreshAll();
    },

    refreshAll() {
      this.updateUtm();
      this.updateBrief();
      this.updateReport();
      this.updateAiPrompt();
    },

    cleanSlug(str) {
      return String(str || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    },

    updateUtm() {
      const base = (document.getElementById('utm-url')?.value || 'https://yourbrand.com').trim();
      const src = this.cleanSlug(document.getElementById('utm-source')?.value || 'google');
      const med = this.cleanSlug(document.getElementById('utm-medium')?.value || 'cpc');
      const cmp = this.cleanSlug(document.getElementById('utm-campaign')?.value || 'launch');
      const sep = base.includes('?') ? '&' : '?';
      const finalUrl = `${base}${sep}utm_source=${src}&utm_medium=${med}&utm_campaign=${cmp}`;
      const el = document.getElementById('utm-output-preview');
      if (el) el.textContent = finalUrl;
    },

    updateBrief() {
      const sym = App.currencySymbol;
      const name = document.getElementById('brief-name')?.value || 'Campaign';
      const aud = document.getElementById('brief-audience')?.value || 'Target buyers';
      const ch = document.getElementById('brief-channels')?.value || 'Google & Meta Ads';
      const bud = document.getElementById('brief-budget')?.value || 'Target ROAS';
      const text = `CAMPAIGN BRIEF: ${name}\n• Target Audience: ${aud}\n• Core Channels: ${ch}\n• Budget & KPI Target (${sym}): ${bud}\n• Mandatory Checklist: Mobile page speed <3s, UTM tags verified, and 3 creative hooks tested.`;
      const el = document.getElementById('brief-output-preview');
      if (el) el.textContent = text;
    },

    updateReport() {
      const sym = App.currencySymbol;
      const spend = parseFloat(document.getElementById('rep-spend')?.value) || 0;
      const rev = parseFloat(document.getElementById('rep-rev')?.value) || 0;
      const leads = parseFloat(document.getElementById('rep-leads')?.value) || 1;
      const winner = document.getElementById('rep-winner')?.value || 'Search & Social';
      const roas = spend > 0 ? (rev / spend).toFixed(2) : '0.00';
      const cpa = (spend / leads).toFixed(2);
      const net = (rev - spend).toLocaleString();
      const text = `MONTHLY MARKETING SUMMARY:\n• Total Spend: ${sym}${spend.toLocaleString()} | Total Revenue: ${sym}${rev.toLocaleString()} (${roas}x ROAS)\n• Net Revenue After Ad Spend: ${sym}${net}\n• Total Conversions: ${leads} (${sym}${cpa} Cost Per Acquisition)\n• Top Performing Driver: ${winner}`;
      const el = document.getElementById('rep-output-preview');
      if (el) el.textContent = text;
    },

    updateAiPrompt() {
      const type = document.getElementById('ai-prompt-type')?.value || 'hooks';
      const prod = document.getElementById('ai-product-input')?.value || 'our product';
      const region = document.getElementById('global-region')?.value || 'GLOBAL';
      const templates = {
        hooks: `Act as a Direct-Response Video Strategist (${region} market). Write 10 scroll-stopping 3-second video hooks (for TikTok, Reels, and Shorts) for: "${prod}". Group them into Problem Hooks, Curiosity Hooks, and Social Proof Hooks, and include visual stage directions.`,
        ads: `Act as a Senior Paid Media Copywriter. Write 5 high-converting ad copy variations using the PAS (Problem-Agitate-Solution) framework for: "${prod}". Include headlines (<40 chars), primary text, and a clear Call to Action.`,
        seo: `Act as an SEO Strategist. Create a high-intent keyword cluster and complete H1/H2/H3 article outline for: "${prod}". Include commercial search intent keywords, FAQ schema questions, and internal linking ideas.`,
        email: `Act as a Lifecycle CRM Specialist. Write a 3-email Welcome & Abandoned Cart sequence for: "${prod}". Focus on high click-through rates (CTR), plain-English benefits, and GDPR/CAN-SPAM compliance.`,
        landing: `Act as a Conversion Rate Optimization (CRO) Lead. Write an above-the-fold hero section (Headline, Subheadline, 3 Bullet Benefits, Social Proof, and CTA button) and objection-handling FAQ for: "${prod}".`
      };
      const el = document.getElementById('ai-prompt-preview');
      if (el) el.textContent = templates[type] || templates.hooks;
    }
  };

  /* ------------------------------------------------------------------------
     CUSTOMIZABLE MULTI-CURRENCY MARKETING CALCULATORS
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
        document.getElementById('calc-roas-revenue').value = 20000;
        document.getElementById('calc-roas-margin').value = 50;
        document.getElementById('calc-roas-target').value = 3.0;
        document.getElementById('calc-cpc-spend').value = 2500;
        document.getElementById('calc-cpc-impressions').value = 20000;
        document.getElementById('calc-cpc-clicks').value = 500;
        document.getElementById('calc-cpc-target-ctr').value = 1.5;
        document.getElementById('calc-cvr-visitors').value = 800;
        document.getElementById('calc-cvr-orders').value = 32;
        document.getElementById('calc-cvr-spend').value = 6400;
        document.getElementById('calc-cvr-target').value = 2.5;
        document.getElementById('calc-goal-rev').value = 50000;
        document.getElementById('calc-goal-aov').value = 100;
        document.getElementById('calc-goal-cvr').value = 2.5;
        document.getElementById('calc-goal-cpc').value = 0.80;
        document.getElementById('calc-eng-reach').value = 4500;
        document.getElementById('calc-eng-interactions').value = 270;
        document.getElementById('calc-eng-target').value = 3.5;
        document.getElementById('calc-email-sent').value = 2000;
        document.getElementById('calc-email-opens').value = 680;
        document.getElementById('calc-email-clicks').value = 84;
        this.computeAll();
        Toast.show('Default calculator values restored');
      });
      this.computeAll();
    },
    computeAll() {
      const sym = App.currencySymbol || '$';

      // 1. Margin-Aware ROAS & Break-Even ROAS
      const spend = parseFloat(document.getElementById('calc-roas-spend')?.value) || 0;
      const rev = parseFloat(document.getElementById('calc-roas-revenue')?.value) || 0;
      const marginPct = Math.min(99, Math.max(1, parseFloat(document.getElementById('calc-roas-margin')?.value) || 50));
      const targetRoas = parseFloat(document.getElementById('calc-roas-target')?.value) || 3.0;

      const roas = spend > 0 ? rev / spend : 0;
      const breakEvenRoas = 1 / (marginPct / 100);
      const grossProfitBeforeAds = rev * (marginPct / 100);
      const netProfit = grossProfitBeforeAds - spend;
      const roiPct = spend > 0 ? (netProfit / spend) * 100 : 0;

      document.getElementById('out-roas-mult').textContent = `${this.fmt(roas, 2)}x`;
      document.getElementById('out-roas-breakeven').textContent = `${this.fmt(breakEvenRoas, 2)}x (at ${marginPct}% margin)`;
      document.getElementById('out-roas-profit').textContent = `${netProfit >= 0 ? '+' : '-'}${sym}${this.fmt(Math.abs(netProfit), 0)}`;
      document.getElementById('out-roas-roi').textContent = `${roiPct >= 0 ? '+' : ''}${this.fmt(roiPct, 1)}%`;

      const roasVerdict = document.getElementById('out-roas-verdict');
      if (roasVerdict) {
        if (roas < breakEvenRoas) {
          roasVerdict.textContent = `Below Break-Even (${this.fmt(breakEvenRoas, 2)}x): Currently losing ${sym}${this.fmt(Math.abs(netProfit), 0)} after product costs.`;
          roasVerdict.style.color = 'var(--semantic-danger)';
        } else if (roas >= targetRoas) {
          roasVerdict.textContent = `Profitable & Beats Your ${this.fmt(targetRoas, 1)}x Target! Net profit: +${sym}${this.fmt(netProfit, 0)}.`;
          roasVerdict.style.color = 'var(--semantic-success)';
        } else {
          roasVerdict.textContent = `Profitable (above ${this.fmt(breakEvenRoas, 2)}x break-even), but below your custom ${this.fmt(targetRoas, 1)}x target.`;
          roasVerdict.style.color = 'var(--semantic-warning)';
        }
      }

      // 2. CPC, CTR & CPM
      const cpcSpend = parseFloat(document.getElementById('calc-cpc-spend')?.value) || 0;
      const imps = parseFloat(document.getElementById('calc-cpc-impressions')?.value) || 1;
      const clicks = parseFloat(document.getElementById('calc-cpc-clicks')?.value) || 1;
      const targetCtr = parseFloat(document.getElementById('calc-cpc-target-ctr')?.value) || 1.5;
      const cpc = cpcSpend / clicks;
      const ctr = (clicks / imps) * 100;
      const cpm = (cpcSpend / imps) * 1000;

      document.getElementById('out-cpc-val').textContent = `${sym}${this.fmt(cpc, 2)} per click`;
      document.getElementById('out-ctr-val').textContent = `${this.fmt(ctr, 2)}%`;
      document.getElementById('out-cpm-val').textContent = `${sym}${this.fmt(cpm, 2)}`;
      const ctrVerdict = document.getElementById('out-ctr-verdict');
      if (ctrVerdict) {
        ctrVerdict.textContent = ctr >= targetCtr
          ? `Beats your ${this.fmt(targetCtr, 1)}% CTR benchmark by +${this.fmt(ctr - targetCtr, 2)}%`
          : `Below your ${this.fmt(targetCtr, 1)}% CTR benchmark — test a stronger headline or visual hook`;
      }

      // 3. Conversion Rate & CPA
      const visitors = parseFloat(document.getElementById('calc-cvr-visitors')?.value) || 1;
      const orders = parseFloat(document.getElementById('calc-cvr-orders')?.value) || 0;
      const cvrSpend = parseFloat(document.getElementById('calc-cvr-spend')?.value) || 0;
      const targetCvr = parseFloat(document.getElementById('calc-cvr-target')?.value) || 2.5;
      const cvr = (orders / visitors) * 100;
      const cpa = orders > 0 ? cvrSpend / orders : 0;

      document.getElementById('out-cvr-rate').textContent = `${this.fmt(cvr, 2)}%`;
      document.getElementById('out-cpa-cost').textContent = orders > 0 ? `${sym}${this.fmt(cpa, 2)} each` : '0 conversions';
      const cvrVerdict = document.getElementById('out-cvr-verdict');
      if (cvrVerdict) {
        cvrVerdict.textContent = cvr >= targetCvr
          ? `Above your ${this.fmt(targetCvr, 1)}% conversion target`
          : `Below your ${this.fmt(targetCvr, 1)}% conversion target — check mobile page speed & checkout steps`;
      }

      // 4. Monthly Revenue & Budget Planner
      const goalRev = parseFloat(document.getElementById('calc-goal-rev')?.value) || 0;
      const aov = parseFloat(document.getElementById('calc-goal-aov')?.value) || 1;
      const goalCvr = parseFloat(document.getElementById('calc-goal-cvr')?.value) || 1;
      const estCpc = parseFloat(document.getElementById('calc-goal-cpc')?.value) || 0.5;
      const neededOrders = Math.ceil(goalRev / aov);
      const neededVisitors = Math.ceil(neededOrders / (goalCvr / 100));
      const estBudget = neededVisitors * estCpc;
      const impliedRoas = estBudget > 0 ? goalRev / estBudget : 0;

      document.getElementById('out-goal-orders').textContent = `${neededOrders.toLocaleString()} orders (${this.fmt(neededOrders / 30, 1)} / day)`;
      document.getElementById('out-goal-visitors').textContent = `${neededVisitors.toLocaleString()} visitors`;
      document.getElementById('out-goal-budget').textContent = `${sym}${this.fmt(estBudget, 0)} (${this.fmt(impliedRoas, 2)}x ROAS)`;

      // 5. Social Engagement
      const reach = parseFloat(document.getElementById('calc-eng-reach')?.value) || 1;
      const inter = parseFloat(document.getElementById('calc-eng-interactions')?.value) || 0;
      const engTarget = parseFloat(document.getElementById('calc-eng-target')?.value) || 3.5;
      const engRate = (inter / reach) * 100;
      document.getElementById('out-eng-rate').textContent = `${this.fmt(engRate, 2)}%`;
      const engVerdict = document.getElementById('out-eng-verdict');
      if (engVerdict) {
        engVerdict.textContent = engRate >= engTarget
          ? `Beats your ${this.fmt(engTarget, 1)}% engagement target!`
          : `Below your ${this.fmt(engTarget, 1)}% target — add a question or saveable checklist slide.`;
      }

      // 6. Email Metrics
      const sent = parseFloat(document.getElementById('calc-email-sent')?.value) || 1;
      const opens = parseFloat(document.getElementById('calc-email-opens')?.value) || 0;
      const eClicks = parseFloat(document.getElementById('calc-email-clicks')?.value) || 0;
      const openRate = (opens / sent) * 100;
      const eCtr = (eClicks / sent) * 100;
      const ctor = opens > 0 ? (eClicks / opens) * 100 : 0;

      document.getElementById('out-email-ctr').textContent = `${this.fmt(eCtr, 2)}%`;
      document.getElementById('out-email-open').textContent = `${this.fmt(openRate, 1)}% (MPP inflated)`;
      document.getElementById('out-email-ctor').textContent = `${this.fmt(ctor, 1)}%`;
    }
  };

  /* ------------------------------------------------------------------------
     MAIN APPLICATION CONTROLLER
     ------------------------------------------------------------------------ */
  const App = {
    tasks: [],
    planner: [],
    themes: ['dark', 'light', 'contrast'],
    themeIdx: 0,
    activeTab: 'tasks',
    currencySymbol: '$',
    currencyCode: 'USD',
    region: 'GLOBAL',
    industry: 'ALL',
    deferredInstallPrompt: null,

    init() {
      this.loadState();
      this.initThemeAndTabs();
      MarketingCalculators.init();
      WorkstationTools.init();
      this.bindEvents();
      this.renderAll();
      this.registerServiceWorker();
    },

    loadState() {
      // Self-healing state loader: validates that tasks have the 9-point workstation schema
      try {
        const raw = localStorage.getItem(STATE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            Array.isArray(parsed.tasks) &&
            parsed.tasks.length >= 10 &&
            parsed.tasks[0].what &&
            parsed.tasks[0].category
          ) {
            this.tasks = parsed.tasks;
            this.planner = Array.isArray(parsed.planner) && parsed.planner.length ? parsed.planner : DEFAULT_PLANNER;
          }
        }
      } catch (_) {}

      if (!this.tasks || !this.tasks.length) {
        this.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
        this.planner = JSON.parse(JSON.stringify(DEFAULT_PLANNER));
        this.saveState();
      }

      try {
        const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
        if (prefs.currency) {
          const sel = document.getElementById('global-currency');
          if (sel) sel.value = prefs.currency;
          const [sym, code] = prefs.currency.split('|');
          this.currencySymbol = sym || '$';
          this.currencyCode = code || 'USD';
        }
        if (prefs.region) {
          this.region = prefs.region;
          const rSel = document.getElementById('global-region');
          if (rSel) rSel.value = prefs.region;
        }
        if (prefs.industry) {
          this.industry = prefs.industry;
          const iSel = document.getElementById('global-industry');
          if (iSel) iSel.value = prefs.industry;
        }
      } catch (_) {}
      this.updateCurrencyUI();
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

    savePrefs() {
      try {
        localStorage.setItem(
          PREFS_KEY,
          JSON.stringify({
            currency: `${this.currencySymbol}|${this.currencyCode}`,
            region: this.region,
            industry: this.industry
          })
        );
      } catch (_) {}
    },

    updateCurrencyUI() {
      document.querySelectorAll('.curr-sym').forEach((el) => {
        el.textContent = this.currencySymbol;
      });
      const badge = document.getElementById('calc-currency-badge');
      if (badge) badge.textContent = `${this.currencySymbol} ${this.currencyCode}`;
      const kpiCurr = document.getElementById('metric-active-currency');
      if (kpiCurr) kpiCurr.textContent = `${this.currencySymbol} ${this.currencyCode}`;

      const regionNames = {
        GLOBAL: 'Worldwide (All Channels)',
        US: 'US Market (Google, Meta, HubSpot, CCPA)',
        PH: 'Philippines / SEA (FB, TikTok, Shopee/Lazada)',
        UK: 'UK & EU Market (SEO, LinkedIn, GDPR)',
        AU: 'Australia / APAC Market'
      };
      const tip = document.getElementById('global-focus-tip');
      if (tip) tip.textContent = `${regionNames[this.region] || 'Worldwide'} • ${this.currencySymbol} ${this.currencyCode}`;
      const kpiReg = document.getElementById('metric-active-region');
      if (kpiReg) kpiReg.textContent = regionNames[this.region] || 'Worldwide';
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
      if (meta) meta.setAttribute('content', themeName === 'light' ? '#0284C7' : '#0F172A');
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
      MarketingCalculators.computeAll();
      WorkstationTools.refreshAll();
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
      const navGloss = document.getElementById('nav-badge-glossary');

      if (pctEl) pctEl.textContent = `${pct}% (${done}/${this.tasks.length})`;
      if (fillEl) fillEl.style.width = `${pct}%`;
      if (bmEl) bmEl.textContent = `${starred} Starred`;
      if (navTasks) navTasks.textContent = `${done}/${this.tasks.length}`;
      if (navGloss) navGloss.textContent = `${GLOSSARY_TERMS.length} Terms`;
    },

    renderTasks() {
      const grid = document.getElementById('tasks-grid');
      const empty = document.getElementById('tasks-empty-state');
      const fuzzyBadge = document.getElementById('fuzzy-match-indicator');
      const visCountEl = document.getElementById('metric-visible-count');
      if (!grid) return;

      const query = (document.getElementById('task-search-input')?.value || '').trim();
      const cat = document.getElementById('filter-pillar')?.value || 'ALL';
      const diff = document.getElementById('filter-difficulty')?.value || 'ALL';
      const freq = document.getElementById('filter-cadence')?.value || 'ALL';
      const status = document.getElementById('filter-status')?.value || 'ALL';

      let usedFuzzy = false;
      const matches = [];

      for (const t of this.tasks) {
        if (cat !== 'ALL' && t.category !== cat) continue;
        if (diff !== 'ALL' && t.difficulty !== diff) continue;
        if (freq !== 'ALL' && t.frequency !== freq) continue;
        if (status === 'PENDING' && t.completed) continue;
        if (status === 'COMPLETED' && !t.completed) continue;
        if (status === 'BOOKMARKED' && !t.bookmarked) continue;
        if (this.region !== 'GLOBAL' && Array.isArray(t.regions) && !t.regions.includes(this.region)) continue;
        if (this.industry !== 'ALL' && Array.isArray(t.industries) && !t.industries.includes(this.industry)) continue;

        const hay = `${t.title} ${t.category} ${t.what} ${t.why} ${t.tools} ${t.expected} ${t.example} ${(t.steps || []).join(' ')}`;
        const res = SmartSearch.match(query, hay);
        if (res.matched) {
          if (res.isFuzzy) usedFuzzy = true;
          matches.push({ task: t, score: res.score });
        }
      }

      matches.sort((a, b) => b.score - a.score);
      if (fuzzyBadge) fuzzyBadge.hidden = !usedFuzzy;
      if (visCountEl) visCountEl.textContent = `${matches.length} of ${this.tasks.length} Showing`;

      if (!matches.length) {
        grid.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;

      grid.innerHTML = matches
        .map(({ task }) => {
          const diffClass =
            task.difficulty === 'Beginner'
              ? 'badge--success'
              : task.difficulty === 'Intermediate'
              ? 'badge--accent'
              : 'badge--warning';
          const stepsHtml = (task.steps || [])
            .map((s) => `<li>${this.escapeHtml(s)}</li>`)
            .join('');
          return `
          <article class="task-card ${task.completed ? 'is-completed' : ''}">
            <div>
              <div class="task-card__top">
                <div class="task-card__badges">
                  <span class="badge ${diffClass}">${this.escapeHtml(task.difficulty || 'Beginner')}</span>
                  <span class="badge badge--accent">${this.escapeHtml(task.category)}</span>
                  <span class="badge">${this.escapeHtml(task.frequency)}</span>
                </div>
              </div>
              <h3 class="task-card__title">${this.escapeHtml(task.title)}</h3>
              <p style="margin: 4px 0 8px; font-size: 0.94rem; color: var(--text-secondary);">
                <strong>1. What is it?</strong> ${this.escapeHtml(task.what || '')}
              </p>
              <div class="task-card__meta">
                <span><strong>3. When:</strong> ${this.escapeHtml(task.when || task.frequency)}</span>
                <span><strong>4. Tools:</strong> ${this.escapeHtml(task.tools)}</span>
              </div>

              <!-- 5. Step-by-Step Instructions Always Visible -->
              <div style="margin-top: 8px; font-size: 0.85rem; font-weight: 700; color: var(--accent-primary);">
                5. Step-by-Step Instructions:
              </div>
              <ul class="task-card__sop">${stepsHtml}</ul>

              <!-- Complete 9-Point Workstation Guide Accordion -->
              <details class="workstation-details">
                <summary>Open Full 9-Point Workstation Guide</summary>
                <div class="workstation-body">
                  <div class="ws-point">
                    <strong>2. Why is it important?</strong> ${this.escapeHtml(task.why || '')}
                  </div>
                  <div class="ws-point">
                    <strong>6. Expected Result:</strong> ${this.escapeHtml(task.expected || '')}
                  </div>
                  <div class="ws-point">
                    <strong>7. How to Measure Success:</strong> ${this.escapeHtml(task.measure || '')}
                  </div>
                  <div class="ws-point ws-point--mistake">
                    <strong>8. Common Mistakes to Avoid:</strong> ${this.escapeHtml(task.mistakes || '')}
                  </div>
                  <div class="ws-point ws-point--example">
                    <strong>9. Example of Completed Work:</strong> ${this.escapeHtml(task.example || '')}
                  </div>
                </div>
              </details>
            </div>

            <div class="task-card__footer">
              <button type="button" class="btn btn--sm ${task.completed ? 'btn--secondary' : 'btn--primary'}" data-action="toggle-task" data-id="${this.escapeHtml(task.id)}">
                ${task.completed ? '✓ Completed' : 'Mark Complete'}
              </button>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn--sm btn--secondary" data-action="bookmark-task" data-id="${this.escapeHtml(task.id)}">
                  ${task.bookmarked ? '★ Starred' : '☆ Star'}
                </button>
                <button type="button" class="btn btn--sm btn--ghost" data-action="copy-task" data-id="${this.escapeHtml(task.id)}">
                  Copy Playbook
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
              Copy Schedule
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
              <strong>Formula / Rule:</strong> ${this.escapeHtml(item.formula)}
            </div>
            <div class="glossary-example">
              <strong>How to Interpret &amp; Example:</strong> ${this.escapeHtml(item.example)}
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

    resetAllTaskFilters() {
      const s = document.getElementById('task-search-input');
      const p = document.getElementById('filter-pillar');
      const d = document.getElementById('filter-difficulty');
      const c = document.getElementById('filter-cadence');
      const st = document.getElementById('filter-status');
      const reg = document.getElementById('global-region');
      const ind = document.getElementById('global-industry');

      if (s) s.value = '';
      if (p) p.value = 'ALL';
      if (d) d.value = 'ALL';
      if (c) c.value = 'ALL';
      if (st) st.value = 'ALL';
      if (reg) reg.value = 'GLOBAL';
      if (ind) ind.value = 'ALL';
      this.region = 'GLOBAL';
      this.industry = 'ALL';
      this.savePrefs();
      this.updateCurrencyUI();
      this.renderTasks();
      Toast.show('Showing all 17 Specialist Playbooks');
    },

    exportBackupJson() {
      const payload = {
        guide: 'Digital Marketing Specialist Workstation v4.0',
        exportedAt: new Date().toISOString(),
        currency: this.currencyCode,
        tasks: this.tasks,
        planner: this.planner
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marketing-workstation-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Toast.show('Workstation backup downloaded!');
    },

    importBackupJson(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data.tasks) && data.tasks.length) this.tasks = data.tasks;
          if (Array.isArray(data.planner) && data.planner.length) this.planner = data.planner;
          this.saveState();
          this.renderAll();
          Toast.show('Workstation backup restored!');
        } catch (_) {
          Toast.show('Please select a valid .json backup file');
        }
      };
      reader.readAsText(file);
    },

    bindEvents() {
      document.querySelectorAll('.nav-tab').forEach((btn) => {
        btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
      });

      // Global Currency, Region & Industry Selectors
      document.getElementById('global-currency')?.addEventListener('change', (e) => {
        const [sym, code] = e.target.value.split('|');
        this.currencySymbol = sym || '$';
        this.currencyCode = code || 'USD';
        this.savePrefs();
        this.updateCurrencyUI();
        MarketingCalculators.computeAll();
        WorkstationTools.refreshAll();
        Toast.show(`Currency updated to ${this.currencySymbol} ${this.currencyCode}`);
      });

      document.getElementById('global-region')?.addEventListener('change', (e) => {
        this.region = e.target.value;
        this.savePrefs();
        this.updateCurrencyUI();
        this.renderTasks();
        WorkstationTools.updateAiPrompt();
      });

      document.getElementById('global-industry')?.addEventListener('change', (e) => {
        this.industry = e.target.value;
        this.savePrefs();
        this.renderTasks();
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
        ClipboardUtil.copy(url, 'Workstation link copied');
      });

      ['task-search-input', 'filter-pillar', 'filter-difficulty', 'filter-cadence', 'filter-status'].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => this.renderTasks());
      });

      document.getElementById('btn-reset-filters')?.addEventListener('click', () => this.resetAllTaskFilters());
      document.getElementById('btn-reset-filters-top')?.addEventListener('click', () => this.resetAllTaskFilters());

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
          this.saveState();
          this.renderSummary();
          this.renderTasks();
          Toast.show(task.completed ? 'Task completed!' : 'Task marked to-do');
        } else if (btn.dataset.action === 'bookmark-task') {
          task.bookmarked = !task.bookmarked;
          this.saveState();
          this.renderSummary();
          this.renderTasks();
        } else if (btn.dataset.action === 'copy-task') {
          const text = [
            `TASK: ${task.title} (${task.category} | ${task.difficulty})`,
            `1. What: ${task.what}`,
            `2. Why: ${task.why}`,
            `3. When: ${task.when}`,
            `4. Tools: ${task.tools}`,
            `5. Steps:\n- ${(task.steps || []).join('\n- ')}`,
            `6. Expected Result: ${task.expected}`,
            `7. Measure Success: ${task.measure}`,
            `8. Common Mistakes: ${task.mistakes}`,
            `9. Example: ${task.example}`
          ].join('\n');
          ClipboardUtil.copy(text, 'Full 9-Point Playbook copied');
        }
      });

      // Planner Actions
      document.getElementById('itinerary-list')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const item = this.planner.find((p) => p.id === btn.dataset.id);
        if (!item) return;

        if (btn.dataset.action === 'bookmark-plan') {
          item.bookmarked = !item.bookmarked;
          this.saveState();
          this.renderSummary();
          this.renderPlanner();
        } else if (btn.dataset.action === 'copy-plan') {
          ClipboardUtil.copy(`${item.day}: ${item.title} (${item.channel}) — ${item.notes}`, 'Schedule item copied');
        }
      });

      // Glossary Copy
      document.getElementById('glossary-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="copy-term"]');
        if (!btn) return;
        const item = GLOSSARY_TERMS.find((g) => g.term === btn.dataset.term);
        if (!item) return;
        ClipboardUtil.copy(`${item.term}: ${item.simple}\nFormula: ${item.formula}\nNote: ${item.example}`, `Copied "${item.term}"`);
      });

      ['btn-print-tasks', 'btn-print-itinerary', 'btn-print-glossary'].forEach((id) => {
        document.getElementById(id)?.addEventListener('click', () => window.print());
      });

      document.getElementById('btn-export-json')?.addEventListener('click', () => this.exportBackupJson());
      document.getElementById('input-import-json')?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) this.importBackupJson(file);
      });

      // Custom Task Modal
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
        const difficulty = document.getElementById('custom-difficulty').value;
        const frequency = document.getElementById('custom-cadence').value;
        const tools = document.getElementById('custom-tools').value.trim() || 'Analytics & Ad Manager';
        const measure = document.getElementById('custom-kpi').value.trim() || 'Conversion rate & positive ROI';
        const stepsRaw = document.getElementById('custom-steps').value.trim();
        const steps = stepsRaw
          ? stepsRaw.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Define target audience & offer', 'Launch with UTM tracking', 'Review conversions & optimize'];

        this.tasks.unshift({
          id: 'ws-custom-' + Date.now(),
          title,
          category,
          frequency,
          difficulty,
          regions: ['GLOBAL', 'US', 'PH', 'UK', 'EU', 'AU'],
          industries: ['ALL', 'Ecommerce', 'B2B', 'SaaS', 'LocalService'],
          what: `Custom specialist task under ${category}.`,
          why: 'Ensures consistent execution and measurable campaign growth.',
          when: `${frequency} schedule`,
          tools,
          steps,
          expected: `Completed ${title} workflow.`,
          measure,
          mistakes: 'Skipping UTM tracking or failing to review mobile conversion speed.',
          example: `Executed ${title} and measured results via ${tools}.`,
          completed: false,
          bookmarked: true
        });
        this.planner.unshift({
          id: 'plan-custom-' + Date.now(),
          day: `${frequency} Custom Action`,
          title,
          channel: category,
          format: `${difficulty} Playbook`,
          notes: `Tools: ${tools} | Goal: ${measure}`,
          bookmarked: true
        });
        this.saveState();
        this.renderAll();
        e.target.reset();
        if (customModal) customModal.hidden = true;
        Toast.show('Custom 9-Point Task added!');
      });

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
