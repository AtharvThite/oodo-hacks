import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import OTPInput from '../common/OTPInput';
import LoadingSpinner from '../common/LoadingSpinner';

const OTPVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'registration');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Start countdown for resend (2 minutes)
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          purpose
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Email verified successfully!');

        if (purpose === 'registration') {
          // Redirect to register page with verified email
          navigate(`/register?email=${encodeURIComponent(email)}&verified=true`);
        } else if (purpose === 'forgot-password') {
          // Redirect to reset password page
          navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
        }
      } else {
        setError(data.message || 'OTP verification failed');

        if (data.remainingAttempts) {
          setError(`${data.message} (${data.remainingAttempts} attempts remaining)`);
        }

        if (data.maxAttemptsExceeded) {
          toast.error('Maximum attempts exceeded. Please request a new OTP.');
          setCountdown(120); // 2 minutes cooldown
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          purpose
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('OTP resent successfully!');
        setCountdown(120); // 2 minutes cooldown
        setOtp(''); // Clear current OTP
      } else {
        setError(data.message || 'Failed to resend OTP');
        if (data.retryAfter) {
          setCountdown(data.retryAfter);
        }
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangeEmail = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {purpose === 'registration' ? 'Verify Your Email' : 'Reset Your Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP Code
              </label>
              <OTPInput
                value={otp}
                onChange={setOtp}
                disabled={loading}
                error={error}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || resendLoading}
                  className={`font-medium ${
                    countdown > 0 || resendLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  {resendLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? <LoadingSpinner /> : 'Verify OTP'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleChangeEmail}
              className="w-full"
            >
              Change Email Address
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            OTP expires in 10 minutes. Make sure to check your spam/junk folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;