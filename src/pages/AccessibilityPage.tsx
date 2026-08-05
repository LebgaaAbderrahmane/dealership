import { LegalDoc } from '../components/ui/LegalDoc';

export function AccessibilityPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Accessibility Statement"
      updated="June 1, 2026"
    >
      <p>
        Apex Motors is committed to ensuring our website is accessible to everyone,
        including people with disabilities. We work toward conformance with the Web
        Content Accessibility Guidelines (WCAG) 2.1 Level AA.
      </p>

      <h2>What We Do</h2>
      <ul>
        <li>Design with sufficient color contrast and readable type throughout.</li>
        <li>Provide keyboard navigation for all interactive elements.</li>
        <li>Include descriptive alternative text on meaningful images.</li>
        <li>Support screen readers with semantic page structure and proper form labels.</li>
        <li>Honor reduced-motion preferences for animations.</li>
      </ul>

      <h2>Known Limitations</h2>
      <p>
        Vehicle photos and third-party embeds (such as the location map) are
        provided by outside services and may not always meet every accessibility
        criterion. Where a photo is decorative, no alternative text is required.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you encounter any accessibility barrier, please tell us. Call{' '}
        <a href="tel:+213796269301">+213 796 26 93 01</a>, email{' '}
        <a href="mailto:accessibility@apexmotors.dz">accessibility@apexmotors.dz</a>,
        or visit us at Bordj El Kiffan, Algiers, Algeria. We will respond
        within two business days and will make every reasonable effort to resolve the
        issue promptly.
      </p>

      <h2>Ongoing Commitment</h2>
      <p>
        Accessibility is an ongoing effort. We review our site regularly and update
        our practices as standards and tools evolve.
      </p>
    </LegalDoc>
  );
}
