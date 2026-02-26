import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Menu, X, Award, Users, CheckCircle, ChevronDown, ChevronRight, FileText, Download } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { courseService } from '../services/course.service';
import type { CourseListItem } from '../services/course.service';
import { categoryService } from '../services/category.service';
import type { CategoryDropdownItem } from '../services/category.service';
import { WhatsAppButton } from './ui/WhatsAppButton';
import logoImage from '/assets/SafetyTrainingAcademylogo.png';

interface FormsPageProps {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onAbout?: () => void;
  onContact?: () => void;
  onBookNow?: () => void;
  onCourseDetails?: (courseId: string) => void;
  onFeesRefund?: () => void;
}

export function FormsPage({ onBack, onLogin, onRegister, onAbout, onContact, onBookNow, onCourseDetails, onFeesRefund }: FormsPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [codeOfPracticeOpen, setCodeOfPracticeOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<CourseListItem[]>([]);
  const [categories, setCategories] = useState<CategoryDropdownItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        courseService.getAllCourses({ pageSize: 1000 }),
        categoryService.getCategoriesDropdown()
      ]);
      if (coursesRes.success && coursesRes.data) {
        setAllCourses(coursesRes.data.courses);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data.categories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Contact Info */}
      <div className="bg-cyan-400 text-white py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center text-sm gap-3 md:gap-6">
          <span className="flex items-center gap-2 font-medium">
            <Phone className="w-4 h-4" />
            1300 876 097
          </span>
          <span className="flex items-center gap-2 font-medium">
            <Mail className="w-4 h-4" />
            info@safetytrainingacademy.edu.au
          </span>
          <span className="flex items-center gap-2 font-medium">
            <MapPin className="w-4 h-4" />
            3/14-16 Marjorie Street, Sefton NSW 2162
          </span>
        </div>
      </div>

      {/* Logo and Info Section */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6">
          <motion.div
            className="flex items-center cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onBack}
          >
            <img
              src={logoImage}
              alt="Safety Training Academy"
              className="h-14 md:h-16"
            />
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <motion.div 
              className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-cyan-100 rounded-lg flex-shrink-0">
                <Award className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wide leading-tight">RTO</span>
                <span className="text-sm font-bold text-slate-800 leading-tight whitespace-nowrap">#45234</span>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wide leading-tight whitespace-nowrap">FACE TO FACE</span>
                <span className="text-sm font-bold text-slate-800 leading-tight">Training</span>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wide leading-tight">QUALIFIED</span>
                <span className="text-sm font-bold text-slate-800 leading-tight">Trainers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={onBack}
                className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                HOME
              </button>

              {/* Courses Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => {
                  setCoursesDropdownOpen(true);
                  const categoriesWithCourses = categories.filter(cat => 
                    allCourses.some(course => course.categoryId === cat.categoryId)
                  );
                  if (categoriesWithCourses.length > 0 && !activeCategory) {
                    setActiveCategory(categoriesWithCourses[0].categoryId);
                  }
                }}
                onMouseLeave={() => {
                  setCoursesDropdownOpen(false);
                  setActiveCategory(null);
                }}
              >
                <a
                  href="#courses"
                  className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors text-sm font-medium cursor-pointer"
                >
                  COURSES
                  <ChevronDown className={`w-4 h-4 transition-transform ${coursesDropdownOpen ? 'rotate-180' : ''}`} />
                </a>
                
                {coursesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 top-full pt-2 z-50"
                  >
                    <div className="flex rounded-xl shadow-2xl border border-slate-700 overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
                      <div className="dropdown-category-panel">
                        {categories
                          .filter(category => allCourses.some(course => course.categoryId === category.categoryId))
                          .map((category) => (
                          <button
                            key={category.categoryId}
                            onMouseEnter={() => setActiveCategory(category.categoryId)}
                            className={`dropdown-category-item ${activeCategory === category.categoryId ? 'active' : ''}`}
                          >
                            <span>{category.categoryName}</span>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                      <div className="dropdown-courses-panel">
                        {activeCategory && (
                          <div>
                            {allCourses
                              .filter(course => course.categoryId === activeCategory)
                              .map((course) => (
                                <button
                                  key={course.courseId}
                                  onClick={() => {
                                    if (onCourseDetails) {
                                      onCourseDetails(course.courseId);
                                    }
                                    setCoursesDropdownOpen(false);
                                  }}
                                  className="dropdown-course-item"
                                >
                                  {course.courseName}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Resources Dropdown */}
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
                    className="absolute left-0 top-full pt-2 z-50 w-72"
                  >
                    <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                      <div className="py-2">
                        {/* Forms */}
                        <a
                          href="#forms"
                          className="block px-4 py-3 text-white hover:bg-cyan-500 hover:text-white transition-colors text-sm font-medium"
                        >
                          Forms
                        </a>

                        {/* Unique Student Identifier */}
                        <a
                          href="#usi"
                          className="block px-4 py-3 text-white hover:bg-cyan-500 hover:text-white transition-colors text-sm font-medium"
                        >
                          Unique Student Identifier (USI)
                        </a>

                        {/* Gallery */}
                        <a
                          href="#gallery"
                          className="block px-4 py-3 text-white hover:bg-cyan-500 hover:text-white transition-colors text-sm font-medium"
                        >
                          Gallery
                        </a>

                        {/* Code of Practice - Nested Dropdown */}
                        <div
                          className="relative"
                          onMouseEnter={() => setCodeOfPracticeOpen(true)}
                          onMouseLeave={() => setCodeOfPracticeOpen(false)}
                        >
                          <a
                            href="#code-of-practice"
                            className="flex items-center justify-between px-4 py-3 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors text-sm font-medium"
                          >
                            <span>Code of Practice</span>
                            <ChevronRight className="w-4 h-4" />
                          </a>

                          {codeOfPracticeOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute left-full top-0 ml-1 w-80"
                            >
                              <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                                <a
                                  href="https://safetytrainingacademy.edu.au/wp-content/uploads/2025/08/How-to-safely-remove-asbestos-COP.pdf"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-4 py-3 text-white hover:bg-cyan-500 hover:text-white transition-colors text-sm"
                                >
                                  Manage and Control Asbestos in Workplace
                                </a>
                                <a
                                  href="https://safetytrainingacademy.edu.au/wp-content/uploads/2021/12/How-to-safely-remove-asbestos-COP-2019-1.pdf"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-4 py-3 text-white hover:bg-cyan-500 hover:text-white transition-colors text-sm"
                                >
                                  Asbestos Removal
                                </a>
                                <a
                                  href="https://www.safework.nsw.gov.au/__data/assets/pdf_file/0015/50073/Confined-spaces-COP.pdf"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-4 py-3 text-white hover:bg-cyan-500 hover:text-white transition-colors text-sm"
                                >
                                  Confined Space
                                </a>
                                <a
                                  href="https://www.safework.nsw.gov.au/__data/assets/pdf_file/0018/50076/Managing-the-risk-of-falls-at-workplaces-COP.pdf"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-4 py-3 text-white hover:bg-cyan-500 hover:text-white transition-colors text-sm"
                                >
                                  Working at Heights
                                </a>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <button
                onClick={onAbout}
                className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                ABOUT
              </button>
              <button
                onClick={onContact}
                className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                CONTACT
              </button>
              <Button
                onClick={onBookNow || onLogin}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6"
              >
                Book now
              </Button>
              <Button
                onClick={onRegister}
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-slate-900 rounded-full px-6 font-semibold"
              >
                Login / Register
              </Button>

              {/* Contact Numbers - Desktop Inline */}
              {/* Contact Number - Desktop Inline */}
              <div className="flex items-center ml-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <a 
                    href="tel:1300976097" 
                    className="text-white phone-number-link hover:text-cyan-400 transition-colors"
                  >
                    1300 976 097
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-white hover:bg-slate-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Forms</h1>

          {/* Forms Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  src={logoImage}
                  alt="Safety Training Academy"
                  className="h-16"
                />
              </div>
            </div>

            {/* Participant Handbook */}
            <div className="mb-8">
              <a
                href="https://safetytrainingacademy.edu.au/wp-content/uploads/2023/08/STA-49-Student-Handbook-PDF.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-8 border-2 border-cyan-200 hover:border-cyan-400 transition-all hover:shadow-lg cursor-pointer">
                  <h2 className="text-3xl font-bold text-cyan-600 mb-2 group-hover:text-cyan-700">
                    Participant Handbook
                  </h2>
                  <p className="text-gray-700 font-medium">
                    CLICK TO DOWNLOAD THE PARTICIPANT HANDBOOK (PDF)
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-cyan-600 group-hover:text-cyan-700">
                    <Download className="w-5 h-5" />
                    <span className="font-semibold">Download PDF</span>
                  </div>
                </div>
              </a>
            </div>

            {/* Additional Documents */}
            <div className="space-y-4">
              <a
                href="https://safetytrainingacademy.edu.au/wp-content/uploads/2024/04/STA-05-Complaints-and-Appeals-Information-and-Form.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-red-50 hover:bg-red-100 rounded-lg border-2 border-red-200 hover:border-red-300 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg text-blue-900 group-hover:text-blue-700">
                    COMPLAINTS AND APPEALS PROCESS
                  </span>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-700" />
              </a>

              <button
                onClick={onFeesRefund}
                className="w-full flex items-center justify-between p-5 bg-red-50 hover:bg-red-100 rounded-lg border-2 border-red-200 hover:border-red-300 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg text-blue-900 group-hover:text-blue-700">
                    FEES AND REFUND POLICY
                  </span>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-700" />
              </button>

              <a
                href="https://safetytrainingacademy.edu.au/wp-content/uploads/2025/09/WHS-Act-2011-010.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-red-50 hover:bg-red-100 rounded-lg border-2 border-red-200 hover:border-red-300 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg text-blue-900 group-hover:text-blue-700">
                    WHS ACT
                  </span>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-700" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}
