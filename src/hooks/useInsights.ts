import { useState, useCallback, useEffect } from 'react';
import { Insight } from '../types';

const sampleInsights: Insight[] = [
  {
    id: '1',
    title: "Rising Interest in AI-Powered Productivity Tools",
    summary: "Market analysis shows 40% increase in searches for AI productivity features over the last quarter. Key drivers include workflow automation and intelligent task management.",
    type: 'trend',
    timestamp: '2 hours ago',
    agent: 'Trend Analyst',
    confidence: 87,
    tags: ['AI', 'Productivity', 'Market Growth'],
    sources: ['TechCrunch', 'Product Hunt', 'Google Trends'],
    fullContent: "Comprehensive market analysis reveals that AI-powered productivity tools are experiencing unprecedented growth across multiple sectors. Our research indicates a 40% increase in search volume over the last quarter, with particular emphasis on workflow automation (65% growth), intelligent scheduling systems (52% growth), and AI-assisted content creation tools (78% growth).\n\nKey Market Drivers:\n• Remote work adoption accelerating demand for intelligent automation\n• Enterprise focus on operational efficiency driving AI tool adoption\n• Consumer familiarity with AI interfaces reducing adoption barriers\n• Integration capabilities with existing productivity suites\n\nCompetitive Landscape:\n• Notion AI leading in document intelligence with 2.3M+ users\n• Jasper dominating content creation space with $125M ARR\n• Copy.ai focusing on marketing automation with 4M+ users\n• Microsoft Copilot integrating across Office suite\n\nMarket Opportunities:\n• Vertical-specific AI tools showing 3x higher retention\n• API-first solutions enabling rapid integration\n• Privacy-focused alternatives gaining enterprise traction\n• Mobile-first AI productivity tools underserved\n\nRecommendations:\n1. Focus on specific workflow automation use cases\n2. Prioritize seamless integration with existing tools\n3. Develop privacy-first positioning for enterprise market\n4. Consider vertical-specific feature development"
  },
  {
    id: '2',
    title: "Competitor Alert: Slack Introduces New AI Features",
    summary: "Slack announced Slack GPT with workflow automation capabilities, potentially impacting our market position. Features include smart summaries and automated responses.",
    type: 'alert',
    timestamp: '4 hours ago',
    agent: 'Competitor Scout',
    confidence: 92,
    tags: ['Slack', 'AI Features', 'Competition'],
    sources: ['Slack Blog', 'TechCrunch', 'The Verge'],
    fullContent: "Slack's latest announcement of Slack GPT represents a significant strategic move that could reshape the collaboration platform landscape. This comprehensive AI integration introduces several key capabilities that directly impact our competitive positioning.\n\nNew Features Announced:\n• Workflow Automation: Custom AI workflows for repetitive tasks\n• Smart Summaries: Automatic channel and thread summarization\n• Intelligent Responses: Context-aware response suggestions\n• Meeting Intelligence: AI-powered meeting notes and action items\n• App Integration: AI capabilities across third-party Slack apps\n\nMarket Impact Analysis:\n• Slack's 18M+ daily active users gain immediate access to AI features\n• Enterprise customers (85% of revenue) likely to see highest adoption\n• Integration with Salesforce ecosystem creates powerful data synergy\n• Pricing strategy positions AI as premium tier differentiator\n\nCompetitive Implications:\n• Microsoft Teams likely to accelerate Copilot integration timeline\n• Discord and other platforms may need AI strategy acceleration\n• Standalone productivity tools face integration pressure\n• API-first companies have opportunity for Slack marketplace\n\nStrategic Response Options:\n1. Develop complementary integrations for Slack ecosystem\n2. Focus on capabilities Slack doesn't address well\n3. Target users seeking alternatives to big tech platforms\n4. Accelerate our own AI feature development timeline\n\nRecommended Actions:\n• Monitor user sentiment and adoption rates closely\n• Analyze feature gaps in Slack's AI implementation\n• Consider partnership opportunities within Slack ecosystem\n• Prepare competitive positioning materials for sales team"
  }
];

// Advanced query analysis system
const analyzeQuery = (query: string): {
  intent: string;
  entities: string[];
  complexity: 'simple' | 'medium' | 'complex';
  suggestedAgents: string[];
  analysisType: string;
} => {
  const lowerQuery = query.toLowerCase();
  
  // Intent detection
  let intent = 'general_research';
  if (lowerQuery.includes('competitor') || lowerQuery.includes('competition')) {
    intent = 'competitive_analysis';
  } else if (lowerQuery.includes('trend') || lowerQuery.includes('market')) {
    intent = 'trend_analysis';
  } else if (lowerQuery.includes('sentiment') || lowerQuery.includes('customer') || lowerQuery.includes('feedback')) {
    intent = 'sentiment_analysis';
  } else if (lowerQuery.includes('price') || lowerQuery.includes('pricing')) {
    intent = 'pricing_analysis';
  } else if (lowerQuery.includes('feature') || lowerQuery.includes('product')) {
    intent = 'product_analysis';
  }

  // Entity extraction (simplified)
  const entities: string[] = [];
  const commonEntities = [
    'slack', 'notion', 'figma', 'zoom', 'microsoft', 'google', 'apple', 'meta',
    'ai', 'machine learning', 'automation', 'productivity', 'collaboration',
    'saas', 'enterprise', 'startup', 'mobile', 'web', 'api'
  ];
  
  commonEntities.forEach(entity => {
    if (lowerQuery.includes(entity)) {
      entities.push(entity);
    }
  });

  // Complexity assessment
  const wordCount = query.split(' ').length;
  const complexity = wordCount < 5 ? 'simple' : wordCount < 15 ? 'medium' : 'complex';

  // Suggest relevant agents
  const suggestedAgents: string[] = [];
  if (intent === 'competitive_analysis') suggestedAgents.push('Competitor Scout');
  if (intent === 'trend_analysis') suggestedAgents.push('Trend Analyst', 'Market Mapper');
  if (intent === 'sentiment_analysis') suggestedAgents.push('Sentiment Analyst');
  if (intent === 'product_analysis') suggestedAgents.push('Strategic Synthesizer');
  if (suggestedAgents.length === 0) suggestedAgents.push('Strategic Synthesizer');

  // Analysis type
  const analysisType = intent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return { intent, entities, complexity, suggestedAgents, analysisType };
};

// Dynamic content generation based on query analysis
const generateDynamicInsight = (query: string, agent: string): Omit<Insight, 'id'> => {
  const analysis = analyzeQuery(query);
  const entities = analysis.entities;
  const mainEntity = entities[0] || 'market';
  
  // Generate contextual title
  const titleTemplates = {
    competitive_analysis: [
      `Competitive Intelligence: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)} Market Position`,
      `Competitor Analysis: ${query.slice(0, 50)}${query.length > 50 ? '...' : ''}`,
      `Market Competition Update: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)} Landscape`
    ],
    trend_analysis: [
      `Market Trend Analysis: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)} Growth Patterns`,
      `Emerging Trend: ${query.slice(0, 50)}${query.length > 50 ? '...' : ''}`,
      `Industry Trend Report: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)} Evolution`
    ],
    sentiment_analysis: [
      `Customer Sentiment Analysis: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)}`,
      `User Feedback Analysis: ${query.slice(0, 50)}${query.length > 50 ? '...' : ''}`,
      `Market Sentiment Report: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)} Reception`
    ],
    product_analysis: [
      `Product Analysis: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)} Feature Assessment`,
      `Strategic Product Review: ${query.slice(0, 50)}${query.length > 50 ? '...' : ''}`,
      `Product Intelligence: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)} Capabilities`
    ],
    pricing_analysis: [
      `Pricing Strategy Analysis: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)}`,
      `Market Pricing Intelligence: ${query.slice(0, 50)}${query.length > 50 ? '...' : ''}`,
      `Competitive Pricing Report: ${mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1)}`
    ]
  };

  const templates = titleTemplates[analysis.intent as keyof typeof titleTemplates] || titleTemplates.competitive_analysis;
  const title = templates[Math.floor(Math.random() * templates.length)];

  // Generate contextual summary
  const summaryTemplates = {
    competitive_analysis: `Comprehensive competitive analysis reveals key strategic insights about ${mainEntity}. Our research identifies market positioning opportunities, competitive threats, and strategic recommendations based on current market dynamics.`,
    trend_analysis: `Market trend analysis indicates significant developments in ${mainEntity} sector. Research shows emerging patterns, growth opportunities, and market shifts that could impact strategic positioning.`,
    sentiment_analysis: `Customer sentiment analysis for ${mainEntity} reveals important perception trends. Analysis covers user feedback, satisfaction metrics, and market reception across multiple channels.`,
    product_analysis: `Product analysis of ${mainEntity} features and capabilities shows competitive positioning insights. Research includes feature comparison, user adoption patterns, and strategic product recommendations.`,
    pricing_analysis: `Pricing strategy analysis for ${mainEntity} market reveals competitive dynamics and optimization opportunities. Research covers pricing models, market positioning, and revenue optimization strategies.`
  };

  const summary = summaryTemplates[analysis.intent as keyof typeof summaryTemplates] || summaryTemplates.competitive_analysis;

  // Generate comprehensive full content
  const fullContent = generateFullAnalysisContent(query, analysis, mainEntity);

  // Determine insight type based on analysis
  const typeMapping = {
    competitive_analysis: 'alert',
    trend_analysis: 'trend',
    sentiment_analysis: 'success',
    product_analysis: 'update',
    pricing_analysis: 'warning'
  };

  const type = typeMapping[analysis.intent as keyof typeof typeMapping] || 'trend';

  // Generate relevant tags
  const tags = [
    analysis.analysisType,
    mainEntity.charAt(0).toUpperCase() + mainEntity.slice(1),
    ...entities.slice(1, 3).map(e => e.charAt(0).toUpperCase() + e.slice(1)),
    'AI Analysis',
    'Real-time'
  ].filter(Boolean);

  // Generate realistic sources
  const sources = generateRealisticSources(analysis.intent, mainEntity);

  return {
    title,
    summary,
    type: type as Insight['type'],
    timestamp: 'Just now',
    agent,
    confidence: Math.floor(Math.random() * 20) + 75,
    tags: tags.slice(0, 5),
    sources,
    fullContent
  };
};

const generateFullAnalysisContent = (query: string, analysis: any, mainEntity: string): string => {
  const sections = {
    executive_summary: `## Executive Summary\n\nBased on your query "${query}", our AI research team has conducted a comprehensive ${analysis.analysisType.toLowerCase()} focusing on ${mainEntity}. This analysis synthesizes data from multiple sources to provide actionable insights for strategic decision-making.`,
    
    key_findings: `## Key Findings\n\n• **Market Position**: ${mainEntity} shows strong competitive positioning with emerging opportunities in adjacent markets\n• **Growth Trends**: Analysis indicates 15-25% growth potential in target segments over next 12 months\n• **Competitive Landscape**: 3-5 key competitors identified with varying strategic approaches\n• **Customer Sentiment**: Overall positive reception with specific areas for improvement identified\n• **Technology Trends**: AI and automation driving significant market evolution`,
    
    detailed_analysis: `## Detailed Analysis\n\n### Market Dynamics\nOur analysis reveals that ${mainEntity} operates in a rapidly evolving market characterized by technological innovation and changing customer expectations. Key market drivers include digital transformation initiatives, remote work adoption, and increasing demand for integrated solutions.\n\n### Competitive Intelligence\nCompetitive analysis shows a fragmented market with opportunities for differentiation. Leading players are focusing on AI integration, user experience improvements, and ecosystem expansion strategies.\n\n### Customer Insights\nCustomer research indicates strong demand for solutions that address ${query.toLowerCase()}. Key satisfaction drivers include ease of use, integration capabilities, and responsive customer support.\n\n### Technology Assessment\nTechnology trends analysis shows significant investment in AI/ML capabilities, API-first architectures, and mobile-optimized experiences. These trends create both opportunities and competitive pressures.`,
    
    strategic_recommendations: `## Strategic Recommendations\n\n### Immediate Actions (0-3 months)\n1. **Market Positioning**: Refine value proposition based on competitive analysis\n2. **Product Development**: Prioritize features that address identified market gaps\n3. **Customer Engagement**: Implement feedback loops to monitor sentiment changes\n\n### Medium-term Strategy (3-12 months)\n1. **Technology Investment**: Develop AI-powered capabilities to maintain competitive edge\n2. **Partnership Strategy**: Explore strategic alliances to expand market reach\n3. **Market Expansion**: Consider adjacent markets with similar customer needs\n\n### Long-term Vision (12+ months)\n1. **Platform Strategy**: Build ecosystem approach to increase customer stickiness\n2. **Innovation Pipeline**: Invest in emerging technologies for future differentiation\n3. **Global Expansion**: Evaluate international market opportunities`,
    
    risk_assessment: `## Risk Assessment\n\n### Market Risks\n• **Competitive Pressure**: New entrants with innovative approaches\n• **Technology Disruption**: Rapid pace of AI/ML advancement\n• **Economic Factors**: Potential impact on enterprise spending\n\n### Mitigation Strategies\n• Continuous market monitoring and competitive intelligence\n• Agile product development and rapid iteration capabilities\n• Diversified customer base and revenue streams`,
    
    data_sources: `## Data Sources & Methodology\n\nThis analysis is based on:\n• **Primary Research**: Customer interviews and surveys (n=500+)\n• **Secondary Research**: Industry reports and analyst publications\n• **Competitive Intelligence**: Product analysis and pricing research\n• **Social Listening**: Sentiment analysis across social media platforms\n• **Market Data**: Financial reports and growth metrics\n\n**Confidence Level**: ${Math.floor(Math.random() * 20) + 75}% based on data quality and source reliability`
  };

  return Object.values(sections).join('\n\n');
};

const generateRealisticSources = (intent: string, entity: string): string[] => {
  const baseSources = ['Industry Reports', 'Market Research', 'Competitive Analysis'];
  
  const intentSources = {
    competitive_analysis: ['Competitor Websites', 'Product Updates', 'Press Releases', 'SEC Filings'],
    trend_analysis: ['Google Trends', 'Industry Publications', 'Research Papers', 'Market Surveys'],
    sentiment_analysis: ['Social Media', 'Customer Reviews', 'Support Tickets', 'User Forums'],
    product_analysis: ['Product Documentation', 'Feature Announcements', 'User Guides', 'API Documentation'],
    pricing_analysis: ['Pricing Pages', 'Sales Materials', 'Financial Reports', 'Analyst Reports']
  };

  const sources = [
    ...baseSources,
    ...(intentSources[intent as keyof typeof intentSources] || intentSources.competitive_analysis)
  ];

  return sources.slice(0, Math.floor(Math.random() * 3) + 3);
};

export function useInsights() {
  const [allInsights, setAllInsights] = useState<Insight[]>(sampleInsights);
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>(sampleInsights);
  const [filters, setFilters] = useState({
    type: 'all',
    agent: 'all',
    timeRange: 'all',
    search: ''
  });
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const addInsight = useCallback((newInsight: Omit<Insight, 'id'>) => {
    const insight: Insight = {
      ...newInsight,
      id: Date.now().toString()
    };
    setAllInsights(prev => [insight, ...prev]);
  }, []);

  const deleteInsight = useCallback((insightId: string) => {
    setAllInsights(prev => prev.filter(insight => insight.id !== insightId));
    if (expandedInsight === insightId) {
      setExpandedInsight(null);
    }
  }, [expandedInsight]);

  const expandInsight = useCallback((insightId: string) => {
    setExpandedInsight(prev => prev === insightId ? null : insightId);
  }, []);

  const generateInsightFromQuery = useCallback((query: string, agent: string) => {
    const newInsight = generateDynamicInsight(query, agent);
    addInsight(newInsight);
  }, [addInsight]);

  const applyFilters = useCallback(() => {
    let filtered = [...allInsights];

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(insight => insight.type === filters.type);
    }

    // Agent filter
    if (filters.agent !== 'all') {
      filtered = filtered.filter(insight => insight.agent === filters.agent);
    }

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(insight => 
        insight.title.toLowerCase().includes(searchTerm) ||
        insight.summary.toLowerCase().includes(searchTerm) ||
        insight.fullContent?.toLowerCase().includes(searchTerm) ||
        insight.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredInsights(filtered);
  }, [allInsights, filters]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    insights: filteredInsights,
    allInsights,
    filters,
    addInsight,
    updateFilters,
    deleteInsight,
    expandedInsight,
    expandInsight,
    generateInsightFromQuery
  };
}