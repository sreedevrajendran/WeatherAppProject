'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-gradient-accent">Privacy Statement</h1>
                    <p className="text-secondary">Last updated: February 3, 2026</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-secondary leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-4">
                            Weather Forecast is committed to protecting your privacy. We collect minimal information to provide you with the best weather experience:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Location Data:</strong> We use your device's geolocation (with your permission) to provide accurate local weather forecasts.</li>
                            <li><strong>Preferences:</strong> We store your settings (temperature units, saved locations, widget preferences) locally in your browser and our database.</li>
                            <li><strong>Session Data:</strong> We use cookies to maintain your session and remember your preferences.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">Your information is used solely to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide accurate weather forecasts for your location</li>
                            <li>Remember your preferences and settings</li>
                            <li>Improve our service and user experience</li>
                        </ul>
                        <p className="mt-4">
                            <strong>We do not sell, share, or distribute your personal information to third parties.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Storage</h2>
                        <p>
                            Your preferences are stored in a secure SQLite database and are associated with a random session ID stored in a cookie.
                            We do not collect personally identifiable information such as names, email addresses, or phone numbers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
                        <p className="mb-4">We use the following third-party services:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>WeatherAPI.com:</strong> To fetch real-time weather data. Please refer to their <a href="https://www.weatherapi.com/privacy.aspx" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">privacy policy</a>.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Cookies</h2>
                        <p>
                            We use cookies to maintain your session and store your preferences. You can disable cookies in your browser settings,
                            but this may affect the functionality of the application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Access your stored preferences</li>
                            <li>Delete your data by clearing your browser cookies and cache</li>
                            <li>Opt-out of location tracking by denying location permissions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Children's Privacy</h2>
                        <p>
                            Our service is not directed to children under 13. We do not knowingly collect personal information from children.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
                        <p>
                            We may update this privacy statement from time to time. We will notify you of any changes by updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Statement, please contact us at:{' '}
                            <a href="mailto:privacy@weather-forecast.com" className="text-accent hover:underline">
                                privacy@weather-forecast.com
                            </a>
                        </p>
                    </section>

                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center text-secondary text-sm">
                    <p>Made with ❤️ by Sreedev Rajendran</p>
                </div>
            </div>
        </div>
    );
}
