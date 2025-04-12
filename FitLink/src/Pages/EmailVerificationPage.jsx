import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmailVerificationPage = () => {
  const [user, loading] = useAuthState(auth);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {

    const wasEmailSent = localStorage.getItem('verificationEmailSent') === 'true';

    if (user && !user.emailVerified && !wasEmailSent) {
      sendVerificationEmail();
      localStorage.setItem('verificationEmailSent', 'true');
      setEmailSent(true);
    }
  }, [user]);

  const sendVerificationEmail = async () => {
    try {
      setIsSending(true);
      await sendEmailVerification(user);
      setMessage('Verification email sent successfully! Check your inbox.');
    } catch (error) {
      setMessage(`Error sending verification email: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <FaEnvelope className="text-purple-600 text-5xl" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify Your Email Address</h1>
          <p className="text-gray-600">
            We've sent a verification link to {user?.email}. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={sendVerificationEmail}
            disabled={isSending}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <FaCheckCircle className="mr-2" />
                Resend Verification Email
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            <Link to="/reset-password" className="text-purple-600 hover:underline">
              Need to reset your password?
            </Link>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-purple-600 hover:underline flex items-center justify-center">
              <FaArrowLeft className="mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;