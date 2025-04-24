import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
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
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordForm() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetFormValues) => {
    clearError();
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
      toast({
        title: 'Reset email sent!',
        description: 'Check your inbox for a password reset link.',
      });
    } catch (err) {
      // Error is already handled in the auth store
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="p-6 bg-green-50 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Reset Link Sent</h3>
          <p className="text-green-700">
            We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.
          </p>
        </div>
        <p className="text-gray-600 mb-4">
          Didn't receive an email? Check your spam folder or try again.
        </p>
        <div className="flex space-x-4 justify-center">
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Try Again
          </Button>
          <Link href="/signin">
            <Button>
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/signin" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Reset Your Password</h2>
        <p className="text-gray-600 mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          
          <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
