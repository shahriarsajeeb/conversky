const PrivacyPolicy = () => {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last updated: August 28, 2025</p>
  
        <p className="mb-6">
          Conversky (“we”, “our”, or “us”) values your privacy. This Privacy Policy explains how
          information is handled when you use our mobile application.
        </p>
  
        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="mb-6">
          Conversky does not require you to create an account. We do not collect personally
          identifiable information such as your name, email, or contact details.
          Any personal details you provide inside the app (e.g. About Me, Profession, Goals) are stored
          securely on your own device using encrypted local storage. These details are never uploaded
          to our servers.
        </p>
  
        <h2 className="text-xl font-semibold mb-3">2. How Your Data Is Used</h2>
        <p className="mb-6">
          When you start a conversation, your input text is sent to the OpenAI API for processing to
          generate a response. This data is transmitted securely and is not stored by Conversky.
          Memory you save inside the app (About Me, Business context, etc.) stays on your device.
        </p>
  
        <h2 className="text-xl font-semibold mb-3">3. Third-Party Services</h2>
        <p className="mb-6">
          Conversky relies on the OpenAI API to generate responses. OpenAI may process your input text
          to provide AI-generated answers. For more information, please review OpenAI’s Privacy Policy
          at <a href="https://openai.com/policies/privacy-policy" className="text-blue-600 underline">openai.com</a>.
        </p>
  
        <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
        <p className="mb-6">
          We take data security seriously. All personal information is stored locally on your device
          using secure storage. You may clear your memory and conversations at any time from the
          Preferences screen in the app.
        </p>
  
        <h2 className="text-xl font-semibold mb-3">5. Children’s Privacy</h2>
        <p className="mb-6">
          Conversky is not directed to individuals under 13. We do not knowingly collect personal
          information from children.
        </p>
  
        <h2 className="text-xl font-semibold mb-3">6. Changes to This Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with the updated date.
        </p>
  
        <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, you may contact us at:  
          <br /> 📧 <a href="mailto:support@becodemy.com" className="text-blue-600 underline">support@becodemy.com</a>
        </p>
      </div>
    )
  }
  
  export default PrivacyPolicy
  