import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3, Plus, Trash2, Eye, X, Clock, Settings } from 'lucide-react';
import { Report } from '../types';
import { useSettings } from '../hooks/useSettings';

interface ReportSectionProps {
  reports: Report[];
  onGenerate: (title: string, type: string) => void;
  onDownload: (reportId: string) => void;
  onDelete: (reportId: string) => void;
  onPreview?: (reportId: string) => void;
  previewReport?: Report | null;
  onClosePreview?: () => void;
  getReportContent?: (report: Report) => string;
}

export function ReportSection({ 
  reports, 
  onGenerate, 
  onDownload, 
  onDelete, 
  onPreview,
  previewReport,
  onClosePreview,
  getReportContent
}: ReportSectionProps) {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newReportType, setNewReportType] = useState('Market Analysis');
  const { settings } = useSettings();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ready':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Ready', icon: FileText };
      case 'generating':
        return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Generating', icon: Clock };
      case 'error':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'Error', icon: FileText };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Scheduled', icon: Calendar };
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'csv': return '📊';
      case 'json': return '🔧';
      case 'xlsx': return '📈';
      default: return '📝';
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case 'pdf': return 'PDF';
      case 'csv': return 'CSV';
      case 'json': return 'JSON';
      case 'xlsx': return 'Excel';
      default: return 'Markdown';
    }
  };

  const handleGenerate = () => {
    if (newReportTitle.trim()) {
      onGenerate(newReportTitle, newReportType);
      setNewReportTitle('');
      setShowGenerateModal(false);
    }
  };

  const reportTypes = [
    'Market Analysis',
    'Competitive Intelligence',
    'Sentiment Analysis',
    'Product Analysis',
    'Trend Report',
    'Customer Research',
    'Technology Assessment',
    'Strategic Planning',
    'Risk Analysis',
    'Financial Projections'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Research Reports</h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Export as:</span>
            <span className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span>{getFormatIcon(settings.exportFormat)}</span>
              <span className="font-medium">{getFormatLabel(settings.exportFormat)}</span>
            </span>
          </div>
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-200 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Report</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => {
          const statusConfig = getStatusConfig(report.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center space-x-4 flex-1">
                <StatusIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{report.title}</h4>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{report.type}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{report.date}</span>
                    </div>
                    {report.size && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">• {report.size}</span>
                    )}
                    {report.insights !== undefined && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">• {report.insights} insights</span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      • Will export as {getFormatIcon(settings.exportFormat)} {getFormatLabel(settings.exportFormat)}
                    </span>
                  </div>
                  {report.query && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">Query: </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 italic">"{report.query}"</span>
                    </div>
                  )}
                  {report.status === 'generating' && report.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Generating report...</span>
                        <span>{Math.round(report.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${report.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} dark:bg-opacity-20 flex items-center space-x-1`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusConfig.label}</span>
                </span>
                <div className="flex items-center space-x-1">
                  {report.status === 'ready' && (
                    <>
                      <button 
                        onClick={() => onDownload(report.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                        title={`Download as ${getFormatLabel(settings.exportFormat)}`}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {onPreview && (
                        <button 
                          onClick={() => onPreview(report.id)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
                          title="Preview report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  <button 
                    onClick={() => onDelete(report.id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {reports.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p>No reports generated yet. Create your first report to get started.</p>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 transform transition-all duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Generate New Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Title
                </label>
                <input
                  type="text"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                  placeholder="Enter report title..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Report Type
                </label>
                <select
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {reportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
                  <span>{getFormatIcon(settings.exportFormat)}</span>
                  <span>Report will be exported as <strong>{getFormatLabel(settings.exportFormat)}</strong></span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  Change export format in Settings → Data & Privacy
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!newReportTitle.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {previewReport && onClosePreview && getReportContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{previewReport.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{previewReport.type} • {previewReport.date}</p>
              </div>
              <button
                onClick={onClosePreview}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="prose max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                  {getReportContent(previewReport)}
                </pre>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Export format:</span>
                <span className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span>{getFormatIcon(settings.exportFormat)}</span>
                  <span className="font-medium">{getFormatLabel(settings.exportFormat)}</span>
                </span>
              </div>
              <button
                onClick={() => onDownload(previewReport.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download as {getFormatLabel(settings.exportFormat)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}