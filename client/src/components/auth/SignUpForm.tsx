import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, PartyPopper } from 'lucide-react';
import { Link } from 'wouter';
import TravelPreferences from './TravelPreferences';

// Type for travel preferences data
type TravelPreferencesData = {
  travelDates: { from: Date; to: Date } | undefined;
  groupSize: number;
  travelInterests: string[];
  accommodationPreference: string;
  dietaryRestrictions: string[];
  activityLevel: string;
  transportPreference: string;
  specialRequirements: string;
  previousVisit: boolean;
};

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Handle multi-step registration
  const [registrationStep, setRegistrationStep] = useState<'account' | 'preferences' | 'completed'>('account');
  
  // Store user travel preferences
  const [travelPreferences, setTravelPreferences] = useState<TravelPreferencesData | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitAccount = (data: SignUpFormValues) => {
    // Store basic account info and move to travel preferences
    setRegistrationStep('preferences');
  };
  
  const handleTravelPreferencesComplete = async (preferences: TravelPreferencesData) => {
    // Store the travel preferences
    setTravelPreferences(preferences);
    
    try {
      // Create account with travel preferences
      const formData = form.getValues();
      
      // Create the user with travel preferences data
      await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName,
        // Add travel preferences
        {
          travelDates: preferences.travelDates,
          groupSize: preferences.groupSize,
          travelInterests: preferences.travelInterests,
          accommodationPreference: preferences.accommodationPreference,
          dietaryRestrictions: preferences.dietaryRestrictions,
          activityLevel: preferences.activityLevel,
          transportPreference: preferences.transportPreference,
          specialRequirements: preferences.specialRequirements,
          previousVisit: preferences.previousVisit,
        }
      );
      
      toast({
        title: 'Registration successful!',
        description: 'Your personalized paradise adventure awaits.',
      });
      
      // Show completion screen
      setRegistrationStep('completed');
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        setLocation('/');
      }, 2000);
      
    } catch (err) {
      // Error is already handled in the auth store
      // Go back to account step if there's an error
      setRegistrationStep('account');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {registrationStep === 'account' && (
          <motion.div
            key="account-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-medium">Create Your Account</h2>
              <p className="text-muted-foreground mt-1">First, let's set up your basic account details</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAccount)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John" 
                            {...field}
                            autoComplete="given-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Doe" 
                            {...field}
                            autoComplete="family-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john@example.com" 
                          {...field} 
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            {...field} 
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={toggleShowPassword}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            {...field} 
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={toggleShowConfirmPassword}
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full group btn-gradient mt-6 space-x-2"
                  disabled={isLoading || !form.formState.isValid}
                >
                  <span>Continue to Travel Preferences</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        )}
        
        {registrationStep === 'preferences' && (
          <motion.div
            key="preferences-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setRegistrationStep('account')}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h2 className="text-xl font-medium ml-auto mr-auto">Customize Your Experience</h2>
            </div>
            
            <TravelPreferences 
              onComplete={handleTravelPreferencesComplete} 
              isSubmitting={isLoading}
            />
          </motion.div>
        )}
        
        {registrationStep === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 space-y-4"
          >
            <div className="mx-auto bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mb-6">
              <PartyPopper className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-playfair">Welcome to Tuca Noronha!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your personalized paradise adventure awaits. We're excited to help you discover the wonders of Fernando de Noronha.
            </p>
            <div className="mt-6">
              <div className="animate-pulse w-24 mx-auto flex justify-center">
                <Loader2 className="animate-spin text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Redirecting you to your dashboard...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
