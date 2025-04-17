'use client';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { pdf } from '@react-pdf/renderer';
import MarkdownPDF from '@/src/components/MarkdownPDF';

declare module 'marked' {
  interface MarkedOptions {
    highlight?: (code: string, language: string) => string;
    langPrefix?: string;
  }
}

export default function Home() {
  const [markdown, setMarkdown] = useState(
    '# Hello World\n\n**Bold text** and *italic*'
  );
  const [html, setHtml] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    marked.setOptions({
      highlight: (code: string, lang: string) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
      langPrefix: 'hljs language-',
    });

    const saved = localStorage.getItem('markdown-draft');
    if (saved) setMarkdown(saved);
  }, []);

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const parsed = await marked.parse(markdown);
        setHtml(DOMPurify.sanitize(parsed as string));
      } catch (error) {
        console.error('Error parsing markdown:', error);
        setHtml('<p>Error rendering markdown</p>');
      }
    };
    parseMarkdown();
    localStorage.setItem('markdown-draft', markdown);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">MD Export</h1>
        <p className="text-gray-600">Markdown to PDF Converter</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-[calc(100vh-72px)]">
        <div className="flex flex-col border rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="border-b p-4 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Editor</h2>
          </div>
          <textarea
            className="w-full h-full p-4 font-mono text-gray-800 focus:outline-none resize-none flex-1"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Digite seu Markdown aqui..."
          />
        </div>

        <div className="flex flex-col border rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="border-b p-4 bg-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Preview</h2>
            <button
              onClick={exportToPDF}
              disabled={isConverting}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors ${
                isConverting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isConverting ? 'Gerando...' : 'Exportar PDF'}
            </button>
          </div>
          <div
            className="prose p-4 text-black overflow-y-auto max-w-none flex-1"
            id="preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
