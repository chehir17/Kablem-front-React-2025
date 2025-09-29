import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
      {children}

      <div className="relative hidden w-full h-full lg:w-1/2 lg:block">
        {/* Image floutée */}
        <img
          src="/images/logo/loginImage.jpg"
          className="w-full h-full object-cover blur-sm"
          alt="Login illustration"
        />

        {/* Overlay sombre avec opacity */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* === Overlay avec GridShape centré === */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative flex flex-col items-center justify-center w-full h-full">
            {/* GridShape full width & centré */}
            <div className="absolute inset-0 flex items-center justify-center w-full">
              <GridShape />
            </div>

            {/* Logo au-dessus */}
            <Link to="/dashboard" className="block mb-4 z-20">
              <img
                width={280}
                height={50}
                src="/images/logo/logo-kab.png"
                alt="Logo"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* === Toggler en bas à droite === */}
      <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
