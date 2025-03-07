import React from 'react';
import styles from './Logo.module.css';

const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 80, className = '' }) => {
  return (
    <img src="/BlockOps.png" className={`${styles.logo} ${className}`} />
  );
};

export default Logo;
