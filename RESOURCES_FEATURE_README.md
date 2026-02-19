# Resources Navigation Feature

## Overview
Added a comprehensive Resources navigation dropdown menu across all pages with the following features:

## Features Implemented

### 1. Resources Dropdown Menu
- **Location**: Navigation bar across all pages (Landing, About, Contact, Book Now, Course Details, Course Booking, Forms, Fees & Refund)
- **Items**:
  - Forms
  - Unique Student Identifier (USI)
  - Gallery
  - Code of Practice (with nested dropdown)

### 2. Code of Practice Nested Dropdown
When hovering over "Code of Practice", it displays:
- **Manage and Control Asbestos in Workplace** → Opens PDF in new tab
- **Asbestos Removal** → Opens PDF in new tab
- **Confined Space** → Opens PDF in new tab
- **Working at Heights** → Opens PDF in new tab

### 3. Forms Page
**Route**: `/forms`
**Features**:
- Participant Handbook - Clickable card that opens PDF
- Complaints and Appeals Process - PDF link in new tab
- Fees and Refund Policy - Navigation to Fees & Refund page
- WHS Act - PDF link in new tab

### 4. Fees & Refund Policy Page
**Route**: `/fees-refund`
**Content Sections**:
- **Compulsory Fees**
  - Details about tuition fees and payment schedules
  
- **Refund Policy**
  - 13 detailed points about refund policies
  - Non-refundable $100 booking fee
  - Cancellation policies and timelines
  - Pro-rata refund calculations
  
- **Cooling-Off Period**
  - Consumer law information
  
- **Change to Conditions**
  - Academy's rights to modify terms

- **Related Documents**
  - Complaints and Appeals Process PDF
  - WHS Act PDF

## Technical Implementation

### New Components Created
1. **`FormsPage.tsx`** - Displays all forms and downloadable resources
2. **`FeesRefundPage.tsx`** - Displays terms & conditions and refund policy
3. **`ResourcesDropdown.tsx`** - Reusable dropdown component for navigation

### Updated Components
- **LandingPage.tsx** - Added Resources dropdown
- **AboutUsPage.tsx** - Added Resources dropdown
- **ContactPage.tsx** - Added Resources dropdown
- **BookNowPage.tsx** - Added Resources dropdown
- **CourseDetails.tsx** - Added Resources dropdown
- **CourseBooking.tsx** - Added Resources dropdown
- **App.tsx** - Added routing for new pages

### External Links
All PDF links open in new tabs (`target="_blank"` with `rel="noopener noreferrer"`) for:
- Student Handbook
- Complaints and Appeals Form
- WHS Act PDF
- Code of Practice PDFs (4 different documents)

## Navigation Flow
```
Resources Dropdown
├── Forms (navigates to Forms Page)
│   ├── Participant Handbook (PDF - new tab)
│   ├── Complaints & Appeals (PDF - new tab)
│   ├── Fees & Refund Policy (navigates to Fees & Refund Page)
│   └── WHS Act (PDF - new tab)
├── Unique Student Identifier (USI)
├── Gallery
└── Code of Practice (nested dropdown)
    ├── Manage and Control Asbestos in Workplace (PDF - new tab)
    ├── Asbestos Removal (PDF - new tab)
    ├── Confined Space (PDF - new tab)
    └── Working at Heights (PDF - new tab)
```

## Styling
- Uses consistent theme with cyan/blue color scheme
- Hover effects on all interactive elements
- Smooth animations using Framer Motion
- Responsive design for mobile and desktop
- Modern card-based layouts
- PDF indicators with red circular badges

## User Experience
- All PDFs open in new browser tabs/windows
- Smooth navigation between pages
- Consistent header and footer across all pages
- Mobile-responsive dropdown menus
- Visual feedback on hover and active states
- Clear document type indicators (PDF badges)
