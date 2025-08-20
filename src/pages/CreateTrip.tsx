import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Users, DollarSign, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const CreateTrip = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    origin: '',
    destination: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    travelersCount: 1,
    budgetRange: '',
    preferences: {
      activityTypes: [] as string[],
      accommodationType: '',
      transportationType: '',
      foodPreferences: '',
      interests: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a trip',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: 'Error',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          title: formData.title,
          origin: formData.origin,
          destination: formData.destination,
          start_date: formData.startDate.toISOString().split('T')[0],
          end_date: formData.endDate.toISOString().split('T')[0],
          travelers_count: formData.travelersCount,
          budget_range: formData.budgetRange,
          preferences: formData.preferences,
          user_id: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Trip Created!',
        description: 'Your trip has been created successfully.',
      });

      navigate(`/trip/${data.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to create trip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const activityTypes = [
    'Adventure', 'Cultural', 'Relaxation', 'Food & Drink', 
    'Nature', 'History', 'Art & Museums', 'Nightlife', 'Shopping'
  ];

  const toggleActivityType = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        activityTypes: prev.preferences.activityTypes.includes(activity)
          ? prev.preferences.activityTypes.filter(a => a !== activity)
          : [...prev.preferences.activityTypes, activity]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-bold">Create New Trip</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Plan Your Perfect Trip</h2>
          <p className="text-muted-foreground">
            Let our AI help you create an amazing travel experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about your trip destination and dates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Trip Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Vacation to Paris"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">From</Label>
                  <Input
                    id="origin"
                    placeholder="City or airport"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">To</Label>
                  <Input
                    id="destination"
                    placeholder="City or destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        disabled={(date) => date < (formData.startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelers">Travelers</Label>
                  <Select value={formData.travelersCount.toString()} onValueChange={(value) => setFormData({ ...formData, travelersCount: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {num} {num === 1 ? 'traveler' : 'travelers'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Travel Preferences
              </CardTitle>
              <CardDescription>
                Help us personalize your trip recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select value={formData.budgetRange} onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget ($50-100/day)</SelectItem>
                    <SelectItem value="mid-range">Mid-range ($100-250/day)</SelectItem>
                    <SelectItem value="luxury">Luxury ($250+/day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Activity Types</Label>
                <div className="flex flex-wrap gap-2">
                  {activityTypes.map((activity) => (
                    <Button
                      key={activity}
                      type="button"
                      variant={formData.preferences.activityTypes.includes(activity) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleActivityType(activity)}
                    >
                      {activity}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Accommodation Type</Label>
                  <Select 
                    value={formData.preferences.accommodationType} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, accommodationType: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select accommodation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="hostel">Hostel</SelectItem>
                      <SelectItem value="apartment">Apartment/Airbnb</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                      <SelectItem value="boutique">Boutique Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Transportation</Label>
                  <Select 
                    value={formData.preferences.transportationType} 
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, transportationType: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Transport</SelectItem>
                      <SelectItem value="rental">Rental Car</SelectItem>
                      <SelectItem value="taxi">Taxi/Uber</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Special Interests</Label>
                <Textarea
                  id="interests"
                  placeholder="Tell us about any specific interests, dietary restrictions, or special requirements..."
                  value={formData.preferences.interests}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    preferences: { ...formData.preferences, interests: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;