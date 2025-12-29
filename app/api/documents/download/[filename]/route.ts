import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename } = await params
    
    const decodedFilename = decodeURIComponent(filename)
    const filePath = join(process.cwd(), 'public', 'uploads', 'documents', decodedFilename)

    if (!existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`)
      console.error(`Decoded filename: ${decodedFilename}`)
      return NextResponse.json({ 
        error: 'File not found',
        details: `File path: ${filePath}`
      }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)

    const extension = decodedFilename.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
    }
    const contentType = contentTypeMap[extension || ''] || 'application/octet-stream'

    const parts = decodedFilename.split('-')
    let originalFilename = parts.slice(2).join('-')
    
    if (!originalFilename || originalFilename === decodedFilename) {
      const { getDocumentsByUserId } = await import('@/lib/services/document')
      const documents = await getDocumentsByUserId(session.user.id)
      const document = documents.find(d => d.fileUrl.includes(decodedFilename))
      if (document) {
        originalFilename = document.name
        if (!originalFilename.includes('.')) {
          const ext = decodedFilename.split('.').pop()
          if (ext) {
            originalFilename = `${originalFilename}.${ext}`
          }
        }
      } else {
        originalFilename = decodedFilename
      }
    }
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${originalFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Document download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

