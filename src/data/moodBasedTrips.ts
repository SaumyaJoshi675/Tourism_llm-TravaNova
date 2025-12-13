export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
}

export interface MoodDestination {
  name: string;
  reason: string;
  highlights: string[];
  image: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
}

export const moods: Mood[] = [
  {
    id: 'calm',
    name: 'Calm & Peaceful',
    emoji: '🧘',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-400',
    description: 'Seeking tranquility and inner peace',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    emoji: '🏔️',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-red-500',
    description: 'Craving adrenaline and thrills',
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    emoji: '🕉️',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Looking for divine connection',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💑',
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-500',
    description: 'Perfect for couples',
  },
  {
    id: 'family',
    name: 'Family-Friendly',
    emoji: '👨‍👩‍👧‍👦',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Fun for all ages',
  },
  {
    id: 'budget',
    name: 'Budget Traveler',
    emoji: '💰',
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-amber-500',
    description: 'Maximum experience, minimum cost',
  },
  {
    id: 'luxury',
    name: 'Luxury Escape',
    emoji: '✨',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-purple-600',
    description: 'Premium comfort and exclusivity',
  },
];

export const moodBasedDestinations: Record<string, MoodDestination[]> = {
  calm: [
    {
      name: 'Rishikesh',
      reason: 'Yoga capital with serene Ganga riverside ashrams',
      highlights: ['Yoga retreats', 'Meditation', 'Peaceful ghats', 'Sound healing'],
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
      duration: '3-5 days',
      difficulty: 'Easy',
    },
    {
      name: 'Kausani',
      reason: 'Peaceful hill station with panoramic Himalayan views',
      highlights: ['Tea gardens', 'Sunrise views', 'Anasakti Ashram', 'Nature walks'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      duration: '2-3 days',
      difficulty: 'Easy',
    },
    {
      name: 'Binsar',
      reason: 'Quiet wildlife sanctuary surrounded by oak forests',
      highlights: ['Bird watching', 'Forest walks', 'Zero Point view', 'Solitude'],
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
      duration: '2-4 days',
      difficulty: 'Easy',
    },
  ],
  adventure: [
    {
      name: 'Auli',
      reason: 'Premier skiing destination with thrilling slopes',
      highlights: ['Skiing', 'Cable car', 'Snowboarding', 'Mountain views'],
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600',
      duration: '3-4 days',
      difficulty: 'Moderate',
    },
    {
      name: 'Rishikesh',
      reason: 'Adventure sports capital of Uttarakhand',
      highlights: ['River rafting', 'Bungee jumping', 'Flying fox', 'Cliff jumping'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
      duration: '2-3 days',
      difficulty: 'Moderate',
    },
    {
      name: 'Valley of Flowers',
      reason: 'Challenging trek through stunning alpine meadows',
      highlights: ['High-altitude trek', 'Rare flora', 'Hemkund Sahib', 'Camping'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      duration: '5-7 days',
      difficulty: 'Challenging',
    },
    {
      name: 'Chopta-Tungnath',
      reason: 'Trek to world\'s highest Shiva temple',
      highlights: ['Trekking', 'Chandrashila summit', 'Snow trek', 'Bird watching'],
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
      duration: '3-4 days',
      difficulty: 'Moderate',
    },
  ],
  spiritual: [
    {
      name: 'Badrinath',
      reason: 'Sacred Char Dham pilgrimage site',
      highlights: ['Temple darshan', 'Tapt Kund', 'Brahma Kapal', 'Mana village'],
      image: 'https://images.unsplash.com/photo-1621599784415-f4f55ff0dc00?w=600',
      duration: '4-6 days',
      difficulty: 'Moderate',
    },
    {
      name: 'Kedarnath',
      reason: 'Holiest Shiva temple in the Himalayas',
      highlights: ['Temple trek', 'Spiritual awakening', 'Mountain meditation', 'Puja rituals'],
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600',
      duration: '4-5 days',
      difficulty: 'Challenging',
    },
    {
      name: 'Haridwar',
      reason: 'Gateway to the gods with daily Ganga Aarti',
      highlights: ['Ganga Aarti', 'Holy dip', 'Temple visits', 'Spiritual ceremonies'],
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600',
      duration: '2-3 days',
      difficulty: 'Easy',
    },
  ],
  romantic: [
    {
      name: 'Nainital',
      reason: 'Picturesque lake town perfect for couples',
      highlights: ['Lake boating', 'Mall Road walks', 'Sunset views', 'Cozy cafes'],
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600',
      duration: '3-4 days',
      difficulty: 'Easy',
    },
    {
      name: 'Mussoorie',
      reason: 'Queen of Hills with colonial charm',
      highlights: ['Cable car ride', 'Couple walks', 'Candlelight dinners', 'Mall Road'],
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
      duration: '3-4 days',
      difficulty: 'Easy',
    },
    {
      name: 'Bhimtal',
      reason: 'Tranquil lake destination away from crowds',
      highlights: ['Private boat rides', 'Lakeside resorts', 'Island visit', 'Nature trails'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      duration: '2-3 days',
      difficulty: 'Easy',
    },
  ],
  family: [
    {
      name: 'Jim Corbett National Park',
      reason: 'Wildlife safari adventure for all ages',
      highlights: ['Jungle safari', 'Wildlife spotting', 'Nature walks', 'Bird watching'],
      image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600',
      duration: '2-3 days',
      difficulty: 'Easy',
    },
    {
      name: 'Mussoorie',
      reason: 'Safe hill station with family activities',
      highlights: ['Gun Hill', 'Kempty Falls', 'Adventure park', 'Shopping'],
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
      duration: '3-4 days',
      difficulty: 'Easy',
    },
    {
      name: 'Nainital',
      reason: 'Kid-friendly with boating and zoo',
      highlights: ['Boating', 'Zoo visit', 'Ropeway', 'Snow View Point'],
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600',
      duration: '3-4 days',
      difficulty: 'Easy',
    },
  ],
  budget: [
    {
      name: 'Haridwar',
      reason: 'Affordable spiritual destination with free ghats',
      highlights: ['Free Ganga Aarti', 'Budget stays', 'Temple visits', 'Local food'],
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600',
      duration: '2-3 days',
      difficulty: 'Easy',
    },
    {
      name: 'Rishikesh',
      reason: 'Backpacker paradise with ashram stays',
      highlights: ['Ashram accommodation', 'Free yoga', 'Beach camping', 'Budget cafes'],
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
      duration: '3-5 days',
      difficulty: 'Easy',
    },
    {
      name: 'Chopta',
      reason: 'Budget trekking with camping options',
      highlights: ['Camping', 'Budget stays', 'Self-guided treks', 'Natural beauty'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      duration: '2-3 days',
      difficulty: 'Moderate',
    },
  ],
  luxury: [
    {
      name: 'Ananda in the Himalayas (Rishikesh)',
      reason: 'World-class luxury wellness resort',
      highlights: ['Spa treatments', 'Gourmet dining', 'Private yoga', 'Palatial rooms'],
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
      duration: '5-7 days',
      difficulty: 'Easy',
    },
    {
      name: 'Auli (Premium Resorts)',
      reason: 'Luxury skiing with five-star amenities',
      highlights: ['Premium ski resort', 'Spa', 'Fine dining', 'Helicopter access'],
      image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=600',
      duration: '4-6 days',
      difficulty: 'Moderate',
    },
    {
      name: 'Nainital (Lake View Luxury)',
      reason: 'Boutique heritage hotels with lake views',
      highlights: ['Heritage properties', 'Private boats', 'Butler service', 'Gourmet meals'],
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600',
      duration: '3-5 days',
      difficulty: 'Easy',
    },
  ],
};
