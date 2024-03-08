type ErrorTypes = 'error' | 'success' | 'warning';
type UserInsightsDuration = "last_1_day" | "last_2_day" | "last_7_days" | "last_14_days" | "last_30_days";
type DurationTypes = "this_week" | "this_month" | "last_30_days" | "last_14_days" | "last_90_days" | "prev_month";

interface AlertData{
  message: string,
  type: ErrorTypes,
  source: 'ui' | 'server'
  fieldid: string,
};

type ToastWithDuration = {
  message: string,
  type: ErrorTypes,
  duration: number,
};

type ToastWithRun = {
  message: string,
  type: ErrorTypes,
  run: {
    feature: () => void,
    message: string,
  },
};

type ToastData = ToastWithDuration | ToastWithRun;

interface InstagramProfile {
  biography: string;
  followers_count: number;
  follows_count: number;
  username: string;
  name: string;
  profile_picture_url: string;
  media_count: number
};

interface InstagramData {
  data: InstagramUser[];
  paging: {
    cursors: {
      after: string;
      before: string;
    },
    previous?: string;
    next?: string;
  };
};
  
interface InstagramUser {
  id: string;
  instagram_business_account?: {
    id: string;
  };
  picture: {
    data: {
      height: number;
      url: string;
      width: number;
    };
  };
  username: string;
};

interface UserInsightsDataTotalValue {
  name: string;
  period: string;
  title: string;
  description: string;
  total_value: {value: number, breakdowns: [{dimension_keys: [], results: [{dimension_values: [], value: number}]}]};
  id: string;
};

interface UserInsightsTotalValue {
  data: UserInsightsDataTotalValue[] | [];
  paging: {
    cursors?: {
      after: string;
      before: string;
    },
    previous?: string;
    next?: string;
  }; 
};

export type {
  InstagramData,
  InstagramProfile,
  UserInsightsTotalValue,
  UserInsightsDuration,
  DurationTypes,
  AlertData,
  ToastData,
};