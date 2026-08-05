import { LegalDoc } from '../components/ui/LegalDoc';

export function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Privacy Policy"
      updated="June 1, 2026"
    >
      <p>
        Apex Motors LLC ("Apex," "we," "us") respects your privacy. This policy
        explains what we collect, why we collect it, and how you can control it when
        you use our website or visit our dealership.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Information you submit through forms, such as your name, phone number, email address, and trade-in details.</li>
        <li>Information you provide in person, including driver's license data for test drives and credit applications.</li>
        <li>Automatically collected data, including device type, browser, and general location via cookies and analytics.</li>
      </ul>

      <h2>How We Use It</h2>
      <ul>
        <li>To respond to your inquiries and schedule appointments.</li>
        <li>To prepare financing and pre-qualification requests with our lender partners.</li>
        <li>To improve our website, inventory matching, and customer experience.</li>
        <li>To send service reminders and offers, only with your consent.</li>
      </ul>

      <h2>Credit & Financial Information</h2>
      <p>
        Pre-qualification on this site uses a soft credit inquiry, which does not
        affect your credit score. A hard inquiry is only performed if you authorize
        it to finalize financing. Financial data is shared only with the lenders
        needed to complete your transaction and is protected by industry-standard
        security measures.
      </p>

      <h2>Cookies & Tracking</h2>
      <p>
        We use cookies to keep the site working and to understand how visitors use
        it. You can disable cookies in your browser settings; core site functions
        will still work, though some conveniences may be limited.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with service
        providers and lenders required to deliver the services you request, and when
        required by law.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>Opt out of marketing emails at any time using the unsubscribe link.</li>
        <li>Request a copy, correction, or deletion of your data by contacting us.</li>
        <li>Review and revoke financing authorizations at any time before signing.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{' '}
        <a href="mailto:privacy@apexmotors.dz">privacy@apexmotors.dz</a> or
        write to Apex Motors, Bordj El Kiffan, Algiers, Algeria.
      </p>
    </LegalDoc>
  );
}
