type ErrorTypes = 'error' | 'success' | 'warning';
type UserInsightsDuration = "last_1_day" | "last_2_day" | "last_7_days" | "last_14_days" | "last_30_days";
type DurationTypes = "this_week" | "this_month" | "last_30_days" | "last_14_days" | "last_90_days" | "prev_month";

interface AlertData{
  message: string;
  type: ErrorTypes;
  source: 'ui' | 'server';
  fieldid: string;
};

interface ToastData {
  id?: number;
  message: string;
  type: ErrorTypes;
  duration?: number;
  run?: {
    feature: () => void;
    message: string;
  }
};

interface Paging {
  paging: {
    cursors: {
      after: string;
      before: string;
    },
    previous?: string;
    next?: string;
  };
};

interface InstagramProfile {
  biography: string;
  followers_count: number;
  follows_count: number;
  username: string;
  name: string;
  profile_picture_url: string;
  media_count: number;
  media?: {
    data: {comments_count: number, like_count: number, id: string}[];
    paging: Paging;
  }
  id: number;
  ig_id: string;
};

interface InstagramData {
  data: InstagramUser[];
  paging: Paging;
};

interface InstagramDiscovery {
  business_discovery: InstagramProfile;
  id: string;
}
  
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

type BreakDown = {
  dimension_keys?: [], 
  results?: [{dimension_values?: string[], value?: number}]
}

interface UserInsightsDataTotalValue {
  name: string;
  period: string;
  title: string;
  description: string;
  total_value: {value?: number, breakdowns?: BreakDown[]};
  id: string;
};

interface UserInsightsDataTimeSeries {
  name: string;
  period: string;
  title: string;
  description: string;
  values: [{value: number, end_time: string}];
  id: string;
};

interface UserInsightsTotalValue extends Paging {
  data: UserInsightsDataTotalValue[] | [];
};

interface UserInsightsTimeSeries extends Paging {
  data: UserInsightsDataTimeSeries[] | [];
};

interface ModifiedUserInsightsTotalValue {
  data:  UserInsightsDataTotalValue[];
  paging: {
    next: string[];
    previous: string[];
  }
};

interface ResponseUserInsightsTimeSeries {
  status: string;
  insights: UserInsightsTimeSeries
};

interface ResponseModifiedUserInsightsTotalValue {
  status: string;
  insights: ModifiedUserInsightsTotalValue;
};

export type {
  InstagramData,
  InstagramProfile,
  UserInsightsTotalValue,
  UserInsightsDuration,
  DurationTypes,
  AlertData,
  ToastData,
  ModifiedUserInsightsTotalValue,
  UserInsightsTimeSeries,
  InstagramDiscovery,
  ResponseUserInsightsTimeSeries,
  ResponseModifiedUserInsightsTotalValue,
};