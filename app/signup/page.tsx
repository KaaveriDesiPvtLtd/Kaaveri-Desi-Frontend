"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/api";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  UserCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Phone,
  KeyRound,
  Smartphone,
  MailCheck,
} from "lucide-react";

interface SignupFormData {
  name: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ApiError {
  error: string;
}

interface ApiSuccess {
  message: string;
}

type OtpChannel = "email" | "sms";

export default function SignupPage() {
  const router = useRouter();

  // ── Step state (1 = form, 2 = OTP) ────────────────────────────────────
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const gotoSignIn = () => {
    router.push(`/signin`);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ── OTP state ─────────────────────────────────────────────────────────
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [otpChannel, setOtpChannel] = useState<OtpChannel>("email");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Countdown timers ──────────────────────────────────────────────────
  useEffect(() => {
    if (otpExpiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((otpExpiresAt - Date.now()) / 1000),
        );
        setOtpCountdown(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpExpiresAt]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown((prev) => prev - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // ── Field validation ──────────────────────────────────────────────────
  const getFieldError = (field: keyof SignupFormData): string => {
    if (!touched[field]) return "";

    switch (field) {
      case "name":
        return formData.name.length < 2
          ? "Name must be at least 2 characters"
          : "";
      case "userName":
        return formData.userName.length < 3
          ? "Username must be at least 3 characters"
          : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(formData.email) ? "Invalid email address" : "";
      case "phone":
        const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
        return !phoneRegex.test(formData.phone.replace(/\s/g, ""))
          ? "Enter a valid Indian mobile number"
          : "";
      case "password":
        return formData.password.length < 6
          ? "Password must be at least 6 characters"
          : "";
      case "confirmPassword":
        return formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : "";
      default:
        return "";
    }
  };

  // Password strength
  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (password.length < 8)
      return { strength: 50, label: "Fair", color: "bg-yellow-500" };
    if (password.length < 10)
      return { strength: 75, label: "Good", color: "bg-blue-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };
  const passwordStrength = getPasswordStrength();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleBlur = (field: keyof SignupFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.name ||
      !formData.userName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid Indian mobile number");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // ── Step 1 → Step 2: Send initial OTP ─────────────────────────────────
  const handleProceedToOtp = async () => {
    if (!validateForm()) return;

    setOtpSending(true);
    setError("");

    try {
      const response = await apiClient.post("/otp/send", {
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        channel: "email",
      });

      const data = response.data;
      setOtpChannel("email");
      setOtpExpiresAt(Date.now() + (data.expiresIn || 300) * 1000);
      setResendCooldown(30);
      setOtpDigits(["", "", "", "", "", ""]);
      setStep(2);

      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 300);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to send OTP. Please try again.",
      );
    } finally {
      setOtpSending(false);
    }
  };

  // ── Toggle channel & resend OTP ───────────────────────────────────────
  const handleToggleChannel = async () => {
    const newChannel: OtpChannel = otpChannel === "email" ? "sms" : "email";

    setOtpSending(true);
    setError("");

    try {
      const response = await apiClient.post("/otp/send", {
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        channel: newChannel,
      });

      const data = response.data;
      setOtpChannel(newChannel);
      setOtpExpiresAt(Date.now() + (data.expiresIn || 300) * 1000);
      setResendCooldown(30);
      setOtpDigits(["", "", "", "", "", ""]);
      setSuccess(
        data.message ||
          `OTP sent to your ${newChannel === "sms" ? "mobile number" : "email"}.`,
      );
      setTimeout(() => setSuccess(""), 4000);

      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setOtpSending(false);
    }
  };

  // ── OTP digit input handling ──────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (error) setError("");

    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-focus next
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasted.length && i < 6; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      // Focus the last filled digit or the next empty one
      const focusIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  // ── Verify OTP + Create account ───────────────────────────────────────
  const handleVerifyAndSignup = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter all 6 digits of the OTP.");
      return;
    }

    setOtpVerifying(true);
    setError("");

    try {
      // Step 1: Verify OTP → get verification token
      const verifyRes = await apiClient.post("/otp/verify", {
        email: formData.email.toLowerCase(),
        otp,
      });

      const token = verifyRes.data.verificationToken;
      if (!token) {
        throw new Error("Verification failed unexpectedly.");
      }

      setVerificationToken(token);

      // Step 2: Create account with verification token
      const signupRes = await apiClient.post("/signup", {
        name: formData.name,
        userName: formData.userName,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        otpVerificationToken: token,
      });

      const data: ApiError | ApiSuccess = signupRes.data;
      setSuccess(
        (data as ApiSuccess).message || "Account created successfully!",
      );

      setFormData({
        name: "",
        userName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Verification failed.",
      );
    } finally {
      setOtpVerifying(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isOtpComplete = otpDigits.every((d) => d !== "");

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B1F1F]/5 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* ═══════════════════════════════════════════════════════════
                 STEP 1: SIGNUP FORM
                 ═══════════════════════════════════════════════════════════ */
              <motion.div
                key="step-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#8B1F1F] to-[#6B1515] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                  >
                    Create Account
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm sm:text-base text-gray-600"
                  >
                    Join KAAVERI देशी family today
                  </motion.p>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Fields */}
                <form
                  onSubmit={(e: FormEvent) => {
                    e.preventDefault();
                    handleProceedToOtp();
                  }}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur("name")}
                        className={`w-full pl-11 pr-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#8B1F1F]/20 transition-all text-sm sm:text-base ${
                          touched.name && getFieldError("name")
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-[#8B1F1F]"
                        }`}
                        placeholder="John Doe"
                        required
                      />
                      {touched.name && !getFieldError("name") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {touched.name && getFieldError("name") && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError("name")}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Username Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label
                      htmlFor="userName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        onBlur={() => handleBlur("userName")}
                        className={`w-full pl-11 pr-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#8B1F1F]/20 transition-all text-sm sm:text-base ${
                          touched.userName && getFieldError("userName")
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-[#8B1F1F]"
                        }`}
                        placeholder="johndoe123"
                        required
                      />
                      {touched.userName && !getFieldError("userName") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {touched.userName && getFieldError("userName") && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError("userName")}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur("email")}
                        className={`w-full pl-11 pr-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#8B1F1F]/20 transition-all text-sm sm:text-base ${
                          touched.email && getFieldError("email")
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-[#8B1F1F]"
                        }`}
                        placeholder="john@example.com"
                        required
                      />
                      {touched.email && !getFieldError("email") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {touched.email && getFieldError("email") && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError("email")}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Phone Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.75 }}
                  >
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full pl-11 pr-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#8B1F1F]/20 transition-all text-sm sm:text-base ${
                          touched.phone && getFieldError("phone")
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-[#8B1F1F]"
                        }`}
                        placeholder="9876543210"
                        required
                      />
                      {touched.phone && !getFieldError("phone") && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {touched.phone && getFieldError("phone") && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError("phone")}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
                        className={`w-full pl-11 pr-12 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#8B1F1F]/20 transition-all text-sm sm:text-base ${
                          touched.password && getFieldError("password")
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-[#8B1F1F]"
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">
                            Password Strength
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              passwordStrength.strength === 100
                                ? "text-green-600"
                                : passwordStrength.strength >= 75
                                  ? "text-blue-600"
                                  : passwordStrength.strength >= 50
                                    ? "text-yellow-600"
                                    : "text-red-600"
                            }`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength.strength}%` }}
                            className={`h-full ${passwordStrength.color}`}
                          />
                        </div>
                      </motion.div>
                    )}
                    {touched.password && getFieldError("password") && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-xs mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError("password")}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("confirmPassword")}
                        className={`w-full pl-11 pr-12 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#8B1F1F]/20 transition-all text-sm sm:text-base ${
                          touched.confirmPassword &&
                          getFieldError("confirmPassword")
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-300 focus:border-[#8B1F1F]"
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                    {touched.confirmPassword &&
                      getFieldError("confirmPassword") && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-600 text-xs mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {getFieldError("confirmPassword")}
                        </motion.p>
                      )}
                  </motion.div>

                  {/* Proceed Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={otpSending}
                    className="w-full bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] hover:from-[#6B1515] hover:to-[#8B1F1F] disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {otpSending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Proceed
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-4 sm:mt-6 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span>Your data is secure and encrypted</span>
                  </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 text-center"
                >
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Already have an account?{" "}
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      style={{ cursor: "pointer" }}
                      onClick={gotoSignIn}
                      className="text-[#8B1F1F] hover:text-[#6B1515] font-bold inline-block"
                    >
                      Sign In
                    </motion.span>
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              /* ═══════════════════════════════════════════════════════════
                 STEP 2: OTP VERIFICATION
                 ═══════════════════════════════════════════════════════════ */
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Back button */}
                <motion.button
                  whileHover={{ x: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setSuccess("");
                  }}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </motion.button>

                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#8B1F1F] to-[#6B1515] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <KeyRound className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                  >
                    {otpChannel === "email"
                      ? "Enter OTP sent on your Email"
                      : "Enter OTP sent on your Mobile Number"}
                  </motion.h2>
                  <p className="text-sm text-gray-500">
                    {otpChannel === "email" ? formData.email : formData.phone}
                  </p>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-600 text-sm">{success}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OTP expiry timer */}
                {otpCountdown > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mb-4"
                  >
                    <span
                      className={`text-sm font-medium ${otpCountdown <= 60 ? "text-red-500" : "text-gray-500"}`}
                    >
                      OTP expires in {formatCountdown(otpCountdown)}
                    </span>
                  </motion.div>
                )}

                {otpCountdown === 0 && otpExpiresAt && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mb-4"
                  >
                    <span className="text-sm text-red-500 font-medium">
                      OTP expired. Please request a new one.
                    </span>
                  </motion.div>
                )}

                {/* 6-digit OTP inputs */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                  {otpDigits.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl
                        focus:ring-2 focus:ring-[#8B1F1F]/20 focus:border-[#8B1F1F] outline-none transition-all
                        ${digit ? "border-[#8B1F1F] bg-[#8B1F1F]/5" : "border-gray-300 bg-white"}
                      `}
                    />
                  ))}
                </div>

                {/* Toggle channel button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleChannel}
                  disabled={otpSending || resendCooldown > 0}
                  className="w-full py-3 px-4 rounded-lg border-2 border-[#8B1F1F]/30 text-[#8B1F1F] font-semibold
                    hover:bg-[#8B1F1F]/5 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all flex items-center justify-center gap-2 text-sm sm:text-base mb-3"
                >
                  {otpSending ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-[#8B1F1F] border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      {otpChannel === "email" ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <MailCheck className="w-5 h-5" />
                      )}
                      {otpChannel === "email"
                        ? "Get OTP on Mobile Number"
                        : "Get OTP on Email"}
                      {resendCooldown > 0 && (
                        <span className="text-xs text-gray-400">
                          ({resendCooldown}s)
                        </span>
                      )}
                    </>
                  )}
                </motion.button>

                {/* Verify & Proceed button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerifyAndSignup}
                  disabled={
                    otpVerifying || !isOtpComplete || otpCountdown === 0
                  }
                  className="w-full bg-gradient-to-r from-[#8B1F1F] to-[#6B1515] hover:from-[#6B1515] hover:to-[#8B1F1F]
                    disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 sm:py-3.5 px-6 rounded-lg
                    transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl
                    disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {otpVerifying ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Verify OTP and Proceed
                    </>
                  )}
                </motion.button>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-5 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    <span>OTP is verified securely on our servers</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
