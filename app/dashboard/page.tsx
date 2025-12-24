/**
 * Dashboard Home Page
 * Route: /dashboard
 * Shows profile completeness, highlights, and suggestions
 */

import styles from './dashboard-page.module.css'
import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  // TODO: Fetch real data from database
  const profileCompleteness = 72
  const userName = 'Teo'

  return (
    <div className={styles.dashboardPage}>
      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome, {userName}</h1>
        <div className={styles.profileCompleteness}>
          <span className={styles.completenessLabel}>Profile completeness:</span>
          <span className={styles.completenessValue}>{profileCompleteness}%</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className={styles.quickAccess}>
        <Card className={styles.quickCard}>
          <h3 className={styles.quickCardTitle}>Profile</h3>
          <p className={styles.quickCardDesc}>Manage your identity</p>
        </Card>
        <Card className={styles.quickCard}>
          <h3 className={styles.quickCardTitle}>CVs</h3>
          <p className={styles.quickCardDesc}>Create curated exports</p>
        </Card>
        <Card className={styles.quickCard}>
          <h3 className={styles.quickCardTitle}>Applications</h3>
          <p className={styles.quickCardDesc}>Track your job search</p>
        </Card>
        <Card className={styles.quickCard}>
          <h3 className={styles.quickCardTitle}>Projects</h3>
          <p className={styles.quickCardDesc}>Showcase your work</p>
        </Card>
        <Card className={styles.quickCard}>
          <h3 className={styles.quickCardTitle}>Skills</h3>
          <p className={styles.quickCardDesc}>List your abilities</p>
        </Card>
        <Card className={styles.quickCard}>
          <h3 className={styles.quickCardTitle}>Settings</h3>
          <p className={styles.quickCardDesc}>Configure preferences</p>
        </Card>
      </section>

      {/* Highlights Section */}
      <section className={styles.highlightsSection}>
        <h2 className={styles.sectionTitle}>Highlights</h2>
        <div className={styles.highlightsGrid}>
          <Card className={styles.highlightCard}>
            <h3 className={styles.highlightCardTitle}>Top 3 Projects</h3>
            <ul className={styles.highlightList}>
              <li>Project 1 - Full Stack Application</li>
              <li>Project 2 - API Development</li>
              <li>Project 3 - Mobile App</li>
            </ul>
          </Card>
          <Card className={styles.highlightCard}>
            <h3 className={styles.highlightCardTitle}>Most Recent Experience</h3>
            <div className={styles.experienceItem}>
              <p className={styles.experienceRole}>Senior Developer</p>
              <p className={styles.experienceCompany}>Tech Company Inc.</p>
              <p className={styles.experienceDuration}>2023 - Present</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Warnings / Suggestions */}
      <section className={styles.suggestionsSection}>
        <h2 className={styles.sectionTitle}>Suggestions</h2>
        <Card className={styles.suggestionCard}>
          <ul className={styles.suggestionList}>
            <li className={styles.suggestionItem}>
              ⚠️ Add at least 1 highlighted project
            </li>
            <li className={styles.suggestionItem}>
              ⚠️ Your CV has no backend projects
            </li>
            <li className={styles.suggestionItem}>
              ✅ Profile photo added
            </li>
          </ul>
        </Card>
      </section>
    </div>
  )
}
