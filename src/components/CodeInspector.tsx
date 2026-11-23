import React, { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { generateAppFilterXml, generateDrawableXml, generateIconPackXml } from '../data/icons';
import { getAndroidProjectFiles, getGitHubWorkflowYaml } from '../lib/androidProjectTemplates';

type FileTab = 'workflow' | 'appfilter' | 'manifest' | 'drawable';

export const CodeInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FileTab>('workflow');
  const [copied, setCopied] = useState(false);

  const files = useMemo(() => {
    const appfilterXml = generateAppFilterXml();
    const drawableXml = generateDrawableXml();
    const iconpackXml = generateIconPackXml();
    const project = getAndroidProjectFiles({ appfilterXml, drawableXml, iconpackXml });
    return {
      workflow: {
        path: '.github/workflows/build-apk.yml',
        content: getGitHubWorkflowYaml('android-iconpack'),
      },
      appfilter: {
        path: 'android-iconpack/app/src/main/res/xml/appfilter.xml',
        content: appfilterXml,
      },
      manifest: {
        path: 'android-iconpack/app/src/main/AndroidManifest.xml',
        content: project['app/src/main/AndroidManifest.xml'],
      },
      drawable: {
        path: 'android-iconpack/app/src/main/res/xml/drawable.xml',
        content: drawableXml,
      },
    };
  }, []);

  const current = files[activeTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto">
          {(
            [
              { id: 'workflow', label: 'build-apk.yml' },
              { id: 'appfilter', label: 'appfilter.xml' },
              { id: 'manifest', label: 'AndroidManifest.xml' },
              { id: 'drawable', label: 'drawable.xml' },
            ] as { id: FileTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-mono-code text-xs text-slate-500 truncate max-w-[280px]">
            {current.path}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Disalin' : 'Salin Kode'}</span>
          </button>
        </div>
      </div>

      <pre className="p-4 bg-slate-950 text-slate-100 font-mono-code text-xs leading-relaxed overflow-x-auto max-h-[380px] overflow-y-auto">
        <code>{current.content}</code>
      </pre>
    </div>
  );
};
