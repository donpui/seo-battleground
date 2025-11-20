# 🎯 SEO Battleground

**A powerful, free SEO comparison tool** to analyze and compare website metadata, Open Graph tags, Twitter Cards, Lighthouse scores, and SEO performance across multiple competitors.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## ✨ Features

### 🔍 Comprehensive SEO Analysis
- **Meta Tag Validation**: Analyze title tags, meta descriptions, and heading structure
- **Open Graph & Twitter Cards**: Preview how your site appears on social media
- **Image Optimization**: Track missing alt text and image SEO issues
- **Content Analysis**: Word count comparison and content quality metrics
- **Lighthouse Integration**: Core Web Vitals and performance scores

### 📊 Competitive Intelligence
- **Multi-Competitor Comparison**: Compare up to 3 competitors side-by-side
- **Win/Loss Indicators**: Clear visual badges showing where you excel or fall behind
- **Similarity Analysis**: Jaccard index calculation for description similarity
- **Actionable Recommendations**: Get specific, prioritized SEO improvement suggestions

### 🎨 Modern UI/UX
- **Glassmorphic Design**: Beautiful, modern interface with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Quick Navigation**: Jump to scores, recommendations, comparisons, and granular tags
- **Predefined Templates**: Quick-start comparisons for popular websites

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/donpui/seo-battleground.git
   cd seo-battleground
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📖 Usage

### Basic Comparison
1. Enter your website URL in the "Your Website" field
2. Add 1-3 competitor URLs
3. Click "Start Comparison"
4. Review your SEO scores, recommendations, and detailed comparisons

### Quick Compare Templates
Use predefined comparisons to see the tool in action:
- **Search Engines**: Google vs DuckDuckGo vs Bing
- **SEO Tools**: Semrush vs Ahrefs vs SimilarWeb
- **AI Attention**: Attention Insight vs Neurons vs Dragonfly AI
- **Feature Management**: Feature Voice vs Feature Vote vs Featurebase

---

## 🏗️ Project Structure

```
seo-comparison/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.js      # Main analysis endpoint
│   │   │   └── competitors/route.js  # Competitor discovery
│   │   ├── layout.js                 # Root layout with SEO metadata
│   │   └── page.js                   # Main application UI
│   ├── components/
│   │   └── ui/                       # Reusable UI components (shadcn/ui)
│   └── lib/
│       ├── analyzer.js               # SEO scoring & comparison logic
│       ├── scraper.js                # Metadata extraction
│       ├── lighthouse.js             # Lighthouse score fetching
│       └── utils.js                  # Utility functions
├── public/                           # Static assets
└── package.json
```

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with React Compiler

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Data Processing
- **[Cheerio](https://cheerio.js.org/)** - Fast HTML parsing and scraping
- **[PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)** - Lighthouse scores

### Utilities
- **[clsx](https://github.com/lukeed/clsx)** - Conditional className utility
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes

---

## 📊 SEO Scoring Algorithm

The tool calculates a score out of 100 based on the following criteria:

| Metric | Points | Deduction Criteria |
|--------|--------|-------------------|
| **Title Tag** | 20 | Missing title (-20), Non-optimal length (-5) |
| **Meta Description** | 20 | Missing description (-20), Non-optimal length (-5) |
| **H1 Tag** | 15 | Missing H1 (-15), Multiple H1s (-5) |
| **Image Alt Text** | 10 | Proportional to missing alt attributes |
| **Open Graph Tags** | 10 | Missing og:title or og:image |
| **Word Count** | 10 | Content less than 300 words |

### Optimal Ranges
- **Title**: 30-60 characters
- **Meta Description**: 50-160 characters
- **H1 Tags**: Exactly 1 per page
- **Word Count**: 300+ words

---

## 🎯 Key Features Explained

### Win/Loss Logic
The comparison uses intelligent logic to determine competitive advantages:
- ✅ **WIN**: You have data when competitor is missing, or your metric is better
- ❌ **LOSS**: Competitor has data when you're missing, or their metric is better
- ⚪ **NEUTRAL**: Both have similar or equal values

### Description Similarity
Uses **Jaccard Index** to calculate similarity between meta descriptions:
```
Similarity = (Intersection of words) / (Union of words) × 100
```

### Lighthouse Integration
Fetches real-time scores for:
- Performance
- Accessibility
- Best Practices
- SEO

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/donpui/seo-battleground)

1. Click the button above or visit [Vercel](https://vercel.com/new)
2. Import your repository
3. Deploy with zero configuration

### Other Platforms
- **Netlify**: Works out of the box
- **Docker**: Create a Dockerfile with Node.js base image
- **Self-hosted**: Run `npm run build` then `npm start`

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Lighthouse scores via [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)

---

## 📧 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/donpui/seo-battleground/issues)
- **GitHub Discussions**: [Ask questions or share ideas](https://github.com/donpui/seo-battleground/discussions)

---

<div align="center">

**Made with ❤️ for the SEO community**

[⭐ Star this repo](https://github.com/donpui/seo-battleground) if you find it useful!

</div>
