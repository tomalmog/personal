'use client';

import { Linkedin, Github } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const navItems = ['HOME', 'EXPERIENCE', 'PROJECTS', 'CONTACT'];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Name */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('home')}
              className="text-xl font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Tom Almog
            </button>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-sm tracking-wide transition-colors ${activeSection === item.toLowerCase()
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/tomalmog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://github.com/tomalmog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex flex-wrap gap-4 justify-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className={`text-xs tracking-wide transition-colors ${activeSection === item.toLowerCase()
                ? 'text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}