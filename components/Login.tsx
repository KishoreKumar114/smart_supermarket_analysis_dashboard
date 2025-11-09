import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

interface LoginProps {
  onLoginSuccess: () => void;
}

interface User {
  email: string;
  password: string;
  name: string;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    document.body.className = 'bg-dark-animate text-slate-200';
    return () => {
      document.body.className = 'text-slate-200';
    };
  }, []);

  // Check if user exists in localStorage
  const getUserFromStorage = (): User | null => {
    const userData = localStorage.getItem('supermarketUser');
    return userData ? JSON.parse(userData) : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (isSignUp) {
        // Sign Up Logic
        if (!name || !email || !password) {
          setError('Please fill all fields');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        // Save user to localStorage
        const userData: User = { email, password, name };
        localStorage.setItem('supermarketUser', JSON.stringify(userData));
        
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 2000);
      } else {
        // Sign In Logic
        const storedUser = getUserFromStorage();

        if (storedUser && storedUser.email === email && storedUser.password === password) {
          setIsLoading(false);
          setIsSuccess(true);
          setTimeout(() => {
            onLoginSuccess();
          }, 2000);
        } else {
          setError('Invalid email or password');
          setIsLoading(false);
        }
      }
    }, 1000);
  };

  const handleHelpClick = () => {
    setShowEmail(true);
    setTimeout(() => {
      setShowEmail(false);
    }, 3000);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const text = "Built by Kishore";
  const letters = text.split('');

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md glass-card p-8 md:p-12 text-center animate-fade-in overflow-hidden">
        {isSuccess ? (
          <div className="animate-fade-in">
            <div className="relative z-10 flex flex-col items-center justify-center">
              <svg className="w-20 h-20 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h1 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? 'Account Created!' : 'Welcome Back!'}
              </h1>
              <p className="text-slate-300">
                {isSignUp ? 'Your account has been successfully created' : 'Login successful'}
              </p>
            </div>
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i} 
                className="confetti-piece"
                style={{
                  '--color': `hsl(${Math.random() * 360}, 100%, 70%)`,
                  '--x': `${Math.cos((i / 100) * Math.PI * 2)}`,
                  '--y': `${Math.sin((i / 100) * Math.PI * 2)}`,
                  '--rot': `${Math.random() - 0.5}`,
                  '--delay': `${Math.random() * 0.2}`,
                } as React.CSSProperties}
              ></div>
            ))}
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">Smart Supermarket Analytics</h1>
            <p className="text-slate-300 mb-8">
              {isSignUp ? 'Create your account' : 'Sign in to access insights'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full glow-input rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full glow-input rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full glow-input rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center btn-gradient btn-gradient-login disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Spinner /> : (isSignUp ? 'Sign Up' : 'Login')}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-slate-300 hover:text-white text-sm transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Built by Kishore - Bottom Right with continuous sliding animation */}
      <div className="fixed bottom-6 right-6 overflow-hidden">
        <div className="flex bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700/50">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="text-sm text-slate-400 font-medium inline-block animate-continuous-slide"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </div>
      </div>

      {/* Help Icon - Bottom Left */}
      <div className="fixed bottom-6 left-6">
        <button
          onClick={handleHelpClick}
          className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors group"
        >
          <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-sm text-slate-400 group-hover:text-blue-400 transition-colors">Help</span>
        </button>
        
        {/* Email Display */}
        {showEmail && (
          <div className="absolute bottom-12 left-0 bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700 animate-fade-in">
            <span className="text-sm text-blue-400">kishorekumarr2k4@gmail.com</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes continuousSlide {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-4px) rotate(2deg);
          }
          66% {
            transform: translateY(2px) rotate(-1deg);
          }
        }
        .animate-continuous-slide {
          animation: continuousSlide 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;