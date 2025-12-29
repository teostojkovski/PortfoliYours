

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDocumentsByUserId } from '@/lib/services/document'
import { DocumentsList } from '@/components/documents/documents-list'

export default async function CVsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Unauthorized</div>
  }

  const documents = await getDocumentsByUserId(session.user.id)

  return <DocumentsList documents={documents} />
}
