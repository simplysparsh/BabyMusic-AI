import { MusicMood, ThemeType, PresetType } from '../types';
import { PRESET_CONFIGS } from '../data/lyrics/presets';
import { THEME_CONFIGS } from '../data/lyrics/themes';

export class SongPromptService {
  static getThemeDescription(theme: ThemeType): string {
    const prompts = {
      pitchDevelopment: 'Melodic patterns for pitch recognition training',
      cognitiveSpeech: 'Clear rhythmic patterns for speech development',
      sleepRegulation: 'Gentle lullaby with soothing patterns',
      socialEngagement: 'Interactive melody for social bonding',
      indianClassical: 'Peaceful Indian classical melody with gentle ragas and traditional elements',
      westernClassical: 'Adapted classical melodies for babies',
    };

    if (!theme || !prompts[theme]) {
      throw new Error(`Invalid theme: ${theme}`);
    }

    return prompts[theme];
  }

  static getMoodPrompt(mood: MusicMood): string {
    return `Create a ${mood} children's song that is engaging and age-appropriate`;
  }

  static getThemePrompt(theme: ThemeType): string {
    switch (theme) {
      case 'pitchDevelopment':
        return 'Create a children\'s song focused on pitch recognition and vocal development';
      case 'cognitiveSpeech':
        return 'Create a children\'s song that encourages speech development and cognitive learning';
      case 'sleepRegulation':
        return 'Create a gentle lullaby to help with sleep regulation';
      case 'socialEngagement':
        return 'Create a children\'s song that promotes social interaction and emotional development';
      case 'indianClassical':
        return 'Create a children\'s song incorporating Indian classical music elements';
      case 'westernClassical':
        return 'Create a children\'s song incorporating Western classical music elements';
      default:
        return 'Create an engaging children\'s song';
    }
  }

  static generateTitle(params: {
    theme?: ThemeType;
    mood?: MusicMood;
    babyName: string;
    isInstrumental?: boolean;
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType;
  }): string {
    const { theme, mood, babyName, isInstrumental, songType, presetType } = params;
    const now = new Date();
    const version = Math.floor((now.getTime() % 1000000) / 100000);

    // First, consistently check songType
    switch (songType) {
      case 'preset':
        if (!presetType || !PRESET_CONFIGS[presetType]) {
          throw new Error(`Invalid preset type: ${presetType}`);
        }
        return `${PRESET_CONFIGS[presetType].title(babyName)} (v${version})`;

      case 'theme':
      case 'theme-with-input':
        if (!theme) {
          throw new Error('Theme is required for theme-based songs');
        }
        const themeNames = {
          pitchDevelopment: "Musical Journey",
          cognitiveSpeech: "Speaking Adventure",
          sleepRegulation: "Sleepy Time",
          socialEngagement: "Friendship Song",
          indianClassical: "Indian Melody",
          westernClassical: "Classical Journey"
        };
        return `${babyName}'s ${themeNames[theme]} (v${version})`;

      case 'from-scratch':
        if (!mood) {
          throw new Error('Mood is required for from-scratch songs');
        }
        const moodNames = {
          calm: "Peaceful",
          playful: "Playful",
          learning: "Learning",
          energetic: "Energetic"
        };
        return isInstrumental 
          ? `${babyName}'s ${moodNames[mood]} Melody (v${version})`
          : `${babyName}'s ${moodNames[mood]} Song (v${version})`;

      default:
        // Fallback for any unexpected cases
        return `${babyName}'s Song (v${version})`;
    }
  }

  static getBaseDescription(params: {
    theme?: ThemeType;
    mood?: MusicMood;
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType;
  }): string {
    const { theme, mood, songType, presetType } = params;

    // First, consistently check songType
    switch (songType) {
      case 'preset':
        if (!presetType || !PRESET_CONFIGS[presetType]) {
          throw new Error(`Invalid preset type: ${presetType}`);
        }
        return PRESET_CONFIGS[presetType].description;

      case 'theme':
      case 'theme-with-input':
        if (!theme || !THEME_CONFIGS[theme]) {
          throw new Error(`Invalid theme: ${theme}`);
        }
        return THEME_CONFIGS[theme].description;

      case 'from-scratch':
        if (!mood) {
          throw new Error('Mood is required for from-scratch songs');
        }
        return this.getMoodPrompt(mood);

      default:
        throw new Error('Invalid song configuration');
    }
  }
} 