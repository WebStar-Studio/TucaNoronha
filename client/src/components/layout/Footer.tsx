import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FaInstagram, FaFacebook, FaTwitter, FaPinterest, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // In a real implementation, this would call an API
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive our latest news and updates.",
    });
    
    setEmail('');
  };

  return (
    <footer className="bg-foreground text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          <div>
            <div className="mb-6">
              <span className="text-white font-montserrat font-bold text-2xl">tuca</span>
              <span className="text-accent font-montserrat font-bold text-2xl">noronha</span>
            </div>
            <p className="text-gray-300 mb-6">Your premium gateway to the breathtaking Fernando de Noronha archipelago.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="Instagram">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="Facebook">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="Twitter">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors" aria-label="Pinterest">
                <FaPinterest className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-gray-300 hover:text-white transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/accommodations" className="text-gray-300 hover:text-white transition-colors">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-300 hover:text-white transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-6">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Travel Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-montserrat font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-accent" />
                <span>Fernando de Noronha, PE, Brazil</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-accent" />
                <span>info@tucanoronha.com</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-accent" />
                <span>+55 (81) 3619-0000</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Subscribe to Our Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full rounded-l-md bg-gray-700 border-0 text-white placeholder:text-gray-400 focus-visible:ring-primary" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="btn-gradient rounded-l-none">
                  <FaEnvelope className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Tuca Noronha. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4 items-center">
            <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.14.0/flags/4x3/br.svg" alt="Brazilian flag" className="h-5 w-auto" />
            <span className="text-gray-400 text-sm">Member of Brazilian Tourism Association</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
