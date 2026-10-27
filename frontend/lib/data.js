/**
 * DEZORYN TECHNOLOGY — central content + pricing data.
 *
 * IMPORTANT (SRS §64): everything marked `placeholder: true` or listed in
 * PLACEHOLDER_NOTES is development content. Replace with real DEZORYN data
 * (later through a CMS). Prices are never hard-coded in components —
 * always call formatPrice()/getPlanPrice().
 */

/* ───────────── Currency architecture (SRS §4, §17) ───────────── */
export const DEFAULT_CURRENCY = "USD";
export const CURRENCIES = {
  USD: { symbol: "$", rate: 1, locale: "en-US" },
  // Future: EUR: { symbol: "€", rate: 0.92, locale: "de-DE" }, GBP, AED ...
};
export const ANNUAL_DISCOUNT = 0.2; // "Save 20%"

export function formatPrice(amountUsd, currency = DEFAULT_CURRENCY) {
  const c = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
  const value = Math.round(amountUsd * c.rate);
  return `${c.symbol}${value.toLocaleString(c.locale)}`;
}
/** monthly USD price of a plan for a billing cycle */
export function getPlanPrice(plan, cycle = "monthly") {
  if (!plan) return null;
  const rawMonthly = plan.monthlyPriceUsd ?? plan.monthly_price_usd ?? plan.price;
  if (rawMonthly == null || rawMonthly === "" || Number.isNaN(Number(rawMonthly))) {
    return null;
  }
  const monthly = Number(rawMonthly);
  if (monthly <= 0) return null;

  const rawAnnual = plan.annualPriceUsd ?? plan.annual_price_usd ?? plan.annual;
  const annual = (rawAnnual != null && rawAnnual !== "" && !Number.isNaN(Number(rawAnnual)))
    ? Number(rawAnnual)
    : Math.round(monthly * (1 - ANNUAL_DISCOUNT));

  return cycle === "annual" ? annual : monthly;
}

/* Default plan ladder. Products can override. */
const mk = (starter, growth, business, enterprise = 299) => [
  { id: "starter", name: "Starter", for: "For small businesses", monthly_price_usd: starter,
    features: ["Up to 100 users", "Core modules", "Email support", "Regular updates"] },
  { id: "growth", name: "Growth", for: "For growing businesses", monthly_price_usd: growth,
    features: ["Up to 500 users", "Advanced features", "Priority support", "API access"] },
  { id: "business", name: "Business", for: "For established organizations", monthly_price_usd: business, highlighted: true,
    features: ["Up to 2,000 users", "All features", "Custom integrations", "Dedicated support"] },
  { id: "enterprise", name: "Enterprise", for: "For large organizations", monthly_price_usd: enterprise,
    features: ["Unlimited / custom users", "Custom deployment", "SLA & account manager", "Enterprise analytics"] },
].map((p) => ({
  ...p,
  annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null,
}));

/* ───────────── Categories / filters ───────────── */
export const CATEGORIES = ["Business Management", "Education", "Healthcare", "Real Estate", "Security", "HR", "CRM", "Finance", "AI", "Automation", "Communication", "Operations"];
export const BUSINESS_SIZES = ["Small", "Medium", "Large"];
export const DEPLOYMENTS = ["Cloud", "Hybrid", "On-premise"];

/* ───────────── Products ───────────── */
export const products = [
  {
    slug: "schooly-core",
    name: "Schooly Core",
    tagline: "Smart School & Educational ERP Platform for Modern Campuses.",
    description: "Complete school operations: admissions, student records, fee collection, attendance, examinations, and real-time parent app.",
    category: "Education",
    image: "/products/schooly-core.jpg",
    industries: ["education"],
    size: "Medium",
    deployment: "Cloud",
    ai: true,
    hue: 160,
    tags: ["Student ERP", "Fees & Billing", "Attendance", "Parent App"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For standalone elementary & high schools",
    "monthly_price_usd": 39,
    "features": [
      "Up to 250 Students & 25 Staff",
      "Admissions & Student Demographic Ledger",
      "Digital Fee Receipts & SMS Due Alerts",
      "Daily Attendance Registers & RFID Sync",
      "Standard Email Support"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For established K-12 private institutions",
    "monthly_price_usd": 99,
    "features": [
      "Up to 1,000 Students & 75 Staff",
      "Automated Timetable & Teacher Workload Engine",
      "CBSE/ICSE/State Board Report Cards",
      "Parent Mobile App & Direct Teacher Chat",
      "Priority Live Chat & Onboarding Call"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For multi-branch campus networks",
    "monthly_price_usd": 189,
    "highlighted": true,
    "features": [
      "Up to 3,000 Students across Campuses",
      "School Bus Live GPS Telemetry & Parent Alerts",
      "Library, Hostel & Canteen Inventory Integration",
      "Online Fee Gateway with Zero Discrepancy Reconciliation",
      "Dedicated Education Success Manager"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For nationwide educational societies & trust groups",
    "monthly_price_usd": 399,
    "features": [
      "Unlimited Students & Multi-Campus Trust Sync",
      "Custom White-Labeled Native iOS & Android Apps",
      "Bi-directional ERP Sync with Tally / SAP Accounting",
      "Dedicated On-Campus Engineer & 24/7 Hotline",
      "Custom Data Sovereignty & Private Cloud VPC"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "How does Schooly Core handle multi-branch school campuses?",
    "Schooly Core provides a centralized Trust Executive Cockpit where group directors can review fee collections, teacher attendance, and academic grades across all branches in real time, while granting each campus head autonomy over daily timetables and admissions."
  ],
  [
    "Is the Parent Mobile App available on both iOS and Android?",
    "Yes. The parent mobile application is natively compiled for both Apple iOS and Android devices, featuring instantaneous push notifications for attendance check-in/out, digital homework submissions, bus GPS tracking, and report cards."
  ],
  [
    "Can we customize report card formats for CBSE, ICSE, or State boards?",
    "Absolutely. Schooly Core includes a dynamic rubric and grade book moderation engine that generates customizable PDF report cards matching exact board-mandated grading scales (e.g. CBSE 8-point grading, ICSE marks grids, or international letter scales)."
  ],
  [
    "How are school fees reconciled with our bank account?",
    "Parents can pay school fees via UPI, credit/debit cards, and NetBanking through integrated payment gateways. Transactions automatically match student ledger roll numbers with instantaneous digital receipts, completely eliminating manual bank statement reconciliations."
  ],
  [
    "Can Schooly Core integrate with biometric attendance devices and RFID turnstiles?",
    "Yes. We support TCP/IP and cloud webhook integrations with standard biometric fingerprint, facial recognition, and RFID smart card turnstiles installed at school entry gates and buses."
  ]
],
    steps: [
  [
    "Campus Discovery",
    "We audit your grade structures, fee schedules, and academic session calendars."
  ],
  [
    "Student Master Sync",
    "Import student, parent, and faculty records with zero historical data loss."
  ],
  [
    "Teacher & Admin Training",
    "Hands-on virtual and on-campus onboarding sessions for staff and bus drivers."
  ],
  [
    "Go-Live & Parent Launch",
    "Dispatched branded login credentials and automated parent app welcome sequence."
  ]
],
    security: [
  [
    "Lock",
    "Student PII Encryption",
    "AES-256 zero-knowledge encryption guarding student demographic and medical records."
  ],
  [
    "KeyRound",
    "Role-Based Staff Access",
    "Strict privilege tiers separating teachers, accountants, principals, and bus coordinators."
  ],
  [
    "FileClock",
    "Fee Audit Trails",
    "Immutable financial logs with cryptographic receipts for every cash or online rupee collected."
  ],
  [
    "ShieldCheck",
    "Campus Cloud Redundancy",
    "99.99% academic cloud availability with automated daily offsite snapshots."
  ]
],
    trustMetrics: [
  {
    "title": "K-12 Board Aligned",
    "desc": "CBSE, ICSE & International scales"
  },
  {
    "title": "< 48h Setup",
    "desc": "Rapid campus enrollment migration"
  },
  {
    "title": "Zero Data Leak",
    "desc": "Strict minor privacy governance"
  }
],
    telemetryBadges: [
  {
    "title": "Student Roster Sync",
    "desc": "Real-time RFID & Biometric Gate"
  },
  {
    "title": "Academic Uptime",
    "desc": "99.99% Cloud SLA Campus Edge"
  }
],
    benefits: [
      "Automates end-to-end campus administration",
      "Real-time student attendance and report cards",
      "Automated fee collection with instant digital receipts",
      "Seamless communication between teachers, students and parents",
    ],
    features: [
      ["Digital Admissions", "Online application workflows, document review, and instant student enrollment."],
      ["Attendance & Timetables", "Automated timetable scheduler with RFID and biometric attendance integration."],
      ["Fee Management & Billing", "Flexible fee structures, automatic WhatsApp/SMS reminders, and digital payments."],
      ["Exams, Grades & Reports", "Grade book moderation, automated report card generation, and student rankings."],
      ["Parent & Teacher Portal", "Real-time homework tracking, bus GPS location, and direct messaging."],
      ["AI Performance Insights", "Predictive student performance analytics and early attendance risk detection."],
    ],
    modules: ["Campus Cockpit", "Student Lifecycle", "Faculty & Staff", "Fee Ledgers", "Exam Rubrics", "Smart Timetables", "Parent Portal", "Campus Administration"],
    integrations: ["Stripe", "Google Workspace", "Zoom", "Slack"],
  },
  {
    slug: "dezo-care",
    name: "Dezo Care",
    tagline: "Next-Generation Hospital & Clinic Management ERP.",
    description: "End-to-end digital healthcare workflows: electronic health records (EHR), OPD/IPD beds, doctor rosters, OT scheduling, pharmacy, and billing.",
    category: "Healthcare",
    image: "/products/dezo-care.jpg",
    industries: ["healthcare"],
    size: "Large",
    deployment: "Cloud",
    ai: true,
    hue: 350,
    tags: ["Hospital ERP", "EHR / EMR", "OPD / IPD", "Pharmacy & Labs"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For specialized clinics & day-care centers",
    "monthly_price_usd": 59,
    "features": [
      "Up to 25 Beds & 5 On-Duty Doctors",
      "OPD Token Queue & Patient Registration",
      "Standard Electronic Health Records (EHR)",
      "Pharmacy POS & Retail Prescription Dispensing",
      "Email & Chat Helpdesk"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For mid-size specialty hospitals & nursing homes",
    "monthly_price_usd": 149,
    "features": [
      "Up to 100 Beds & 25 On-Duty Doctors",
      "IPD Ward Matrix & Intensive Care Unit (ICU) Telemetry",
      "Laboratory Information System (LIS) Analyzer Sync",
      "Doctor Roster Shift Scheduler & Tele-Consultations",
      "Priority 24/7 Clinical Emergency Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For multi-specialty tertiary care hospitals",
    "monthly_price_usd": 299,
    "highlighted": true,
    "features": [
      "Up to 350 Beds & 75 On-Duty Doctors",
      "Operation Theater (OT) Surgical Suite Scheduling",
      "Cashless TPA & Medical Insurance Desk Management",
      "Hospital Pharmacy Batch Expiry & Central Inventory",
      "Dedicated Hospital Systems Specialist"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For multi-city healthcare chains & medical colleges",
    "monthly_price_usd": 599,
    "features": [
      "Unlimited Beds & Multi-Hospital Network Synchronization",
      "HL7/FHIR & ABDM Health Cloud Standards Integration",
      "PACS Radiology & DICOM Imaging Server Integration",
      "Dedicated On-Premise / Private HIPAA Cloud Cluster",
      "Guaranteed 15-Minute Critical Incident SLA"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "Does Dezo Care comply with ABDM (Ayushman Bharat Digital Mission) and HL7/FHIR standards?",
    "Yes. Dezo Care is engineered from the ground up to support ABDM M1, M2, and M3 milestones, enabling seamless ABHA ID creation, health record linking, and standardized HL7/FHIR interoperability across diagnostic facilities and government health exchanges."
  ],
  [
    "How does Dezo Care manage IPD ward admissions and bed occupancy?",
    "The interactive IPD ward matrix provides real-time color-coded visual bed telemetry across general wards, deluxe suites, and ICUs. Nurses can instantly update bed occupancy, track patient vitals, schedule doctor rounds, and coordinate room sanitization workflows."
  ],
  [
    "Can our diagnostic laboratory machines integrate directly with Dezo Care?",
    "Yes. Our LIS (Laboratory Information System) module provides bidirectional interfacing with standard clinical chemistry, hematology, and immunology analyzers. Test results post automatically to patient EHRs, eliminating manual data transcription errors."
  ],
  [
    "How are cashless TPA and health insurance claims processed?",
    "Dezo Care includes a dedicated TPA portal where hospital billing desks can upload pre-authorization requests, manage query rebuttals, track approval limits, and generate final itemized discharge summaries with zero billing discrepancies."
  ],
  [
    "Is patient medical data secure and HIPAA-compliant?",
    "All clinical notes, diagnostic imaging, and pharmacy logs are encrypted at rest with AES-256 and transmitted exclusively over TLS 1.3. Role-based access controls ensure doctors only view records of patients under their active consultation care."
  ]
],
    steps: [
  [
    "Clinical Workflow Audit",
    "Mapping your OPD departments, bed wards, operation theaters, and diagnostic labs."
  ],
  [
    "EHR & Pharmacy Migration",
    "Importing drug formulary, doctor schedules, and legacy patient records."
  ],
  [
    "Nursing & Staff Training",
    "Hands-on simulations for triage desks, nurses, lab technicians, and pharmacists."
  ],
  [
    "Clinical Cutover",
    "Zero-downtime go-live with on-site clinical support engineers."
  ]
],
    security: [
  [
    "Lock",
    "HIPAA & ABDM Compliant",
    "End-to-end cryptographic sealing of patient electronic medical charts."
  ],
  [
    "KeyRound",
    "Medical Role Segregation",
    "Strict barriers between doctors, nursing staff, pharmacists, and billing clerks."
  ],
  [
    "FileClock",
    "Clinical Prescription Audit",
    "Full timestamped records of doctor prescription edits and pharmacy dispensations."
  ],
  [
    "ShieldCheck",
    "24/7 Redundant Care SLA",
    "Multi-zone cloud failover ensuring hospital terminals never freeze during emergencies."
  ]
],
    trustMetrics: [
  {
    "title": "NABH / ABDM Ready",
    "desc": "Digital clinical compliance"
  },
  {
    "title": "Sub-Second OPD",
    "desc": "Instant patient queue token"
  },
  {
    "title": "Zero Paperwork",
    "desc": "Unified EHR & digital discharge"
  }
],
    telemetryBadges: [
  {
    "title": "Clinical Ward Telemetry",
    "desc": "Live ICU & Inpatient Bed Matrix"
  },
  {
    "title": "Health Cloud Security",
    "desc": "NABH & ABDM Tier-4 Data Vault"
  }
],
    benefits: [
      "Smooth patient journey from registration to discharge",
      "Zero-paperwork electronic medical records (EMR/EHR)",
      "Integrated OPD, IPD, ICU, and surgical suite scheduling",
      "Unified pharmacy billing, lab tests, and cashless insurance claims",
    ],
    features: [
      ["OPD & IPD Operations", "Real-time token queue, ward management, bed tracking, and nurse vitals entry."],
      ["Electronic Health Records", "Secure, searchable clinical histories, lab reports, and e-prescriptions."],
      ["Doctor Scheduling & Roster", "Smart shift planning, specialist consultations, and telemedicine video calls."],
      ["Pharmacy & Stock Control", "Batch tracking, expiry warnings, automated drug reordering, and POS checkout."],
      ["Diagnostic Lab Integration", "Bi-directional analyzer sync, instant specimen barcodes, and patient alerts."],
      ["TPA Insurance & Billing", "Instant cashless claim documentation, automated deductions, and final billing."],
    ],
    modules: ["Hospital Command Center", "OPD & Inpatient Care", "Patients & Clinical EHR", "Doctor & Specialist Rosters", "Pharmacy & Formularies", "Diagnostic Labs & Pathology", "Insurance Billing & TPA", "Hospital Operations"],
    integrations: ["Stripe", "Google Workspace", "Slack", "Zoom"],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    tagline: "Comprehensive Real Estate Sales & Property Development Platform.",
    description: "Streamline developer operations: unit inventory matrix, site visit scheduling, channel partner portals, client bookings, and milestone billing.",
    category: "Real Estate",
    image: "/products/real-estate.jpg",
    industries: ["real-estate"],
    size: "Medium",
    deployment: "Cloud",
    ai: true,
    hue: 210,
    tags: ["Property Matrix", "Site Visits", "Channel Partners", "Booking Flow"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For boutique developers & regional builders",
    "monthly_price_usd": 49,
    "features": [
      "Up to 2 Projects & 150 Unit Inventory",
      "Real-Time Interactive Unit Availability Matrix",
      "Site Visit Scheduling & Chauffeur Coordination",
      "Standard Token Booking Receipts & Invoices",
      "Standard Support Desk"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For mid-size residential & commercial developers",
    "monthly_price_usd": 119,
    "features": [
      "Up to 8 Projects & 750 Unit Inventory",
      "Channel Partner (CP) Broker Portal & Lead Tagging",
      "Digital Buyer KYC & E-Sign Allotment Letters",
      "Automated WhatsApp Buyer Follow-up Cadences",
      "Priority Sales Support & Training"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For established township & multi-tower builders",
    "monthly_price_usd": 239,
    "highlighted": true,
    "features": [
      "Up to 25 Projects & 3,000 Unit Inventory",
      "Construction-Linked Milestone Demand Notes Engine",
      "Channel Partner Commission Reconciliation & Payouts",
      "Multi-Tier Pricing Schedules & Inventory Blocking Locks",
      "Dedicated Real Estate Tech Specialist"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For national real estate conglomerates & REITs",
    "monthly_price_usd": 499,
    "features": [
      "Unlimited Projects & Developer Entity Management",
      "RERA Escrow Account & Bank Subvention Tracking",
      "Custom ERP Integration with SAP / Salesforce",
      "Dedicated Solutions Architect & Private Cloud VPC",
      "Custom 3D Virtual Tour & Interactive Masterplan Embeds"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "How does the interactive unit inventory matrix prevent double-booking?",
    "When a sales executive or broker selects an apartment, villa, or commercial plot for a client token payment, the system applies a temporary inventory lock across all channels. If payment succeeds, the unit status shifts to 'Booked' in real time across all connected devices."
  ],
  [
    "Can Channel Partners (Brokers) view their registered leads and commissions?",
    "Yes. Channel partners receive dedicated portal logins where they can register prospective buyers, track site visit attendance, view allotment statuses, and monitor accrued brokerage commissions with full ledger transparency."
  ],
  [
    "How are construction milestone demand notes generated?",
    "When a project engineer marks a construction slab or finishing stage completed in the construction tracker, DEZORYN Real Estate automatically drafts and dispatches personalized demand letters with payment deadlines and interest calculation to all relevant buyers via WhatsApp and Email."
  ],
  [
    "Is the platform compliant with RERA regulations?",
    "Yes. The platform includes built-in RERA compliance safeguards, ensuring project registration numbers, approved sanctions, carpet area disclosures, and designated escrow bank account details are consistently printed on all booking receipts and allotment letters."
  ],
  [
    "Does DEZORYN Real Estate integrate with popular property portals like 99acres and MagicBricks?",
    "Yes. Inbound leads from 99acres, MagicBricks, Facebook Ads, and Google Campaigns are ingested in sub-seconds via webhooks, automatically tagged to projects, and routed to available site sales executives."
  ]
],
    steps: [
  [
    "Inventory Blueprinting",
    "Uploading floor plans, unit specifications, price sheets, and payment plans."
  ],
  [
    "Channel Partner Onboarding",
    "Registering external brokers, tagging active leads, and establishing brokerage tiers."
  ],
  [
    "Sales Team Walkthrough",
    "Training on-site executives on unit locking, site visit apps, and digital KYC."
  ],
  [
    "Public Launch & Matrix Activation",
    "Unlocking live unit availability matrix across sales galleries and portals."
  ]
],
    security: [
  [
    "Lock",
    "RERA Document Security",
    "Watermarked, tamper-proof digital allotment letters and KYC document storage."
  ],
  [
    "KeyRound",
    "Granular Inventory Permissions",
    "Controlled access permitting only authorized sales directors to unlock reserved units."
  ],
  [
    "FileClock",
    "Buyer Ledger Audit",
    "Cryptographically audited trail of token payments, receipts, and interest waivers."
  ],
  [
    "ShieldCheck",
    "High-Availability Matrix",
    "Sub-second database sync guaranteeing zero double-allocations during project launches."
  ]
],
    trustMetrics: [
  {
    "title": "RERA Compliant",
    "desc": "Automated escrow & demand notes"
  },
  {
    "title": "Zero Double-Booking",
    "desc": "Instant unit inventory locks"
  },
  {
    "title": "Direct CP Portal",
    "desc": "Transparent brokerage payouts"
  }
],
    telemetryBadges: [
  {
    "title": "Unit Inventory Engine",
    "desc": "Sub-Second Live Unit Locking"
  },
  {
    "title": "Sales Cloud Velocity",
    "desc": "RERA Escrow & Milestone Pipeline"
  }
],
    benefits: [
      "Live unit availability and pricing matrix across all sales channels",
      "Effortless scheduling and tracking for client site visits",
      "Empowered channel partners with automated brokerage payouts",
      "Automated construction milestone demand letters and receipts",
    ],
    features: [
      ["Interactive Unit Matrix", "Real-time apartment/plot availability with 3D floor plans and pricing calculators."],
      ["Site Visit Management", "Chauffeur booking, executive assignment, and digital buyer feedback."],
      ["Channel Partner Portal", "Dedicated broker logins, lead tagging, and commission payout tracking."],
      ["Booking & Allotment Workflow", "Digital KYC, instant booking receipt, demand notes, and legal documentation."],
      ["Milestone Payment Tracking", "Construction-linked billing with auto-calculated interest and overdue alerts."],
      ["AI Buyer Conversion Engine", "Lead propensity scoring and automated WhatsApp/email engagement cadences."],
    ],
    modules: ["Sales Command Center", "Unit & Tower Inventory", "Site Visits & Walk-ins", "Customer Bookings & Allotments", "Channel Partners & CP Network", "Construction Milestones & Demand", "Revenue Intelligence", "Builder Governance"],
    integrations: ["Stripe", "Slack", "Gmail", "Google Calendar"],
  },
  {
    slug: "society-management",
    name: "SocietyOS",
    tagline: "Complete Society Management Platform.",
    description: "Complete Society Management Platform: smart gate security, visitor passes, maintenance billing, complaints helpdesk, and resident community app.",
    category: "Real Estate",
    image: "/products/society-management.jpg",
    industries: ["residential-communities"],
    size: "Medium",
    deployment: "Cloud",
    ai: false,
    hue: 215,
    tags: ["Gate Security", "Maintenance Dues", "Resident App", "Helpdesk"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For standalone apartment buildings & housing societies",
    "monthly_price_usd": 29,
    "features": [
      "Up to 100 Flats / Units & 1 Security Gate",
      "Security Guard Tablet Kiosk & Visitor Pass Generation",
      "Maintenance Dues Invoicing & Automated UPI QR Receipts",
      "Digital Resident Notice Board & Emergency Contacts",
      "Standard Helpdesk Support"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For gated residential societies & high-rise complexes",
    "monthly_price_usd": 79,
    "features": [
      "Up to 500 Flats / Units & 3 Security Gates",
      "Daily Staff & Domestic Maid Biometric Attendance",
      "Resident Complaint Helpdesk with SLA Escalation Tracking",
      "Clubhouse & Community Amenity Slot Reservation",
      "Priority Customer Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For expansive residential townships & multi-tower clusters",
    "monthly_price_usd": 149,
    "highlighted": true,
    "features": [
      "Up to 2,000 Flats / Units & Unlimited Gates",
      "Automated Late-Payment Interest & Dynamic Penalties",
      "Vendor Work Order Dispatch & Asset Maintenance (AMC)",
      "Digital Resident Voting & AGM Poll Resolution Engine",
      "Dedicated Society Operations Manager"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For mega townships, smart cities & property management groups",
    "monthly_price_usd": 349,
    "features": [
      "Unlimited Flats, Multi-Society Centralized Portfolio",
      "ANPR (Automated Number Plate Recognition) Boom Barrier Sync",
      "Multi-Tower Water & Energy Sub-Meter IoT Integration",
      "Custom Branded Resident Community Mobile App",
      "24/7 Dedicated Emergency Operations Hotline"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "How does the Smart Gate Kiosk protect resident privacy?",
    "When visitors arrive at the main gate, security guards enter only the visitor's mobile number and flat number. Resident phone numbers are never displayed on the guard terminal; approval is requested directly via an in-app interactive push notification or automated IVR call."
  ],
  [
    "How are society maintenance dues collected and reconciled?",
    "The billing engine generates monthly or quarterly maintenance dues based on flat square footage or fixed rates. Residents pay directly via integrated UPI, debit/credit cards, or NetBanking inside the resident mobile app, with instantaneous automated receipt generation."
  ],
  [
    "Can residents track domestic help and daily staff entry/exit?",
    "Yes. Maids, drivers, and daily contractors receive digital ID badges. The moment they check in at the security gate, the resident app receives an instantaneous alert showing their check-in timestamp and past attendance records."
  ],
  [
    "How are community facilities (Clubhouse, Tennis Court, Swimming Pool) booked?",
    "Residents can check live amenity availability on the mobile app, review booking rules, pay security deposits, and reserve slots with instantaneous confirmation, preventing double-bookings and disputes."
  ],
  [
    "Does SocietyOS support automated boom barriers with RFID or ANPR camera systems?",
    "Yes. SocietyOS integrates with standard Wiegand RFID windshield tags and AI-powered ANPR (Automatic Number Plate Recognition) cameras to automatically raise boom barriers for authorized resident vehicles without stopping."
  ]
],
    steps: [
  [
    "Society Layout Modeling",
    "Configuring towers, wings, flat numbers, parking bays, and security gate check-points."
  ],
  [
    "Resident & Vehicle Directory",
    "Importing owner and tenant directories, authorized vehicles, and daily staff."
  ],
  [
    "Gate Guard Training",
    "Equipping security guards with intuitive multi-lingual tablet check-in software."
  ],
  [
    "Resident App Rollout",
    "Dispatched digital invitation links with immediate maintenance dues payment activation."
  ]
],
    security: [
  [
    "Lock",
    "Resident PII Protection",
    "Resident phone numbers and private directory data masked from frontline guards."
  ],
  [
    "KeyRound",
    "Committee Role Hierarchies",
    "Distinct privilege tiers separating RWA treasurers, presidents, guards, and residents."
  ],
  [
    "FileClock",
    "Complete Visitor Logs",
    "Encrypted photo and entry/exit timestamp archives for all visitors, cabs, and delivery agents."
  ],
  [
    "ShieldCheck",
    "Banking-Grade Accounting",
    "Statutory audited society accounting ledgers with zero discrepancy reconciliation."
  ]
],
    trustMetrics: [
  {
    "title": "RWA Certified",
    "desc": "Transparent digital accounting"
  },
  {
    "title": "Instant Gate Passes",
    "desc": "One-tap guest approvals"
  },
  {
    "title": "Privacy First",
    "desc": "Masked resident phone numbers"
  }
],
    telemetryBadges: [
  {
    "title": "Gate Security Kiosk",
    "desc": "Sub-5s Visitor Check-In Flow"
  },
  {
    "title": "Resident Ledger Sync",
    "desc": "Automated UPI & Maintenance Dues"
  }
],
    benefits: [
      "100% transparent society accounting and digital ledgers",
      "Fast gate pass approvals for guests, cabs, and delivery agents",
      "Fast resolution of resident maintenance tickets with SLA tracking",
      "Connected community notice board, polls, and clubhouse bookings",
    ],
    features: [
      ["Gate & Visitor Security", "Pre-approved guest entry, delivery vendor QR passes, and boom barrier sync."],
      ["Maintenance Billing & Dues", "Automated unit-wise invoicing, UPI payments, and automatic receipts."],
      ["Complaints & Helpdesk", "Category-wise ticket routing, staff assignments, and resident satisfaction ratings."],
      ["Clubhouse & Amenity Booking", "Slot-based reservations for tennis courts, swimming pools, and party halls."],
      ["Society Accounting Ledgers", "Bank ledger integration, vendor expense tracking, and audit-ready balance sheets."],
      ["Notices, Polls & Emergency Alerts", "Instant push notifications, SMS alerts, and verified resident voting polls."],
    ],
    modules: ["Community Cockpit", "Gate Security & Visitor Guard", "Resident Directory & Flats", "Maintenance Ledgers & CAM", "Resident Helpdesk & Tickets", "Amenity Booking Engine", "Broadcast Notices & Polls", "Society RWA Governance"],
    integrations: ["Stripe", "Slack", "Zoom", "Google Calendar"],
  },
  {
    slug: "hrms",
    name: "HRMS",
    tagline: "Intelligent Human Resource & Payroll Management Platform.",
    description: "Unified employee lifecycle platform: automated payroll, biometric attendance, leave policies, performance appraisals, and employee self-service.",
    category: "HR",
    image: "/products/hrms.jpg",
    industries: ["manufacturing"],
    size: "Medium",
    deployment: "Cloud",
    ai: true,
    hue: 190,
    tags: ["Automated Payroll", "Attendance & Shifts", "Employee App", "Performance"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For fast-growing startups & small businesses",
    "monthly_price_usd": 39,
    "features": [
      "Up to 50 Employees",
      "Biometric Machine & Mobile Geofence Attendance",
      "Leave Management & Company Holiday Calendars",
      "Digital Salary Slips Generation & Email Delivery",
      "Standard Email Support"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For mid-size companies & regional enterprises",
    "monthly_price_usd": 99,
    "features": [
      "Up to 250 Employees",
      "Statutory Payroll Engine (PF, ESI, TDS, PT & Form 16)",
      "Employee Self-Service (ESS) Native Mobile App",
      "Expense Reimbursements & Multi-Tier Approval Matrix",
      "Priority 24/7 HR Tech Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For large enterprise organizations & multi-shift operations",
    "monthly_price_usd": 199,
    "highlighted": true,
    "features": [
      "Up to 1,000 Employees",
      "Performance Management (OKR & 360° Appraisal Cycles)",
      "Applicant Tracking System (ATS) with Digital Offer Letters",
      "Shift Rosters with Automated Overtime & Night Allowances",
      "Dedicated HR Success Strategist"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For multinational corporations & diversified conglomerates",
    "monthly_price_usd": 299,
    "features": [
      "Unlimited Employees & Multi-Entity Subsidiaries",
      "Multi-Currency Global Payroll & Expatriate Taxation",
      "Bi-directional ERP Sync with SAP / Oracle / Workday",
      "Dedicated On-Premise / Private Cloud VPC",
      "Custom Enterprise Security & Compliance Auditing"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "How does DEZORYN HRMS handle statutory tax deductions (PF, ESI, TDS, Professional Tax)?",
    "Our compliance engine automatically updates with current tax slabs. During monthly payroll processing, employee and employer contributions for Provident Fund, ESI, Professional Tax, and Section 192 TDS are computed automatically, generating statutory government return files with one click."
  ],
  [
    "Can biometric fingerprint and facial recognition attendance machines connect directly?",
    "Yes. DEZORYN HRMS supports live API push and LAN sync with major biometric hardware providers (e.g. eSSL, ZKTeco, Matrix). Clock-in and clock-out punches update real-time attendance rosters without requiring manual Excel exports."
  ],
  [
    "Does the mobile app support geofenced attendance for field employees?",
    "Yes. Field sales executives and remote technicians can mark attendance using the native mobile app, which verifies their live GPS coordinates and selfie verification against authorized customer premises or office geofences."
  ],
  [
    "How does the employee self-service (ESS) portal work?",
    "Employees log into their dedicated web or mobile portal to view salary slips, apply for leaves, submit medical and travel expense bills with photos, access their Form 16, and review annual appraisal feedback."
  ],
  [
    "Can we configure complex rotational shifts and overtime calculations?",
    "Absolutely. You can build customizable shift templates with morning, evening, and night rotations, automated grace periods, half-day deduction rules, and automated overtime calculations tied directly to monthly payroll."
  ]
],
    steps: [
  [
    "Organization Structuring",
    "Configuring departments, designations, salary bands, and leave policies."
  ],
  [
    "Biometric & Employee Sync",
    "Syncing biometric machines and importing historical attendance and tax declarations."
  ],
  [
    "Parallel Payroll Validation",
    "Running a test payroll cycle in parallel to verify 100% mathematical parity."
  ],
  [
    "Employee App Launch",
    "Deploying employee self-service mobile app with instant digital salary slip delivery."
  ]
],
    security: [
  [
    "Lock",
    "Encrypted Salary Vault",
    "Bank-grade AES-256 encryption protecting employee compensation and tax records."
  ],
  [
    "KeyRound",
    "Strict HR Access Control",
    "Granular separation preventing department managers from viewing confidential salary data."
  ],
  [
    "FileClock",
    "Immutable Audit Records",
    "Complete audit logging for every salary revision, bonus award, and tax override."
  ],
  [
    "ShieldCheck",
    "Statutory Compliance",
    "Automated compliance with current Provident Fund, ESI, and Income Tax statutes."
  ]
],
    trustMetrics: [
  {
    "title": "Statutory Compliant",
    "desc": "PF, ESI, TDS & Form 16 ready"
  },
  {
    "title": "Biometric Live Sync",
    "desc": "Real-time clock-in punch engine"
  },
  {
    "title": "60fps Mobile ESS",
    "desc": "One-tap leave & payslip access"
  }
],
    telemetryBadges: [
  {
    "title": "Payroll Computation",
    "desc": "Automated Tax & Bonus Pipeline"
  },
  {
    "title": "Workforce Telemetry",
    "desc": "Real-Time Biometric Attendance"
  }
],
    benefits: [
      "Run compliant, error-free monthly payroll in minutes",
      "Biometric hardware and mobile geo-fenced attendance tracking",
      "Employee self-service app for leaves, payslips, and tax declarations",
      "Objective 360-degree appraisal cycles and OKR goal tracking",
    ],
    features: [
      ["Automated Payroll & Tax", "Salary computation, tax declarations, bonus runs, and one-click payslips."],
      ["Attendance & Shift Rosters", "Biometric machine sync, mobile geo-fenced punches, and rotational shifts."],
      ["Leave Management System", "Custom policy rules, approval hierarchies, and compensatory off balances."],
      ["Recruitment & Onboarding", "Job postings, applicant pipeline, interview feedback, and digital offers."],
      ["Performance & Appraisals", "Quarterly OKRs, 360-degree peer reviews, and rating matrices."],
      ["Employee Self-Service App", "Mobile profile, leave applications, expense claims, and company directory."],
    ],
    modules: ["People & Workforce Center", "Employee Directory & Files", "Automated Payroll & Statutory", "Biometric Attendance & Geofencing", "Leave & Shift Planner", "Talent Acquisition & ATS", "KPIs & 360 Reviews", "HR Policy & Compliance"],
    integrations: ["Slack", "Google Workspace", "Stripe"],
  },
  {
    slug: "crm",
    name: "CRM",
    tagline: "AI-Powered Customer Relationship & Revenue Acceleration.",
    description: "Convert leads faster with visual deal pipelines, AI email assistant, omnichannel customer inbox, automated sales sequences, and revenue forecasting.",
    category: "CRM",
    image: "/products/crm.jpg",
    industries: ["professional-services"],
    size: "Small",
    deployment: "Cloud",
    ai: true,
    hue: 262,
    tags: ["Sales Pipeline", "Omnichannel Inbox", "Email Sequences", "AI Assist"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For small sales teams & direct outreach reps",
    "monthly_price_usd": 39,
    "features": [
      "Up to 3 Sales Reps & 2,500 Active Contacts",
      "Visual Drag-and-Drop Deal Pipeline Kanban",
      "Lead Ingestion from Website Forms & Webhooks",
      "Call Logging, Notes & Follow-up Task Reminders",
      "Standard Support"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For expanding sales organizations & outbound teams",
    "monthly_price_usd": 89,
    "features": [
      "Up to 10 Sales Reps & 15,000 Active Contacts",
      "Automated Multi-Touch Email & WhatsApp Sequences",
      "Lead Scoring & Intelligent Routing Algorithms",
      "Sales Quota & Commission Tracking Dashboards",
      "Priority Sales Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For multi-tier enterprise sales divisions",
    "monthly_price_usd": 189,
    "highlighted": true,
    "features": [
      "Up to 35 Sales Reps & 75,000 Active Contacts",
      "Multiple Customizable Pipelines & Deal Stage Gates",
      "AI Revenue Forecasting & Deal Velocity Analytics",
      "Two-Way Email & Google/Outlook Calendar Synchronization",
      "Dedicated CRM Implementation Strategist"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For global sales forces & high-velocity transaction teams",
    "monthly_price_usd": 399,
    "features": [
      "Unlimited Sales Reps & Global Account Management",
      "Custom Automated Workflow Webhooks & REST API Access",
      "Territorial Lead Assignment & Advanced Enterprise RBAC",
      "Dedicated Private VPC Deployment Option",
      "Custom SLA & Executive Quarterly Business Reviews"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "How does DEZORYN CRM capture and route inbound leads?",
    "Leads from your website, Facebook Lead Ads, Google Ads, LinkedIn, and WhatsApp arrive in sub-seconds via instant webhooks. Our intelligent routing engine distributes leads based on territory, deal size, or round-robin availability to on-duty reps."
  ],
  [
    "Can we configure multiple deal pipelines for different business offerings?",
    "Yes. You can create unlimited distinct sales pipelines—for example, separate pipelines for Enterprise Software, Consulting Engagements, and Support Subscriptions—each with custom deal stages and closing probability weights."
  ],
  [
    "Does the CRM support automated multi-channel follow-up cadences?",
    "Yes. When a new prospect fills out a demo form, DEZORYN CRM can trigger automated multi-touch sequences combining WhatsApp messages, personalized emails, and calendar booking links, stopping automatically when the lead replies."
  ],
  [
    "Can our sales reps make calls and send emails directly from the CRM?",
    "Yes. With integrated telephony and two-way email synchronization (Gmail and Microsoft 365), reps can make click-to-call phone calls with automatic audio recording and review full client email threads inside the contact timeline."
  ],
  [
    "How does AI Lead Scoring prioritize our sales team's daily outreach?",
    "Our predictive machine learning model analyzes prospect firmographics, email open patterns, website visit frequency, and response speeds, assigning each lead an engagement temperature (Cold, Warm, Hot) to maximize conversion velocity."
  ]
],
    steps: [
  [
    "Sales Pipeline Mapping",
    "Defining your sales stages, deal milestones, and qualification criteria."
  ],
  [
    "Lead Source Integration",
    "Connecting your website, WhatsApp, advertising campaigns, and email inboxes."
  ],
  [
    "Automated Cadence Setup",
    "Building intelligent lead assignment rules and automated follow-up sequences."
  ],
  [
    "Sales Rep Kickoff",
    "Empowering your sales force with Kanban pipelines and mobile CRM access."
  ]
],
    security: [
  [
    "Lock",
    "Encrypted Lead Vault",
    "Enterprise AES-256 encryption protecting proprietary customer contact lists."
  ],
  [
    "KeyRound",
    "Territory-Based Permissions",
    "Restricting reps from viewing or exporting accounts outside their assigned territories."
  ],
  [
    "FileClock",
    "Complete Sales Activity Audit",
    "Audit trails tracking every deal stage change, discount approval, and email dispatch."
  ],
  [
    "ShieldCheck",
    "99.99% Sales Cloud SLA",
    "Ensuring your sales executives can close deals without interruptions."
  ]
],
    trustMetrics: [
  {
    "title": "Sub-Second Ingestion",
    "desc": "Instant Webhook lead capture"
  },
  {
    "title": "AI Deal Scoring",
    "desc": "Predictive conversion ranking"
  },
  {
    "title": "Zero Lead Leakage",
    "desc": "Automated rep follow-up rules"
  }
],
    telemetryBadges: [
  {
    "title": "Deal Velocity Pipeline",
    "desc": "Real-Time Sales Stage Telemetry"
  },
  {
    "title": "AI Lead Routing",
    "desc": "Zero-Latency Lead Distribution"
  }
],
    benefits: [
      "Capture and auto-assign 100% of website and inbound leads",
      "Visual drag-and-drop Kanban pipeline with real-time deal health",
      "Unified conversation inbox for Email, WhatsApp, and calls",
      "Accurate quarterly revenue forecasting and sales rep performance",
    ],
    features: [
      ["Lead Scoring & Routing", "Capture inquiries from web forms, ads and emails with auto-assignment rules."],
      ["Visual Sales Pipeline", "Custom deal stages, weighted pipeline values and win-loss root analysis."],
      ["Unified Customer Timeline", "Track emails, calls, notes, quotes and tickets on a single shared timeline."],
      ["Automated Outreach Sequences", "Multi-touch email and task sequences that automatically nurture prospects."],
      ["AI Deal Intelligence", "Sentiment detection, meeting summaries and next-step action recommendations."],
      ["Revenue Forecasting & Dashboards", "Real-time team quotas, conversion velocity and cohort analytics."],
    ],
    modules: ["Revenue Command Center", "Lead Capture & Qualification", "Multi-Stage Deal Pipeline", "Key Accounts & Contacts", "Omnichannel Drip Sequences", "Sales Performance & Forecasting", "CRM Workspace Governance"],
    integrations: ["Stripe", "Slack", "Gmail", "Zoom"],
  },
  {
    slug: "super-whatsapp",
    name: "Super Whatsapp",
    tagline: "Enterprise WhatsApp Business API & Omnichannel Marketing Automation Platform.",
    description: "Scale high-conversion customer conversations, broadcast marketing campaigns, no-code chatbot builder, multi-agent shared inbox, and real-time CRM analytics.",
    category: "Communication",
    image: "/products/super-whatsapp.jpg",
    industries: ["retail"],
    size: "Medium",
    deployment: "Cloud",
    ai: true,
    hue: 200,
    tags: ["WhatsApp Cloud API", "Chatbot Builder", "Broadcast Campaigns", "Shared Inbox"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For local stores & direct-to-consumer brands",
    "monthly_price_usd": 29,
    "features": [
      "Up to 1,000 Active Monthly Conversations",
      "Official Meta WhatsApp Cloud API Setup",
      "Multi-Agent Shared Team Inbox (3 Agents)",
      "Pre-Approved Notification & Order Update Templates",
      "Standard Support"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For high-volume retail & e-commerce brands",
    "monthly_price_usd": 79,
    "features": [
      "Up to 10,000 Active Monthly Conversations",
      "Interactive Chatbot Flow Builder with Button Triggers",
      "CSV Bulk Broadcast Campaigns with Tag Segmentation",
      "10 Team Agent Logins & Department Routing",
      "Priority Technical Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For mid-to-large consumer enterprises & fintechs",
    "monthly_price_usd": 169,
    "highlighted": true,
    "features": [
      "Up to 50,000 Active Monthly Conversations",
      "In-Chat E-Commerce Product Catalog & Payment Gateways",
      "Webhook Integration with Shopify, WooCommerce & CRMs",
      "Automated Green Tick Official Business Account Assistance",
      "Dedicated WhatsApp Campaign Strategist"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For national delivery networks & utility providers",
    "monthly_price_usd": 519,
    "features": [
      "Unlimited High-Throughput Monthly Conversations",
      "Dedicated Multi-Tenant Meta WABA Account Cluster",
      "Sub-Second Transactional Messaging SLA (>100 msgs/sec)",
      "Custom On-Premises Webhook Routing & CRM Sync",
      "24/7 Priority Emergency Incident Escalation"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "Is Super WhatsApp built on the official Meta WhatsApp Cloud API?",
    "Yes. DEZORYN Super WhatsApp is powered directly by Meta's Official WhatsApp Business Cloud API. Your phone number is registered legitimately, ensuring zero risk of account bans associated with unofficial scraping tools."
  ],
  [
    "Can multiple team agents respond to customer chats from a single WhatsApp number?",
    "Yes. Super WhatsApp provides a centralized shared team inbox where multiple customer support or sales representatives can manage incoming conversations simultaneously, transfer tickets, and insert internal private notes."
  ],
  [
    "How does the Visual Chatbot Flow Builder work?",
    "You can build automated interactive conversational trees using drag-and-drop nodes with quick reply buttons, list menus, and dynamic variables, answering customer FAQs, qualifying leads, and routing complex inquiries to human agents."
  ],
  [
    "Can we send promotional broadcasts without risking template rejections?",
    "Our built-in template manager assists you in drafting marketing, utility, and authentication message templates formatted according to Meta's strict quality guidelines, with automated variable testing before submission."
  ],
  [
    "Does Super WhatsApp integrate with our website or e-commerce store?",
    "Yes. Through pre-built webhooks and REST APIs, you can trigger automated WhatsApp messages for order confirmations, shipping dispatch tracking numbers, abandoned cart reminders, and payment receipts."
  ]
],
    steps: [
  [
    "Meta Business Verification",
    "Registering your official WhatsApp Business Account (WABA) with Meta approval."
  ],
  [
    "Template & Catalog Setup",
    "Drafting approved message templates and connecting your product inventory."
  ],
  [
    "Chatbot Flow Architecture",
    "Designing automated FAQ workflows, lead qualification trees, and agent routing."
  ],
  [
    "Broadcast & Live Inbox Launch",
    "Launching your shared multi-agent inbox and automated notification triggers."
  ]
],
    security: [
  [
    "Lock",
    "End-to-End Meta Encryption",
    "All messages encrypted according to official WhatsApp Cloud API protocols."
  ],
  [
    "KeyRound",
    "Agent Access Controls",
    "Supervisors can monitor chats and restrict customer phone number exports."
  ],
  [
    "FileClock",
    "Delivery & Read Receipts",
    "Cryptographically logged timestamps for message sent, delivered, read, and replied."
  ],
  [
    "ShieldCheck",
    "Zero-Ban Architecture",
    "100% compliant with Meta Business policies to protect your brand reputation."
  ]
],
    trustMetrics: [
  {
    "title": "Official Meta API",
    "desc": "Zero risk of phone number bans"
  },
  {
    "title": "99.8% Inbox Rate",
    "desc": "Instant high-throughput delivery"
  },
  {
    "title": "Interactive Bots",
    "desc": "No-code conversational flows"
  }
],
    telemetryBadges: [
  {
    "title": "Meta Cloud API Gateway",
    "desc": "High-Throughput Message Queue"
  },
  {
    "title": "Team Inbox Telemetry",
    "desc": "Live Agent Conversation Routing"
  }
],
    benefits: [
      "Official WhatsApp Cloud API infrastructure with high message throughput",
      "Automated drag-and-drop conversational chatbot flows for 24/7 lead capture",
      "High-deliverability broadcast campaigns with opt-in audience segmentation",
      "Centralized multi-agent support inbox with quick canned responses",
    ],
    features: [
      ["Official WhatsApp API", "Direct Meta cloud API integration with verified green tick support and zero gateway lag."],
      ["No-Code Chatbot Builder", "Visual drag-and-drop conversational decision trees, interactive buttons, and automated FAQs."],
      ["Shared Team Inbox", "Multi-agent assignment, private internal notes, chat tags, and seamless ticket transfer."],
      ["Broadcast Marketing", "Bulk personalized campaign broadcasts with real-time delivery and click tracking."],
      ["CRM & Webhooks", "Two-way webhook synchronization with CRM pipelines, Shopify, and custom databases."],
      ["AI Conversation Assistant", "Contextual AI suggestions for agents to respond 80% faster with high accuracy."],
    ],
    modules: ["Messaging Command Center", "Multi-Agent Shared Inbox", "Audience Broadcast Engine", "Conversational AI Bots", "Contact Lists & Segments", "Pre-Approved Meta Templates", "Campaign Telemetry & CTR", "WhatsApp Number Management"],
    integrations: ["Stripe", "Slack", "Google Workspace", "HubSpot"],
  },
  {
    slug: "school-master",
    name: "School Master",
    tagline: "Comprehensive K-12 School Administration, Academic & Student ERP.",
    description: "Unified school ecosystem: student enrollment, fee collections, biometric attendance, examination grading, class timetables, and connected parent portals.",
    category: "Education",
    image: "/products/school-master.jpg",
    industries: ["education"],
    size: "Medium",
    deployment: "Cloud",
    ai: true,
    hue: 210,
    tags: ["K-12 ERP", "Admissions", "Fees Collection", "Parent Mobile App"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For foundational primary & elementary schools",
    "monthly_price_usd": 35,
    "features": [
      "Up to 300 Students",
      "Student Information System & Enrollment Records",
      "Daily Attendance Registers with SMS Notifications",
      "Standard Fee Collection Desks & Receipts",
      "Standard Email Helpdesk"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For established K-12 secondary schools",
    "monthly_price_usd": 89,
    "features": [
      "Up to 1,200 Students",
      "Academic Term Gradebooks & Report Card Generation",
      "Parent-Teacher Communication App with Circulars",
      "Staff Leaves, Timetable Roster & Payroll Computation",
      "Priority Phone & Chat Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For multi-campus schools & educational trusts",
    "monthly_price_usd": 169,
    "highlighted": true,
    "features": [
      "Up to 3,500 Students across Branches",
      "School Transport Route Dispatch & GPS Driver Tracking",
      "Online Homework Submissions & Teacher Review Desks",
      "Consolidated Branch Financial Reporting & Cashflow",
      "Dedicated Campus Success Specialist"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For regional school boards & district administrative groups",
    "monthly_price_usd": 699,
    "features": [
      "Unlimited Students across District Campuses",
      "Custom State Board Compliance Examination Formats",
      "Centralized Treasury & Fee Discrepancy Auditing",
      "Dedicated On-Campus Engineer & 24/7 Priority Support",
      "Custom Private Cloud VPC Deployment"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "How does School Master simplify end-of-term examination grading?",
    "Teachers enter marks into subject-specific digital grade books. School Master automatically calculates weighted term averages, percentage ranks, and attendance percentages, rendering official board-compliant report cards in seconds."
  ],
  [
    "Can school transport buses and student pickups be tracked?",
    "Yes. The School Transport module manages buses, driver records, and pickup stops, providing parents with a live GPS tracking view when the bus enters their neighborhood route."
  ],
  [
    "Does School Master support online digital homework submissions?",
    "Yes. Teachers can attach assignments, worksheets, and deadlines. Students and parents receive notifications, submit photos or PDFs of completed work, and receive teacher grading annotations directly in the app."
  ],
  [
    "How are school circulars and emergency notices broadcast to parents?",
    "School administrators can draft an announcement and broadcast it instantly via push notification, WhatsApp, and SMS to specific grades, sections, or the entire school body with delivery acknowledgment."
  ],
  [
    "Can school fees be collected at on-campus cash counters and online simultaneously?",
    "Yes. Cashier desks at the school counter use the quick POS interface to issue instant printed thermal receipts, while online transactions via NetBanking and UPI sync to the student's central ledger automatically."
  ]
],
    steps: [
  [
    "Academic Year Setup",
    "Configuring grades, sections, subject combinations, and fee structures."
  ],
  [
    "Historical Record Upload",
    "Importing previous student rosters, parent contacts, and transfer certificates."
  ],
  [
    "Faculty & Transport Training",
    "Staff orientation on attendance registers, grade books, and bus routes."
  ],
  [
    "Parent Welcome Broadcast",
    "Activating parent mobile portal with digital student identification cards."
  ]
],
    security: [
  [
    "Lock",
    "Minor Identity Protection",
    "Strict cryptographic data vaults safeguarding student PII and academic marks."
  ],
  [
    "KeyRound",
    "Staff Privilege Matrices",
    "Teachers only access assigned classes; cashiers only view designated fee heads."
  ],
  [
    "FileClock",
    "Complete Examination Audits",
    "Detailed logs of teacher mark entries and grade alterations to prevent tampering."
  ],
  [
    "ShieldCheck",
    "Academic Continuity SLA",
    "Continuous cloud backups ensuring academic operations run without disruptions."
  ]
],
    trustMetrics: [
  {
    "title": "Board Certified",
    "desc": "State & National curriculum ready"
  },
  {
    "title": "Transport GPS",
    "desc": "Live bus route student tracking"
  },
  {
    "title": "Counter & Online POS",
    "desc": "Unified fee reconciliation"
  }
],
    telemetryBadges: [
  {
    "title": "Academic Administration",
    "desc": "Student Information System"
  },
  {
    "title": "Transport Telemetry",
    "desc": "Live Bus GPS Route Tracking"
  }
],
    benefits: [
      "Automates daily school administration and reduces paperwork by 90%",
      "Real-time fee collection with automated receipt generation and SMS reminders",
      "RFID and biometric student attendance with instant parent notifications",
      "Automated report card generation and grade moderation system",
    ],
    features: [
      ["Online Admissions", "Digital application forms, document verification, and automated class allotment."],
      ["Smart Fee Management", "Configurable fee structures, online payment gateway, and overdue installment alerts."],
      ["Attendance & Timetable", "Automated conflict-free timetable generator and daily attendance registers."],
      ["Examination & Report Cards", "CBSE/ICSE/State grading formats with automatic CGPA calculation and PDF cards."],
      ["Parent & Student App", "Live homework tracking, school notice board, bus GPS tracking, and fee receipts."],
      ["Staff & Payroll", "Teacher biometric logs, leaves management, and automated salary slip generation."],
    ],
    modules: ["Institutional Cockpit", "Online Admissions & Inquiries", "Student Academic Records", "Fee Structure & Scholarships", "Master Scheduling & Rotations", "Board Examinations & Report Cards", "Fleet Tracking & Buses", "School Board Governance"],
    integrations: ["Stripe", "Google Workspace", "Zoom", "Twilio"],
  },
  {
    slug: "coaching-master",
    name: "Coaching Master",
    tagline: "Complete Coaching Institute & Test Prep Center Management Suite.",
    description: "Manage student batches, entrance exam test series, fee installment plans, faculty scheduling, performance rank analytics, and parent SMS updates.",
    category: "Education",
    image: "/products/coaching-master.jpg",
    industries: ["education"],
    size: "Small",
    deployment: "Cloud",
    ai: true,
    hue: 190,
    tags: ["Test Series", "Batch Scheduling", "Installment Fees", "Rank Analytics"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For independent tutors & single-center academies",
    "monthly_price_usd": 29,
    "features": [
      "Up to 150 Students & 5 Active Batches",
      "Batch Timetables & Daily Attendance Registers",
      "Offline Fee Installments Tracker & Receipts",
      "SMS Alerts for Class Timing Changes",
      "Standard Support"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For competitive exam prep institutes (IIT-JEE / NEET / UPSC)",
    "monthly_price_usd": 79,
    "features": [
      "Up to 600 Students & 20 Active Batches",
      "OMR & Online Mock Test Engine with AIR Rankings",
      "Lead CRM for Demo Classes & Walk-In Inquiries",
      "Student Performance Heatmaps & Topic Weak-Area AI",
      "Priority Academic Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For multi-center competitive academies & test networks",
    "monthly_price_usd": 159,
    "highlighted": true,
    "features": [
      "Up to 2,000 Students across Centers",
      "Automated WhatsApp Installment Due Alerts & UPI Links",
      "Test Series Video Solution & Study Material DRM Vault",
      "Faculty Lecture Hours & Hourly Payout Audit",
      "Dedicated Coaching Success Manager"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For national coaching franchises & test prep brands",
    "monthly_price_usd": 299,
    "features": [
      "Unlimited Students & Multi-City Center Management",
      "Custom White-Labeled Student Test Prep Mobile App",
      "Encrypted Video Lecture Streaming with Screenshot Protection",
      "Centralized Franchise Royalties & P&L Telemetry",
      "Custom Private Cloud Deployment & 24/7 SLA"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "How does the Mock Test Engine calculate All-India Ranks (AIR)?",
    "Students complete tests online or submit OMR answer sheets. Coaching Master scores responses with negative marking rules, generates percentile curves, and calculates instant institute and national comparative ranks with detailed topic-by-topic scorecards."
  ],
  [
    "Can we track student fee installment schedules and send automated reminders?",
    "Yes. You can structure multi-part installment plans tied to specific dates. When an installment is due, Coaching Master automatically sends polite WhatsApp reminders with direct UPI payment links to parents."
  ],
  [
    "How does the Lead CRM help convert walk-in demo class inquiries?",
    "When prospective students visit for counseling, counselors log their target exam and academic background. The CRM triggers automated follow-up reminders, demo class SMS confirmations, and discount coupon expirations to boost enrollment rates."
  ],
  [
    "Can faculty lecture hours and batch coverage be monitored?",
    "Yes. The academic planner tracks syllabus completion per batch, teacher attendance, and actual hours delivered against target curricula, facilitating transparent hourly payouts for visiting faculty."
  ],
  [
    "Does Coaching Master provide video lecture and study material distribution?",
    "Yes. You can upload digital PDFs and recorded video lectures with DRM safeguards like dynamic user watermarking, preventing unauthorized redistribution of your proprietary study notes."
  ]
],
    steps: [
  [
    "Batch & Course Architecture",
    "Configuring test prep courses, batch timings, and faculty allocations."
  ],
  [
    "Student Enrollment & Batches",
    "Enrolling active students, assigning batch tags, and setting fee installments."
  ],
  [
    "Mock Test Engine Integration",
    "Uploading question papers, answer keys, and negative marking rubrics."
  ],
  [
    "Student App Activation",
    "Launching student test prep portal with instant rank cards and study materials."
  ]
],
    security: [
  [
    "Lock",
    "Study Material DRM",
    "Dynamic watermark protection guarding question banks and proprietary notes."
  ],
  [
    "KeyRound",
    "Faculty & Center Separation",
    "Branch managers view local center batches; master directors oversee all branches."
  ],
  [
    "FileClock",
    "Fee Installment Ledger",
    "Audited records of every rupee received via cash, cheque, or online payment."
  ],
  [
    "ShieldCheck",
    "Test Session Reliability",
    "Robust auto-save technology ensuring test submissions are never lost during power outages."
  ]
],
    trustMetrics: [
  {
    "title": "AIR Rank Engine",
    "desc": "Instant percentile & topic analysis"
  },
  {
    "title": "Fee Installment Sync",
    "desc": "Automated WhatsApp dues links"
  },
  {
    "title": "DRM Study Vault",
    "desc": "Watermarked lecture protection"
  }
],
    telemetryBadges: [
  {
    "title": "Mock Test Engine",
    "desc": "Instant Percentile & AIR Scoring"
  },
  {
    "title": "Batch Performance AI",
    "desc": "Topic Weakness Detection Matrix"
  }
],
    benefits: [
      "Optimized batch capacity management across multiple study centers",
      "Detailed mock test rank analysis and student strengths/weakness reports",
      "Automated fee installment reminders with instant UPI/card payment links",
      "Transparent parent updates on student attendance and test scores",
    ],
    features: [
      ["Batch & Class Rosters", "Assign students and faculty to morning, evening, or weekend batches with zero clashes."],
      ["Mock Test & Rank Engine", "OMR and online test score evaluation with percentile and all-institute ranks."],
      ["Fee Installment Tracking", "Custom payment schedules, PDC tracking, automated receipt generation, and SMS alerts."],
      ["Study Material Vault", "Digital notes, assignments, previous year question papers, and video solutions."],
      ["Inquiry & Lead CRM", "Track walk-in counseling inquiries, demo classes, and student conversion pipelines."],
      ["Student Performance AI", "AI-driven topic mastery heatmaps to pinpoint areas needing revision."],
    ],
    modules: ["Test-Prep Operations Center", "Batch Allocation & Timings", "Enrolled Aspirants Roster", "All India Test Series & Ranks", "Installment Fee Tracking", "Inquiry Admission Funnel", "Batch Scorecard Analytics", "Coaching Branch Controls"],
    integrations: ["Stripe", "Zoom", "WhatsApp API", "Google Drive"],
  },
  {
    slug: "college-master",
    name: "College Master",
    tagline: "Enterprise University & Higher Education Multi-Faculty Campus ERP.",
    description: "Manage multi-department faculties, semester credit systems, student course registrations, campus hostels, digital libraries, and accreditation compliance.",
    category: "Education",
    image: "/products/college-master.jpg",
    industries: ["education"],
    size: "Large",
    deployment: "Cloud",
    ai: true,
    hue: 220,
    tags: ["University ERP", "Credit System", "Hostel & Library", "Accreditation"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For standalone degree colleges & polytechnic institutes",
    "monthly_price_usd": 69,
    "features": [
      "Up to 500 Enrolled Undergrads & 3 Departments",
      "Departmental Student Directory & Course Credits",
      "Semester Tuition Fee Billing & Scholarship Concessions",
      "Faculty Subject Allocation & Lecture Rosters",
      "Standard Campus Helpdesk"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For multi-disciplinary universities & engineering campuses",
    "monthly_price_usd": 159,
    "features": [
      "Up to 2,500 Students & 8 Faculties",
      "Semester Examination Hall Tickets & CGPA Transcripts",
      "Hostel Bed Allocation & Mess Billing Integration",
      "Library RFID Barcode Issue / Return Automation",
      "Priority Technical Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For large university institutions & medical/technical colleges",
    "monthly_price_usd": 299,
    "highlighted": true,
    "features": [
      "Up to 8,000 Students & Multi-Faculty Campuses",
      "Campus Placement & Corporate Recruitment Drives Portal",
      "Research Grant & Faculty Paper Publication Tracking",
      "Government Accreditation (NAAC/NIRF) Audit Export Engine",
      "Dedicated University Systems Consultant"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For state/central universities & multi-campus higher education networks",
    "monthly_price_usd": 359,
    "features": [
      "Unlimited Campuses & Affiliated Colleges Network",
      "Autonomous University Curriculum & CBCS Grading Engine",
      "Cryptographic Degree Verification QR Portal for Employers",
      "Dedicated On-Premise University Data Center Deployment",
      "24/7 Enterprise Tier-1 University SLA"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "Does College Master support the Choice Based Credit System (CBCS)?",
    "Yes. College Master fully adheres to CBCS guidelines, allowing students to select core, elective, and inter-departmental courses online, while automatically verifying prerequisites and semester credit requirements."
  ],
  [
    "How are semester examination hall tickets and CGPA transcripts managed?",
    "The examination module verifies student attendance eligibility and fee clearance prior to generating digital hall tickets with QR verification codes. Post-evaluation, it compiles SGPA and cumulative CGPA transcripts formatted to official university guidelines."
  ],
  [
    "Can College Master manage hostel room allocations and mess dues?",
    "Yes. The residential campus module manages hostel room inventory across blocks, tracking student room allotments, room inventory, warden complaints, and monthly mess fee reconciliations."
  ],
  [
    "How does the Campus Placement module assist final-year recruitments?",
    "Corporate recruiters receive guest portals to post job descriptions, review eligible student profiles filtered by CGPA criteria, schedule interview slots, and dispatch digital offer letters directly through the platform."
  ],
  [
    "Does the system generate compliance reports for NAAC and NIRF audits?",
    "Yes. College Master aggregates student diversity ratios, faculty-to-student ratios, research publications, library asset statistics, and placement percentages into structured compliance tables for NAAC and NIRF accreditations."
  ]
],
    steps: [
  [
    "University Schema Modeling",
    "Configuring academic faculties, departments, degree curricula, and credit rules."
  ],
  [
    "Semester Student Enrollment",
    "Importing historical student academic records, credit transfers, and faculty profiles."
  ],
  [
    "Departmental Staff Onboarding",
    "Training heads of departments, exam controllers, hostel wardens, and librarians."
  ],
  [
    "Student Campus Portal Launch",
    "Deploying the comprehensive university web portal for course registration and fees."
  ]
],
    security: [
  [
    "Lock",
    "Degree Cryptographic Verification",
    "SHA-256 hash-sealed transcripts preventing certificate forgery by third parties."
  ],
  [
    "KeyRound",
    "Faculty Role Boundaries",
    "Dean-level controls over grade moderations and academic curriculum updates."
  ],
  [
    "FileClock",
    "Exam Controller Audit Logs",
    "Strict logging for all internal assessment and end-term grade alterations."
  ],
  [
    "ShieldCheck",
    "University-Grade Cloud",
    "Enterprise high-availability architecture tested under heavy semester result traffic."
  ]
],
    trustMetrics: [
  {
    "title": "CBCS Aligned",
    "desc": "Choice Based Credit System ready"
  },
  {
    "title": "NAAC / NIRF Ready",
    "desc": "Automated accreditation metrics"
  },
  {
    "title": "QR Degree Vault",
    "desc": "Tamper-proof student credentials"
  }
],
    telemetryBadges: [
  {
    "title": "University Academic Cloud",
    "desc": "CBCS Course Credit Engine"
  },
  {
    "title": "Campus Placement Matrix",
    "desc": "Live Student Recruitment Pipeline"
  }
],
    benefits: [
      "Unified digital backbone for colleges, universities, and multi-campus institutes",
      "Choice-based credit system (CBCS) and automated course registration",
      "Centralized library management with barcode book issuing and returns",
      "Hostel room allotments, mess billing, and gate entry passes",
    ],
    features: [
      ["Faculty & Department Portal", "HOD controls, syllabus completion tracking, and academic research logs."],
      ["Semester Credit System", "Elective course selection, prerequisite validation, and credit transfer audit."],
      ["Digital Library System", "OPAC book search, digital e-journals, barcode scanner sync, and overdue fines."],
      ["Hostel & Campus Facilities", "Room allocation matrix, mess fee calculations, night curfews, and maintenance tickets."],
      ["Placements & Alumni", "Campus interview scheduling, student resume builder, and alumni network directory."],
      ["NAAC / NIRF Reporting", "One-click data export for university accreditation and regulatory compliance."],
    ],
    modules: ["University Command Center", "Semester & Degree Programs", "Professors & Department Deans", "CBCS Credit Matrix & Electives", "Campus Hostels & Mess", "Digital Library & OPAC", "Campus Placement & Drives", "Chancellor & Registrar Controls"],
    integrations: ["Stripe", "Google Workspace", "Microsoft 365", "Zoom"],
  },
  {
    slug: "legal-docs",
    name: "Legal Docs",
    tagline: "AI-Powered Contract Automation, Legal Drafting & Digital Signature Platform.",
    description: "Accelerate agreement lifecycles: automated contract generation, smart NDA templates, risk redlining, cryptographic e-signatures, and compliance audit vaults.",
    category: "Operations",
    image: "/products/legal-docs.jpg",
    industries: ["finance"],
    size: "Medium",
    deployment: "Cloud",
    ai: true,
    hue: 230,
    tags: ["Contract AI", "E-Signatures", "Compliance Vault", "Template Automation"],
    plans: [
  {
    "id": "starter",
    "name": "Starter",
    "for": "For freelance professionals & boutique agencies",
    "monthly_price_usd": 39,
    "features": [
      "Up to 100 Executed Contracts / Month",
      "50+ Standard Commercial Legal Templates",
      "Audit-Logged E-Signatures (ESIGN & eIDAS Compliant)",
      "Encrypted PDF Document Vault & Expiry Reminders",
      "Standard Support Desk"
    ]
  },
  {
    "id": "growth",
    "name": "Growth",
    "for": "For mid-market enterprises & growing corporate teams",
    "monthly_price_usd": 99,
    "features": [
      "Up to 500 Executed Contracts / Month",
      "Dynamic Clause Library & Version Negotiation Portal",
      "AI Contract Risk Review & Non-Standard Clause Flags",
      "Sequential Multi-Party Sign-off Workflows",
      "Priority Legal Tech Support"
    ]
  },
  {
    "id": "business",
    "name": "Business",
    "for": "For corporate legal departments & procurement teams",
    "monthly_price_usd": 199,
    "highlighted": true,
    "features": [
      "Up to 2,500 Executed Contracts / Month",
      "Tamper-Evident SHA-256 Audit Trail Certificates",
      "Salesforce, HubSpot & Zapier Bidirectional Contract Sync",
      "Conditional Approval Hierarchies by Dollar Value",
      "Dedicated Legal Operations Specialist"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "for": "For global enterprises, law firms & financial institutions",
    "monthly_price_usd": 479,
    "features": [
      "Unlimited Monthly Contract Execution Volume",
      "Private On-Premises Hardware Security Module (HSM) Key Storage",
      "Custom Master Services Agreement (MSA) Enterprise Terms",
      "Dedicated Solutions Architect & Private Cloud VPC",
      "Strict 99.99% Legal Vault Uptime & Zero Data Retention"
    ]
  }
].map(p => ({ ...p, annual_price_usd: p.monthly_price_usd ? Math.round(p.monthly_price_usd * (1 - ANNUAL_DISCOUNT)) : null })),
    faq: [
  [
    "Are e-signatures generated in DEZORYN Legal Docs legally binding in court?",
    "Yes. Signatures generated through DEZORYN Legal Docs comply with the US ESIGN Act, UETA, EU eIDAS regulations, and the Indian Information Technology Act 2000. Each completed agreement includes a cryptographic certificate with signer IP addresses, emails, and timestamped audit trails."
  ],
  [
    "How does the AI Contract Review engine identify risky clauses?",
    "Our legal NLP model reads uploaded PDF or Word contracts, comparing clauses against your organization's pre-approved standard terms. It flags non-standard liabilities, missing indemnification caps, and ambiguous termination periods with color-coded risk scores."
  ],
  [
    "Can multiple parties sign a contract in a specific sequential order?",
    "Yes. You can establish sequential signing orders—for example, requiring internal CFO approval before the contract is automatically routed to the external vendor—or broadcast for parallel signing when sequence is unimportant."
  ],
  [
    "How are executed contracts archived and searched?",
    "All completed agreements are indexed with OCR in an encrypted repository. You can execute full-text semantic searches across thousands of past agreements and filter by expiration dates, renewal terms, or governing jurisdictions."
  ],
  [
    "Does the platform support custom company branding on signing links?",
    "Yes. Business and Enterprise plans allow custom company logos, brand color palettes, and custom email domains on all outbound e-signature invitations dispatched to your clients and partners."
  ]
],
    steps: [
  [
    "Clause Library Setup",
    "Uploading your organization's approved Master Services Agreements, NDAs, and clauses."
  ],
  [
    "Signer Hierarchy Configuration",
    "Setting up department signing authority limits and sequential approval workflows."
  ],
  [
    "CRM & ERP Integration",
    "Connecting Salesforce, HubSpot, or billing software for automated contract generation."
  ],
  [
    "Legal Vault Activation",
    "Activating tamper-evident document storage with automated renewal date alerts."
  ]
],
    security: [
  [
    "Lock",
    "Cryptographic Signatures",
    "SHA-256 hash sealing ensuring any alteration invalidates the digital document."
  ],
  [
    "KeyRound",
    "Signer Identity Verification",
    "Multi-factor SMS/Email OTP verification required before signature execution."
  ],
  [
    "FileClock",
    "Tamper-Proof Audit Trail",
    "Court-admissible certificate detailing IP addresses, timestamps, and identity proofs."
  ],
  [
    "ShieldCheck",
    "Zero Data Retention Option",
    "Enterprise tier allows purging contract contents post-execution for strict privacy."
  ]
],
    trustMetrics: [
  {
    "title": "ESIGN & eIDAS",
    "desc": "Legally enforceable digital signing"
  },
  {
    "title": "AI Clause Risk",
    "desc": "Instant liability & indemnity scan"
  },
  {
    "title": "SHA-256 Vault",
    "desc": "Tamper-evident audit certificates"
  }
],
    telemetryBadges: [
  {
    "title": "Contract Intelligence",
    "desc": "AI Clause Risk & Redline Engine"
  },
  {
    "title": "Cryptographic Vault",
    "desc": "ESIGN & eIDAS Sealed Audit Trail"
  }
],
    benefits: [
      "Draft and finalize legally binding contracts in minutes instead of days",
      "AI clause analysis that flags hidden liabilities and unfavorable terms",
      "Legally compliant digital signatures with immutable tamper-proof audit trails",
      "Centralized searchable repository for all corporate agreements and renewals",
    ],
    features: [
      ["Smart Contract Generator", "Fill-in-the-blank dynamic templates for NDAs, vendor agreements, and employment offers."],
      ["AI Clause Risk Review", "Automated contract review engine that highlights missing protections and non-standard terms."],
      ["Legally Binding E-Sign", "Biometric/OTP authenticated e-signatures adhering to global ESIGN and eIDAS standards."],
      ["Collaborative Redlining", "Multi-party track changes, version history, internal legal notes, and negotiation flows."],
      ["Renewal & Expiry Alerts", "Proactive notifications before contract expiry, price escalation dates, or opt-out windows."],
      ["Encrypted Document Vault", "AES-256 encrypted storage with granular team permissions and detailed access logs."],
    ],
    modules: ["Legal Operations Cockpit", "Contract Lifecycle Management", "Bespoke Agreement Templates", "Aadhaar & Cryptographic E-Sign", "AI Clause Risk Review", "Encrypted Evidence Vault", "Chain-of-Custody Audit Trail", "Enterprise Compliance Policy"],
    integrations: ["Google Drive", "Dropbox", "Slack", "DocuSign", "Stripe"],
  },

];

const PRODUCT_ALIASES = {
  schooly: "schooly-core",
  hospital: "dezo-care",
  property: "real-estate",
  society: "society-management",
  payroll: "hrms",
  "sales-crm": "crm",
  whatsapp: "super-whatsapp",
  school: "school-master",
  coaching: "coaching-master",
  college: "college-master",
  legal: "legal-docs",
};
export const getProduct = (slug) => {
  const target = PRODUCT_ALIASES[slug] || slug;
  return products.find((p) => p.slug === target || p.id === target);
};
export const startingPrice = (p) => {
  if (!p) return 49;
  if (typeof p.startingPrice === "number" && p.startingPrice > 0) return p.startingPrice;
  if (Array.isArray(p.plans) && p.plans.length > 0) {
    const paidPlan = p.plans.find((x) => {
      const val = x.monthlyPriceUsd ?? x.monthly_price_usd ?? x.price;
      return typeof val === "number" && val > 0;
    }) || p.plans[0];
    const val = paidPlan?.monthlyPriceUsd ?? paidPlan?.monthly_price_usd ?? paidPlan?.price;
    if (typeof val === "number" && val > 0) return val;
  }
  return 49;
};

/* ───────────── Industries ───────────── */
export const industries = [
  {
    slug: "education",
    name: "Education",
    short: "K-12 schools, universities, coaching academies & test prep centers",
    icon: "GraduationCap",
    problem: "Educational institutions struggle with fragmented legacy software and physical paper registers. Student admissions, tuition fees, daily attendance, class timetables, and exam gradebooks are commonly managed in isolated Excel spreadsheets or obsolete desktop applications. This causes hours of administrative double-entry, lost student records, delayed fee reconciliation, and frustrated parents who lack real-time visibility into their child's academic attendance and safety.",
    solution: "DEZORYN Education Cloud delivers an integrated multi-tenant campus ERP uniting students, teachers, parents, and administrative staff into a single real-time platform. The software automates digital applications, tracks daily biometric and RFID attendance, orchestrates complex teacher timetables, facilitates online fee collections with automated WhatsApp reminders, and computes semester grade sheets with continuous assessment moderation.",
    workflow: [
      { step: "01", name: "Inquiry & Lead Ingestion", action: "Omnichannel digital inquiries captured from school web portals, walk-in reception desks, and WhatsApp bots, automatically routed to admission counselors.", outcome: "Instant inquiry registration with auto-generated tracking token." },
      { step: "02", name: "Document Audit & Evaluation", action: "Online submission of birth certificates, prior academic transcripts, and transfer certificates with automated verification status flags.", outcome: "Digitally verified applicant profile ready for principal approval." },
      { step: "03", name: "Roster Allocation & SIS Provisioning", action: "Automated student ID and roll number generation, section assignment based on classroom capacity caps, and bus route mapping.", outcome: "Active student profile populated in SIS database with parent portal credentials." },
      { step: "04", name: "Automated Fee Billing & Reconciliation", action: "Term-wise installment generation, transport fee calculation, late-fee penalty rules, and integrated online payment gateway links.", outcome: "Instant digital receipt generation and double-entry ledger reconciliation." },
      { step: "05", name: "Continuous Grading & Report Cards", action: "Teacher mark entry by subject, automated GPA and grading curve computation, teacher remark moderation, and tamper-evident PDF generation.", outcome: "Instant report card publication on the parent mobile app and SIS archive." }
    ],
    coreModules: [
      { title: "Student Information System (SIS)", desc: "Centralized digital cumulative records spanning biographical details, health records, disciplinary logs, and historical academic transcripts." },
      { title: "Automated Fee Ledgers & Gateway", desc: "Configurable fee structures, scholarship discounts, automatic WhatsApp fee reminders, and online payment settlement." },
      { title: "Timetable & Teacher Substitution", desc: "Algorithmic conflict-free classroom scheduling with automated emergency teacher substitution alerts via mobile notifications." },
      { title: "Biometric & RFID Attendance Telemetry", desc: "Live integration with hardware turnstiles and school bus GPS beacons, sending instantaneous arrival alerts to parents." },
      { title: "Exam Moderation & Digital Gradebooks", desc: "Curriculum-aligned grading schemas (CBSE, ICSE, IB, State Boards) with weighted test scoring and rank moderation." },
      { title: "Parent Mobile App & Broadcast Desk", desc: "Real-time mobile homework tracking, school event calendars, bus live GPS tracking, and two-way teacher messaging." }
    ],
    products: ["schooly-core", "school-master", "coaching-master", "college-master"],
    features: [
      ["Multi-Branch Student Records", "Centralize student enrollment, class allocations, and academic histories across multiple regional campuses from an executive dashboard."],
      ["Integrated Fee Collection Ledgers", "Automate installment schedules, late fee rules, and instant digital payment receipts with real-time bank ledger reconciliation."],
      ["Timetables & Attendance Telemetry", "Classroom schedule optimization and automated daily parent absence alerts via automated WhatsApp and SMS gateways."],
      ["Digital Gradebooks & Report Cards", "Continuous assessment marks entry, rank calculations, and tamper-evident PDF report cards ready for one-click distribution."],
    ],
    benefits: [
      ["Administrative Efficiency", "Eliminate redundant paper registers and reduce hours spent compiling term reports by over 65%."],
      ["Transparent Financial Reconciliation", "Instant visibility into collected dues, pending balances, and scholarship allocations with zero unreconciled entries."],
      ["Enhanced Parent Engagement", "Direct mobile access for attendance updates, academic schedules, and school announcements."],
      ["Data Continuity", "Single unified record of a student's academic progress from initial kindergarten enrollment to high school graduation."],
    ],
    faq: [
      ["Can Schooly Core adapt to different school boards or grading systems?", "Yes. The platform supports CBSE, ICSE, State Boards, and International curricula with configurable grading formulas and continuous assessment schemes."],
      ["How are online fee payments collected and reconciled?", "Integrated payment gateways allow parents to pay via UPI, credit/debit cards, or net banking, with instant automated receipt generation and ledger reconciliation."],
      ["Is student data isolated between different campus branches?", "Yes. Multi-tenant architecture ensures each school branch maintains private rosters while allowing group executives consolidated administrative reports."],
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    short: "Commercial builders, property developers, leasing firms & realtors",
    icon: "Building2",
    problem: "Real estate developers and brokerage networks suffer from inventory opacity and delayed customer billing. Unit availability is often managed on disparate physical spreadsheets across sales galleries, leading to embarrassing double-booking conflicts. Meanwhile, construction milestone demands, customer payment plans, bank NOC letters, and channel partner broker commissions are tracked manually, creating cash flow delays and dispute risks with buyers.",
    solution: "DEZORYN Real Estate Cloud combines real-time unit inventory matrices, interactive architectural floor plans, broker lead attribution, and automated construction-linked billing into a unified property operating system. Sales galleries and channel partners view live unit locks, while finance teams trigger automated demand notes and receipts tied directly to verified civil engineer milestone certificates.",
    workflow: [
      { step: "01", name: "Inquiry & Broker Lead Ingestion", action: "Captures prospective buyer inquiries from digital campaigns, property portals, and channel partners with automated deduplication and agent assignment.", outcome: "Verified lead profile with originating broker commission attribution tag." },
      { step: "02", name: "Site Visit & Interactive Unit Selection", action: "Sales executives guide buyers through 3D tower availability matrices, unit layouts, and flexible payment plan simulations.", outcome: "Instant temporary hold placed on designated unit with transactional locking." },
      { step: "03", name: "KYC Audit & Digital Unit Booking", action: "Collection of buyer identification documents, tax IDs, and booking advance payment via integrated digital payment gateway.", outcome: "Signed digital allotment letter and booking receipt generated automatically." },
      { step: "04", name: "Construction Milestone Demand Billing", action: "Civil engineer uploads verified slab completion certificate, automatically triggering demand letters to all buyers in the affected tower.", outcome: "Automated customer email and WhatsApp notices with payment links and receipts." },
      { step: "05", name: "Handover & Facility Onboarding", action: "Snag list inspection logging, possession clearance handover, maintenance dues setup, and transition into society management portal.", outcome: "Formal possession certificate issuance and resident portal activation." }
    ],
    coreModules: [
      { title: "Interactive Unit Inventory Matrix", desc: "Real-time visual tower grids displaying available, held, booked, and registered residential/commercial inventory with concurrent hold locking." },
      { title: "Channel Partner & Broker Portal", desc: "Transparent broker registration desk with real-time lead tracking, commission rate cards, and automated payout disbursement schedules." },
      { title: "Construction Milestone Billing Engine", desc: "Automated generation of demand letters, tax invoices, and interest penalty calculations mapped to civil engineering milestone certificates." },
      { title: "Digital Allotment & Contract Generator", desc: "Structured buyer agreement creation with digital signature workflows, payment milestone schedules, and legal clause compliance." },
      { title: "Site Visit & Shuttle Coordination Desk", desc: "Calendar scheduling for prospective customer site tours, driver dispatch, and sales gallery host allocations." },
      { title: "Customer Possession & Snagging Suite", desc: "Mobile-first inspection checklist for buyers during apartment handover, tracking rectification tickets until formal sign-off." }
    ],
    products: ["real-estate"],
    features: [
      ["Interactive Unit Inventory Matrix", "Real-time visual floor plans and tower matrices indicating available, held, and booked units with transactional cloud concurrency locking."],
      ["Channel Partner Broker Portal", "Self-service portal for channel partners to register leads, verify ownership, and track commission payout milestones transparently."],
      ["Site Visit Calendar & Driver Allocation", "Calendar scheduling for property visits with automated sales representative assignment and lead disposition tracking."],
      ["Automated Payment Demand Notes", "Construction milestone tracking with automated generation of demand letters, tax breakdowns, and payment receipts."],
    ],
    benefits: [
      ["Zero Double-Booking Conflicts", "Instant real-time synchronization across sales galleries prevents concurrent unit holds entirely."],
      ["Accelerated Broker Collaboration", "Transparent lead tagging ensures brokers receive timely credit and sales commission visibility, driving 3x more referrals."],
      ["Predictable Cash Flow", "Automated construction milestone demand notices reduce accounts receivable delays by over 32%."],
      ["Structured Buyer Experience", "Digital booking summaries and transparent milestone tracking build long-term customer confidence."],
    ],
    faq: [
      ["Can multiple sales offices use the unit inventory simultaneously?", "Yes. Cloud transactional locking prevents two sales executives from placing a hold on the same apartment or commercial unit at the same time."],
      ["How does the platform handle channel partner broker commissions?", "The system tracks originating broker tags throughout the deal life cycle and triggers commission calculation when milestone payments clear."],
      ["Can buyer demand notices be customized for each construction phase?", "Yes. Demand letters generate automatically based on verified civil engineer milestone certificates."],
    ],
  },
  {
    slug: "residential-communities",
    name: "Residential Communities",
    short: "Gated societies, apartment complexes, condominiums & HOA associations",
    icon: "Home",
    problem: "Residential community management committees face endless operational friction managing visitor entry on paper registers, tracking monthly maintenance dues through spreadsheets, and addressing resident maintenance complaints across chaotic chat groups. Security guards at gates cannot verify unexpected delivery executives, unpaid resident dues stall society maintenance repairs, and accounting transparency is frequently questioned during annual general meetings.",
    solution: "DEZORYN Society Management Cloud unifies perimeter security, automated maintenance billing, resident communication, and facility helpdesks into an intuitive cloud ecosystem. Security guards check in visitors using OTP-verified tablet interfaces, residents approve guests with one tap on their smartphones, maintenance invoices generate automatically based on square footage, and complaints are resolved via auditable ticketing workflows.",
    workflow: [
      { step: "01", name: "Resident & Tenant Onboarding", action: "Digital profile creation with verified property ownership records, tenant lease agreements, vehicle RFID tags, and family member details.", outcome: "Approved resident credentials for gate security and mobile app access." },
      { step: "02", name: "Automated Maintenance Invoicing", action: "Monthly generation of society maintenance dues based on flat square footage, fixed charges, or utility meter readings.", outcome: "Instant digital invoice delivery via WhatsApp and email with payment link." },
      { step: "03", name: "Gatekeeper Visitor Check-in", action: "Security guard logs guest or delivery executive vehicle and mobile number, triggering immediate resident authorization prompt.", outcome: "Real-time resident phone notification with one-tap entry approval or denial." },
      { step: "04", name: "Helpdesk Ticket Dispatch & Repair", action: "Resident logs maintenance complaint (plumbing, electrical, elevator) with photo attachments, auto-assigned to society technician.", outcome: "Technician work order created with SLA resolution timer." },
      { step: "05", name: "Financial Reconciliation & Auditing", action: "Automated reconciliation of received payments against society bank account, vendor payout approvals, and audited financial statements.", outcome: "Real-time balance sheet and expense report accessible to committee members." }
    ],
    coreModules: [
      { title: "Gatekeeper Perimeter Security App", desc: "Tablet interface for guards to log visitors, verify delivery agent OTPs, photograph vehicles, and capture staff biometric attendance." },
      { title: "Automated Maintenance Billing & Gateway", desc: "Automated monthly invoicing engine supporting square-foot formulas, water/electricity meter charges, and online payment reconciliation." },
      { title: "Resident Mobile App (iOS & Android)", desc: "Resident self-service portal for guest approvals, digital maintenance bill payments, amenity clubhouse reservations, and community polls." },
      { title: "Facility Helpdesk & Ticketing SLA", desc: "Categorized maintenance ticket dispatch for plumbing, electrical, and common area repairs with resident resolution sign-offs." },
      { title: "Clubhouse & Amenity Reservation Desk", desc: "Interactive reservation calendar for tennis courts, banquet halls, and guest parking slots with automated deposit management." },
      { title: "Committee Financial Accounting & Ledgers", desc: "Double-entry society accounting suite with vendor voucher approvals, petty cash logs, and AGM-ready audited balance sheets." }
    ],
    products: ["society-management"],
    features: [
      ["Digital Gatekeeper Visitor Check-in", "Guard tablet app for OTP-verified guest registration, delivery executive logging, and photo capture."],
      ["Automated Maintenance Dues Invoicing", "Scheduled monthly society maintenance bills based on square footage, fixed charges, or utility meters."],
      ["Resident Helpdesk & Ticket Dispatch", "Categorized ticketing for plumbing, electrical, and facility complaints with staff assignment."],
      ["Amenity & Clubhouse Reservations", "Booking calendars for community halls, tennis courts, and guest suites with automated payment slots."],
    ],
    benefits: [
      ["Enhanced Perimeter Security", "Verified digital visitor records replace easily falsified paper gate registers."],
      ["On-Time Dues Collection", "Automated payment reminders and integrated payment links increase timely resident dues payment to 98%."],
      ["Accountable Staff Management", "Facility maintenance tickets cannot be closed without resident sign-off or resolution verification."],
      ["Unified Community Notices", "Official association announcements reach all residents immediately without informal group noise."],
    ],
    faq: [
      ["What hardware is required at the residential community gates?", "Standard Android or iOS tablets with cellular or Wi-Fi connectivity are sufficient for security guards to run the check-in interface."],
      ["How do residents receive visitor arrival notices?", "Residents receive push notifications on their smartphones with one-tap entry approval or denial."],
      ["Can the society management committee track accounts transparently?", "Yes. Complete financial ledgers, vendor payout logs, and audited balance sheets are available to committee members in real time."],
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    short: "Hospitals, diagnostic clinics, specialty centers & polyclinics",
    icon: "HeartPulse",
    problem: "Healthcare organizations grapple with fragmented hospital systems that compromise patient care and slow operational throughput. Outpatient waiting areas become chaotically overcrowded due to unmanaged queues, electronic medical records are scattered across paper charts and incompatible software, in-house pharmacies experience medicine stockouts and batch expirations, and inpatient discharge procedures take hours because billing staff must manually reconcile doctor rounds, pharmacy slips, and lab reports.",
    solution: "DEZORYN Health Cloud provides an enterprise-grade hospital and clinic management ERP engineered around clinical workflows and patient dignity. The software coordinates outpatient triage queues, equips physicians with structured electronic health records (EHR), tracks pharmacy batch inventories in real time, manages ward bed allocations, and consolidates all departmental billing into instantaneous, dispute-free insurance settlements.",
    workflow: [
      { step: "01", name: "Patient Registration & Triage Token", action: "Patient check-in at reception or self-service kiosk, recording vitals, insurance details, and generating automated queue token.", outcome: "Dynamic queue token with designated specialist waiting lounge assignment." },
      { step: "02", name: "Physician Consultation & Digital EHR", action: "Physician reviews historical medical records, logs clinical diagnosis, orders diagnostic laboratory tests, and writes electronic prescription.", outcome: "Encrypted electronic medical record updated and routed to in-house pharmacy/lab." },
      { step: "03", name: "Diagnostic Laboratory & Imaging Sync", action: "Lab samples collected with barcode tracking, processed on interfaced analyzers, and results automatically pushed to patient EHR.", outcome: "Automated clinician notification when diagnostic test results are ready." },
      { step: "04", name: "Inpatient Bed Allocation & Nursing Chart", action: "Emergency or planned admissions assigned to available wards, ICU beds, or private rooms with digital medication administration charts.", outcome: "Real-time bed occupancy update and continuous nursing schedule." },
      { step: "05", name: "Consolidated Billing & Discharge", action: "Automated aggregation of pharmacy bills, room tariffs, physician consultation fees, and lab charges into a single final settlement.", outcome: "Instant insurance claim submission, itemized bill generation, and discharge summary." }
    ],
    coreModules: [
      { title: "Outpatient Queue & Triage Management", desc: "Digital token system routing patients efficiently across specialist consultation suites, minimizing waiting room crowding." },
      { title: "Electronic Health Records (EHR) Suite", desc: "Physician interface for clinical documentation, ICD-10 diagnosis coding, electronic prescription writing, and longitudinal patient histories." },
      { title: "In-House Pharmacy & Batch Inventory", desc: "Real-time prescription fulfillment with automated batch tracking, drug expiry alerts, and reorder point notifications." },
      { title: "Inpatient Bed & Ward Operations", desc: "Visual ward matrices tracking available, occupied, and sanitized beds across ICU, HDU, general, and deluxe rooms." },
      { title: "Laboratory Information System (LIS)", desc: "Barcode-driven specimen tracking, analyzer machine integration, and automated patient test report publication." },
      { title: "Medical Insurance & Claims Reconciliation", desc: "Third-Party Administrator (TPA) and health insurance desk supporting pre-authorization requests and digital claim reconciliation." }
    ],
    products: ["dezo-care"],
    features: [
      ["Outpatient Queue & Triage Routing", "Digital check-in tokens directing patients to specialty clinic waiting lounges with estimated consultation countdowns."],
      ["Electronic Health Records (EHR)", "Secure physician interface for medical history, clinical diagnoses, and electronic prescription orders with drug interaction checks."],
      ["In-House Pharmacy Batch Stock", "Live prescription order fulfillment with automated batch, expiry, and reorder tracking."],
      ["Inpatient Ward & Bed Occupancy", "Visual bed allocation matrix for emergency admissions, ICU transitions, and discharge clearances."],
    ],
    benefits: [
      ["Reduced Waiting Room Crowding", "Tokenized OPD queues streamline patient progression through triage and specialist consultations by 40%."],
      ["Prescription Dispensing Accuracy", "Direct digital prescription transmission eliminates handwriting deciphering errors at the pharmacy."],
      ["Protected Patient Privacy", "Role-based security ensures administrative clerks cannot access sensitive clinical medical notes."],
      ["Rapid Discharge Clearance", "Consolidated billing reconciles pharmacy, nursing, bed, and doctor charges for swift discharge within minutes."],
    ],
    faq: [
      ["Does Dezo Care comply with healthcare data privacy benchmarks?", "Yes. The platform enforces strict role-based access control, encrypted patient records, and comprehensive audit logs conforming to HL7/FHIR guidelines."],
      ["Can the system connect with diagnostic laboratory machines?", "Yes. Standard lab equipment interfaces allow diagnostic test results to populate directly into patient health files."],
      ["Can visiting consulting doctors access patient files securely?", "Yes. Doctors receive encrypted credentials granting access only to patients scheduled for their specific consultation session."],
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "Factories, assembly plants, discrete production & industrial workshops",
    icon: "Factory",
    problem: "Manufacturing plants encounter costly production bottlenecks caused by disconnected inventory systems and unpredicted equipment downtime. Production managers lack visibility into raw material stock levels, leading to assembly line starvation midway through batch production runs. Meanwhile, machine maintenance is conducted reactively after catastrophic breakdowns, factory shift rosters suffer from unverified absenteeism, and product traceability fails regulatory quality audits.",
    solution: "DEZORYN Manufacturing Cloud provides an integrated operational execution suite uniting multi-level Bill of Materials (BOM), raw material procurement, preventive machine maintenance, and plant floor workforce scheduling. The software monitors production stage-gates in real time, automatically deducts raw inventory during production batches, tracks machine operational hours for preventive servicing, and enforces strict quality compliance.",
    workflow: [
      { step: "01", name: "Procurement & Raw Material Inwarding", action: "Generation of supplier purchase orders, delivery arrival checks at the loading dock, and Goods Received Note (GRN) quality sampling.", outcome: "Barcoded raw materials tagged and added to warehouse inventory ledger." },
      { step: "02", name: "Work Order & Multi-Level BOM Allocation", action: "Creation of production batch work orders, automated calculation of required components from BOM, and stock reservations.", outcome: "Production batch released to factory floor with assembly instructions." },
      { step: "03", name: "Shop Floor Batch Execution", action: "Assembly line workers execute operations against work orders, recording machine runtimes, cycle counts, and labor hours.", outcome: "Real-time production tracking with automated raw material stock deductions." },
      { step: "04", name: "Stage-Gate Quality Inspection", action: "Quality control technicians perform dimensional and tolerance testing against defined specifications with pass/fail defect logging.", outcome: "Certified finished goods marked ready for warehouse packaging." },
      { step: "05", name: "Preventive Maintenance & Servicing", action: "System tracks machine runtime hours and cycle counts, automatically generating maintenance work orders for machine technicians.", outcome: "Equipment inspected, lubricated, and calibrated before unplanned breakdown occurs." }
    ],
    coreModules: [
      { title: "Bill of Materials (BOM) & Work Orders", desc: "Multi-level assembly hierarchies tracking sub-assemblies, raw component ratios, scrap allowances, and standard cycle times." },
      { title: "Plant Floor Inventory & Warehouse Ledger", desc: "Bin-location raw material inventory tracking with real-time automated deduction upon production work order release." },
      { title: "Preventive Machinery Maintenance (CMMS)", desc: "Runtime and calendar-based equipment servicing schedules with downtime incident logging and spare parts inventory tracking." },
      { title: "Quality Control & Stage-Gate Inspection", desc: "Digital inspection checklists, non-conformance defect reports, and statistical process control (SPC) compliance certificates." },
      { title: "Shift Workforce Rostering & Biometrics", desc: "Automated shift rotation planning, certified operator skill mapping, and plant floor turnstile biometric attendance sync." },
      { title: "Batch & Serial Traceability Engine", desc: "End-to-end genealogical audit trail linking raw material supplier lot numbers to final shipped finished product serials." }
    ],
    products: ["hrms"],
    features: [
      ["Plant Floor Operations & BOM", "Multi-level Bill of Materials (BOM) tracking with automated deduction during production runs."],
      ["Preventive Machine Maintenance", "Usage-based equipment maintenance schedules with downtime logging and part replacement alerts."],
      ["Plant Shift Workforce Rosters", "Shift rotation planning, biometric machine sync, and plant floor attendance monitoring."],
      ["Quality Inspection Workflows", "Stage-gate quality checkpoints during batch production with pass/fail defect logging."],
    ],
    benefits: [
      ["Minimized Production Downtime", "Scheduled maintenance prevents unexpected machinery breakdown, reducing downtime by over 45%."],
      ["Accurate Resource Forecasting", "Bill of Materials deductions ensure raw materials are reordered before assembly lines starve."],
      ["Full Batch Traceability", "Complete historical logs link raw material batches to finished serial numbers for regulatory audits."],
      ["Optimized Shift Utilization", "Real-time workforce tracking ensures assembly lines maintain adequate certified personnel."],
    ],
    faq: [
      ["How does DEZORYN integrate with plant floor scales and barcode scanners?", "The platform connects with standard USB and Bluetooth barcode scanners and weighing scales via industrial serial or network protocols."],
      ["Can the software manage multiple factory locations?", "Yes. Centralized multi-plant inventory views allow management to monitor stock and production across multiple regional facilities."],
      ["Does the system generate compliance documentation for quality audits?", "Yes. Batch production records, inspection sign-offs, and calibration logs can be exported in audit-ready PDF formats."],
    ],
  },
  {
    slug: "retail",
    name: "Retail",
    short: "Multi-outlet retail chains, supermarkets, D2C brands & franchise stores",
    icon: "ShoppingBag",
    problem: "Retail chains face stock inaccuracies and high customer churn when store checkouts, warehouse inventories, and marketing systems operate in silos. Store managers cannot see inventory in nearby branches to satisfy customer requests, checkout terminals lag during holiday rush periods, customer loyalty points are lost across visits, and promotional campaigns fail because marketing messages cannot be triggered from actual purchasing behavior.",
    solution: "DEZORYN Retail Cloud unifies rapid Point-of-Sale (POS) terminals, centralized multi-store inventory synchronization, and automated WhatsApp customer engagement into a modern retail platform. Cashiers scan and bill items in under five seconds, stock movements update instantaneously across all store locations, and customers receive digital receipts and personalized promotional offers directly on WhatsApp.",
    workflow: [
      { step: "01", name: "Supplier Purchase Order & Stock Inwarding", action: "Centralized purchasing desk creates supplier POs, with warehouse loading bays verifying quantities against Goods Received Notes (GRN).", outcome: "Automated barcode generation and inventory update across central warehouse." },
      { step: "02", name: "Inter-Store Stock Allocation", action: "Automated distribution algorithms route fast-moving inventory to retail stores based on historical sales velocity and local demand.", outcome: "Optimized retail shelf availability with minimized holding costs." },
      { step: "03", name: "High-Speed Point of Sale (POS) Checkout", action: "Store cashier scans barcoded items, applies automatic promotional discounts, and accepts cash, card, or UPI payments.", outcome: "Sub-5-second checkout with instant digital invoice sent to customer WhatsApp." },
      { step: "04", name: "Loyalty Ledger & Customer Profiling", action: "System registers customer phone number, credits loyalty reward points, and tracks repeat category preferences.", outcome: "Updated customer profile triggering personalized automated re-engagement." },
      { step: "05", name: "Omnichannel Analytics & Restock Triggers", action: "Sales telemetry aggregates centrally, automatically generating supplier reorder alerts as store inventory hits defined safety thresholds.", outcome: "Zero stockout surprises and continuous sales turnover." }
    ],
    coreModules: [
      { title: "Rapid Cloud Point of Sale (POS)", desc: "Offline-resilient checkout terminal supporting barcode scanners, weighing scales, split tender payments, and instant digital billing." },
      { title: "Centralized Multi-Outlet Inventory", desc: "Real-time stock ledger synchronizing purchases, customer returns, and inter-branch transfers across all retail outlets." },
      { title: "WhatsApp Customer Engagement Suite", desc: "Automated delivery of purchase bills, loyalty point updates, abandoned cart alerts, and seasonal promotional campaigns on WhatsApp." },
      { title: "Supplier Procurement & GRN Auditing", desc: "Purchase order generation with automated Goods Received Note variance verification against vendor invoices." },
      { title: "Dynamic Promotion & Discount Rules", desc: "Centralized discount engine allowing marketing teams to launch buy-one-get-one, bundle, and category deals across all stores instantly." },
      { title: "Executive Retail Performance Dashboards", desc: "Live sales telemetry tracking hourly store turnover, gross profit margins, cashier performance, and fast-moving SKU velocity." }
    ],
    products: ["super-whatsapp"],
    features: [
      ["Multi-Store Inventory Synchronization", "Centralized stock ledger reflecting sales, returns, and inter-store transfers in real time."],
      ["Rapid Point of Sale (POS)", "Barcode-driven checkout terminal supporting multiple tender modes, discounts, and digital receipts."],
      ["Customer Loyalty & Purchase History", "Customer phone number lookup with automated purchase points and personalized return verification."],
      ["Supplier Purchase Orders & GRN", "Purchase order generation with Goods Received Note (GRN) variance checks against vendor invoices."],
    ],
    benefits: [
      ["Elimination of Stockouts", "Store managers see nearby outlet stock availability to fulfill customer requests or initiate transfers."],
      ["Fast Checkout Speeds", "Optimized POS terminal processes customer items in seconds with minimal cashier training."],
      ["Controlled Vendor Reconciliations", "GRN verification ensures stores only pay for verified goods received at loading bays."],
      ["Omnichannel Data Visibility", "Unified inventory tracking bridges physical brick-and-mortar stores with online e-commerce channels."],
    ],
    faq: [
      ["Can the retail POS operate if internet connection temporarily drops?", "Yes. The POS terminal caches transaction logs locally and synchronizes automatically as soon as internet connectivity resumes."],
      ["How are promotional discounts and seasonal sales configured?", "Store administrators configure global or category-specific discount rules centrally, which update across all checkout terminals instantly."],
      ["Can customers return items at a different store location?", "Yes. Cloud transaction lookup allows customer receipts to be verified and returned at any participating retail branch."],
    ],
  },
  {
    slug: "finance",
    name: "Finance",
    short: "NBFCs, fintech platforms, wealth managers & corporate accounting firms",
    icon: "Landmark",
    problem: "Financial institutions and corporate accounting teams face significant audit risks and reporting delays when general ledgers, client onboarding, and compliance records live in disparate legacy systems. Manual bank statement reconciliation consumes weeks of accountant time each month, transaction approval hierarchies lack tamper-evident digital sign-offs, and reporting to regulators requires labor-intensive data extraction prone to mathematical errors.",
    solution: "DEZORYN Finance Cloud delivers a modern double-entry general ledger, automated bank reconciliation engine, and role-based financial approval platform built for enterprise audit rigor. The software enforces strict GAAP/IFRS balance integrity, matches incoming statements against receivables automatically, maintains immutable audit trails of every ledger adjustment, and produces instant executive balance sheets.",
    workflow: [
      { step: "01", name: "Entity & Chart of Accounts Setup", action: "Configuration of multi-tier chart of accounts, cost centers, multi-currency exchange parameters, and departmental budgets.", outcome: "Standardized financial structure ready for transactional posting." },
      { step: "02", name: "Transaction Posting & Maker-Checker Gate", action: "Accountants prepare journal entries or vendor vouchers; transactions exceeding authorization thresholds route to controllers.", outcome: "Dual-approved transaction committed to double-entry general ledger." },
      { step: "03", name: "Automated Bank Statement Reconciliation", action: "Bank statement feeds parsed automatically, matching deposits and withdrawals against outstanding invoices and payment records.", outcome: "Over 85% of transactions reconciled automatically with exception flags." },
      { step: "04", name: "Continuous Compliance & SIEM Logging", action: "System records every transaction mutation, approval, user IP address, and timestamp into append-only cryptographic audit logs.", outcome: "100% audit-ready historical compliance record for external auditors." },
      { step: "05", name: "Financial Statement Generation & P&L", action: "Instant aggregation of balance sheet, profit and loss statement, cash flow forecasting, and regulatory tax liability summaries.", outcome: "Month-end book closing completed in 2 days instead of 3 weeks." }
    ],
    coreModules: [
      { title: "Double-Entry General Ledger Engine", desc: "Enterprise ledger architecture supporting multi-tier account hierarchies, multi-currency revaluations, and strict debit-credit balance verification." },
      { title: "Automated Bank Reconciliation Desk", desc: "Rule-based statement parser matching clearing house feeds against accounts receivable and payable with automatic discrepancy identification." },
      { title: "Maker-Checker Approval Workflows", desc: "Configurable financial authority matrices requiring independent supervisory sign-off before funds disbursement." },
      { title: "Accounts Payable (AP) & Vendor Invoicing", desc: "Automated OCR extraction on vendor PDF bills, purchase order matching, tax deduction computation, and payment scheduling." },
      { title: "Accounts Receivable (AR) & Aging Reports", desc: "Real-time tracking of customer balances, automated payment reminder triggers, and bad-debt aging analytics." },
      { title: "Tax Compliance & Regulatory Filing Suite", desc: "Automated generation of GST, VAT, and corporate withholding tax summaries ready for export into regulatory tax portals." }
    ],
    products: ["legal-docs"],
    features: [
      ["Double-Entry General Ledgers", "Automated journal entries with strict balance enforcement, multi-currency support, and account charts."],
      ["Bank & Invoicing Reconciliation", "Automated statement matching against accounts receivable and accounts payable ledgers."],
      ["Granular Audit Logging", "Immutable historical logs recording transaction creation, approval, modification, and user IPs."],
      ["Executive Financial Dashboards", "Real-time balance sheet, P&L, cash flow, and tax liability summaries."],
    ],
    benefits: [
      ["Audit-Ready Financial Integrity", "System enforces GAAP and IFRS compliant double-entry principles with zero unaccounted balances."],
      ["Accelerated Month-End Close", "Automated reconciliation rules shorten monthly book closing from weeks to a few business days."],
      ["Fraud & Error Prevention", "Dual-approval workflows ensure large outgoing transactions cannot be disbursed by a single user."],
      ["Strategic Capital Visibility", "Leadership monitors current liquidity, outstanding receivables, and projected operational expenses."],
    ],
    faq: [
      ["How does DEZORYN integrate with corporate finance and accounting ledgers?", "DEZORYN platforms provide automated transaction ledgering, audit logging, and bidirectional webhooks to sync directly with ERPs and enterprise accounting systems."],
      ["How are user permissions restricted within the accounting software?", "Fine-grained permissions separate bill preparation from payment authorization, ensuring strict internal financial controls."],
      ["Can tax reports be exported directly for regulatory filing?", "Yes. GST, VAT, and withholding tax summary reports export directly to standard spreadsheet and PDF formats."],
    ],
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    short: "Boutique hotels, luxury resorts, serviced apartments & restaurant dining groups",
    icon: "ConciergeBell",
    problem: "Hospitality properties lose revenue and guest goodwill when front desk check-in desks, housekeeping teams, and restaurant dining POS systems fail to communicate in real time. Front desks face long guest check-in queues because room cleaning status is conveyed via walkie-talkies, dining and mini-bar charges fail to post to the guest's central room folio before checkout, and facility maintenance defects remain unresolved until an unhappy guest complains.",
    solution: "DEZORYN Hospitality Cloud unifies front desk guest reservations, housekeeping mobile turnover matrices, restaurant table POS, and facility maintenance dispatch into an integrated property management system. Front desk clerks check in guests in under two minutes, housekeepers mark rooms clean on mobile tablets to immediately free inventory, and all dining, spa, and amenity charges post directly to the guest's folio.",
    workflow: [
      { step: "01", name: "Guest Reservation & Digital Pre-Arrival", action: "Captures bookings from direct web engines and OTAs, automatically sending digital pre-check-in registration forms via WhatsApp.", outcome: "Guest profile created with ID documentation and room preferences pre-loaded." },
      { step: "02", name: "Rapid Front Desk Arrival & Keycard Issuance", action: "Streamlined arrival check-in, keycard encoding, credit authorization hold, and baggage concierge dispatch.", outcome: "Check-in completed in under 90 seconds with welcome notification." },
      { step: "03", name: "Dining & Amenity Folio Posting", action: "Restaurant, bar, and spa POS terminals verify guest occupancy and post dining orders directly to the central room folio.", outcome: "Consolidated billing with zero misplaced receipts or uncollected charges." },
      { step: "04", name: "Mobile Housekeeping Room Turnover", action: "Housekeepers view departure rooms on mobile tablets, marking rooms clean and inspected in real time.", outcome: "Instant inventory liberation for arriving guests without walkie-talkie delays." },
      { step: "05", name: "Express Checkout & Automated Invoicing", action: "Review of consolidated folio, automated payment settlement, keycard return, and digital invoice delivery via WhatsApp.", outcome: "Frictionless guest checkout with automated review invitation." }
    ],
    coreModules: [
      { title: "Front Desk Reservation & Room Inventory", desc: "Interactive room availability calendar with rate plan management, instant check-in/checkout, and OTA channel manager synchronization." },
      { title: "Housekeeping Mobile Turnover Suite", desc: "Real-time room status matrix (Clean, Dirty, Inspected, Out of Order) managed by room attendants on mobile devices." },
      { title: "Restaurant & Bar Dining POS", desc: "Table layout ordering terminal with Kitchen Display System (KDS) integration and seamless direct-to-room folio charging." },
      { title: "Guest Concierge & Maintenance Dispatch", desc: "Centralized logging and dispatch for extra towels, luggage pickup, airport transfers, and room repair requests." },
      { title: "Consolidated Guest Folio & Invoicing", desc: "Unified ledger aggregating room charges, dining bills, spa appointments, and local taxes into itemized customer folios." },
      { title: "Guest Loyalty & Preference Memory", desc: "Historical tracking of room type preferences, dietary restrictions, and anniversary milestones for personalized VIP service." }
    ],
    products: [],
    features: [
      ["Front Desk Reservation Calendar", "Room inventory matrix with instant check-in, folio billing, and keycard/ID documentation."],
      ["Housekeeping Room Turnover Matrix", "Real-time room status updates (Clean, Inspected, Dirty, Out of Order) managed on mobile."],
      ["Restaurant & Bar Dining POS", "Table ordering terminal with kitchen display system (KDS) routing and guest room folio charging."],
      ["Guest Service & Maintenance Dispatch", "Centralized logging for guest luggage, extra amenities, and room maintenance requests."],
    ],
    benefits: [
      ["Faster Guest Check-in Experience", "Streamlined front desk workflows minimize check-in queues during peak arrival hours by 50%."],
      ["Immediate Room Turnover", "Housekeeping marks rooms clean on mobile tablets, freeing inventory in under 15 minutes."],
      ["Consolidated Guest Folios", "Dining, spa, and mini-bar charges post directly to the guest's room bill, eliminating missed revenue."],
      ["Enhanced Property Maintenance", "Facility issues are logged and resolved before they impact guest satisfaction."],
    ],
    faq: [
      ["Can restaurant dining bills be charged directly to a guest's hotel room?", "Yes. The dining POS verifies active room occupancy and posts food and beverage orders directly to the guest's central room folio."],
      ["How does the housekeeping staff receive room turnover assignments?", "Housekeepers use a responsive mobile interface showing priority departures, checkout status, and special guest requests."],
      ["Can the platform handle multi-property hotel chains?", "Yes. Enterprise accounts manage multiple hotel properties with centralized guest profiles and brand reporting."],
    ],
  },
  {
    slug: "logistics",
    name: "Logistics",
    short: "Freight carriers, 3PL logistics, line-haul dispatch & distribution warehouses",
    icon: "Truck",
    problem: "Logistics carriers and freight forwarders struggle with fragmented dispatch systems and lack of real-time shipment visibility. Consignment manifests are compiled manually on paper, delivery drivers lack offline electronic proof of delivery tools, vehicle maintenance is delayed until on-road breakdowns occur, and freight invoicing takes weeks because customer proof-of-delivery documents must be physically returned and reconciled at terminal depots.",
    solution: "DEZORYN Logistics Cloud provides an integrated transport management suite coordinating digital consignment manifests, automated vehicle route sequencing, mobile electronic Proof of Delivery (e-POD), and automated freight billing. Shippers and dispatchers track live shipment statuses, drivers capture digital signatures and photo timestamps offline, and invoices generate automatically upon successful delivery.",
    workflow: [
      { step: "01", name: "Booking & Consignment Ingestion", action: "Captures freight booking orders from shippers with weight, volume, pallet dimensions, and pickup/delivery addresses.", outcome: "Generated barcoded shipping label and consignment tracking number." },
      { step: "02", name: "Manifest Consolidation & Vehicle Dispatch", action: "Optimizes vehicle load capacity, consolidates line-haul manifests, and assigns vetted drivers based on availability.", outcome: "Digital trip manifest issued to driver mobile application." },
      { step: "03", name: "Line-Haul Transit & Terminal Updates", action: "Consignment scanned at regional transshipment hubs, updating tracking timestamps and notifying recipient of estimated arrival.", outcome: "Sub-10ms consignment telemetry accessible to shippers online." },
      { step: "04", name: "Last-Mile Delivery & Mobile e-POD", action: "Driver arrives at destination, recipient signs electronically on mobile screen, and driver photographs delivered cargo.", outcome: "Digital Proof of Delivery uploaded with geo-stamp and recipient name." },
      { step: "05", name: "Automated Freight Invoicing", action: "System reconciles delivered weight against contracted freight rate card, generating client invoice immediately upon e-POD upload.", outcome: "Freight bill generated same-day, accelerating carrier working capital." }
    ],
    coreModules: [
      { title: "Transport Management & Trip Manifests", desc: "Consolidated freight planning engine optimizing vehicle volumetric capacity, route stops, and driver trip assignments." },
      { title: "Mobile Electronic Proof of Delivery (e-POD)", desc: "Offline-resilient driver mobile application capturing recipient signatures, cargo photos, and GPS timestamps." },
      { title: "Fleet Telematics & Preventive Maintenance", desc: "Vehicle odometer tracking, preventive servicing schedules, tire rotation alerts, and fuel consumption analytics." },
      { title: "Dynamic Freight Rate & Billing Engine", desc: "Configurable freight rate matrices calculating charges by weight break, volumetric cubic meters, zone distance, and fuel surcharges." },
      { title: "Warehouse Cross-Dock & Terminal Tracking", desc: "Barcode-driven transit hub management tracking container loading, cross-dock transfers, and package consolidation." },
      { title: "Customer Self-Service Tracking Portal", desc: "Public and authenticated tracking interfaces allowing shippers to inspect delivery milestones without calling dispatch offices." }
    ],
    products: [],
    features: [
      ["Dispatch & Trip Manifest Management", "Consolidated delivery manifests, driver assignment, vehicle capacity checks, and route sequencing."],
      ["Digital Proof of Delivery (e-POD)", "Mobile delivery confirmation with electronic signature, recipient photo, and GPS timestamp."],
      ["Fleet Maintenance & Fuel Logs", "Preventive vehicle servicing schedules, insurance renewal alerts, and fuel receipt tracking."],
      ["Freight Billing & Customer Invoicing", "Automated freight rate calculation based on weight, volume, distance, or accessorial charges."],
    ],
    benefits: [
      ["Real-Time Consignment Visibility", "Shippers and recipients track shipment status at each transfer terminal and final mile."],
      ["Zero Dispute Delivery Handover", "Electronic Proof of Delivery captures recipient signatures and condition photos immediately."],
      ["Controlled Fleet Operating Costs", "Regular preventive maintenance reminders reduce on-road breakdowns and excessive fuel burn."],
      ["Faster Freight Billing Cycles", "Invoices generate automatically upon digital POD upload, speeding up carrier cash flow to same-day."],
    ],
    faq: [
      ["Does the delivery driver mobile app work in remote areas with poor network coverage?", "Yes. Drivers can record signatures and capture delivery photos offline; data syncs automatically once network reception returns."],
      ["Can customers track their consignment status online?", "Yes. Customers receive tracking links allowing them to view consignment milestones without calling dispatch desks."],
      ["How does the system calculate complex freight rate cards?", "Rate cards can be configured by zone, weight breaks, minimum charges, and optional surcharges like fuel or tailgate access."],
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    short: "Consulting firms, software agencies, legal practices & corporate advisors",
    icon: "Briefcase",
    problem: "Professional service firms and digital agencies suffer from margin erosion when billable hours, project milestones, and client invoicing operate in disconnected tools. Consultants forget to log hours or log them inaccurately on personal spreadsheets, project managers miss scope creep until contracted retainers are exhausted, and finance teams spend days auditing timesheets before manually drafting client invoices.",
    solution: "DEZORYN Professional Services Cloud combines CRM pipeline management, agile client project boards, timesheet logging with billable rate cards, and automated milestone invoicing into a unified professional services automation (PSA) system. Project managers monitor real-time budget burn, consultants log hours against approved tasks, and client invoices generate automatically with itemized timesheet backing.",
    workflow: [
      { step: "01", name: "Proposal & Engagement Scoping", action: "Sales team drafts client proposal with agreed project deliverables, milestone budgets, consultant hourly rate cards, and payment terms.", outcome: "Signed engagement contract with client project workspace auto-created." },
      { step: "02", name: "Project Team & Resource Allocation", action: "Project managers assign consultants, architects, and designers to specific milestones based on skill sets and availability.", outcome: "Clear sprint task boards with deadline and budget hour allocations." },
      { step: "03", name: "Daily Timesheet & Expense Logging", action: "Consultants log billable and non-billable hours against specific task deliverables, attaching receipts for reimbursable expenses.", outcome: "Time entries submitted to practice leads for weekly review and sign-off." },
      { step: "04", name: "Milestone Review & Deliverable Sign-Off", action: "Completed deliverables shared with clients via secure shared client portal for formal review and digital acceptance.", outcome: "Client milestone sign-off recorded with tamper-evident audit log." },
      { step: "05", name: "Automated Milestone Invoicing", action: "System generates professional client invoices populated with approved milestone amounts or itemized timesheet hours.", outcome: "Instant invoice dispatch to client accounts payable with payment links." }
    ],
    coreModules: [
      { title: "Client Project Boards & Sprints", desc: "Kanban and Gantt task management with milestone dependencies, deliverable tracking, and budget burn telemetry." },
      { title: "Consultant Timesheet & Expense Suite", desc: "Daily hours logging by project with billable rate card mapping, manager approval workflows, and receipt attachment." },
      { title: "Retainer & Progress Billing Engine", desc: "Automated monthly retainer invoicing, milestone-based progress billing, and time-and-materials calculation." },
      { title: "Client Portal & Deliverable Sign-Off", desc: "Restricted client view allowing stakeholders to review progress, download deliverables, and provide formal digital sign-off." },
      { title: "Practice Utilization & Profitability Analytics", desc: "Real-time metrics tracking consultant billable utilization, project gross margins, and realization rate percentiles." },
      { title: "Document Vault & NDA Compliance", desc: "Encrypted document storage with role-based client partitioning, version histories, and confidentiality flags." }
    ],
    products: ["crm"],
    features: [
      ["Client Project Boards & Milestones", "Agile task boards with deliverables, milestones, dependency tracking, and deadline alerts."],
      ["Consultant Time & Expense Tracking", "Timesheet logging by project, billable rate cards, and client-reimbursable expense attachments."],
      ["Retainer & Fixed-Price Billing", "Automated monthly retainer invoicing and milestone-based progress billing."],
      ["Centralized Client Document Vault", "Secure shared file storage with version control, client sign-offs, and NDA access flags."],
    ],
    benefits: [
      ["Accurate Project Profitability", "Real-time visibility into consultant hours logged against contracted budgets prevents scope creep and protects margins by 18%."],
      ["Effortless Timesheet Audits", "Consultants log hours against assigned tasks with clear manager review and approval workflows."],
      ["On-Time Invoicing", "Generate professional invoices directly from approved timesheets and milestone completions instantly."],
      ["Protected Client Confidentiality", "Role-based permissions ensure consultants only access documents for their active client engagements."],
    ],
    faq: [
      ["Can clients be granted portal access to review project deliverables?", "Yes. Clients can be provided restricted view access to designated task boards, deliverables, and sign-off requests."],
      ["How are billable vs non-billable hours differentiated?", "Timesheet entries include billable flags and configurable hourly rate cards mapped to individual consultant seniority levels."],
      ["Can the platform integrate with existing corporate accounting software?", "Yes. Timesheet and invoicing data export cleanly via RESTful APIs and standard financial file formats."],
    ],
  },
];
const INDUSTRY_ALIASES = {
  "retail-wholesale": "retail",
  "manufacturing-logistics": "manufacturing",
  "banking-fintech": "finance",
  "financial-services": "finance",
  "hospitality-travel": "hospitality",
  "media-publishing": "professional-services",
  residential: "residential-communities",
  realestate: "real-estate",
  "health-care": "healthcare",
  "logistics-supply-chain": "logistics",
};
export const getIndustry = (slug) => {
  const target = INDUSTRY_ALIASES[slug] || slug;
  return industries.find((i) => i.slug === target);
};

/* ───────────── Projects / case studies ───────────── */
export const projects = [
  { slug: "schooly-core-campus", name: "Schooly Core Campus ERP", industry: "Education", type: "SaaS", tech: ["Next.js", "Node.js", "Cloud Architecture"], result: "Automated student records, fee collection, and academic scheduling across multi-branch campuses.", hue: 160, product: "schooly-core", image: "/products/schooly-core.jpg" },
  { slug: "dezo-care-hospital", name: "Dezo Care Hospital Operations ERP", industry: "Healthcare", type: "Enterprise", tech: ["Cloud", "HL7/FHIR", "PostgreSQL"], result: "Digitized inpatient admissions, clinical departments, billing, and lab report handoffs.", hue: 350, product: "dezo-care", image: "/products/dezo-care.jpg" },
  { slug: "real-estate-dev", name: "Real Estate Property Platform", industry: "Real Estate", type: "Web", tech: ["Next.js", "PostgreSQL", "Cloud"], result: "Streamlined inventory availability, site visit coordination, and digital unit bookings.", hue: 210, product: "real-estate", image: "/products/real-estate.jpg" },
  { slug: "society-management-community", name: "Society Management Community Platform", industry: "Residential Communities", type: "SaaS", tech: ["Next.js", "Node.js", "PostgreSQL"], result: "Unified resident communications, automated maintenance dues, and digital community notices.", hue: 215, product: "society-management", image: "/products/society-management.jpg" },
  { slug: "hrms-enterprise", name: "HRMS Enterprise Workforce Platform", industry: "HR", type: "Mobile", tech: ["React Native", "Node.js", "PostgreSQL"], result: "Automated monthly payroll runs, leave approvals, and biometric attendance records.", hue: 190, product: "hrms", image: "/products/hrms.jpg" },
  { slug: "crm-pipeline", name: "CRM Pipeline & Customer Suite", industry: "CRM", type: "Automation", tech: ["Workflows", "APIs", "AI Intelligence"], result: "Centralized lead routing, deal pipeline tracking, and automated multi-touch outreach.", hue: 262, product: "crm", image: "/products/crm.jpg" },
  { slug: "super-whatsapp-scale", name: "Super Whatsapp Marketing Platform", industry: "Retail", type: "Automation", tech: ["Meta API", "Node.js", "Redis Queue"], result: "High-throughput messaging workflows with automated transactional customer notification triggers.", hue: 200, product: "super-whatsapp", image: "/products/super-whatsapp.jpg" },
  { slug: "school-master-erp", name: "School Master ERP", industry: "Education", type: "SaaS", tech: ["Next.js", "PostgreSQL", "Cloud"], result: "Automated student onboarding, attendance rosters, and end-of-term grade reporting.", hue: 210, product: "school-master", image: "/products/school-master.jpg" },
  { slug: "coaching-master-academy", name: "Coaching Master Test Prep Engine", industry: "Education", type: "SaaS", tech: ["Next.js", "TypeScript", "Node.js"], result: "Organized study batches, automated practice exam scoring, and student progress tracking.", hue: 190, product: "coaching-master", image: "/products/coaching-master.jpg" },
  { slug: "college-master-campus", name: "College Master Multi-Faculty ERP", industry: "Education", type: "Enterprise", tech: ["Next.js", "PostgreSQL", "AWS Cloud"], result: "Unified university departments, semester enrollment workflows, and faculty grading rosters.", hue: 220, product: "college-master", image: "/products/college-master.jpg" },
  { slug: "legal-docs-automation", name: "Legal Docs Contract Intelligence", industry: "Finance", type: "AI", tech: ["NLP AI", "ESIGN", "Cloud Vault"], result: "Structured contract generation, clause libraries, audit trails, and secure e-signing.", hue: 230, product: "legal-docs", image: "/products/legal-docs.jpg" },
];
export const PROJECT_FILTERS = ["All", "SaaS", "Web", "Mobile", "AI", "Enterprise", "Automation"];


/* ───────────── Homepage content ───────────── */
export const stats = [
  // REPLACE with real company data (SRS §8). No fake statistics in production.
  { value: 10, suffix: "+", label: "Digital Products" },
  { value: 200, suffix: "+", label: "Projects Delivered" },
  { value: 500, suffix: "+", label: "Businesses Served" },
  { value: 25, suffix: "+", label: "Industries" },
  { text: "Global", label: "Technology Vision" },
];

export const whatWeBuild = [
  { icon: "Cloud", title: "SaaS Platforms", text: "Subscription-based software products.", href: "/marketplace" },
  { icon: "Building2", title: "Enterprise Software", text: "Custom business management platforms.", href: "/solutions/enterprise" },
  { icon: "Sparkles", title: "AI & Automation", text: "Intelligent workflows and automation.", href: "/solutions/ai" },
  { icon: "Smartphone", title: "Mobile Applications", text: "iOS and Android applications.", href: "/solutions/mobile" },
  { icon: "Globe2", title: "Web Platforms", text: "High-performance digital platforms.", href: "/solutions/custom-software" },
  { icon: "Layers", title: "Digital Transformation", text: "Complete technology transformation.", href: "/solutions/digital-transformation" },
];
export const whatWeBuildExtra = {
  "SaaS Platforms": "Multi-tenant, subscription-ready products with trials, billing and onboarding built in.",
  "Enterprise Software": "Role-based, auditable systems designed around how your organization works.",
  "AI & Automation": "Assistants, analytics and workflow automation embedded in daily operations.",
  "Mobile Applications": "Native-feeling iOS and Android apps connected to your platform.",
  "Web Platforms": "Fast, accessible, SEO-ready sites and portals that scale.",
  "Digital Transformation": "Strategy, migration and rollout to move legacy operations online.",
};

export const enterpriseSections = [
  ["Enterprise Architecture", "Modular, API-first systems designed for long-term growth."],
  ["Multi-Tenant Systems", "Companies, workspaces and roles separated by design."],
  ["API Integrations", "Connect ERP, payments, identity and internal tools."],
  ["Security", "Encryption, audit logs and least-privilege access."],
  ["Automation", "Replace repetitive manual steps with workflows."],
  ["Analytics", "Dashboards that turn operations into decisions."],
  ["Cloud Infrastructure", "Scalable deployment with monitoring and backups."],
  ["Custom Workflows", "Approvals and processes shaped to your teams."],
  ["Role-Based Access", "Fine-grained permissions for every user group."],
];
export const aiCapabilities = [
  ["AI Assistants", "Answer questions and complete tasks inside your products."],
  ["AI Analytics", "Surface trends and anomalies without writing queries."],
  ["AI Automation", "Trigger actions from intent, not just rules."],
  ["Predictive Intelligence", "Forecast demand, churn and maintenance needs."],
  ["Document Intelligence", "Extract and classify data from documents."],
  ["Workflow Automation", "Connect steps across teams and systems."],
];

export const posts = [
  {
    slug: "choosing-saas-for-your-business",
    title: "How to choose SaaS software for your business",
    cat: "Guides",
    date: "October 2026",
    read: "6 min",
    author: "DEZORYN Product Strategy",
    image: "/resources/saas-architecture.jpg",
    summary: "A practical framework for evaluating multi-tenant SaaS platforms against custom software builds, total cost of ownership, and security standards.",
    takeaways: [
      "Factor in long-term maintenance, hosting DevOps, and security patching when calculating true Total Cost of Ownership (TCO).",
      "Prioritize multi-tenant architectures with cryptographic or schema-isolated data boundaries over shared legacy monoliths.",
      "Never commit to software without validating REST API completeness, webhook reliability, and automated data portability.",
      "Demand transparent USD subscription pricing with guaranteed SLA uptime commitments of at least 99.9%."
    ],
    checklist: [
      "Calculate 3-year TCO including engineering maintenance vs predictable subscription licenses",
      "Verify SOC 2 Type II or ISO 27001 data isolation benchmarks and tenant isolation models",
      "Audit OpenAPI 3.0 documentation and live sandbox access before signing vendor agreements",
      "Review automated daily backup schedules and RTO/RPO disaster recovery runbooks"
    ],
    blueprint: {
      type: "Evaluation Matrix",
      spec: "SaaS Evaluation Scorecard: Security (30%), API Extensibility (25%), Total Cost of Ownership (20%), Time-to-Deploy (15%), SLA Guarantees (10%)"
    },
    sections: [
      {
        heading: "1. Evaluate Total Cost of Ownership (TCO)",
        text: "When evaluating enterprise software, the initial license price is merely the tip of the iceberg. Custom in-house builds frequently suffer from scope creep, hiring delays, and indefinite maintenance burdens that cost 4x to 8x more than off-the-shelf multi-tenant SaaS platforms.\n\nA rigorous TCO calculation must incorporate cloud hosting infrastructure, staging environments, continuous security patching, vulnerability scanning, and the recurring salaries of DevOps and site reliability engineers. Pre-built enterprise SaaS systems like DEZORYN allow organizations to compress deployment timelines from eighteen months down to two weeks, shifting capital expenditure directly into high-ROI operational productivity."
      },
      {
        heading: "2. Check Multi-Tenant Security & Isolation",
        text: "The cornerstone of enterprise cloud trust is tenant isolation. Disreputable vendors frequently pool tenant data in shared database tables with mere WHERE clauses filtering rows, leaving your sensitive corporate intelligence vulnerable to query injection or rogue developer scripts.\n\nDemanding verified architectural separation—such as PostgreSQL row-level security (RLS) with session-injected tenant claims or dedicated schema-per-tenant partitions—ensures that no cross-contamination can ever occur. Additionally, verify that encryption keys are rotated periodically using AWS KMS or HashiCorp Vault, and that every administrative action generates tamper-evident immutable audit logs."
      },
      {
        heading: "3. Prioritize Open APIs and Extensibility",
        text: "Walled gardens strangle operational agility. As your organization evolves, your core enterprise software must seamlessly synchronize with external CRM suites, payroll providers, communication tools like WhatsApp and Slack, and corporate data warehouses.\n\nEvaluate the vendor's API developer portal prior to purchase. Look for RESTful v1 JSON specifications, comprehensive webhook event subscriptions with HMAC-SHA256 signature verification, and automated retry mechanisms with exponential backoff. A platform that provides native webhooks saves hundreds of engineering hours when bridging legacy on-premises databases with modern cloud infrastructure."
      },
      {
        heading: "4. Deployment Speed and Vendor Support SLAs",
        text: "A software platform that takes six months to onboard frontline teams is an operational failure. Prioritize systems that offer pre-configured industry templates, guided staging sandboxes, and automated CSV/JSON data ingestion pipelines.\n\nFurthermore, enterprise contracts must stipulate 99.9% uptime commitments with clear financial credits for service degradation, 24/7 priority incident response, and direct access to dedicated solutions architects rather than automated triage bots."
      }
    ]
  },
  {
    slug: "automation-first-operations",
    title: "Automation-first operations: where to start",
    cat: "Insights",
    date: "October 2026",
    read: "5 min",
    author: "DEZORYN Automation Lab",
    image: "/resources/automation-ai.jpg",
    summary: "How modern enterprises identify high-friction repetitive workflows and deploy AI assistants without breaking operational continuity.",
    takeaways: [
      "Target low-risk, high-frequency manual handoffs (invoice reconciliation, lead routing, document tagging) first.",
      "Combine deterministic business rules for compliance with AI intent recognition for unstructured inputs.",
      "Always design human-in-the-loop escalation paths for edge cases below confidence thresholds.",
      "Measure operational ROI by hours saved per department rather than raw volume of automated tasks."
    ],
    checklist: [
      "Map departmental spreadsheets, email approvals, and manual data copy-pasting cycles",
      "Benchmark confidence thresholds (e.g. >= 92% automated, < 92% human review)",
      "Deploy webhook triggers and message queues (Redis / Kafka) to prevent system bottlenecks",
      "Conduct weekly audit reviews on automated exceptions and false positives"
    ],
    blueprint: {
      type: "Pipeline Architecture",
      spec: "Trigger Event -> Schema Validation -> Deterministic Rule Engine -> ML Inference -> Confidence Router [Pass: Execute API / Fail: Human Review Queue]"
    },
    sections: [
      {
        heading: "1. Audit Bottlenecks in Daily Team Workflows",
        text: "The greatest barrier to business automation is attempting to automate broken or undocumented processes. Modern enterprises must begin with an honest operational audit: mapping every physical spreadsheet, email approval chain, and manual data transcription that occurs across finance, HR, and customer fulfillment.\n\nLook specifically for 'swivel-chair' tasks—processes where an employee copies data from an incoming PDF or email and pastes it into an accounting or CRM database. These repetitive touchpoints are not only morale-draining but represent 80% of human transcription errors. Automating these high-frequency handoffs delivers immediate, measurable ROI within the first thirty days."
      },
      {
        heading: "2. Combine Rule-Based Workflows with AI Intent",
        text: "A common pitfall is treating artificial intelligence as a magic wand for all operational logic. In reality, deterministic business rules (such as tax calculations, permission checks, and billing triggers) should remain strictly deterministic and auditable.\n\nMachine learning models and Large Language Models (LLMs) excel at handling unstructured inputs: classifying customer intent, extracting key-value pairs from blurry scanned invoices, and synthesizing conversational summaries. By placing an AI classification layer in front of a deterministic state machine, enterprises achieve the flexibility of modern AI paired with the mathematical certainty required for enterprise compliance."
      },
      {
        heading: "3. Establish Human-in-the-Loop Safeguards",
        text: "Autonomous operations must never operate as opaque black boxes. Every mission-critical automated pipeline requires an integrated Human-in-the-Loop (HITL) exception mechanism.\n\nWhen an AI extraction model processes an invoice with a confidence score below 92%, or when an automated payment trigger exceeds a defined monetary ceiling, the transaction should be automatically placed in an operator triage queue with highlighted anomalies. This builds frontline employee trust while ensuring zero erroneous financial disbursements."
      },
      {
        heading: "4. Continuous Observability and Telemetry",
        text: "Automation is not a one-and-done implementation. Downstream third-party APIs change, document layouts evolve, and seasonal traffic spikes test system resilience.\n\nDeploying centralized telemetry that monitors webhook delivery latencies, dead-letter queues, and model inference drift ensures your automation infrastructure remains reliable 24/7 without requiring manual intervention from engineering teams."
      }
    ]
  },
  {
    slug: "multi-tenant-basics",
    title: "Multi-tenant architecture, explained plainly",
    cat: "Architecture",
    date: "October 2026",
    read: "8 min",
    author: "DEZORYN Cloud Architecture",
    image: "/resources/multi-tenant-db.jpg",
    summary: "An engineering deep dive into building scalable multi-tenant SaaS platforms with shared infrastructure and isolated tenant contexts.",
    takeaways: [
      "Understand the trade-offs between pooled databases (RLS), schema-per-tenant, and isolated database clusters.",
      "Inject tenant context at the API gateway layer using cryptographically signed JWT tokens.",
      "Implement token-bucket rate limiting per tenant tier to prevent noisy neighbor degradation.",
      "Automate zero-downtime database schema migrations across thousands of tenant partitions simultaneously."
    ],
    checklist: [
      "Enforce PostgreSQL Row-Level Security (RLS) on all application tenant tables",
      "Inject tenant_id context dynamically into connection pool sessions",
      "Configure Redis token buckets for tenant-specific API rate caps",
      "Test disaster recovery restoration for individual tenant schemas independently"
    ],
    blueprint: {
      type: "Database Sharding Pattern",
      spec: "Inbound Request -> API Gateway (Verify JWT & Extract Tenant ID) -> Connection Pooler (PgBouncer) -> PostgreSQL Cluster [Schema Partition: Tenant_Alpha, Tenant_Beta, Tenant_Gamma]"
    },
    sections: [
      {
        heading: "1. Shared Compute vs. Isolated Databases",
        text: "At its core, multi-tenancy is the architectural art of serving thousands of independent enterprise customers from a unified, efficient cloud infrastructure without allowing any customer to view or tamper with another's data.\n\nEngineers typically choose between three fundamental models: (1) Shared Database with Shared Schema using Row-Level Security (RLS), (2) Shared Database with Isolated Schemas, and (3) Dedicated Databases per Tenant. For high-scale SaaS products like DEZORYN, a hybrid approach provides the sweet spot: standard workspace tiers share robust schema partitions with hardware-accelerated RLS, while enterprise clients receive dedicated sharded database instances."
      },
      {
        heading: "2. Dynamic Schema Routing and Context Injection",
        text: "How does a microservice know which customer's data to query? Modern cloud architectures intercept inbound HTTP requests at the edge API gateway, validating the cryptographically signed JWT bearer token and extracting the organizational `tenant_id` claim.\n\nBefore executing any SQL query, the database connection pooler injects the active tenant context directly into the database transaction session (e.g. `SET LOCAL app.current_tenant = 'tenant_xyz'`). The PostgreSQL database engine then transparently enforces boundary checks on every SELECT, UPDATE, and DELETE statement at the kernel level, mathematically eliminating cross-tenant data leaks."
      },
      {
        heading: "3. Noisy Neighbor Protection & Rate Limiting",
        text: "In a shared infrastructure environment, an aggressive customer running massive data exports or rogue crawler scripts must never degrade the system performance of other organizations.\n\nModern platforms implement distributed token-bucket rate limiters managed in Redis clusters. By tracking request frequencies, query execution times, and background job queues on a per-tenant basis, high-traffic accounts are gracefully throttled with `429 Too Many Requests` status headers while preserving sub-30ms response times for all other active tenants."
      },
      {
        heading: "4. Zero-Downtime Tenant Schema Migrations",
        text: "Updating database schemas across thousands of active corporate tenants is one of the greatest engineering challenges in SaaS development. Traditional migration locks cause widespread downtime.\n\nEmploying expanding-and-contracting migration patterns—where new columns and indexes are added additively while maintaining backward compatibility with older application code—allows SaaS engineering teams to ship continuous deployments daily with zero service interruption."
      }
    ]
  },
  {
    slug: "digital-transformation-roadmap",
    title: "A practical digital transformation roadmap",
    cat: "Insights",
    date: "October 2026",
    read: "7 min",
    author: "DEZORYN Enterprise Solutions",
    image: "/resources/digital-transformation.jpg",
    summary: "A battle-tested blueprint for modernizing legacy enterprise systems without operational downtime.",
    takeaways: [
      "Avoid big-bang system replacements; use the Strangler Fig pattern to replace legacy subsystems incrementally.",
      "Frontline user adoption is the primary metric of transformation success, not just feature completion.",
      "Establish dual-running staging periods where old and new systems reconcile transactional data automatically.",
      "Set clear baseline KPIs before kicking off modernization: cycle time reduction, error rate drop, and cost savings."
    ],
    checklist: [
      "Audit legacy system dependency graphs and identify the least coupled subsystem to migrate first",
      "Establish an API Gateway abstraction layer between legacy databases and modern cloud UI",
      "Run automated dual-write reconciliation to prove mathematical parity between systems",
      "Conduct role-specific employee training workshops with sandbox test environments"
    ],
    blueprint: {
      type: "Strangler Migration Model",
      spec: "Client Apps -> API Gateway Routing -> [Phase 1: 20% Traffic to Modern Microservices / 80% to Legacy Core -> Phase 4: 100% Modern Cloud / Decommission Legacy]"
    },
    sections: [
      {
        heading: "1. The Strangler Fig Pattern for Legacy Migration",
        text: "The greatest catastrophe in enterprise technology is the multi-million-dollar 'big-bang' overhaul—an attempt to rebuild a massive legacy monolith from scratch and switch everything over on a single weekend. These projects almost invariably suffer from runaway budgets, catastrophic data loss, and prolonged employee paralysis.\n\nThe proven alternative is the Strangler Fig pattern. Named after Australian rainforest vines that gradually grow around an existing tree until replacing it, this approach places an intelligent API gateway in front of the legacy system. New cloud microservices are deployed incrementally behind the gateway to take over discrete functions (such as admissions or billing) while the legacy core continues humming unnoticed."
      },
      {
        heading: "2. Aligning Stakeholders Across Operations and IT",
        text: "Technology alone cannot transform an organization; culture and frontline adoption dictate ultimate success. When software engineering decisions happen in an ivory tower without consulting daily operators, frontline staff develop workarounds with personal spreadsheets.\n\nSuccessful digital transformation requires embedding product champions from finance, customer operations, and field teams into early sprint design sessions. Conducting weekly feedback loops and deploying intuitive mobile-first interfaces ensures that workers embrace modern software as an empowering tool rather than an administrative burden."
      },
      {
        heading: "3. Continuous Monitoring and Value Realization",
        text: "Before writing a single line of code, organizational leadership must define quantitative baseline metrics: How many hours does month-end ledger reconciliation currently take? What is the average patient or student intake turnaround time? What is the monthly dispute rate on invoices?\n\nBy measuring these metrics continuously across the transformation rollout, executive teams can demonstrate clear ROI to board members and justify continued investments in cloud modernization."
      },
      {
        heading: "4. Decommissioning and Archival Strategy",
        text: "The final phase of any successful migration is safely turning off the legacy monolith. Many organizations leave legacy servers running indefinitely out of fear that historical compliance records will be lost.\n\nA structured cutover moves historical read-only snapshots into encrypted, cost-effective cloud data lakes (such as AWS S3 Glacier) with searchable query interfaces, allowing companies to terminate expensive legacy licenses and cut infrastructure overhead by over 60%."
      }
    ]
  },
  {
    slug: "zero-trust-cloud-security",
    title: "Zero-Trust Security & RBAC in Modern Multi-Tenant SaaS",
    cat: "Architecture",
    date: "October 2026",
    read: "7 min",
    author: "DEZORYN Cyber Operations",
    image: "/resources/cyber-security-vault.jpg",
    summary: "Cryptographic data isolation, OAuth 2.0 PKCE token exchange, and granular permission boundaries for enterprise compliance.",
    takeaways: [
      "Never rely on perimeter firewalls alone; adopt a 'never trust, always verify' zero-trust posture.",
      "Enforce tenant-level encryption at rest using dedicated KMS customer-managed keys.",
      "Implement dynamic Attribute-Based Access Control (ABAC) to evaluate context, location, and device posture.",
      "Stream immutable audit telemetry directly into external enterprise SIEM systems in real time."
    ],
    checklist: [
      "Mandate MFA and OAuth 2.0 PKCE token authentication on all administrative portals",
      "Configure TLS 1.3 with strict cipher suites for all inbound API traffic",
      "Deploy row-level security policies and KMS envelope encryption on customer databases",
      "Enable real-time SIEM webhook streaming for all authorization and data mutation events"
    ],
    blueprint: {
      type: "Zero-Trust Architecture",
      spec: "Identity Provider (OAuth 2.0 / SAML) -> Zero-Trust Gateway (Evaluate IP, MFA, Tenant Scope) -> Encrypted Microservice Mesh (mTLS) -> KMS-Shielded Database Partition"
    },
    sections: [
      {
        heading: "1. Enforcing Cryptographic Tenant Isolation",
        text: "Traditional perimeter security assumes that everything inside the corporate intranet is trustworthy. In today's distributed cloud environment, this assumption is fatally flawed. A modern zero-trust architecture operates on the principle that the internal network is already compromised.\n\nMulti-tenant platforms must guarantee cryptographic isolation. Beyond database schema boundaries, data at rest must be encrypted using envelope encryption with dedicated customer-managed keys (CMKs) stored in hardware security modules (HSMs). In the unthinkable event of an underlying storage breach, an attacker obtains only indecipherable cipher text without access to tenant-specific decryption keys."
      },
      {
        heading: "2. Role-Based & Attribute-Based Access Control (RBAC/ABAC)",
        text: "Static user roles (such as 'Admin' or 'Viewer') are insufficient for modern corporate compliance. Enterprise organizations operate complex department hierarchies with varying geographic and temporal permissions.\n\nDEZORYN platforms implement dynamic Attribute-Based Access Control (ABAC). On every inbound API request, our authorization engine evaluates not only the user's explicit role, but contextual attributes: Is the user connecting from an approved corporate IP subnet? Is their device posture compliant? Are they attempting to access payroll data outside normal business hours? Fine-grained evaluation stops insider threats in their tracks."
      },
      {
        heading: "3. Immutable Audit Trails and SIEM Integration",
        text: "Compliance frameworks like SOC 2, HIPAA, and ISO 27001 require rigorous proof of who accessed what data and when. Audit logs that live inside mutable application tables are vulnerable to tampering by privileged database administrators.\n\nProduction SaaS platforms write audit events to append-only, cryptographically verified logging streams. Every record view, export, privilege elevation, and configuration modification is signed and streamed directly to enterprise Security Information and Event Management (SIEM) tools like Datadog, Splunk, or AWS CloudWatch."
      },
      {
        heading: "4. Continuous Penetration Testing and Vulnerability Defense",
        text: "Security is an active posture, not a static certification. Continuous automated dependency scanning, static code analysis (SAST) in CI/CD pipelines, and regular third-party black-box penetration testing guarantee that emerging zero-day vulnerabilities are patched within hours of discovery."
      }
    ]
  },
  {
    slug: "enterprise-api-integration-blueprints",
    title: "Designing Enterprise-Ready RESTful & Webhook APIs",
    cat: "Developer Docs",
    date: "October 2026",
    read: "9 min",
    author: "DEZORYN API Standards Group",
    image: "/resources/api-developer-guide.jpg",
    summary: "A production engineering guide to idempotency keys, rate limiting buckets, versioning, and webhook delivery guarantees.",
    takeaways: [
      "Use client-provided Idempotency-Keys on all POST and mutation endpoints to prevent double charges.",
      "Design webhooks with at-least-once delivery semantics, HMAC signatures, and exponential backoff retries.",
      "Derive OpenAPI 3.1 specifications directly from code models to ensure docs never become stale.",
      "Enforce granular OAuth 2.0 scopes (e.g. `workspaces:read`, `ledgers:write`) for API integrations."
    ],
    checklist: [
      "Implement Redis-backed idempotency caching for all transactional endpoints",
      "Sign webhook payloads with HMAC-SHA256 headers for client verification",
      "Publish comprehensive OpenAPI 3.1 specs with sandbox mock servers",
      "Deploy token-bucket rate limiters returning clear X-RateLimit headers"
    ],
    blueprint: {
      type: "Webhook Delivery Pipeline",
      spec: "Domain Event -> Kafka / Redis Stream -> Worker Queue -> HMAC Signer -> HTTP POST to Client Webhook [Retries: 1s, 5s, 30s, 5m, 1h -> Dead Letter Queue on Failure]"
    },
    sections: [
      {
        heading: "1. Idempotency and Webhook Delivery Guarantees",
        text: "In distributed network environments, network connections fail unpredictably. If a client attempts to submit an invoice or student fee payment and the HTTP connection times out, the client cannot know whether the server executed the transaction or dropped it.\n\nEnterprise APIs solve this challenge through client-supplied `Idempotency-Key` headers. When a mutation request arrives with an idempotency key, the API gateway caches the request state in Redis. If the client retries the exact same request due to a network glitch, the server immediately returns the cached response without re-executing the payment logic, preventing catastrophic double billing."
      },
      {
        heading: "2. Token Bucket Rate Limiting per Tenant Tier",
        text: "A well-architected API treats fair-resource allocation as a first-class citizen. Implementing the token-bucket algorithm ensures that sudden traffic spikes from one enterprise tenant do not starve shared microservices or backend databases.\n\nAPI responses should always communicate rate-limiting telemetry transparently using standard headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. When limits are exceeded, descriptive JSON error payloads instruct client SDKs on the exact millisecond delay required before retrying."
      },
      {
        heading: "3. OpenAPI Spec Generation & SDK Tooling",
        text: "Documentation that is manually written in external wikis is doomed to become obsolete within months of feature development. Modern engineering teams enforce 'Code as Source of Truth' by automatically deriving OpenAPI 3.1 specifications directly from TypeScript interfaces or Go structs during build cycles.\n\nThis single OpenAPI definition powers interactive Swagger/Redoc documentation, automated SDK client generation in Python, Node.js, and Java, and end-to-end integration test suites across CI/CD environments."
      },
      {
        heading: "4. Webhook Security and Resiliency Runbooks",
        text: "Outbound webhooks notify third-party systems of real-time events like student admissions or invoice settlements. To prevent spoofing, every webhook payload must include an `X-Signature-SHA256` header calculated from the raw payload body and a tenant-shared secret key.\n\nFailed webhook deliveries should be retried automatically using exponential backoff with jitter across a 24-hour window, eventually dropping unrecoverable messages into an accessible Dead Letter Queue (DLQ) where administrators can inspect and re-trigger events manually."
      }
    ]
  },
  {
    slug: "cloud-finops-infrastructure-optimization",
    title: "Cloud FinOps: Reducing Infrastructure Sprawl at Scale",
    cat: "Insights",
    date: "October 2026",
    read: "6 min",
    author: "DEZORYN Cloud Economics",
    image: "/resources/cloud-finops.jpg",
    summary: "Actionable tactics for rightsizing container clusters, reserved instances, database pooling, and egress cost containment.",
    takeaways: [
      "Benchmark actual P95 CPU and memory utilization rather than relying on arbitrary developer resource requests.",
      "Offload read-heavy reporting queries to autoscaled read replicas to downsize expensive primary DB instances.",
      "Leverage edge CDN caching to slash cross-zone data transfer and egress network charges by over 70%.",
      "Institute continuous tagging audits so that every cloud dollar is mapped directly to a business cost center."
    ],
    checklist: [
      "Deploy Vertical Pod Autoscaler (VPA) in recommendation mode to identify over-provisioned pods",
      "Configure PgBouncer connection pooling to maximize database instance connection density",
      "Audit cloud NAT gateways and move intra-region traffic to internal VPC peering endpoints",
      "Implement automated lifecycle policies to tier older log files to low-cost archival storage"
    ],
    blueprint: {
      type: "FinOps Cost Optimization Matrix",
      spec: "Ingress Traffic -> Edge CDN (Cache Hit: 85% Egress Saved) -> Kubernetes Cluster (VPA Rightsized) -> PgBouncer Pool -> Primary DB (Writes Only) + Read Replicas (Reporting)"
    },
    sections: [
      {
        heading: "1. Rightsizing Underutilized Kubernetes Nodes",
        text: "In the rush to ensure application reliability, software engineers frequently allocate massive safety buffers to containerized microservices—requesting 4 CPU cores and 16GB of RAM for services that average less than 15% utilization during peak traffic. Multiplied across hundreds of pods, cloud bills inflate exponentially.\n\nCloud FinOps replaces guesswork with empirical telemetry. By deploying Vertical Pod Autoscalers (VPA) and benchmarking P95 resource consumption over 30-day operational cycles, engineering teams can rightsize container definitions and consolidate worker nodes, routinely cutting Kubernetes compute bills by 35% to 50% without risking performance degradation."
      },
      {
        heading: "2. Connection Pooling and Read Replica Offloading",
        text: "Managed databases like Amazon RDS or Google Cloud SQL are often the single largest line item on enterprise cloud invoices. When hundreds of application servers open direct connections, memory overhead skyrockets, forcing companies to upgrade to prohibitively expensive high-memory instance tiers.\n\nImplementing dedicated connection poolers like PgBouncer allows thousands of transient microservice requests to share a compact, optimized pool of physical database connections. Furthermore, routing analytics queries and executive dashboard exports to read-only replicas prevents primary database lockups and allows downsizing primary production instances."
      },
      {
        heading: "3. Egress Traffic Optimization via Regional CDNs",
        text: "Cloud providers charge punitive rates for outbound data transfer (egress) across availability zones and the public internet. Delivering raw images, CSS, JavaScript bundles, and heavy API JSON responses directly from origin application servers drains budgets.\n\nPositioning global content delivery networks (CDNs) like Cloudflare or Fastly at the edge caches static assets and idempotently cached API responses within milliseconds of global users. This slashes origin server bandwidth by up to 70% while improving page load speeds by 4x worldwide."
      },
      {
        heading: "4. Building a Culture of Cost Accountability",
        text: "True infrastructure optimization is an organizational habit, not a one-time audit. Enforcing mandatory cloud tagging (attributing every cluster, disk, and database to specific engineering teams) and scheduling automated Slack alerts for unexpected daily spend anomalies creates transparent cost consciousness across the entire development team."
      }
    ]
  },
  {
    slug: "agentic-ai-workflow-orchestration",
    title: "Deploying Autonomous Agentic AI in Enterprise Workflows",
    cat: "Guides",
    date: "October 2026",
    read: "8 min",
    author: "DEZORYN AI Research Lab",
    image: "/resources/agentic-ai.jpg",
    summary: "How multi-agent LLM systems collaborate with deterministic APIs, human approval loops, and state machines to automate complex back-office operations.",
    takeaways: [
      "Move beyond single prompt-response chatbots to stateful multi-agent directed graphs (DAGs).",
      "Equip LLM agents with strongly typed tool definitions and strict JSON schema validation.",
      "Implement multi-agent verification loops where a Critic or Auditor agent checks output before action execution.",
      "Monitor token consumption, hallucination frequencies, and latency telemetry continuously."
    ],
    checklist: [
      "Define state machines with clear transitions, checkpoints, and rollback strategies",
      "Restrict tool execution to sandboxed REST API functions with explicit user session tokens",
      "Implement programmatic schema guardrails (Pydantic / Zod) on all structured outputs",
      "Establish automated red-team evaluations to test prompt injection resilience"
    ],
    blueprint: {
      type: "Multi-Agent Graph Orchestrator",
      spec: "Task Input -> Router Agent -> [Specialist Agent A (Research) <-> Specialist Agent B (Drafting)] -> Critic Agent (Validation) -> Human Approval Gate -> API Execution Tool"
    },
    sections: [
      {
        heading: "1. Beyond Simple Chatbots: Stateful Agent Graphs",
        text: "The first generation of enterprise AI focused on simple single-turn chatbots and document search. While helpful for basic questions, these conversational models crumble when tasked with multi-step operational execution like vendor contract onboarding, procurement approvals, or clinical record synthesis.\n\nAgentic AI represents a fundamental paradigm shift. Instead of a single LLM attempting to solve everything in one prompt, an agentic system decomposes complex business workflows into stateful directed acyclic graphs (DAGs). Individual specialized agents—such as a Data Ingestion Agent, a Policy Compliance Agent, and an ERP Integration Agent—collaborate sequentially and in parallel, passing structured context between execution checkpoints."
      },
      {
        heading: "2. Grounded Tool Execution with Strict Schemas",
        text: "An autonomous agent is only as powerful as the tools it can safely invoke. Giving an LLM open-ended code execution privileges is a severe cybersecurity hazard for enterprise platforms.\n\nIn the DEZORYN architecture, AI agents interact with production systems of record solely through strongly typed, schema-validated JSON function calls. Using validation libraries like Zod or Pydantic, the agent's intent is parsed and verified against strict business logic before any SQL mutation or financial disbursement API is triggered, guaranteeing zero unintended side effects."
      },
      {
        heading: "3. Multi-Agent Verification and Guardrail Auditing",
        text: "Hallucinations cannot be tolerated in regulated industries like healthcare, education, or finance. To achieve enterprise reliability, agent architectures employ adversarial validation pairs: every draft generated by a worker agent must be reviewed by a separate Critic Agent configured with stringent regulatory guidelines.\n\nIf the Critic Agent detects an unverified claim, a hallucinated calculation, or a missing data citation, the draft is rejected and routed back to the worker agent with corrective instructions. Only after passing multi-turn verification is the task surfaced for final human sign-off."
      },
      {
        heading: "4. Telemetry, Cost Guardrails, and Evaluation Benchmarks",
        text: "Operating autonomous agent networks at scale requires granular observability. Engineering teams must monitor token consumption, per-task inference costs, and model latency percentiles in real time.\n\nContinuous regression testing against golden benchmark datasets ensures that updates to underlying foundation models do not degrade the accuracy or compliance posture of your automated business operations."
      }
    ]
  }
];
const POST_ALIASES = {
  "cloud-security-zero-trust": "zero-trust-cloud-security",
  "digital-transformation-pitfalls": "digital-transformation-roadmap",
  "high-performance-apis": "enterprise-api-integration-blueprints",
  "finops-cost-optimization": "cloud-finops-infrastructure-optimization",
  "agentic-ai": "agentic-ai-workflow-orchestration",
  "choosing-saas": "choosing-saas-for-your-business",
  "automation-first": "automation-first-operations",
  "multi-tenant": "multi-tenant-basics",
};
export const getPost = (slug) => {
  const target = POST_ALIASES[slug] || slug;
  return posts.find((p) => p.slug === target);
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", mega: "products" },
  { label: "Solutions", href: "/solutions", mega: "solutions" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Industries", href: "/industries", mega: "industries" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/company" },
];
