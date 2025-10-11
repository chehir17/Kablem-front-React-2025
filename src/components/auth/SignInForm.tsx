import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { login } from "../../services/authService";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format email invalide";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis!";
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe est trop court!";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSignInHandler = async () => {
    if (!validateForm()) return;

    setLoading(true);
    console.log("Login attempt:", email, password);

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      swal({
        title: "Connexion réussie",
        text: `Bienvenue ${result.user.first_name} !`,
        icon: "success",
        timer: 2000,
      });
      navigate("/dashboard");
    } else {
      swal({
        title: "Erreur",
        text: result.message || "Email ou mot de passe incorrect.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Se connecter
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre e-mail et votre mot de passe pour vous connecter !
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label>Email</Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <Label>Mot de passe</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Rester connecté
                </span>
              </div>
              <Link
                to="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <div>
              <button
                type="button"
                onClick={onSignInHandler}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Vous n&apos;avez pas de compte ?{" "}
              <Link
                to="#"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                -- Contactez l'administration --
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
