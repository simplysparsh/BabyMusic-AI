import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-text-light p-8 mt-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>

        <p className="mb-4">Effective Date: [May 12, 2025]</p>
        <p className="mb-8">Last Updated: [May 12, 2025]</p>

        <p className="mb-4">
          Welcome to Baby Music AI! By using this app or website ("Service"), you agree to the following terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">2. Who Can Use the App</h2>
        <p className="mb-4">
          You must be 13 or older. If you are under 18, you must have parental permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">3. License to Use</h2>
        <p className="mb-4">
          We grant you a limited, non-exclusive, non-transferable license to use the app for personal, non-commercial purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">4. User Content</h2>
        <p className="mb-4">
          You retain ownership of content you submit. You grant us a license to use it to provide and improve the Service.
        </p>
        <p className="mb-4">You agree not to submit content that:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Is illegal, abusive, or violates third-party rights.</li>
          <li>Includes sensitive personal data you are not authorized to share.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">5. Modifications to the Service</h2>
        <p className="mb-4">
          We may modify or discontinue any part of the Service at any time without notice or liability.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">6. No Warranty (Use at Your Own Risk)</h2>
        <p className="mb-4">We provide the Service "as is" and "as available."</p>
        <p className="mb-4">We do not guarantee it will be error-free, secure, or uninterrupted.</p>
        <p className="mb-4">We disclaim all warranties to the fullest extent allowed by law.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">7. Limitation of Liability</h2>
        <p className="mb-4">To the maximum extent permitted by law:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>We are not liable for any damages (direct, indirect, incidental, etc.) arising from your use of the Service.</li>
          <li>Your sole remedy for dissatisfaction is to stop using the Service.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">8. Account Suspension or Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate accounts for violations of these Terms or for any reason, with or without notice.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">9. Indemnification</h2>
        <p className="mb-4">
          You agree to defend and hold us harmless from claims or damages arising from your use or misuse of the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">10. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of [Your State/Country], regardless of conflict-of-law rules.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">11. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms. Your continued use means you accept any changes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">12. Contact</h2>
        <p>
          📧 Email: <a href="mailto:contact@babymusic.ai" className="text-primary hover:underline">contact@babymusic.ai</a>
        </p>
      </div>
    </div>
  );
};

export default TermsOfService; 