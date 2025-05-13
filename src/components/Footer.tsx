export default function Footer() {
  return (
    <footer className="text-center text-white/40 text-sm py-8 border-t border-white/5">
      <div>© 2025 BabyMusic AI. All rights reserved.</div>
      <div className="mt-2 flex justify-center space-x-4">
        <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        <a href="/terms" className="hover:text-white">Terms of Use</a>
      </div>
    </footer>
  );
}