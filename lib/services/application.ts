import { prisma } from '@/lib/prisma'
import { applicationSchema, applicationUpdateSchema } from '@/lib/validations/application'
import { z } from 'zod'

export async function getApplicationsByUserId(userId: string, status?: string, archived?: boolean) {
  return await prisma.application.findMany({
    where: {
      userId,
      ...(status && status !== 'all' && { status }),
      ...(archived !== undefined && { isArchived: archived }),
    },
    include: {
      documents: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: [
      { isArchived: 'asc' },
      { appliedAt: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

export async function getApplicationById(applicationId: string, userId: string) {
  return await prisma.application.findFirst({
    where: { id: applicationId, userId },
    include: {
      documents: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function createApplication(
  userId: string,
  data: z.infer<typeof applicationSchema> & {
    cvFile?: { url: string; name: string; type: string; size: number }
    coverLetterFile?: { url: string; name: string; type: string; size: number }
  }
) {
  const { cvFile, coverLetterFile, ...dataToValidate } = data
  const validatedData = applicationSchema.parse(dataToValidate)

  const { cvDocumentId, coverLetterDocumentId, saveCvToDocuments, saveCoverLetterToDocuments, ...applicationData } = validatedData

  const application = await prisma.application.create({
    data: {
      ...applicationData,
      userId,
      appliedAt: validatedData.appliedAt || null,
      link: validatedData.link || null,
      notes: validatedData.notes || null,
      recruiterName: validatedData.recruiterName || null,
      recruiterEmail: validatedData.recruiterEmail || null,
      followUpAt: validatedData.followUpAt || null,
    },
  })

  if (cvDocumentId) {
    const document = await prisma.document.findFirst({
      where: { id: cvDocumentId, userId },
    })

    if (document) {
      await prisma.applicationDocument.create({
        data: {
          applicationId: application.id,
          documentId: document.id,
          type: 'CV',
          fileUrl: document.fileUrl,
          fileName: document.name,
          fileType: document.fileType,
          fileSize: document.fileSize,
        },
      })
    }
  } else if (cvFile) {
    const appDoc = await prisma.applicationDocument.create({
      data: {
        applicationId: application.id,
        documentId: null,
        type: 'CV',
        fileUrl: cvFile.url,
        fileName: cvFile.name,
        fileType: cvFile.type,
        fileSize: cvFile.size,
      },
    })

    if (saveCvToDocuments) {
      const document = await prisma.document.create({
        data: {
          userId,
          name: cvFile.name.replace(/\.[^/.]+$/, ''),
          type: 'CV',
          fileUrl: cvFile.url,
          fileType: cvFile.type,
          fileSize: cvFile.size,
        },
      })

      await prisma.applicationDocument.update({
        where: { id: appDoc.id },
        data: { documentId: document.id },
      })
    }
  }

  if (coverLetterDocumentId) {
    const document = await prisma.document.findFirst({
      where: { id: coverLetterDocumentId, userId },
    })

    if (document) {
      await prisma.applicationDocument.create({
        data: {
          applicationId: application.id,
          documentId: document.id,
          type: 'COVER_LETTER',
          fileUrl: document.fileUrl,
          fileName: document.name,
          fileType: document.fileType,
          fileSize: document.fileSize,
        },
      })
    }
  } else if (coverLetterFile) {
    const appDoc = await prisma.applicationDocument.create({
      data: {
        applicationId: application.id,
        documentId: null,
        type: 'COVER_LETTER',
        fileUrl: coverLetterFile.url,
        fileName: coverLetterFile.name,
        fileType: coverLetterFile.type,
        fileSize: coverLetterFile.size,
      },
    })

    if (saveCoverLetterToDocuments) {
      const document = await prisma.document.create({
        data: {
          userId,
          name: coverLetterFile.name.replace(/\.[^/.]+$/, ''),
          type: 'COVER_LETTER',
          fileUrl: coverLetterFile.url,
          fileType: coverLetterFile.type,
          fileSize: coverLetterFile.size,
        },
      })

      await prisma.applicationDocument.update({
        where: { id: appDoc.id },
        data: { documentId: document.id },
      })
    }
  }

  return application
}

export async function updateApplication(
  applicationId: string,
  userId: string,
  data: z.infer<typeof applicationUpdateSchema> & {
    cvFile?: { url: string; name: string; type: string; size: number }
    coverLetterFile?: { url: string; name: string; type: string; size: number }
  }
) {
  const { cvFile, coverLetterFile, ...dataToValidate } = data
  const validatedData = applicationUpdateSchema.parse(dataToValidate)

  const existing = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  })

  if (!existing) {
    throw new Error('Application not found')
  }

  const { cvDocumentId, coverLetterDocumentId, saveCvToDocuments, saveCoverLetterToDocuments, ...applicationData } = validatedData

  const updateData: any = {}
  
  if (applicationData.company !== undefined) updateData.company = applicationData.company
  if (applicationData.role !== undefined) updateData.role = applicationData.role
  if (applicationData.location !== undefined) updateData.location = applicationData.location || null
  if (applicationData.status !== undefined) updateData.status = applicationData.status
  if (applicationData.appliedAt !== undefined) updateData.appliedAt = applicationData.appliedAt || null
  if (applicationData.link !== undefined) updateData.link = applicationData.link || null
  if (applicationData.notes !== undefined) updateData.notes = applicationData.notes || null
  if (applicationData.recruiterName !== undefined) updateData.recruiterName = applicationData.recruiterName || null
  if (applicationData.recruiterEmail !== undefined) updateData.recruiterEmail = applicationData.recruiterEmail || null
  if (applicationData.followUpAt !== undefined) updateData.followUpAt = applicationData.followUpAt || null
  if (applicationData.isArchived !== undefined) updateData.isArchived = applicationData.isArchived

  if (Object.keys(updateData).length === 0) {
    throw new Error('No fields to update')
  }

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: updateData,
  })

  return application
}

export async function archiveApplication(applicationId: string, userId: string, archived: boolean) {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  return await prisma.application.update({
    where: { id: applicationId },
    data: { isArchived: archived },
  })
}

export async function deleteApplication(applicationId: string, userId: string) {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  await prisma.application.delete({
    where: { id: applicationId },
  })
}

