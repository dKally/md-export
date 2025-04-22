'use client';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { pdf } from '@react-pdf/renderer';
import MarkdownPDF, { MarkdownRenderer } from '@/src/components/MarkdownPDF';

declare module 'marked' {
  interface MarkedOptions {
    highlight?: (code: string, language: string) => string;
    langPrefix?: string;
  }
}

export default function Home() {
  const [markdown, setMarkdown] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    marked.setOptions({
      highlight: (code: string, lang: string) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
    });

    const saved = localStorage.getItem('markdown-draft');
    setMarkdown(saved || '# Hello World\n\n**Bold text** and *italic*');

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (markdown) {
      localStorage.setItem('markdown-draft', markdown);
    }
  }, [markdown]);

  const exportToPDF = async () => {
    setIsConverting(true);
    try {
      const blob = await pdf(<MarkdownPDF markdown={markdown} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'markdown-export.pdf';
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <header
        className={`shadow-sm py-4 px-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">MD Export</h1>
            <p className="text-sm opacity-80">Markdown to PDF Converter</p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-[calc(100vh-72px)]">
        <div
          className={`flex flex-col rounded-lg shadow-sm overflow-hidden transition-colors duration-200 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div
            className={`border-b p-4 flex justify-between items-center ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h2 className="text-xl font-bold">Editor</h2>
            <div className="text-sm opacity-70">
              {markdown.length} caracteres
            </div>
          </div>
          <textarea
            className={`w-full h-full p-4 font-mono focus:outline-none resize-none flex-1 transition-colors duration-200 ${
              isDarkMode
                ? 'bg-gray-800 text-gray-100 placeholder-gray-500'
                : 'bg-white text-gray-800 placeholder-gray-400'
            }`}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Digite seu Markdown aqui..."
          />
        </div>

        <div
          className={`flex flex-col rounded-lg shadow-sm overflow-hidden transition-colors duration-200 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div
            className={`border-b p-4 flex justify-between items-center ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <h2 className="text-xl font-bold">Preview</h2>
            <button
              onClick={exportToPDF}
              disabled={isConverting}
              className={`px-4 py-2 rounded transition-all ${
                isConverting
                  ? 'bg-blue-500 opacity-50 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isConverting ? 'Gerando PDF...' : 'Exportar PDF'}
            </button>
          </div>
          <div
            className={`overflow-y-auto flex-1 p-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <MarkdownRenderer markdown={markdown} asHtml />
          </div>
        </div>
      </div>
    </div>
  );
}
