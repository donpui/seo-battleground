'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, Info } from 'lucide-react';

export default function Home() {
  const [myUrl, setMyUrl] = useState('');
  const [competitors, setCompetitors] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    const validCompetitors = competitors.filter(c => c.trim() !== '');
    if (!myUrl || validCompetitors.length === 0) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myUrl, competitors: validCompetitors }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight gradient-text pb-2">
            SEO Battleground
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compare your website against up to 3 competitors. Analyze metadata, identify gaps, and claim your victory.
          </p>
        </div>

        {/* Input Section */}
        <Card className="glass-panel border-0">
          <CardContent className="p-8">
            <CompetitorFinder
              onSelect={(url) => {
                // Add discovered competitor to the list if not full
                if (competitors.length < 3) {
                  setCompetitors([...competitors, url]);
                } else {
                  // Replace last one if full
                  const newComps = [...competitors];
                  newComps[newComps.length - 1] = url;
                  setCompetitors(newComps);
                }
              }}
              myUrl={myUrl}
              setMyUrl={setMyUrl}
              competitors={competitors}
              setCompetitors={setCompetitors}
              handleAnalyze={handleAnalyze}
              loading={loading}
              error={error}
            />

          </CardContent>
        </Card>

        {/* Results Dashboard */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Scores Grid */}
            <div className={`grid gap-8 ${result.competitors.length >= 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
              {/* My Score */}
              <div className="space-y-6">
                <ScoreCard
                  title="Your Score"
                  score={result.myData.score.score}
                  deductions={result.myData.score.deductions}
                  url={result.myData.url}
                  color="text-blue-400"
                />
                {result.myData.lighthouse && (
                  <LighthouseCard scores={result.myData.lighthouse} />
                )}
              </div>

              {/* Competitor Scores */}
              {result.competitors.map((comp, index) => (
                <div key={index} className="space-y-6">
                  <ScoreCard
                    title={`Competitor ${index + 1}`}
                    score={comp.score.score}
                    deductions={comp.score.deductions}
                    url={comp.url}
                    color="text-purple-400"
                  />
                  {comp.lighthouse && (
                    <LighthouseCard scores={comp.lighthouse} />
                  )}
                </div>
              ))}
            </div>

            {/* Detailed Comparison */}
            <Card className="glass-panel border-0 relative">
              <CardHeader>
                <CardTitle>Deep Dive Comparison</CardTitle>
                <CardDescription>Granular breakdown of SEO elements.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <ComparisonTable
                  myData={result.myData}
                  competitors={result.competitors}
                />
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </main>
  );
}

function ScoreCard({ title, score, deductions, url, color }) {
  return (
    <Card className="glass-panel border-0 overflow-hidden relative group">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${color.split('-')[1]}-500 to-transparent opacity-50`} />
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className={color}>{title}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">Score is calculated based on: Title (20pts), Meta Description (20pts), H1 tags (15pts), Image Alt text (10pts), Open Graph tags (10pts), and Word Count (10pts). Deductions are applied for missing or non-optimal elements.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="truncate" title={url}>{url}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center py-4">
          <div className="relative size-32 flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-secondary" strokeWidth="2"></circle>
              <circle cx="18" cy="18" r="16" fill="none" className={`stroke-current ${color} score-circle`} strokeWidth="2" strokeDasharray={`${score}, 100`}></circle>
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className={`text-4xl font-bold ${color}`}>{score}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Issues Found</h4>
          {deductions.length === 0 ? (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-3 rounded-md">
              <span>✓</span>
              <span className="text-sm">Perfect! No issues found.</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {deductions.map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-300 bg-red-500/5 p-2 rounded">
                  <span className="mt-0.5">⚠️</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonTable({ myData, competitors }) {
  return (
    <div className="space-y-8">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead className="w-[150px]">Metric</TableHead>
            <TableHead className="text-blue-400 min-w-[200px]">You</TableHead>
            {competitors.map((c, i) => (
              <TableHead key={i} className="text-purple-400 min-w-[200px]">
                <div className="truncate max-w-[200px]" title={c.url}>{c.url}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <ComparisonRow
            label="Title Tag"
            myData={myData}
            competitors={competitors}
            field="title"
            subField="length"
          />
          <ComparisonRow
            label="Meta Description"
            myData={myData}
            competitors={competitors}
            field="description"
            subField="length"
          />

          {/* Description Similarity Rows */}
          <TableRow className="hover:bg-white/5 border-white/10 transition-colors">
            <TableCell className="font-medium text-muted-foreground">Desc. Similarity</TableCell>
            <TableCell className="text-muted-foreground">-</TableCell>
            {competitors.map((c, i) => (
              <TableCell key={i}>
                <div className="flex items-center gap-2">
                  <Progress value={c.comparison.description.similarity} className="h-2 w-20" />
                  <span className="text-xs font-bold">{c.comparison.description.similarity}%</span>
                </div>
              </TableCell>
            ))}
          </TableRow>

          <ComparisonRow
            label="H1 Tag"
            myData={myData}
            competitors={competitors}
            field="h1"
            isArray={true}
          />

          {/* Images Row - Custom Logic */}
          <TableRow className="hover:bg-white/5 border-white/10 transition-colors">
            <TableCell className="font-medium text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help flex items-center gap-1">
                      Images (Missing Alt)
                      <Info className="h-3 w-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Number of images without alt text / Total images on page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>
              <div className="font-medium">{myData.images.filter(img => !img.alt).length} / {myData.images.length}</div>
            </TableCell>
            {competitors.map((c, i) => (
              <TableCell key={i}>
                <div className="font-medium">{c.comparison.images.missingAlt2} / {c.comparison.images.count2}</div>
                <StatusBadge status={c.comparison.images.missingAlt1 > c.comparison.images.missingAlt2 ? 'loss' : (c.comparison.images.missingAlt1 < c.comparison.images.missingAlt2 ? 'win' : 'neutral')} />
              </TableCell>
            ))}
          </TableRow>

          <ComparisonRow
            label="Word Count"
            myData={myData}
            competitors={competitors}
            field="wordCount"
            isNumber={true}
          />
        </TableBody>
      </Table>

      <Separator className="bg-white/10" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Social Media Preview (Open Graph)</h3>
        <div className={`grid gap-8 ${competitors.length >= 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          <div className="space-y-2">
            <div className="text-sm text-blue-400 font-medium">Your Preview</div>
            <ImagePreview
              image={myData.og?.image}
              title={myData.og?.title}
              description={myData.og?.description}
            />
          </div>
          {competitors.map((c, i) => (
            <div key={i} className="space-y-2">
              <div className="text-sm text-purple-400 font-medium">Competitor {i + 1} Preview</div>
              <ImagePreview
                image={c.data.og?.image}
                title={c.data.og?.title}
                description={c.data.og?.description}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Granular Tag Comparison</h3>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="w-[150px]">Tag Property</TableHead>
              <TableHead className="text-blue-400 min-w-[200px]">Your Value</TableHead>
              {competitors.map((c, i) => (
                <TableHead key={i} className="text-purple-400 min-w-[200px]">
                  <div className="truncate max-w-[200px]">{c.url}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <GranularRow label="og:title" myData={myData} competitors={competitors} path="og.title" />
            <GranularRow label="og:description" myData={myData} competitors={competitors} path="og.description" />
            <GranularRow label="og:image" myData={myData} competitors={competitors} path="og.image" />
            <GranularRow label="og:url" myData={myData} competitors={competitors} path="og.url" />
            <GranularRow label="twitter:card" myData={myData} competitors={competitors} path="twitter.card" />
            <GranularRow label="twitter:title" myData={myData} competitors={competitors} path="twitter.title" />
            <GranularRow label="twitter:description" myData={myData} competitors={competitors} path="twitter.description" />
            <GranularRow label="twitter:image" myData={myData} competitors={competitors} path="twitter.image" />
            <TableRow className="hover:bg-white/5 border-white/10 transition-colors">
              <TableCell className="font-medium text-muted-foreground w-[150px] align-top">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help flex items-center gap-1">
                        Word Count
                        <Info className="h-3 w-3" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">Total number of words in the page body content</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="max-w-[250px] align-top">
                <div className="font-medium text-foreground">{myData.wordCount}</div>
              </TableCell>
              {competitors.map((c, i) => (
                <TableCell key={i} className="max-w-[250px] align-top">
                  <div className="font-medium text-foreground">{c.data.wordCount}</div>
                  <StatusBadge status={myData.wordCount > c.data.wordCount ? 'win' : (myData.wordCount < c.data.wordCount ? 'loss' : 'neutral')} />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ImagePreview({ image, title, description }) {
  if (!image && !title) return <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center text-muted-foreground text-sm">No Preview Available</div>;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-card h-full">
      {image ? (
        <img src={image} alt="OG Preview" className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-white/5 flex items-center justify-center text-muted-foreground">No Image</div>
      )}
      <div className="p-4 space-y-2">
        <div className="font-bold text-foreground line-clamp-2">{title || 'No Title'}</div>
        <div className="text-sm text-muted-foreground line-clamp-3">{description || 'No Description'}</div>
      </div>
    </div>
  );
}

function GranularRow({ label, myData, competitors, path }) {
  const getValue = (obj, path) => {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current && current[part]) {
        current = current[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const isImage = (val) => val && (typeof val === 'string') && (val.startsWith('http') || val.startsWith('/')) && (val.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || label.includes('image'));

  const renderValue = (val) => {
    if (!val) return '-';
    if (isImage(val)) {
      return (
        <div className="space-y-2">
          <a href={val} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline break-all block mb-1">{val}</a>
          <img src={val} alt="Tag Preview" className="w-full max-w-[200px] h-auto rounded border border-white/10" />
        </div>
      );
    }
    return val;
  };

  return (
    <TableRow className="hover:bg-white/5 border-white/10 transition-colors">
      <TableCell className="font-medium text-muted-foreground font-mono text-xs w-[150px] align-top">{label}</TableCell>
      <TableCell className="max-w-[300px] break-all whitespace-pre-wrap text-sm align-top">{renderValue(getValue(myData, path))}</TableCell>
      {competitors.map((c, i) => (
        <TableCell key={i} className="max-w-[300px] break-all whitespace-pre-wrap text-sm align-top">
          {renderValue(getValue(c.data, path))}
        </TableCell>
      ))}
    </TableRow>
  );
}

function StatusBadge({ status }) {
  if (status === 'win') return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0 ml-2">WIN</Badge>;
  if (status === 'loss') return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0 ml-2">LOSS</Badge>;
  return <Badge variant="outline" className="border-white/10 text-muted-foreground ml-2">NEUTRAL</Badge>;
}

function ComparisonRow({ label, myData, competitors, field, subField, isArray, isNumber }) {
  const myVal = myData[field];

  return (
    <TableRow className="hover:bg-white/5 border-white/10 transition-colors">
      <TableCell className="font-medium text-muted-foreground w-[150px] align-top">{label}</TableCell>
      <TableCell className="max-w-[250px] align-top">
        <div className="font-medium text-foreground break-words whitespace-pre-wrap">
          {isArray ? (myVal?.join(', ') || '-') : (myVal || <span className="text-muted-foreground italic">Missing</span>)}
        </div>
        {subField && myVal && <div className="text-xs text-muted-foreground mt-1">{myVal.length} chars</div>}
      </TableCell>

      {competitors.map((c, i) => {
        const compVal = c.data[field];
        let status = 'neutral';

        // Determine status based on comparison logic from backend or simple check
        // Using simple check here for display
        if (c.comparison[field]) {
          if (c.comparison[field].missing1) status = 'loss';
          else if (c.comparison[field].missing2) status = 'win';
          else if (isNumber) status = myVal < compVal ? 'loss' : 'win';
        }

        return (
          <TableCell key={i} className="max-w-[250px] align-top">
            <div className="font-medium text-foreground break-words whitespace-pre-wrap">
              {isArray ? (compVal?.join(', ') || '-') : (compVal || <span className="text-muted-foreground italic">Missing</span>)}
            </div>
            {subField && compVal && <div className="text-xs text-muted-foreground mt-1">{compVal.length} chars</div>}
            <StatusBadge status={status} />
          </TableCell>
        );
      })}
    </TableRow>
  );
}

function CompetitorFinder({ onSelect, myUrl, setMyUrl, competitors, setCompetitors, handleAnalyze, loading, error }) {
  // Helper to auto-fix URLs
  const fixUrl = (url) => {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const onAnalyzeClick = () => {
    setMyUrl(fixUrl(myUrl));
    const fixedComps = competitors.map(c => fixUrl(c));
    setCompetitors(fixedComps);
    // Small delay to allow state update before analyze
    setTimeout(handleAnalyze, 0);
  };

  const loadPredefined = (url1, ...competitorUrls) => {
    setMyUrl(url1);
    setCompetitors(competitorUrls);
    // Trigger analysis automatically
    setTimeout(() => {
    }, 0);
  };

  const addCompetitor = () => {
    if (competitors.length < 3) {
      setCompetitors([...competitors, '']);
    }
  };

  const removeCompetitor = (index) => {
    const newComps = competitors.filter((_, i) => i !== index);
    setCompetitors(newComps.length ? newComps : ['']);
  };

  const updateCompetitor = (index, value) => {
    const newComps = [...competitors];
    newComps[index] = value;
    setCompetitors(newComps);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-blue-400">Your Website</label>
          <Input
            placeholder="google.com"
            value={myUrl}
            onChange={(e) => setMyUrl(e.target.value)}
            className="bg-background/50 border-white/10 h-12"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-purple-400">Competitor Websites (Max 3)</label>
            {competitors.length < 3 && (
              <Button variant="ghost" size="sm" onClick={addCompetitor} className="h-8 text-xs text-muted-foreground hover:text-white">
                <Plus className="size-3 mr-1" /> Add
              </Button>
            )}
          </div>

          {competitors.map((comp, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Competitor ${index + 1}`}
                value={comp}
                onChange={(e) => updateCompetitor(index, e.target.value)}
                className="bg-background/50 border-white/10 h-12"
              />
              {competitors.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeCompetitor(index)} className="h-12 w-12 text-muted-foreground hover:text-red-400">
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Predefined Comparisons */}
      <div className="flex flex-wrap justify-center gap-3">
        <span className="text-sm text-muted-foreground self-center mr-2">Quick Compare:</span>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10 text-xs"
          onClick={() => loadPredefined('https://google.com', 'https://duckduckgo.com', 'https://bing.com')}
        >
          Google vs DuckDuckGo vs Bing
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10 text-xs"
          onClick={() => loadPredefined('https://semrush.com', 'https://ahrefs.com', 'https://similarweb.com')}
        >
          Semrush vs Ahrefs vs SimilarWeb
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10 text-xs"
          onClick={() => loadPredefined('https://attentioninsight.com', 'https://neuronsinc.com', 'https://dragonflyai.co')}
        >
          Attention Insight vs Neurons vs Dragonfly AI
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10 text-xs"
          onClick={() => loadPredefined('https://featurevoice.io', 'https://feature.vote', 'https://featurebase.app')}
        >
          Feature Voice vs Feature Vote vs Featurebase
        </Button>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          size="lg"
          onClick={onAnalyzeClick}
          disabled={loading || !myUrl || competitors.every(c => !c)}
          className="w-full md:w-auto px-12 h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-900/20"
        >
          {loading ? 'Analyzing...' : 'Start Comparison'}
        </Button>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

function LighthouseCard({ scores }) {
  return (
    <Card className="glass-panel border-0 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lighthouse Core Web Vitals</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <LighthouseMetric label="Performance" score={scores.performance} />
        <LighthouseMetric label="Accessibility" score={scores.accessibility} />
        <LighthouseMetric label="Best Practices" score={scores.bestPractices} />
        <LighthouseMetric label="SEO" score={scores.seo} />
      </CardContent>
    </Card>
  );
}

function LighthouseMetric({ label, score }) {
  let color = 'text-red-400';
  if (score >= 90) color = 'text-green-400';
  else if (score >= 50) color = 'text-yellow-400';

  return (
    <div className="flex flex-col items-center p-3 bg-white/5 rounded-lg">
      <div className={`text-2xl font-bold ${color}`}>{score}</div>
      <div className="text-xs text-muted-foreground mt-1 text-center">{label}</div>
    </div>
  );
}
