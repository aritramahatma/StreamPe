import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-grow ${fullWidth ? '' : 'container mx-auto px-4'}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
