import React from "react";
import styles from "./Footer.module.css";

export interface LinkItem {
  label: string;
  url: string;
}

export interface FooterProps {
  projectName: string;
  description?: string;
  year?: number;
 
}

const Footer: React.FC<FooterProps> = ({
  projectName,
  description = "Blockchain-Powered Digital Evidence Management",
  year = new Date().getFullYear(),
  
}) => {
  
    return (
        <footer className={styles['footer-container']}>
          <div className={styles['footer-inner']}>
            {/* Left Section: Branding & Description */}
            <div className={styles['footer-branding']}>
              <h2 className={styles['footer-title']}>{projectName}</h2>
              <p className={styles['footer-description']}>{description}</p>
            </div>
    
            {/* Right Section: Copyright */}
            <div className={styles['footer-copyright']}>
              <p>
                © {year} {projectName}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
    )
};

export default Footer;
