// [GARAGE-FORM] Real Functional Quote Form Component
"use client";

import { useState } from "react";

interface GarageQuoteFormSectionProps {
  fields: Record<string, string>;
  siteSlug?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  license_plate: string;
  car_make_model: string;
  service_type: string;
  message: string;
}

export default function GarageQuoteFormSection({ fields, siteSlug }: GarageQuoteFormSectionProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    license_plate: "",
    car_make_model: "",
    service_type: "",
    message: ""
  });
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  // Field labels from Section data
  const title = fields["title"] || "Pedir Orçamento Gratuito";
  const subtitle = fields["subtitle"] || "Preencha o formulário e entraremos em contacto consigo";
  const form_name_label = fields["form_name_label"] || "Nome completo";
  const form_email_label = fields["form_email_label"] || "Email";
  const form_phone_label = fields["form_phone_label"] || "Telemóvel";
  const form_license_plate_label = fields["form_license_plate_label"] || "Matrícula";
  const form_vehicle_label = fields["form_vehicle_label"] || "Marca e modelo do veículo";
  const form_service_label = fields["form_service_label"] || "Tipo de serviço pretendido";
  const form_message_label = fields["form_message_label"] || "Descrição do problema ou serviço";
  const form_submit_text = fields["form_submit_text"] || "Enviar Pedido";
  const privacy_text = fields["privacy_text"] || "Os seus dados serão tratados com confidencialidade.";

  // Service options - map frontend options to backend values
  const serviceOptions = [
    { value: "troca_oleo", label: "Troca de óleo" },
    { value: "revisao", label: "Revisão geral" },
    { value: "travoes", label: "Travões" },
    { value: "diagnostico", label: "Diagnóstico" },
    { value: "outro", label: "Outro" }
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!siteSlug) {
      setErrorMessage("Site não encontrado. Tente novamente.");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(`http://localhost:8000/api/sites/${siteSlug}/quote-requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          license_plate: formData.license_plate,
          car_make_model: formData.car_make_model,
          service_type: formData.service_type,
          message: formData.message,
          source_page_slug: "orcamento",
          locale: "pt",
          consent_marketing: false
        })
      });

      if (response.ok) {
        // Success - clear form and show success message
        setFormData({
          name: "",
          email: "",
          phone: "",
          license_plate: "",
          car_make_model: "",
          service_type: "",
          message: ""
        });
        setSubmitStatus("success");
      } else {
        // Error from server
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Erro ao enviar o pedido. Verifique os dados.");
        setSubmitStatus("error");
      }
    } catch (error) {
      // Network or other error
      setErrorMessage("Ocorreu um erro ao enviar o pedido. Tente novamente mais tarde.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 to-red-600 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-xl text-orange-100">
            {subtitle}
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
              <p className="text-center font-semibold">
                ✅ Obrigado! Recebemos o seu pedido de orçamento e vamos contactar em breve.
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
              <p className="text-center font-semibold">
                ❌ {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {form_name_label} <span className="text-orange-300">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:border-white focus:outline-none"
                  placeholder={form_name_label}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{form_email_label}</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:border-white focus:outline-none"
                  placeholder={form_email_label}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{form_phone_label}</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:border-white focus:outline-none"
                  placeholder={form_phone_label}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{form_license_plate_label}</label>
                <input 
                  type="text" 
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:border-white focus:outline-none"
                  placeholder={form_license_plate_label}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{form_vehicle_label}</label>
                <input 
                  type="text" 
                  name="car_make_model"
                  value={formData.car_make_model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:border-white focus:outline-none"
                  placeholder="Ex: BMW 320d 2018"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{form_service_label}</label>
                <select 
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-white focus:outline-none"
                >
                  <option value="" className="text-gray-900">Selecionar...</option>
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value} className="text-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{form_message_label}</label>
              <textarea 
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:border-white focus:outline-none"
                placeholder={form_message_label}
              ></textarea>
            </div>
            
            <p className="text-sm text-white/80">
              {privacy_text}
            </p>
            
            <button 
              type="submit"
              disabled={isSubmitting || !formData.name || (!formData.email && !formData.phone)}
              className="w-full px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "A enviar..." : form_submit_text}
            </button>

            <p className="text-xs text-center text-white/70">
              <span className="text-orange-300">*</span> Campos obrigatórios. 
              É necessário fornecer pelo menos um contacto (email ou telefone).
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}