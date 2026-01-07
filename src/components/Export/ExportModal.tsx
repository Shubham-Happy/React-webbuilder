import { useState, useMemo } from 'react';
import { X, Copy, Download, FileCode, FileJson, Check } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { generateHTMLExport, generateCSSExport } from '../../utils/exportHTML';
import { generateReactExport } from '../../utils/exportReact';
import './ExportModal.css';

interface ExportModalProps {
  onClose: () => void;
}

type ExportFormat = 'html' | 'react';

function ExportModal({ onClose }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('html');
  const [copied, setCopied] = useState(false);
  
  const { elements } = useBuilderStore();

  const exportedCode = useMemo(() => {
    if (format === 'html') {
      const html = generateHTMLExport(elements);
      const css = generateCSSExport(elements);
      return `<!-- index.html -->\n${html}\n\n/* styles.css */\n${css}`;
    } else {
      return generateReactExport(elements);
    }
  }, [elements, format]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (format === 'html') {
      const html = generateHTMLExport(elements);
      const css = generateCSSExport(elements);
      
      // Download HTML
      downloadFile('index.html', html);
      // Download CSS
      downloadFile('styles.css', css);
    } else {
      const reactCode = generateReactExport(elements);
      downloadFile('App.tsx', reactCode);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export Code</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="format-selector">
          <button
            className={`format-btn ${format === 'html' ? 'active' : ''}`}
            onClick={() => setFormat('html')}
          >
            <FileCode size={18} />
            <span>HTML/CSS</span>
          </button>
          <button
            className={`format-btn ${format === 'react' ? 'active' : ''}`}
            onClick={() => setFormat('react')}
          >
            <FileJson size={18} />
            <span>React</span>
          </button>
        </div>

        <div className="code-preview">
          <Editor
            height="100%"
            language={format === 'html' ? 'html' : 'typescript'}
            value={exportedCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 }
            }}
          />
        </div>

        <div className="modal-actions">
          <button className="action-btn secondary" onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <button className="action-btn primary" onClick={handleDownload}>
            <Download size={18} />
            <span>Download Files</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
