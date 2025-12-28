/**
 * Projects List Component
 * Displays projects in a table format
 */

'use client'

import { Eye, MoreVertical, Edit, Trash2 } from 'lucide-react'
import styles from './projects-list.module.css'

interface Project {
  id: string
  title: string
  description: string | null
  type: string
  isPublished: boolean
  createdAt: Date
}

interface ProjectsListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
}

export function ProjectsList({ projects, onEdit, onDelete }: ProjectsListProps) {
  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No projects yet. Click &quot;New Project&quot; to add your first project.</p>
      </div>
    )
  }

  return (
    <div className={styles.projectsList}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Project name</th>
            <th>Type</th>
            <th>Visibility</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>
                <div className={styles.projectName}>
                  <span className={styles.name}>{project.title}</span>
                </div>
              </td>
              <td>
                <span className={styles.type}>{formatType(project.type)}</span>
              </td>
              <td>
                <span
                  className={`${styles.visibility} ${
                    project.isPublished ? styles.public : styles.private
                  }`}
                >
                  {project.isPublished ? 'Public' : 'Private'}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <a
                    href={`/dashboard/projects/${project.id}`}
                    className={styles.actionButton}
                    title="View details"
                  >
                    <Eye size={16} />
                  </a>
                  <button
                    onClick={() => onEdit(project)}
                    className={styles.actionButton}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className={styles.actionButton}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

