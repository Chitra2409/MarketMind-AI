# 🧠 MarketMind AI – Multi-Agent Research Platform

**Revolutionizing Market Research with AI-Powered Multi-Agent Intelligence**

[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com/)

[🚀 Live Demo](https://market-mind-ai.netlify.app/) 

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🤖 AI Agents](#-ai-agents)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📱 Usage](#-usage)
- [🏗️ Architecture](#️-architecture)
- [🔐 Security](#-security)
- [📊 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

MarketMind AI is a cutting-edge multi-agent research platform that transforms how product managers and business professionals conduct market research. Born from a real conversation with a product manager who dreamed of having "a curated dashboard of all research and findings in just one click," this platform employs five specialized AI agents working in harmony to deliver real-time market intelligence, competitive analysis, and strategic insights.

### 🌟 Why MarketMind AI?

- **⚡ 10x Faster Research**: Reduce research time from hours to minutes
- **🎯 AI-Powered Insights**: Get actionable intelligence with 87% average confidence
- **🔄 Real-time Updates**: Stay ahead with live market monitoring
- **📊 Comprehensive Analytics**: Visualize trends and patterns instantly
- **🤝 Team Collaboration**: Share insights across your organization
- **💼 Enterprise Ready**: Scalable, secure, and compliant

---

## ✨ Features

### 🧠 **Intelligent Research Engine**
- **Natural Language Queries**: Ask questions in plain English
- **Voice Input Support**: Hands-free query submission
- **Smart Suggestions**: AI-powered query recommendations
- **Query History**: Track and rerun previous research

### 📈 **Real-time Insights Dashboard**
- **Live Data Processing**: Sub-second response times
- **Confidence Scoring**: AI-generated reliability metrics
- **Source Attribution**: Transparent data sourcing
- **Categorized Intelligence**: Trends, alerts, opportunities, and warnings

### 📋 **Advanced Reporting System**
- **Multiple Export Formats**: PDF, CSV, JSON, Excel
- **Professional Templates**: Executive-ready report layouts
- **Automated Generation**: Schedule and distribute reports
- **Custom Branding**: White-label options for enterprise

### 📊 **Interactive Analytics**
- **Real-time Visualizations**: Dynamic charts and graphs
- **Performance Metrics**: Agent productivity and accuracy
- **Trend Analysis**: Historical data patterns
- **Market Opportunity Mapping**: Visual competitive landscape

### 🔐 **Enterprise Security**
- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure session management
- **GDPR Compliant**: Privacy-first data handling
- **SOC 2 Ready**: Enterprise security standards

### 💳 **Flexible Subscription Model**
- **Tiered Plans**: Basic, Professional, Enterprise
- **Usage Analytics**: Track consumption and limits
- **Self-service Portal**: Manage billing and subscriptions
- **Free Trial**: Risk-free evaluation period

---

## 🤖 AI Agents

MarketMind AI employs five specialized AI agents, each designed for specific research domains:

| Agent | Primary Function | Key Capabilities |
|-------|------------------|------------------|
| **🔍 Trend Analyst** | Market Trend Detection | • Scans news, blogs, research reports<br>• Identifies emerging patterns<br>• Tracks industry shifts |
| **🕵️ Competitor Scout** | Competitive Intelligence | • Monitors competitor moves<br>• Tracks product launches<br>• Analyzes pricing strategies |
| **💭 Sentiment Analyst** | Customer Intelligence | • Analyzes reviews and feedback<br>• Monitors social sentiment<br>• Processes support data |
| **🧩 Strategic Synthesizer** | Insight Generation | • Synthesizes cross-agent findings<br>• Generates recommendations<br>• Creates strategic insights |
| **🗺️ Market Mapper** | Landscape Analysis | • Maps competitive positioning<br>• Estimates market opportunities<br>• Structures industry relationships |

---

## 🛠️ Tech Stack

### **Frontend**
```
React 18.3.1          TypeScript 5.5.3      Tailwind CSS 3.4.1
Vite 5.4.2            Lucide React 0.344.0  Recharts 2.8.0
```

### **Backend & Services**
```
Supabase 2.50.2       Clerk 4.30.0          Stripe 14.15.0
PostgreSQL            Edge Functions        Webhooks
```

### **Infrastructure**
```
Netlify               CDN Distribution      Edge Computing
GitHub Actions        Continuous Deployment Environment Management
```

### **Development Tools**
```
ESLint 9.9.1          TypeScript ESLint     Autoprefixer
React Hooks ESLint    PostCSS               Vite Plugins
```

---

## 🚀 Quick Start

Get MarketMind AI running locally in under 5 minutes:

```bash
# Clone the repository
git clone https://github.com/your-username/marketmind-ai.git
cd marketmind-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

🎉 **That's it!** Open [http://localhost:5173](http://localhost:5173) to see MarketMind AI in action.

---

## ⚙️ Installation

### **Prerequisites**

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** for version control

### **Step-by-Step Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/marketmind-ai.git
   cd marketmind-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables** (see [Configuration](#-configuration))

5. **Database Setup**
   ```bash
   # Run database migrations (if using Supabase locally)
   npx supabase db reset
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### **Docker Installation** (Optional)

```bash
# Build Docker image
docker build -t marketmind-ai .

# Run container
docker run -p 3000:3000 marketmind-ai
```

---

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# Database (Supabase)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Payments (Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id_here
```

### **Service Configuration**

#### **Supabase Setup**
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the database migrations in `supabase/migrations/`
4. Configure Row Level Security policies

#### **Clerk Authentication**
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Configure social providers (optional)
4. Copy your publishable key

#### **Stripe Payments**
1. Create account at [stripe.com](https://stripe.com)
2. Set up your products and pricing
3. Configure webhooks for subscription events
4. Copy your publishable key

### **Build Configuration**

The project uses Vite for building. Configuration is in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

---

## 📱 Usage

### **Basic Usage**

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Choose Subscription**: Select a plan that fits your needs
3. **Ask Questions**: Use natural language to query the AI agents
4. **Review Insights**: Analyze generated insights with confidence scores
5. **Generate Reports**: Create professional reports from your research
6. **Export Data**: Download insights and reports in multiple formats

### **Advanced Features**

#### **Voice Queries**
```javascript
// Enable voice input in query interface
const handleVoiceInput = () => {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.start();
  }
};
```

#### **Custom Filters**
```javascript
// Filter insights by type, agent, or confidence
const filteredInsights = insights.filter(insight => 
  insight.type === 'trend' && 
  insight.confidence > 80
);
```

#### **Automated Reports**
```javascript
// Schedule automated report generation
const scheduleReport = (title, type, frequency) => {
  generateReport(title, type, {
    schedule: frequency,
    autoEmail: true
  });
};
```

### **API Usage Examples**

#### **Query Submission**
```javascript
const submitQuery = async (query) => {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, agents: ['trend', 'competitor'] })
  });
  return response.json();
};
```

#### **Insight Retrieval**
```javascript
const getInsights = async (filters) => {
  const response = await fetch(`/api/insights?${new URLSearchParams(filters)}`);
  return response.json();
};
```

---

## 🏗️ Architecture

### **System Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Supabase API  │    │   AI Agents     │
│                 │◄──►│                 │◄──►│                 │
│ • Components    │    │ • Database      │    │ • Trend Analyst │
│ • Hooks         │    │ • Auth          │    │ • Competitor    │
│ • State Mgmt    │    │ • Real-time     │    │ • Sentiment     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Clerk Auth    │    │   Stripe API    │    │   External APIs │
│                 │    │                 │    │                 │
│ • User Mgmt     │    │ • Subscriptions │    │ • News Sources  │
│ • Sessions      │    │ • Payments      │    │ • Social Media  │
│ • Profiles      │    │ • Webhooks      │    │ • Market Data   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Component Architecture**

```
src/
├── components/          # React components
│   ├── AgentCard.tsx           # Individual agent display
│   ├── QueryInterface.tsx      # Query input interface
│   ├── InsightCard.tsx         # Insight display component
│   ├── ReportSection.tsx       # Report management
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAgents.ts            # Agent state management
│   ├── useInsights.ts          # Insight operations
│   ├── useReports.ts           # Report generation
│   └── ...
├── services/           # External service integrations
│   ├── stripe.ts               # Payment processing
│   └── ...
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── lib/                # Library configurations
```

### **Data Flow**

1. **User Input** → Query Interface
2. **Query Analysis** → Intent Detection & Entity Extraction
3. **Agent Selection** → Route to appropriate AI agents
4. **Parallel Processing** → Multiple agents process simultaneously
5. **Result Synthesis** → Combine and rank results
6. **Insight Generation** → Create structured insights
7. **UI Update** → Real-time display to user

### **State Management**

The application uses a combination of:
- **React Hooks** for component-level state
- **Custom Hooks** for domain-specific logic
- **Context API** for global state
- **Local Storage** for persistence
- **Supabase Real-time** for live updates

---

## 🔐 Security

### **Authentication & Authorization**

- **Clerk Integration**: Secure user authentication with JWT tokens
- **Row Level Security**: Database-level access control
- **Session Management**: Automatic token refresh and validation
- **Role-based Access**: Different permissions for user types

### **Data Protection**

- **Encryption**: All data encrypted in transit and at rest
- **Input Validation**: Comprehensive sanitization of user inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API abuse prevention

### **Privacy Compliance**

- **GDPR Ready**: European data protection compliance
- **Data Minimization**: Collect only necessary information
- **User Consent**: Clear consent mechanisms
- **Data Portability**: Export user data on request

### **Security Best Practices**

```typescript
// Input validation example
export const validateQueryInput = (query: string) => {
  if (!query.trim()) return { isValid: false, error: 'Query cannot be empty' };
  if (query.length > 500) return { isValid: false, error: 'Query too long' };
  
  const maliciousPatterns = [/<script/i, /javascript:/i];
  for (const pattern of maliciousPatterns) {
    if (pattern.test(query)) {
      return { isValid: false, error: 'Invalid content detected' };
    }
  }
  
  return { isValid: true };
};
```

---

## 📊 API Reference

### **Authentication**

All API requests require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### **Endpoints**

#### **Query Management**

```http
POST /api/query
Content-Type: application/json

{
  "query": "What are the latest trends in AI productivity tools?",
  "agents": ["trend", "competitor"],
  "priority": "high"
}
```

#### **Insights**

```http
GET /api/insights?type=trend&confidence=80&limit=10
```

#### **Reports**

```http
POST /api/reports
Content-Type: application/json

{
  "title": "Q1 Market Analysis",
  "type": "market_analysis",
  "format": "pdf",
  "insights": ["insight_id_1", "insight_id_2"]
}
```

#### **Subscriptions**

```http
GET /api/subscription/status
POST /api/subscription/upgrade
DELETE /api/subscription/cancel
```

### **Webhooks**

#### **Stripe Webhooks**

```http
POST /webhooks/stripe
Content-Type: application/json
Stripe-Signature: <signature>

{
  "type": "customer.subscription.created",
  "data": { ... }
}
```

### **Error Handling**

All API responses follow a consistent error format:

```json
{
  "error": {
    "code": "INVALID_QUERY",
    "message": "Query validation failed",
    "details": {
      "field": "query",
      "reason": "Query cannot be empty"
    }
  }
}
```

---

## 🧪 Testing

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- InsightCard.test.tsx
```

### **Test Structure**

```
tests/
├── components/         # Component tests
├── hooks/             # Hook tests
├── services/          # Service tests
├── utils/             # Utility tests
└── __mocks__/         # Mock implementations
```

### **Testing Examples**

#### **Component Testing**
```typescript
import { render, screen } from '@testing-library/react';
import { InsightCard } from '../components/InsightCard';

test('renders insight card with correct data', () => {
  const mockInsight = {
    id: '1',
    title: 'Test Insight',
    summary: 'Test summary',
    type: 'trend',
    confidence: 85
  };
  
  render(<InsightCard {...mockInsight} />);
  expect(screen.getByText('Test Insight')).toBeInTheDocument();
});
```

#### **Hook Testing**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useInsights } from '../hooks/useInsights';

test('should add new insight', () => {
  const { result } = renderHook(() => useInsights());
  
  act(() => {
    result.current.addInsight({
      title: 'New Insight',
      summary: 'Summary',
      type: 'trend'
    });
  });
  
  expect(result.current.insights).toHaveLength(1);
});
```

### **E2E Testing**

```bash
# Run Cypress tests
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

---

## 🚢 Deployment

### **Netlify Deployment** (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Configure build settings

2. **Environment Variables**
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_key
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_key
   ```

3. **Build Configuration**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

4. **Deploy**
   ```bash
   # Manual deployment
   npm run build
   netlify deploy --prod --dir=dist
   
   # Automatic deployment via Git
   git push origin main
   ```

### **Alternative Deployment Options**

#### **Vercel**
```bash
npm install -g vercel
vercel --prod
```

#### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### **AWS S3 + CloudFront**
```bash
# Build and deploy to S3
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### **Production Checklist**

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] CDN configured
- [ ] Error monitoring setup
- [ ] Analytics tracking enabled
- [ ] Performance monitoring active
- [ ] Backup strategy implemented

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help make MarketMind AI even better.

### **Getting Started**

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/marketmind-ai.git
   cd marketmind-ai
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Your Changes**
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. **Submit a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes

### **Development Guidelines**

#### **Code Style**
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

#### **Component Guidelines**
```typescript
// Good component structure
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
}

export function Component({ title, onAction }: ComponentProps) {
  // Component logic here
  return (
    <div className="component-container">
      {/* JSX here */}
    </div>
  );
}
```

#### **Testing Requirements**
- Unit tests for all utilities
- Component tests for UI components
- Integration tests for hooks
- E2E tests for critical user flows

### **Issue Reporting**

When reporting issues, please include:
- **Environment**: OS, browser, Node.js version
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable

### **Feature Requests**

For feature requests, please provide:
- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions considered
- **Additional Context**: Any other relevant information

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 MarketMind AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### **Inspiration**
Special thanks to the product manager whose casual conversation in the office pantry sparked the idea for MarketMind AI. Sometimes the best ideas come from the most unexpected places.

### **Technology Partners**
- **[Supabase](https://supabase.com)** - For providing an amazing backend-as-a-service platform
- **[Netlify](https://netlify.com)** - For seamless deployment and hosting
- **[Bolt.new](https://bolt.new)** - For the development platform that made this possible

### **Open Source Libraries**
- **React Team** - For the incredible React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Recharts** - For the powerful charting library

### **Community**
- All beta testers who provided valuable feedback
- Contributors who helped improve the codebase
- The open source community for inspiration and support

---

<div align="center">

**Built with ❤️ by the MarketMind AI Team**

[🌐 Website](https://market-mind-ai.netlify.app/)

⭐ **Star this repo if you find it helpful!** ⭐

</div>
