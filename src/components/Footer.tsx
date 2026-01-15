import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Smartphone,
  CreditCard,
  Shield,
  Truck,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Food Delivery Bénin"
                className="w-12 h-12 rounded-full object-cover shadow-lg hover:scale-105 transition-transform"
              />
              <h3 className="text-xl font-bold">Food Delivery Bénin</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Votre partenaire de confiance pour la livraison de repas à
              domicile au Bénin. Rapide, fiable et économique.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-500">Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Truck className="w-4 h-4 text-orange-500" />
                <span>Livraison Express</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Smartphone className="w-4 h-4 text-orange-500" />
                <span>Application Mobile</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <CreditCard className="w-4 h-4 text-orange-500" />
                <span>Paiement Sécurisé</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Shield className="w-4 h-4 text-orange-500" />
                <span>Garantie Satisfaction</span>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-500">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <span>
                  Quartier des Ambassadeurs,
                  <br />
                  Cotonou, Bénin
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+229 97 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>contact@fooddelivery.bj</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Lun-Dim: 8h - 23h</span>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-500">
              Liens Rapides
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  À Propos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Comment ça marche
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Devenir Partenaire
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Programme Livreur
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-400 transition-colors"
                >
                  Support Client
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Food Delivery Bénin. Tous droits
              réservés.
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Politique de Confidentialité
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Conditions d'Utilisation
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                Mentions Légales
              </a>
            </div>
          </div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">
              Téléchargez notre application
            </h4>
            <div className="flex justify-center gap-4">
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Smartphone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Disponible sur</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Smartphone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Disponible sur</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
