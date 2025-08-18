// scripts/createUser.ts
import { prisma } from "@/db/prisma";
import { hash } from "bcryptjs";

async function main() {
  const password = await hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      username: "admin",
      password,
    },
  });

  console.log("User created:", user);
}

main().catch((e) => console.error(e));
