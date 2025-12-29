import { prisma } from '@/lib/prisma'
import { documentSchema, documentUpdateSchema } from '@/lib/validations/document'
import { z } from 'zod'

const ALLOWED_FILE_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

export function getFileTypeFromMime(mimeType: string): string | null {
  return ALLOWED_FILE_TYPES[mimeType as keyof typeof ALLOWED_FILE_TYPES] || null
}

export function validateFileType(mimeType: string): string {
  const fileType = getFileTypeFromMime(mimeType)
  if (!fileType) {
    throw new Error(`Invalid file type. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`)
  }
  return fileType
}

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function validateFileSize(fileSize: number): boolean {
  return fileSize <= MAX_FILE_SIZE
}

export async function getDocumentsByUserId(userId: string, type?: string) {
  return await prisma.document.findMany({
    where: {
      userId,
      ...(type && { type }),
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDocumentById(documentId: string, userId: string) {
  return await prisma.document.findFirst({
    where: { id: documentId, userId },
  })
}

export async function createDocument(
  userId: string,
  data: z.infer<typeof documentSchema> & {
    fileUrl: string
    fileType: string
    fileSize: number
  }
) {
  const validatedData = documentSchema.parse(data)

  const document = await prisma.document.create({
    data: {
      ...validatedData,
      userId,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
      notes: validatedData.notes || null,
    },
  })

  return document
}

export async function updateDocument(
  documentId: string,
  userId: string,
  data: z.infer<typeof documentUpdateSchema>
) {
  const validatedData = documentUpdateSchema.parse(data)

  const existing = await prisma.document.findFirst({
    where: { id: documentId, userId },
  })

  if (!existing) {
    throw new Error('Document not found')
  }

  const document = await prisma.document.update({
    where: { id: documentId },
    data: {
      ...validatedData,
      notes: validatedData.notes || null,
    },
  })

  return document
}

export async function deleteDocument(documentId: string, userId: string) {
  const document = await prisma.document.findFirst({
    where: { id: documentId, userId },
  })

  if (!document) {
    throw new Error('Document not found')
  }

  await prisma.document.delete({
    where: { id: documentId },
  })
}
