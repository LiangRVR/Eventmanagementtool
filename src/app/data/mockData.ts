export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  capacity: number;
  registered: number;
  imageUrl: string;
  tags: string[];
}

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Design Thinking Workshop",
    category: "Workshop",
    date: "2026-04-15",
    time: "2:00 PM - 4:00 PM",
    location: "Student Center Room 305",
    organizer: "UX Design Club",
    description: "Learn the fundamentals of design thinking and human-centered design. This hands-on workshop will guide you through the design thinking process with real-world examples and interactive activities.",
    capacity: 30,
    registered: 18,
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
    tags: ["Design", "Workshop", "Interactive"]
  },
  {
    id: "2",
    title: "Campus Career Fair 2026",
    category: "Networking",
    date: "2026-04-20",
    time: "10:00 AM - 4:00 PM",
    location: "University Hall Auditorium",
    organizer: "Career Services",
    description: "Connect with over 50 employers from various industries. Bring your resume and be prepared to network with recruiters from top companies.",
    capacity: 200,
    registered: 147,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    tags: ["Career", "Networking", "Professional"]
  },
  {
    id: "3",
    title: "Spring Sustainability Fair",
    category: "Social",
    date: "2026-04-18",
    time: "12:00 PM - 3:00 PM",
    location: "Campus Green Lawn",
    organizer: "Environmental Club",
    description: "Join us for an afternoon celebrating sustainability! Learn about eco-friendly practices, meet local green businesses, and enjoy food from sustainable vendors.",
    capacity: 150,
    registered: 82,
    imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
    tags: ["Environment", "Community", "Outdoor"]
  },
  {
    id: "4",
    title: "Introduction to Machine Learning",
    category: "Workshop",
    date: "2026-04-22",
    time: "5:00 PM - 7:00 PM",
    location: "Computer Science Building Lab 201",
    organizer: "AI & ML Student Society",
    description: "Beginner-friendly introduction to machine learning concepts and applications. No prior experience required! We'll cover basics and walk through a simple ML project.",
    capacity: 40,
    registered: 35,
    imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80",
    tags: ["Technology", "AI", "Learning"]
  },
  {
    id: "5",
    title: "Community Garden Volunteer Day",
    category: "Volunteer",
    date: "2026-04-25",
    time: "9:00 AM - 1:00 PM",
    location: "Campus Community Garden",
    organizer: "Student Volunteers United",
    description: "Help us plant, weed, and maintain the campus community garden. All supplies provided. Dress for outdoor work and bring your enthusiasm!",
    capacity: 25,
    registered: 19,
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    tags: ["Volunteer", "Outdoor", "Community"]
  },
  {
    id: "6",
    title: "Open Mic Night",
    category: "Social",
    date: "2026-04-17",
    time: "7:00 PM - 10:00 PM",
    location: "Campus Cafe Stage",
    organizer: "Student Activities Board",
    description: "Showcase your talent or enjoy performances by fellow students! Poetry, music, comedy, and more. Sign-ups start at 6:30 PM.",
    capacity: 80,
    registered: 45,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    tags: ["Entertainment", "Music", "Social"]
  },
  {
    id: "7",
    title: "Mental Health Awareness Panel",
    category: "Panel",
    date: "2026-04-28",
    time: "3:00 PM - 5:00 PM",
    location: "Wellness Center Auditorium",
    organizer: "Student Health Services",
    description: "Join mental health professionals and student advocates for an important discussion about mental health on campus. Q&A session included.",
    capacity: 100,
    registered: 67,
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    tags: ["Health", "Wellness", "Discussion"]
  },
  {
    id: "8",
    title: "Startup Pitch Competition",
    category: "Competition",
    date: "2026-05-02",
    time: "1:00 PM - 5:00 PM",
    location: "Innovation Hub Main Stage",
    organizer: "Entrepreneurship Club",
    description: "Watch student entrepreneurs pitch their startup ideas to a panel of investors and industry experts. Top 3 winners receive funding and mentorship!",
    capacity: 120,
    registered: 94,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    tags: ["Business", "Competition", "Innovation"]
  },
  {
    id: "9",
    title: "International Food Festival",
    category: "Social",
    date: "2026-04-30",
    time: "5:00 PM - 8:00 PM",
    location: "Student Union Plaza",
    organizer: "International Student Association",
    description: "Experience flavors from around the world! Student cultural organizations will share traditional dishes from their home countries. Free admission!",
    capacity: 300,
    registered: 256,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    tags: ["Cultural", "Food", "Social"]
  },
  {
    id: "10",
    title: "Resume Review Session",
    category: "Workshop",
    date: "2026-04-16",
    time: "2:00 PM - 5:00 PM",
    location: "Career Center Room 102",
    organizer: "Career Development Office",
    description: "Get personalized feedback on your resume from career counselors. Drop-in session, no appointment needed. Bring printed copies of your resume.",
    capacity: 50,
    registered: 28,
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    tags: ["Career", "Professional", "Workshop"]
  }
];

export const categories = [
  "All",
  "Workshop",
  "Networking",
  "Social",
  "Volunteer",
  "Panel",
  "Competition"
];
