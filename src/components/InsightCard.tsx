import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, ExternalLink, Trash2, Tag, Shield, ChevronDown, ChevronUp, FileText, Download } from 'lucide-react';

interface InsightCardProps {
  id: string;
  title: string;
  summary: string;
  type: 'trend' | 'alert' | 'success' | 'update' | 'warning';
  timestamp: string;
  agent: string;
  confidence: number;
  tags?: string[];
  sources?: string[];
  fullContent?: string;
  onDelete?: (id: string) => void;
  onExpand?: (id: string) => void;
  isExpanded?: boolean;
  onCreateReport?: (insight: any) => void;
}

export function InsightCard({ 
  id, 
  title, 
  summary, 
  type, 
  timestamp, 
  agent, 
  confidence, 
  tags = [],
  sources = [],
  fullContent,
  onDelete,
  onExpand,
  isExpanded = false,
  onCreateReport
}: InsightCardProps) {
  const [showSources, setShowSources] = useState(false);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'trend':
        return { icon: TrendingUp, bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-700', iconColor: 'text-blue-600 dark:text-blue-400' };
      case 'alert':
        return { icon: AlertTriangle, bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-700', iconColor: 'text-orange-600 dark:text-orange-400' };
      case 'success':
        return { icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-700', iconColor: 'text-green-600 dark:text-green-400' };
      case 'warning':
        return { icon: Shield, bg: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-700', iconColor: 'text-yellow-600 dark:text-yellow-400' };
      default:
        return { icon: Clock, bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-600', iconColor: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const config = getTypeConfig(type);
  const Icon = config.icon;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
  };

  const handleExpand = () => {
    if (onExpand) {
      onExpand(id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleCreateReport = () => {
    if (onCreateReport) {
      onCreateReport({
        id,
        title,
        summary,
        type,
        timestamp,
        agent,
        confidence,
        tags,
        sources,
        fullContent
      });
    }
  };

  const formatFullContent = (content: string) => {
    if (!content) return '';
    
    // Split content into sections and format for better readability
    return content
      .split('\n\n')
      .map((section, index) => {
        if (section.startsWith('##')) {
          return `<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">${section.replace('##', '').trim()}</h3>`;
        } else if (section.startsWith('###')) {
          return `<h4 class="text-md font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">${section.replace('###', '').trim()}</h4>`;
        } else if (section.startsWith('•')) {
          const items = section.split('\n').filter(line => line.trim());
          const listItems = items.map(item => `<li class="mb-1 text-gray-700 dark:text-gray-300">${item.replace('•', '').trim()}</li>`).join('');
          return `<ul class="list-disc list-inside space-y-1 ml-4">${listItems}</ul>`;
        } else if (section.includes(':') && section.split('\n').length > 1) {
          const lines = section.split('\n');
          const header = lines[0];
          const content = lines.slice(1).join('\n');
          return `<div class="mb-4"><strong class="text-gray-900 dark:text-gray-100">${header}</strong><div class="text-gray-700 dark:text-gray-300 mt-1">${content}</div></div>`;
        } else {
          return `<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">${section}</p>`;
        }
      })
      .join('');
  };

  return (
    <div className={`insight-card p-6 rounded-xl border ${config.bg} ${config.border} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-2 rounded-lg ${config.iconColor.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-100')} dark:bg-opacity-20`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 pr-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg leading-tight" onClick={handleExpand}>
                {title}
              </h4>
              <div className="flex items-center space-x-2">
                {fullContent && (
                  <button
                    onClick={handleExpand}
                    className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                )}
                {onCreateReport && (
                  <button
                    onClick={handleCreateReport}
                    className="text-gray-400 dark:text-gray-500 hover:text-green-500 dark:hover:text-green-400 transition-colors p-2 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                    title="Create report from this insight"
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    title="Delete insight"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{summary}</p>
            
            {isExpanded && fullContent && (
              <div className="mb-6 p-6 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Detailed Analysis</h5>
                  {onCreateReport && (
                    <button
                      onClick={handleCreateReport}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Create Report</span>
                    </button>
                  )}
                </div>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: formatFullContent(fullContent) }}
                />
              </div>
            )}
            
            {tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80 text-sm text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-colors cursor-pointer font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900 dark:text-gray-100">{agent}</span>
                <span className="text-gray-500 dark:text-gray-400">{timestamp}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${getConfidenceColor(confidence)}`}>
                    {confidence}%
                  </span>
                </div>
                {sources.length > 0 && (
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    {sources.length} sources
                  </button>
                )}
              </div>
            </div>
            
            {showSources && sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Data Sources:</p>
                <div className="grid grid-cols-2 gap-2">
                  {sources.map((source, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-700 bg-opacity-60 dark:bg-opacity-60 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                        {source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}