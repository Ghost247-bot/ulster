import React from 'react';

const Accessibility: React.FC = () => (
  <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-[#1B4D3E]">Accessibility</h1>
      <p className="text-gray-700 mb-8">
        Ulster Delt Bank is committed to ensuring digital accessibility for people of all abilities. We strive to maintain an inclusive online environment that is accessible to everyone.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">1. Our Commitment</h2>
        <div className="space-y-4 text-gray-700">
          <p>We are dedicated to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Meeting WCAG 2.1 Level AA standards</li>
            <li>Providing an inclusive banking experience</li>
            <li>Continuously improving accessibility</li>
            <li>Ensuring equal access to all services</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">2. Accessibility Features</h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="font-medium">Screen Reader Compatibility</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Compatible with major screen readers</li>
            <li>Proper heading structure</li>
            <li>Descriptive link text</li>
            <li>ARIA labels where needed</li>
          </ul>

          <h3 className="font-medium mt-4">Keyboard Navigation</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full keyboard accessibility</li>
            <li>Visible focus indicators</li>
            <li>Logical tab order</li>
            <li>Keyboard shortcuts</li>
          </ul>

          <h3 className="font-medium mt-4">Visual Accessibility</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>High contrast mode</li>
            <li>Resizable text</li>
            <li>Alternative text for images</li>
            <li>Clear visual hierarchy</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">3. Assistive Technologies</h2>
        <div className="space-y-4 text-gray-700">
          <p>Our website is compatible with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
            <li>Screen magnifiers</li>
            <li>Speech recognition software</li>
            <li>Alternative input devices</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">4. Accessibility Tools</h2>
        <div className="space-y-4 text-gray-700">
          <h3 className="font-medium">Text Size and Contrast</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Text size adjustment</li>
            <li>High contrast mode</li>
            <li>Custom color schemes</li>
            <li>Font customization</li>
          </ul>

          <h3 className="font-medium mt-4">Navigation Assistance</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Skip navigation links</li>
            <li>Breadcrumb navigation</li>
            <li>Site map</li>
            <li>Search functionality</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">5. Alternative Formats</h2>
        <div className="space-y-4 text-gray-700">
          <p>We provide information in multiple formats:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Large print materials</li>
            <li>Braille documents</li>
            <li>Audio recordings</li>
            <li>Electronic text formats</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">6. Feedback and Support</h2>
        <div className="space-y-4 text-gray-700">
          <p>We welcome your feedback on accessibility:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accessibility feedback form</li>
            <li>Dedicated accessibility support</li>
            <li>Regular accessibility audits</li>
            <li>User testing with diverse abilities</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">7. Contact Information</h2>
        <div className="text-gray-700">
          <p>For accessibility assistance:</p>
          <p className="mt-2">
            Ulster Delt Bank Accessibility Team<br />
            6/8, College Green,<br />
            Dublin 2 Dublin, Ireland<br />
            Phone: 1-833-233-6333 (TTY: 1-800-555-0124)<br />
            Email: accessibility@ulsterdelt.it.com
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-[#1B4D3E]">8. Continuous Improvement</h2>
        <div className="space-y-4 text-gray-700">
          <p>We are committed to ongoing accessibility improvements:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Regular accessibility testing</li>
            <li>User feedback integration</li>
            <li>Staff training</li>
            <li>Technology updates</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
);

export default Accessibility; 