'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

interface FooterProps {
  dict?: any;
}

export default function Footer({ dict }: FooterProps) {
  const params = useParams();
  const locale = params?.locale || 'en';

  const withLocale = (href: string) => {
    if (!href || href === "#") return "#";
    if (href.startsWith(`/${locale}/`)) return href;
    if (href === "/") return `/${locale}`;
    const normalizedHref = href.startsWith("/") ? href : `/${href}`;
    return `/${locale}${normalizedHref}`;
  };

  return (
    <footer className="bg-blue-600 text-white border-t border-blue-500"> {/* [UI] Changed to blue-600 to match buttons */}
      {/* Main Footer with 5 Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Column 1 - Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900 font-black text-lg">
                JCW
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold tracking-tight text-white">
                  Just Code Works
                </span>
                <span className="text-xs text-blue-100">
                  {dict?.footer?.tagline || "Websites • Printing • POS • Tools"}
                </span>
              </div>
            </div>
            <p className="text-sm text-blue-100 leading-relaxed">
              {dict?.footer?.description || "We help small EU businesses get online with modern websites, matching print materials, and simple tools – all connected in one system."}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {dict?.footer?.services?.title || "Services"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={withLocale("/websites")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.services?.websites || "Website Design"}
                </Link>
              </li>
              <li>
                <Link href={withLocale("/pos-systems")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.services?.pos || "POS Systems"}
                </Link>
              </li>
              <li>
                <Link href={locale === 'pt' ? withLocale("/servicos") : withLocale("/services")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.services?.printing || "Print Design"}
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.services?.consulting || "Business Consulting"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.services?.maintenance || "Website Maintenance"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.services?.hosting || "Web Hosting"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {dict?.footer?.company?.title || "Company"}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.company?.about || "About Us"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.company?.team || "Our Team"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.company?.careers || "Careers"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.company?.news || "News & Updates"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.company?.partners || "Partners"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.company?.testimonials || "Testimonials"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {dict?.footer?.tools?.title || "Tools"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={locale === 'pt' ? withLocale("/utilities/leitor-json") : withLocale("/utilities/json-reader")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.tools?.jsonReader || "JSON Reader"}
                </Link>
              </li>
              <li>
                <Link href={locale === 'pt' ? withLocale("/utilities/gerador-qr") : withLocale("/utilities/qr-generator")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.tools?.qrGenerator || "QR Generator"}
                </Link>
              </li>
              <li>
                <Link href={locale === 'pt' ? withLocale("/utilities/verificador-passwords") : withLocale("/utilities/password-checker")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.tools?.passwordChecker || "Password Checker"}
                </Link>
              </li>
              <li>
                <Link href={locale === 'pt' ? withLocale("/utilities/gerador-passwords") : withLocale("/utilities/password-generator")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.tools?.passwordGenerator || "Password Generator"}
                </Link>
              </li>
              <li>
                <Link href={locale === 'pt' ? withLocale("/utilities/redimensionador-imagens") : withLocale("/utilities/image-resizer")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.tools?.imageResizer || "Image Resizer"}
                </Link>
              </li>
              <li>
                <Link href={locale === 'pt' ? withLocale("/utilities/editor-imagens") : withLocale("/utilities/image-cropper")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.tools?.imageCropper || "Image Cropper"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {dict?.footer?.support?.title || "Support"}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={locale === 'pt' ? withLocale("/centro-ajuda") : withLocale("/help-center")} className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.support?.help || "Help Center"}
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.support?.contact || "Contact Us"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.support?.faq || "FAQ"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.support?.documentation || "Documentation"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.support?.tutorials || "Video Tutorials"}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-blue-100 hover:text-white transition-colors">
                  {dict?.footer?.support?.community || "Community Forum"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t border-blue-500 bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                {dict?.footer?.legal?.privacy || "Privacy Policy"}
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                {dict?.footer?.legal?.terms || "Terms of Service"}
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                {dict?.footer?.legal?.cookies || "Cookie Policy"}
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                {dict?.footer?.legal?.gdpr || "GDPR Compliance"}
              </a>
            </div>
            <div className="text-sm text-blue-200">
              {dict?.footer?.newsletter?.title || "Subscribe to our newsletter"}
              <div className="mt-2 flex">
                <input 
                  type="email" 
                  placeholder={dict?.footer?.newsletter?.placeholder || "Enter your email"}
                  className="px-3 py-1 rounded-l-md bg-blue-800 text-white text-sm border-0 focus:ring-1 focus:ring-white outline-none"
                />
                <button className="px-4 py-1 bg-white text-blue-600 rounded-r-md hover:bg-blue-50 transition-colors text-sm font-medium">
                  {dict?.footer?.newsletter?.subscribe || "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="border-t border-blue-600 bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-blue-200">
              © {new Date().getFullYear()} Just Code Works. {dict?.footer?.copyright?.rights || "All rights reserved."}
            </div>
            <div className="flex items-center space-x-4 text-sm text-blue-200">
              <span>{dict?.footer?.copyright?.made || "Made with"}</span>
              <span className="text-red-400">❤️</span>
              <span>{dict?.footer?.copyright?.location || "in Portugal"}</span>
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs">{dict?.footer?.copyright?.powered || "Powered by"}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-semibold text-white">Next.js</span>
                  <span className="text-xs text-blue-300">•</span>
                  <span className="text-xs font-semibold text-white">Django</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
