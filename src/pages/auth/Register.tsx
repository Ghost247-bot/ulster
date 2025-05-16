import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LandmarkIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ssn, setSsn] = useState('');
  const [mothersMaidenName, setMothersMaidenName] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const isAdmin = email === 'rogerbeaudry@yahoo.com';
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state,
        zip,
        date_of_birth: dateOfBirth,
        ssn,
        mothers_maiden_name: mothersMaidenName,
        referral_source: referralSource,
        updated_at: new Date().toISOString(),
      }, isAdmin);
      
      if (error) {
        toast.error(error.message || 'Failed to create account');
      } else {
        toast.success('Account created successfully!');
        navigate(isAdmin ? '/admin' : '/');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12">
      <div className="card px-6 py-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <LandmarkIcon className="h-12 w-12 text-[#1B4D3E] mx-auto" />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join Ulster Delt Bank for secure and reliable banking
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="name@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="ssn" className="form-label">
              Social Security Number
            </label>
            <input
              id="ssn"
              name="ssn"
              type="password"
              required
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
              className="form-input"
              placeholder="XXX-XX-XXXX"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your SSN is encrypted and securely stored
            </p>
          </div>

          <div>
            <label htmlFor="mothersMaidenName" className="form-label">
              Mother's Maiden Name
            </label>
            <input
              id="mothersMaidenName"
              name="mothersMaidenName"
              type="text"
              required
              value={mothersMaidenName}
              onChange={(e) => setMothersMaidenName(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="zip" className="form-label">
                ZIP Code
              </label>
              <input
                id="zip"
                name="zip"
                type="text"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="referralSource" className="form-label">
              How did you hear about us?
            </label>
            <select
              id="referralSource"
              name="referralSource"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select an option</option>
              <option value="search">Search Engine</option>
              <option value="social">Social Media</option>
              <option value="friend">Friend/Family</option>
              <option value="advertisement">Advertisement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-[#1B4D3E] border-gray-300 rounded focus:ring-[#1B4D3E]"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <Link to="/terms" className="text-[#1B4D3E] hover:text-[#145033]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#1B4D3E] hover:text-[#145033]">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className={`btn w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''} bg-[#1B4D3E] text-white hover:bg-[#145033]`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <Link to="/login" className="ml-1 font-medium text-[#1B4D3E] hover:text-[#145033]">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;