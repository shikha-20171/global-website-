"use client";
import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Activity,
  Zap,
  TrendingUp,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Layers,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  Database,
  Sliders,
  Check
} from "lucide-react";

// Generate rich, context-aware module data based on module name and product
function getModuleData(product, moduleName) {
  const m = (moduleName || "").toLowerCase();
  const prodSlug = (product?.slug || "").toLowerCase();
  const prodName = product?.name || "Platform";

  // 1. Schooly Core (K-12 Multi-Campus ERP)
  if (prodSlug === "schooly-core") {
    if (m.includes("parent") || m.includes("portal")) {
      return {
        category: "K-12 Parent Mobile Gateway",
        kpis: [
          { label: "Active Parent Mobile Sessions", value: "3,840 Daily", change: "99.2% Push open rate", up: true, icon: Activity },
          { label: "Bus GPS Telemetry", value: "24 Buses Active", change: "Live 2-second telemetry", up: true, icon: Zap },
          { label: "Digital Homework Turned In", value: "96.4%", change: "+8.2% on-time submission", up: true, icon: TrendingUp }
        ],
        records: [
          { id: "BUS-04", title: "Route 14 Morning Run • GPS Live", sub: "Arrived at Stop 5 (Green Glen) • 18 students checked in via RFID", time: "2m ago", status: "En Route", tag: "Success" },
          { id: "HW-891", title: "Class IX Physics Motion Worksheet", sub: "42 Submissions evaluated • Teacher feedback push dispatched", time: "18m ago", status: "Evaluated", tag: "Success" },
          { id: "MSG-201", title: "Annual Sports Day Circular", sub: "Dispatched to 1,200 parent inboxes with digital RSVP consent", time: "45m ago", status: "Delivered", tag: "Active" },
          { id: "PTM-09", title: "Parent-Teacher Slot Reserved", sub: "Grade 6B • Dr. Mehra meeting confirmed for Saturday 10:30 AM", time: "2h ago", status: "Confirmed", tag: "Success" }
        ],
        aiPrompt: `Schooly Core Parent Engagement Neural Sentinel tracking bus fleet telemetry and communication reach...`,
        aiInsights: [
          { title: "Fleet Geofence Safety", desc: "Monitored 24 school transport routes with zero speed limit violations or unscheduled delays." },
          { title: "Parent Inquiry Resolution", desc: "Automated mobile bot answered 180 routine fee receipt and holiday queries in under 3 seconds." },
          { title: "Attendance Anomaly Detection", desc: "Triggered early SMS alert to parents for 6 consecutive absent students prior to roll call close." }
        ]
      };
    }
    return {
      category: "K-12 Multi-Campus School ERP",
      kpis: [
        { label: "Enrolled Campus Students", value: "2,840 Students", change: "100% Digital roster sync", up: true, icon: Layers },
        { label: "Monthly Fee Reconciliation", value: "$580,000", change: "Zero manual ledger errors", up: true, icon: TrendingUp },
        { label: "Faculty Timetable Efficiency", value: "99.8%", change: "Zero teacher overlaps", up: true, icon: ShieldCheck }
      ],
      records: [
        { id: "SCH-102", title: "CBSE Term 1 Grade Ledger Moderation", sub: "Class X Science & Math rubrics approved by Academic Principal", time: "5m ago", status: "Moderated", tag: "Success" },
        { id: "FEE-8841", title: "Quarter 3 Tuition Fee Online Payment", sub: "Roll #1024 • $1,850 credited via Stripe • Auto-receipt stamped", time: "14m ago", status: "Reconciled", tag: "Success" },
        { id: "ATT-302", title: "RFID Turnstile Entry Gate Sync", sub: "Senior wing 720 students clocked in within 12 minutes", time: "38m ago", status: "Synced", tag: "Success" },
        { id: "TT-019", title: "Automated Substitute Teacher Allocation", sub: "Period 3 English mapped to standby educator seamlessly", time: "1h ago", status: "Assigned", tag: "Success" }
      ],
      aiPrompt: `Schooly Core K-12 Academic Copilot computing classroom utilization and grading bell curves...`,
      aiInsights: [
        { title: "CBSE / ICSE Rubric Alignment", desc: "Verified grade book distributions against board guidelines with zero credit allocation flaws." },
        { title: "Instant Bus Route Optimization", desc: "Re-sequenced Route 9 stops to bypass road construction, saving 14 minutes of transit time." },
        { title: "Defaulter Recovery Engine", desc: "Automated friendly fee reminder notices recovered $78,000 in pending term dues." }
      ]
    };
  }

  // 2. Healthcare / Hospital (Dezo Care)
  if (prodSlug === "dezo-care") {
    if (m.includes("pharmacy") || m.includes("lab") || m.includes("diagnostic") || m.includes("ehr") || m.includes("patient")) {
      return {
        category: "Diagnostic & Pharmaceutical Desk",
        kpis: [
          { label: "EHR Charts Synced", value: "1,420 Patients", change: "100% ABDM M3 linked", up: true, icon: Layers },
          { label: "LIS Auto-Analyzer Feed", value: "99.8% Parsed", change: "Bi-directional sync", up: true, icon: Cpu },
          { label: "Pharmacy Stock Value", value: "$220,000", change: "Zero expired batches", up: true, icon: TrendingUp }
        ],
        records: [
          { id: "EHR-992", title: "Complete Blood Count (CBC) Panel", sub: "Automated Sysmex analyzer sync verified", time: "Just now", status: "Completed", tag: "Success" },
          { id: "RX-4109", title: "Electronic Prescription Dispensed", sub: "Inpatient Ward 3 • Amoxicillin 500mg batch verified", time: "9m ago", status: "Dispensed", tag: "Success" },
          { id: "LAB-281", title: "Biochemistry Lipid Profile Run", sub: "Critical alert flagged for physician signoff", time: "34m ago", status: "Signed Off", tag: "Active" },
          { id: "STK-114", title: "Antibiotic Batch Reorder Auto-PO", sub: "Triggered minimum reorder threshold alert", time: "2h ago", status: "Drafted", tag: "Success" }
        ],
        aiPrompt: `Clinical Drug-Drug Interaction and LIS analyzer verification neural model running...`,
        aiInsights: [
          { title: "Automated Interaction Check", desc: "Verified 240 active inpatient prescriptions with zero adverse contraindication risks." },
          { title: "Batch Expiry Prevention", desc: "Flagged 4 slow-moving insulin lots expiring in 60 days for FIFO prioritization." },
          { title: "Digital ABHA Health Sync", desc: "Directly linked 98.4% of today's outpatient lab reports to government ABDM health IDs." }
        ]
      };
    }
    return {
      category: "Clinical Inpatient & Outpatient Operations",
      kpis: [
        { label: "Active IPD Occupancy", value: "91.4% (86/94 Beds)", change: "+4 Discharges today", up: true, icon: Activity },
        { label: "OPD Triage Wait Time", value: "8.2 Minutes", change: "-42% queue reduction", up: true, icon: Zap },
        { label: "ICU / Critical Care", value: "12 Beds Monitored", change: "Sub-1s telemetry", up: true, icon: ShieldCheck }
      ],
      records: [
        { id: "BED-402", title: "Deluxe Ward 4B Admission", sub: "Dr. Sharma • Post-op telemetry sync", time: "3m ago", status: "Occupied", tag: "Success" },
        { id: "OPD-891", title: "Cardiology Consultation Queue", sub: "Token #24 called to OPD Room 102", time: "11m ago", status: "Consulting", tag: "Active" },
        { id: "IPD-308", title: "Nurse Vitals & Medication Chart", sub: "BP 120/80 • SpO2 99% • Infusion logged", time: "28m ago", status: "Recorded", tag: "Success" },
        { id: "DIS-190", title: "Discharge & Final Bill Clearance", sub: "TPA cashless authorization approved", time: "1h ago", status: "Discharged", tag: "Success" }
      ],
      aiPrompt: `Dezo Care Clinical Copilot auditing bed occupancy throughput and nurse handoff shifts...`,
      aiInsights: [
        { title: "Predictive Bed Turnover", desc: "Forecasted 14 planned discharges by 2:00 PM freeing 6 general and 8 semi-private beds." },
        { title: "Triage Bottle-neck Alert", desc: "Auto-routed 10 outpatient tokens to parallel consulting cabin to maintain sub-10m wait time." },
        { title: "Vitals Anomaly Telemetry", desc: "Telemetry monitor detected zero post-operative arrhythmia events across active ICU beds." }
      ]
    };
  }

  // 3. Real Estate (Real Estate Development ERP)
  if (prodSlug === "real-estate") {
    return {
      category: "Property Development & Inventory OS",
      kpis: [
        { label: "Available Unit Inventory", value: "142 / 480 Units", change: "72.5% Sold out", up: true, icon: Layers },
        { label: "Site Visit Conversion", value: "28.4%", change: "+5.2% this quarter", up: true, icon: TrendingUp },
        { label: "Milestone Demand Run", value: "$3.82M Due", change: "92% On-time clearing", up: true, icon: Zap }
      ],
      records: [
        { id: "APT-1204", title: "Tower A • 3BHK Unit Locked", sub: "Client deposit $50,000 received • Matrix updated", time: "5m ago", status: "Booked", tag: "Success" },
        { id: "VIS-881", title: "VIP Site Visit Completed", sub: "Chauffeur drop • Executive rating 5/5", time: "22m ago", status: "Hot Lead", tag: "Active" },
        { id: "DEM-402", title: "14th Slab Construction Demand Note", sub: "Auto-dispatched via WhatsApp with RERA escrow bank", time: "1h ago", status: "Dispatched", tag: "Success" },
        { id: "BROK-99", title: "Channel Partner Commission Payout", sub: "$18,500 brokerage reconciled after agreement", time: "3h ago", status: "Approved", tag: "Success" }
      ],
      aiPrompt: `Real Estate Conversion Velocity & Inventory Pricing Optimization AI observing lead patterns...`,
      aiInsights: [
        { title: "Dynamic Unit Yield AI", desc: "Recommended 3.5% price bump on remaining east-facing corner apartments due to high inquiry velocity." },
        { title: "Broker Engagement Score", desc: "Top 12 channel partners drove 68% of walk-ins; auto-awarded platinum incentive tier." },
        { title: "Milestone Collection Forecast", desc: "94% probability of collecting $2.4M milestone dues within 14 days based on buyer payment history." }
      ]
    };
  }

  // 4. Society Management (SocietyOS)
  if (prodSlug === "society-management") {
    return {
      category: "Gated Community Operations",
      kpis: [
        { label: "Daily Gate Check-ins", value: "482 Visitors", change: "Avg 4.8s check-in", up: true, icon: ShieldCheck },
        { label: "Maintenance Dues Collected", value: "96.8% ($298K)", change: "Zero manual ledger work", up: true, icon: TrendingUp },
        { label: "Helpdesk SLA Resolved", value: "98.2%", change: "Resolved < 4 hours", up: true, icon: Zap }
      ],
      records: [
        { id: "GATE-412", title: "Delivery Agent Pre-Approved Pass", sub: "Flat 804 • Swiggy agent entry verified by resident app", time: "1m ago", status: "Checked In", tag: "Success" },
        { id: "MAINT-109", title: "Quarterly Maintenance UPI Payment", sub: "Flat 1202 • $1,450 receipt auto-issued with digital stamp", time: "14m ago", status: "Paid", tag: "Success" },
        { id: "TKT-302", title: "Clubhouse Badminton Court Slot", sub: "Tower B Resident • 7:00 PM - 8:00 PM slot confirmed", time: "45m ago", status: "Reserved", tag: "Active" },
        { id: "SVC-891", title: "Elevator AMC Routine Inspection", sub: "Tower C Lift #2 certified by Otis engineer", time: "2h ago", status: "Inspected", tag: "Success" }
      ],
      aiPrompt: `SocietyOS Community Sentinel monitoring security kiosks, payment ledgers, and resident tickets...`,
      aiInsights: [
        { title: "Smart Gate Pass Verification", desc: "92% of guest entries pre-approved via mobile app, reducing visitor security queues to zero." },
        { title: "Maintenance Dues Automation", desc: "Polite automated reminder notices collected $52,000 in overdue maintenance without confrontation." },
        { title: "Asset Preventative Check", desc: "Flagged water pump runtime spike indicating valve leakage before resident complaints surfaced." }
      ]
    };
  }

  // 5. HRMS (Human Resource Management System)
  if (prodSlug === "hrms") {
    return {
      category: "Enterprise Workforce & People Cloud",
      kpis: [
        { label: "Monthly Payroll Run", value: "$1.02M", change: "100% Tax & PF compliant", up: true, icon: TrendingUp },
        { label: "Biometric Punch In Rate", value: "98.7% On-Time", change: "eSSL & Mobile Geofence", up: true, icon: Activity },
        { label: "Open Headcount Hired", value: "18 Positions", change: "Offer to join: 88%", up: true, icon: Zap }
      ],
      records: [
        { id: "PAY-1082", title: "Statutory Payroll Batch Finalized", sub: "Direct bank NEFT dispatch + PF / ESI / TDS challan generated", time: "4m ago", status: "Processed", tag: "Success" },
        { id: "ATT-5410", title: "Biometric Face Recognition Sync", sub: "Mumbai HQ & Bengaluru tech hub terminals reconciled", time: "16m ago", status: "Synced", tag: "Success" },
        { id: "LEV-492", title: "Annual Leave Request Approved", sub: "DevOps Engineer • 5 Days approved by Director", time: "38m ago", status: "Approved", tag: "Active" },
        { id: "HIR-204", title: "Digital Offer Letter Signed", sub: "Senior Product Designer • E-sign & welcome kit dispatched", time: "1h ago", status: "Joined", tag: "Success" }
      ],
      aiPrompt: `HRMS Neural Engine computing statutory compliance, attrition risk, and shift rosters...`,
      aiInsights: [
        { title: "Statutory Form 16 Automation", desc: "Calculated multi-slab income tax deductions with exact Section 80C exemptions for all employees." },
        { title: "Shift Overtime Optimization", desc: "Balanced weekend rotational shifts across operations, cutting unnecessary overtime payout by 22%." },
        { title: "Attrition Risk Sentinel", desc: "Flagged 3 engineering profiles with high flight risk based on PTO patterns and peer review sentiment." }
      ]
    };
  }

  // 6. CRM (Sales & Customer Relationship Management)
  if (prodSlug === "crm") {
    return {
      category: "High-Velocity Sales & Revenue Cloud",
      kpis: [
        { label: "Pipeline Value Active", value: "$1.48M", change: "42 Qualified deals", up: true, icon: TrendingUp },
        { label: "Avg Sales Cycle Speed", value: "18.4 Days", change: "-8 days acceleration", up: true, icon: Zap },
        { label: "Lead Response Velocity", value: "42 Seconds", change: "Instant webhook routing", up: true, icon: Activity }
      ],
      records: [
        { id: "DEAL-392", title: "Enterprise SaaS License Signed", sub: "$64,000 ACV • Stage moved to Won • Invoicing triggered", time: "2m ago", status: "Closed Won", tag: "Success" },
        { id: "LEAD-840", title: "Inbound VP Marketing Demo Request", sub: "Form fill routed to Enterprise AE • Calendar invite accepted", time: "12m ago", status: "Meeting Set", tag: "Active" },
        { id: "SEQ-910", title: "Automated 4-Step Email Cadence", sub: "Personalized sequence step 2 opened by prospect", time: "31m ago", status: "Engaged", tag: "Success" },
        { id: "REV-104", title: "Quarterly Revenue Quota Achieved", sub: "West Coast sales pod reached 114% of target", time: "2h ago", status: "Exceeded", tag: "Success" }
      ],
      aiPrompt: `DEZORYN Revenue Intelligence AI scoring deal velocity, win likelihood, and rep activity...`,
      aiInsights: [
        { title: "Deal Health Scoring", desc: "Identified 6 large enterprise deals with 92% win probability ready for end-of-month signature." },
        { title: "Automated Rep Attribution", desc: "Distributed 140 inbound website inquiries across reps with zero response delay." },
        { title: "Revenue Forecast Accuracy", desc: "Projected Q4 closed-won ARR within a 2.4% margin of error using historical pipeline velocity." }
      ]
    };
  }

  // 7. Super WhatsApp (Meta Business API Automation)
  if (prodSlug === "super-whatsapp") {
    return {
      category: "Conversational Commerce & Cloud API",
      kpis: [
        { label: "Messages Delivered", value: "128,400 Msgs", change: "99.8% Meta Delivery Rate", up: true, icon: Zap },
        { label: "Bot Resolution Rate", value: "84.2%", change: "Zero wait human fallback", up: true, icon: ShieldCheck },
        { label: "Campaign Click-Through", value: "32.6% CTR", change: "4.8x higher than email", up: true, icon: TrendingUp }
      ],
      records: [
        { id: "WABA-941", title: "Festive Flash Sale Broadcast", sub: "18,500 messages dispatched in 42s • 98.9% delivered", time: "Just now", status: "Sent", tag: "Success" },
        { id: "BOT-228", title: "Order Tracking Chatbot Resolution", sub: "Customer queried tracking # • Bot fetched Shopify status", time: "8m ago", status: "Resolved", tag: "Success" },
        { id: "INBOX-74", title: "Live Agent Escalation Handled", sub: "Support rep converted high-value cart inquiry in 2m", time: "24m ago", status: "Closed", tag: "Success" },
        { id: "TPL-019", title: "Payment Receipt Utility Template", sub: "Meta approved with zero quality rating dip", time: "1h ago", status: "Approved", tag: "Success" }
      ],
      aiPrompt: `Super WhatsApp Conversational Engine analyzing message delivery velocity and intent models...`,
      aiInsights: [
        { title: "Zero Template Ban Engine", desc: "Pre-screened broadcast copy against Meta spam policies with 100% green reputation score." },
        { title: "High-Throughput Bursting", desc: "Dispatched 25,000 transactional OTP notifications with average delivery latency under 800ms." },
        { title: "Interactive Cart Recovery", desc: "Interactive button nudges recovered 34 abandoned e-commerce carts generating $22,000." }
      ]
    };
  }

  // 8. School Master (Institutional School ERP)
  if (prodSlug === "school-master") {
    return {
      category: "Institutional School Operations & Governance",
      kpis: [
        { label: "Admissions Inquiries Processed", value: "640 Forms", change: "78% Entrance qualified", up: true, icon: Layers },
        { label: "Term Fee Ledger Clearance", value: "98.4%", change: "Direct bank reconcile", up: true, icon: TrendingUp },
        { label: "Bus Fleet Safety Tracked", value: "32 Vehicles", change: "100% Route geofenced", up: true, icon: ShieldCheck }
      ],
      records: [
        { id: "ADM-902", title: "Online Nursery Admission Document Verified", sub: "Birth certificate & residence proof validated by Registrar", time: "8m ago", status: "Verified", tag: "Success" },
        { id: "FEE-402", title: "Term 2 Tuition Installment Stamped", sub: "Student ID #4812 • $2,200 paid via NetBanking portal", time: "20m ago", status: "Credited", tag: "Success" },
        { id: "SCH-118", title: "Senior School Exam Hall Ticket Dispatched", sub: "Class 12 Board admit cards auto-generated with student barcode", time: "44m ago", status: "Generated", tag: "Success" },
        { id: "TRP-08", title: "Transport Maintenance Certificate", sub: "Bus #12 fitness & speed governor certified by RTO vendor", time: "2h ago", status: "Cleared", tag: "Success" }
      ],
      aiPrompt: `School Master Institutional Intelligence reviewing admission funnel and campus resource allocation...`,
      aiInsights: [
        { title: "Admission Funnel Acceleration", desc: "Converted 64% of walk-in inquiries to confirmed registrations through instant SMS follow-ups." },
        { title: "Teacher Workload Balancing", desc: "Realigned secondary grade timetable periods to eliminate 3 consecutive lecture fatigue." },
        { title: "Campus Transport Fuel Economy", desc: "Identified optimal pickup clusters reducing fleet diesel consumption by 14.5%." }
      ]
    };
  }

  // 9. Coaching Master (Test-Prep Institute ERP)
  if (prodSlug === "coaching-master") {
    return {
      category: "Test-Prep Coaching Operations",
      kpis: [
        { label: "Active Aspirants Enrolled", value: "1,850 Students", change: "JEE / NEET / Foundation", up: true, icon: Layers },
        { label: "Mock Test Series Velocity", value: "48 Tests Conducted", change: "Sub-2hr rank generation", up: true, icon: Zap },
        { label: "Installment Fee Collection", value: "97.6%", change: "Zero overdue bad debts", up: true, icon: TrendingUp }
      ],
      records: [
        { id: "TST-941", title: "All India JEE Advanced Full Mock #6", sub: "Rank list & percentile bell curve published for 1,850 students", time: "6m ago", status: "Published", tag: "Success" },
        { id: "BAT-204", title: "Super-30 Weekend Batch Timetable", sub: "Physics Rotational Dynamics masterclass scheduled in Hall 1", time: "22m ago", status: "Active", tag: "Active" },
        { id: "FEE-781", title: "Installment #3 Scholarship Waiver Applied", sub: "Merit discount 40% deducted • Net balance $1,800 received", time: "50m ago", status: "Reconciled", tag: "Success" },
        { id: "DBT-019", title: "1-on-1 Faculty Doubt Clinic Token", sub: "Organic Chemistry slot assigned to Dr. Verma at 4:00 PM", time: "1h ago", status: "Booked", tag: "Success" }
      ],
      aiPrompt: `Coaching Master Rank Analytics & Aspirant Weak-Topic Diagnoser processing test series data...`,
      aiInsights: [
        { title: "Topic Mastery Heatmap", desc: "Detected 42% batch errors in Electromagnetism; scheduled dedicated remedial workshop." },
        { title: "Rank Predictor AI", desc: "Forecasted 18 top-500 national ranks based on historical consistency in test series scores." },
        { title: "Doubt Clinic Utilization", desc: "Resolved 94% of student doubts within 24 hours of mock test completion." }
      ]
    };
  }

  // 10. College Master (Higher Education & University ERP)
  if (prodSlug === "college-master") {
    return {
      category: "Higher Education & University ERP",
      kpis: [
        { label: "Enrolled Undergrad & PG", value: "6,200 Students", change: "Across 8 Engineering & MBA Depts", up: true, icon: Layers },
        { label: "CBCS Credit Matrix Synced", value: "100% Compliant", change: "Autonomous UGC guidelines", up: true, icon: ShieldCheck },
        { label: "Campus Placement Conversion", value: "88.4%", change: "Avg Package $104k", up: true, icon: TrendingUp }
      ],
      records: [
        { id: "DEG-841", title: "Semester VII Credit Audit Approved", sub: "Dean of Academics validated 24 core and 6 elective credits", time: "10m ago", status: "Approved", tag: "Success" },
        { id: "PLC-302", title: "Tier-1 Tech Placement Drive Shortlist", sub: "142 Computer Science students cleared technical coding round", time: "26m ago", status: "Shortlisted", tag: "Active" },
        { id: "HST-991", title: "Campus Hostel Room Re-Allotment", sub: "Block 4 Triple occupancy verified with digital mess clearance", time: "48m ago", status: "Allotted", tag: "Success" },
        { id: "LIB-104", title: "IEEE Digital Library Access Token", sub: "Research scholar activated remote VPN proxy access", time: "2h ago", status: "Active", tag: "Success" }
      ],
      aiPrompt: `College Master Accreditation & Academic Credit Intelligence running NAAC and NIRF ledger sync...`,
      aiInsights: [
        { title: "NAAC Criteria 2 Automation", desc: "Compiled 100% of faculty-student ratio and teaching methodology logs for peer inspection." },
        { title: "Elective Subject Demand AI", desc: "Forecasted high enrollment in Machine Learning elective, adding 2 parallel lab sections." },
        { title: "Placement Fitment Engine", desc: "Matched 210 pre-final year students to recruiting partner tech stacks with 91% alignment." }
      ]
    };
  }

  // 11. Legal Docs (Contract Intelligence & E-Signing)
  if (prodSlug === "legal-docs") {
    return {
      category: "Contract Intelligence & Digital Signing",
      kpis: [
        { label: "Executed Agreements", value: "1,840 Contracts", change: "100% ESIGN / eIDAS legal", up: true, icon: ShieldCheck },
        { label: "Avg Sign-off Turnaround", value: "4.2 Hours", change: "Down from 12 days", up: true, icon: Zap },
        { label: "AI Clause Risk Cleared", value: "99.4%", change: "Liability caps verified", up: true, icon: TrendingUp }
      ],
      records: [
        { id: "DOC-8492", title: "Enterprise Master Services Agreement", sub: "Signed by Client CEO • SHA-256 cryptographic seal attached", time: "4m ago", status: "Executed", tag: "Success" },
        { id: "REV-302", title: "Vendor NDA Redline AI Scan", sub: "Flagged unlimited liability clause • Recommended standard $1M cap", time: "18m ago", status: "Review Ready", tag: "Active" },
        { id: "SIGN-410", title: "Sequential Multi-Party Sign-off", sub: "Finance Director signed • Auto-routed to Legal Counsel", time: "52m ago", status: "In Progress", tag: "Active" },
        { id: "VLT-118", title: "Commercial Lease Renewal Alert", sub: "Flagged 60-day auto-renewal deadline for commercial office", time: "2h ago", status: "Notified", tag: "Success" }
      ],
      aiPrompt: `Legal Intelligence NLP analyzing indemnity clauses, governing law, and e-signature audit trails...`,
      aiInsights: [
        { title: "Court-Admissible Hash Seal", desc: "Every signed document cryptographically bound to signer IP, email, and time-stamped hash." },
        { title: "Contract Leakage Prevention", desc: "AI redlining caught missing non-solicitation language in external vendor contract template." },
        { title: "Renewal Risk Alert", desc: "Identified 8 client service contracts expiring in 30 days to facilitate on-time renewals." }
      ]
    };
  }

  // Default Enterprise SaaS Workspace Telemetry
  return {
    category: `${prodName} Neural Workspace`,
    kpis: [
      { label: "Active Enterprise Nodes", value: "99.98% Uptime", change: "Sub-millisecond latency", up: true, icon: Activity },
      { label: "Security & Compliance", value: "SOC 2 Verified", change: "Continuous integrity guard", up: true, icon: ShieldCheck },
      { label: "AI Process Throughput", value: "Real-time", change: "Autonomous workflows", up: true, icon: Zap }
    ],
    records: [
      { id: "SYS-101", title: `${prodName} Production Pipeline`, sub: "Automated telemetry and real-time ledger synchronization", time: "Live Now", status: "Operational", tag: "Success" },
      { id: "SEC-204", title: "Cryptographic Audit Clearance", sub: "Enterprise end-to-end encryption verified across all tenant nodes", time: "12m ago", status: "Verified", tag: "Success" },
      { id: "JOB-508", title: "Automated Workflow Execution", sub: "Scheduled batch processing cleared with zero queue backpressure", time: "30m ago", status: "Completed", tag: "Success" }
    ],
    aiPrompt: `${prodName} Neural Agent observing real-time workload efficiency and telemetry...`,
    aiInsights: [
      { title: "Continuous Telemetry Optimization", desc: "Automated workload balancing ensuring uninterrupted SLA compliance across all zones." },
      { title: "Zero-Trust Encryption", desc: "Enforced TLS 1.3 and encrypted data-at-rest across all primary database clusters." },
      { title: "Intelligent Anomaly Detection", desc: "Autonomous monitoring identifying and resolving potential resource contention proactively." }
    ]
  };
}

export default function ModuleWorkspace({ product, activeIndex = 0, onSelectModule }) {
  const [viewMode, setViewMode] = useState("data"); // "data" | "ai"
  const [aiRunning, setAiRunning] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const modules = product?.modules || ["Dashboard", "Operations", "Analytics", "Administration"];
  const currentModule = modules[activeIndex] || modules[0];
  const data = getModuleData(product, currentModule);
  const hue = product?.hue || 215;

  const handleRunAi = () => {
    if (aiRunning) return;
    setAiRunning(true);
    setAiSuccess(false);
    setTimeout(() => {
      setAiRunning(false);
      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 5000);
    }, 1800);
  };

  const filteredRecords = data.records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#070b16] shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/15 text-electric">
            <Cpu size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-wide">{currentModule}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
            <p className="text-xs text-cool">{typeof data.category === "object" && data.category !== null ? (data.category.name || data.category.slug || "Enterprise") : (data.category || "Enterprise")} • {product?.name}</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/10 bg-black/40 p-1 text-xs">
            <button
              onClick={() => setViewMode("data")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                viewMode === "data" ? "bg-electric text-white shadow-sm" : "text-cool hover:text-white"
              }`}
            >
              <Database size={13} />
              Live Workspace
            </button>
            <button
              onClick={() => setViewMode("ai")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
                viewMode === "ai" ? "bg-electric text-white shadow-sm" : "text-cool hover:text-white"
              }`}
            >
              <Bot size={13} />
              AI Copilot & Neural Flow
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 border-b border-white/10 bg-black/20">
        {data.kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-white/20 transition group"
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl transition group-hover:scale-125"
                style={{ background: `hsl(${hue} 80% 50% / .15)` }}
              />
              <div className="flex items-center justify-between text-xs text-cool">
                <span>{kpi.label}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-electric">
                  <Icon size={13} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-white">{kpi.value}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <ArrowUpRight size={13} />
                <span>{kpi.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {viewMode === "data" ? (
            <motion.div
              key={`data-${currentModule}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Search & Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[220px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cool" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Filter ${currentModule} records...`}
                    className="w-full rounded-lg border border-white/10 bg-black/40 py-2 pl-9 pr-3 text-xs text-white placeholder-cool/60 focus:border-electric focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-cool flex items-center gap-1.5">
                    <Filter size={12} />
                    All Statuses
                  </span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-cool hover:text-white transition"
                    title="Refresh records"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              {/* Data Rows Table */}
              <div className="overflow-hidden rounded-xl border border-white/8 bg-black/30">
                <div className="grid grid-cols-[100px_1fr_120px_110px] items-center border-b border-white/10 bg-white/[0.02] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-cool">
                  <span>Record ID</span>
                  <span>Activity / Subject</span>
                  <span>Timestamp</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="divide-y divide-white/5">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="grid grid-cols-[100px_1fr_120px_110px] items-center px-4 py-3 text-xs transition hover:bg-white/[0.03] group"
                      >
                        <span className="font-mono text-[11px] text-electric">{r.id}</span>
                        <div>
                          <div className="font-medium text-white group-hover:text-electric transition">{r.title}</div>
                          <div className="text-[11px] text-cool">{r.sub}</div>
                        </div>
                        <span className="text-[11px] text-cool">{r.time}</span>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              r.tag === "Success"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : r.tag === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-electric/15 text-electric border border-electric/30"
                            }`}
                          >
                            <span className="h-1 w-1 rounded-full bg-current" />
                            {r.status}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-cool">
                      No records found matching &quot;{searchTerm}&quot;
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`ai-${currentModule}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* AI Neural Hero Banner */}
              <div className="relative overflow-hidden rounded-xl border border-electric/30 bg-gradient-to-r from-electric/10 via-purple-900/10 to-transparent p-5">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric text-white shadow-lg shadow-electric/30">
                      <Bot size={20} className={aiRunning ? "animate-spin" : ""} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">Dezoryn Neural Copilot</h4>
                        <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-electric">
                          GPT-4o & LLM Engine
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-cool">{data.aiPrompt}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleRunAi}
                    disabled={aiRunning}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition active:scale-95 ${
                      aiRunning
                        ? "bg-electric/50 cursor-not-allowed"
                        : "bg-electric hover:bg-electric-light shadow-electric/25"
                    }`}
                  >
                    {aiRunning ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        Executing Neural Pipeline...
                      </>
                    ) : aiSuccess ? (
                      <>
                        <Check size={13} className="text-emerald-300" />
                        ✓ Automation Deployed!
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Run AI Automation
                      </>
                    )}
                  </button>
                </div>

                {/* Progress bar during execution */}
                {aiRunning && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-electric via-cyan-400 to-emerald-400"
                  />
                )}
              </div>

              {/* AI Insights & Automated Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.aiInsights.map((insight, i) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-4 hover:border-electric/30 transition group"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-electric transition">
                      <Sparkles size={13} className="text-electric" />
                      <span>{insight.title}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-cool">{insight.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-electric/80 font-medium group-hover:underline cursor-pointer">
                      <span>Preview Automation Logic</span>
                      <ArrowUpRight size={11} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Activity Telemetry Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 bg-black/40 px-4 py-2.5 text-xs text-cool">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium text-white/90">Autonomous Background Daemon:</span>
            <span>0 anomalies detected • Audit compliance verified</span>
          </div>
          <span className="text-[11px] text-cool/70">Edge region: ap-south-1 (Mumbai) • SSL TLS 1.3</span>
        </div>
      </div>
    </div>
  );
}
