import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import logo from "../../../assets/logo.svg";
import logoGv from "../../../assets/logo_gv.png";
import { PowerIcon } from "@heroicons/react/24/solid";
import confetti from "canvas-confetti";

const Header = ({ onOpenModal }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Comprobar sesión al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email || "");
    });
    // Escuchar cambios de auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
        setUserEmail(session?.user?.email || "");
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="flex items-center justify-between py-0 sm:py-2 px-4 sm:px-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-t-2xl border-b-4 border-indigo-900 shadow-lg">
      {/* Izquierda: Logo Viper y acciones de usuario */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Logo GarajeVision"
            className="h-16 sm:h-20 transition-transform duration-500 hover:scale-110"
          />
        </Link>
        {/* Acciones de usuario a la derecha del logo */}
        <div className="flex items-center gap-2 ml-2">
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              if (isLoggedIn) {
                await supabase.auth.signOut();
                window.location.reload();
              } else {
                window.location.href = "/login";
              }
            }}
            className="p-1 rounded-full bg-gray-700 hover:bg-red-600 transition"
            title={isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
          >
            <PowerIcon className="w-5 h-5 text-white" />
          </button>
          <span
            className={`inline-block w-4 h-4 rounded-full border-2 border-white ${
              isLoggedIn ? "bg-green-500" : "bg-red-500"
            }`}
            title={isLoggedIn ? "Usuario logueado" : "No logueado"}
          ></span>
        </div>
      </div>
      {/* Derecha: Logo GarajeVision */}
      <img
        src={logoGv}
        alt="GarajeVision Título"
        className="h-20 sm:h-28 cursor-pointer"
        onClick={() => {
          const duration = 2 * 1000;
          const animationEnd = Date.now() + duration;
          const defaults = {
            angle: 90,
            spread: 120,
            startVelocity: 60,
            gravity: 1.2,
            ticks: 600,
            origin: { y: 0 },
            zIndex: 9999,
          };
          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }
          const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
              clearInterval(interval);
              return;
            }
            confetti({
              ...defaults,
              particleCount: randomInRange(80, 120),
              colors: ["#f0abfc", "#a5b4fc", "#818cf8", "#f472b6", "#facc15"],
            });
          }, 250);

          if (onOpenModal) {
            onOpenModal();
          }
        }}
      />
    </header>
  );
};

export default Header;
