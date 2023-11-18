interface AlertData{
  message: string,
  type: 'error' | 'success' | 'warning',
  source: 'ui' | 'server'
  fieldid: string,
};

interface ToastData{
  id?: number,
  message: string,
  run?: {
    feature: () => void,
    message: string,
  },
  type: 'error' | 'success' | 'warning',
  duration?: number,
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
  }

export type {
  InstagramData,
  AlertData,
  ToastData,
}