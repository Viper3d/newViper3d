import React, { useState, useEffect } from 'react';
import logo from './assets/logo.svg';

import freddy from './assets/freddy.svg';
import freddy2 from './assets/freddy2.svg';
import lumalee from './assets/lumalee.svg';
import lumalee2 from './assets/lumalee2.svg';
import pulpo from './assets/pulpo.svg';
import pulpo2 from './assets/pulpo2.svg';
import dragon from './assets/dragon.svg';
import dragon2 from './assets/dragon2.svg';

import tortuga from './assets/tortuga.svg';
import tortuga2 from './assets/tortuga2.svg';
import corazon from './assets/corazon.svg';
import corazon2 from './assets/corazon2.svg';
import juegos from './assets/juegos.svg';
import juegos2 from './assets/juegos2.svg';
import concha from './assets/concha.svg';
import concha2 from './assets/concha2.svg';

import comprar from './assets/comprar.svg';
import productos from './assets/productos.svg';
import tiktok from './assets/tiktok.svg';
import instagram from './assets/instagram.svg';
import youtube from './assets/youtube.svg';
import titulo from './assets/titulo.svg';

export default function App() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);


  const slides = [
    { src: freddy, hoverSrc: freddy2, alt: "freddy" },
    { src: lumalee, hoverSrc: lumalee2, alt: "lumalee" },
    { src: pulpo, hoverSrc: pulpo2, alt: "pulpo" },
    { src: dragon, hoverSrc: dragon2, alt: "dragon" },
    { src: tortuga, hoverSrc: tortuga2, alt: "tortuga" },
    { src: corazon, hoverSrc: corazon2, alt: "corazon" },
    { src: juegos, hoverSrc: juegos2, alt: "juegos" },
    { src: concha, hoverSrc: concha2, alt: "concha" },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const reviews = [
    {
      platform: "Cults 3D",
      user: "Juan P.",
      review: "¡Modelos increíbles! La calidad de los STL es excelente.",
    },
    {
      platform: "Cults 3D",
      user: "Ana G.",
      review: "Muy fácil de imprimir y con gran nivel de detalle.",
    },
    {
      platform: "Etsy",
      user: "Carlos R.",
      review: "Las impresiones son de alta calidad, ¡totalmente recomendadas!",
    },
    {
      platform: "Etsy",
      user: "María L.",
      review: "Gran servicio al cliente y productos impresionantes.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gradient-to-r from-black to-blue-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-right">
          <img src={logo} alt="Logo" className="h-40 sm:h-32 md:h-32 lg:h-36 xl:h-40 sm:mb-0" />
          <img src={titulo} alt="titulo" className="h-56 sm:h-56 md:h-56 lg:h-56 xl:h-64" />
        </div>
      </header>

      <main className="flex-grow px-2 py-6 bg-blue-200 text-center">
        <section className='p-0 mb-12 container bg-gradient-to-r from-black to-blue-400 mx-auto rounded-3xl shadow-xl shadow-black z-50'>
          <div className="container mx-auto px-6 py-8">
            <iframe 
              width="100%" 
              height="700"
              src="https://www.youtube.com/embed/IH300mQrFjQ?rel=0" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </section>
        
        <section className="container mx-auto rounded-3xl shadow-xl shadow-black z-50 mt-12">
          <h2 className="p-4 bg-gradient-to-r from-black to-blue-600 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white rounded-t-3xl">
            Bienvenidos <span className="font-bold text-blue-300">Vipers!</span>
          </h2>
          <div className="relative p-6 mb-12 rounded-b-3xl bg-gradient-to-r from-black to-blue-600 shadow-black z-0 text-white font">
            <p className="text-justify-center mb-4">
              Somos dos jóvenes apasionados por el <span className="font-bold text-blue-300">3D</span>, y hemos creado <span className="font-bold text-blue-300">Viper3D</span> para acercar la <span className="font-bold text-blue-300">impresión 3D</span> a todos.
            </p>
            <p className="text-justify-center mb-4">
              Ofrecemos modelos <span className="font-bold text-blue-300">STL</span> y servicios de impresión en <span className="font-bold text-blue-300">PLA</span>, un material ecológico y sostenible. Creemos en la accesibilidad y en el respeto por el medio ambiente.
            </p>
            <p className="text-justify-center mb-4">
              Con <span className="font-bold text-blue-300">Viper3D</span>, puedes dar vida a tus ideas, sin importar tu nivel de experiencia. ¡Únete a nosotros y descubre el poder transformador de la <span className="font-bold text-blue-300">impresión 3D</span>!
            </p>
            <p className="text-justify-center">
              Necesitas algo a medida? Contáctanos en nuestras redes soliales o mandanos un mail a: <span className="font-bold text-blue-300">info.viper3d@gmail.com</span>
            </p>
          </div>
        </section>

        <section className='container mx-auto rounded-3xl shadow-xl shadow-black z-50'>
      <h2 className="p-4 bg-gradient-to-r from-black to-blue-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white rounded-t-3xl">
        Nuestro <span className="font-bold text-blue-300">TOP!</span>
      </h2>
      <div className="relative p-6 mb-12 rounded-b-3xl bg-gradient-to-r from-black to-blue-400">
        <div className="relative w-full overflow-hidden">
          <div className="flex transition-transform duration-1000" style={{ transform: `translateX(-${currentSlide * (100 / (window.innerWidth < 1024 ? 2 : 4))}%)` }}>
            {slides.concat(slides).map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0 px-2" style={{ width: `${window.innerWidth < 1024 ? '50%' : '25%'}` }}>
                <div
                  className="flex justify-center items-center"
                  onMouseEnter={() => setHoveredIndex(index % slides.length)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative">
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className={`h-max w-full object-contain rounded-3xl transition-opacity duration-1000 ${hoveredIndex === (index % slides.length) ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <img
                      src={slide.hoverSrc}
                      alt={`${slide.alt}-hover`}
                      className={`h-max w-full object-contain rounded-3xl transition-opacity duration-1000 absolute top-0 left-0 ${hoveredIndex === (index % slides.length) ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handlePrev} className="absolute top-1/2 transform -translate-y-1/2 left-0 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition">
            Prev
          </button>
          <button onClick={handleNext} className="absolute top-1/2 transform -translate-y-1/2 right-0 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition">
            Next
          </button>
        </div>
      </div>
    </section>




        <section className=' container mx-auto rounded-3xl shadow-xl shadow-black z-50'>
          <h2 className="p-4 bg-gradient-to-r from-black to-blue-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white rounded-t-3xl">
            Modelos <span className="font-bold text-blue-300">STL</span> e impresión en <span className="font-bold text-blue-300">PLA</span>
          </h2>
          <div className="relative p-6 mb-12 rounded-b-3xl grid grid-cols-1 sm:grid-cols-2 gap-8 bg-gradient-to-r from-black to-blue-400  ">
            <div className="bg-indigo-300 p-6 rounded-3xl shadow-2xl flex flex-col items-center transform transition duration-500 hover:scale-105 hover:bg-indigo-400">
              <img src={comprar} alt="comprar" className="h-52 mb-4" />
              <h3 className="text-2xl font-extrabold text-black">Cults 3D</h3>
              <p className="text-md font-semibold text-black-700 mb-4">Explora y compra nuestros modelos STL en Cults 3D.</p>
              <p className="text-md font-semibold text-black-700 mb-4">+1000 Descargas</p>
              <div className="flex items-center pb-2">
                {Array(5).fill().map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                ))}
              </div>
              <a href="https://cults3d.com/es/usuarios/VIPER_3D/modelos-3d" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800 transition duration-300">Visítanos en Cults 3D</a>
            </div>
            <div className="bg-orange-300 p-6 rounded-3xl shadow-2xl flex flex-col items-center transform transition duration-500 hover:scale-105 hover:bg-orange-400">
              <img src={productos} alt="productos" className="h-52 mb-4" />
              <h3 className="text-2xl font-extrabold text-black">Etsy</h3>
              <p className="text-md font-semibold text-black-700 mb-4">Descubre y adquiere nuestros modelos 3D impresos en Etsy.</p>
              <p className="text-md font-semibold text-black-700 mb-4">+30 Clientes satisfechos</p>
              <div className="flex items-center pb-2">
                {Array(5).fill().map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-blue-400 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                ))}
              </div>
              <a href="https://www.etsy.com/es/shop/Viper3Des" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline hover:text-blue-800 transition duration-300">Visítanos en Etsy</a>
            </div>
          </div>
        </section>

        <section className="container mx-auto rounded-3xl shadow-xl shadow-black z-50 mt-12">
          <h2 className="p-4 bg-gradient-to-r from-black to-blue-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white rounded-t-3xl">
            Mensajes de nuestros <span className="font-bold text-blue-300">Clientes</span>
          </h2>
          <div className="relative p-6 mb-12 rounded-b-3xl grid grid-cols-1 sm:grid-cols-2 gap-8 bg-gradient-to-r from-black to-blue-400  shadow-black z-0">
            {reviews.map((review, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-3xl shadow-2xl flex flex-col items-start">
                <h3 className="text-2xl font-extrabold text-black">{review.platform}</h3>
                <p className="text-md font-semibold text-black-700 mb-4">"{review.review}"</p>
                <p className="text-md font-semibold text-black-700 mb-4">- {review.user}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto rounded-3xl shadow-xl shadow-black z-50 mt-12">
          <h2 className="p-4 bg-gradient-to-r from-black to-blue-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white rounded-t-3xl">
            Síguenos en <span className="font-bold text-blue-300">Redes Sociales</span>
          </h2>
          <div className="relative p-6 rounded-b-3xl flex flex-col sm:flex-row justify-around items-center bg-gradient-to-r from-black to-blue-400 space-y-4 sm:space-y-0">
            <div className="m-4 bg-gray-700 w-10/12 sm:w-4/12 p-4 rounded-3xl transform transition-all duration-500 hover:scale-110 hover:bg-gray-800 hover:shadow-lg">
              <a href="https://www.tiktok.com/@viper3doficial" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2">
                <img src={tiktok} alt="TikTok" className="h-24" />
                <p className="text-white">@viper3doficial</p>
              </a>
            </div>
            <div className="m-4 bg-indigo-700 w-10/12 sm:w-4/12 p-4 rounded-3xl transform transition-all duration-500 hover:scale-110 hover:bg-indigo-800 hover:shadow-lg">
              <a href="https://www.instagram.com/viper3doficial/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2">
                <img src={instagram} alt="Instagram" className="h-24" />
                <p className="text-white">@viper3doficial</p>
              </a>
            </div>
            <div className="m-4 bg-red-700 w-10/12 sm:w-4/12 p-4 rounded-3xl transform transition-all duration-500 hover:scale-110 hover:bg-red-800 hover:shadow-lg">
              <a href="https://www.youtube.com/@viper3doficial" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center space-y-2">
                <img src={youtube} alt="YouTube" className="h-24" />
                <p className="text-white">@viper3doficial</p>
              </a>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-gradient-to-r from-black to-blue-400 py-4 shadow-lg z-10 shadow-black">
        <div className="container mx-auto px-6 text-center text-white">
          &copy; <span id="currentYear"></span> Viper3D. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}
