/**
 * Projects Page Client Component
 * Manages state and modals for projects
 */

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProjectsList } from './projects-list'
import { ProjectFormModal } from './project-form-modal'
import styles from './projects-page.module.css'

interface Project {
  id: string
  title: string
  description: string | null
  detailedDescription: string | null
  type: string
  url: string | null
  tags: string[]
  isPublished: boolean
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
  updatedAt: Date
}

interface ProjectsPageClientProps {
  initialProjects: Project[]
}

export function ProjectsPageClient({ initialProjects }: ProjectsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
      const project = projects.find((p) => p.id === editId)
      if (project) {
        setEditingProject(project)
        setIsModalOpen(true)
        // Clear the edit param from URL
        router.replace('/dashboard/projects', { scroll: false })
      }
    }
  }, [searchParams, projects, router])

  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    // Clear edit param from URL if present
    if (searchParams.get('edit')) {
      router.replace('/dashboard/projects', { scroll: false })
    }
  }

  const handleProjectSaved = (project: Project) => {
    if (editingProject) {
      setProjects(projects.map((p) => (p.id === project.id ? project : p)))
    } else {
      setProjects([project, ...projects])
    }
    handleCloseModal()
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/portfolio/${projectId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setProjects(projects.filter((p) => p.id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    }
  }

  return (
    <div className={styles.projectsPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Curate and present your work</p>
        </div>
        <button onClick={handleAddProject} className={styles.addButton}>
          + New Project
        </button>
      </div>

      <ProjectsList
        projects={projects}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {isModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={handleCloseModal}
          onSave={handleProjectSaved}
        />
      )}
    </div>
  )
}

