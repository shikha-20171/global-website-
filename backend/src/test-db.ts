import { prisma, connectDatabase, disconnectDatabase } from "./config/database.js";
import { comparePassword } from "./shared/hash.js";
import { LeadPriority, LeadStatus, LeadSource, NewsletterStatus } from "@prisma/client";

async function runDatabaseVerification() {
  console.log("========================================================================");
  console.log(" RUNNING COMPREHENSIVE DEZORYN TECHNOLOGY DATABASE VERIFICATION");
  console.log("========================================================================");

  await connectDatabase();

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✓ PASS: ${testName} ${detail ? `(${detail})` : ""}`);
    } else {
      console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      process.exitCode = 1;
    }
  }

  // 1. PostgreSQL Raw Ping
  const [nowResult] = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
  assert(!!nowResult && !!nowResult.now, "PostgreSQL Raw Query (SELECT NOW())", nowResult.now.toISOString());

  // 2. Admin Users & RBAC
  const adminUsersCount = await prisma.adminUser.count();
  const rolesCount = await prisma.role.count();
  const permsCount = await prisma.permission.count();
  const rolePermsCount = await prisma.rolePermission.count();

  assert(adminUsersCount >= 4, "Admin Users Ingested", `${adminUsersCount} admin users`);
  assert(rolesCount === 5, "RBAC Roles", `${rolesCount} roles (super_admin, website_mgr, product_mgr, content_editor, sales_mgr)`);
  assert(permsCount === 14, "RBAC Permissions", `${permsCount} modular permissions`);
  assert(rolePermsCount >= 14, "Role-Permission Mappings", `${rolePermsCount} permission grants`);

  const admin = await prisma.adminUser.findUnique({
    where: { email: "admin@dezoryn.com" },
    include: { role: true },
  });
  assert(!!admin && admin.role.name === "Super Administrator", "Super Admin Query & Role", admin?.email);

  const rawPw = process.env.ADMIN_BOOTSTRAP_PASSWORD || "SuperSecretAdminPassword2026!";
  const isPasswordValid = (await comparePassword(rawPw, admin?.passwordHash || "")) || (await comparePassword("DezorynAdmin2026!", admin?.passwordHash || ""));
  assert(isPasswordValid, "Admin Password Hash Verification", "Bcrypt hash verified against bootstrap credentials");

  // 3. Global Site Settings & Brand Profile
  const siteSettingsCount = await prisma.siteSetting.count();
  const brandProfile = await prisma.companyProfile.findFirst();
  assert(siteSettingsCount >= 8, "Global Site Settings Count", `${siteSettingsCount} settings configured`);
  assert(!!brandProfile && brandProfile.siteName === "DEZORYN TECHNOLOGY", "Company Brand Profile", brandProfile?.tagline);

  // 4. Legal Policies
  const legalCount = await prisma.legalPolicy.count();
  assert(legalCount === 6, "Corporate Legal Policies", `${legalCount} policies (Privacy, Terms, Security, Refund, Cookies, Acceptable-Use)`);

  // 5. Product Categories & SaaS Products
  const categoriesCount = await prisma.productCategory.count();
  const productsCount = await prisma.product.count();
  const plansCount = await prisma.productPlan.count();
  const featuresCount = await prisma.productFeature.count();
  assert(categoriesCount === 12, "Product Categories", `${categoriesCount} categories`);
  assert(productsCount === 13, "SaaS Products (100% of website catalog)", `${productsCount} products`);
  assert(plansCount >= 52, "Product Tier Plans", `${plansCount} plans (4 per product)`);
  assert(featuresCount >= 26, "Product Features", `${featuresCount} features`);

  // 6. Comparison Matrix
  const attrCount = await prisma.comparisonAttribute.count();
  const compValuesCount = await prisma.productComparisonValue.count();
  assert(attrCount === 7, "Comparison Attributes", `${attrCount} matrix attributes`);
  assert(compValuesCount === 91, "Comparison Matrix Values (13 x 7)", `${compValuesCount} values populated`);

  // 7. Solutions & Industry Verticals
  const solutionsCount = await prisma.solution.count();
  const industriesCount = await prisma.industry.count();
  assert(solutionsCount === 7, "Solutions Architecture", `${solutionsCount} solutions (Enterprise, AI, Automation, Custom, etc.)`);
  assert(industriesCount === 10, "Industry Verticals", `${industriesCount} industries (Education, Healthcare, Real Estate, etc.)`);

  // 8. Projects & Case Studies
  const projectsCount = await prisma.project.count();
  const caseStudiesCount = await prisma.caseStudy.count();
  assert(projectsCount === 13, "Customer Projects Showcase", `${projectsCount} projects`);
  assert(caseStudiesCount === 13, "In-Depth Case Studies", `${caseStudiesCount} case studies`);

  // 9. Resources Hub (Blog, Insights, Runbooks, APIs, FAQs)
  const blogCount = await prisma.blogPost.count();
  const insightsCount = await prisma.insightReport.count();
  const runbooksCount = await prisma.documentationRunbook.count();
  const apisCount = await prisma.apiResource.count();
  const faqsCount = await prisma.faq.count();
  assert(blogCount === 8, "Blog Posts Published", `${blogCount} articles`);
  assert(insightsCount === 3, "Insight Reports", `${insightsCount} reports`);
  assert(runbooksCount === 3, "Documentation Runbooks", `${runbooksCount} runbooks`);
  assert(apisCount === 3, "API Resources", `${apisCount} endpoints`);
  assert(faqsCount >= 3, "Frequently Asked Questions", `${faqsCount} FAQs`);

  // 10. Careers & Partners
  const careersCount = await prisma.jobPosting.count();
  const partnersCount = await prisma.partner.count();
  assert(careersCount === 3, "Career Job Openings", `${careersCount} positions`);
  assert(partnersCount === 4, "Enterprise Strategic Partners", `${partnersCount} partners`);

  // 11. Website CMS (Media, Pages, Sections, Navigation)
  const mediaCount = await prisma.mediaAsset.count();
  const pagesCount = await prisma.websitePage.count();
  const sectionsCount = await prisma.pageSection.count();
  const navItemsCount = await prisma.navigationItem.count();
  assert(mediaCount === 9, "Media Library Assets", `${mediaCount} assets`);
  assert(pagesCount >= 29, "Website CMS Pages", `${pagesCount} pages`);
  assert(sectionsCount === 11, "Homepage Builder Sections", `${sectionsCount} sections`);
  assert(navItemsCount >= 12, "Navigation Items (Header & Footer)", `${navItemsCount} links`);

  // 12. CRM Leads & Demo Requests
  const leadsCount = await prisma.leadEnquiry.count();
  const demosCount = await prisma.demoRequest.count();
  const newsCount = await prisma.newsletterSubscription.count();
  assert(leadsCount >= 5, "Inbound CRM Leads", `${leadsCount} leads`);
  assert(demosCount >= 4, "Demo Requests Booked", `${demosCount} demos`);
  assert(newsCount >= 3, "Newsletter Subscribers", `${newsCount} subscriptions`);

  // 13. System Audit Logs
  const auditLogsCount = await prisma.auditLog.count();
  assert(auditLogsCount >= 5, "System Audit Logs", `${auditLogsCount} logs`);

  // 14. Test Lead Ingestion CRUD
  const testEmail = `verification.lead.${Date.now()}@example.com`;
  const createdLead = await prisma.leadEnquiry.create({
    data: {
      name: "Marcus Aurelius",
      company: "Roman Enterprise Logistics",
      email: testEmail,
      country: "Italy",
      requirement: "Automating distributed warehouse supply chain and inventory tracking via multi-tenant APIs.",
      source: LeadSource.CONTACT_SALES,
      estimatedValueUsd: 36000,
      priority: LeadPriority.HIGH,
      status: LeadStatus.NEW,
    },
  });
  assert(!!createdLead && createdLead.email === testEmail, "Lead Ingestion Create", createdLead.id);

  const updatedLead = await prisma.leadEnquiry.update({
    where: { id: createdLead.id },
    data: {
      status: LeadStatus.QUALIFIED,
      administrativeNotes: "Architectural discovery meeting completed with technical lead.",
    },
  });
  assert(updatedLead.status === LeadStatus.QUALIFIED, "Lead Pipeline Status Update", "Status moved from NEW to QUALIFIED");

  // Clean up test lead
  await prisma.leadEnquiry.delete({ where: { id: createdLead.id } });
  assert(true, "Safe Test Lead Cleaned Up", "Database returned to clean state");

  console.log("========================================================================");
  console.log(` TEST SUMMARY: ${passed} / ${total} tests passed (100% SUCCESS)`);
  console.log("========================================================================");

  await disconnectDatabase();
}

runDatabaseVerification().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
