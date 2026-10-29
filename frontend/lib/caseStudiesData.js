/**
 * DEZORYN TECHNOLOGY — Enterprise Case Studies & Architecture
 * Clear, professional, and easy-to-understand real-world software blueprints.
 * Zero confusing jargon, zero placeholder copy, 100% clear and practical English.
 */

export const caseStudiesDetails = {
  "schooly-core-campus": {
    slug: "schooly-core-campus",
    name: "Schooly Core Campus ERP",
    industry: "Education",
    type: "SaaS",
    product: "schooly-core",
    clientScale: "18 School Campuses • 24,000+ Students • 1,200 Teachers & Staff",
    timeline: "14 Weeks (From First Meeting to Full School Launch)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Cloud Servers", "Mobile App APIs"],
    overview:
      "A group of 18 private schools and junior colleges was having trouble managing daily work across their branches. Each campus used separate desktop software, paper fee registers, and printed diaries. Because there was no single system, school management could not see total fee collections, student attendance, or teacher schedules in real time.",
    challenge:
      "School administration was slow and stressful. Reconciling fee payments took nearly two weeks every month because staff had to check bank deposit slips and cash receipts by hand. Important school circulars sent in student diaries were often missed by parents. Taking attendance by hand wasted 20 minutes every morning, and transferring student records between branches led to typing errors and lost marks.",
    objectives: [
      "Connect all 18 school branches to one secure online platform with a central dashboard for management.",
      "Allow parents to pay fees online with instant digital receipts and automatic bank updates.",
      "Give parents a simple mobile app for daily attendance alerts, homework notices, and school bus tracking.",
      "Create automatic school timetables so teachers have balanced workloads with no schedule clashes.",
      "Set up clear user permissions so each branch manages its own students without seeing other schools' private records.",
      "Generate automated report cards that match CBSE, ICSE, and State Board guidelines with one click."
    ],
    solution:
      "DEZORYN deployed Schooly Core as a unified cloud platform. Each branch gets its own private workspace, while trust management sees live reports for all schools on one screen. We connected gate entry scanners and bus GPS trackers directly to the parent mobile app so parents get instant arrival alerts. Online fee payments via UPI, debit cards, and net banking now match student accounts automatically, issuing instant receipts.",
    architecture:
      "Built on modern, dependable cloud servers with automatic daily backups. The system uses fast data caching so hundreds of teachers can take attendance at the exact same time without slowdowns. All records are stored securely, ensuring zero lost data. Notifications for fee reminders, attendance, and emergency alerts are sent automatically without freezing the app.",
    implementation: [
      "Phase 1: Planning & Data Cleanup — Safely migrated 24,000+ student profiles, past exam marks, and old fee records from paper registers and spreadsheets into the new cloud database.",
      "Phase 2: System Setup & Roles — Set up custom logins and permissions for school trustees, principals, teachers, cashiers, transport managers, and parents.",
      "Phase 3: Hardware & Mobile App Pilot — Connected gate RFID turnstiles and bus GPS devices; tested the parent app across 2 campuses with 3,000 students.",
      "Phase 4: Staff Training Across Branches — Conducted easy, step-by-step training sessions for 120+ office staff, 800+ teachers, and bus drivers.",
      "Phase 5: Full Launch & Live Support — Switched all campuses over to the new system with dedicated technical support and real-time monitoring."
    ],
    metrics: [
      {
        metric: "Automated",
        title: "Same-Day Fee Reconciliation",
        label: "Same-Day Fee Reconciliation",
        category: "Financial Operations",
        desc: "Online fee collections via UPI, cards, and net banking match bank ledgers automatically with zero manual entry.",
        change: "Automated"
      },
      {
        metric: "Live Sync",
        title: "Campus Attendance & Safety",
        label: "Campus Attendance & Safety",
        category: "Campus Operations",
        desc: "RFID gate turnstiles and teacher mobile roll-calls sync in real time, giving trustees and principals instant headcount visibility.",
        change: "Live Sync"
      },
      {
        metric: "100%",
        title: "Direct Parent Communication",
        label: "Direct Parent Communication",
        category: "Parent Engagement",
        desc: "Academic circulars, event alerts, and daily homework notifications deliver directly to verified parent mobile apps.",
        change: "100%"
      },
      {
        metric: "Paperless",
        title: "Board-Compliant Grade Cards",
        label: "Board-Compliant Grade Cards",
        category: "Academic Records",
        desc: "Automated examination grading and board-compliant report cards eliminate weeks of manual calculation across all 18 branches.",
        change: "Paperless"
      }
    ],
    highlights: [
      { label: "Private Branch Workspaces", desc: "Each school branch sees only its own records, while group management gets combined reports." },
      { label: "Automatic Fee Updates", desc: "Online payments update student ledger accounts immediately with no manual accounting." },
      { label: "Live Bus & Gate Alerts", desc: "Parents get instant mobile notifications when their child enters school or boards the bus." },
      { label: "One-Click Report Cards", desc: "Automatically calculates grades and prints neat, board-compliant report cards." }
    ],
    outcome:
      "All 18 campuses now run smoothly on a single platform. Fee collection improved by 42% in the first term because parents receive friendly digital reminders, and parent satisfaction reached 96%. Paper use has dropped dramatically, and school leaders can check attendance and fee collections anytime from their phone."
  },

  "dezo-care-hospital": {
    slug: "dezo-care-hospital",
    name: "Dezo Care Hospital Operations ERP",
    industry: "Healthcare",
    type: "Enterprise",
    product: "dezo-care",
    clientScale: "350-Bed Multi-Specialty Hospital • 140+ Doctors • 850 Outpatients Daily",
    timeline: "16 Weeks (From Clinical Audit to Live Hospital Rollout)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Digital Health APIs (ABDM)", "Secure Cloud"],
    overview:
      "A large 350-bed multi-specialty hospital with a 24/7 emergency unit and 24 outpatient clinics was using disconnected software and paper files. Patient records were kept in paper folders, the pharmacy had its own separate billing counter, and the diagnostic lab printed reports on paper. Doctors, nurses, and billing staff had to call each other constantly to find patient records or check bed availability.",
    challenge:
      "Patients waited over an hour in crowded waiting rooms just to see a doctor. Handwritten doctor prescriptions were hard for pharmacy staff to read, leading to dispensing delays and risk of medication mistakes. When patients were discharged, it took over 4 hours to calculate their final bill because staff had to collect paper slips from the ward, pharmacy, and laboratory. Also, the hospital needed to connect with government digital health accounts (ABDM).",
    objectives: [
      "Digitize patient visits from registration and doctor consultations to hospital discharge.",
      "Replace handwritten prescriptions with clear electronic prescriptions to prevent medicine errors.",
      "Connect diagnostic lab machines directly to patient records for faster test results.",
      "Show real-time bed availability across ICU, private rooms, and general wards on a single screen.",
      "Connect with the government Ayushman Bharat Digital Mission (ABDM) for instant digital health records.",
      "Speed up patient discharge and insurance approvals with automated itemized billing."
    ],
    solution:
      "DEZORYN configured and installed Dezo Care across all hospital departments. When a patient arrives, they receive a digital token for their doctor's waiting lounge. Doctors write clear digital prescriptions that appear instantly on the pharmacy screen, automatically updating medicine stock. Lab test machines upload reports directly into the patient's file. The bed management system shows nurses and doctors which rooms are free, occupied, or being cleaned in real time.",
    architecture:
      "Engineered for 24/7 hospital uptime with zero interruption. Hospital records are protected with bank-grade encryption and strict medical privacy standards. Local backup servers inside the hospital ensure doctors and nurses can still view patient records and enter prescriptions even if the internet goes down.",
    implementation: [
      "Phase 1: Department Workflow Review — Mapped patient journeys across outpatient clinics, emergency triage, ICU, pharmacy, and diagnostic labs.",
      "Phase 2: Lab Machine & Pharmacy Setup — Connected automated blood testing machines to the software and imported over 4,500 medicine names and stock levels.",
      "Phase 3: Digital Prescription Pilot — Trained 35 senior doctors and triage nurses in a pilot clinic to ensure fast, easy prescription writing.",
      "Phase 4: Full Hospital Training — Trained 140+ doctors, 320+ nurses, pharmacists, and billing cashiers with hands-on practice sessions.",
      "Phase 5: Live Hospital Cutover — Launched system hospital-wide with technical engineers present in every ward for instant assistance."
    ],
    metrics: [
      {
        metric: "Under 10 Min",
        title: "Organized Outpatient Queues",
        label: "Organized Outpatient Queues",
        category: "Patient Experience",
        desc: "Digital token kiosks and doctor lounge queues organize patient visits smoothly, reducing clinic waiting room congestion.",
        change: "Under 10 Min"
      },
      {
        metric: "Instant",
        title: "Electronic Prescription Transfer",
        label: "Electronic Prescription Transfer",
        category: "Pharmacy Operations",
        desc: "Digital prescriptions route directly to the in-house pharmacy with automatic allergy and medication dosage safety checks.",
        change: "Instant"
      },
      {
        metric: "Automated",
        title: "Direct Diagnostic Machine Sync",
        label: "Direct Diagnostic Machine Sync",
        category: "Diagnostic Speed",
        desc: "Automated blood and imaging analyzers send diagnostic results straight to patient files with zero manual typing.",
        change: "Automated"
      },
      {
        metric: "Real-Time",
        title: "Unified Bed Occupancy Dashboard",
        label: "Unified Bed Occupancy Dashboard",
        category: "Inpatient Management",
        desc: "Live visibility of occupied, reserved, and cleaning-ready beds across general wards and intensive care units.",
        change: "Real-Time"
      }
    ],
    highlights: [
      { label: "Digital Health ID Sync", desc: "Directly linked with national health accounts (ABHA / ABDM) for instant patient registration." },
      { label: "Direct Lab Machine Sync", desc: "Diagnostic blood analyzers transfer test results straight to patient records with no typing." },
      { label: "Live Bed Occupancy Map", desc: "Shows available, occupied, and cleaning-ready beds across general and ICU wards." },
      { label: "Safe Medicine Alerts", desc: "Warns doctors automatically if a prescribed medicine conflicts with a patient's known allergies." }
    ],
    outcome:
      "The hospital is now virtually paperless. Patient waiting times dropped from over an hour to under 10 minutes, pharmacy dispensing is seven times faster, and patient discharge time reduced by over 4 hours. Doctors and nurses now spend more time caring for patients instead of searching for paperwork."
  },

  "real-estate-dev": {
    slug: "real-estate-dev",
    name: "Real Estate Property Platform",
    industry: "Real Estate",
    type: "Enterprise",
    product: "real-estate",
    clientScale: "8 High-Rise Residential Towers • 2,400 Units • 450 Active Broker Partners",
    timeline: "12 Weeks (From Project Launch to Homeowner Portal Live)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Cloud Object Storage", "WhatsApp Business API", "Payment Gateways"],
    overview:
      "A major residential real estate builder developing 2,400 apartments across 8 towers was tracking sales leads, unit availability, and buyer payments on scattered spreadsheets. Because sales agents and external channel brokers did not have a shared inventory view, two buyers were occasionally booked for the same apartment. Payment reminder letters were sent manually, leading to delayed construction milestone payments.",
    challenge:
      "The sales team received hundreds of buyer inquiries each week from online ads and property portals, but over 35% of leads were dropped because there was no automatic follow-up system. Buyers had to visit the site office in person just to see construction updates or get duplicate payment receipts. Calculating broker commissions was slow and caused disputes, while tracking overdue installment payments took days.",
    objectives: [
      "Create an interactive 3D floor plan showing available, reserved, and sold apartments in real time.",
      "Capture all buyer leads automatically from Google, Facebook, property portals, and site walk-ins.",
      "Automate payment schedule reminders linked to construction milestones.",
      "Give home buyers a simple mobile portal to view construction photos, payment receipts, and floor plans.",
      "Set up an easy broker portal to register buyer clients and track commission payouts transparently.",
      "Ensure full compliance with real estate regulatory rules (RERA) with clear digital audit trails."
    ],
    solution:
      "DEZORYN launched an end-to-end Real Estate Management Platform. The sales office and external brokers now use an interactive unit selector that locks an apartment instantly when a booking deposit is made, eliminating duplicate sales. Leads from online campaigns are assigned automatically to sales agents with instant WhatsApp follow-ups. A self-service portal lets home buyers view tower construction progress, download tax receipts, and pay milestone dues online.",
    architecture:
      "Cloud-based system designed to handle heavy traffic spikes during new project launch days. All booking contracts, floor plan blueprints, and buyer identification documents are securely stored in the cloud. Real-time notifications alert sales agents when a buyer views a property brochure or opens a quotation.",
    implementation: [
      "Phase 1: Project & Unit Inventory Setup — Configured 2,400 unit layouts, floor plans, pricing sheets, and construction payment milestones.",
      "Phase 2: Lead Routing & WhatsApp Integration — Connected website forms, Facebook lead ads, and property portal feeds to auto-assign incoming leads to sales reps.",
      "Phase 3: Broker Portal Launch — Onboarded 450 verified broker partners with dedicated login dashboards to register buyer clients.",
      "Phase 4: Buyer Mobile App Rollout — Launched the homeowner portal allowing buyers to track construction progress and download official payment receipts.",
      "Phase 5: Full Launch & Sales Training — Trained 65 on-site sales consultants, customer service managers, and accounting staff."
    ],
    metrics: [
      {
        metric: "Unified",
        title: "Omnichannel Lead Ingestion",
        label: "Omnichannel Lead Ingestion",
        category: "Sales Pipeline",
        desc: "Inquiries from property portals, social campaigns, and site visits capture automatically into a central sales pipeline.",
        change: "Unified"
      },
      {
        metric: "Instant",
        title: "Automated Lead Routing",
        label: "Automated Lead Routing",
        category: "Agent Productivity",
        desc: "Incoming buyer inquiries are assigned instantly to available property consultants with automated WhatsApp follow-ups.",
        change: "Instant"
      },
      {
        metric: "Live",
        title: "Dynamic Unit Availability Locking",
        label: "Dynamic Unit Availability Locking",
        category: "Inventory Control",
        desc: "Interactive 3D unit selector locks reserved apartments in real time as booking deposits are confirmed, preventing duplicate sales.",
        change: "Live"
      },
      {
        metric: "Automated",
        title: "Construction Milestone Invoicing",
        label: "Construction Milestone Invoicing",
        category: "Financial Collections",
        desc: "Generates construction milestone payment demands and tax invoices with direct bank reconciliation and buyer portal access.",
        change: "Automated"
      }
    ],
    highlights: [
      { label: "Interactive Unit Selector", desc: "Live color-coded apartment availability prevents accidental double bookings." },
      { label: "Instant Lead Alerts", desc: "Sales executives get WhatsApp and mobile alerts the second a new inquiry arrives." },
      { label: "Buyer Progress Portal", desc: "Home buyers can check construction photos and payment receipts from home." },
      { label: "RERA Compliant Accounts", desc: "Automatically creates milestone payment demands and audit-ready accounts." }
    ],
    outcome:
      "The real estate company launched its newest 600-unit tower entirely through the platform. 85% of units were reserved in the first 30 days without a single double-booking dispute. Milestone payment collections arrived 77% faster, and customer satisfaction ratings among home buyers reached an all-time high of 94%."
  },

  "society-management-community": {
    slug: "society-management-community",
    name: "Society Management Community Platform",
    industry: "Residential Communities",
    type: "Mobile App & SaaS",
    product: "society-management",
    clientScale: "6 Gated Residential Societies • 3,200 Apartments • 14,000+ Residents",
    timeline: "8 Weeks (Setup, Gate Hardware Testing & Resident Onboarding)",
    tech: ["Next.js", "React Native", "PostgreSQL", "Node.js", "UPI Payment Gateways", "Push Notification Service"],
    overview:
      "A residential township of 3,200 apartments across 6 housing societies relied on paper registers at security gates, cash maintenance fee collections, and informal WhatsApp groups for notices. Security guards struggled to verify visitor identities, delivery drivers walked into buildings unannounced, and the resident committee spent weekends chasing overdue maintenance payments.",
    challenge:
      "Security was a major concern because paper visitor registers at the gates were often filled with fake phone numbers. Resident maintenance dues were frequently delayed, leaving the managing committee short on funds for generator diesel, elevator repairs, and gardening. When plumbing or electrical issues occurred, residents had to call the security desk repeatedly, with no way to track when a repair would be done.",
    objectives: [
      "Digitize gate security with guard tablets that verify visitors and delivery drivers via OTP and photo.",
      "Automate monthly maintenance bill generation and online payment collection.",
      "Provide a resident mobile app for one-tap visitor approvals, amenity bookings, and complaint tracking.",
      "Give residents an easy helpdesk to raise maintenance tickets with photo uploads and status updates.",
      "Allow the management committee to publish official announcements and emergency notices instantly.",
      "Keep transparent society accounts showing vendor payments, maintenance collections, and bank balances."
    ],
    solution:
      "DEZORYN deployed the Society Management Community Platform across all 6 societies. Security guards use easy touchscreen tablets at the gates. When a guest arrives, the resident receives a photo alert on their phone and approves entry with one tap. Monthly maintenance bills are generated automatically and sent with UPI payment links. Residents can book the clubhouse or swimming pool, raise plumbing complaints, and read official notices directly on their mobile app.",
    architecture:
      "Lightweight mobile and web apps built for fast performance even on basic mobile phones and guard tablets. Security data is encrypted and private. Automated payment links integrate with UPI, cards, and net banking to update society accounts right away without manual bookkeeping.",
    implementation: [
      "Phase 1: Resident & Flat Directory Setup — Uploaded verified resident names, flat numbers, vehicle numbers, and tenant records for 3,200 apartments.",
      "Phase 2: Gate Tablet & Hardware Installation — Deployed rugged Android tablets and thermal pass printers across 14 security entry gates.",
      "Phase 3: Guard Training in Simple Language — Conducted practical training for 60 security guards in Hindi and English on how to check in guests and delivery drivers.",
      "Phase 4: Resident App Rollout — Assisted residents in downloading the mobile app, setting up family members, and making online maintenance payments.",
      "Phase 5: Committee Financial Go-Live — Linked society bank accounts for automatic payment settlements and daily accounting reports."
    ],
    metrics: [
      {
        metric: "Fast Check-In",
        title: "Digital Gate Security & Visitor Pass",
        label: "Digital Gate Security & Visitor Pass",
        category: "Gate Security",
        desc: "Security guards check in guests with photo capture and OTP verification, alerting residents on their phones with one-tap entry approval.",
        change: "Fast Check-In"
      },
      {
        metric: "Automated",
        title: "Monthly Maintenance Invoicing",
        label: "Monthly Maintenance Invoicing",
        category: "Society Accounts",
        desc: "Generates recurring maintenance bills with direct UPI payment links, tracking society collections and expense ledgers transparently.",
        change: "Automated"
      },
      {
        metric: "Real-Time",
        title: "Resident Helpdesk & Repair Tracking",
        label: "Resident Helpdesk & Repair Tracking",
        category: "Community Management",
        desc: "Residents log electrical or plumbing tickets with photos, tracking assignment and repair completion directly inside the mobile app.",
        change: "Real-Time"
      },
      {
        metric: "100% Digital",
        title: "Staff & Domestic Help Attendance",
        label: "Staff & Domestic Help Attendance",
        category: "Safety & Verification",
        desc: "Tracks daily entry and exit of maintenance staff and domestic helpers with instant mobile notifications sent to apartment owners.",
        change: "100% Digital"
      }
    ],
    highlights: [
      { label: "One-Tap Visitor Approval", desc: "Residents get instant phone alerts with visitor photos to allow or deny entry." },
      { label: "Automatic Maintenance Bills", desc: "Generates monthly invoices with UPI links so residents pay in seconds." },
      { label: "Staff & Maid Attendance", desc: "Tracks daily household help entry and exit with automatic notifications to flat owners." },
      { label: "Digital Helpdesk", desc: "Residents track repairs from the moment a ticket is opened until the job is completed." }
    ],
    outcome:
      "Residents now enjoy a safer, quieter, and well-managed community. On-time maintenance fee collection rose to 98%, giving the society committee steady funds for upkeep. Gate check-ins are quick and organized, and residents appreciate being able to approve guests and pay bills straight from their phones."
  },

  "hrms-enterprise": {
    slug: "hrms-enterprise",
    name: "HRMS Enterprise Workforce Platform",
    industry: "Enterprise",
    type: "Cloud SaaS",
    product: "hrms",
    clientScale: "12,000+ Employees • 4 Regional Corporate Hubs • 28 Retail Branches",
    timeline: "14 Weeks (Architecture Setup to Pan-India Payroll Rollout)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Biometric Sync Engine", "Tax & Statutory Rules"],
    overview:
      "A fast-growing retail and logistics company with over 12,000 employees spread across offices, warehouses, and retail stores was using three different software tools for attendance, leave requests, and payroll. Because the systems did not talk to each other, the HR and finance teams spent two full weeks every month manually calculating salary deductions, overtime, and taxes.",
    challenge:
      "Employees in retail stores and warehouses complained about payroll mistakes and delayed salary slips. Tracking leave on spreadsheets resulted in incorrect holiday balances. When new staff joined, collecting paper documents and setting up accounts took up to 10 days, creating a poor first impression for new hires. The company also lacked a central way to track employee performance reviews and appraisals.",
    objectives: [
      "Combine attendance, leave, payroll, and employee records into one easy-to-use cloud platform.",
      "Sync biometric fingerprint and facial recognition scanners across all 28 stores and warehouses.",
      "Automate monthly payroll calculations, tax deductions (PF, ESI, TDS), and direct bank transfers.",
      "Provide a self-service mobile app where employees can view payslips, apply for leave, and check tax forms.",
      "Digitize new employee onboarding with online document uploads and automatic identity checks.",
      "Create simple appraisal workflows for quarterly performance reviews and goal tracking."
    ],
    solution:
      "DEZORYN rolled out HRMS Enterprise across all company locations. Biometric scanners in every store sync live attendance directly to the cloud. When month-end arrives, the payroll engine calculates salaries, overtime, and statutory deductions in minutes with zero errors. Employees use a mobile app to check in, apply for leave, download payslips, and submit tax proofs without ever needing to email HR.",
    architecture:
      "Enterprise-grade cloud platform capable of processing thousands of employee check-ins within minutes every morning. Salary data is protected with high-level encryption and strict access rules. Automated background workers generate thousands of encrypted PDF payslips in minutes and send them directly to employee email and mobile apps.",
    implementation: [
      "Phase 1: Master Employee Data Cleanup — Cleaned and organized 12,000+ employee records, past salary structures, and leave balances from legacy spreadsheets.",
      "Phase 2: Biometric Scanner Sync — Linked 45 facial recognition and fingerprint attendance devices across all stores and warehouses.",
      "Phase 3: Parallel Payroll Trial — Ran two months of salary calculations in parallel with the old system to verify 100% calculation accuracy.",
      "Phase 4: Employee App Launch — Rolled out the self-service mobile app with short video tutorials explaining how to apply for leave and view payslips.",
      "Phase 5: Full Cutover & HR Training — Handed over full management to the central HR team with dedicated support for the first 90 days."
    ],
    metrics: [
      {
        metric: "One-Click",
        title: "Automated Pan-India Payroll",
        label: "Automated Pan-India Payroll",
        category: "Payroll Operations",
        desc: "Calculates monthly salaries, overtime, PF, ESI, and tax deductions in minutes with automated encrypted PDF payslip generation.",
        change: "One-Click"
      },
      {
        metric: "Live Sync",
        title: "Multi-Location Biometric Attendance",
        label: "Multi-Location Biometric Attendance",
        category: "Workforce Management",
        desc: "Synchronizes facial recognition and fingerprint attendance scanners across all stores and warehouses into a central cloud dashboard.",
        change: "Live Sync"
      },
      {
        metric: "Self-Service",
        title: "Employee Portal & Mobile App",
        label: "Employee Portal & Mobile App",
        category: "Employee Experience",
        desc: "Staff apply for leaves, download tax forms, and track holiday balances directly from their smartphones without HR delays.",
        change: "Self-Service"
      },
      {
        metric: "Digital",
        title: "Paperless New Hire Onboarding",
        label: "Paperless New Hire Onboarding",
        category: "Talent Operations",
        desc: "New team members upload identity proofs and academic certificates online for fast, compliant identity verification.",
        change: "Digital"
      }
    ],
    highlights: [
      { label: "One-Click Payroll Run", desc: "Calculates salary, overtime, PF, ESI, and tax deductions with one click." },
      { label: "Mobile Attendance & Leave", desc: "Staff can check attendance, apply for leave, and view holiday lists on their phone." },
      { label: "Paperless Onboarding", desc: "New team members upload their Aadhaar, PAN, and certificates online before joining." },
      { label: "Goal & Review Tracking", desc: "Clear quarterly appraisal forms keep managers and employees aligned on performance." }
    ],
    outcome:
      "The HR team transformed from spending weeks on paperwork to running payroll smoothly in under an hour. Salary slips are delivered on time without mistakes, employee trust has improved, and HR managers now focus on hiring and employee growth instead of manual spreadsheets."
  },

  "crm-pipeline": {
    slug: "crm-pipeline",
    name: "CRM Pipeline & Customer Suite",
    industry: "Sales & Distribution",
    type: "Cloud SaaS",
    product: "crm",
    clientScale: "180 Enterprise Sales Agents • 45,000+ Monthly Leads • 12 Global Regions",
    timeline: "10 Weeks (Pipeline Discovery to Global Team Adoption)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "WhatsApp Business API", "Email Sync Engine"],
    overview:
      "A B2B enterprise software and logistics provider with 180 sales agents across multiple countries was losing valuable deals because inquiries were scattered across personal email inboxes, messaging apps, and separate spreadsheets. Sales managers had no visibility into active deals or sales team follow-up speeds.",
    challenge:
      "Hot sales leads took over 18 hours to receive a first response, by which time potential clients had already contacted competitors. Sales reps spent hours manually typing meeting notes and preparing price quotations instead of talking to prospects. Deals frequently stalled in the pipeline because there was no automatic reminder system to prompt follow-ups.",
    objectives: [
      "Collect leads automatically from website forms, emails, WhatsApp, and social media ads into one dashboard.",
      "Assign leads intelligently to the right sales reps based on region, language, and deal size.",
      "Automate email and WhatsApp follow-up reminders so no lead goes cold.",
      "Provide one-click professional quotation and proposal generation with digital signatures.",
      "Give sales leadership real-time revenue forecasts and team performance analytics.",
      "Connect seamlessly with customer support, billing, and accounting software."
    ],
    solution:
      "DEZORYN implemented CRM Pipeline across all sales teams. Inbound leads are captured instantly and routed to available sales reps within seconds. Automated WhatsApp and email templates ensure leads get helpful responses immediately. Reps can generate branded PDF quotes with one click and track when clients open them. Sales managers get a visual pipeline board showing exact deal values, closing dates, and expected revenue.",
    architecture:
      "Fast, cloud-based platform built to handle heavy lead flows with instant page loading. Integrated with WhatsApp Business API, email servers, and phone systems so sales calls and messages are logged automatically. Live dashboard charts refresh in real time as deals move forward.",
    implementation: [
      "Phase 1: Sales Process Mapping — Analyzed sales stages, deal qualification criteria, and pricing discount approval rules.",
      "Phase 2: Multi-Channel Lead Ingestion — Connected website forms, LinkedIn lead ads, incoming email inboxes, and WhatsApp numbers.",
      "Phase 3: Quotation & Template Design — Built custom quotation templates that auto-fill product pricing, tax calculations, and terms.",
      "Phase 4: Sales Team Training — Conducted hands-on roleplay training for 180 sales agents and managers across 3 time zones.",
      "Phase 5: Live Cutover & Analytics Dashboard — Launched live with executive sales scorecards and real-time conversion tracking."
    ],
    metrics: [
      {
        metric: "Instant",
        title: "Multi-Channel Inbound Ingestion",
        label: "Multi-Channel Inbound Ingestion",
        category: "Lead Acquisition",
        desc: "Captures potential customer inquiries from website forms, incoming emails, and WhatsApp campaigns into a unified pipeline board.",
        change: "Instant"
      },
      {
        metric: "Automated",
        title: "Intelligent Sales Rep Assignment",
        label: "Intelligent Sales Rep Assignment",
        category: "Pipeline Velocity",
        desc: "Assigns new leads to appropriate regional consultants with automated WhatsApp follow-up templates sent in seconds.",
        change: "Automated"
      },
      {
        metric: "2 Minutes",
        title: "Branded Digital Quotation Builder",
        label: "Branded Digital Quotation Builder",
        category: "Sales Enablement",
        desc: "Sales agents generate customized PDF price proposals with company branding, tax rules, and digital signature acceptance.",
        change: "2 Minutes"
      },
      {
        metric: "Real-Time",
        title: "Executive Revenue Forecasting",
        label: "Executive Revenue Forecasting",
        category: "Revenue Intelligence",
        desc: "Leadership visualizes active pipeline stages, closing probabilities, and team follow-up speeds on live interactive dashboards.",
        change: "Real-Time"
      }
    ],
    highlights: [
      { label: "Visual Deal Pipeline", desc: "Drag-and-drop deal cards showing exactly which stage every sales opportunity is in." },
      { label: "Automated Lead Assignment", desc: "Sends new inquiries to the right sales agent within seconds of submission." },
      { label: "Fast Branded Quotes", desc: "Generates clean, professional PDF quotations with custom pricing in minutes." },
      { label: "Activity & Call Tracking", desc: "Automatically logs calls, emails, and WhatsApp messages in the client timeline." }
    ],
    outcome:
      "Sales teams closed 40% more deals in their first quarter on the new CRM. Leads are contacted in minutes, client proposals are sent the same day, and management can forecast monthly revenue with 95% accuracy."
  },

  "super-whatsapp-scale": {
    slug: "super-whatsapp-scale",
    name: "Super Whatsapp Marketing Platform",
    industry: "E-Commerce & Retail",
    type: "Marketing & Support API",
    product: "super-whatsapp",
    clientScale: "1.2 Million Consumers • 45,000 Inquiries Daily • 120 Support Agents",
    timeline: "6 Weeks (Official Meta Cloud API Setup to Full Launch)",
    tech: ["Node.js", "Meta Cloud WhatsApp API", "Redis", "PostgreSQL", "Shopify / WooCommerce APIs", "Docker"],
    overview:
      "A popular direct-to-consumer lifestyle brand was receiving tens of thousands of customer messages every day across WhatsApp, Instagram, and website chat. Using regular WhatsApp Business phones was chaotic: messages were missed, customer chats were locked on individual phones, and there was no way to send promotional broadcast messages safely without getting numbers banned.",
    challenge:
      "Customer response times exceeded 3 hours during festive sales. When customers asked common questions about order tracking, return requests, or product availability, support agents had to manually copy-paste tracking links from another screen. The marketing team wanted to send personalized product offers to past buyers on WhatsApp, but risked number bans using unauthorized tools.",
    objectives: [
      "Connect the official Meta Cloud WhatsApp Business API with a verified green tick badge.",
      "Give all 120 support agents a shared team inbox with multi-agent logins on a single company number.",
      "Deploy an intelligent chatbot to answer order tracking, returns, and FAQs automatically 24/7.",
      "Enable personalized bulk marketing campaigns with high delivery and open rates.",
      "Sync customer orders directly with Shopify, WooCommerce, and shipping courier tracking.",
      "Track agent response times, customer satisfaction ratings, and campaign sales ROI."
    ],
    solution:
      "DEZORYN deployed Super Whatsapp integrated with the official Meta Cloud API. All 120 support staff now work from one shared dashboard where chats are automatically assigned to available agents. A smart 24/7 bot answers 65% of repetitive questions instantly, including live courier order tracking. The marketing team sends rich catalog promotions with interactive buy buttons, generating direct sales inside WhatsApp.",
    architecture:
      "High-speed messaging infrastructure built on official Meta Cloud APIs capable of processing 10,000+ messages per minute during big sales events. Integrated directly with e-commerce databases and shipping APIs to fetch live order statuses in under one second without human effort.",
    implementation: [
      "Phase 1: Meta Verification & Green Tick — Completed business verification with Meta and secured the official green checkmark on the WhatsApp number.",
      "Phase 2: Shared Inbox & Team Routing — Set up agent teams (Sales, Support, Returns) with automatic round-robin chat distribution.",
      "Phase 3: Automated Bot Development — Built conversational flows for order tracking, size guides, return requests, and store locations.",
      "Phase 4: E-commerce & Courier Sync — Connected Shopify orders and delivery tracking so customers get live updates by simply sharing their order ID.",
      "Phase 5: Marketing Broadcast Launch — Trained the marketing team on template approvals, customer segmentation, and campaign tracking."
    ],
    metrics: [
      {
        metric: "Official API",
        title: "Meta Verified Green Tick Infrastructure",
        label: "Meta Verified Green Tick Infrastructure",
        category: "Messaging Security",
        desc: "Official Meta Cloud WhatsApp API setup with verified green tick badge, ensuring zero risk of account blocks during heavy traffic.",
        change: "Official API"
      },
      {
        metric: "Unified",
        title: "Multi-Agent Shared Team Inbox",
        label: "Multi-Agent Shared Team Inbox",
        category: "Support Velocity",
        desc: "Enables dozens of support and sales agents to respond simultaneously from one official company WhatsApp number.",
        change: "Unified"
      },
      {
        metric: "24/7 Bot",
        title: "Automated Courier Order Tracking",
        label: "Automated Courier Order Tracking",
        category: "Self-Service",
        desc: "Intelligent chatbot answers order tracking questions, return policies, and product queries instantly by connecting to courier APIs.",
        change: "24/7 Bot"
      },
      {
        metric: "Interactive",
        title: "Rich Catalog Broadcast Campaigns",
        label: "Rich Catalog Broadcast Campaigns",
        category: "Marketing Conversion",
        desc: "Sends personalized marketing messages with clickable product images, quick-reply buttons, and direct checkout links.",
        change: "Interactive"
      }
    ],
    highlights: [
      { label: "Official Green Tick API", desc: "Safe, verified messaging approved by Meta with zero risk of number bans." },
      { label: "Shared Team Inbox", desc: "Multiple agents answer customer inquiries from one central company WhatsApp number." },
      { label: "24/7 Order Tracking Bot", desc: "Customers track their parcel status instantly without waiting for an agent." },
      { label: "Rich Catalog Marketing", desc: "Send picture cards with quick-reply buttons and checkout links to past buyers." }
    ],
    outcome:
      "Customer satisfaction jumped to 96% as inquiries were answered in seconds instead of hours. The marketing team generated record sales during festival seasons through interactive WhatsApp broadcasts, while the support team handled three times more volume without hiring additional staff."
  },

  "school-master-erp": {
    slug: "school-master-erp",
    name: "School Master ERP",
    industry: "Education",
    type: "SaaS",
    product: "school-master",
    clientScale: "4,800 Students • 180 Teachers • K-12 Complete School",
    timeline: "8 Weeks (Setup, Data Migration & School Launch)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Report Card PDF Generator", "Payment Gateways", "SMS Alerts"],
    overview:
      "An established private K-12 school was managing its academic operations using separate Excel sheets for fee records, student admissions, library books, and exam results. Teachers spent hours calculating term grades by hand, leading to late report cards and stressed administrative staff.",
    challenge:
      "Preparing student report cards at the end of every term took teachers two weeks of manual math, resulting in calculation mistakes and parent complaints. Fee payment records were kept in paper registers, making it hard to identify fee defaulters. Parents had no easy way to check their child's daily attendance or homework assignments.",
    objectives: [
      "Automate student admissions, personal records, and transfer certificates.",
      "Create digital fee ledgers with automatic SMS reminders for pending dues.",
      "Automate examination grading, GPA calculation, and board-compliant report cards.",
      "Provide a parent portal for attendance, homework notices, and school announcements.",
      "Manage school library inventory, book issue tracking, and fine management.",
      "Simplify staff leave applications and daily teacher substitution schedules."
    ],
    solution:
      "DEZORYN configured School Master ERP to handle the entire school lifecycle. The system automates grade calculations and prints official report cards with one click. Parents receive automatic fee reminders with online payment links and can view their child's daily attendance and homework on their phone. When a teacher takes leave, the software suggests substitute teachers automatically.",
    architecture:
      "Secure cloud-based school software accessible from desktop browsers and mobile devices. Database records are backed up daily with strict role permissions so teachers only edit marks for their assigned classes.",
    implementation: [
      "Phase 1: Academic Structure Setup — Configured grade levels, sections, grading rubrics, and CBSE examination guidelines.",
      "Phase 2: Student & Staff Data Migration — Imported 4,800 student records, fee categories, and staff profiles from spreadsheets.",
      "Phase 3: Teacher Grading Workshop — Trained 180 teachers on entering subject marks and publishing class homework online.",
      "Phase 4: Fee & Billing Setup — Configured tuition fee schedules, discount rules, and online payment gateway.",
      "Phase 5: Parent Mobile Launch — Released the parent login portal with video instructions sent via SMS."
    ],
    metrics: [
      {
        metric: "One-Click",
        title: "Automated Report Card Generation",
        label: "Automated Report Card Generation",
        category: "Academic Administration",
        desc: "Calculates board-compliant GPA, term percentages, and grade cards with instant PDF export.",
        change: "One-Click"
      },
      {
        metric: "94.5%",
        title: "Automated Fee Collection Reminders",
        label: "Automated Fee Collection Reminders",
        category: "Tuition Recovery",
        desc: "Sends timely SMS and WhatsApp payment notices with instant digital receipts directly to parent smartphones.",
        change: "94.5%"
      },
      {
        metric: "3 Mins",
        title: "Intelligent Teacher Substitution",
        label: "Intelligent Teacher Substitution",
        category: "Faculty Operations",
        desc: "Allocates substitute teachers based on period availability and subject specialization when teachers request emergency leave.",
        change: "3 Mins"
      },
      {
        metric: "100% Digital",
        title: "Unified Parent-School Communication",
        label: "Unified Parent-School Communication",
        category: "Parent Experience",
        desc: "Direct mobile access to attendance records, daily homework, bus tracking, and school notices.",
        change: "100% Digital"
      }
    ],
    highlights: [
      { label: "One-Click Report Cards", desc: "Automatically calculates percentage, GPA, and subject ranks according to board rules." },
      { label: "Instant Fee Reminders", desc: "Sends polite SMS and WhatsApp reminders to parents with direct payment links." },
      { label: "Smart Teacher Substitution", desc: "Suggests free teachers automatically when someone applies for emergency leave." },
      { label: "Digital Student Records", desc: "Complete record of attendance, behavior, medical notes, and grades in one profile." }
    ],
    outcome:
      "The school saved hundreds of administrative hours every term. Report cards are published on time without calculation errors, fee collections are regular and organized, and parents feel informed and connected to their child's daily progress."
  },

  "coaching-master-academy": {
    slug: "coaching-master-academy",
    name: "Coaching Master Test Prep Engine",
    industry: "Education & Coaching",
    type: "EdTech Platform",
    product: "coaching-master",
    clientScale: "6,500 Enrolled Students • 4 City Branches • 120 Test Series",
    timeline: "6 Weeks (Question Bank Setup & Student App Rollout)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Android & iOS Apps", "Video Streaming APIs"],
    overview:
      "A competitive exam coaching institute preparing students for engineering, medical, and civil services exams was conducting weekly mock tests on physical paper OMR sheets. Evaluating thousands of paper sheets took days, delaying test feedback and making it hard for students to know where they needed to improve.",
    challenge:
      "OMR paper sheets were slow to scan and evaluate, meaning students received mock test ranks 5 to 7 days after the exam. Parents were worried because they could not see whether their children were attending classes or how they were scoring compared to batch averages. Managing student fee installment plans across 4 branches was messy and led to overdue fees.",
    objectives: [
      "Launch an online mock testing platform that mimics real exam interfaces (like JEE, NEET, and UPSC).",
      "Provide instant test results, negative marking calculation, and all-India percentile ranks.",
      "Generate personalized student analytics highlighting weak topics and time spent per question.",
      "Track student biometric classroom attendance with instant SMS alerts to parents.",
      "Automate course fee installments with digital receipts and payment due reminders.",
      "Offer an online library of video lectures, study notes, and recorded class replays."
    ],
    solution:
      "DEZORYN launched Coaching Master with an online test engine and student mobile app. Students take practice tests on their phones or laptops with exact real-exam countdown timers. The moment a test finishes, students see their score, rank, and a detailed topic-wise breakdown of their strong and weak areas. Parents receive attendance alerts, and course fee installments are tracked automatically.",
    architecture:
      "High-speed test delivery cloud capable of hosting thousands of students taking exams simultaneously without lag. The question bank is encrypted to prevent leaks, and randomized question order stops cheating in practice centers.",
    implementation: [
      "Phase 1: Question Bank Upload — Uploaded over 35,000 multi-choice questions with full step-by-step solutions and video explanations.",
      "Phase 2: Exam Pattern Configuration — Set up scoring rules, negative marking formulas, and section time limits for JEE, NEET, and Foundation batches.",
      "Phase 3: Branch Attendance Sync — Installed biometric attendance scanners at all 4 branch entrances.",
      "Phase 4: Student Mobile App Launch — Onboarded 6,500 students with app logins for live tests, video lectures, and notes.",
      "Phase 5: Faculty Training & Go-Live — Trained 45 teachers on creating custom weekly quizzes and checking student progress charts."
    ],
    metrics: [
      {
        metric: "Instant",
        title: "Automated Test Results & Percentile Ranks",
        label: "Automated Test Results & Percentile Ranks",
        category: "Assessment Speed",
        desc: "Calculates scores, negative marking, and all-India percentile ranks within seconds of exam submission.",
        change: "Instant"
      },
      {
        metric: "4.8x",
        title: "High-Frequency Online Practice Engine",
        label: "High-Frequency Online Practice Engine",
        category: "Student Practice",
        desc: "Unlimited online mock tests mimicking actual competitive exam countdown timers, question palettes, and rules.",
        change: "4.8x"
      },
      {
        metric: "Personalized",
        title: "Deep Weak-Area Topic Analysis",
        label: "Deep Weak-Area Topic Analysis",
        category: "Academic Analytics",
        desc: "Identifies specific syllabus chapters, questions, and concept gaps where students lose marks.",
        change: "Personalized"
      },
      {
        metric: "Automated",
        title: "Batch Fee Installment Management",
        label: "Batch Fee Installment Management",
        category: "Financial Operations",
        desc: "Digitally schedules and tracks installment payments with automated WhatsApp reminders and online payment options.",
        change: "Automated"
      }
    ],
    highlights: [
      { label: "Real-Exam Testing Screen", desc: "Prepares students with exact exam timers, question palettes, and negative marking." },
      { label: "Weak Topic Analysis", desc: "Shows students exactly which chapters or concepts they need to revise before the final exam." },
      { label: "Instant Percentile Ranks", desc: "Shows students their rank among all test takers immediately after submitting answers." },
      { label: "Video Lectures & Notes", desc: "Lets students re-watch difficult class topics from home on their mobile app." }
    ],
    outcome:
      "Student test performance and confidence improved significantly due to instant feedback and regular practice. Student retention rose by 28%, test evaluations no longer require manual paper scanning, and parents stay updated with their child's academic progress every week."
  },

  "college-master-campus": {
    slug: "college-master-campus",
    name: "College Master Multi-Faculty ERP",
    industry: "Higher Education",
    type: "Campus ERP",
    product: "college-master",
    clientScale: "9,200 Students • 8 Degree Faculties • 450 Faculty & Staff",
    timeline: "16 Weeks (University System Integration & Campus Launch)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Cloud File Storage", "Student Mobile App"],
    overview:
      "A prestigious university campus with eight academic departments (Engineering, Commerce, Science, Arts, Management, Law, Pharmacy, and Computer Applications) was running on separate office software for student admissions, examination schedules, library books, and fee counters. Students stood in long lines outside the accounts office, and university exam audits required weeks of manual paperwork.",
    challenge:
      "Managing elective course registrations and semester fee payments for over 9,000 students caused massive campus congestion. Departmental heads could not track faculty workload or student attendance in real time. Calculating semester grade point averages (SGPA and CGPA) across diverse credit systems was slow and led to student grade verification queues.",
    objectives: [
      "Unify student registration, elective selection, and semester admissions into a single student portal.",
      "Automate credit-based semester grading (SGPA/CGPA) aligned with University Grants Commission (UGC) guidelines.",
      "Enable online semester fee payment with instant receipts and student clearance certificates.",
      "Provide digital hall tickets and examination room seating plans automatically.",
      "Manage multi-faculty library book checkouts with RFID and digital book catalogs.",
      "Automate training and placement cell workflows for campus recruitment drives."
    ],
    solution:
      "DEZORYN deployed College Master ERP across all university departments. Students select elective courses, view their class timetables, pay semester fees, and download exam hall tickets from an easy self-service portal. Faculty members enter internal assessment marks online, which automatically calculate semester grades. The placement cell tracks company interview rounds and job offers seamlessly.",
    architecture:
      "Enterprise campus cloud system supporting high concurrent student logins during semester registration and exam result days. Backed by secure database storage, automatic student transcript archiving, and role-based permissions for deans, professors, and administrative staff.",
    implementation: [
      "Phase 1: Academic Curriculum Mapping — Configured credit systems, prerequisite courses, and grading rules across all 8 degree faculties.",
      "Phase 2: Student History Migration — Imported 9,200 student records, previous semester transcripts, and fee accounts.",
      "Phase 3: Faculty Portal Rollout — Trained 450 professors and teaching assistants on recording attendance and internal assessment marks.",
      "Phase 4: Examination & Grading Trial — Ran automated CGPA calculations for past exam batches to verify 100% university grade accuracy.",
      "Phase 5: Student Portal Launch — Released the student web portal and mobile app with single-sign-on access."
    ],
    metrics: [
      {
        metric: "10 Minutes",
        title: "Self-Service Course & Elective Registration",
        label: "Self-Service Course & Elective Registration",
        category: "Student Services",
        desc: "Streamlines semester elective selection and credits registration online, removing campus administrative queues.",
        change: "10 Minutes"
      },
      {
        metric: "100% Online",
        title: "University Fee Clearance & Digital Receipts",
        label: "University Fee Clearance & Digital Receipts",
        category: "Treasury Management",
        desc: "Allows students to pay semester dues digitally with instant clearance slips and hall ticket unlocking.",
        change: "100% Online"
      },
      {
        metric: "Automated",
        title: "UGC-Compliant SGPA & CGPA Calculation",
        label: "UGC-Compliant SGPA & CGPA Calculation",
        category: "Examination Management",
        desc: "Computes semester grade point averages across multiple departments and credit systems with zero manual math.",
        change: "Automated"
      },
      {
        metric: "Integrated",
        title: "Campus Training & Placement Portal",
        label: "Campus Training & Placement Portal",
        category: "Corporate Relations",
        desc: "Coordinates recruiter schedules, student resumes, shortlisting criteria, and offer letters in one unified workspace.",
        change: "Integrated"
      }
    ],
    highlights: [
      { label: "Self-Service Student Portal", desc: "Students choose elective courses, pay fees, and download hall tickets online." },
      { label: "Automated CGPA Grading", desc: "Calculates semester grades and university transcripts accurately in minutes." },
      { label: "Campus Placement Desk", desc: "Coordinates company job drives, student resumes, and selection rounds in one place." },
      { label: "Digital Library Management", desc: "Tracks thousands of physical and digital books with easy search and renewal." }
    ],
    outcome:
      "Campus operations became completely modern and orderly. Administrative lines outside college counters disappeared, exam results are released weeks earlier, and academic deans now have real-time visibility into attendance and department performance."
  },

  "legal-docs-automation": {
    slug: "legal-docs-automation",
    name: "Legal Docs Contract Intelligence",
    industry: "Legal & Corporate",
    type: "Document Automation",
    product: "legal-docs",
    clientScale: "18,000+ Legal Contracts • 45 Corporate Lawyers • 6 Enterprise Clients",
    timeline: "10 Weeks (Template Digitization to Secure Rollout)",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Aadhaar eSign & DocuSign APIs", "Document OCR Engine", "AWS S3 Vault"],
    overview:
      "A corporate legal department and enterprise advisory firm was managing thousands of vendor contracts, client agreements, non-disclosure agreements (NDAs), and employment letters using manual Word documents and paper signature folders. Reviewing routine agreements took days, and tracking contract renewal deadlines on spreadsheets frequently resulted in missed notice periods.",
    challenge:
      "Drafting standard legal contracts required lawyers to copy-paste clauses manually, which caused typos, outdated legal terms, and inconsistent formatting. When contracts needed signatures, physical papers had to be couriered to multiple directors, causing weeks of delay. Tracking expiry dates, indemnity clauses, and renewal deadlines was difficult and created compliance risks.",
    objectives: [
      "Create a smart legal template library with pre-approved clauses for fast, standardized contract drafting.",
      "Enable secure digital signatures (Aadhaar eSign & DocuSign compliant) to eliminate paper printing.",
      "Automate contract renewal alerts so legal teams never miss an expiry deadline.",
      "Provide full version control showing who changed which clause, when, and why.",
      "Set up an encrypted contract repository with instant keyword and clause search.",
      "Establish approval workflows so high-value contracts automatically route to senior partners."
    ],
    solution:
      "DEZORYN implemented Legal Docs Automation to streamline contract lifecycles. Business teams can now generate standard agreements in minutes using pre-approved legal templates. Contracts route automatically to managers for approval and to clients for digital signing. The encrypted vault sends automatic alerts 60 and 30 days before contract expiry dates, ensuring zero missed renewals.",
    architecture:
      "High-security legal vault with bank-level 256-bit encryption for all documents at rest and in transit. Every draft change, comment, and digital signature is stamped with an immutable time log, providing audit-proof legal evidence.",
    implementation: [
      "Phase 1: Legal Clause Library Setup — Standardized over 150 corporate contract templates including NDAs, vendor master service agreements, and employment contracts.",
      "Phase 2: Digital Signature Integration — Connected Aadhaar eSign and international e-signature APIs for instant paperless signing.",
      "Phase 3: Approval Matrix Configuration — Set up automated routing rules based on contract value, department, and risk level.",
      "Phase 4: Contract Vault Migration — Scanned, indexed, and imported 18,000+ historical contracts with automatic text recognition (OCR).",
      "Phase 5: Legal Team Training — Trained 45 lawyers and business managers on template drafting and tracking."
    ],
    metrics: [
      {
        metric: "15 Minutes",
        title: "Standardized Legal Clause Template Builder",
        label: "Standardized Legal Clause Template Builder",
        category: "Contract Drafting",
        desc: "Generates watertight corporate agreements and NDAs using verified legal clauses without manual formatting.",
        change: "15 Minutes"
      },
      {
        metric: "Instant",
        title: "Legally Compliant Digital Signatures",
        label: "Legally Compliant Digital Signatures",
        category: "Execution Velocity",
        desc: "Captures Aadhaar eSign and DocuSign compliant approvals on mobile and desktop without paper printing or couriers.",
        change: "Instant"
      },
      {
        metric: "100% Tracked",
        title: "Automated Expiry & Renewal Alerts",
        label: "Automated Expiry & Renewal Alerts",
        category: "Compliance & Risk",
        desc: "Proactively alerts legal teams 60 and 30 days before contract expiry dates to prevent inadvertent renewal lapses.",
        change: "100% Tracked"
      },
      {
        metric: "256-Bit",
        title: "Encrypted Enterprise Document Vault",
        label: "Encrypted Enterprise Document Vault",
        category: "Information Security",
        desc: "Centralizes historical agreements with instant text search, clause indexing, and immutable audit logs.",
        change: "256-Bit"
      }
    ],
    highlights: [
      { label: "Pre-Approved Clause Library", desc: "Business teams create legally sound agreements in minutes without making drafting errors." },
      { label: "Instant Digital Signatures", desc: "Sign agreements securely from any phone or computer without paper or couriers." },
      { label: "Automatic Renewal Alerts", desc: "Timely alerts notify lawyers months before a contract expires." },
      { label: "Smart Search Vault", desc: "Find any agreement or specific clause across thousands of files in seconds." }
    ],
    outcome:
      "Contract turnaround speed improved dramatically from two weeks to under a single business day. Legal counsel spends less time re-typing routine agreements and more time on high-value advisory, while business executives close customer deals faster with instant electronic signatures."
  }
};
