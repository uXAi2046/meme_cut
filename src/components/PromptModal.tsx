import { X, Copy, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PromptBlockProps {
  label: string;
  labelColorClass: string;
  content: string;
  copyText?: string;
  copiedText?: string;
}

function PromptBlock({ label, labelColorClass, content, copyText = 'Copy', copiedText = 'Copied' }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group">
      <div className={`absolute -top-2.5 left-3 bg-white px-2 text-xs font-bold ${labelColorClass} tracking-wider select-none`}>
        {label}
      </div>
      <div className="absolute -top-3 right-3 bg-white px-1">
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full border border-gray-200 hover:border-blue-200 transition-all"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? copiedText : copyText}
        </button>
      </div>
      <div className="bg-gray-50 hover:bg-gray-50/80 rounded-xl p-4 text-sm text-gray-600 leading-relaxed border border-gray-200 font-mono transition-colors">
        {content}
      </div>
    </div>
  );
}

export function PromptModal({ isOpen, onClose }: PromptModalProps) {
  if (!isOpen) return null;

  const englishPrompt = `Generate a Q-version Gif drawing of the character in the image for me, in LINE style, as a half-body portrait emoji pack, pay attention to getting the headwear correct
Colorful hand-drawn style, using a 4x6 layout, covering a variety of common chat phrases, or some related entertainment memes
Other requirements: Do not copy the original image. All labels should be handwritten simplified Chinese.
The generated image should be 4K resolution 16:9`;

  const chinesePrompt = `为我生成图中角色的绘制 Q 版的，LINE 风格的半身像表情包，注意头饰要正确
彩色手绘风格，使用 4x6 布局，涵盖各种各样的常用聊天语句，或是一些有关的娱乐 meme
其他需求：不要原图复制，所有标注为手写简体中文，中文文字横向或者纵向随机排列
生成的图片需为 4K 分辨率 16:9`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in scale-100 opacity-100 transform transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">表情包生成教程</h2>
              <p className="text-sm text-gray-500">AI 提示词参考</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Prompt Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Prompt 提示词</h3>
            </div>
            
            <div className="space-y-6">
              <PromptBlock 
                label="中文参考" 
                labelColorClass="text-emerald-600" 
                content={chinesePrompt}
                copyText="复制"
                copiedText="已复制"
              />
              <PromptBlock 
                label="ENGLISH" 
                labelColorClass="text-blue-600" 
                content={englishPrompt} 
              />
            </div>
          </div>

          {/* Tutorial Section */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900">使用教学</h3>
            <p className="text-sm text-gray-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-justify">
              直接拿一张图片当底图，输入上面的 Prompt 就可以了。或者你可以微调一下，比如文字随机横向/竖向排列，比例 1:1 等等。生成后上传到本工具，使用 4×6 布局切割即可。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
