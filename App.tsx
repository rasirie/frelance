

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './services/supabase';
import { Header } from './components/Header';
import { JobSearchForm } from './components/JobSearchForm';
import { JobList } from './components/JobList';
import { findJobs } from './services/geminiService';
import type { Job, SearchCriteria, SortOption, SubscriptionState, UnlockedFeature, UserProfile, Project, ForumThread, View, SubscriptionTier, Activity, SearchHistoryItem, DocumentType } from './types';
import { SortControl } from './components/SortControl';
import { ProTips } from './components/ProTips';
import { Pagination } from './components/Pagination';
import { getSubscriptionState, subscribeUser, decrementSearchCount, FREE_SEARCH_LIMIT } from './services/subscriptionService';
import { getProfile, saveProfile, getDefaultProfile } from './services/profileService';
import { getProjects, addProject as addProjectToDb, updateProject as updateProjectInDb, deleteProject as deleteProjectFromDb } from './services/projectService';
import { getThreads, addThread as addThreadToDb, addReply as addReplyToDb } from './services/forumService';
import { ProfilePage } from './components/ProfilePage';
import { ProjectsPage } from './components/ProjectsPage';
import { CommunityPage } from './components/CommunityPage';
import { InsightsPage } from './components/InsightsPage';
import { PricingPage } from './components/PricingPage';
import { getTheme, setTheme as saveTheme } from './services/themeService';
import { DashboardPage } from './components/DashboardPage';
import { AppGuide } from './components/AppGuide';
import { Search } from 'lucide-react';
import { getActivities, addActivity } from './services/activityService';
import { getSearchHistory, addSearchToHistory } from './services/searchHistoryService';
import { Spinner } from './components/Spinner';
import { AuthModal } from './components/AuthModal';
import { SupabaseSetupInstructions } from './components/SupabaseSetupInstructions';
import { Footer } from './components/Footer';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { AcceptableUsePolicyPage } from './components/AcceptableUsePolicyPage';
import { TestimonialsSection } from './components/TestimonialsSection';
import { getAveragePay } from './utils/formatters';
import { ContactPage } from './components/ContactPage';
import { FAQPage } from './components/FAQPage';
import { RefundPolicyPage } from './components/RefundPolicyPage';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [subscription, setSubscription] = useState<SubscriptionState>( { status: 'free', searchesLeft: FREE_SEARCH_LIMIT });
  const [userProfile, setUserProfile] = useState<UserProfile>(getDefaultProfile());
  const [currentView, setCurrentView] = useState<View>('search');
  const [projects, setProjects] = useState<Project[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [theme, setTheme] = useState(getTheme());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [authModal, setAuthModal] = useState({ isOpen: false, view: 'signIn' as 'signIn' | 'signUp' });
  const [dbError, setDbError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  useEffect(() => {
    if (!supabase) {
      setDbError("Supabase client could not be initialized. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
      setAppLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
        const userId = session?.user?.id;
        if (userId) {
            setAppLoading(true);
            setDbError(null);
            try {
                const [profileData, projectsData, threadsData, subData, activityData, historyData] = await Promise.all([
                    getProfile(userId),
                    getProjects(userId),
                    getThreads(),
                    getSubscriptionState(userId),
                    getActivities(userId),
                    getSearchHistory(userId),
                ]);
                
                setUserProfile(profileData);
                setProjects(projectsData);
                setThreads(threadsData);
                setSubscription(subData);
                setActivities(activityData);
                setSearchHistory(historyData);

                setCurrentView(profileData.name ? 'dashboard' : 'profile');
            } catch (err: any) {
                console.error("Error loading initial data:", err);
                if (typeof err.message === 'string') {
                    setDbError(err.message);
                } else {
                    setDbError("An unknown error occurred during application startup.");
                }
            } finally {
                setAppLoading(false);
            }
        } else {
            // Reset state for logged out user
            setUserProfile(getDefaultProfile());
            setProjects([]);
            setSubscription({ status: 'free', searchesLeft: FREE_SEARCH_LIMIT });
            setActivities([]);
            setSearchHistory([]);
            setCurrentView('search');
            setAppLoading(false);
        }
    };
    loadData();
  }, [session]);


  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };
  
  const logActivity = async (activity: Omit<Activity, 'id' | 'timestamp' | 'user_id'>) => {
    const userId = session?.user?.id;
    if (!userId) return;
    await addActivity(userId, activity);
    setActivities(await getActivities(userId));
  };

  const unlockedFeature = useMemo((): UnlockedFeature => {
    if (subscription.status !== 'free') return null;
    const currentSearchNumber = FREE_SEARCH_LIMIT - subscription.searchesLeft + 1;
    if (currentSearchNumber === 1) return 'payEstimate';
    if (currentSearchNumber === 2) return 'redFlags';
    if (currentSearchNumber === 3) return 'skillAnalysis';
    return null;
  }, [subscription.status, subscription.searchesLeft]);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    const userId = session?.user?.id;
    if (!userId) {
        setAuthModal({ isOpen: true, view: 'signUp' });
        return;
    }
    
    setIsCheckingOut(true);
    // Simulate API call to backend and redirection to Stripe
    setTimeout(async () => {
        try {
            const newSubscription = await subscribeUser(userId, tier);
            setSubscription(newSubscription);
            setCurrentView('dashboard');
        } catch(err) {
            console.error("Subscription failed", err);
            // In a real app, you'd show an error to the user here.
        } finally {
            setIsCheckingOut(false);
        }
    }, 2500);
  };
  
  const handleProfileSave = async (updatedProfile: UserProfile) => {
    const userId = session?.user?.id;
    if(!userId) return;
    const wasProfileJustCompleted = !userProfile.name && updatedProfile.name;
    const savedProfile = await saveProfile(userId, updatedProfile);
    setUserProfile(savedProfile);
    if (wasProfileJustCompleted) {
      setCurrentView('dashboard');
    }
  };
  
  const handleAddProject = async (job: Job) => {
    const userId = session?.user?.id;
    if (!userId) return;
    await addProjectToDb(userId, job);
    setProjects(await getProjects(userId));
    logActivity({type: 'project', description: `Added "${job.title}" to your pipeline.`});
    setCurrentView('projects');
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    const userId = session?.user?.id;
    if (!userId) return;
    const oldProject = projects.find(p => p.projectId === updatedProject.projectId);
    if (oldProject?.status === 'active' && updatedProject.status === 'completed') {
        logActivity({ type: 'project', description: `Completed project: "${updatedProject.title}".`});
    }
    await updateProjectInDb(updatedProject);
    setProjects(await getProjects(userId));
  };

  const handleDeleteProject = async (projectId: string) => {
    const userId = session?.user?.id;
    if (!userId) return;
    const projectToDelete = projects.find(p => p.projectId === projectId);
    if (projectToDelete) {
        logActivity({ type: 'project', description: `Deleted project: "${projectToDelete.title}".`});
    }
    await deleteProjectFromDb(projectId);
    setProjects(await getProjects(userId));
  };

  const handleAddThread = async (title: string, content: string, category: string) => {
    const userId = session?.user?.id;
    if(!userId) return;
    await addThreadToDb(userId, { title, content, category, author: userProfile.name || 'Anonymous' });
    setThreads(await getThreads());
  };

  const handleAddReply = async (threadId: string, content: string) => {
    const userId = session?.user?.id;
    if(!userId) return;
    await addReplyToDb(userId, { threadId, content, author: userProfile.name || 'Anonymous' });
    setThreads(await getThreads());
  };

  const handleSearch = useCallback(async (criteria: SearchCriteria) => {
    const userId = session?.user?.id;
    if (subscription.status === 'free' && subscription.searchesLeft <= 0) {
      setError("You've reached your search limit. Upgrade for unlimited access and deeper insights.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobs(null);
    setSelectedJob(null);
    setSortBy('match');
    setCurrentPage(1);
    try {
      if (userId && subscription.status === 'free') {
        const newSub = await decrementSearchCount(userId);
        setSubscription(newSub);
      }
      if(userId) {
        await addSearchToHistory(userId, criteria);
        setSearchHistory(await getSearchHistory(userId));
      }
      logActivity({ type: 'search', description: `Searched for: "${criteria.query || criteria.subcategory}"`});
      const foundJobs = await findJobs(criteria, userProfile);
      setJobs(foundJobs);
    } catch (e) {
      console.error(e);
      setError('The AI is working hard! It seems overloaded right now. Please try your search again in a moment.');
    } finally {
      setIsLoading(false);
    }
  }, [subscription, userProfile, session]);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(prevJob => (prevJob?.id === job.id ? null : job));
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedJob(null); // Reset selected job when changing pages
  };
  
  const handleDocumentGenerated = (docType: DocumentType, jobTitle: string) => {
    logActivity({type: 'document', description: `Generated a ${docType} for "${jobTitle}".`});
  };

  const sortedJobs = useMemo(() => {
    if (!jobs) return null;
    const jobsCopy = [...jobs];
    switch (sortBy) {
        case 'match':
             return jobsCopy.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
        case 'date':
            return jobsCopy.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        case 'pay-desc':
            return jobsCopy.sort((a, b) => getAveragePay(b.payRange) - getAveragePay(a.payRange));
        case 'relevance':
        default:
            return jobs;
    }
  }, [jobs, sortBy]);
  
  const JOBS_PER_PAGE = 10;
  
  const totalPages = useMemo(() => {
    if (!sortedJobs) return 0;
    return Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
  }, [sortedJobs]);

  const jobsToShow = useMemo(() => {
    if (!sortedJobs) return null;
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return sortedJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [sortedJobs, currentPage]);

  const existingProjectIds = useMemo(() => new Set(projects.map(p => p.id)), [projects]);

  const dashboardData = useMemo(() => {
      const activeProjects = projects.filter(p => p.status === 'active');
      const completedProjects = projects.filter(p => p.status === 'completed');
      const totalPotentialEarnings = activeProjects.reduce((sum, p) => sum + p.projectValue, 0);
      const successRate = projects.length > 0 ? (completedProjects.length / projects.length) * 100 : 0;

      return {
          applications: activeProjects.length,
          earnings: totalPotentialEarnings,
          successRate: Math.round(successRate),
      };
  }, [projects]);
  
  const renderView = () => {
    if (appLoading) {
        return <div className="h-[calc(100vh-200px)] flex items-center justify-center"><Spinner /></div>;
    }
    if (dbError) {
        return <SupabaseSetupInstructions error={dbError} />;
    }
    switch(currentView) {
      case 'dashboard':
        return <DashboardPage userProfile={userProfile} onNavigate={setCurrentView} dashboardData={dashboardData} activities={activities} />;
      case 'profile':
        return <ProfilePage profile={userProfile} subscription={subscription} onSave={handleProfileSave} onNavigateBack={() => setCurrentView(userProfile.name ? 'dashboard' : 'search')} onNavigate={setCurrentView} />;
      case 'projects':
        return <ProjectsPage projects={projects} subscription={subscription} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject} onNavigateBack={() => setCurrentView('dashboard')} />;
      case 'community':
        return <CommunityPage threads={threads} onAddThread={handleAddThread} onAddReply={handleAddReply} onNavigateBack={() => setCurrentView('dashboard')} userName={userProfile.name} />;
      case 'insights':
        return <InsightsPage subscription={subscription} onSubscribe={() => setCurrentView('pricing')} onNavigateBack={() => setCurrentView('dashboard')} userProfile={userProfile} />;
      case 'pricing':
        return <PricingPage onSubscribe={handleSubscribe} />;
      case 'guide':
        return <AppGuide />;
      case 'contact':
        return <ContactPage onNavigateBack={() => setCurrentView(session ? 'dashboard' : 'search')} />;
      case 'privacy':
        return <PrivacyPolicyPage onNavigateBack={() => setCurrentView(session ? 'dashboard' : 'search')} />;
      case 'terms':
        return <TermsOfServicePage onNavigateBack={() => setCurrentView(session ? 'dashboard' : 'search')} />;
      case 'aup':
        return <AcceptableUsePolicyPage onNavigateBack={() => setCurrentView(session ? 'dashboard' : 'search')} />;
      case 'faq':
        return <FAQPage onNavigateBack={() => setCurrentView(session ? 'dashboard' : 'search')} />;
      case 'refund':
        return <RefundPolicyPage onNavigateBack={() => setCurrentView(session ? 'dashboard' : 'search')} />;
      case 'search':
      default:
        return (
          <>
            <section id="job-search" className="mb-12">
              <h2 className="text-4xl font-extrabold text-center mb-2 text-text-primary">Stop Searching. Start Winning.</h2>
              <p className="text-center text-text-secondary mb-8 max-w-3xl mx-auto">
                Frelance finds the signal in the noise. Pro members don't just find jobs—they unlock deep analysis, win proposals, and build their business faster.
              </p>
              <JobSearchForm onSearch={handleSearch} isLoading={isLoading} subscription={subscription} searchHistory={searchHistory} />
            </section>

            {!jobs && !isLoading && !error && (
              <>
                <ProTips />
                <PricingPage onSubscribe={handleSubscribe} />
                <TestimonialsSection />
              </>
            )}

            {isLoading && (
              <div className="flex flex-col justify-center items-center my-16 text-text-secondary animate-fade-in">
                  <div className="flex items-center">
                    <Search size={24} className="animate-search-wiggle mr-3 text-primary" />
                    <span className="text-lg font-semibold text-text-primary">Curating...</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">It might take a while</p>
              </div>
            )}
            
            {error && (
              <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-xl">
                <p className="font-bold">Just a moment...</p>
                <p>{error}</p>
              </div>
            )}

            {jobsToShow && jobsToShow.length > 0 && (
              <section id="job-listings" className="transition-opacity duration-500 ease-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-extrabold text-text-primary">Your AI-Curated Opportunity Feed</h3>
                    <SortControl value={sortBy} onChange={setSortBy} />
                </div>
                <JobList 
                    jobs={jobsToShow} 
                    onSelectJob={handleSelectJob} 
                    selectedJob={selectedJob} 
                    subscription={subscription}
                    onSubscribe={() => setCurrentView('pricing')}
                    unlockedFeature={unlockedFeature}
                    userProfileData={userProfile}
                    onAddProject={handleAddProject}
                    existingProjectIds={existingProjectIds}
                    isLocked={subscription.status === 'free' && currentPage > 1}
                    onNavigate={setCurrentView}
                    onDocumentGenerated={handleDocumentGenerated}
                />
                {totalPages > 1 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
              </section>
            )}
            
            {jobs && jobs.length === 0 && !isLoading && (
                <div className="text-center text-text-secondary bg-card p-8 rounded-xl">
                    <p className="font-bold text-lg">The AI came up empty-handed.</p>
                    <p>That's rare! Try broadening your search terms or filters for better results.</p>
                </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
       {isCheckingOut && (
            <div className="fixed inset-0 bg-black/70 z-[100] flex flex-col items-center justify-center animate-fade-in">
                <Spinner />
                <p className="text-white mt-4 font-semibold text-lg">Redirecting to secure checkout...</p>
                <p className="text-white/70 text-sm">Please wait, do not refresh the page.</p>
            </div>
        )}
      <Header 
        session={session}
        userProfile={userProfile}
        onNavigate={setCurrentView} 
        theme={theme} 
        onToggleTheme={handleToggleTheme}
        onGetStartedClick={() => setAuthModal({ isOpen: true, view: 'signUp' })}
        onSignOut={handleSignOut}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
        {renderView()}
      </main>
      <Footer onNavigate={setCurrentView} />
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        initialView={authModal.view}
      />
    </div>
  );
};

export default App;