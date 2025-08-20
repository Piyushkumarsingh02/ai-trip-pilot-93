-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers_count INTEGER NOT NULL DEFAULT 1,
  budget_range TEXT,
  preferences JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itineraries table for AI-generated plans
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  activities JSONB NOT NULL DEFAULT '[]',
  estimated_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table for individual activities
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIME,
  end_time TIME,
  category TEXT,
  estimated_cost DECIMAL(10,2),
  booking_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for trips
CREATE POLICY "Users can view their own trips" 
ON public.trips FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips" 
ON public.trips FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" 
ON public.trips FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" 
ON public.trips FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for itineraries
CREATE POLICY "Users can view itineraries for their trips" 
ON public.itineraries FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itineraries.trip_id 
  AND trips.user_id = auth.uid()
));

CREATE POLICY "Users can create itineraries for their trips" 
ON public.itineraries FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itineraries.trip_id 
  AND trips.user_id = auth.uid()
));

CREATE POLICY "Users can update itineraries for their trips" 
ON public.itineraries FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itineraries.trip_id 
  AND trips.user_id = auth.uid()
));

CREATE POLICY "Users can delete itineraries for their trips" 
ON public.itineraries FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.trips 
  WHERE trips.id = itineraries.trip_id 
  AND trips.user_id = auth.uid()
));

-- Create RLS policies for activities
CREATE POLICY "Users can view activities for their itineraries" 
ON public.activities FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.itineraries 
  JOIN public.trips ON trips.id = itineraries.trip_id
  WHERE itineraries.id = activities.itinerary_id 
  AND trips.user_id = auth.uid()
));

CREATE POLICY "Users can create activities for their itineraries" 
ON public.activities FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.itineraries 
  JOIN public.trips ON trips.id = itineraries.trip_id
  WHERE itineraries.id = activities.itinerary_id 
  AND trips.user_id = auth.uid()
));

CREATE POLICY "Users can update activities for their itineraries" 
ON public.activities FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.itineraries 
  JOIN public.trips ON trips.id = itineraries.trip_id
  WHERE itineraries.id = activities.itinerary_id 
  AND trips.user_id = auth.uid()
));

CREATE POLICY "Users can delete activities for their itineraries" 
ON public.activities FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.itineraries 
  JOIN public.trips ON trips.id = itineraries.trip_id
  WHERE itineraries.id = activities.itinerary_id 
  AND trips.user_id = auth.uid()
));

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();