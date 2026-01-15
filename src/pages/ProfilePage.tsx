import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Shield,
  CreditCard,
  Bell,
  Smartphone,
  ChevronRight,
  Package,
  LogOut,
  Camera,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  memberSince: string;
  avatar: string;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    mobileNumber: "",
    mobileProvider: "mtn",
  });
  const [showPaymentError, setShowPaymentError] = useState("");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState("");

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");
  const [twoFactorSuccess, setTwoFactorSuccess] = useState("");
  type TabType = "personal" | "orders" | "preferences" | "security";

  const [activeTab, setActiveTab] = useState<TabType>("personal");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Jean",
    lastName: "Koffi",
    email: "jean.koffi@email.com",
    phone: "+229 97 00 00 00",
    address: "123 Rue de la Paix",
    city: "Cotonou",
    country: "Bénin",
    postalCode: "001",
    memberSince: "2024-01-15",
    avatar: "/logo.png",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Password change handlers
  const handlePasswordChange = (
    field: keyof typeof passwordData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      setPasswordError("Veuillez entrer votre mot de passe actuel");
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères"
      );
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleCancelPassword = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = () => {
    if (validatePassword()) {
      // Simuler le changement de mot de passe
      setPasswordSuccess("Mot de passe changé avec succès !");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordSuccess("");
      }, 2000);
    }
  };

  // Payment methods handlers
  const handlePaymentChange = (
    field: keyof typeof paymentData,
    value: string
  ) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setShowPaymentError("");
    setShowPaymentSuccess("");
  };

  const validateCardNumber = (number: string) => {
    // Validation simple pour carte de crédit (16 chiffres)
    return /^\d{16}$/.test(number.replace(/\s/g, ""));
  };

  const validateExpiryDate = (date: string) => {
    // Validation format MM/YY
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(date);
  };

  const validateCVV = (cvv: string) => {
    // Validation CVV (3 chiffres)
    return /^\d{3}$/.test(cvv);
  };

  const validateMobileNumber = (number: string) => {
    // Validation numéro mobile béninois (format +229)
    return /^\+229\d{8}$/.test(number.replace(/\s/g, ""));
  };

  const validatePaymentData = () => {
    if (selectedPaymentMethod === "card") {
      if (!validateCardNumber(paymentData.cardNumber)) {
        setShowPaymentError("Numéro de carte invalide (16 chiffres requis)");
        return false;
      }
      if (!validateExpiryDate(paymentData.expiryDate)) {
        setShowPaymentError("Date d'expiration invalide (format MM/AA)");
        return false;
      }
      if (!validateCVV(paymentData.cvv)) {
        setShowPaymentError("CVV invalide (3 chiffres requis)");
        return false;
      }
      if (!paymentData.cardHolder.trim()) {
        setShowPaymentError("Nom du titulaire requis");
        return false;
      }
    } else if (selectedPaymentMethod === "mobile") {
      if (!validateMobileNumber(paymentData.mobileNumber)) {
        setShowPaymentError("Numéro mobile invalide (format +229 XXXXXXXX)");
        return false;
      }
      if (!paymentData.mobileProvider) {
        setShowPaymentError("Veuillez sélectionner un opérateur");
        return false;
      }
    }
    return true;
  };

  const handlePaymentSubmit = () => {
    if (validatePaymentData()) {
      setShowPaymentSuccess("Méthode de paiement ajoutée avec succès !");
      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedPaymentMethod("");
        setPaymentData({
          cardNumber: "",
          cardHolder: "",
          expiryDate: "",
          cvv: "",
          mobileNumber: "",
          mobileProvider: "mtn",
        });
        setShowPaymentError("");
        setShowPaymentSuccess("");
      }, 2000);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod("");
    setPaymentData({
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      mobileNumber: "",
      mobileProvider: "mtn",
    });
    setShowPaymentError("");
    setShowPaymentSuccess("");
  };

  // 2FA handlers
  const handle2FAToggle = () => {
    setShow2FAModal(true);
    setTwoFactorError("");
    setTwoFactorSuccess("");
    setTwoFactorCode("");
  };

  const handle2FASubmit = () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setTwoFactorError("Veuillez entrer un code à 6 chiffres valide");
      return;
    }

    // Simuler la validation du code 2FA
    if (twoFactorCode === "123456") {
      setTwoFactorSuccess(
        "Authentification à deux facteurs activée avec succès !"
      );
      setTwoFactorEnabled(true);
      setTimeout(() => {
        setShow2FAModal(false);
        setTwoFactorCode("");
        setTwoFactorSuccess("");
      }, 2000);
    } else {
      setTwoFactorError("Code invalide. Veuillez réessayer.");
    }
  };

  const handle2FACancel = () => {
    setShow2FAModal(false);
    setTwoFactorCode("");
    setTwoFactorError("");
    setTwoFactorSuccess("");
  };

  const handle2FADisable = () => {
    setTwoFactorEnabled(false);
    setTwoFactorSuccess("Authentification à deux facteurs désactivée");
    setTimeout(() => setTwoFactorSuccess(""), 3000);
  };

  const mockOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-14",
      restaurant: "Restaurant Le Bénin",
      total: 12500,
      status: "delivered",
      items: 3,
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      restaurant: "Chez Maman",
      total: 8500,
      status: "delivered",
      items: 2,
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-08",
      restaurant: "Pizza Palace",
      total: 15000,
      status: "delivered",
      items: 4,
    },
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="relative">
          <img
            src={profile.avatar}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-orange-200"
          />
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Membre depuis{" "}
            {new Date(profile.memberSince).toLocaleDateString("fr-BJ")}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{profile.firstName}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{profile.lastName}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editedProfile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{profile.email}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={editedProfile.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{profile.phone}</span>
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">
                {profile.address}, {profile.city}, {profile.country}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{profile.city}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pays
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">{profile.country}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Historique des commandes
      </h3>
      <div className="space-y-3">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Commande #{order.id}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {order.restaurant}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.date).toLocaleDateString("fr-BJ")}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {order.items} article{order.items > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-orange-600 text-sm sm:text-base">
                  {order.total.toLocaleString()} FCFA
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Livrée
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Préférences</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 min-w-0">
            <Bell className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                Notifications
              </h4>
              <p className="text-sm text-gray-600">
                Recevoir des notifications par email
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 min-w-0">
            <Smartphone className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                Notifications SMS
              </h4>
              <p className="text-sm text-gray-600">
                Recevoir des alertes par SMS
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 min-w-0">
            <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                Partage de localisation
              </h4>
              <p className="text-sm text-gray-600">
                Partager la position pour la livraison
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>

      <div className="space-y-4">
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Shield className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="text-left min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                Changer le mot de passe
              </h4>
              <p className="text-sm text-gray-600">
                Mettre à jour votre mot de passe
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
        </button>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <CreditCard className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="text-left min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                Méthodes de paiement
              </h4>
              <p className="text-sm text-gray-600">
                Gérer vos cartes de paiement
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
        </button>

        <button
          onClick={twoFactorEnabled ? handle2FADisable : handle2FAToggle}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Smartphone className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="text-left min-w-0">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                Authentification à deux facteurs
              </h4>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled
                  ? "Désactiver la sécurité 2FA"
                  : "Ajouter une couche de sécurité"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {twoFactorEnabled && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="hidden sm:inline">Activée</span>
                <span className="sm:hidden">✓</span>
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>

        {/* 2FA Success Message */}
        {twoFactorSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-600">{twoFactorSuccess}</p>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between w-full sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Mon Profil
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors sm:w-auto justify-center"
          >
            <Edit2 className="w-3 h-4" />
            <span className="hidden sm:inline">Modifier</span>
            <span className="sm:hidden">Éditer</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 sm:mb-8">
        <nav className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
          {[
            {
              id: "personal",
              label: "Informations personnelles",
              icon: User,
              mobileLabel: "Profil",
            },
            {
              id: "orders",
              label: "Mes commandes",
              icon: Package,
              mobileLabel: "Commandes",
            },
            {
              id: "preferences",
              label: "Préférences",
              icon: Bell,
              mobileLabel: "Préférences",
            },
            {
              id: "security",
              label: "Sécurité",
              icon: Shield,
              mobileLabel: "Sécurité",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        {activeTab === "personal" && renderPersonalInfo()}
        {activeTab === "orders" && renderOrders()}
        {activeTab === "preferences" && renderPreferences()}
        {activeTab === "security" && renderSecurity()}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Changer le mot de passe
              </h3>
              <button
                onClick={handleCancelPassword}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Minimum 8 caractères</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-600">{passwordSuccess}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancelPassword}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Ajouter une méthode de paiement
              </h3>
              <button
                onClick={handleCancelPayment}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedPaymentMethod("card")}
                    className={`p-3 border rounded-lg transition-colors ${
                      selectedPaymentMethod === "card"
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Carte</span>
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod("mobile")}
                    className={`p-3 border rounded-lg transition-colors ${
                      selectedPaymentMethod === "mobile"
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Mobile</span>
                  </button>
                </div>
              </div>

              {/* Card Payment Fields */}
              {selectedPaymentMethod === "card" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        handlePaymentChange("cardNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du titulaire
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardHolder}
                      onChange={(e) =>
                        handlePaymentChange("cardHolder", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Jean Koffi"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) =>
                          handlePaymentChange("expiryDate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          handlePaymentChange("cvv", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Mobile Payment Fields */}
              {selectedPaymentMethod === "mobile" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro mobile
                    </label>
                    <input
                      type="text"
                      value={paymentData.mobileNumber}
                      onChange={(e) =>
                        handlePaymentChange("mobileNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+229 97 00 00 00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opérateur
                    </label>
                    <select
                      value={paymentData.mobileProvider}
                      onChange={(e) =>
                        handlePaymentChange("mobileProvider", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="mtn">MTN</option>
                      <option value="moov">Moov</option>
                      <option value="glo">Celtiis</option>
                    </select>
                  </div>
                </>
              )}

              {/* Error Message */}
              {showPaymentError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-600">{showPaymentError}</p>
                </div>
              )}

              {/* Success Message */}
              {showPaymentSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-600">{showPaymentSuccess}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancelPayment}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={!selectedPaymentMethod}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Authentification à deux facteurs
              </h3>
              <button
                onClick={handle2FACancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center mb-6">
                <Smartphone className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">
                  Activez la sécurité 2FA
                </h4>
                <p className="text-sm text-gray-600">
                  Entrez le code à 6 chiffres envoyé à votre téléphone
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Code de test: 123456
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) =>
                    setTwoFactorCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center text-lg font-mono"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              {/* Error Message */}
              {twoFactorError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-600">{twoFactorError}</p>
                </div>
              )}

              {/* Success Message */}
              {twoFactorSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-600">{twoFactorSuccess}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handle2FACancel}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handle2FASubmit}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Activer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
