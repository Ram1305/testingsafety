import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ResourcesDropdownProps {
  onForms?: () => void;
  onFeesRefund?: () => void;
}

export function ResourcesDropdown({ onForms, onFeesRefund }: ResourcesDropdownProps) {
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [codeOfPracticeOpen, setCodeOfPracticeOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setResourcesDropdownOpen(true)}
      onMouseLeave={() => {
        setResourcesDropdownOpen(false);
        setCodeOfPracticeOpen(false);
      }}
    >
      <a
        href="#resources"
        className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors text-sm font-medium cursor-pointer"
      >
        RESOURCES
        <ChevronDown className={`w-4 h-4 transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
      </a>
      
      {resourcesDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute left-0 top-full pt-2 z-50"
        >
          <div className="flex rounded-xl shadow-2xl border border-slate-700 overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
            {/* Main Menu Panel */}
            <div className="dropdown-category-panel">
              <button
                onClick={() => {
                  setResourcesDropdownOpen(false);
                  if (onForms) onForms();
                }}
                className="dropdown-category-item"
              >
                <span>Forms</span>
              </button>
              <button
                className="dropdown-category-item"
              >
                <span>Unique Student Identifier (USI)</span>
              </button>
              <button
                className="dropdown-category-item"
              >
                <span>Gallery</span>
              </button>
              <button
                onMouseEnter={() => setCodeOfPracticeOpen(true)}
                className={`dropdown-category-item ${codeOfPracticeOpen ? 'active' : ''}`}
              >
                <span>Code of Practice</span>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>
            
            {/* Submenu Panel */}
            <div className="dropdown-courses-panel">
              {codeOfPracticeOpen && (
                <div>
                  <a
                    href="https://safetytrainingacademy.edu.au/wp-content/uploads/2025/08/How-to-safely-remove-asbestos-COP.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resources-submenu-item"
                  >
                    Manage and Control Asbestos in Workplace
                  </a>
                  <a
                    href="https://safetytrainingacademy.edu.au/wp-content/uploads/2021/12/How-to-safely-remove-asbestos-COP-2019-1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resources-submenu-item"
                  >
                    Asbestos Removal
                  </a>
                  <a
                    href="https://www.safework.nsw.gov.au/__data/assets/pdf_file/0015/50073/Confined-spaces-COP.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resources-submenu-item"
                  >
                    Confined Space
                  </a>
                  <a
                    href="https://www.safework.nsw.gov.au/__data/assets/pdf_file/0018/50076/Managing-the-risk-of-falls-at-workplaces-COP.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resources-submenu-item"
                  >
                    Working at Heights
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
