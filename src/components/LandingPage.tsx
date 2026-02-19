// src/components/LandingPage.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Award,
  Clock,
  Users,
  Search,
  Menu,
  X,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Quote,
  Facebook,
  Linkedin,
  Instagram,
  Send,
  ArrowRight,
  Shield,
  BookOpen,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { courseService } from '../services/course.service';
import type { CourseListItem } from '../services/course.service';
import { categoryService } from '../services/category.service';
import type { CategoryDropdownItem } from '../services/category.service';
import { WhatsAppButton } from "./ui/WhatsAppButton";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onCourseDetails?: (courseId: string) => void;
  onAbout?: () => void;
  onContact?: () => void;
  onBookNow?: () => void;
  onLLNDTest?: () => void;
  onEnrollNow?: () => void;
  onForms?: () => void;
  onFeesRefund?: () => void;
  onBookCourse?: (courseId: string, courseCode: string, courseName: string, price: number, experienceType?: 'with' | 'without') => void;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const googleReviews = [
  {
    id: 1,
    author: "Training Combined RTO 45490",
    rating: 5,
    text: "Based on 141 reviews",
    isMainReview: true,
  },
  {
    id: 2,
    author: "Dylan James",
    rating: 5,
    text: "Katelyn was my trainer and I'm really happy with my training could not recommend her more!",
    time: "a year ago",
  },
  {
    id: 3,
    author: "kassam hussein",
    rating: 5,
    text: "I reached out to the team for my C6 licence what a fantastic experience from the booking to the assessment all the help you need",
    time: "a year ago",
  },
  {
    id: 4,
    author: "susam adhikari",
    rating: 5,
    text: "I did my forklift training with Training Combined. The trainer was very professional and helpful throughout the course.",
    time: "a year ago",
  },
];

const clients = [
  { name: "Kenny Construction", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200" },
  { name: "Avopiling", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200" },
  { name: "Pructon", logo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200" },
  { name: "Kenny Construction", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200" },
];

export function LandingPage({ onLogin, onRegister, onCourseDetails, onAbout, onContact, onBookNow, onLLNDTest, onEnrollNow, onForms, onFeesRefund, onBookCourse }: LandingPageProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [codeOfPracticeOpen, setCodeOfPracticeOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCombo, setExpandedCombo] = useState(false);
  
  // Data states
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [categories, setCategories] = useState<CategoryDropdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  const heroSlides = [
    {
      id: 1,
      title: "CAREER TRAINING AND LICENSING",
      subtitle: "Professional certification programs for Earthmoving, First Aid, Traffic Control, Asbestos Removal & more. Get certified with industry-recognized credentials.",
      image: "/assets/Slider1.jpeg",
    },
    {
      id: 2,
      title: "EXPERT-LED TRAINING",
      subtitle: "Learn from professionals with 10+ years of real-world experience. Achieve 95% pass rate with our comprehensive curriculum.",
      image: "/assets/Slider2.jpeg",
    },
    {
      id: 3,
      title: "NATIONALLY RECOGNIZED CERTIFICATES",
      subtitle: "Get certified with credentials that are recognized across all states and territories. Start your career with confidence.",
      image: "/assets/Slider3.jpeg",
    },
  ];

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch courses when search changes
  useEffect(() => {
    fetchCourses();
  }, [debouncedSearch]);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategoriesDropdown();
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filter: { searchQuery?: string; pageSize: number } = {
        pageSize: 100
      };

      if (debouncedSearch) {
        filter.searchQuery = debouncedSearch;
      }

      const response = await courseService.getActiveCourses(filter);

      if (response.success && response.data) {
        setCourses(response.data.courses);
      } else {
        setError(response.message || 'Failed to load courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleCourseClick = (courseId: string) => {
    if (onCourseDetails) {
      onCourseDetails(courseId);
    }
  };

  const getCoursesByCategory = (categoryName: string) => {
    return courses.filter((course) => course.categoryName === categoryName && !course.hasComboOffer);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar with Contact Info - Light Blue Stripe */}
      <div className="bg-cyan-400 text-white py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center text-sm gap-3 md:gap-6">
          <a href="tel:1300976097" className="flex items-center gap-2 font-semibold phone-number-link hover:text-slate-900 transition-colors">
            <Phone className="w-4 h-4" />
            1300 976 097
          </a>
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

      {/* Logo and Info Section - White Background */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/assets/SafetyTrainingAcademylogo.png"
              alt="Safety Training Academy"
              className="h-14 md:h-16"
            />
          </motion.div>

          {/* Info Badges - Gen Z Style */}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#home"
                className="text-white hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                HOME
              </a>
              {/* Courses Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => {
                  setCoursesDropdownOpen(true);
                  const categoriesWithCourses = categories.filter(cat => 
                    courses.some(course => course.categoryId === cat.categoryId)
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
                          .filter(category => courses.some(course => course.categoryId === category.categoryId))
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
                            {courses
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
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('combo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white hover:text-cyan-400 transition-colors text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 animate-pulse"
                >
                  COMBO COURSES
                </button>
              </div>
              <Button
                onClick={onBookNow || onLogin}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6"
              >
                Book now
              </Button>
              <Button
                variant="outline"
                className="border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 rounded-full px-6 font-semibold"
              >
                VOC
              </Button>
              <Button
                onClick={onRegister}
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-slate-900 rounded-full px-6 font-semibold"
              >
                Login / Register
              </Button>

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

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden py-6 border-t border-slate-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col gap-4">
                <a href="#home" className="text-white hover:text-cyan-400 transition-colors px-4 py-2">
                  HOME
                </a>
                <a href="#courses" className="text-white hover:text-cyan-400 transition-colors px-4 py-2">
                  COURSES
                </a>
                <button onClick={onAbout} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 w-full text-left">
                  ABOUT
                </button>
                <button onClick={onContact} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 w-full text-left">
                  CONTACT
                </button>
                <a
                  href="#combo"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.getElementById('combo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white font-bold px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-center cursor-pointer"
                >
                  COMBO COURSES
                </a>
                <Button onClick={onBookNow || onLogin} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                  Book now
                </Button>
                <Button variant="outline" className="w-full border-2 border-cyan-400 text-cyan-400">
                  VOC
                </Button>
                <Button
                  onClick={onRegister}
                  className="w-full border-2 border-white bg-transparent text-white hover:bg-white hover:text-slate-900"
                >
                  Login / Register
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Slider Section with Search */}
      <section id="home" className="relative">
        <div className="relative h-[600px] md:h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={heroSlides[currentSlide].image}
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/85 to-blue-900/90" />
            </motion.div>
          </AnimatePresence>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left Side - Title and Search */}
            <motion.div
              className="max-w-3xl flex-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search Courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 rounded-full border-2 border-blue-200 focus:border-cyan-400 bg-white"
                  />
                </div>
                <Button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white h-14 px-8 rounded-full text-lg font-semibold shadow-lg shadow-cyan-500/50"
                  onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Search Courses
                </Button>
              </div>
            </motion.div>

            {/* Right Side - Course Enrolment Card */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Card className="bg-slate-800/70 backdrop-blur-lg border-2 border-cyan-400/40 shadow-xl rounded-2xl p-6 w-[340px]">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold text-cyan-400 mb-2">
                    Course Enrolment
                  </CardTitle>
                  <CardDescription className="text-white/70 text-sm leading-relaxed">
                    To enrol for a Course with Safety Training Academy, please complete our online Enrolment form via
                    the button below:
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-2.5">
                  <Button
                    onClick={onEnrollNow || onRegister}
                    className="w-full bg-slate-900/90 hover:bg-slate-950 text-white rounded-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all border border-slate-700/50"
                  >
                    ENROL NOW
                  </Button>
                  <Button 
                    onClick={onLLNDTest}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    LLND TEST
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                    VOC
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? "bg-cyan-400 w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sunday Classes Announcement Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sunday Classes Banner */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mb-6">
              SUNDAY CLASSES AVAILABLE ! ENROLL NOW
            </h2>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="text-center space-y-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Primary Heading */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              Workplace Health and Safety Training Courses in Sydney
            </h3>

            {/* Course Categories */}
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 text-lg md:text-xl lg:text-2xl font-semibold text-slate-800 pt-2">
              <span>Construction Short Courses</span>
              <span className="text-slate-400">•</span>
              <span>Earthmoving</span>
              <span className="text-slate-400">•</span>
              <span>HRW Training</span>
              <span className="text-slate-400">&</span>
              <span className="text-blue-600">VOC's for All Courses</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Combo Courses Section */}
      <section id="combo" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">Special Offers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Combo Course Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save big with our specially curated combo packages! Get multiple certifications at an unbeatable price.
            </p>
          </motion.div>

          {/* Combo Courses Grid - Using Same Card as Regular Courses */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                <div className="col-span-full flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                  <span className="ml-2 text-gray-600">Loading combo courses...</span>
                </div>
              ) : (
                courses
                  .filter(course => course.hasComboOffer)
                  .slice(0, expandedCombo ? undefined : 3)
                  .map((course, index) => (
                  <motion.div
                    key={course.courseId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleCourseClick(course.courseId)}
                    className="cursor-pointer"
                  >
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-cyan-400 rounded-2xl overflow-hidden bg-white h-full flex flex-col transform hover:-translate-y-2">
                      <div className="relative h-56 overflow-hidden">
                        <ImageWithFallback
                          src={course.imageUrl || "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1080"}
                          alt={course.courseName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-sm font-bold shadow-lg">
                            COMBO
                          </Badge>
                          <Badge className="bg-cyan-500 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                            {course.validityPeriod || "5 years"}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">View Details</span>
                        </div>
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className="border-blue-300 text-blue-700 font-semibold text-xs"
                          >
                            {course.categoryName}
                          </Badge>
                          <div className="text-2xl font-bold text-cyan-600">${course.price}</div>
                        </div>
                        <CardTitle className="text-lg text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                          {course.courseCode} - {course.courseName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 flex-grow">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            <span className="line-clamp-1">Face to Face Training</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            <span className="line-clamp-1">Delivery: On-site</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-cyan-500" />
                            <span>{course.duration || "1 Day"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-cyan-500" />
                            <span>{course.enrolledStudentsCount || 0} enrolled</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {course.hasTheory && (
                            <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                              Theory
                            </Badge>
                          )}
                          {course.hasPractical && (
                            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                              Practical
                            </Badge>
                          )}
                          {course.hasExam && (
                            <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                              Exam
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        {course.experienceBookingEnabled ? (
                          <>
                            <Button 
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-11 font-semibold shadow-lg flex items-center justify-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onBookCourse) onBookCourse(course.courseId, course.courseCode, course.courseName, course.experiencePrice || course.price, 'with');
                              }}
                            >
                              {course.experienceOriginalPrice && (
                                <span className="price-strikethrough text-white/80 text-base mr-1">${course.experienceOriginalPrice}</span>
                              )}
                              <span className="price-current text-lg">${course.experiencePrice || course.price}</span>
                              <span className="ml-1">Book With Experience</span>
                            </Button>
                            <Button 
                              className="w-full bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white rounded-xl h-11 font-semibold shadow-lg flex items-center justify-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onBookCourse) onBookCourse(course.courseId, course.courseCode, course.courseName, course.noExperiencePrice || course.price, 'without');
                              }}
                            >
                              {course.noExperienceOriginalPrice && (
                                <span className="price-strikethrough text-white/80 text-base mr-1">${course.noExperienceOriginalPrice}</span>
                              )}
                              <span className="price-current text-lg">${course.noExperiencePrice || course.price}</span>
                              <span className="ml-1">Book Without Experience</span>
                            </Button>
                          </>
                        ) : (
                          <Button 
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl h-11 font-semibold shadow-lg flex items-center justify-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onBookCourse) onBookCourse(course.courseId, course.courseCode, course.courseName, course.price);
                            }}
                          >
                            {course.originalPrice && (
                              <span className="price-strikethrough text-white/80 text-base mr-1">${course.originalPrice}</span>
                            )}
                            <span className="price-current text-lg">${course.price}</span>
                            <span className="ml-1">Book Now</span>
                          </Button>
                        )}
                        <Button 
                          variant="outline"
                          className="w-full border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-xl h-10 font-semibold"
                          onClick={(e) => { e.stopPropagation(); handleCourseClick(course.courseId); }}
                    >
                      View Details
                    </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* See More Button for Combo Courses */}
            {!isLoading && courses.filter(course => course.hasComboOffer).length > 3 && (
              <div className="text-center">
                <Button
                  onClick={() => setExpandedCombo(!expandedCombo)}
                  variant="outline"
                  className="border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-full px-8 h-12 text-lg font-semibold"
                >
                  {expandedCombo ? "Show Less" : "See More Combo Courses"}
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${expandedCombo ? "rotate-180" : ""}`} />
                </Button>
              </div>
            )}
          </div>

          {/* No Combo Courses Message */}
          {!isLoading && courses.filter(course => course.hasComboOffer).length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Combo Offers Available</h3>
              <p className="text-gray-600">Check back soon for exciting combo course packages!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Courses Section - Organized by Category */}
      <section id="courses" className="py-20 bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
              <span className="ml-2 text-gray-600">Loading courses...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchCourses} variant="outline">
                Try Again
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No categories available.</p>
            </div>
          ) : (
            categories.map((category, catIndex) => {
              const categoryCourses = getCoursesByCategory(category.categoryName);
              
              if (categoryCourses.length === 0) return null;

              const isExpanded = expandedCategories.has(category.categoryId);
              const displayedCourses = isExpanded ? categoryCourses : categoryCourses.slice(0, 3);
              const hasMore = categoryCourses.length > 3;

              return (
                <motion.div
                  key={category.categoryId}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: catIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <div className="mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-3">
                      {category.categoryName}
                    </h2>
                  </div>

                  {/* Course Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
                    {displayedCourses.map((course, index) => (
                      <motion.div
                        key={course.courseId}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onClick={() => handleCourseClick(course.courseId)}
                        className="cursor-pointer"
                      >
                        <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-cyan-400 rounded-2xl overflow-hidden bg-white h-full flex flex-col transform hover:-translate-y-2">
                          <div className="relative h-56 overflow-hidden">
                            <ImageWithFallback
                              src={course.imageUrl || "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1080"}
                              alt={course.courseName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-cyan-500 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                                {course.validityPeriod || "5 years"}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">View Details</span>
                            </div>
                          </div>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                variant="outline"
                                className="border-blue-300 text-blue-700 font-semibold text-xs"
                              >
                                {category.categoryName}
                              </Badge>
                              <div className="text-2xl font-bold text-cyan-600">${course.price}</div>
                            </div>
                            <CardTitle className="text-lg text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                              {course.courseCode} - {course.courseName}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 flex-grow">
                            {/* Location and Delivery instead of description */}
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                <span className="line-clamp-1">Face to Face Training</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                <span className="line-clamp-1">Delivery: On-site</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-cyan-500" />
                                <span>{course.duration || "2 days"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-cyan-500" />
                                <span>{course.enrolledStudentsCount} students</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {course.hasTheory && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  Theory
                                </Badge>
                              )}
                              {course.hasPractical && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Practical
                                </Badge>
                              )}
                              {course.hasExam && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-0">
                                  <Award className="w-3 h-3 mr-1" />
                                  Exam
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col gap-2">
                            {course.experienceBookingEnabled ? (
                              <>
                                <Button 
                                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl h-11 font-semibold shadow-lg flex items-center justify-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onBookCourse) onBookCourse(course.courseId, course.courseCode, course.courseName, course.experiencePrice || course.price, 'with');
                                  }}
                                >
                                  {course.experienceOriginalPrice && (
                                    <span className="price-strikethrough text-white/80 text-base mr-1">${course.experienceOriginalPrice}</span>
                                  )}
                                  <span className="price-current text-lg">${course.experiencePrice || course.price}</span>
                                  <span className="ml-1">Book With Experience</span>
                                </Button>
                                <Button 
                                  className="w-full bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white rounded-xl h-11 font-semibold shadow-lg flex items-center justify-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onBookCourse) onBookCourse(course.courseId, course.courseCode, course.courseName, course.noExperiencePrice || course.price, 'without');
                                  }}
                                >
                                  {course.noExperienceOriginalPrice && (
                                    <span className="price-strikethrough text-white/80 text-base mr-1">${course.noExperienceOriginalPrice}</span>
                                  )}
                                  <span className="price-current text-lg">${course.noExperiencePrice || course.price}</span>
                                  <span className="ml-1">Book Without Experience</span>
                                </Button>
                              </>
                            ) : (
                              <Button 
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl h-11 font-semibold shadow-lg flex items-center justify-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onBookCourse) onBookCourse(course.courseId, course.courseCode, course.courseName, course.price);
                                }}
                              >
                                {course.originalPrice && (
                                  <span className="price-strikethrough text-white/80 text-base mr-1">${course.originalPrice}</span>
                                )}
                                <span className="price-current text-lg">${course.price}</span>
                                <span className="ml-1">Book Now</span>
                              </Button>
                            )}
                            <Button 
                              variant="outline"
                              className="w-full border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-xl h-10 font-semibold"
                              onClick={(e) => { e.stopPropagation(); handleCourseClick(course.courseId); }}
                    >
                      View Details
                    </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                    ))}
                  </div>

                  {/* View More Button */}
                  {hasMore && (
                    <div className="text-center">
                      <Button
                        onClick={() => toggleCategory(category.categoryId)}
                        variant="outline"
                        className="border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-full px-8 h-12 text-lg font-semibold"
                      >
                        {isExpanded ? "Show Less" : `See More ${category.categoryName}`}
                        <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 mb-4">
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
                  24
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">About Us</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Safety Training Academy is a Registered Training Organization specializing in Training and Assessing of
                High-Risk Licencing under the National Standard for licencing persons performing High Risk Work.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team at Safety Training Academy consists of highly skilled industry experts with extensive knowledge
                and field experience within their specialised sector. The training facilities, internal and external
                zones, are well equipped with up-to-date learning materials developed to deliver specific industry and
                client training needs.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">2019</div>
                    <div className="text-sm text-gray-600">Year Established</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">Over 50</div>
                    <div className="text-sm text-gray-600">Years of combined experience</div>
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-8 h-12 text-lg font-semibold shadow-lg mt-6">
                See More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400"
                  alt="Training facility"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400"
                  alt="Equipment training"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="space-y-4 mt-8">
                <ImageWithFallback
                  src="/assets/workers.png"
                  alt="Student learning"
                  className="w-full h-48 object-cover rounded-2xl shadow-lg"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400"
                  alt="Practical training"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 mb-8">Reviews</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {googleReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {review.isMainReview ? (
                  <Card className="border-2 border-blue-200 rounded-2xl bg-white shadow-lg p-6 text-center">
                    <div className="mb-4">
                      <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 bg-clip-text mb-2">
                        G
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">{review.author}</div>
                    </div>
                    <div className="text-5xl font-bold text-slate-900 mb-2">{review.rating}.0</div>
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-full w-full"
                    >
                      review us on
                      <div className="w-5 h-5 ml-2 bg-white rounded shadow-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-transparent bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text">
                          G
                        </span>
                      </div>
                    </Button>
                  </Card>
                ) : (
                  <Card className="border-2 border-blue-100 rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-slate-900 text-sm">{review.author}</div>
                      <div className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-transparent bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text">
                          G
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.text}</p>
                    <p className="text-xs text-gray-500">{review.time}</p>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 mb-4">Our Clients</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <ImageWithFallback
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-24 object-contain grayscale hover:grayscale-0 transition-all"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section - Contact Form & Enrollment */}
      <section
        id="contact"
        className="relative py-20 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 overflow-hidden"
      >
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Send Us A Message */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-cyan-400 to-cyan-500 border-0 shadow-2xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-white">Send Us A Message!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Name*" className="bg-white border-0 rounded-xl h-12" />
                    <Input placeholder="Phone*" className="bg-white border-0 rounded-xl h-12" />
                  </div>
                  <Input placeholder="Email*" type="email" className="bg-white border-0 rounded-xl h-12" />
                  <Input placeholder="Subject" className="bg-white border-0 rounded-xl h-12" />
                  <Textarea
                    placeholder="Message"
                    className="bg-white border-0 rounded-xl min-h-32 resize-none"
                  />
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-12 font-semibold">
                    SEND
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Enrollment */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Course Enrolment</h2>
              <p className="text-white text-lg mb-8">
                To enrol for a Course with Safety Training Academy, please complete our online Enrolment form via the
                button below:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={onEnrollNow || onRegister}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-xl"
                >
                  ENROL NOW
                </Button>
                <Button
                  onClick={onLLNDTest}
                  variant="outline"
                  className="bg-cyan-500 hover:bg-cyan-600 border-0 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-xl"
                >
                  LLND TEST
                </Button>
                <Button
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 border-0 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-xl"
                >
                  VOC
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 w-fit">
                <img
                  src="/assets/SafetyTrainingAcademylogo.png"
                  alt="Safety Training Academy"
                  className="h-16 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-white/90 text-sm mb-4">Professional certification programs for your career growth.</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Head Office</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>1-3 Mary Street, Regents Park, NSW 2143 AUSTRALIA</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Contact</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>admin@safetytrainingacademy.edu.au</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>0403 415 066</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>0431 298 768</span>
                </li>
                <li className="text-xs">RTO: 45234</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Link</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#courses" className="hover:text-white transition-colors">
                    Book Now
                  </a>
                </li>
                <li>
                  <a href="#courses" className="hover:text-white transition-colors">
                    Courses
                  </a>
                </li>
                <li>
                  <button onClick={onAbout} className="hover:text-white transition-colors text-left">
                    About Us
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <button onClick={onContact} className="hover:text-white transition-colors text-left">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/90">
            <p>&copy; 2024 Safety Training Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}