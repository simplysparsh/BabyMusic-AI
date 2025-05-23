/**
 * Utility functions for generating meaningful streak messages that emphasize
 * the benefits of daily music for babies' development
 */

export interface StreakMessage {
  desktop: string;
  mobile: string;
  detailed: string;
}

/**
 * Gets motivational streak messages based on the current streak count
 * Messages emphasize developmental benefits for babies
 */
export function getStreakMessage(streakDays: number): StreakMessage {
  // Different messages based on streak milestones to keep it fresh
  if (streakDays === 0) {
    return {
      desktop: "Start building musical memories",
      mobile: "Start today",
      detailed: "Begin your baby's musical journey today"
    };
  }
  
  if (streakDays === 1) {
    return {
      desktop: "Daily music builds rhythm & routine",
      mobile: "Keep going daily",
      detailed: "Daily music helps establish healthy routines for your baby"
    };
  }
  
  if (streakDays <= 3) {
    return {
      desktop: "Every day adds to musical memory",
      mobile: "Visit daily",
      detailed: "Each day of music strengthens your baby's neural pathways"
    };
  }
  
  if (streakDays <= 7) {
    return {
      desktop: "Developing baby's listening skills",
      mobile: "Don't break now",
      detailed: "Consistent music exposure enhances your baby's auditory development"
    };
  }
  
  if (streakDays <= 14) {
    return {
      desktop: "Nurturing emotional connection",
      mobile: "Keep the streak",
      detailed: "Daily musical moments strengthen your emotional bond with baby"
    };
  }
  
  if (streakDays <= 21) {
    return {
      desktop: "Building cognitive foundations",
      mobile: "21 days strong",
      detailed: "Three weeks of music is building strong cognitive foundations"
    };
  }
  
  if (streakDays <= 30) {
    return {
      desktop: "Creating lasting musical habits",
      mobile: "Almost 30!",
      detailed: "You're establishing musical traditions that will last a lifetime"
    };
  }
  
  // For longer streaks
  return {
    desktop: "Fostering lifelong love of music",
    mobile: "Amazing streak!",
    detailed: "Your dedication is nurturing a deep, lifelong appreciation for music"
  };
}

/**
 * Alternative messages for variety - can be used randomly or in rotation
 */
export const alternativeMessages: StreakMessage[] = [
  {
    desktop: "Each day strengthens baby's brain",
    mobile: "Play daily",
    detailed: "Daily music sessions are actively building your baby's neural connections"
  },
  {
    desktop: "Music shapes emotional development", 
    mobile: "Keep it up",
    detailed: "Regular musical exposure helps develop your baby's emotional intelligence"
  },
  {
    desktop: "Creating precious bonding moments",
    mobile: "Visit today", 
    detailed: "These daily music sessions create irreplaceable bonding experiences"
  },
  {
    desktop: "Developing future musicality",
    mobile: "Stay consistent",
    detailed: "You're laying the groundwork for your baby's musical abilities"
  }
]; 