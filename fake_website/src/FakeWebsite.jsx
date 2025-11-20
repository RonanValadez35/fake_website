import React, { useState, useEffect } from 'react';
import { Download, Save, FileText, Building2, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const PurchaseAgreementPortal = () => {
  const [formData, setFormData] = useState({});
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedDrafts();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  const sendEmailToBackend = async (formData, action) => {
    try {
      // In production on Vercel, use relative path (same domain)
      // In development, use the backend server URL
      const apiUrl = import.meta.env.VITE_API_URL || 
        (import.meta.env.DEV ? 'http://localhost:3001' : '/api');
      const response = await fetch(`${apiUrl}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, action }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw - allow the action to continue even if email fails
      return null;
    }
  };

  const loadSavedDrafts = async () => {
    setIsLoading(true);
    try {
      const result = await window.storage.list('purchase:');
      if (result && result.keys) {
        const drafts = await Promise.all(
          result.keys.map(async (key) => {
            const data = await window.storage.get(key);
            return data ? { key, ...JSON.parse(data.value) } : null;
          })
        );
        setSavedDrafts(drafts.filter(Boolean).sort((a, b) => 
          new Date(b.savedAt) - new Date(a.savedAt)
        ));
      }
    } catch (error) {
      console.log('No saved drafts yet');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldSections = [
    {
      title: 'Agreement Information',
      fields: [
        { name: 'agreementDate', label: 'Agreement Date', type: 'date', required: true, placeholder: 'YYYY-MM-DD' },
        { name: 'closingDate', label: 'Closing Date', type: 'date', required: true, placeholder: 'YYYY-MM-DD' },
        { name: 'governingLaw', label: 'Governing Law (State/Country)', type: 'text', required: true, placeholder: 'e.g., California, United States' }
      ]
    },
    {
      title: 'Party Information',
      fields: [
        { name: 'buyerName', label: 'Buyer Name', type: 'text', required: true, placeholder: 'Full legal name or entity name' },
        { name: 'buyerAddress', label: 'Buyer Address', type: 'textarea', required: true, placeholder: 'Complete mailing address' },
        { name: 'sellerName', label: 'Seller Name', type: 'text', required: true, placeholder: 'Full legal name or entity name' },
        { name: 'sellerAddress', label: 'Seller Address', type: 'textarea', required: true, placeholder: 'Complete mailing address' }
      ]
    },
    {
      title: 'Transaction Details',
      fields: [
        { name: 'assetDescription', label: 'Description of Assets/Business Being Purchased', type: 'textarea', required: true, placeholder: 'Detailed description of assets, inventory, or business being transferred' },
        { name: 'purchasePrice', label: 'Purchase Price', type: 'text', required: true, placeholder: 'e.g., $500,000.00 USD' },
        { name: 'paymentTerms', label: 'Payment Terms', type: 'textarea', required: true, placeholder: 'Payment schedule, method, and conditions' }
      ]
    },
    {
      title: 'Legal Provisions',
      fields: [
        { name: 'warranties', label: 'Key Representations and Warranties', type: 'textarea', required: true, placeholder: 'Representations and warranties made by the parties' },
        { name: 'covenants', label: 'Covenants and Agreements', type: 'textarea', required: false, placeholder: 'Additional covenants and agreements (optional)' },
        { name: 'indemnification', label: 'Indemnification Provisions', type: 'textarea', required: true, placeholder: 'Indemnification terms and conditions' },
        { name: 'disputeResolution', label: 'Dispute Resolution', type: 'textarea', required: false, placeholder: 'Arbitration, mediation, or litigation procedures (optional)' }
      ]
    },
    {
      title: 'Signatures',
      fields: [
        { name: 'buyerSignature', label: 'Buyer Authorized Signature', type: 'text', required: true, placeholder: 'Full name as signature' },
        { name: 'buyerTitle', label: 'Buyer Signatory Title', type: 'text', required: false, placeholder: 'e.g., CEO, President, Owner' },
        { name: 'sellerSignature', label: 'Seller Authorized Signature', type: 'text', required: true, placeholder: 'Full name as signature' },
        { name: 'sellerTitle', label: 'Seller Signatory Title', type: 'text', required: false, placeholder: 'e.g., CEO, President, Owner' },
        { name: 'signatureDate', label: 'Signature Date', type: 'date', required: true, placeholder: 'YYYY-MM-DD' }
      ]
    }
  ];

  const allFields = fieldSections.flatMap(section => section.fields);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = async () => {
    const requiredFields = allFields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name] || formData[f.name].trim() === '');
    
    if (missingFields.length > 0) {
      showNotification(`Please complete required fields: ${missingFields.map(f => f.label).join(', ')}`, 'error');
      return;
    }

    setIsSaving(true);
    try {
      const draftId = `purchase:${Date.now()}`;
      const saveData = {
        formData,
        savedAt: new Date().toISOString(),
        title: `${formData.buyerName || 'Draft'} - ${formData.sellerName || 'Agreement'}`
      };
      
      await window.storage.set(draftId, JSON.stringify(saveData));
      
      // Send email to backend
      await sendEmailToBackend(formData, 'save');
      
      showNotification('Purchase Agreement draft saved successfully', 'success');
      await loadSavedDrafts();
    } catch (error) {
      showNotification('Error saving document: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    const requiredFields = allFields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name] || formData[f.name].trim() === '');
    
    if (missingFields.length > 0) {
      showNotification(`Please complete all required fields before downloading. Missing: ${missingFields.length} field(s)`, 'error');
      return;
    }

    let content = `PURCHASE AGREEMENT\n${'='.repeat(80)}\n\n`;
    
    content += `This Purchase Agreement ("Agreement") is entered into as of ${formData.agreementDate || '[DATE]'}\n\n`;
    
    content += `BETWEEN:\n\n`;
    content += `BUYER: ${formData.buyerName || '[BUYER NAME]'}\n`;
    content += `Address: ${formData.buyerAddress || '[BUYER ADDRESS]'}\n\n`;
    content += `AND\n\n`;
    content += `SELLER: ${formData.sellerName || '[SELLER NAME]'}\n`;
    content += `Address: ${formData.sellerAddress || '[SELLER ADDRESS]'}\n\n`;
    content += `${'='.repeat(80)}\n\n`;
    
    content += `1. PURCHASE AND SALE OF ASSETS\n\n`;
    content += `${formData.assetDescription || '[ASSET DESCRIPTION]'}\n\n`;
    
    content += `2. PURCHASE PRICE\n\n`;
    content += `${formData.purchasePrice || '[PURCHASE PRICE]'}\n\n`;
    
    content += `3. PAYMENT TERMS\n\n`;
    content += `${formData.paymentTerms || '[PAYMENT TERMS]'}\n\n`;
    
    content += `4. CLOSING\n\n`;
    content += `The closing of this transaction shall occur on: ${formData.closingDate || '[CLOSING DATE]'}\n\n`;
    
    content += `5. REPRESENTATIONS AND WARRANTIES\n\n`;
    content += `${formData.warranties || '[WARRANTIES]'}\n\n`;
    
    if (formData.covenants) {
      content += `6. COVENANTS AND AGREEMENTS\n\n`;
      content += `${formData.covenants}\n\n`;
    }
    
    content += `${formData.covenants ? '7' : '6'}. INDEMNIFICATION\n\n`;
    content += `${formData.indemnification || '[INDEMNIFICATION]'}\n\n`;
    
    if (formData.disputeResolution) {
      content += `${formData.covenants ? '8' : '7'}. DISPUTE RESOLUTION\n\n`;
      content += `${formData.disputeResolution}\n\n`;
    }
    
    const lastSection = (formData.covenants ? 8 : 7) + (formData.disputeResolution ? 1 : 0);
    content += `${lastSection}. GOVERNING LAW\n\n`;
    content += `This Agreement shall be governed by the laws of ${formData.governingLaw || '[GOVERNING LAW]'}.\n\n`;
    
    content += `\n${'='.repeat(80)}\n`;
    content += `SIGNATURES\n`;
    content += `${'='.repeat(80)}\n\n`;
    
    content += `BUYER:\n\n`;
    content += `Signature: ${formData.buyerSignature || '[SIGNATURE]'}\n`;
    if (formData.buyerTitle) content += `Title: ${formData.buyerTitle}\n`;
    content += `Date: ${formData.signatureDate || '[DATE]'}\n\n`;
    
    content += `SELLER:\n\n`;
    content += `Signature: ${formData.sellerSignature || '[SIGNATURE]'}\n`;
    if (formData.sellerTitle) content += `Title: ${formData.sellerTitle}\n`;
    content += `Date: ${formData.signatureDate || '[DATE]'}\n\n`;
    
    content += `\n${'='.repeat(80)}\n`;
    content += `Document generated: ${new Date().toLocaleString()}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `Purchase_Agreement_${formData.buyerName?.replace(/\s+/g, '_') || 'Draft'}_${Date.now()}.txt`;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    // Send email to backend
    await sendEmailToBackend(formData, 'download');
    
    showNotification('Purchase Agreement downloaded successfully', 'success');
  };

  const handleLoadDraft = async (key) => {
    try {
      const result = await window.storage.get(key);
      if (result) {
        const saved = JSON.parse(result.value);
        setFormData(saved.formData);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification('Draft loaded successfully', 'success');
      }
    } catch (error) {
      showNotification('Error loading draft: ' + error.message, 'error');
    }
  };

  const handleNewAgreement = () => {
    const hasData = Object.keys(formData).length > 0 && Object.values(formData).some(v => v && v.trim() !== '');
    if (hasData) {
      if (window.confirm('Start a new agreement? Any unsaved changes will be lost.')) {
        setFormData({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification('New agreement form cleared', 'success');
      }
    } else {
      setFormData({});
    }
  };

  const getCompletionPercentage = () => {
    const requiredFields = allFields.filter(f => f.required);
    const completedFields = requiredFields.filter(f => formData[f.name] && formData[f.name].trim() !== '').length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-400/20' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-400/20'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 size={22} className="flex-shrink-0" />
            ) : (
              <XCircle size={22} className="flex-shrink-0" />
            )}
            <span className="font-semibold text-sm">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMC0xNGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6bS0xNCAwYzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMCAxNGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg ring-2 ring-blue-500/20">
                <Building2 size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Purchase Agreement Portal
                </h1>
                <p className="text-slate-300 mt-2 text-lg font-medium">Professional document generation and management</p>
              </div>
            </div>
            <button
              onClick={handleNewAgreement}
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl border border-white/20 hover:border-white/30 text-white"
            >
              <RefreshCw size={20} />
              New Agreement
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-medium border border-slate-200/60 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Form Completion</h3>
                </div>
                <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  {getCompletionPercentage()}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden"
                  style={{ width: `${getCompletionPercentage()}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-medium border border-slate-200/60 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-white px-8 py-7 border-b border-slate-200/60">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-md">
                    <FileText size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Purchase Agreement Form</h2>
                    <p className="text-slate-600 font-medium">Complete all required fields to generate your professional purchase agreement document</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-b from-white to-slate-50/50">
                {fieldSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-12 pt-12 border-t border-slate-200/60' : ''}>
                    <div className="mb-8 pb-4 border-b-2 border-blue-100">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {section.title}
                      </h3>
                    </div>
                    <div className="space-y-7">
                      {section.fields.map((field) => (
                        <div key={field.name} className="group">
                          <label className="block text-sm font-bold text-slate-700 mb-3 tracking-wide">
                            {field.label} {field.required && <span className="text-red-500 ml-1.5 font-extrabold">*</span>}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-y bg-white text-slate-900 placeholder-slate-400 shadow-sm hover:shadow-md hover:border-slate-300 font-medium"
                              rows={5}
                              required={field.required}
                            />
                          ) : (
                            <input
                              type={field.type}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-slate-900 placeholder-slate-400 shadow-sm hover:shadow-md hover:border-slate-300 font-medium"
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 px-8 py-7 bg-gradient-to-r from-slate-50 via-blue-50/20 to-slate-50 border-t-2 border-slate-200/60">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-400 disabled:to-emerald-500 text-white px-8 py-3.5 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Draft</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3.5 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download size={20} />
                  <span>Download Agreement</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Saved Drafts */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-medium border border-slate-200/60 p-6 sticky top-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 pb-4 border-b-2 border-blue-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-md">
                  <FileText size={20} className="text-white" />
                </div>
                <span>Saved Drafts</span>
              </h3>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={28} className="animate-spin text-blue-500" />
                </div>
              ) : savedDrafts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-slate-100 rounded-2xl p-6 mb-4 inline-block">
                    <FileText size={48} className="text-slate-300" />
                  </div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">No saved drafts yet</p>
                  <p className="text-slate-400 text-xs">Save your work to access it later</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedDrafts.map((draft) => (
                    <div
                      key={draft.key}
                      className="p-4 border-2 border-slate-200 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-slate-50 hover:border-blue-400 cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-md"
                      onClick={() => handleLoadDraft(draft.key)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg transition-colors">
                          <FileText size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm mb-2 truncate group-hover:text-blue-700 transition-colors">
                            {draft.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {new Date(draft.savedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })} at{' '}
                            {new Date(draft.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-300 mt-20 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-200">© 2024 Purchase Agreement Portal</p>
              <p className="text-xs text-slate-400 mt-1">All rights reserved</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <p className="text-xs text-slate-400 font-medium">Secure document generation and management</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PurchaseAgreementPortal;

