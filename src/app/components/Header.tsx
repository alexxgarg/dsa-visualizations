import React from 'react';
import Link from 'next/link';
import '../../../styles/header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">DSA Visualizer</h1>
      </div>
    </header>
  );
};

export default Header;

