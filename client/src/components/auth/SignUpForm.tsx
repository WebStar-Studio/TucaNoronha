import { useState, useEffect } from 'react';
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
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, PartyPopper, Users } from 'lucide-react';
import { Link } from 'wouter';
import TravelPreferences, { TravelPreferencesData } from './TravelPreferences';

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
  
  // Track the current conversation step in account creation
  const [accountStep, setAccountStep] = useState<'name' | 'email' | 'password' | 'review'>('name');
  
  // Track if each field has been completed to progressively show fields
  const [fieldCompleted, setFieldCompleted] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });
  
  // Watch form values to know when to progress
  const firstName = form.watch('firstName');
  const lastName = form.watch('lastName');
  const email = form.watch('email');
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');
  
  // Auto-advance the conversation when valid data is entered
  useEffect(() => {
    // If both first and last name are valid and we're on the name step
    if (firstName.length >= 2 && lastName.length >= 2 && accountStep === 'name' && !fieldCompleted.firstName) {
      // Mark name fields as completed
      setFieldCompleted(prev => ({ ...prev, firstName: true, lastName: true }));
      // Use timeout to make it feel more natural
      setTimeout(() => {
        setAccountStep('email');
      }, 800);
    }
  }, [firstName, lastName, accountStep, fieldCompleted.firstName]);
  
  useEffect(() => {
    // If email is valid and we're on the email step
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) && accountStep === 'email' && !fieldCompleted.email) {
      setFieldCompleted(prev => ({ ...prev, email: true }));
      setTimeout(() => {
        setAccountStep('password');
      }, 800);
    }
  }, [email, accountStep, fieldCompleted.email]);
  
  useEffect(() => {
    // If password is valid and matches confirmation 
    if (password.length >= 8 && password === confirmPassword && accountStep === 'password' && !fieldCompleted.password) {
      setFieldCompleted(prev => ({ ...prev, password: true, confirmPassword: true }));
      setTimeout(() => {
        setAccountStep('review');
      }, 800);
    }
  }, [password, confirmPassword, accountStep, fieldCompleted.password]);

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
            className="space-y-6"
          >
            {/* Virtual assistant chat bubble - intro */}
            <div className="p-5 bg-primary/5 backdrop-blur-sm rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-3 -left-3">
                <div className="bg-primary text-white p-1.5 rounded-full shadow-md">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="pl-2 space-y-2">
                <p className="text-foreground font-medium">Hello! I'm your Tuca Noronha travel assistant.</p>
                <p className="text-muted-foreground text-sm">Let's create your account so I can personalize your paradise experience. What's your name?</p>
              </div>
              
              {/* Animated typing indicator */}
              <div className="mt-2 flex space-x-1 ml-2">
                <motion.div 
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div 
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                />
                <motion.div 
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                />
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAccount)} className="space-y-5">
                {/* Fixed height container for conversation */}
                <div className="h-[400px] relative overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {/* Current conversation step */}
                    <motion.div
                      key={accountStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100, position: 'absolute' }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-5 w-full"
                    >
                      {/* Name step */}
                      {accountStep === 'name' && (
                        <div className="space-y-5">
                          <div className="backdrop-blur-sm p-5 rounded-2xl bg-gradient-to-br from-white/50 to-white/10 border border-white/20 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem className="backdrop-blur-sm overflow-hidden rounded-xl border border-primary/20 transition-all duration-300 hover:border-primary/50">
                                    <FormLabel className="text-primary font-medium px-4 pt-2 block">First Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="John" 
                                        {...field}
                                        autoComplete="given-name"
                                        className="bg-transparent border-0 border-t rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                                      />
                                    </FormControl>
                                    <FormMessage className="px-4 pb-2" />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem className="backdrop-blur-sm overflow-hidden rounded-xl border border-primary/20 transition-all duration-300 hover:border-primary/50">
                                    <FormLabel className="text-primary font-medium px-4 pt-2 block">Last Name</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Doe" 
                                        {...field}
                                        autoComplete="family-name"
                                        className="bg-transparent border-0 border-t rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                                      />
                                    </FormControl>
                                    <FormMessage className="px-4 pb-2" />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Email step */}
                      {accountStep === 'email' && (
                        <div className="space-y-5">
                          <div className="p-5 bg-primary/5 backdrop-blur-sm rounded-2xl border border-primary/10 relative">
                            <div className="pl-2">
                              <p className="text-muted-foreground">Nice to meet you, {firstName} {lastName}! Now, what email address would you like to use for your account?</p>
                            </div>
                            
                            {/* Animated typing indicator */}
                            <div className="mt-2 flex space-x-1 ml-2">
                              <motion.div 
                                className="h-2 w-2 rounded-full bg-primary"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              <motion.div 
                                className="h-2 w-2 rounded-full bg-primary"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                              />
                              <motion.div 
                                className="h-2 w-2 rounded-full bg-primary"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                              />
                            </div>
                          </div>
                          
                          {/* User's completed name info displayed as a message */}
                          <div className="ml-auto max-w-[80%] p-3 bg-primary/10 text-primary rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl">
                            <div className="flex flex-col">
                              <span className="font-medium">{firstName} {lastName}</span>
                            </div>
                          </div>
                          
                          <div className="backdrop-blur-sm p-5 rounded-2xl bg-gradient-to-br from-white/50 to-white/10 border border-white/20 shadow-lg">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="backdrop-blur-sm overflow-hidden rounded-xl border border-primary/20 transition-all duration-300 hover:border-primary/50">
                                  <FormLabel className="text-primary font-medium px-4 pt-2 block">Email</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="john@example.com" 
                                      {...field} 
                                      type="email"
                                      autoComplete="email"
                                      className="bg-transparent border-0 border-t rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                                    />
                                  </FormControl>
                                  <FormMessage className="px-4 pb-2" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Password step */}
                      {accountStep === 'password' && (
                        <div className="space-y-5">
                          <div className="p-5 bg-primary/5 backdrop-blur-sm rounded-2xl border border-primary/10 relative">
                            <div className="pl-2">
                              <p className="text-muted-foreground">Great! Now let's secure your account with a password.</p>
                            </div>
                            
                            {/* Animated typing indicator */}
                            <div className="mt-2 flex space-x-1 ml-2">
                              <motion.div 
                                className="h-2 w-2 rounded-full bg-primary"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                              <motion.div 
                                className="h-2 w-2 rounded-full bg-primary"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                              />
                              <motion.div 
                                className="h-2 w-2 rounded-full bg-primary"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                              />
                            </div>
                          </div>
                          
                          {/* User's completed email displayed as a message */}
                          <div className="ml-auto max-w-[80%] p-3 bg-primary/10 text-primary rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl">
                            <div className="flex flex-col">
                              <span className="font-medium">{email}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-5 backdrop-blur-sm p-5 rounded-2xl bg-gradient-to-br from-white/50 to-white/10 border border-white/20 shadow-lg">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem className="backdrop-blur-sm overflow-hidden rounded-xl border border-primary/20 transition-all duration-300 hover:border-primary/50">
                                  <FormLabel className="text-primary font-medium px-4 pt-2 block">Password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input 
                                        placeholder="••••••••" 
                                        {...field} 
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        className="bg-transparent border-0 border-t rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
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
                                  <FormMessage className="px-4 pb-2" />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem className="backdrop-blur-sm overflow-hidden rounded-xl border border-primary/20 transition-all duration-300 hover:border-primary/50">
                                  <FormLabel className="text-primary font-medium px-4 pt-2 block">Confirm Password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input 
                                        placeholder="••••••••" 
                                        {...field} 
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        className="bg-transparent border-0 border-t rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
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
                                  <FormMessage className="px-4 pb-2" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Review step */}
                      {accountStep === 'review' && (
                        <div className="space-y-5">
                          <div className="p-5 bg-primary/5 backdrop-blur-sm rounded-2xl border border-primary/10 relative">
                            <div className="pl-2">
                              <p className="text-muted-foreground">Perfect! Your account details are ready.</p>
                            </div>
                          </div>
                          
                          {/* Password confirmation message */}
                          <div className="ml-auto max-w-[80%] p-3 bg-primary/10 text-primary rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl">
                            <div className="flex flex-col">
                              <span className="font-medium">Password set successfully!</span>
                            </div>
                          </div>
                          
                          {/* Account summary */}
                          <div className="p-5 bg-primary/5 backdrop-blur-sm rounded-2xl border border-primary/10 relative">
                            <div className="space-y-3">
                              <p className="text-foreground font-medium">Your account details:</p>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-muted-foreground">Name:</span> {firstName} {lastName}</p>
                                <p><span className="text-muted-foreground">Email:</span> {email}</p>
                                <p><span className="text-muted-foreground">Password:</span> ••••••••</p>
                              </div>
                              <p className="text-muted-foreground mt-3">Now I'll ask about your travel preferences to create your perfect paradise experience.</p>
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full group btn-gradient mt-6 space-x-2 py-6 rounded-xl text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <span>Continue to Travel Preferences</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth" className="text-primary hover:underline">
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
            className="space-y-4"
          >
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                size="sm" 
                onClick={() => setRegistrationStep('account')}
                className="flex items-center gap-1 rounded-full h-10 w-10 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              
              <div className="h-10 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-full flex items-center">
                <motion.div 
                  className="h-10 rounded-full bg-primary/20 flex items-center px-4 text-sm"
                  initial={{ width: '33%' }}
                  animate={{ width: '66%' }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="whitespace-nowrap font-medium">Travel Preferences</span>
                </motion.div>
              </div>
            </div>
            
            <div className="backdrop-blur-sm p-5 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-lg">
              <TravelPreferences 
                onComplete={handleTravelPreferencesComplete} 
                isSubmitting={isLoading}
              />
            </div>
          </motion.div>
        )}
        
        {registrationStep === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 py-6"
          >
            {/* Success completion message */}
            <div className="p-6 backdrop-blur-sm rounded-2xl relative overflow-hidden 
                  bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 shadow-lg">
              
              {/* Animated particle effects */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: Math.random() * 6 + 2,
                      height: Math.random() * 6 + 2,
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                    }}
                    animate={{
                      y: [null, -Math.random() * 400],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 text-center">
                {/* Custom animation for the celebration icon */}
                <motion.div
                  className="mx-auto bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mb-6 border border-primary/20"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ 
                    scale: [0.8, 1.1, 1],
                    rotate: [-10, 10, 0]
                  }}
                  transition={{ 
                    duration: 0.8,
                    times: [0, 0.5, 1],
                    ease: "easeOut"
                  }}
                >
                  <PartyPopper className="h-12 w-12 text-primary" />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-playfair font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Welcome to Tuca Noronha!
                </motion.h2>
                
                <motion.p 
                  className="mt-4 max-w-md mx-auto text-foreground/80"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Your personalized paradise adventure awaits. Our AI-powered assistant is already preparing recommendations based on your preferences.
                </motion.p>
              </div>
            </div>
            
            {/* Virtual assistant bubble */}
            <div className="p-5 bg-primary/5 backdrop-blur-sm rounded-2xl border border-primary/10 relative">
              <div className="absolute -top-3 -left-3">
                <div className="bg-primary text-white p-1.5 rounded-full shadow-md">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="pl-2 space-y-2">
                <p className="text-foreground font-medium">Your account has been created successfully!</p>
                <p className="text-muted-foreground text-sm">I'm preparing your personalized dashboard with experiences tailored to your preferences. This will only take a moment...</p>
              </div>
              
              {/* Animated progress bar */}
              <div className="mt-4 h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
