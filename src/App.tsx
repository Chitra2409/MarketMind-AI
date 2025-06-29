import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, Search, Target, Zap, Settings, User, CreditCard } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { AuthWrapper } from './components/AuthWrapper';
import { AgentCard } from './components/AgentCard';
import { QueryInterface } from './components/QueryInterface';
import { InsightCard } from './components/InsightCard';
import { ReportSection } from './components/ReportSection';
import { StatsChart } from './components/StatsChart';
import { NotificationCenter } from './components/NotificationCenter';
import { AgentConfigurationModal } from './components/AgentConfigurationModal';
import { UserProfile } from './components/UserProfile';
import { SettingsModal } from './components/SettingsModal';
import { StripePayment } from './components/StripePayment';
import { useAgents } from './hooks/useAgents';
import { useInsights } from './hooks/useInsights';
import { useReports } from './hooks/useReports';
import { useQueryHistory } from './hooks/useQueryHistory';
import { useSettings } from './hooks/useSettings';

function App() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  
  const { settings } = useSettings();
  const { addQuery, completeQuery, failQuery } = useQueryHistory();
  
  const { 
    agents, 
    toggleAgent, 
    updateAgentStatus, 
    configureAgent,
    configurationModal,
    openConfiguration,
    closeConfiguration,
    configureAllAgents
  } = useAgents();
  
  const { 
    insights, 
    allInsights, 
    filters, 
    addInsight, 
    updateFilters, 
    deleteInsight,
    expandedInsight,
    expandInsight,
    generateInsightFromQuery
  } = useInsights();
  
  const { 
    reports, 
    generateReport, 
    downloadReport, 
    deleteReport,
    previewReport,
    previewReportContent,
    closePreview,
    getReportContent
  } = useReports();

  // Apply theme changes to document root
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const handleQuery = (query: string) => {
    // Find enabled agents and select one for processing
    const processingAgents = agents.filter(a => a.isEnabled);
    if (processingAgents.length === 0) {
      alert('Please enable at least one agent to process your query.');
      return;
    }

    const randomAgent = processingAgents[Math.floor(Math.random() * processingAgents.length)];
    
    // Add query to history
    const queryId = addQuery(query, randomAgent.name);
    const startTime = Date.now();
    
    // Update agent status to processing
    updateAgentStatus(randomAgent.id, 'processing', `Analyzing: ${query.slice(0, 30)}...`);

    // Generate insight after processing delay
    setTimeout(() => {
      const executionTime = Date.now() - startTime;
      generateInsightFromQuery(query, randomAgent.name);
      updateAgentStatus(randomAgent.id, 'active');
      
      // Complete query in history
      const insightCount = Math.floor(Math.random() * 3) + 1;
      completeQuery(queryId, [], insightCount, executionTime);
    }, 2000);
  };

  const handleGenerateReport = (title: string, type: string) => {
    // Use recent insights to inform report generation
    const recentInsights = allInsights.slice(0, 10);
    const query = `Generate comprehensive ${type.toLowerCase()} report: ${title}`;
    
    generateReport(title, type, query);
  };

  const handleCreateReportFromInsight = (insight: any) => {
    const reportTitle = `${insight.type.charAt(0).toUpperCase() + insight.type.slice(1)} Report: ${insight.title}`;
    const reportType = insight.type === 'trend' ? 'Market Analysis' : 
                     insight.type === 'alert' ? 'Competitive Intelligence' :
                     insight.type === 'success' ? 'Sentiment Analysis' :
                     'Strategic Analysis';
    
    const query = `Generate detailed report based on insight: ${insight.title}. ${insight.summary}`;
    
    generateReport(reportTitle, reportType, query);
    
    // Switch to reports tab to show the new report
    setActiveTab('reports');
  };

  const handleAgentConfigure = (agentId: string) => {
    openConfiguration(agentId);
  };

  const handleRerunQuery = (query: string) => {
    handleQuery(query);
  };

  const activeAgents = agents.filter(a => a.isEnabled && a.status === 'active').length;
  const totalInsightsToday = allInsights.length;
  const avgConfidence = Math.round(
    allInsights.reduce((sum, insight) => sum + insight.confidence, 0) / allInsights.length || 0
  );

  return (
    <AuthWrapper>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${settings.compactMode ? 'compact-mode' : ''}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">MarketMind AI</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Multi-Agent Research Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <svg 
                    width="32" 
                    height="33" 
                    viewBox="0 0 109 113" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                      fill="url(#paint0_linear)" />
                    <path
                      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                      fill="url(#paint1_linear)" fillOpacity="0.2" />
                    <path
                      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
                      fill="#000000" />
                    <defs>
                      <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#000000" />
                        <stop offset="1" stopColor="#000000" />
                      </linearGradient>
                      <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806"
                        gradientUnits="userSpaceOnUse">
                        <stop stopColor="#000000" />
                        <stop offset="1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </a>
                <a 
                  href="https://netlify.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <svg 
                    width="32" 
                    height="28" 
                    viewBox="0 0 128 113" 
                    className="text-gray-600 dark:text-gray-400"
                    fill="currentColor"
                  >
                    <g>
                      <g>
                        <g>
                          <path d="M34.6,94.1h-1.2l-6-6v-1.2l9.2-9.2H43l0.9,0.9v6.4L34.6,94.1z" />
                          <path d="M27.4,25.8v-1.2l6-6h1.2l9.2,9.2v6.4L43,35h-6.4L27.4,25.8z" />
                          <path d="M80.5,74.6h-8.8l-0.7-0.7V53.3c0-3.7-1.4-6.5-5.8-6.6c-2.3-0.1-4.9,0-7.6,0.1l-0.4,0.4v26.6l-0.7,0.7h-8.8
                            l-0.7-0.7V38.8l0.7-0.7h19.8c7.7,0,13.9,6.2,13.9,13.9v21.9L80.5,74.6z" />
                          <path d="M35.8,61.4H0.7L0,60.7v-8.8l0.7-0.7h35.1l0.7,0.7v8.8L35.8,61.4z" />
                          <path d="M127.3,61.4H92.2l-0.7-0.7v-8.8l0.7-0.7h35.1l0.7,0.7v8.8L127.3,61.4z" />
                          <path d="M58.9,27.1V0.7L59.7,0h8.8l0.7,0.7v26.3l-0.7,0.7h-8.8L58.9,27.1z" />
                          <path d="M58.9,111.9V85.6l0.7-0.7h8.8l0.7,0.7v26.3l-0.7,0.7h-8.8L58.9,111.9z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </a>
                <a 
                  href="https://bolt.new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <img 
                    src="/black_circle_360x360.png" 
                    alt="Bolt.new" 
                    className="w-8 h-8 rounded-full"
                  />
                </a>
                <NotificationCenter />
                <button 
                  onClick={() => setShowPayments(true)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title="Billing & Payments"
                >
                  <CreditCard className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowUserProfile(true)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  title="User Profile"
                >
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'agents', label: 'Agents' },
                { id: 'insights', label: 'Insights' },
                { id: 'reports', label: 'Reports' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Agents</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeAgents}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Insights Today</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalInsightsToday}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Data Sources</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">128</p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Search className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgConfidence}%</p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <StatsChart />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <QueryInterface onQuery={handleQuery} />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Insights</h3>
                  {insights.slice(0, 3).map((insight) => (
                    <InsightCard 
                      key={insight.id} 
                      {...insight} 
                      onDelete={deleteInsight}
                      onExpand={expandInsight}
                      isExpanded={expandedInsight === insight.id}
                      onCreateReport={handleCreateReportFromInsight}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Research Agents</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {activeAgents} of {agents.length} agents active
                  </div>
                  <button 
                    onClick={configureAllAgents}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200 font-medium"
                  >
                    Configure All Agents
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    {...agent} 
                    onToggle={toggleAgent}
                    onConfigure={handleAgentConfigure}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Insights</h2>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search insights..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <select 
                    value={filters.type}
                    onChange={(e) => updateFilters({ type: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Types</option>
                    <option value="trend">Trends</option>
                    <option value="alert">Alerts</option>
                    <option value="success">Success</option>
                    <option value="warning">Warnings</option>
                  </select>
                  <select 
                    value={filters.agent}
                    onChange={(e) => updateFilters({ agent: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Agents</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.name}>{agent.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                {insights.map((insight) => (
                  <InsightCard 
                    key={insight.id} 
                    {...insight} 
                    onDelete={deleteInsight}
                    onExpand={expandInsight}
                    isExpanded={expandedInsight === insight.id}
                    onCreateReport={handleCreateReportFromInsight}
                  />
                ))}
                {insights.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p>No insights match your current filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Research Reports</h2>
              </div>
              <ReportSection 
                reports={reports}
                onGenerate={handleGenerateReport}
                onDownload={downloadReport}
                onDelete={deleteReport}
                onPreview={previewReportContent}
                previewReport={previewReport}
                onClosePreview={closePreview}
                getReportContent={getReportContent}
              />
            </div>
          )}
        </main>

        {/* Modals */}
        <AgentConfigurationModal
          agent={configurationModal.agentId ? agents.find(a => a.id === configurationModal.agentId) || null : null}
          isOpen={configurationModal.isOpen}
          onClose={closeConfiguration}
          onSave={configureAgent}
        />

        <UserProfile
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          onRerunQuery={handleRerunQuery}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <StripePayment
          isOpen={showPayments}
          onClose={() => setShowPayments(false)}
        />
      </div>
    </AuthWrapper>
  );
}

export default App;