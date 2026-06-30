import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import BackButton from '../../components/BackButton';
import Breadcrumb from '../../components/Breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { callGemini } from '../../services/gemini';

/* ============================================
   CLEAN & BUGGY DEMO PROJECTS
============================================ */

const DEMO_PROJECTS = {
  counter: {
    files: {
      'index.html': `<!DOCTYPE html>
<html>
<head>
<title>Counter</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
<h1>Counter</h1>
<div id="count">0</div>
<button onclick="increment()">+</button>
<button onclick="decrement()">-</button>
</div>
<script src="script.js"></script>
</body>
</html>`,
      'style.css': `body{font-family:Arial;text-align:center;padding-top:50px}`,
      'script.js': `let count = 0;
const display = document.getElementById("count");

function increment(){
  count++;
  display.innerText = count;
}

function decrement(){
  count--;
  display.innerText = count;
}`
    }
  },

  buggy_counter: {
    files: {
      'index.html': `<!DOCTYPE html>
<html>
<head>
<title>Counter</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
<h1>Counter</h1>
<div id="count">0</div>
<button onclick="increment()">+</button>
<button onclick="decrement()">-</button>
</div>
<script src="script.js"></script>
</body>
</html>`,
      'style.css': `body{font-family:Arial;text-align:center;padding-top:50px}`,
      'script.js': `let count = 0
const display = document.getElementById("count")

function increment(){
  count++
  display.innerText = coun
}

function decrement(){
  count--
  display.innerText = count
}`
    }
  }
};

const BuildWorkspace = () => {
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const modeFromURL = searchParams.get("mode") || "build";

  const [activeMode] = useState(modeFromURL); // Controlled ONLY by URL
  const [files, setFiles] = useState({});
  const [currentFile, setCurrentFile] = useState("");
  const [code, setCode] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const editorRef = useRef(null);

  /* ============================================
     AUTO LOAD MODE
  ============================================ */

  useEffect(() => {
    if (activeMode === "debug") {
      const project = DEMO_PROJECTS.buggy_counter;
      setFiles(project.files);
      setCurrentFile("script.js");
      setCode(project.files["script.js"]);
      setAiExplanation("");
    }
  }, [activeMode]);

  /* ============================================
     FILE SYNC
  ============================================ */

  useEffect(() => {
    if (currentFile) {
      setFiles(prev => ({ ...prev, [currentFile]: code }));
    }
  }, [code, currentFile]);

  useEffect(() => {
    const handlePreviewExit = (event) => {
      if (event.data?.type === 'preview-exit') {
        editorRef.current?.focus?.();
      }
    };

    window.addEventListener('message', handlePreviewExit);
    return () => window.removeEventListener('message', handlePreviewExit);
  }, []);

  /* ============================================
     PREVIEW
  ============================================ */

  const generatePreview = () => {
    if (!files["index.html"]) return "<html><body>No preview</body></html>";

    let html = files["index.html"];
    const css = files["style.css"] || "";
    const js = files["script.js"] || "";

    const previewBridge = `
      <script>
        window.addEventListener('keydown', function(event) {
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            window.parent.postMessage({ type: 'preview-exit' }, '*');
          }
        }, true);
      </script>
    `;

    html = html.replace("</head>", `<style>${css}</style></head>`);
    html = html.replace(
      /<script src="script\.js"><\/script>/,
      `<script>${js}</script>`
    );

    html = html.includes('</body>')
      ? html.replace('</body>', `${previewBridge}</body>`)
      : `${html}${previewBridge}`;

    return html;
  };

  /* ============================================
     DEBUG ANALYSIS
  ============================================ */

  const analyzeDebugCode = () => {
    setAiExplanation("");
    console.log(code);
    const issues = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      const lineNo = index + 1;

      // Undefined variable
      const match = line.match(/\bcoun\b/);

      if (match) {
        issues.push({
          severity: "Major",
          line: lineNo,
          problem: "Undefined variable 'coun'.",
          fix: "Replace 'coun' with 'count'."
        });
      }

      // Undefined variable username
      if (line.includes("console.log(username)")) {
        issues.push({
          severity: "Major",
          line: lineNo,
          problem: "'username' is not defined.",
          fix: "Declare username or use the correct variable."
        });
      }

      // Assignment instead of comparison
      if (
        line.includes("if(") &&
        line.includes("=") &&
        !line.includes("==") &&
        !line.includes("===")
      ) {
        issues.push({
          severity: "Major",
          line: lineNo,
          problem: "Assignment '=' used instead of comparison.",
          fix: "Use '==' or '==='."
        });
      }

      // Loop bug
      if (line.includes("<= arr.length")) {
        issues.push({
          severity: "Critical",
          line: lineNo,
          problem: "Loop accesses arr[arr.length].",
          fix: "Replace '<=' with '<'."
        });
      }

      // React onclick
      if (line.includes("onclick=")) {
        issues.push({
          severity: "Major",
          line: lineNo,
          problem: "React uses onClick instead of onclick.",
          fix: "Use onClick."
        });
      }

      // Counter variable
      if (line.includes("{counter}")) {
        issues.push({
          severity: "Major",
          line: lineNo,
          problem: "'counter' is undefined.",
          fix: "Use 'count'."
        });
      }

      // Missing return
      if (
        line.includes("num * num") &&
        index > 0 &&
        !lines[index - 1].includes("return")
      ) {
        issues.push({
          severity: "Minor",
          line: lineNo,
          problem: "Missing return statement.",
          fix: "return num * num;"
        });
      }

      // Undefined function
      if (line.includes("displayStudents(")) {
        issues.push({
          severity: "Critical",
          line: lineNo,
          problem: "displayStudents() is undefined.",
          fix: "Create displayStudents()."
        });
      }

      // Wrong method
      if (line.includes("toUppercase(")) {
        issues.push({
          severity: "Minor",
          line: lineNo,
          problem: "Method should be toUpperCase().",
          fix: "Replace with toUpperCase()."
        });
      }

      // Null access
      if (line.includes("user.name")) {
        issues.push({
          severity: "Critical",
          line: lineNo,
          problem: "Possible null object access.",
          fix: "Check if user is null."
        });
      }

      // Const reassignment
      if (line.includes("score =")) {
        issues.push({
          severity: "Critical",
          line: lineNo,
          problem: "Cannot reassign const variable.",
          fix: "Use let instead of const."
        });
      }

      // Array index
      if (line.match(/\[\d+\]\./)) {
        issues.push({
          severity: "Major",
          line: lineNo,
          problem: "Possible array index out of bounds.",
          fix: "Check array length."
        });
      }
    });

    // Infinite loop
    if (
      code.includes("while(") &&
      !code.includes("++") &&
      !code.includes("--")
    ) {
      issues.push({
        severity: "Critical",
        line: "-",
        problem: "Possible infinite loop.",
        fix: "Increment the loop variable."
      });
    }

    if (issues.length === 0) {
      setAiExplanation("## ✅ No issues detected.");
      return;
    }

    let report = "# 🐞 Debug Report\n\n";

    issues.forEach((issue, index) => {
      report += `## ${index + 1}. ${issue.severity} Issue\n`;
      report += `📍 Line: ${issue.line}\n`;
      report += `❌ Problem: ${issue.problem}\n`;
      report += `✅ Fix: ${issue.fix}\n\n`;
    });

    report += `---\n\n### Total Issues Found: ${issues.length}`;

    setAiExplanation(report);
  };

  const normalizeGeneratedProject = (response) => {
    if (!response || typeof response !== 'object') return null;

    const files = response.files;
    if (!files || typeof files !== 'object') return null;

    const requiredFiles = ['index.html', 'style.css', 'script.js'];
    if (!requiredFiles.every(fileName => typeof files[fileName] === 'string')) {
      return null;
    }

    return {
      files: {
        'index.html': files['index.html'],
        'style.css': files['style.css'],
        'script.js': files['script.js']
      },
      explanation: typeof response.explanation === 'string'
        ? response.explanation
        : 'Project generated successfully.'
    };
  };

  const applyGeneratedProject = (project) => {
    setFiles(project.files);
    setCurrentFile('script.js');
    setCode(project.files['script.js']);
    setAiExplanation(project.explanation || '');
  };

  const generateBuildPrompt = (idea) => `You are a senior frontend code generator.
Return ONLY a single JSON object with this exact shape:
{  "files": {    "index.html": "...",    "style.css": "...",    "script.js": "..."  },  "explanation": "A short explanation of what was built and how it works"}

Build this project idea: ${idea}

Requirements:
- The response must be valid JSON only.
- Keep the project small and self-contained.
- Make sure the files work together as a complete vanilla HTML/CSS/JavaScript app.
- Put all code inside the JSON string values, using escaped newlines where needed.
`;

  const generateDebugPrompt = (currentFiles) => `You are a senior debugging assistant.
Return ONLY a single JSON object with this exact shape:
{  "files": {    "index.html": "...",    "style.css": "...",    "script.js": "..."  },  "explanation": "A plain-language explanation of what was wrong and how it was fixed"}

Fix the bug(s) in this codebase:
${JSON.stringify(currentFiles, null, 2)}

Requirements:
- Return valid JSON only.
- Keep the file names exactly the same.
- Correct the broken code and keep the app behavior intact.
- Explain the bug fixes briefly in the explanation field.
`;

  /* ============================================
     BUILD GENERATION
  ============================================ */

  const generateBuild = async () => {
    const fallbackProject = {
      files: DEMO_PROJECTS.counter.files,
      explanation: `# Project Generated\n\nDemo content loaded because AI generation is unavailable.\n\nFiles:\n- index.html\n- style.css\n- script.js\n`
    };

    setIsProcessing(true);
    setAiExplanation('');

    try {
      const idea = userInput.trim() || 'a clean interactive counter project';
      const result = await callGemini(generateBuildPrompt(idea), { json: true });
      const normalized = normalizeGeneratedProject(result);

      if (!normalized) {
        throw new Error('Gemini returned an unexpected project format.');
      }

      applyGeneratedProject(normalized);
    } catch (error) {
      console.error('Build generation failed:', error);
      applyGeneratedProject(fallbackProject);
      setAiExplanation(`## AI generation unavailable\n\nUsing demo content so the workspace stays usable.\n\n${error instanceof Error ? error.message : 'Unknown error.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const runDebugAnalysis = async () => {
    setIsProcessing(true);
    setAiExplanation('');

    try {
      const result = await callGemini(generateDebugPrompt(files), { json: true });
      const normalized = normalizeGeneratedProject(result);

      if (!normalized) {
        throw new Error('Gemini returned an unexpected fix format.');
      }

      applyGeneratedProject(normalized);
    } catch (error) {
      console.error('Debug analysis failed:', error);
      analyzeDebugCode();
      setAiExplanation(prev => prev || `## AI debug analysis unavailable\n\nFalling back to the built-in static report.\n\n${error instanceof Error ? error.message : 'Unknown error.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ============================================
     SUBMIT HANDLER
  ============================================ */

  const handleSubmit = () => {
    if (activeMode === "build") {
      generateBuild();
    } else if (activeMode === "debug") {
      runDebugAnalysis();
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.html')) return '🌐';
    if (fileName.endsWith('.css')) return '🎨';
    if (fileName.endsWith('.js')) return '⚡';
    return '📄';
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md z-10">
        <div className="flex gap-4 items-center">
          <BackButton className="!px-3 !py-1.5 !text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" />
          <Breadcrumb />
          <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
          <h1 className="text-sm font-bold tracking-wider uppercase font-display bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-300 bg-clip-text text-transparent">
            {activeMode === "build" ? "Build Workspace IDE" : "Debug Workspace IDE"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/40 border border-indigo-900/50 text-indigo-400 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI Enabled
          </div>
          <Link to="/profile" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-250 transition-colors">
            Profile Settings
          </Link>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* FILES EXPLORER */}
        <div className="w-56 bg-slate-100/30 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col">
          <h3 className="text-xxs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Workspace Files</h3>
          <div className="space-y-1 flex-1">
            {Object.keys(files).length > 0 ? (
              Object.keys(files).map(file => {
                const isActive = currentFile === file;
                return (
                  <motion.div
                    key={file}
                    onClick={() => {
                      setCurrentFile(file);
                      setCode(files[file]);
                    }}
                    whileHover={{ x: 2 }}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all border ${isActive
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 font-bold shadow-sm'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-slate-900/40'
                      }`}
                  >
                    <span>{getFileIcon(file)}</span>
                    <span className="truncate">{file}</span>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-[10px] text-slate-500 dark:text-slate-550 text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No active files.<br />Describe a project below!
              </div>
            )}
          </div>
        </div>

        {/* EDITOR AREA */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
          <div className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-955/30 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{currentFile || 'no-file-selected'}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <Editor
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              height="100%"
              language={
                currentFile.endsWith(".html")
                  ? "html"
                  : currentFile.endsWith(".css")
                    ? "css"
                    : "javascript"
              }
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={isDark ? "vs-dark" : "light"}
              options={{
                fontSize: 14,
                fontFamily: 'Consolas, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: true,
                padding: { top: 12 }
              }}
            />
          </div>

          {/* LINTING BAR */}
          <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-5 py-2 flex items-center justify-between text-xxs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex gap-4">
              <span>Lines: {code ? code.split('\n').length : 0}</span>
              <span>Language: {currentFile.endsWith(".html") ? "HTML" : currentFile.endsWith(".css") ? "CSS" : currentFile ? "JS" : "-"}</span>
            </div>
            <span>Monaco IDE Core</span>
          </div>
        </div>

        {/* RIGHT PANEL - AI REPORT AND PREVIEW */}
        <div className="w-96 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-950/70 font-display flex items-center justify-between">
            <span>{activeMode === "build" ? "🤖 AI Explainer" : "🐞 Debug Audit"}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex-1 p-5 overflow-auto text-xs leading-relaxed text-slate-600 dark:text-slate-400 prose prose-invert font-sans border-b border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-600">
                <span className="text-3xl mb-2 animate-spin">⚙️</span>
                <p className="text-slate-500 text-xxs font-semibold uppercase tracking-wider">Generating response</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 px-4 leading-normal">
                  Gemini is building the response now.
                </p>
              </div>
            ) : aiExplanation ? (
              <div className="whitespace-pre-wrap leading-normal font-sans">
                {aiExplanation}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-600">
                <span className="text-3xl mb-2">⚡</span>
                <p className="text-slate-500 text-xxs font-semibold uppercase tracking-wider">Waiting for trigger</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 px-4 leading-normal">
                  {activeMode === 'build' ? 'Type a project request below and click generate' : 'Click "Analyze Code" at the bottom to audit bugs'}
                </p>
              </div>
            )}
          </div>

          {/* SANDBOX WEB PREVIEW */}
          {showPreview ? (
            <div className="h-72 flex flex-col bg-slate-100 dark:bg-slate-950">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-850 flex items-center gap-2 bg-slate-50/40 dark:bg-slate-900/40">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex gap-1.5 items-center cursor-pointer"
                  aria-label="Close preview"
                  title="Close preview"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500/60" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <span className="w-2 h-2 rounded-full bg-green-500/60" />
                </button>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-xs ml-2 select-none">Web Browser Live Preview</span>
              </div>
              <div className="flex-1 bg-white relative">
                {Object.keys(files).length > 0 ? (
                  <iframe
                    srcDoc={generatePreview()}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts"
                    title="preview"
                    tabIndex={0}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center text-slate-500 dark:text-slate-400 text-xs p-6 leading-relaxed">
                    <span>No active preview.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Preview closed
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-[11px] font-semibold hover:bg-primary-500 transition-colors"
              >
                Reopen preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* INPUT / CONTROL CONSOLE */}
      <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-850 flex gap-3 items-center z-10">
        <div className="flex-1 relative">
          <input
            className="w-full px-5 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 text-xs transition-all placeholder-slate-400 dark:placeholder-slate-600 font-sans"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder={
              activeMode === "build"
                ? "Describe project elements to generate (e.g. counter project)..."
                : "Type custom guidelines or click 'Analyze Code' to run lint report..."
            }
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="btn-primary !px-6 !py-3 !rounded-2xl !text-xs whitespace-nowrap shadow-[0_4px_15px_rgba(99,102,241,0.25)] font-bold tracking-wide"
        >
          {activeMode === "build" ? "🪄 Generate Sandbox" : "🔧 Analyze Code"}
        </motion.button>
      </div>
    </div>
  );
};

export default BuildWorkspace;