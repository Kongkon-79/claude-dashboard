export interface PricingAndPaymentApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: Payment[];
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
}


export interface Payment {
  _id: string;
  team: string | null;
  user: User;
  subscription: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  paymentType: "Individual" | "Team";
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  provider: string;
  profileImage: string;
  verified: boolean;
  position: string[];
  socialMedia: unknown[];
  playingVideo: string[];
  isSubscription: boolean;
  subscription: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  birthdayPlace: string;
  category: string;
  citizenship: string;
  currentClub: string;
  dob: string;
  foot: "left" | "right" | "both";
  gender: "male" | "female" | "other";
  gpa: string;
  hight: string;
  inSchoolOrCollege: boolean;
  institute: string;
  league: string;
  weight: string;
  jerseyNumber: string;
  teamName: string;
  subscriptionExpiry: string;
  __v: number;
}



