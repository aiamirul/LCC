
import type { ExpensePreset, OtherCostPreset } from './types';
import {
  ApartmentIcon, BicycleIcon, BudgetIcon, CampingIcon, CarSedanIcon, CarSuvIcon,
  CarSupercarIcon, ClubbingIcon, FineDiningIcon, GlobetrottingIcon, GourmetIcon,
  HobbiesIcon, HomelessIcon, HouseIcon, MansionIcon, MoviesIcon, NoEatingIcon,
  NoFunIcon, PublicTransportIcon, RamenIcon, ResortIcon, RoadTripIcon, RoomIcon,
  ShedIcon, StandardIcon, StaycationIcon, StayHomeIcon, StudioIcon,
  StudentLoanIcon, GymIcon, SubscriptionsIcon, PetCareIcon, ChildcareIcon,
  PersonalCareIcon, CharityIcon
} from './components/Icons';

export const housingPresets: ExpensePreset[] = [
  { id: 'mansion', label: 'Mansion', cost: 25000, icon: MansionIcon },
  { id: 'house', label: 'Suburban House', cost: 3500, icon: HouseIcon },
  { id: 'apartment', label: 'Downtown Apartment', cost: 2500, icon: ApartmentIcon },
  { id: 'studio', label: 'Studio Apartment', cost: 1600, icon: StudioIcon },
  { id: 'room', label: 'Renting a Room', cost: 900, icon: RoomIcon },
  { id: 'shed', label: 'Garden Shed', cost: 150, icon: ShedIcon },
  { id: 'homeless', label: 'Living with Parents', cost: 0, icon: HomelessIcon },
];

export const groceriesPresets: ExpensePreset[] = [
  { id: 'gourmet', label: 'Gourmet / Organic', cost: 1200, icon: GourmetIcon },
  { id: 'standard', label: 'Standard Diet', cost: 600, icon: StandardIcon },
  { id: 'budget', label: 'Budget Eating', cost: 350, icon: BudgetIcon },
  { id: 'ramen', label: 'Instant Noodle Diet', cost: 100, icon: RamenIcon },
  { id: 'no-eating', label: 'Fasting / No Eating', cost: 0, icon: NoEatingIcon },
];

export const carPresets: ExpensePreset[] = [
    { id: 'supercar', label: 'Supercar', cost: 3500, icon: CarSupercarIcon },
    { id: 'suv', label: 'Luxury SUV', cost: 1200, icon: CarSuvIcon },
    { id: 'sedan', label: 'Reliable Sedan', cost: 550, icon: CarSedanIcon },
    { id: 'public-transport', label: 'Public Transport', cost: 100, icon: PublicTransportIcon },
    { id: 'bicycle', label: 'Bicycle', cost: 20, icon: BicycleIcon },
];

export const leisurePresets: ExpensePreset[] = [
    { id: 'fine-dining', label: 'Fine Dining & Clubs', cost: 1500, icon: FineDiningIcon },
    { id: 'clubbing', label: 'Going Out / Bars', cost: 600, icon: ClubbingIcon },
    { id: 'movies', label: 'Movies & Takeout', cost: 300, icon: MoviesIcon },
    { id: 'hobbies', label: 'Hobbies', cost: 150, icon: HobbiesIcon },
    { id: 'stay-home', label: 'Netflix & Chill', cost: 50, icon: StayHomeIcon },
    { id: 'no-fun', label: 'No Fun Allowed', cost: 0, icon: NoFunIcon },
];

export const travelPresets: ExpensePreset[] = [
    { id: 'globetrotting', label: 'Luxury Globe-trotting', cost: 25000, icon: GlobetrottingIcon },
    { id: 'resort', label: 'All-inclusive Resort', cost: 8000, icon: ResortIcon },
    { id: 'road-trip', label: 'Several Road Trips', cost: 4000, icon: RoadTripIcon },
    { id: 'camping', label: 'Weekend Camping', cost: 1500, icon: CampingIcon },
    { id: 'staycation', label: 'Staycation', cost: 500, icon: StaycationIcon },
];

export const otherCostPresets: OtherCostPreset[] = [
  { id: 'other-student-loans', label: 'Student Loans', cost: 450, icon: StudentLoanIcon },
  { id: 'other-gym', label: 'Gym Membership', cost: 50, icon: GymIcon },
  { id: 'other-subscriptions', label: 'Subscriptions (Streaming, etc.)', cost: 40, icon: SubscriptionsIcon },
  { id: 'other-pet-care', label: 'Pet Care / Insurance', cost: 100, icon: PetCareIcon },
  { id: 'other-childcare', label: 'Childcare', cost: 1200, icon: ChildcareIcon },
  { id: 'other-personal-care', label: 'Personal Care (Haircuts, etc.)', cost: 75, icon: PersonalCareIcon },
  { id: 'other-charity', label: 'Charity Donations', cost: 100, icon: CharityIcon },
];


export const comments = {
    sideHustle: {
        title: "The side hustle is strong.",
        message: "You've managed to get paid for your lifestyle. Are you an influencer, or did you just monetize breathing?",
        colorClass: 'bg-sky-100 border-sky-500 text-sky-700'
    },
    bezosBozo: {
        title: "Living like Bezos, earning like a bozo.",
        message: "Your spending habits are writing checks your income can't cash. Time to swap champagne wishes for tap water dreams.",
        colorClass: 'bg-red-100 border-red-500 text-red-700'
    },
    minimalist: {
        title: "Ah, the 'air and pavement' diet.",
        message: "It's a bold minimalist strategy. Very chic, very... hungry. Is this voluntary?",
        colorClass: 'bg-amber-100 border-amber-500 text-amber-700'
    },
    hiring: {
        title: "Are you hiring?",
        message: "Your budget has more room than a mansion. Seriously, asking for a friend... who is me.",
        colorClass: 'bg-green-100 border-green-500 text-green-700'
    },
    tightrope: {
        title: "Walking the financial tightrope.",
        message: "You're balancing perfectly, for now. One gust of wind (or an unexpected bill) and it's a long way down.",
        colorClass: 'bg-yellow-100 border-yellow-500 text-yellow-700'
    },
    crying: {
        title: "Your bank account is crying.",
        message: "And honestly, so am I. This isn't a budget, it's a cry for help written in red ink.",
        colorClass: 'bg-red-100 border-red-500 text-red-700'
    },
    thoughtsAndPrayers: {
        title: "The 'Thoughts & Prayers' budget plan.",
        message: "Hoping for the best is not a financial strategy. Unless you're planning to win the lottery, this won't end well.",
        colorClass: 'bg-red-100 border-red-500 text-red-700'
    },
    sustainable: {
        title: "Solidly Sustainable!",
        message: "Look at you, being all responsible. Your future selves are already thanking you. Don't get too crazy, now.",
        colorClass: 'bg-green-100 border-green-500 text-green-700'
    }
} as const;