import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const MobileNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsVisible(true); 
      }
    };

    checkScreenSize(); 

    
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const closeNotification = () => {
    setIsVisible(false); 
  };

  if (!isVisible) return null; 

  return (
    <div className="fixed inset-0 bg-black/70 text-white flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-backgroundcolor2 dark:bg-backgroundcolor2 text-textcolor dark:text-textcolor p-6 rounded-lg shadow-lg max-w-sm text-center relative">
        <div onClick={closeNotification} className='absolute right-3 top-2 cursor-pointer '><X/> </div>
        <h2 className="text-xl font-bold mb-4 ">Better on Large Screens</h2>
        <p className="text-sm mb-4 ">
          This site is optimized for larger screens. Please consider using a
          tablet, laptop, or desktop for the best experience.
        </p>
        
      </div>
    </div>
  );
};

export default MobileNotification;
