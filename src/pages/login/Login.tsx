import { useState, useEffect } from 'react';
import { Eye, EyeOff, Smartphone, Lock, Send } from 'lucide-react';

function Login() {
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [mobileError, setMobileError] = useState('');

  const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(raw);
    if (!raw) {
      setMobileError('');
    } else if (raw.length < 10) {
      setMobileError('Enter 10 digit mobile number');
    } else if (!INDIAN_MOBILE_REGEX.test(raw)) {
      setMobileError('Indian mobile numbers must start with 6, 7, 8, or 9');
    } else {
      setMobileError('');
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  const isMobileValid = mobileNumber.length === 10 && INDIAN_MOBILE_REGEX.test(mobileNumber);

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMobileValid) return;

    setIsSendingOtp(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSendingOtp(false);

    setOtpSent(true);
    setTimeLeft(120);
    setOtp('');
  };

  const handleResendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSendingOtp(false);
    setTimeLeft(120);
    setOtp('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-12">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome back to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                SecureAuth
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Secure, fast, and reliable authentication for your modern applications.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bank-level Security</h3>
                <p className="text-gray-600 text-sm">Your data is encrypted and protected</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">Get access in seconds with OTP</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Always Available</h3>
                <p className="text-gray-600 text-sm">24/7 support when you need it</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/20 p-8 lg:p-10">
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">SecureAuth</h2>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
              <p className="text-gray-600">Enter your mobile number to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none pl-1">
                    <span>+91</span>
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    disabled={otpSent}
                    placeholder="9876543210"
                    className={`block w-full pl-[5rem] pr-32 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/50 placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed ${mobileError ? 'border-red-500' : 'border-gray-200'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!isMobileValid || isSendingOtp || otpSent}
                    className="absolute inset-y-0 right-0 px-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none"
                  >
                    {isSendingOtp ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : otpSent ? (
                      <span className="text-xs">Sent</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Send</span>
                      </>
                    )}
                  </button>
                </div>
                {mobileError && (
                  <p className="text-sm text-red-600 mt-1">{mobileError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    type={showOtp ? 'text' : 'password'}
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={!otpSent}
                    placeholder="Enter 6-digit OTP"
                    className="block w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    required={otpSent}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    disabled={!otpSent}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-colors focus:outline-none focus:text-gray-600 disabled:cursor-not-allowed"
                    aria-label={showOtp ? 'Hide OTP' : 'Show OTP'}
                  >
                    {showOtp ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {otpSent && (
                  <div className="flex items-center justify-between text-sm">
                    <span className={timeLeft > 0 ? 'text-gray-600' : 'text-red-600'}>
                      {timeLeft > 0 ? (
                        <>OTP expires in <span className="font-semibold">{formatTime(timeLeft)}</span></>
                      ) : (
                        'OTP expired'
                      )}
                    </span>
                    {timeLeft === 0 && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSendingOtp}
                        className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:underline disabled:text-gray-400"
                      >
                        {isSendingOtp ? 'Resending...' : 'Resend OTP'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                {/* <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
                >
                  Forgot password?
                </button> */}
              </div>

              <button
                type="submit"
                disabled={isLoading || !otpSent || !otp.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Sign in'
                )}
              </button>
            </form>

            {/* <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
              >
                Sign up
              </button>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
