import React, { useState, useRef, useEffect } from 'react';
import { generateIntegrationCode } from './services/gemini';
import { Icons } from './components/Icon';
import MarkdownRenderer from './components/MarkdownRenderer';

const App: React.FC = () => {
  const [apiDoc, setApiDoc] = useState('');
  const [language, setLanguage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);

  // Cycle through loading messages to keep user engaged
  useEffect(() => {
    if (!isGenerating) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!apiDoc.trim() || !language.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedCode('');

    try {
      await generateIntegrationCode(
        apiDoc,
        language,
        (chunk) => {
          setGeneratedCode(chunk);
        }
      );
    } catch (error) {
      console.error("Error generating code:", error);
      setGeneratedCode("# Error\nFailed to generate code. Please check your API key and network connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all inputs?")) {
      setApiDoc('');
      setLanguage('');
      setGeneratedCode('');
    }
  };

  const loadingMessages = [
    "Reading documentation & analyzing endpoints...",
    "Designing client architecture & error handling...",
    "Writing usage examples & documentation..."
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 rounded-lg p-2 text-white shadow-md shadow-indigo-200">
            <Icons.Terminal className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg tracking-tight">API Client Generator</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* LEFT PANEL: CONFIGURATION */}
        <div className="w-full lg:w-[420px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl lg:shadow-none">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-8">
              
              {/* Introduction */}
              <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                <h3 className="text-indigo-900 font-semibold text-sm mb-1 flex items-center gap-2">
                  <Icons.Sparkles className="h-4 w-4" />
                  AI-Powered Integration
                </h3>
                <p className="text-indigo-800/70 text-xs leading-relaxed">
                  Paste the link to your API documentation below. I'll generate a production-ready client, complete with error handling and a README.
                </p>
              </div>

              {/* Input 1: Docs URL */}
              <div className="space-y-3 group">
                <label className="flex items-center justify-between text-sm font-semibold text-gray-700">
                  <span className="flex items-center gap-2">
                    <Icons.Link className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    API Documentation URL
                  </span>
                </label>
                <input
                  type="url"
                  value={apiDoc}
                  onChange={(e) => setApiDoc(e.target.value)}
                  placeholder="e.g. https://stripe.com/docs/api"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
                  disabled={isGenerating}
                />
              </div>

              {/* Input 2: Language */}
              <div className="space-y-3 group">
                 <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Icons.Code className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  Target Language
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. Python, TypeScript, Node.js, Go..."
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium"
                    disabled={isGenerating}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Icons.ArrowRight className="h-4 w-4 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !apiDoc.trim() || !language.trim()}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md ${
                isGenerating || !apiDoc.trim() || !language.trim()
                  ? 'bg-gray-300 cursor-not-allowed shadow-none transform-none'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <Icons.RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Icons.BrainCircuit className="h-5 w-5" />
                  <span>Generate Client Code</span>
                </>
              )}
            </button>
            
            {(apiDoc || language) && !isGenerating && (
              <button 
                onClick={handleClear}
                className="w-full mt-3 py-2 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
              >
                <Icons.Trash2 className="h-3 w-3" />
                Reset Form
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: OUTPUT */}
        <div className="flex-1 bg-gray-50/50 relative flex flex-col min-w-0" ref={outputRef}>
          
          {generatedCode ? (
            /* RESULT STATE */
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Sticky Result Header */}
              <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-10 sticky top-0">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">Generation Complete</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    copied 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                  }`}
                >
                  {copied ? <Icons.Check className="h-3.5 w-3.5" /> : <Icons.Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy All'}
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-8 md:p-12">
                     <MarkdownRenderer content={generatedCode} />
                  </div>
                </div>
                <div className="h-10"></div>
              </div>
            </div>

          ) : isGenerating ? (
            /* LOADING STATE */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 relative z-10">
                      <Icons.BrainCircuit className="h-10 w-10 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {loadingMessages[loadingStep]}
                    </h3>
                    <p className="text-sm text-gray-500">This usually takes about 10-20 seconds.</p>
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-between items-center px-4 relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
                  {[0, 1, 2].map((step) => (
                    <div 
                      key={step}
                      className={`h-3 w-3 rounded-full border-2 transition-all duration-500 ${
                        loadingStep >= step 
                          ? 'bg-indigo-600 border-indigo-600 scale-125' 
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          ) : (
            /* EMPTY / ONBOARDING STATE */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
              <div className="max-w-lg w-full">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6">
                    <Icons.Sparkles className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Build an API Client in Seconds</h2>
                  <p className="text-gray-500 mb-10 text-sm leading-relaxed">
                    Stop writing boilerplate code. Generate a complete, production-ready SDK with proper authentication, retries, and types.
                  </p>
                  
                  {/* Steps */}
                  <div className="space-y-4 text-left">
                    {[
                      { icon: Icons.Link, title: "Paste Doc Link", desc: "URL to the API documentation." },
                      { icon: Icons.Code, title: "Choose Language", desc: "Python, TypeScript, Go, etc." },
                      { icon: Icons.Check, title: "Get Production Code", desc: "Ready to copy & deploy." }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-indigo-50/30 transition-colors">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-gray-600">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;