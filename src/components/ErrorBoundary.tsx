import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI exception caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7fbfc] flex items-center justify-center p-6 text-center font-sans" dir="rtl">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#dbe8ed] shadow-xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eaf6fa] text-[#134e5e] flex items-center justify-center shadow-xs">
              <AlertCircle className="w-8 h-8 text-[#2e9e66]" />
            </div>
            <h2 className="text-xl font-black text-[#0e3c48]">مبادرة عافية تُزهر</h2>
            <p className="text-xs text-[#526f78] leading-relaxed">
              حدث خطأ أثناء تحميل بعض عناصر الصفحة. اضغط على الزر أدناه لإعادة تنشيط الصفحة.
            </p>
            {this.state.error && (
              <div className="p-3 bg-stone-50 rounded-xl text-[11px] font-mono text-stone-500 text-left dir-ltr max-h-24 overflow-auto border border-stone-200">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#2e9e66] hover:bg-[#238253] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة تحميل الصفحة</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
