import { useState, useEffect } from 'react';
import { Agent } from '../types';
import { Brain, TrendingUp, Users, Search, Target } from 'lucide-react';

const initialAgents: Agent[] = [
  {
    id: 'trend-analyst',
    name: 'Trend Analyst',
    description: 'Scans news, blogs, and research reports for emerging market trends and industry shifts.',
    icon: TrendingUp,
    status: 'active',
    lastActivity: '5 min ago',
    insights: 12,
    color: 'bg-blue-600',
    isEnabled: true,
    processingTask: 'Analyzing Q1 2025 SaaS trends'
  },
  {
    id: 'competitor-scout',
    name: 'Competitor Scout',
    description: 'Tracks competitor features, updates, product launches, and strategic moves.',
    icon: Search,
    status: 'processing',
    lastActivity: '12 min ago',
    insights: 8,
    color: 'bg-red-600',
    isEnabled: true,
    processingTask: 'Monitoring Slack feature updates'
  },
  {
    id: 'sentiment-analyst',
    name: 'Sentiment Analyst',
    description: 'Analyzes customer reviews, social media, and forums for feedback and sentiment.',
    icon: Users,
    status: 'active',
    lastActivity: '3 min ago',
    insights: 15,
    color: 'bg-green-600',
    isEnabled: true
  },
  {
    id: 'strategic-synthesizer',
    name: 'Strategic Synthesizer',
    description: 'Summarizes key insights and generates actionable recommendations for the PM team.',
    icon: Brain,
    status: 'idle',
    lastActivity: '1 hour ago',
    insights: 6,
    color: 'bg-purple-600',
    isEnabled: true
  },
  {
    id: 'market-mapper',
    name: 'Market Mapper',
    description: 'Structures competitive landscape and market size estimates using external data.',
    icon: Target,
    status: 'processing',
    lastActivity: '18 min ago',
    insights: 9,
    color: 'bg-orange-600',
    isEnabled: true,
    processingTask: 'Building competitive landscape map'
  }
];

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [configurationModal, setConfigurationModal] = useState<{ isOpen: boolean; agentId: string | null }>({
    isOpen: false,
    agentId: null
  });

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            isEnabled: !agent.isEnabled, 
            status: agent.isEnabled ? 'idle' : 'active',
            lastActivity: 'Just now'
          }
        : agent
    ));
  };

  const updateAgentStatus = (agentId: string, status: Agent['status'], processingTask?: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status, processingTask, lastActivity: 'Just now' }
        : agent
    ));
  };

  const configureAgent = (agentId: string, config: Partial<Agent>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, ...config, lastActivity: 'Just now' }
        : agent
    ));
  };

  const openConfiguration = (agentId: string) => {
    setConfigurationModal({ isOpen: true, agentId });
  };

  const closeConfiguration = () => {
    setConfigurationModal({ isOpen: false, agentId: null });
  };

  const configureAllAgents = () => {
    const enabledAgents = agents.filter(a => a.isEnabled);
    enabledAgents.forEach(agent => {
      updateAgentStatus(agent.id, 'processing', `Optimizing ${agent.name.toLowerCase()} parameters`);
    });

    setTimeout(() => {
      enabledAgents.forEach(agent => {
        updateAgentStatus(agent.id, 'active');
      });
    }, 3000);
  };

  // Simulate realistic agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.isEnabled && Math.random() < 0.15) {
          const activities = [
            'Scanning latest industry reports',
            'Processing competitor updates',
            'Analyzing customer feedback',
            'Generating market insights',
            'Updating trend analysis'
          ];
          
          const statuses: Agent['status'][] = ['active', 'processing', 'idle'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          
          return {
            ...agent,
            status: newStatus,
            lastActivity: 'Just now',
            insights: agent.insights + (newStatus === 'active' ? Math.floor(Math.random() * 2) : 0),
            processingTask: newStatus === 'processing' ? randomActivity : undefined
          };
        }
        return agent;
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return { 
    agents, 
    toggleAgent, 
    updateAgentStatus, 
    configureAgent,
    configurationModal,
    openConfiguration,
    closeConfiguration,
    configureAllAgents
  };
}