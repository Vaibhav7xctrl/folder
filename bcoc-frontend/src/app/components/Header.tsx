import React from 'react';
import Logo from './Logo';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className={styles['header-container']}>
    <header>
      <Logo className="custom-logo" />
      <h1 className= {styles['heading']}>
        {title}
      </h1>
    </header>
    </div>
  );
};

export default Header;
