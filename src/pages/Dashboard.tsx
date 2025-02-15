import React from 'react';
import PresetSongs from '../components/PresetSongs';
import MusicGenerator from '../components/MusicGenerator';
import SongList from '../components/SongList';
import { useErrorStore } from '../store/errorStore';
import { useRealtime } from '../hooks/useRealtime';
import Footer from '../components/Footer';

export default function Dashboard() {
  const error = useErrorStore(state => state.error);
  useRealtime();

  return (
    <main>
      {error && (
        <div className="fixed top-16 left-0 right-0 z-50 p-4 bg-red-500/90 backdrop-blur-sm text-white text-center">
          {error}
        </div>
      )}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-background-dark to-black opacity-50"></div>
        <PresetSongs />
        <MusicGenerator />
        <div className="mt-16 max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Melodies</h2>
          <SongList />
        </div>
      </section>
      <Footer />
    </main>
  );
}