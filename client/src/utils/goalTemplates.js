export const religiousGoals = {
  Muslim: [
    {
      id: 'muslim_prayers',
      name: 'Daily Prayers',
      type: 'prayer_group',
      category: 'spiritual',
      iconType: 'spiritual',
      description: 'Complete all 5 daily prayers',
      prayers: [
        { id: 'fajr', name: 'Fajr Prayer', time: 'Dawn', iconType: 'sunrise' },
        { id: 'dhuhr', name: 'Dhuhr Prayer', time: 'Midday', iconType: 'sun' },
        { id: 'asr', name: 'Asr Prayer', time: 'Afternoon', iconType: 'sunset' },
        { id: 'maghrib', name: 'Maghrib Prayer', time: 'Sunset', iconType: 'sunset' },
        { id: 'isha', name: 'Isha Prayer', time: 'Night', iconType: 'moon' }
      ]
    },
    {
      id: 'quran_reading',
      name: 'Quran Reading',
      type: 'spiritual',
      category: 'worship',
      iconType: 'book',
      description: 'Daily Quran recitation'
    }
  ],
  
  Christian: [
    {
      id: 'christian_prayers',
      name: 'Daily Prayers',
      type: 'prayer_group',
      category: 'spiritual',
      iconType: 'spiritual',
      description: 'Morning and evening prayers',
      prayers: [
        { id: 'morning_prayer', name: 'Morning Prayer', time: 'Morning', iconType: 'sunrise' },
        { id: 'evening_prayer', name: 'Evening Prayer', time: 'Evening', iconType: 'moon' }
      ]
    },
    {
      id: 'bible_reading',
      name: 'Bible Reading',
      type: 'spiritual',
      category: 'worship',
      iconType: 'book',
      description: 'Daily Bible study'
    }
  ],
  
  Hindu: [
    {
      id: 'hindu_prayers',
      name: 'Daily Puja',
      type: 'prayer_group',
      category: 'spiritual',
      iconType: 'spiritual',
      description: 'Morning and evening worship',
      prayers: [
        { id: 'morning_puja', name: 'Morning Puja', time: 'Morning', iconType: 'sunrise' },
        { id: 'evening_puja', name: 'Evening Puja', time: 'Evening', iconType: 'moon' }
      ]
    },
    {
      id: 'mantra_chanting',
      name: 'Mantra Chanting',
      type: 'spiritual',
      category: 'worship',
      iconType: 'spiritual',
      description: 'Daily mantra recitation'
    }
  ],
  
  Other: [
    {
      id: 'meditation',
      name: 'Meditation',
      type: 'spiritual',
      category: 'mindfulness',
      iconType: 'meditation',
      description: 'Daily meditation practice'
    },
    {
      id: 'gratitude',
      name: 'Gratitude Practice',
      type: 'spiritual',
      category: 'mindfulness',
      iconType: 'heart',
      description: 'Daily gratitude reflection'
    }
  ]
};

export const commonGoals = [
  { 
    id: 'gym', 
    name: 'Gym/Workout', 
    type: 'health', 
    category: 'fitness', 
    iconType: 'activity', 
    restDay: 'Sunday' 
  },
  { 
    id: 'skill_learning', 
    name: 'Learn New Skill', 
    type: 'education', 
    category: 'development', 
    iconType: 'book', 
    customizable: true 
  },
  { 
    id: 'no_smoking', 
    name: 'Avoid Cigarettes', 
    type: 'health', 
    category: 'addiction', 
    iconType: 'x_circle' 
  },
  { 
    id: 'lust_control', 
    name: 'Lust Control', 
    type: 'discipline', 
    category: 'self-control', 
    iconType: 'target', 
    genderSpecific: 'Male' 
  }
];

// Icon mapping helper function for components
export const getIconForType = (iconType) => {
  switch (iconType) {
    case 'spiritual': return 'FiHeart';
    case 'sunrise': return 'FiSunrise';
    case 'sun': return 'FiSun';
    case 'sunset': return 'FiSunset';
    case 'moon': return 'FiMoon';
    case 'book': return 'FiBook';
    case 'meditation': return 'FiCircle';
    case 'heart': return 'FiHeart';
    case 'activity': return 'FiActivity';
    case 'x_circle': return 'FiXCircle';
    case 'target': return 'FiTarget';
    default: return 'FiStar';
  }
};
