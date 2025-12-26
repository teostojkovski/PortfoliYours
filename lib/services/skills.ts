import { prisma } from '@/lib/prisma'
import { skillSchema, skillCategorySchema } from '@/lib/validations/skills'
import { z } from 'zod'

const DEFAULT_CATEGORIES = [
  'Frontend',
  'Backend',
  'Design',
  'DevOps',
  'Tools',
  'Soft Skills',
  'Other',
]

export async function initializeDefaultCategories(userId: string) {
  const existingCategories = await prisma.skillCategory.findMany({
    where: { userId },
  })

  if (existingCategories.length === 0) {
    await prisma.skillCategory.createMany({
      data: DEFAULT_CATEGORIES.map((name, index) => ({
        userId,
        name,
        order: index,
      })),
    })
  }
}

export async function getSkillsByUserId(userId: string) {
  await initializeDefaultCategories(userId)

  return await prisma.skill.findMany({
    where: { userId },
    include: {
      category: true,
      projectSkills: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: [
      { category: { order: 'asc' } },
      { name: 'asc' },
    ],
  })
}

export async function getCategoriesByUserId(userId: string) {
  await initializeDefaultCategories(userId)

  return await prisma.skillCategory.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  })
}

export async function getSkillsGroupedByCategory(userId: string) {
  const skills = await getSkillsByUserId(userId)
  const categories = await getCategoriesByUserId(userId)

  const grouped: Record<string, typeof skills> = {}

  // Initialize all categories
  categories.forEach((cat) => {
    grouped[cat.id] = []
  })

  // Group skills by category
  skills.forEach((skill) => {
    if (!grouped[skill.categoryId]) {
      grouped[skill.categoryId] = []
    }
    grouped[skill.categoryId].push(skill)
  })

  return { grouped, categories, skills }
}

export async function createSkill(userId: string, data: z.infer<typeof skillSchema>) {
  const validatedData = skillSchema.parse(data)

  // Check if skill name already exists for this user
  const existing = await prisma.skill.findUnique({
    where: {
      userId_name: {
        userId,
        name: validatedData.name,
      },
    },
  })

  if (existing) {
    throw new Error('Skill with this name already exists')
  }

  const { projectIds, ...skillData } = validatedData

  const skill = await prisma.skill.create({
    data: {
      ...skillData,
      userId,
      lastUsedAt: validatedData.lastUsedAt || null,
    },
  })

  // Link projects if provided
  if (projectIds && projectIds.length > 0) {
    await prisma.projectSkill.createMany({
      data: projectIds.map((projectId) => ({
        skillId: skill.id,
        projectId,
        projectType: 'portfolio', // Default, can be enhanced later
      })),
      skipDuplicates: true,
    })
  }

  return skill
}

export async function updateSkill(skillId: string, userId: string, data: z.infer<typeof skillSchema>) {
  const validatedData = skillSchema.parse(data)

  // Verify ownership
  const existing = await prisma.skill.findFirst({
    where: { id: skillId, userId },
  })

  if (!existing) {
    throw new Error('Skill not found')
  }

  // Check name uniqueness if changed
  if (validatedData.name !== existing.name) {
    const nameExists = await prisma.skill.findUnique({
      where: {
        userId_name: {
          userId,
          name: validatedData.name,
        },
      },
    })

    if (nameExists) {
      throw new Error('Skill with this name already exists')
    }
  }

  const { projectIds, ...skillData } = validatedData

  const skill = await prisma.skill.update({
    where: { id: skillId },
    data: {
      ...skillData,
      lastUsedAt: validatedData.lastUsedAt || null,
    },
  })

  // Update project links
  if (projectIds !== undefined) {
    // Remove existing links
    await prisma.projectSkill.deleteMany({
      where: { skillId },
    })

    // Add new links
    if (projectIds.length > 0) {
      await prisma.projectSkill.createMany({
        data: projectIds.map((projectId) => ({
          skillId: skill.id,
          projectId,
          projectType: 'portfolio',
        })),
        skipDuplicates: true,
      })
    }
  }

  return skill
}

export async function deleteSkill(skillId: string, userId: string) {
  const skill = await prisma.skill.findFirst({
    where: { id: skillId, userId },
  })

  if (!skill) {
    throw new Error('Skill not found')
  }

  await prisma.skill.delete({
    where: { id: skillId },
  })
}

export async function createCategory(userId: string, data: z.infer<typeof skillCategorySchema>) {
  const validatedData = skillCategorySchema.parse(data)

  return await prisma.skillCategory.create({
    data: {
      ...validatedData,
      userId,
    },
  })
}

export async function updateCategory(categoryId: string, userId: string, data: z.infer<typeof skillCategorySchema>) {
  const validatedData = skillCategorySchema.parse(data)

  return await prisma.skillCategory.update({
    where: { id: categoryId },
    data: validatedData,
  })
}

export async function deleteCategory(categoryId: string, userId: string) {
  // Check if category has skills
  const skillsCount = await prisma.skill.count({
    where: { categoryId },
  })

  if (skillsCount > 0) {
    throw new Error('Cannot delete category with existing skills')
  }

  await prisma.skillCategory.delete({
    where: { id: categoryId },
  })
}

