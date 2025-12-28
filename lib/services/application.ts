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
  const validatedData = applicationSchema.parse(data)

  const { cvDocumentId, coverLetterDocumentId, saveCvToDocuments, saveCoverLetterToDocuments, cvFile, coverLetterFile, ...applicationData } = validatedData

  // Create application
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

  // Handle CV document
  if (cvDocumentId) {
    // Link existing document
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
    // Create application document
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

    // If user wants to save to documents, create a Document entry
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

      // Update application document to link to the saved document
      await prisma.applicationDocument.update({
        where: { id: appDoc.id },
        data: { documentId: document.id },
      })
    }
  }

  // Handle cover letter document (same logic)
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
  data: z.infer<typeof applicationUpdateSchema>
) {
  const validatedData = applicationUpdateSchema.parse(data)

  // Verify ownership
  const existing = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  })

  if (!existing) {
    throw new Error('Application not found')
  }

  const { cvDocumentId, coverLetterDocumentId, saveCvToDocuments, saveCoverLetterToDocuments, cvFile, coverLetterFile, ...applicationData } = validatedData

  // Update application
  const application = await prisma.application.update({
    where: { id: applicationId },
    data: {
      ...applicationData,
      appliedAt: validatedData.appliedAt || null,
      link: validatedData.link || null,
      notes: validatedData.notes || null,
      recruiterName: validatedData.recruiterName || null,
      recruiterEmail: validatedData.recruiterEmail || null,
      followUpAt: validatedData.followUpAt || null,
    },
  })

  // Update documents if provided (similar logic to create)
  // For simplicity, we'll keep existing documents and only update if explicitly changed

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

