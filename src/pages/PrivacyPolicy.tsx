import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-text-light p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>

        <p className="mb-4">Effective Date: [May 12, 2025]</p>
        <p className="mb-8">Last Updated: [May 12, 2025]</p>

        <p className="mb-4">
          Thank you for using Baby Music AI ("we", "our", or "us"). We care about your privacy and want you to understand how we collect, use, and protect your data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">1. Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>Account Data:</strong> Email address, name (if provided).</li>
          <li><strong>Usage Data:</strong> App interactions, feature use, crash reports, anonymized analytics.</li>
          <li><strong>Device Data:</strong> IP address, device model, operating system, browser type.</li>
          <li><strong>Content Data:</strong> Any inputs you provide (e.g., custom song names or preferences).</li>
        </ul>
        <p className="mb-4">We do not knowingly collect data from children under 13.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">2. How We Use Your Data</h2>
        <p className="mb-4">We use your data to:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Provide and improve our services.</li>
          <li>Communicate updates or support.</li>
          <li>Monitor usage and fix bugs.</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p className="mb-4">We do not sell your data.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">3. Data Sharing</h2>
        <p className="mb-4">We may share data with:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Service providers (e.g., cloud storage, analytics, music generation APIs).</li>
          <li>Legal authorities when required by law.</li>
          <li>Third parties in case of a business transfer or acquisition.</li>
        </ul>
        <p className="mb-4">We do not share personally identifiable information unless required.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">4. Data Retention</h2>
        <p className="mb-4">
          We retain data only as long as necessary to provide services and meet legal obligations. You may request deletion of your data by contacting us at <a href="mailto:contact@babymusic.ai" className="text-primary hover:underline">contact@babymusic.ai</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">5. Security Practices</h2>
        <p className="mb-4">
          We implement reasonable security measures but cannot guarantee absolute protection. By using the app, you acknowledge this risk.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">6. Your Rights</h2>
        <p className="mb-4">Depending on your location, you may have rights to:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Request access, correction, or deletion of your data.</li>
          <li>Object to or restrict certain uses.</li>
          <li>File a complaint with a data protection authority.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">7. International Transfers</h2>
        <p className="mb-4">
          Your data may be transferred and processed outside your country. By using our app, you consent to this transfer.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">8. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy. We'll notify you if changes are material. Continued use after updates means you agree to the revised policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-accent">9. Contact Us</h2>
        <p className="mb-4">For privacy-related questions:</p>
        <p>
          📧 Email: <a href="mailto:contact@babymusic.ai" className="text-primary hover:underline">contact@babymusic.ai</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 