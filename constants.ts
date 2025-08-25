
import type { JobCategory } from './types';

export const JOB_CATEGORIES: JobCategory[] = [
    {
        name: "Any Category",
        subcategories: ["Any Skill"],
    },
    {
        name: "Websites, IT & Software",
        subcategories: [
            "Any Skill", "Software Development", "Website Development", "Mobile App Development", "Game Development", "WordPress", "E-Commerce", "UI/UX Design", "Quality Assurance", "DevOps", "Cybersecurity", "IT Support", "Database Administration", "Blockchain", "Artificial Intelligence",
        ],
    },
    {
        name: "Design, Media & Architecture",
        subcategories: [
            "Any Skill", "Graphic Design", "Logo Design", "Illustration", "Video Editing", "Animation", "Presentation Design", "Architectural Design", "Interior Design", "Fashion Design", "Photography", "Videography", "3D Modeling", "Branding",
        ],
    },
    {
        name: "Writing & Content",
        subcategories: [
            "Any Skill", "Content Writing", "Copywriting", "Technical Writing", "Creative Writing", "Editing & Proofreading", "Resume Writing", "Translation", "Ghostwriting", "SEO Writing", "Blog Writing", "Grant Writing", "Scriptwriting",
        ],
    },
    {
        name: "Data Entry & Admin",
        subcategories: [
            "Any Skill", "Data Entry", "Virtual Assistant", "Web Research", "Customer Support", "Project Management", "Transcription", "Data Processing", "Excel", "Order Processing", "Email Handling",
        ],
    },
    {
        name: "Sales & Marketing",
        subcategories: [
            "Any Skill", "Social Media Marketing", "SEO", "Email Marketing", "Content Marketing", "Lead Generation", "Sales", "Telemarketing", "Public Relations", "Affiliate Marketing", "Market Research", "Marketing Strategy", "Google Ads",
        ],
    },
    {
        name: "Engineering & Science",
        subcategories: [
            "Any Skill", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Chemical Engineering", "Data Science", "Machine Learning", "Product Design", "CAD", "Scientific Research", "Mathematics", "Biology",
        ],
    },
    {
        name: "Business, Accounting & Legal",
        subcategories: [
            "Any Skill", "Accounting", "Financial Planning", "Business Analysis", "Human Resources", "Management Consulting", "Legal Services", "Recruiting", "Bookkeeping", "Startup Consulting", "Intellectual Property",
        ],
    },
    {
        name: "Translation & Languages",
        subcategories: [
            "Any Skill", "English", "Spanish", "French", "German", "Chinese (Simplified)", "Japanese", "Russian", "Arabic", "Portuguese", "Italian", "Korean", "Hindi",
        ],
    },
];


export const LEVEL_OPTIONS: string[] = [
  "Any Level",
  "Entry-Level / Junior",
  "Intermediate / Mid-Level",
  "Expert / Senior",
];

export const INDUSTRY_OPTIONS: string[] = [
  "Any Industry",
  "Technology & SaaS",
  "Healthcare & Wellness",
  "Finance & FinTech",
  "Entertainment & Media",
  "E-commerce & Retail",
  "Education & E-Learning",
  "Gaming",
  "Real Estate",
  "Travel & Hospitality",
  "Non-profit",
  "Fashion & Apparel",
  "Automotive",
  "Marketing & Advertising",
  "Food & Beverage",
];

export const DELIVERY_TIME_OPTIONS: string[] = [
  "Any Timeframe",
  "Urgent (Within 24 hours)",
  "Short-term (Within a week)",
  "Standard (Within a month)",
  "Long-term (Ongoing)",
  "Flexible",
];

export const SEARCH_SOURCE_OPTIONS: string[] = [
  "Broad Search (Entire Web)",
  "Social Media (X, LinkedIn, FB Groups)",
  "Freelancer Sites (Upwork, etc.)",
  "Niche Communities (Reddit, etc.)",
  "Company Careers Pages",
];

export const LOCATION_OPTIONS: string[] = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "India",
    "Global / Remote",
];

export const COMMUNITY_CATEGORIES = [
    'General Discussion', 
    'Winning Proposals', 
    'Client Management', 
    'Tooling & Tech',
    'Success Stories',
];