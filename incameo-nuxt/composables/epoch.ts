import type {UserInsightsDuration, DurationTypes} from "@/assets/ts/types";

export const epochSinchUntil = (timerangeStr: UserInsightsDuration | DurationTypes) => {
    let since: number;
    let until: number = Math.floor(Date.now() / 1000);
    switch (timerangeStr) {
      case "last_1_day":
        since = calculateSinceForLast1Day();
          break;
      case "last_2_day": 
        since = calculateSinceForLast2Days();
          break;
      case "last_7_days": 
        since = calculateSinceForLast7Days();
          break;
      case 'this_week':
        since = calculateSinceForThisWeek();
          break;
      case 'this_month':
        since = calculateSinceForThisMonth();
          break;
      case 'last_30_days':
        since = calculateSinceForLast30Days();
          break;
      case 'last_14_days':
        since = calculateSinceForLast14Days();
          break;
      case 'last_90_days':
        since = calculateSinceForLast90Days();
          break;
      case 'prev_month':
        since = calculateSinceForPreviousMonth();
          break;
      default:
        throw new Error('Invalid timerangeStr');
    }
    return { since, until };
  };
  
    function calculateSinceForLast1Day(): number {
      const today = new Date();
      const last1Day = new Date(today.setDate(today.getDate() - 1));
      return Math.floor(last1Day.getTime() / 1000); // Convert to seconds and return the epoch
    }
    function calculateSinceForLast2Days(): number {
      const today = new Date();
      const last2Day = new Date(today.setDate(today.getDate() - 2));
      return Math.floor(last2Day.getTime() / 1000); // Convert to seconds and return the epoch
    }
    function calculateSinceForLast7Days(): number {
      const today = new Date();
      const last7Day = new Date(today.setDate(today.getDate() - 7));
      return Math.floor(last7Day.getTime() / 1000); // Convert to seconds and return the epoch
    }
  
    function calculateSinceForThisWeek(): number {
      const today = new Date();
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Get first day of the current week
      return Math.floor(firstDayOfWeek.getTime() / 1000); // Convert to seconds and return the epoch
    }
    function calculateSinceForThisMonth(): number {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return Math.floor(firstDayOfMonth.getTime() / 1000); // Convert to seconds and return the epoch
    }
    function calculateSinceForLast30Days(): number {
      const today = new Date();
      const last30Days = new Date(today.setDate(today.getDate() - 30));
      return Math.floor(last30Days.getTime() / 1000); // Convert to seconds and return the epoch
    }
    function calculateSinceForLast14Days(): number {
      const today = new Date();
      const last14Days = new Date(today.setDate(today.getDate() - 14));
      return Math.floor(last14Days.getTime() / 1000); // Convert to seconds and return the epoch
    }
    function calculateSinceForLast90Days(): number {
      const today = new Date();
      const last90Days = new Date(today.setDate(today.getDate() - 90));
      return Math.floor(last90Days.getTime() / 1000); // Convert to seconds and return the epoch
    }
    function calculateSinceForPreviousMonth(): number {
      const today = new Date();
      const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth.setDate(firstDayOfCurrentMonth.getDate() - 1));
      const firstDayOfPreviousMonth = new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), 1);
      return Math.floor(firstDayOfPreviousMonth.getTime() / 1000); // Convert to seconds and return the epoch
    }
  