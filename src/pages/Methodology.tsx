import React from 'react';
import { Brain, ArrowLeft, ArrowRight, Zap, Music2, Heart, Star, Sparkles, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';

export default function Methodology() {
  return (
    <div className="min-h-screen bg-gradient-radial from-background-dark via-background-dark to-black pt-20 pb-32">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-[0.07]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8
                   transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </a>

        {/* Parent-Friendly Summary Section */}
        <div className="card p-8 mb-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10
                      border-white/10 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-white/40">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            The Science Made Simple
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: Zap,
                title: "Enhanced Brain Development",
                description: "Music strengthens neural connections, improving your baby's learning abilities"
              },
              {
                icon: Heart,
                title: "Emotional Well-being",
                description: "Scientifically crafted melodies reduce stress and promote emotional security"
              }
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 p-4 bg-white/5 rounded-xl">
                <Icon className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/70">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
              className="btn-primary text-sm px-6 py-3 flex items-center gap-2"
            >
              Try It Free
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <a href="#detailed-research" className="flex items-center gap-2 text-white/60 hover:text-white
                                                transition-colors duration-300">
              <BookOpen className="w-4 h-4" />
              <span>Detailed Research</span>
            </a>
          </div>
        </div>

        <div id="detailed-research" className="prose prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Our Methodology
          </h1>

          <h2 className="text-xl font-semibold mb-4">1. Overview</h2>
          <p className="text-white/80 mb-8">
            Early auditory experiences play a critical role in cognitive, linguistic, and emotional development. Research indicates that structured musical exposure enhances neural plasticity, speech processing, emotional regulation, and attention span in infants. Our approach integrates scientifically validated principles from auditory neuroscience, cognitive psychology, and ethnomusicology to create music that aligns with the developmental needs of infants.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Cognitive and Neural Foundations</h2>
          <h3 className="text-lg font-medium mb-3">2.1 Music and Neuroplasticity in Infants</h3>
          <p className="text-white/80 mb-4">
            Infants are born with a high degree of neuroplasticity, meaning their brains adapt rapidly to sensory inputs. Research from the University of Washington (2016) suggests that exposure to rhythmic auditory patterns enhances the infant brain's ability to process speech, recognize patterns, and predict auditory sequences.
          </p>
          <p className="text-white/80 mb-4">Key Findings:</p>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>Structured musical exposure improves synaptic efficiency in auditory and prefrontal cortices.</li>
            <li>Early rhythm training correlates with stronger phonological awareness, a precursor to language acquisition.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">2.2 Absolute Pitch and Early Auditory Encoding</h3>
          <p className="text-white/80 mb-4">
            Studies by Diana Deutsch (2013) and NCBI (2016) confirm that infants exposed to distinct pitch-based melodies exhibit a higher likelihood of developing absolute pitch perception. Absolute pitch contributes to:
          </p>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>Enhanced memory recall and musical ability.</li>
            <li>Greater speech intonation sensitivity, aiding multilingual acquisition.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">3. Emotional and Behavioral Impact of Music</h2>
          <h3 className="text-lg font-medium mb-3">3.1 Music for Emotional Regulation</h3>
          <p className="text-white/80 mb-4">
            Infants respond physiologically and behaviorally to different types of sound. Research from the National Center for Biotechnology Information (NCBI, 2019) indicates that:
          </p>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>Lullabies with slow, repetitive melodies reduce cortisol (stress hormone) levels in infants.</li>
            <li>Rhythmic, predictable patterns activate the limbic system, enhancing emotional security.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">4. Cultural and Musical Framework</h2>
          <h3 className="text-lg font-medium mb-3">4.1 The Role of Indian Classical Music in Cognitive Development</h3>
          <p className="text-white/80 mb-4">
            Indian classical music, particularly raga-based melodies, follows a structured system of pitch and microtonal variations. Neuroscientific studies on raga music suggest:
          </p>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>Raga Yaman and Raga Mohanam enhance focus and emotional depth.</li>
            <li>Carnatic rhythmic cycles (Tala systems) improve predictive timing and attention span.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">4.2 Western Classical Music and Structured Learning</h3>
          <p className="text-white/80 mb-4">
            Research on Mozart Effect and Beethoven's structured compositions highlights:
          </p>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>Harmonic progressions aid spatial-temporal reasoning.</li>
            <li>Baroque compositions (Bach, Vivaldi) enhance logical pattern recognition.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">5. Methodology in Music Composition</h2>
          <p className="text-white/80 mb-4">Our musical design follows a four-step scientific process:</p>

          {/* Visual Process Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Music2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Sound Selection</h3>
              <p className="text-sm text-white/70">Pure tones and soft harmonics for optimal pitch perception, using high-frequency instruments babies naturally prefer.</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-secondary/10 to-transparent">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Emotional Design</h3>
              <p className="text-sm text-white/70">Carefully structured melodies that promote emotional security and reduce stress hormones.</p>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">5.2 Tempo and Rhythm Structuring</h3>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>60-80 BPM mimics caregiver speech patterns, aiding in language recognition.</li>
            <li>Structured pauses improve auditory discrimination and attention regulation.</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">5.3 Emotional Conditioning Through Music</h3>
          <ul className="list-disc pl-6 mb-6 text-white/80">
            <li>Soft, repetitive lullabies encourage serotonin release, promoting relaxation.</li>
            <li>Energetic, rhythmic tracks activate dopaminergic pathways, supporting motor development.</li>
          </ul>
          
          {/* Subtle Mid-content CTA */}
          <div className="my-12 p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 
                        rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-white mb-2">Experience the Science in Action</h4>
                <p className="text-sm text-white/70">
                  See how our research-backed approach can enhance your baby's development through music.
                </p>
              </div>
              <button
                onClick={() => document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
                className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl
                         transition-all duration-300 flex items-center gap-2 group"
              >
                Try Now
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">5.4 Adaptive Playlists for Developmental Stages</h3>
          <ul className="list-disc pl-6 mb-8 text-white/80">
            <li>0-6 months: Soothing, high-frequency tones for auditory mapping.</li>
            <li>6-12 months: More rhythm-driven pieces for motor and language synchronization.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">6. Evidence-Based Approach</h2>
          <p className="text-white/80 mb-4">
            Our methodology is informed by peer-reviewed research from the following institutions:
          </p>
          <div className="grid gap-4 mb-8">
            {[
              {
                institution: "University of Washington (2016)",
                description: "Groundbreaking research on music enhancing infant neural responses to speech",
                icon: Brain,
                color: "text-sky-400"
              },
              {
                institution: "Harvard University",
                description: "Comprehensive studies on music and neural connectivity in early development",
                icon: Sparkles,
                color: "text-rose-400"
              },
              {
                institution: "NCBI Studies",
                description: "Multiple studies on phonological development, cortisol reduction, and emotional regulation",
                icon: Heart,
                color: "text-green-400"
              },
              {
                institution: "Diana Deutsch (2013)",
                description: "Pioneering research on early pitch perception and cognitive development",
                icon: Music2,
                color: "text-purple-400"
              },
              {
                institution: "Mozart Effect Research",
                description: "Studies demonstrating significant improvements in spatial reasoning abilities",
                icon: Star,
                color: "text-amber-400"
              }
            ].map(({ institution, description, icon: Icon, color }) => (
              <div key={institution} 
                   className="flex items-start gap-4 p-4 bg-white/5 rounded-xl
                            hover:bg-white/10 transition-all duration-300">
                <Icon className={`w-6 h-6 ${color} shrink-0 mt-1`} />
                <div>
                  <h3 className="text-white font-medium mb-1">{institution}</h3>
                  <p className="text-white/70 text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">7. Conclusion</h2>
          <p className="text-white/80 mb-12">
            Our music is designed using scientifically validated principles to support early cognitive development, emotional well-being, and linguistic skills in infants. By integrating music cognition research, neuroscience, and cultural diversity, we provide an evidence-based approach to fostering holistic growth through sound.
          </p>

          {/* Final CTA */}
          <div className="card p-6 mb-8 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5
                        border-white/10 text-center">
            <p className="text-white/90 mb-4">
              Ready to give your baby the gift of scientifically-crafted music?
            </p>
            <button
              onClick={() => document.querySelector<HTMLButtonElement>('[data-auth-trigger]')?.click()}
              className="btn-primary text-sm px-6 py-3 flex items-center gap-2 mx-auto"
            >
              Create Your First Song
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          
        </div>
        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </div>
  );
}