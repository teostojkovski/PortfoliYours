/**
 * Landing Page
 * Route: /
 * Public landing page with hero section and call-to-action
 */

import Link from "next/link";
import Image from "next/image";
import styles from "./landing.module.css";

export default function Home() {
  return (
    <div className={styles.landingContainer}>
      {/* Background Image */}
      <div className={styles.backgroundWrapper}>
        <Image
          src="/LandingBackground.jpg"
          alt="Background"
          fill
          className={styles.backgroundImage}
          priority
          quality={100}
        />
        {/* Overlay for better text readability */}
        <div className={styles.overlay} />
      </div>

      {/* Top Navigation */}
      <nav className={styles.topNav}>
        {/* Centered Logo */}
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/logo.png"
              alt="Portfoliyours Logo"
              width={100}
              height={32}
              className={styles.logo}
              priority
              quality={100}
            />
          </Link>

        {/* Right Side Buttons */}
        <div className={styles.navButtons}>
          <Link href="/auth/signin" className={styles.signInButton}>
            Sign In
          </Link>
          <Link href="/auth/signup" className={styles.getStartedButton}>
            Get Started
            <span className={styles.buttonArrow}>→</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Section */}
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Left Side - Text Content */}
          <div className={styles.textContent}>
            <h1 className={styles.heading}>
              Build Your Digital Career Portfolio
            </h1>
            <p className={styles.subtext}>
              Showcase your projects, experiences, and achievements in one beautiful, 
              professional portfolio. Manage everything from GitHub projects to job 
              applications—all in one place.
            </p>
          </div>

          {/* Right Side - MacBook Image */}
          <div className={styles.laptopWrapper}>
            <div className={styles.laptopContainer}>
              <Image
                src="/MacBookLanding.png"
                alt="MacBook Preview"
                width={1200}
                height={900}
                className={styles.laptopImage}
                priority
                quality={100}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
