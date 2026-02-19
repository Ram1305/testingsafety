// import { ArrowLeft, Clock, Users, Award, CheckCircle, BookOpen, Target, Zap, Star, Calendar } from 'lucide-react';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Input } from './ui/input';
// import { ImageWithFallback } from './figma/ImageWithFallback';
// import { motion } from 'motion/react';

// interface Course {
//   id: string;
//   title: string;
//   category: string;
//   duration: string;
//   students: number;
//   price: number;
//   image: string;
//   hasTheory: boolean;
//   hasPractical: boolean;
//   hasExam: boolean;
//   validityPeriod: string;
//   description: string;
//   fullDescription: string;
//   prerequisites: string[];
//   benefits: string[];
//   courseContent: string[];
// }

// interface CourseDetailsPageProps {
//   course: Course;
//   onBack: () => void;
//   onEnroll: () => void;
// }

// export function CourseDetailsPage({ course, onBack, onEnroll }: CourseDetailsPageProps) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
//       {/* Top Search Bar Area */}
//       <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <Button
//             onClick={onBack}
//             variant="ghost"
//             className="text-white hover:text-cyan-400 mb-6"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back to Courses
//           </Button>
          
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <Badge className="bg-cyan-500 text-white px-3 py-1 mb-3">
//                 {course.category}
//               </Badge>
//               <h1 className="text-4xl md:text-5xl font-bold mb-2">
//                 {course.title}
//               </h1>
//               <p className="text-blue-100 text-lg">
//                 {course.description}
//               </p>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="max-w-2xl">
//             <Input
//               type="text"
//               placeholder="Search other courses..."
//               className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Side - Course Details */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Course Image */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
//             >
//               <ImageWithFallback
//                 src={course.image}
//                 alt={course.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute top-6 right-6">
//                 <Badge className="bg-cyan-500 text-white px-4 py-2 text-lg font-bold shadow-xl">
//                   {course.validityPeriod}
//                 </Badge>
//               </div>
//             </motion.div>

//             {/* Full Description */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//             >
//               <Card className="border-2 border-blue-100 shadow-xl rounded-3xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-slate-900">
//                     Course Overview
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-700 text-lg leading-relaxed">
//                     {course.fullDescription}
//                   </p>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Course Content */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               <Card className="border-2 border-blue-100 shadow-xl rounded-3xl bg-gradient-to-br from-white to-blue-50">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
//                     <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
//                       <BookOpen className="w-6 h-6 text-white" />
//                     </div>
//                     What You'll Learn
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {course.courseContent.map((item, index) => (
//                       <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
//                         <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                         <span className="text-gray-700">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Prerequisites */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               <Card className="border-2 border-orange-100 shadow-xl rounded-3xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
//                     <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
//                       <Target className="w-6 h-6 text-white" />
//                     </div>
//                     Prerequisites
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ul className="space-y-3">
//                     {course.prerequisites.map((item, index) => (
//                       <li key={index} className="flex items-start gap-3">
//                         <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
//                         <span className="text-gray-700 text-lg">{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* Benefits */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//             >
//               <Card className="border-2 border-green-100 shadow-xl rounded-3xl">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
//                     <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
//                       <Award className="w-6 h-6 text-white" />
//                     </div>
//                     Why Choose This Course
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {course.benefits.map((item, index) => (
//                       <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
//                         <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 fill-green-600" />
//                         <span className="text-gray-700">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Right Side - Enrollment Card (Sticky) */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="sticky top-6"
//             >
//               <Card className="border-2 border-cyan-200 shadow-2xl rounded-3xl overflow-hidden">
//                 {/* Price Header */}
//                 <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8 text-center">
//                   <div className="text-5xl font-bold mb-2">
//                     ${course.price}
//                   </div>
//                   <p className="text-blue-100 text-lg">Course Fee</p>
//                 </div>

//                 <CardContent className="p-6 space-y-6">
//                   {/* Course Details */}
//                   <div className="space-y-4">
//                     <h3 className="text-xl font-bold text-slate-900 mb-4">Course Details</h3>
                    
//                     <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
//                       <span className="text-gray-700 flex items-center gap-2 font-semibold">
//                         <Clock className="w-5 h-5 text-cyan-600" />
//                         Duration
//                       </span>
//                       <span className="font-bold text-slate-900">{course.duration}</span>
//                     </div>

//                     <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
//                       <span className="text-gray-700 flex items-center gap-2 font-semibold">
//                         <Users className="w-5 h-5 text-green-600" />
//                         Students
//                       </span>
//                       <span className="font-bold text-slate-900">{course.students}</span>
//                     </div>

//                     <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
//                       <span className="text-gray-700 flex items-center gap-2 font-semibold">
//                         <Award className="w-5 h-5 text-purple-600" />
//                         Validity
//                       </span>
//                       <span className="font-bold text-slate-900">{course.validityPeriod}</span>
//                     </div>
//                   </div>

//                   {/* Course Features */}
//                   <div className="flex flex-wrap gap-2">
//                     {course.hasTheory && (
//                       <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1.5 text-sm">
//                         <BookOpen className="w-3 h-3 mr-1" />
//                         Theory
//                       </Badge>
//                     )}
//                     {course.hasPractical && (
//                       <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1.5 text-sm">
//                         <CheckCircle className="w-3 h-3 mr-1" />
//                         Practical
//                       </Badge>
//                     )}
//                     {course.hasExam && (
//                       <Badge className="bg-purple-100 text-purple-700 border-0 px-3 py-1.5 text-sm">
//                         <Award className="w-3 h-3 mr-1" />
//                         Exam
//                       </Badge>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="space-y-3 pt-4">
//                     <Button 
//                       onClick={onEnroll}
//                       className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full h-14 text-lg font-bold shadow-xl"
//                     >
//                       BOOK NOW
//                     </Button>
//                     <Button 
//                       variant="outline"
//                       className="w-full border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-full h-12 font-semibold"
//                     >
//                       <Calendar className="w-4 h-4 mr-2" />
//                       View Course Calendar 2025
//                     </Button>
//                     <Button 
//                       variant="outline"
//                       className="w-full border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full h-12 font-semibold"
//                     >
//                       Download Brochure
//                     </Button>
//                   </div>

//                   {/* Trust Badges */}
//                   <div className="pt-4 border-t border-gray-200">
//                     <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
//                       <CheckCircle className="w-4 h-4 text-green-600" />
//                       <span>Nationally Recognized Certification</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Additional Info */}
//               <Card className="mt-6 border-2 border-blue-100 rounded-2xl">
//                 <CardContent className="p-6">
//                   <div className="flex items-start gap-3">
//                     <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                       <Award className="w-5 h-5 text-cyan-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-slate-900 mb-1">Need Help?</h4>
//                       <p className="text-sm text-gray-600 mb-2">
//                         Contact our training advisors for personalized guidance
//                       </p>
//                       <Button variant="link" className="text-cyan-600 p-0 h-auto">
//                         Call: 1300 876 097
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
