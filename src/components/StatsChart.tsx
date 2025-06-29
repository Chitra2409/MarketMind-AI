import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const insightData = [
  { name: 'Mon', insights: 12, confidence: 85 },
  { name: 'Tue', insights: 19, confidence: 78 },
  { name: 'Wed', insights: 15, confidence: 92 },
  { name: 'Thu', insights: 22, confidence: 88 },
  { name: 'Fri', insights: 18, confidence: 91 },
  { name: 'Sat', insights: 8, confidence: 76 },
  { name: 'Sun', insights: 11, confidence: 83 }
];

const agentData = [
  { name: 'Trend Analyst', insights: 12, shortName: 'Trend' },
  { name: 'Competitor Scout', insights: 8, shortName: 'Competitor' },
  { name: 'Sentiment Analyst', insights: 15, shortName: 'Sentiment' },
  { name: 'Strategic Synthesizer', insights: 6, shortName: 'Strategic' },
  { name: 'Market Mapper', insights: 9, shortName: 'Market' }
];

export function StatsChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Insights Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={insightData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ 
                value: 'Insights', 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="insights" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights by Agent</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={agentData} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="shortName" 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              label={{ 
                value: 'Insights', 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value, name, props) => [value, 'Insights']}
              labelFormatter={(label) => {
                const agent = agentData.find(a => a.shortName === label);
                return agent ? agent.name : label;
              }}
            />
            <Bar 
              dataKey="insights" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}