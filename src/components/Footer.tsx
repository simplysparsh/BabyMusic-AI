export default function Footer() {
  return (
    <footer className="relative z-10 text-center text-white/70 text-sm py-6 border-t border-white/10 mt-2 bg-black/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="mb-4">© 2025 TuneLoom. All rights reserved.</div>
        <div className="flex justify-center space-x-6">
          <a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors duration-300">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}