export interface HeroState {
    id: string;
    name: string;
    tagline: string;
    description: string;
    image: string;
    location: string;
}

export const heroStates: HeroState[] = [
    {
        id: 'uk',
        name: 'Uttarakhand',
        // Keeping the original tagline structure from Home.tsx if possible, or using it as a dynamic part
        tagline: 'Land of Gods', // This might not be strictly used if we keep the gradients, but good for data completeness
        description: 'Your intelligent AI companion for exploring the breathtaking landscapes, spiritual sites, and adventure destinations of Uttarakhand',
        // Uttarakhand mountains/temple vibe
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        location: 'North India'
    },
    {
        id: 'kl',
        name: 'Kerala',
        tagline: "God's Own Country",
        description: 'Experience the serene backwaters, lush tea plantations, and pristine beaches of the tropical south.',
        // Kerala backwaters
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070',
        location: 'South India'
    },
    {
        id: 'rj',
        name: 'Rajasthan',
        tagline: 'Land of Kings',
        description: 'Immerse yourself in the royal heritage, majestic forts, and vibrant culture of the desert state.',
        // Rajasthan fort/desert
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070',
        location: 'West India'
    },
    {
        id: 'hp',
        name: 'Himachal',
        tagline: 'Land of Gods (Dev Bhoomi)',
        description: 'Discover the snow-capped peaks, flowing rivers, and peaceful monasteries of Himachal Pradesh.',
        // Himachal mountains
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070',
        location: 'North India'
    },
    {
        id: 'goa',
        name: 'Goa',
        tagline: 'Pearl of the Orient',
        description: 'Relax on sun-kissed beaches, explore Portuguese architecture, and enjoy the vibrant coastal life.',
        // Goa beach
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2070',
        location: 'West India'
    },
    {
        id: 'as',
        name: 'Assam',
        tagline: 'Awesome Assam',
        description: 'Explore the tea gardens, wildlife sanctuaries, and the mighty Brahmaputra river in North East India.',
        // Assam tea garden/rhino
        image: 'https://images.pexels.com/photos/319879/pexels-photo-319879.jpeg',
        location: 'North East India'
    }
];
