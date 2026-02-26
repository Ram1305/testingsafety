import { useState, useEffect } from 'react';
import { Phone, Mail, Shield, Menu, X, MapPin, Send, Clock, Facebook, Linkedin, Instagram, ChevronDown, ChevronRight, Users, Award, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { courseService } from '../services/course.service';
import type { CourseListItem } from '../services/course.service';
import { categoryService } from '../services/category.service';
import type { CategoryDropdownItem } from '../services/category.service';
import { WhatsAppButton } from './ui/WhatsAppButton';
import logoImage from '/assets/SafetyTrainingAcademylogo.png';
import contactPersonImage from '/assets/Contact-Us.jpg.bv.jpg';

interface ContactPageProps {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onAbout?: () => void;
  onViewCourses?: () => void;
  onBookNow?: () => void;
  onCourseDetails?: (courseId: string) => void;
  onForms?: () => void;
  onFeesRefund?: () => void;
}

export function ContactPage({ onBack, onLogin, onRegister, onAbout, onViewCourses, onBookNow, onCourseDetails, onForms, onFeesRefund }: ContactPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [allCourses, setAllCourses] = useState<CourseListItem[]>([]);
  const [categories, setCategories] = useState<CategoryDropdownItem[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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

  const trainingCourses = [
    'Work Safely at Heights Training',
    'Confined Space Certification Training',
    'Forklift Truck Safety Training',
    'Boom Type EWP Over 11m Certification Training',
    'Excavator Operator Training',
    'Skid Steer Short Course Training',
    'Construction Work Safety Training (White Card)',
    'EWP Operator Training',
    'Telehandler Gold Card Training',
    'Earthmoving Courses'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
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
            <div className="hidden md:flex items-center gap-6 flex-1">
              <button onClick={onBack} className="text-white hover:text-cyan-400 transition-colors text-sm font-medium">
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
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
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
              <button className="text-white hover:text-cyan-400 transition-colors text-sm font-medium">
                RESOURCES
              </button>
              <button onClick={onAbout} className="text-white hover:text-cyan-400 transition-colors text-sm font-medium">
                ABOUT
              </button>
              <button className="text-cyan-400 border-b-2 border-cyan-400 transition-colors text-sm font-bold">
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
                onClick={onBookNow}
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
                <button onClick={onBack} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 text-left">HOME</button>
                <button onClick={onBack} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 text-left">COURSES</button>
                <button onClick={onAbout} className="text-white hover:text-cyan-400 transition-colors px-4 py-2 text-left">ABOUT</button>
                <button className="text-cyan-400 font-bold px-4 py-2 text-left">CONTACT</button>
                <button onClick={onBack} className="text-white font-bold px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-center">COMBO COURSES</button>
                <Button onClick={onBookNow} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">Book now</Button>
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
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <Badge className="bg-cyan-500 text-white px-6 py-2 text-lg mb-6">
              <Phone className="w-4 h-4 inline mr-2" />
              Get In Touch
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              We're here to answer your questions and help you get started
            </p>
          </motion.div>
        </div>
      </section>

      {/* We Are Here To Help You Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src={contactPersonImage} alt="Contact Person" className="w-full h-auto" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                We are here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">help you</span>
              </h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                If you have any enquiry about our trainings and courses, want to know about group booking, do not hesitate to contact us. Call us today or send us an email.
              </p>

              <div className="space-y-6">
                <Card className="border-2 border-cyan-100 bg-white shadow-lg hover:shadow-xl transition-all rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">Contact Us</p>
                        <a href="tel:1300975097" className="text-2xl font-bold text-slate-900 hover:text-cyan-600 transition-colors">
                          1300 975 097
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-100 bg-white shadow-lg hover:shadow-xl transition-all rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">Our Email</p>
                        <a href="mailto:info@safetytrainingacademy.edu.au" className="text-xl font-bold text-cyan-600 hover:text-cyan-700 transition-colors break-all">
                          info@safetytrainingacademy.edu.au
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Training Courses Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Our Training Courses */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/30 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-b border-cyan-500/30 pb-6">
                  <CardTitle className="text-3xl font-bold text-white">
                    Our Training
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-3">
                    {trainingCourses.map((course, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <a
                          href="#"
                          className="block text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-medium py-2 border-b border-slate-700 hover:border-cyan-500"
                        >
                          {course}
                        </a>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-700">
                    <div className="mb-6">
                      <h3 className="text-white text-xl font-bold mb-2">Safety Training Academy | Sydney</h3>
                      <a 
                        href="https://share.google/on3U2K0R0QAidiEqg" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 text-lg font-semibold transition-colors"
                      >
                        3/14-16 Marjorie Street, Sefton NSW 2162
                      </a>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl h-14 text-lg font-semibold shadow-lg shadow-cyan-500/50"
                      onClick={() => window.open('https://share.google/on3U2K0R0QAidiEqg', '_blank')}
                    >
                      <MapPin className="w-5 h-5 mr-2" />
                      CLICK FOR DIRECTION
                      <br />
                      <span className="text-sm font-normal">Find Us on Map</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Card className="bg-white border-2 border-blue-100 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 pb-6">
                  <CardTitle className="text-2xl text-slate-900">
                    Fill in the form below with your enquiry and submit. We do our best to reply at our earliest.
                    <br />
                    <span className="text-sm text-gray-600 mt-2 block">
                      Fields marked with an <span className="text-red-500">*</span> are required
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-2 border-gray-300 focus:border-cyan-500 rounded-xl h-12"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-2 border-gray-300 focus:border-cyan-500 rounded-xl h-12"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="border-2 border-gray-300 focus:border-cyan-500 rounded-xl h-12"
                        placeholder="Your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="border-2 border-gray-300 focus:border-cyan-500 rounded-xl min-h-32 resize-none"
                        placeholder="Your message or enquiry..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-14 text-lg font-semibold shadow-lg"
                    >
                      Submit
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-center mb-12">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 text-lg mb-4">
                <MapPin className="w-4 h-4 inline mr-2" />
                Find Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Visit Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Training Center</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                3/14-16 Marjorie Street, Sefton NSW 2162, Australia
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-cyan-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3315.4428574939586!2d151.00970731521!3d-33.789429180678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a31c7b93e85d%3A0x5017d681632c850!2s14-16%20Marjorie%20St%2C%20Sefton%20NSW%202162%2C%20Australia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Safety Training Academy Location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="border-2 border-cyan-100 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Address</h3>
                  <p className="text-gray-700">3/14-16 Marjorie Street<br />Sefton NSW 2162</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Phone</h3>
                  <p className="text-gray-700">1300 975 097<br />0403 415 066</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Hours</h3>
                  <p className="text-gray-700">Mon - Fri: 8am - 5pm<br />Sat: 9am - 2pm</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your training needs or enroll in one of our courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onRegister}
                className="bg-white text-cyan-600 hover:bg-gray-100 rounded-full px-8 h-14 text-lg font-semibold shadow-xl"
              >
                Enrol Now
              </Button>
              <Button 
                onClick={onViewCourses || onBack}
                className="bg-white text-cyan-600 hover:bg-gray-100 rounded-full px-8 h-14 text-lg font-semibold shadow-xl"
              >
                View Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImage} alt="Safety Training Academy" className="h-12" />
              </div>
              <p className="text-white/90 text-sm mb-4">
                Professional certification programs for your career growth.
              </p>
              {/* Social Media Icons */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Head Office</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Safety Training Academy | Sydney - 3/14-16 Marjorie Street, Sefton NSW 2162</span>
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
                <li><button onClick={onBack} className="hover:text-white transition-colors">Home</button></li>
                <li><a href="#courses" className="hover:text-white transition-colors">Book Now</a></li>
                <li><a href="#courses" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
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
