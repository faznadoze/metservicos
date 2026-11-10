import React, { useEffect, useState } from 'react';
import {
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { COMPANY_CONFIG, ServiceInterest } from '../content/landingPage';
import {
  formatPhoneBR,
  LeadFormErrors,
  LeadFormValues,
  validateLeadForm,
} from '../lib/validation';
import {
  buildWhatsAppUrl,
  composeLeadWhatsAppMessage,
} from '../lib/whatsapp';
import { trackEvent } from '../lib/analytics';

interface LeadFormSectionProps {
  selectedInterest: ServiceInterest;
  prefillNote: string;
  onOpenPrivacyModal: () => void;
}

interface SubmittedLeadRecord {
  id: string;
  name: string;
  whatsapp: string;
  city: string;
  interest: ServiceInterest;
  composedMessage: string;
  whatsappUrl: string;
  createdAt: string;
}

export const LeadFormSection: React.FC<LeadFormSectionProps> = ({
  selectedInterest,
  prefillNote,
  onOpenPrivacyModal,
}) => {
  const [values, setValues] = useState<LeadFormValues>({
    name: '',
    whatsapp: '',
    city: '',
    interest: selectedInterest,
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<SubmittedLeadRecord | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<SubmittedLeadRecord[]>([]);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Sync external service selection into the form
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      interest: selectedInterest,
      message: prefillNote ? prefillNote : prev.message,
    }));
  }, [selectedInterest, prefillNote]);

  const markFormStarted = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent('start_form');
    }
  };

  const handleFieldChange = <K extends keyof LeadFormValues>(
    field: K,
    value: LeadFormValues[K]
  ) => {
    markFormStarted();
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof LeadFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateLeadForm(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const composedMessage = composeLeadWhatsAppMessage({
      name: values.name,
      whatsapp: values.whatsapp,
      city: values.city,
      interest: values.interest,
      message: values.message,
    });

    const whatsappUrl = buildWhatsAppUrl(composedMessage);

    const record: SubmittedLeadRecord = {
      id: `SOL-${Date.now().toString().slice(-5)}`,
      name: values.name.trim(),
      whatsapp: values.whatsapp.trim(),
      city: values.city.trim(),
      interest: values.interest,
      composedMessage,
      whatsappUrl,
      createdAt: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    trackEvent('submit_form', {
      interest: values.interest,
      city: values.city.trim(),
    });

    setSubmittedLead(record);
    setRecentSubmissions((prev) => [record, ...prev]);
  };

  const handleCopyMessage = async () => {
    if (!submittedLead) return;
    try {
      await navigator.clipboard.writeText(submittedLead.composedMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleResetForm = () => {
    setSubmittedLead(null);
    setValues({
      name: '',
      whatsapp: '',
      city: '',
      interest: selectedInterest,
      message: '',
      consent: false,
    });
    setErrors({});
  };

  return (
    <section
      id="orcamento"
      className="py-20 bg-[#0B1933] text-white solar-radial-glow border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Final CTA Pitch & Direct Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#FFD21A] tracking-wide">
                Atendimento Direto <span aria-hidden="true">·</span> Avaliação sem Complicação
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Pronto para dar o próximo passo com mais segurança?
              </h2>
              <p className="text-base text-slate-200 leading-relaxed">
                Conte brevemente o que você precisa. A equipe da{' '}
                <strong className="text-white font-semibold">
                  {COMPANY_CONFIG.brandName} ({COMPANY_CONFIG.legalDescriptor})
                </strong>{' '}
                entra em contato para entender o cenário e indicar o caminho mais adequado.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="space-y-1">
                <p className="text-xs text-slate-300">Prefere ligar ou conversar agora?</p>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <a
                    href={`tel:+${COMPANY_CONFIG.whatsappNumber}`}
                    onClick={() => trackEvent('click_phone')}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#FFD21A] hover:text-white transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0" />
                    <span className="font-mono-tabular">{COMPANY_CONFIG.phoneDisplay}</span>
                  </a>
                  <span aria-hidden="true" className="text-white/25">
                    ·
                  </span>
                  <span className="text-xs text-slate-300">{COMPANY_CONFIG.serviceHours}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-300">Região de cobertura</p>
                <p className="text-sm font-medium text-white">{COMPANY_CONFIG.serviceArea}</p>
              </div>
            </div>

            {/* Recent Submissions Counter / History in Session */}
            {recentSubmissions.length > 0 && (
              <div className="rounded-xl bg-[#172D55] border border-white/15 p-4 space-y-2">
                <p className="text-xs font-semibold text-[#FFD21A]">
                  Solicitações preparadas nesta sessão ({recentSubmissions.length})
                </p>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {recentSubmissions.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2">
                      <span>
                        <strong className="font-mono-tabular">{item.id}</strong> · {item.name} (
                        {item.city})
                      </span>
                      <span className="font-mono-tabular text-slate-300">{item.createdAt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Lead Form or Confirmation State */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white text-[#17202F] p-6 sm:p-8 shadow-xl border border-slate-200">
              {submittedLead ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="space-y-6"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#1E9B68] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-mono-tabular font-semibold text-[#1E9B68]">
                        SOLICITAÇÃO REGISTRADA · {submittedLead.id}
                      </p>
                      <h3 className="font-display text-xl font-bold text-[#17202F]">
                        Tudo pronto, {submittedLead.name}!
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Preparamos o resumo da sua solicitação para agilizar seu atendimento. Clique
                        no botão abaixo para enviar diretamente no WhatsApp da MeT Serviços.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F7F9FC] border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        Mensagem pronta para envio:
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0582E8] hover:text-[#172D55] cursor-pointer"
                      >
                        {copiedMessage ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#1E9B68]" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar texto</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs font-mono-tabular text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {submittedLead.composedMessage}
                    </pre>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <a
                      href={submittedLead.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#0B1933] bg-[#FFD21A] hover:bg-[#F5A900] rounded-xl transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Abrir conversa no WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#17202F] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Enviar outra solicitação</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#17202F]">
                      Solicitar avaliação ou orçamento
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Preencha os campos essenciais abaixo para montarmos seu atendimento.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="lead-name"
                        className="block text-xs font-bold text-[#17202F]"
                      >
                        Nome completo *
                      </label>
                      <input
                        id="lead-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        placeholder="Ex.: Carlos Mendes"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'error-lead-name' : undefined}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#17202F] placeholder:text-slate-400 focus:outline-2 focus:outline-[#0582E8] ${
                          errors.name ? 'border-red-600 bg-red-50/40' : 'border-slate-300 bg-white'
                        }`}
                      />
                      {errors.name && (
                        <p
                          id="error-lead-name"
                          role="alert"
                          className="flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="lead-whatsapp"
                        className="block text-xs font-bold text-[#17202F]"
                      >
                        WhatsApp com DDD *
                      </label>
                      <input
                        id="lead-whatsapp"
                        name="whatsapp"
                        type="tel"
                        autoComplete="tel"
                        value={values.whatsapp}
                        onChange={(e) =>
                          handleFieldChange('whatsapp', formatPhoneBR(e.target.value))
                        }
                        placeholder="(11) 99999-0000"
                        aria-invalid={Boolean(errors.whatsapp)}
                        aria-describedby={errors.whatsapp ? 'error-lead-whatsapp' : undefined}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono-tabular text-[#17202F] placeholder:text-slate-400 focus:outline-2 focus:outline-[#0582E8] ${
                          errors.whatsapp
                            ? 'border-red-600 bg-red-50/40'
                            : 'border-slate-300 bg-white'
                        }`}
                      />
                      {errors.whatsapp && (
                        <p
                          id="error-lead-whatsapp"
                          role="alert"
                          className="flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.whatsapp}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cidade / Região */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="lead-city"
                        className="block text-xs font-bold text-[#17202F]"
                      >
                        Cidade / Região *
                      </label>
                      <input
                        id="lead-city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        value={values.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="Ex.: Campinas - SP"
                        aria-invalid={Boolean(errors.city)}
                        aria-describedby={errors.city ? 'error-lead-city' : undefined}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#17202F] placeholder:text-slate-400 focus:outline-2 focus:outline-[#0582E8] ${
                          errors.city ? 'border-red-600 bg-red-50/40' : 'border-slate-300 bg-white'
                        }`}
                      />
                      {errors.city && (
                        <p
                          id="error-lead-city"
                          role="alert"
                          className="flex items-center gap-1 text-xs font-medium text-red-600"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.city}</span>
                        </p>
                      )}
                    </div>

                    {/* Interesse */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="lead-interest"
                        className="block text-xs font-bold text-[#17202F]"
                      >
                        Qual é o seu interesse? *
                      </label>
                      <select
                        id="lead-interest"
                        name="interest"
                        value={values.interest}
                        onChange={(e) =>
                          handleFieldChange('interest', e.target.value as ServiceInterest)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#17202F] focus:outline-2 focus:outline-[#0582E8]"
                      >
                        <option value="instalacao">Instalação de painéis solares</option>
                        <option value="limpeza">Limpeza / Manutenção de sistema</option>
                        <option value="duvida">Ainda não sei / Quero orientação</option>
                      </select>
                    </div>
                  </div>

                  {/* Mensagem Opcional */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lead-message"
                      className="block text-xs font-bold text-[#17202F]"
                    >
                      Mensagem ou detalhes do imóvel (opcional)
                    </label>
                    <textarea
                      id="lead-message"
                      name="message"
                      rows={3}
                      value={values.message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Ex.: Residência com telhado cerâmico, ou sistema atual com 12 placas precisando de limpeza."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#17202F] placeholder:text-slate-400 focus:outline-2 focus:outline-[#0582E8]"
                    />
                  </div>

                  {/* Consentimento */}
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2.5">
                      <input
                        id="lead-consent"
                        name="consent"
                        type="checkbox"
                        checked={values.consent}
                        onChange={(e) => handleFieldChange('consent', e.target.checked)}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? 'error-lead-consent' : undefined}
                        className="mt-0.5 w-4 h-4 accent-[#172D55] rounded cursor-pointer"
                      />
                      <label htmlFor="lead-consent" className="text-xs text-slate-600 leading-snug">
                        Concordo em compartilhar meus dados acima para que a{' '}
                        <strong>{COMPANY_CONFIG.brandName}</strong> entre em contato pelo WhatsApp
                        ou telefone conforme a{' '}
                        <button
                          type="button"
                          onClick={onOpenPrivacyModal}
                          className="text-[#0582E8] font-semibold underline underline-offset-2 hover:text-[#172D55] cursor-pointer"
                        >
                          Política de Privacidade
                        </button>
                        .
                      </label>
                    </div>
                    {errors.consent && (
                      <p
                        id="error-lead-consent"
                        role="alert"
                        className="flex items-center gap-1 text-xs font-medium text-red-600"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.consent}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 text-sm font-bold text-[#0B1933] bg-[#FFD21A] hover:bg-[#F5A900] rounded-xl transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172D55]"
                  >
                    Quero receber orientação
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
