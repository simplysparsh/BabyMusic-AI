import type { ThemeType } from '../../types';

export const THEME_LYRICS: Record<ThemeType, (name: string) => string> = {
  pitchDevelopment: (name) =>
    `Up and down goes ${name}'s voice,\n` +
    `Like a bird making musical choice.\n` +
    `High notes soar and low notes play,\n` +
    `${name}'s singing brightens every day!\n\n` +
    `Do Re Mi, can you see?\n` +
    `${name}'s learning music, one, two, three!\n` +
    `Notes and scales, never fails,\n` +
    `Making music tell sweet tales!`,

  cognitiveSpeech: (name) =>
    `Listen close as ${name} speaks,\n` +
    `Words and sounds like mountain peaks.\n` +
    `Syllables dance, letters play,\n` +
    `${name}'s voice grows stronger every day!\n\n` +
    `Speak and sing, let words ring,\n` +
    `${name}'s voice makes everything swing!\n` +
    `Clear and bright, pure delight,\n` +
    `Learning language day and night!`,

  sleepRegulation: (name) =>
    `Hush now ${name}, drift and dream,\n` +
    `Float away on starlight's beam.\n` +
    `Gentle waves of sleepy sighs,\n` +
    `Carry you through peaceful skies.\n\n` +
    `Rest your head, time for bed,\n` +
    `Dreams are waiting to be read.\n` +
    `Close your eyes, paradise,\n` +
    `Sleep until the sun does rise.`,

  socialEngagement: (name) =>
    `Hello friends, ${name} is here,\n` +
    `Bringing smiles and lots of cheer!\n` +
    `Wave your hands and say hello,\n` +
    `Making friendships as we go!\n\n` +
    `Share and care, show you're there,\n` +
    `${name}'s learning how to be aware!\n` +
    `Kind and true, me and you,\n` +
    `Building bonds both old and new!`,

  indianClassical: (name) =>
    `Sa Re Ga, ${name} sings clear,\n` +
    `Ancient melodies appear.\n` +
    `Ragas flow like gentle streams,\n` +
    `Carrying ${name} through musical dreams!\n\n` +
    `Tabla beats, rhythmic treats,\n` +
    `${name}'s voice with tradition meets!\n` +
    `Pure and true, morning dew,\n` +
    `Classical wisdom shining through!`,

  westernClassical: (name) =>
    `${name} dances with Mozart's grace,\n` +
    `Classical beauty fills this place.\n` +
    `Gentle strings and flutes so sweet,\n` +
    `Make ${name}'s melody complete!\n\n` +
    `Bach and more, music's door,\n` +
    `${name}'s learning what to explore!\n` +
    `Pure and bright, day and night,\n` +
    `Classical dreams take their flight!`,

  custom: (name) =>
    `${name}, ${name}, what do you see?\n` +
    `A world full of wonder, just waiting to be!\n` +
    `${name}, ${name}, what do you hear?\n` +
    `Music and laughter, sweet and clear!\n\n` +
    `Every day brings something new,\n` +
    `${name}'s adventures coming true!\n` +
    `Sing and play, light the way,\n` +
    `Making memories every day!`,
};