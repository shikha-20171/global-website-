import { prisma } from "../src/config/database.js";

async function main() {
  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      roleId: true,
      status: true,
      role: { select: { id: true, name: true } },
    },
  });
  console.log("USERS IN DB:", JSON.stringify(users, null, 2));

  const roles = await prisma.role.findMany({
    include: { _count: { select: { users: true } } },
  });
  console.log("ROLES IN DB:", JSON.stringify(roles, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
