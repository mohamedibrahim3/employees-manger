import 'dotenv/config'   // ده بيشحن .env تلقائي
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
  data: {
    username: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    password: hashedPassword,
  },
})
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
