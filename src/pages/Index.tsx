import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MapPin, Calendar, Users, Sparkles, ArrowRight, Brain, Globe, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Plane className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Smart AI Trip Planner
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Plan your perfect journey with AI-powered recommendations. 
              From destination discovery to detailed itineraries, we'll help you create 
              unforgettable travel experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="gap-2"
                  style={{ boxShadow: 'var(--shadow-travel)' }}
                >
                  View My Trips <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth')}
                    className="gap-2"
                    style={{ boxShadow: 'var(--shadow-travel)' }}
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose AI Trip Planner?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent platform combines cutting-edge AI with real travel data 
              to create personalized experiences just for you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center" style={{ background: 'var(--gradient-card)' }}>
              <CardHeader>
                <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>AI-Powered Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our advanced AI analyzes your preferences, budget, and travel style 
                  to create personalized itineraries that match your unique needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center" style={{ background: 'var(--gradient-card)' }}>
              <CardHeader>
                <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Discover hidden gems and popular attractions based on real-time data, 
                  weather conditions, local events, and traveler reviews.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center" style={{ background: 'var(--gradient-card)' }}>
              <CardHeader>
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stay informed with live updates on flight prices, weather changes, 
                  and local conditions to make the most of your trip.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Creating your perfect trip is as easy as 1-2-3
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Tell Us Your Dreams</h3>
              <p className="text-muted-foreground">
                Share your destination, dates, budget, and preferences. The more details, 
                the better we can personalize your experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. AI Creates Your Plan</h3>
              <p className="text-muted-foreground">
                Our AI analyzes millions of data points to craft a personalized itinerary 
                with activities, restaurants, and experiences you'll love.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Book & Enjoy</h3>
              <p className="text-muted-foreground">
                Review your itinerary, make adjustments, and book directly through our 
                platform. Then pack your bags and enjoy your adventure!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 text-center text-white relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="relative container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered amazing experiences 
            with our AI-powered trip planning platform.
          </p>
          
          {user ? (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              Plan Your Next Trip <Plane className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="gap-2"
            >
              Start Planning Today <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
