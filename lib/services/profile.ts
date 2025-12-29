import { prisma } from '@/lib/prisma'
import { profileUpdateSchema } from '@/lib/validations/profile'
import { z } from 'zod'

export async function getProfileByUserId(userId: string) {
  return await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatar: true,
        },
      },
    },
  })
}

export async function updateProfile(userId: string, data: z.infer<typeof profileUpdateSchema>) {
  const validatedData = profileUpdateSchema.parse(data)

  const cleanedData = Object.fromEntries(
    Object.entries(validatedData).map(([key, value]) => [
      key,
      value === '' ? null : value,
    ])
  ) as typeof validatedData

  return await prisma.profile.upsert({
    where: { userId },
    update: cleanedData,
    create: {
      userId,
      ...cleanedData,
    },
  })
}

export async function updateAvatar(userId: string, avatarUrl: string | null) {
  return await prisma.profile.upsert({
    where: { userId },
    update: { avatarUrl },
    create: {
      userId,
      avatarUrl,
    },
  })
}

