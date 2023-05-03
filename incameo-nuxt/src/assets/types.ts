interface AlertData{
  message: string,
  type: 'error' | 'success'| 'warning' | 'info',
  source: 'ui' | 'server'
  fieldid: string,
};

interface ToastData {
  id?: number,
  message: string,
  run?: {
    feature: () => void,
    message: string,
  },
  type: 'error' | 'success'| 'warning' | 'info',
  duration?: number,
};

export {
  AlertData,
  ToastData
};