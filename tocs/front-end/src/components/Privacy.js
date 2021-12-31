import React, { useEffect } from "react";
import { Card, CardBody, CardTitle } from "./Cards";

const Privacy = () => {
  useEffect(() => {
    document.title = "TOCS - Privacy Policy";
  }, []);

  return (
    <Card size="large">
      <CardBody>
        <CardTitle>Privacy Policy - Thousand Oaks Chinese School</CardTitle>
        <strong>What information do we collect?</strong>
        <p>
          We collect information from you when you register on our site or fill
          out a form. When registering or making payment on our site, as
          appropriate, you may be asked to enter your name, email, address,
          phone number or other information.
        </p>
        <strong>What do we use your information for?</strong>
        <p>
          Any of the information we collect from you may be used in one of the
          following ways:
        </p>
        <ul>
          <li>To process registrations</li>
          <li>To communication with parents</li>
        </ul>
        <strong>How do we protect your information?</strong>
        <p>
          We implement a variety of security measures to maintain the safety of
          your personal information when you make payment, or enter, submit, or
          access your personal information. All supplied information (including
          sensitive / credit card information) is transmitted via Secure Socket
          Layer (SSL) technology. Credit card information is encrypted in our
          Payment Gateway providers database, only to be accessible by those
          authorized with special access rights to such systems, and are
          required to keep the information confidential.
        </p>
        <p>
          After a payment transaction, your credit card information will not be
          stored on our servers.
        </p>
        <strong>Do we disclose any information to outside parties?</strong>
        <p>
          Your information will not be sold, exchanged, transferred, or given to
          any other company for any reason whatsoever, other than for the
          express purpose of delivering the service requested. We may release
          your information when we believe release is appropriate to comply with
          the law, enforce our site policies, or protect ours or others' rights,
          property, or safety.
        </p>
        <strong>Your Consent</strong>
        <p>By using our site, you consent to our privacy policy.</p>
        <strong>Changes to our Privacy Policy</strong>
        <p>
          If we decide to change our privacy policy, we will post these changes
          on this page.
        </p>
        <strong>Contacting Us</strong>
        <p>
          If there are any questions regarding this privacy policy, you may
          contact us using the information below:
        </p>
        <ul>
          <li>
            Web Site: <a href="http://www.to-cs.org">http://www.to-cs.org</a>
          </li>
          <li>By Mail: P.O. Box 6775, Thousand Oaks, CA 91362</li>
          <li>
            Email: <a href="mailto:privacy@to-cs.org">privacy@to-cs.org</a>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};

export default Privacy;
