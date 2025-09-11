
const Footer = () => {
  return (
    <footer className="relative">      
      {/* Main footer content */}
      <div className="bg-white border-t border-t-slate-100">
        <div className="container mx-auto px-6 py-12">
          {/* Main content row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left side - Brand information */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Conversky
              </h3>
              <p className="text-slate-600 text-sm">
                Your personal AI assistant
              </p>
            </div>
            
            {/* Right side - Navigation links */}
            <div className="flex flex-wrap gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-700 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-700 transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
          
          {/* Separator line */}
          <div className="border-t border-slate-200 my-8"></div>
          
          {/* Copyright information */}
          <div className="text-center">
            <p className="text-sm text-slate-600">
              © 2025 Conversky. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;