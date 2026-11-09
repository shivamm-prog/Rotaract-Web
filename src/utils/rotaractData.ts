import {
  AvenueOfService,
  ClubMember,
  RotaractEvent,
  ProjectItem,
  AchievementItem,
  GalleryItem,
  CoreTeamPosition,
  BODPosition,
} from '../types/rotaract';
import { formatDate } from './dateHelpers';

const EVENTS_STORAGE_KEY = 'rotaract_rscoe_events_v4';
const MEMBERS_STORAGE_KEY = 'rotaract_rscoe_members_v4';
const PROJECTS_STORAGE_KEY = 'rotaract_rscoe_projects_v4';
const ACHIEVEMENTS_STORAGE_KEY = 'rotaract_rscoe_achievements_v4';
const GALLERY_STORAGE_KEY = 'rotaract_rscoe_gallery_v4';
const TEAM_PROFILES_STORAGE_KEY = 'rotaract_rscoe_team_profiles_v1';

export const CORE_TEAM_POSITIONS: CoreTeamPosition[] = [
  'Club President',
  'Club Secretary',
  'Club Treasurer',
  'Club Vice President',
  'Admin Secretary',
  'Reporting Secretary',
  'Finance Director',
  'Sergeant at Arms',
  'Immediate Past President',
];

export const BOD_POSITIONS: { title: BODPosition; avenue: AvenueOfService; maxActive: number }[] = [
  { title: 'Professional Development Director', avenue: 'Professional Development', maxActive: 1 },
  { title: 'Community Service Director', avenue: 'Community Service', maxActive: 1 },
  { title: 'Club Service Director', avenue: 'Club Service', maxActive: 1 },
  { title: 'Joint Club Service Director', avenue: 'Club Service', maxActive: 1 },
  { title: 'International Service Director', avenue: 'International Service', maxActive: 1 },
  { title: 'RRRO & IRRO', avenue: 'International Service', maxActive: 1 },
  { title: 'Public Relations Officer', avenue: 'Public Relations', maxActive: 1 },
  { title: 'DEI Director', avenue: 'Community Service', maxActive: 1 },
  { title: 'Editor', avenue: 'Public Relations', maxActive: 2 }, // Editor can have TWO active accounts
  { title: 'Club Snapper', avenue: 'Public Relations', maxActive: 1 },
];

export const OFFICIAL_CORE_TEAM: { name: string; position: CoreTeamPosition; email: string }[] = [
  { name: 'Rtr. Shrishail Chavan', position: 'Club President', email: 'president@rscoe.rotaract3131.org' },
  { name: 'Rtr. Soham Shinde', position: 'Club Secretary', email: 'secretary@rscoe.rotaract3131.org' },
  { name: 'Rtr. Mayur Bharmal', position: 'Club Treasurer', email: 'treasurer@rscoe.rotaract3131.org' },
  { name: 'Rtr. Shivam Labhshetwar', position: 'Club Vice President', email: 'vp@rscoe.rotaract3131.org' },
  { name: 'Rtr. Srushti Holam', position: 'Admin Secretary', email: 'admin.sec@rscoe.rotaract3131.org' },
  { name: 'Rtr. Vedika Udhan', position: 'Reporting Secretary', email: 'reporting@rscoe.rotaract3131.org' },
  { name: 'Rtr. Vedant Bhilare', position: 'Finance Director', email: 'finance@rscoe.rotaract3131.org' },
  { name: 'Rtr. Sarthak Bhosale', position: 'Sergeant at Arms', email: 'sergeant@rscoe.rotaract3131.org' },
  { name: 'Rtr. Kaustubh Patil', position: 'Immediate Past President', email: 'ipp@rscoe.rotaract3131.org' },
];

export const OFFICIAL_BOD: { name: string; position: BODPosition; avenue: AvenueOfService; email: string }[] = [
  { name: 'Rtr. Arhant Ghuge', position: 'Professional Development Director', avenue: 'Professional Development', email: 'prof.dev@rscoe.rotaract3131.org' },
  { name: 'Rtr. Atharva Gawte', position: 'Community Service Director', avenue: 'Community Service', email: 'community@rscoe.rotaract3131.org' },
  { name: 'Rtr. Prajakta Chaudhari', position: 'Club Service Director', avenue: 'Club Service', email: 'clubservice@rscoe.rotaract3131.org' },
  { name: 'Rtr. Harsh Kantayan', position: 'Joint Club Service Director', avenue: 'Club Service', email: 'jt.clubservice@rscoe.rotaract3131.org' },
  { name: 'Rtr. Dhruvika Kate', position: 'International Service Director', avenue: 'International Service', email: 'isd@rscoe.rotaract3131.org' },
  { name: 'Rtr. Sanchita Mohare', position: 'RRRO & IRRO', avenue: 'International Service', email: 'rrro.irro@rscoe.rotaract3131.org' },
  { name: 'Rtr. Ayush Gaurkar', position: 'Public Relations Officer', avenue: 'Public Relations', email: 'pro@rscoe.rotaract3131.org' },
  { name: 'Rtr. Shreya Dhumal', position: 'DEI Director', avenue: 'Community Service', email: 'dei@rscoe.rotaract3131.org' },
  { name: 'Rtr. Siddhesh Ladkat', position: 'Editor', avenue: 'Public Relations', email: 'editor1@rscoe.rotaract3131.org' },
  { name: 'Rtr. Shrinivas Pawar', position: 'Editor', avenue: 'Public Relations', email: 'editor2@rscoe.rotaract3131.org' },
  { name: 'Rtr. Jayesh Kesare', position: 'Club Snapper', avenue: 'Public Relations', email: 'snapper@rscoe.rotaract3131.org' },
];

// Fixed leadership messages (Not editable from dashboard)
export const LEADERSHIP_MESSAGES = {
  president: {
    name: 'Rtr. Shrishail Chavan',
    title: 'Club President',
    term: 'RIY 2026–27',
    theme: 'कर्म • कौशलम् • कर्तव्य',
    quote: 'Leadership is not about holding a title; it is about creating meaningful avenues where passion translates into real community upliftment.',
    message: `Welcome to the official digital portal of the Rotaract Club of RSCOE (Rotaract District 3131). As we step into our glorious 9th year of youth empowerment, our guiding beacon for RIY 2026–27 is “कर्म • कौशलम् • कर्तव्य”.

Karma represents the unyielding spirit of purposeful action. Kaushalam stands for the mastery of contemporary skills, technology, and visionary leadership. Kartavya is our eternal moral duty toward society, our college, and mankind. Together, these three pillars inspire every initiative we undertake—from grassroots rural education to cutting-edge technical innovation and impactful humanitarian relief drives.

Rotaract Club of RSCOE has continually set benchmarks across District 3131, distinguished by our historic induction into the India Book of Records and an astounding tally of 13 District Awards in RIY 2025–26. As President, I invite every curious mind, dedicated volunteer, and philanthropic partner to join us in shaping a brighter, more compassionate tomorrow.`,
  },
  secretary: {
    name: 'Rtr. Soham Shinde',
    title: 'Club Secretary',
    term: 'RIY 2026–27',
    quote: 'Meticulous execution, transparent communication, and genuine camaraderie form the backbone of extraordinary teamwork.',
    message: `Greetings to all fellow Rotarians, Rotaractors, faculty members, and guests. As the Club Secretary for RIY 2026–27, it gives me immense pride to present our state-of-the-art organizational platform.

Over the past nine years, the Rotaract Club of RSCOE has stood tall as a vibrant hub of youth transformation at JSPM's Rajarshi Shahu College of Engineering. Through seamless collaboration across our Board of Directors and Core Team, we ensure every project—whether Project Saptarishi, Rotaract ki Pathshala, or Avahan—is documented with precision, audited with integrity, and executed with passion.

Our commitment is to foster an inclusive environment where every member discovers their true potential, builds lifelong professional networks, and serves society unconditionally. Let us stride forward together with vigor and honor our theme: कर्म • कौशलम् • कर्तव्य.`,
  },
};

// Initial Projects
export function getInitialProjects(): ProjectItem[] {
  return [
    {
      id: 'proj-saptarishi',
      title: 'Project Saptarishi',
      avenue: 'Community Service',
      date: '2026-10-15',
      impact: 'Reached 4,500+ citizens across 7 specialized social development domains',
      description: 'A 7-day multi-avenue mega social campaign delivering 7 targeted impact interventions for community empowerment.',
      details: 'Project Saptarishi is one of RAC RSCOE’s crowning flagship initiatives. Conducted annually across Pune and surrounding semi-urban belts, it encompasses 7 continuous days dedicated to Primary Education, Preventive Healthcare, Tree Stewardship, Women Hygiene Awareness, Stray Animal Welfare, Digital Literacy for Seniors, and Traffic Safety. The project mobilized over 80 Rotaractors and partnered with top local NGOs.',
      isPinned: true,
      featured: true,
      createdAt: Date.now() - 86400000 * 20,
      updatedAt: Date.now() - 86400000 * 20,
    },
    {
      id: 'proj-pathshala',
      title: 'Rotaract ki Pathshala',
      avenue: 'Community Service',
      date: '2026-09-08',
      impact: '280+ underprivileged children equipped with foundational learning kits and STEM guidance',
      description: 'Continuous weekly coaching, digital fundamentals, and personal development camps for primary school students.',
      details: 'Rotaract ki Pathshala bridges the educational gap by establishing volunteer-led classroom circles at nearby municipal and ZP schools. Rotaractors conduct weekend modules covering mathematics fundamentals, basic science experiments, spoken English, and creative arts, accompanied by full stationery and nutrition kit donations.',
      isPinned: true,
      featured: true,
      createdAt: Date.now() - 86400000 * 45,
      updatedAt: Date.now() - 86400000 * 45,
    },
    {
      id: 'proj-avahan',
      title: 'Avahan — Youth Leadership Conclave',
      avenue: 'Professional Development',
      date: '2026-08-20',
      impact: '650+ collegiate delegates engaged with industry icons and civic leaders',
      description: 'Premier inter-collegiate leadership summit designed to cultivate entrepreneurial mindset and ethical governance.',
      details: 'Avahan unites prominent corporate leaders, startup founders, IAS/IPS mentors, and dynamic youth icons for intensive keynote sessions, policy hackathons, and panel debates. It provides university students with direct mentorship, internship pathways, and insights into 21st-century problem solving.',
      isPinned: true,
      featured: true,
      createdAt: Date.now() - 86400000 * 60,
      updatedAt: Date.now() - 86400000 * 60,
    },
    {
      id: 'proj-drishti',
      title: 'Drishti 1.0 & 2.0',
      avenue: 'Community Service',
      date: '2026-07-12',
      impact: '1,500+ individuals screened; 420+ free corrective spectacles prescribed & distributed',
      description: 'Massive community eye health checkup, cataract screening, and free spectacle distribution mission.',
      details: 'Organized in collaboration with specialized ophthalmic hospitals, Drishti 1.0 and 2.0 conducted comprehensive eye screenings across rural fringes of Pimpri-Chinchwad. The initiative provided surgical cataract referrals and delivered high-quality prescription glasses to elderly citizens and underprivileged laborers completely free of charge.',
      isPinned: false,
      featured: true,
      createdAt: Date.now() - 86400000 * 90,
      updatedAt: Date.now() - 86400000 * 90,
    },
    {
      id: 'proj-pawcare',
      title: 'Paw Care Drive',
      avenue: 'Community Service',
      date: '2026-06-25',
      impact: '350+ community strays vaccinated, treated, and fitted with luminous reflective safety collars',
      description: 'Compassionate animal welfare outreach focusing on anti-rabies vaccination, nutrition, and night-accident prevention.',
      details: 'Our animal welfare volunteers took to the streets to install high-visibility neon reflective collars on community dogs to prevent night road accidents. The drive also offered anti-rabies booster vaccinations in partnership with verified animal shelter veterinarians and distributed nutritious meals.',
      isPinned: false,
      featured: false,
      createdAt: Date.now() - 86400000 * 110,
      updatedAt: Date.now() - 86400000 * 110,
    },
    {
      id: 'proj-mauliseva',
      title: 'Mauli Seva',
      avenue: 'Community Service',
      date: '2026-07-01',
      impact: 'Served 12,000+ Warkari pilgrims during the historic Pandharpur Palkhi Yatra',
      description: 'Annual humanitarian seva camp offering continuous hydration, fresh food, foot massages, and emergency aid to pilgrims.',
      details: 'During the auspicious Sant Tukaram Maharaj and Sant Dnyaneshwar Maharaj Palkhi procession passing through Pune, RAC RSCOE members set up round-the-clock aid centers. Rotaractors served cooling glucose drinks, healthy meals, medical first aid, and blister care to thousands of devout pilgrims on foot.',
      isPinned: false,
      featured: false,
      createdAt: Date.now() - 86400000 * 120,
      updatedAt: Date.now() - 86400000 * 120,
    },
    {
      id: 'proj-rahat',
      title: 'Project Rahat',
      avenue: 'Community Service',
      date: '2026-01-18',
      impact: '600+ winter kits and high-density warm blankets handed to homeless families',
      description: 'Winter relief and crisis care drive bringing vital warmth and dignity to vulnerable pavement dwellers.',
      details: 'Project Rahat operates in peak winter nights across Pune railway stations, bus terminuses, and construction labor colonies. Rotaractors distribute thermal blankets, woollen caps, warm socks, and emergency dry rations to shield vulnerable elderly citizens and toddlers from harsh climatic drops.',
      isPinned: false,
      featured: false,
      createdAt: Date.now() - 86400000 * 180,
      updatedAt: Date.now() - 86400000 * 180,
    },
  ];
}

// Initial Achievements
export function getInitialAchievements(): AchievementItem[] {
  return [
    {
      id: 'ach-ibr',
      title: 'India Book of Records Induction',
      category: 'National Record',
      year: 'RIY 2024–25',
      description: 'Officially entered into the prestigious India Book of Records for conducting one of the largest synchronized community impact drives executed by an institution-based youth club.',
      recognizedBy: 'India Book of Records Editorial Board',
      badge: 'National Record',
      createdAt: Date.now() - 86400000 * 300,
    },
    {
      id: 'ach-13awards',
      title: '13 District 3131 Excellence Awards',
      category: 'District Recognition',
      year: 'RIY 2025–26',
      description: 'Swept 13 major district honors at the Annual Rotaract District 3131 Awards Assembly, recognizing outstanding performance in Club Service, Community Upliftment, Editorial Leadership, and Flagship Initiatives.',
      recognizedBy: 'Rotaract District Organization 3131',
      badge: '13 District Awards',
      createdAt: Date.now() - 86400000 * 140,
    },
    {
      id: 'ach-flagship-saptarishi',
      title: 'Best Multi-Avenue Initiative — Project Saptarishi',
      category: 'Project Excellence',
      year: 'RIY 2025–26',
      description: 'Awarded the Highest Commendation for sustainable multi-avenue community development impact across Pune and Pimpri-Chinchwad.',
      recognizedBy: 'District Awards Committee RID 3131',
      badge: 'Best Flagship Project',
      createdAt: Date.now() - 86400000 * 135,
    },
    {
      id: 'ach-best-club',
      title: 'Outstanding College-Based Club Citation',
      category: 'Club Performance',
      year: 'RIY 2025–26',
      description: 'Conferred upon Rotaract Club of RSCOE for exemplary administrative reporting, 100% active membership engagement, and high-impact social service.',
      recognizedBy: 'Rotary International District 3131',
      badge: 'Exemplary Club Citation',
      createdAt: Date.now() - 86400000 * 130,
    },
    {
      id: 'ach-editorial',
      title: 'Best Club Bulletin & Creative Media Award',
      category: 'Media & Editorial',
      year: 'RIY 2024–25',
      description: 'Celebrated for visually stunning digital publication, quarterly magazine issues, and impactful storytelling across all digital touchpoints.',
      recognizedBy: 'District Editorial Board RID 3131',
      badge: 'Best Publication',
      createdAt: Date.now() - 86400000 * 320,
    },
  ];
}

// Initial Gallery Items
export function getInitialGallery(): GalleryItem[] {
  return [
    {
      id: 'gal-1',
      title: 'Project Saptarishi Mega Inauguration',
      type: 'photo',
      category: 'projects',
      mediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      caption: 'Inaugural lamp lighting ceremony and kickoff of 7 consecutive days of community service.',
      date: '2026-10-15',
      createdAt: Date.now() - 86400000 * 20,
    },
    {
      id: 'gal-2',
      title: 'Rotaract ki Pathshala: STEM Workshop',
      type: 'photo',
      category: 'projects',
      mediaUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Rotaractors conducting hands-on science experiments with primary school students.',
      date: '2026-09-08',
      createdAt: Date.now() - 86400000 * 45,
    },
    {
      id: 'gal-3',
      title: 'Avahan Youth Leadership Summit Keynote',
      type: 'photo',
      category: 'events',
      mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      caption: 'Packed RSCOE auditorium delegates listening to keynote address by industry icons.',
      date: '2026-08-20',
      createdAt: Date.now() - 86400000 * 60,
    },
    {
      id: 'gal-4',
      title: 'Drishti 2.0 Comprehensive Vision Checkup',
      type: 'photo',
      category: 'projects',
      mediaUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      caption: 'Specialist optometrists performing digital eye scans for village elders in Tathawade.',
      date: '2026-07-12',
      createdAt: Date.now() - 86400000 * 90,
    },
    {
      id: 'gal-5',
      title: 'Mauli Seva: Pandharpur Palkhi Relief Camp',
      type: 'photo',
      category: 'events',
      mediaUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      caption: 'Rotaractors providing hydration, energy drinks, and first aid to passing Warkari pilgrims.',
      date: '2026-07-01',
      createdAt: Date.now() - 86400000 * 120,
    },
    {
      id: 'gal-6',
      title: 'Paw Care Drive: Safety Reflective Collars',
      type: 'photo',
      category: 'projects',
      mediaUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Installing glow-in-the-dark reflective safety bands on stray animals to prevent road collisions.',
      date: '2026-06-25',
      createdAt: Date.now() - 86400000 * 110,
    },
    {
      id: 'gal-7',
      title: 'District 3131 Awards Felicitation Night',
      type: 'photo',
      category: 'general',
      mediaUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      caption: 'RAC RSCOE Core Team and BOD hoisting 13 district award trophies on stage.',
      date: '2026-05-18',
      createdAt: Date.now() - 86400000 * 140,
    },
    {
      id: 'gal-8',
      title: 'Project Rahat Winter Warmth Distribution',
      type: 'photo',
      category: 'projects',
      mediaUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Delivering warm thermal blankets and winter apparel kits to pavement dwellers.',
      date: '2026-01-18',
      createdAt: Date.now() - 86400000 * 180,
    },
  ];
}

// Initial Events
export function getInitialEvents(): RotaractEvent[] {
  return [
    {
      id: 'evt-1',
      title: 'Project Saptarishi 2026 — Day 1 Mega Health & Blood Drive',
      avenue: 'Community Service',
      status: 'upcoming',
      date: '2026-11-20',
      startTime: '09:00',
      endTime: '17:00',
      venue: 'RSCOE D-Building Foyer & Central Health Clinic, Tathawade',
      chairperson: 'Rtr. Atharva Gawte (Dir. Community Service)',
      coChairperson: 'Rtr. Shreya Dhumal',
      budget: 25000,
      expectedAttendees: 350,
      description: 'Opening day of flagship Project Saptarishi featuring a blood donation drive with Sassoon Hospital and comprehensive health screening.',
      objectives: 'Collect 200+ units of safe blood and conduct preventive lifestyle screenings for local youth and staff.',
      isFlagship: true,
      isPinned: true,
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'evt-2',
      title: 'Avahan 2026: Youth Leadership & Innovation Conclave',
      avenue: 'Professional Development',
      status: 'upcoming',
      date: '2026-12-05',
      startTime: '10:00',
      endTime: '18:00',
      venue: 'Main Auditorium, JSPM RSCOE Campus, Tathawade',
      chairperson: 'Rtr. Arhant Ghuge (Dir. Professional Development)',
      budget: 45000,
      expectedAttendees: 600,
      description: 'Inter-collegiate youth symposium uniting startup founders, technology leaders, and public governance mentors.',
      objectives: 'Deliver intensive masterclasses on AI, social entrepreneurship, and public policy for engineering students.',
      isFlagship: true,
      isPinned: true,
      createdAt: Date.now() - 86400000 * 10,
      updatedAt: Date.now() - 86400000 * 10,
    },
    {
      id: 'evt-3',
      title: 'Drishti 2.0: Senior Citizen Vision Camp',
      avenue: 'Community Service',
      status: 'live',
      date: formatDate(new Date()),
      startTime: '10:00',
      endTime: '16:00',
      venue: 'Seminar Hall 1, JSPM RSCOE, Pune',
      chairperson: 'Rtr. Atharva Gawte',
      coChairperson: 'Rtr. Shivam Labhshetwar',
      budget: 20000,
      expectedAttendees: 200,
      actualAttendees: 165,
      description: 'Live ophthalmic testing and prescription eyewear distribution drive for campus workers and elderly residents of Tathawade.',
      objectives: 'Provide free refractive error screening and 150+ free corrective glasses.',
      isFlagship: true,
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'evt-4',
      title: 'Club Assembly & RIY 2026–27 Strategy Meet',
      avenue: 'Club Service',
      status: 'completed',
      date: '2026-10-02',
      startTime: '16:00',
      endTime: '18:30',
      venue: 'Board Room, RSCOE Admin Block',
      chairperson: 'Rtr. Prajakta Chaudhari (Dir. Club Service)',
      coChairperson: 'Rtr. Harsh Kantayan',
      budget: 5000,
      actualExpense: 4800,
      expectedAttendees: 70,
      actualAttendees: 74,
      description: 'Quarterly review of club projects, budget audit, and planning for RIY 2026-27 under the theme कर्म • कौशलम् • कर्तव्य.',
      objectives: 'Evaluate avenue progress, finalize event calendar, and review member induction roster.',
      reportSummary: 'Successfully completed with 100% Core Team and BOD quorum. Approved roadmap for Q3 and Q4.',
      createdAt: Date.now() - 86400000 * 35,
      updatedAt: Date.now() - 86400000 * 35,
    },
  ];
}

// Initial Members list with accurate Core Team and BOD
export function getInitialMembers(): ClubMember[] {
  const members: ClubMember[] = [];

  // Core Team
  OFFICIAL_CORE_TEAM.forEach((c, idx) => {
    const initials = c.name
      .replace('Rtr.', '')
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    members.push({
      id: `core-${idx + 1}`,
      name: c.name,
      role: c.position,
      category: 'core',
      positionKey: c.position,
      avenue: c.position === 'Finance Director' ? 'Club Service' : 'Club Service',
      email: c.email,
      avatarInitials: initials || 'RT',
      joinedDate: '2024-07-01',
    });
  });

  // BOD
  OFFICIAL_BOD.forEach((b, idx) => {
    const initials = b.name
      .replace('Rtr.', '')
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
    members.push({
      id: `bod-${idx + 1}`,
      name: b.name,
      role: b.position,
      category: 'bod',
      positionKey: b.position,
      avenue: b.avenue,
      email: b.email,
      avatarInitials: initials || 'BD',
      joinedDate: '2025-07-01',
    });
  });

  return members;
}

// Local storage loaders & savers
export function loadStoredEvents(): RotaractEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read cached events:', e);
  }
  return getInitialEvents();
}

export function saveStoredEvents(events: RotaractEvent[]): void {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Could not cache events:', e);
  }
}

export function loadStoredMembers(): ClubMember[] {
  try {
    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read cached members:', e);
  }
  return getInitialMembers();
}

export function saveStoredMembers(members: ClubMember[]): void {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.warn('Could not cache members:', e);
  }
}

export function loadStoredProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read cached projects:', e);
  }
  return getInitialProjects();
}

export function saveStoredProjects(projects: ProjectItem[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('Could not cache projects:', e);
  }
}

export function loadStoredAchievements(): AchievementItem[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read cached achievements:', e);
  }
  return getInitialAchievements();
}

export function saveStoredAchievements(achievements: AchievementItem[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.warn('Could not cache achievements:', e);
  }
}

export function loadStoredGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read cached gallery:', e);
  }
  return getInitialGallery();
}

export function saveStoredGallery(gallery: GalleryItem[]): void {
  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(gallery));
  } catch (e) {
    console.warn('Could not cache gallery:', e);
  }
}

export function loadStoredTeamProfiles(): Record<string, Partial<ClubMember>> {
  try {
    const raw = localStorage.getItem(TEAM_PROFILES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read cached team profiles:', e);
  }
  return {};
}

export function saveStoredTeamProfiles(profiles: Record<string, Partial<ClubMember>>): void {
  try {
    localStorage.setItem(TEAM_PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Could not cache team profiles:', e);
  }
}

export function getSampleDemoEvents(): RotaractEvent[] {
  return getInitialEvents();
}
