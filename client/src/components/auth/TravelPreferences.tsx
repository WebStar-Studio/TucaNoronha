import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar,
  Users,
  Mountain,
  Hotel,
  Utensils,
  Activity,
  Car,
  HeartHandshake,
  History,
  ChevronRight,
  ArrowRight,
  Check
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { TravelPreferences as TravelPreferencesType } from '@/store/authStore';


import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const activityLevels = [
  { value: "low", label: "Relaxed", description: "Mostly relaxing with occasional light activities" },
  { value: "medium", label: "Balanced", description: "Mix of relaxation and moderate activities" },
  { value: "high", label: "Adventurous", description: "Active and challenging experiences" },
];

const accommodationTypes = [
  { value: "budget", label: "Budget-friendly", description: "Affordable, practical accommodations" },
  { value: "mid-range", label: "Mid-range", description: "Comfortable accommodations with some amenities" },
  { value: "luxury", label: "Luxury", description: "Premium accommodations with exclusive services" },
];

const transportOptions = [
  { value: "guided-tour", label: "Guided Tours", description: "Organized transportation with guides" },
  { value: "rental", label: "Vehicle Rental", description: "Self-drive with flexible schedule" },
  { value: "public", label: "Public Transport", description: "Eco-friendly local transportation" },
];

const interestOptions = [
  "Beach Activities",
  "Wildlife",
  "Diving",
  "Hiking",
  "Photography",
  "Marine Life",
  "Boat Tours",
  "Local Culture",
  "Gastronomy",
  "Eco-tourism",
  "Sunset Viewing",
  "Surfing",
  "Snorkeling",
  "Bird Watching",
];

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Lactose-free",
  "Pescatarian",
  "No Restrictions",
  "Kosher",
  "Halal",
  "Low-carb",
  "Allergies (specify in notes)",
];

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    title: "Travel Dates",
    description: "When are you planning to visit Fernando de Noronha?",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Group Size",
    description: "How many people will be traveling with you?",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Interests",
    description: "What activities interest you the most?",
    icon: <Mountain className="h-6 w-6" />,
  },
  {
    title: "Accommodation",
    description: "What type of accommodation do you prefer?",
    icon: <Hotel className="h-6 w-6" />,
  },
  {
    title: "Dietary Preferences",
    description: "Do you have any dietary preferences or restrictions?",
    icon: <Utensils className="h-6 w-6" />,
  },
  {
    title: "Activity Level",
    description: "What's your preferred level of activity during your trip?",
    icon: <Activity className="h-6 w-6" />,
  },
  {
    title: "Transportation",
    description: "How would you like to get around the island?",
    icon: <Car className="h-6 w-6" />,
  },
  {
    title: "Special Requirements",
    description: "Do you have any special needs or requests?",
    icon: <HeartHandshake className="h-6 w-6" />,
  },
  {
    title: "Previous Visit",
    description: "Have you visited Fernando de Noronha before?",
    icon: <History className="h-6 w-6" />,
  }
];

// Extend travel preferences with needed props for the component
export type TravelPreferencesData = {
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

interface TravelPreferencesProps {
  onComplete: (data: TravelPreferencesData) => void;
  isSubmitting?: boolean;
}

function TravelPreferencesComponent({ onComplete, isSubmitting = false }: TravelPreferencesProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [travelPrefs, setTravelPrefs] = useState<TravelPreferencesData>({
    travelDates: { 
      from: addDays(new Date(), 30),  
      to: addDays(new Date(), 37) // Default to a week-long trip, a month from now
    },
    groupSize: 2,
    travelInterests: [],
    accommodationPreference: "",
    dietaryRestrictions: [],
    activityLevel: "",
    transportPreference: "",
    specialRequirements: "",
    previousVisit: false
  });

  // Assistant responses based on user selections
  const [assistantMessage, setAssistantMessage] = useState("Hello! I'm your Tuca Noronha travel assistant. Let's customize your paradise experience! When are you planning to visit?");

  useEffect(() => {
    // Update progress bar
    setProgress(((currentStep + 1) / steps.length) * 100);
    
    // Update assistant message based on current step and previous selections
    updateAssistantMessage();
  }, [currentStep, travelPrefs]);

  const updateAssistantMessage = () => {
    // Dynamic responses based on user's choices
    switch(currentStep) {
      case 0: // Travel Dates
        setAssistantMessage("Hello! I'm your Tuca Noronha travel assistant. Let's customize your paradise experience! When are you planning to visit?");
        break;
      case 1: // Group Size
        if (travelPrefs.travelDates?.from && travelPrefs.travelDates?.to) {
          const totalDays = Math.round((travelPrefs.travelDates.to.getTime() - travelPrefs.travelDates.from.getTime()) / (1000 * 60 * 60 * 24));
          setAssistantMessage(`A ${totalDays}-day trip in ${format(travelPrefs.travelDates.from, 'MMMM')} is a great choice! The weather is typically pleasant during that time. How many travelers will join this adventure?`);
        }
        break;
      case 2: // Interests
        setAssistantMessage(`Fantastic! Planning for ${travelPrefs.groupSize} ${travelPrefs.groupSize > 1 ? 'people' : 'person'}. Fernando de Noronha offers diverse experiences - what activities interest your group the most?`);
        break;
      case 3: // Accommodation
        if (travelPrefs.travelInterests.length > 0) {
          const primaryInterest = travelPrefs.travelInterests[0];
          setAssistantMessage(`${primaryInterest} is an excellent choice! We have some amazing spots for that. Now, what type of accommodation would make your stay perfect?`);
        } else {
          setAssistantMessage("Let's find you the perfect place to stay. What type of accommodation are you looking for?");
        }
        break;
      case 4: // Dietary
        if (travelPrefs.accommodationPreference === "luxury") {
          setAssistantMessage("Our luxury accommodations offer spectacular ocean views and premium amenities. Do you have any dietary preferences we should know about for restaurant recommendations?");
        } else if (travelPrefs.accommodationPreference === "mid-range") {
          setAssistantMessage("Great choice! Our mid-range options offer excellent value and comfort. Any dietary preferences we should consider when suggesting restaurants?");
        } else {
          setAssistantMessage("Our budget-friendly options still provide the perfect base for your island adventure. Do you have any dietary preferences?");
        }
        break;
      case 5: // Activity Level
        if (travelPrefs.dietaryRestrictions.length > 0) {
          setAssistantMessage(`Thanks for sharing your dietary preferences. I'll keep that in mind for restaurant recommendations. What's your preferred activity level for this trip?`);
        } else {
          setAssistantMessage("Fernando de Noronha offers everything from relaxing beaches to challenging hikes. What's your preferred activity level?");
        }
        break;
      case 6: // Transportation
        if (travelPrefs.activityLevel === "high") {
          setAssistantMessage("You're looking for adventure! Our expert guides can show you the most thrilling experiences on the island. How would you prefer to get around?");
        } else if (travelPrefs.activityLevel === "medium") {
          setAssistantMessage("A balanced approach will give you the perfect mix of relaxation and adventure. What's your preferred transportation method?");
        } else {
          setAssistantMessage("A relaxing vacation awaits you! How would you like to explore the island at your own pace?");
        }
        break;
      case 7: // Special Requirements
        setAssistantMessage("We want to ensure your comfort throughout your stay. Do you have any special requirements or requests?");
        break;
      case 8: // Previous Visit
        setAssistantMessage("Just one more question to help personalize your experience. Have you visited Fernando de Noronha before?");
        break;
      default:
        setAssistantMessage("Let me know your preferences so I can create the perfect itinerary for you!");
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(travelPrefs);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleToggleInterest = (interest: string) => {
    if (travelPrefs.travelInterests.includes(interest)) {
      setTravelPrefs({
        ...travelPrefs,
        travelInterests: travelPrefs.travelInterests.filter(i => i !== interest)
      });
    } else {
      setTravelPrefs({
        ...travelPrefs,
        travelInterests: [...travelPrefs.travelInterests, interest]
      });
    }
  };

  const handleToggleDietary = (option: string) => {
    if (travelPrefs.dietaryRestrictions.includes(option)) {
      setTravelPrefs({
        ...travelPrefs,
        dietaryRestrictions: travelPrefs.dietaryRestrictions.filter(i => i !== option)
      });
    } else {
      setTravelPrefs({
        ...travelPrefs,
        dietaryRestrictions: [...travelPrefs.dietaryRestrictions, option]
      });
    }
  };

  const isStepComplete = () => {
    switch(currentStep) {
      case 0: // Travel Dates
        return travelPrefs.travelDates?.from && travelPrefs.travelDates?.to;
      case 1: // Group Size
        return travelPrefs.groupSize > 0;
      case 2: // Interests
        return travelPrefs.travelInterests.length > 0;
      case 3: // Accommodation
        return !!travelPrefs.accommodationPreference;
      case 4: // Dietary
        return true; // Optional
      case 5: // Activity Level
        return !!travelPrefs.activityLevel;
      case 6: // Transportation
        return !!travelPrefs.transportPreference;
      case 7: // Special Requirements
        return true; // Optional
      case 8: // Previous Visit
        return true; // Already has a default value
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Virtual assistant message */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 relative">
        <div className="absolute -top-3 -left-3">
          <div className="bg-primary text-white p-1.5 rounded-full">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <p className="pl-2 text-foreground">{assistantMessage}</p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 text-primary">
            {steps[currentStep].icon}
            <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
          </div>
          
          <div className="space-y-4">
            {currentStep === 0 && (
              <div className="grid gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !travelPrefs.travelDates && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {travelPrefs.travelDates?.from ? (
                        travelPrefs.travelDates.to ? (
                          <>
                            {format(travelPrefs.travelDates.from, "PPP")} -{" "}
                            {format(travelPrefs.travelDates.to, "PPP")}
                          </>
                        ) : (
                          format(travelPrefs.travelDates.from, "PPP")
                        )
                      ) : (
                        <span>Select your travel dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={travelPrefs.travelDates?.from}
                      selected={{
                        from: travelPrefs.travelDates?.from,
                        to: travelPrefs.travelDates?.to
                      }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setTravelPrefs({ 
                            ...travelPrefs, 
                            travelDates: { 
                              from: range.from, 
                              to: range.to 
                            } 
                          });
                        } else if (range?.from) {
                          setTravelPrefs({ 
                            ...travelPrefs, 
                            travelDates: { 
                              from: range.from, 
                              to: travelPrefs.travelDates?.to || range.from
                            } 
                          });
                        } else {
                          setTravelPrefs({ ...travelPrefs, travelDates: undefined });
                        }
                      }}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                
                <p className="text-sm text-muted-foreground">
                  The ideal time to visit Fernando de Noronha is during the dry season (August to January) 
                  when visibility for diving and snorkeling is excellent.
                </p>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="group-size" className="text-base">Number of travelers</Label>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => travelPrefs.groupSize > 1 && setTravelPrefs({ ...travelPrefs, groupSize: travelPrefs.groupSize - 1 })}
                      disabled={travelPrefs.groupSize <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{travelPrefs.groupSize}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setTravelPrefs({ ...travelPrefs, groupSize: travelPrefs.groupSize + 1 })}
                      disabled={travelPrefs.groupSize >= 10}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <Button 
                      key={num}
                      variant={travelPrefs.groupSize === num ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setTravelPrefs({ ...travelPrefs, groupSize: num })}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Some activities and accommodations may have capacity limits. Group discounts are available for parties of 4 or more.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <Badge 
                      key={interest}
                      variant={travelPrefs.travelInterests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors"
                      onClick={() => handleToggleInterest(interest)}
                    >
                      {travelPrefs.travelInterests.includes(interest) && (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Select all that interest you. Your choices help us recommend the perfect activities for your trip.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <RadioGroup 
                  value={travelPrefs.accommodationPreference}
                  onValueChange={(value) => setTravelPrefs({ ...travelPrefs, accommodationPreference: value })}
                  className="space-y-3"
                >
                  {accommodationTypes.map((type) => (
                    <label
                      key={type.value}
                      className={cn(
                        "flex items-start space-x-3 p-3 border rounded-md transition-colors cursor-pointer",
                        travelPrefs.accommodationPreference === type.value ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      <RadioGroupItem value={type.value} id={type.value} />
                      <div className="space-y-1">
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => (
                    <Badge 
                      key={option}
                      variant={travelPrefs.dietaryRestrictions.includes(option) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/90 transition-colors"
                      onClick={() => handleToggleDietary(option)}
                    >
                      {travelPrefs.dietaryRestrictions.includes(option) && (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {option}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Fernando de Noronha offers diverse dining options. Your preferences help us recommend restaurants.
                </p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <RadioGroup 
                  value={travelPrefs.activityLevel}
                  onValueChange={(value) => setTravelPrefs({ ...travelPrefs, activityLevel: value })}
                  className="space-y-3"
                >
                  {activityLevels.map((level) => (
                    <label
                      key={level.value}
                      className={cn(
                        "flex items-start space-x-3 p-3 border rounded-md transition-colors cursor-pointer",
                        travelPrefs.activityLevel === level.value ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      <RadioGroupItem value={level.value} id={level.value} />
                      <div className="space-y-1">
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <RadioGroup 
                  value={travelPrefs.transportPreference}
                  onValueChange={(value) => setTravelPrefs({ ...travelPrefs, transportPreference: value })}
                  className="space-y-3"
                >
                  {transportOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-start space-x-3 p-3 border rounded-md transition-colors cursor-pointer",
                        travelPrefs.transportPreference === option.value ? "border-primary bg-primary/5" : "hover:bg-muted"
                      )}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div className="space-y-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Tell us about any specific needs or requests (accessibility requirements, special occasions, etc.)"
                  value={travelPrefs.specialRequirements}
                  onChange={(e) => setTravelPrefs({ ...travelPrefs, specialRequirements: e.target.value })}
                  className="min-h-[100px]"
                />
                <p className="text-sm text-muted-foreground">
                  We'll do our best to accommodate your special requirements.
                </p>
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={travelPrefs.previousVisit ? "outline" : "default"}
                    className="w-32"
                    onClick={() => setTravelPrefs({ ...travelPrefs, previousVisit: false })}
                  >
                    No, first time
                  </Button>
                  <Button
                    variant={travelPrefs.previousVisit ? "default" : "outline"}
                    className="w-32"
                    onClick={() => setTravelPrefs({ ...travelPrefs, previousVisit: true })}
                  >
                    Yes, returning
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {travelPrefs.previousVisit 
                    ? "Welcome back! We'll help you discover new experiences on the island." 
                    : "Excited to introduce you to Fernando de Noronha's wonders!"}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isStepComplete() || isSubmitting}
          className={cn(
            currentStep === steps.length - 1 ? "btn-gradient" : "",
            "space-x-2"
          )}
        >
          {isSubmitting ? (
            <>Loading...</>
          ) : currentStep === steps.length - 1 ? (
            <>
              <span>Complete</span>
              <Check className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Export the component
export default TravelPreferencesComponent;