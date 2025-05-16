import { CreditCard, Wifi } from 'lucide-react';

interface BankCardProps {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cardType: 'debit' | 'credit';
  isActive: boolean;
}

const BankCard = ({ 
  cardNumber, 
  cardHolderName, 
  expiryDate, 
  cardType,
  isActive 
}: BankCardProps) => {
  // Format card number with spacing
  const formatCardNumber = (num: string) => {
    return num.replace(/(\d{4})/g, '$1 ').trim();
  };
  
  // Only show last 4 digits for security
  const maskedNumber = cardNumber.replace(/\d(?=\d{4})/g, '•');
  
  return (
    <div className={`bank-card transition-all relative ${!isActive ? 'opacity-60' : 'opacity-100'}`}>
      <div className="absolute top-0 right-0 m-4">
        <Wifi className="w-6 h-6 text-accent-gold" />
      </div>
      
      <div className="absolute top-3 left-5">
        <span className="text-xs font-medium text-white/70 uppercase">Ulster Delt Bank</span>
      </div>
      
      <div className="card-chip" />
      
      <div className="absolute bottom-20 left-5 right-5">
        <p className="text-xl font-mono text-white tracking-widest">
          {formatCardNumber(maskedNumber)}
        </p>
      </div>
      
      <div className="absolute bottom-14 left-5 flex items-center space-x-4 text-xs text-white/80">
        <div>
          <p className="uppercase text-[0.6rem] mb-1 opacity-70">Valid thru</p>
          <p>{expiryDate}</p>
        </div>
        <div>
          <p className="uppercase text-[0.6rem] mb-1 opacity-70">Card Type</p>
          <p className="capitalize">{cardType}</p>
        </div>
      </div>
      
      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
        <p className="text-sm font-medium text-white uppercase truncate max-w-[200px]">
          {cardHolderName}
        </p>
        <div className="flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-accent-gold opacity-80" />
          <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="28" height="18" rx="3" fill="#FFD700" stroke="#E6C200" strokeWidth="2"/>
            <rect x="8" y="8" width="16" height="2" rx="1" fill="#E6C200" />
          </svg>
        </div>
      </div>
      
      {!isActive && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="bg-error-500 text-white text-sm font-bold py-1 px-3 rounded-full rotate-[-15deg] shadow-lg">
            DEACTIVATED
          </div>
        </div>
      )}
    </div>
  );
};

export default BankCard;