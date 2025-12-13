export interface TravelInsight {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export const getCurrentTravelInsights = (): TravelInsight[] => {
  const currentMonth = new Date().getMonth();
  const currentSeason = currentMonth >= 2 && currentMonth <= 5 
    ? 'summer' 
    : currentMonth >= 9 && currentMonth <= 11 
    ? 'autumn' 
    : currentMonth >= 0 && currentMonth <= 1 
    ? 'winter' 
    : 'spring';

  return [
    {
      id: '1',
      title: 'Best Time to Visit',
      value: currentSeason === 'summer' ? 'Excellent' : currentSeason === 'winter' ? 'Peak Season' : 'Good',
      description: currentSeason === 'summer' 
        ? 'Perfect weather for hill stations and trekking'
        : currentSeason === 'winter'
        ? 'Ideal for skiing in Auli and snow activities'
        : 'Great for pilgrimage and moderate climate',
      icon: 'sun',
      color: 'from-amber-500 to-orange-500',
      trend: currentSeason === 'summer' || currentSeason === 'winter' ? 'up' : 'stable',
    },
    {
      id: '2',
      title: 'Weather Forecast',
      value: currentSeason === 'summer' ? '15-25°C' : currentSeason === 'winter' ? '0-10°C' : '10-20°C',
      description: currentSeason === 'summer'
        ? 'Pleasant and cool in hill areas'
        : currentSeason === 'winter'
        ? 'Cold with snowfall in higher regions'
        : 'Mild temperatures, comfortable for travel',
      icon: 'cloud',
      color: 'from-blue-500 to-cyan-500',
      trend: 'stable',
    },
    {
      id: '3',
      title: 'Crowd Level',
      value: currentSeason === 'summer' || currentSeason === 'winter' ? 'High' : 'Moderate',
      description: currentSeason === 'summer' || currentSeason === 'winter'
        ? 'Peak tourist season - book early'
        : 'Fewer crowds, better deals available',
      icon: 'users',
      color: 'from-purple-500 to-pink-500',
      trend: currentSeason === 'summer' || currentSeason === 'winter' ? 'up' : 'down',
    },
    {
      id: '4',
      title: 'Upcoming Festival',
      value: currentMonth >= 2 && currentMonth <= 3 
        ? 'Holi & Maha Shivaratri' 
        : currentMonth >= 9 && currentMonth <= 10
        ? 'Diwali & Nanda Devi Raj Jat'
        : currentMonth === 11 || currentMonth === 0
        ? 'Winter Carnival'
        : 'International Yoga Festival',
      description: currentMonth >= 2 && currentMonth <= 3
        ? 'Celebrate colors at Rishikesh & temples'
        : currentMonth >= 9 && currentMonth <= 10
        ? 'Festival of lights and cultural celebrations'
        : currentMonth === 11 || currentMonth === 0
        ? 'Snow sports and cultural events in Mussoorie'
        : 'Join yoga sessions in Rishikesh (March)',
      icon: 'calendar',
      color: 'from-emerald-500 to-teal-500',
      trend: 'up',
    },
    {
      id: '5',
      title: 'Safety Rating',
      value: '9.2/10',
      description: 'High safety standards with tourist police and emergency services available',
      icon: 'shield',
      color: 'from-green-500 to-emerald-500',
      trend: 'stable',
    },
    {
      id: '6',
      title: 'Budget Estimate',
      value: '₹8K - ₹15K',
      description: 'Average cost for 3-day trip per person including accommodation and meals',
      icon: 'wallet',
      color: 'from-indigo-500 to-purple-500',
      trend: 'stable',
    },
  ];
};

export const travelTips = [
  'Book accommodations at least 2 weeks in advance during peak season',
  'Carry valid ID proof for hotels and permits',
  'Keep emergency numbers handy: Tourist Police - 1363',
  'Respect local customs at religious sites',
  'Acclimatize properly when visiting high-altitude areas',
  'Always carry warm clothing, even in summer',
  'Drink bottled water and eat at hygienic places',
  'Inform someone about your travel plans',
];
