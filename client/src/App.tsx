import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/HomePage';
import MoviePage from '@/pages/MoviePage';
import TVShowPage from '@/pages/TVShowPage';
import WatchPage from '@/pages/WatchPage';
import CategoryPage from '@/pages/CategoryPage';

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/movie/:id" component={MoviePage} />
      <Route path="/movies" component={() => <CategoryPage />} />
      <Route path="/tv/:id" component={TVShowPage} />
      <Route path="/tv" component={() => <CategoryPage />} />
      <Route path="/watch/movie/:id" component={WatchPage} />
      <Route path="/watch/tv/:id/:season/:episode" component={WatchPage} />
      <Route path="/categories/:mediaType?" component={CategoryPage} />
      <Route path="/trending" component={() => <CategoryPage />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
