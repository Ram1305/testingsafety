import { useState, useEffect } from 'react';
import { Search, Clock, Award, Sparkles, TrendingUp, Phone, Mail, Shield, Menu, X, Users, MapPin, Building, BookOpen, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { courseService } from '../services/course.service';
import type { CourseListItem } from '../services/course.service';
import { categoryService } from '../services/category.service';
import type { CategoryDropdownItem } from '../services/category.service';
import { WhatsAppButton } from './ui/WhatsAppButton';
import logoImage from '/assets/SafetyTrainingAcademylogo.png';

interface BookNowPageProps {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onCourseDetails?: (courseId: string) => void;
  onAbout?: () => void;
  onContact?: () => void;
  onForms?: () => void;
  onFeesRefund?: () => void;
}

export function BookNowPage({ onBack, onLogin, onRegister, onCourseDetails, onAbout, onContact, onForms, onFeesRefund }: BookNowPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [categories, setCategories] = useState<CategoryDropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular' | 'new'>('all');
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategoriesDropdown();
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();
      if (response.success && response.data) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseClick = (courseId: string) => {
    if (onCourseDetails) {
      onCourseDetails(courseId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      {/* Top Bar with Contact Info - Light Blue Stripe */}
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

      {/* Logo and Info Section - White Background */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6">
          {/* Logo */}
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
              <button onClick={onBack} className="text-white hover:text-cyan-400 transition-colors text-sm font-medium">
                HOME
              </button>
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
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                  className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors text-sm font-medium cursor-pointer"
                >
                  COURSES
                  <ChevronDown className={`w-4 h-4 transition-transform ${coursesDropdownOpen ? 'rotate-180' : ''}`} />
                </a>
                
                {/* Mega Menu Dropdown */}
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
              <button className="text-white hover:text-cyan-400 transition-colors text-sm font-medium">
                RESOURCES
              </button>
              <button onClick={onAbout} className="text-white hover:text-cyan-400 transition-colors text-sm font-medium">
                ABOUT
              </button>
              <button onClick={onContact} className="text-white hover:text-cyan-400 transition-colors text-sm font-medium">
                CONTACT
              </button>
              <div className="relative">
                <button
                  onClick={onBack}
                  className="text-white hover:text-cyan-400 transition-colors text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50 animate-pulse"
                >
                  COMBO COURSES
                </button>
              </div>
              <Button
                className="bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 rounded-full px-6 cursor-default"
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
                <button onClick={onBack} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 text-left">
                  HOME
                </button>
                <button onClick={onBack} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 text-left">
                  COURSES
                </button>
                <button onClick={onAbout} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 text-left">
                  ABOUT
                </button>
                <button onClick={onContact} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 text-left">
                  CONTACT
                </button>
                <button
                  onClick={onBack}
                  className="text-white font-bold px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-center"
                >
                  COMBO COURSES
                </button>
                <Button className="w-full bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400 cursor-default">Book now</Button>
                <Button variant="outline" className="w-full border-2 border-cyan-400 text-cyan-400">VOC</Button>
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

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Book Your Course Today</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 pb-4 leading-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ paddingBottom: '0.5rem' }}>
              Start Your Training Journey
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose from our wide range of nationally recognized courses and transform your career with expert-led training
            </p>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg rounded-full border-2 border-gray-200 focus:border-cyan-500 shadow-lg"
                />
              </div>
            </motion.div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('all')}
                className={selectedFilter === 'all' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full' 
                  : 'rounded-full border-2 border-gray-300 hover:border-cyan-500'}
              >
                All Courses
              </Button>
              <Button
                variant={selectedFilter === 'popular' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('popular')}
                className={selectedFilter === 'popular' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full' 
                  : 'rounded-full border-2 border-gray-300 hover:border-cyan-500'}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Popular
              </Button>
              <Button
                variant={selectedFilter === 'new' ? 'default' : 'outline'}
                onClick={() => setSelectedFilter('new')}
                className={selectedFilter === 'new' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full' 
                  : 'rounded-full border-2 border-gray-300 hover:border-cyan-500'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Arrivals
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-4 leading-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent" style={{ paddingBottom: '0.5rem' }}>
              Explore Our Courses
            </h2>
            <p className="text-gray-600 text-lg">
              {filteredCourses.length} courses found
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.courseId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
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
                            {course.categoryName || 'Training Course'}
                          </Badge>
                          <div className="text-2xl font-bold text-cyan-600">${course.price}</div>
                        </div>
                        <CardTitle className="text-lg text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                          {course.courseCode} - {course.courseName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 flex-grow">
                        {/* Location and Delivery */}
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
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl h-11 font-semibold shadow-lg">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filter</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our training
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onLogin}
                className="bg-white text-cyan-600 hover:bg-gray-100 rounded-full px-8 h-14 text-lg font-semibold shadow-xl"
              >
                Start Learning Today
              </Button>
              <Button
                onClick={onBack}
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 h-14 text-lg font-semibold"
              >
                Explore More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}
