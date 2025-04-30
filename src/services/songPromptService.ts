import { MusicMood, ThemeType, PresetType, VoiceType } from '../types';
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

  static generateTitle(params: {
    theme?: ThemeType;
    mood?: MusicMood;
    babyName: string;
    isInstrumental?: boolean;
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType;
  }): string {
    const { theme, mood, babyName, isInstrumental: _isInstrumental, songType, presetType } = params;
    const version = Math.floor(Math.random() * 10) + 1;
    
    // Define theme and mood names outside case blocks
    const themeNames = {
      pitchDevelopment: "Musical Journey",
      cognitiveSpeech: "Speaking Adventure",
      sleepRegulation: "Sleepy Time",
      socialEngagement: "Friendship Song",
      indianClassical: "Indian Melody",
      westernClassical: "Classical Journey"
    };
    
    const moodNames = {
      calm: "Peaceful",
      playful: "Playful",
      learning: "Learning",
      energetic: "Energetic"
    };
    
    switch (songType) {
      case 'preset':
        if (!presetType) {
          throw new Error('Preset type is required for preset songs');
        }
        return `${babyName}'s ${PRESET_CONFIGS[presetType].title(babyName)} (v${version})`;

      case 'theme':
      case 'theme-with-input':
        if (!theme) {
          throw new Error('Theme is required for theme-based songs');
        }
        return `${babyName}'s ${themeNames[theme]} (v${version})`;

      case 'from-scratch':
        if (!mood) {
          throw new Error('Mood is required for from-scratch songs');
        }
        return `${babyName}'s ${moodNames[mood]} Adventure (v${version})`;

      default:
        return `${babyName}'s Special Song (v${version})`;
    }
  }

  static getBaseDescription(params: {
    theme?: ThemeType;
    mood?: MusicMood;
    songType: 'preset' | 'theme' | 'theme-with-input' | 'from-scratch';
    presetType?: PresetType;
    voice?: VoiceType;
    isInstrumental?: boolean;
  }): string {
    const { theme, mood, songType, presetType, voice, isInstrumental } = params;

    // First, consistently check songType
    let baseDescription = '';
    switch (songType) {
      case 'preset':
        if (!presetType || !PRESET_CONFIGS[presetType]) {
          throw new Error(`Invalid preset type: ${presetType}`);
        }
        baseDescription = PRESET_CONFIGS[presetType].description;
        break;

      case 'theme':
      case 'theme-with-input':
        if (!theme || !THEME_CONFIGS[theme]) {
          throw new Error(`Invalid theme: ${theme}`);
        }
        baseDescription = THEME_CONFIGS[theme].description;
        break;

      case 'from-scratch':
        if (!mood) {
          throw new Error('Mood is required for from-scratch songs');
        }
        baseDescription = this.getMoodPrompt(mood);
        break;

      default:
        throw new Error('Invalid song configuration');
    }

    // Append voice tag if not instrumental
    const finalVoice = !isInstrumental ? (voice || 'softFemale') : undefined;
    if (finalVoice) {
      baseDescription += ` In the song, use the voice: ${finalVoice}`;
    }

    return baseDescription;
  }
} 