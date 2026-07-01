import React from 'react';
import Newsletter from '../components/Newsletter';
import logoSensei from './assets/logo-sensei.png';
import Typewriter from './Typewriter';
import professorAnime from './assets/professor-anime.png';

const JapaneseLandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans scroll-smooth">
      {/* Navbar Fixa */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <img 
                src={logoSensei} 
                alt="Logo Nihongo com Sensei" 
                className="h-23 w-auto object-contain" 
              />
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 font-medium text-slate-600">
            <a href="#metodologia" className="hover:text-red-600 transition-colors">Metodologia</a>
            <a href="#sobre" className="hover:text-red-600 transition-colors">Sobre o Professor</a>
            <a href="#contato" className="hover:text-red-600 transition-colors">Contato</a>
          </nav>
          <a href="#contato" className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors">
            Agendar Aula
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 to-white py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          
          {/* Coluna do Texto */}
          <div className="md:w-1/2 space-y-6 z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Aprenda Japonês de Forma <Typewriter />
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Desvende a cultura, estude através de suas músicas favoritas e domine o idioma com um método dinâmico, moderno e focado na fluência real.
            </p>
            <div className="pt-4 flex gap-4">
              <a href="#contato" className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-transform transform hover:-translate-y-1">
                Começar Jornada
              </a>
              <a href="#metodologia" className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-full text-lg font-bold hover:bg-slate-50 transition-colors">
                Saiba Mais
              </a>
            </div>
          </div>
          
          {/* Coluna da Imagem */}
          <div className="md:w-1/2 w-full flex justify-center items-center">
            <img 
              src={professorAnime} 
              alt="Sensei Anime do Curso" 
              className="w-full max-w-lg md:max-w-xl h-auto rounded-3xl object-contain drop-shadow-xl" 
            />
          </div>

        </div>
      </section>

      {/* Seção de Metodologia */}
      <section id="metodologia" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Aprenda além dos livros didáticos</h3>
          <p className="text-slate-600 mb-16 max-w-2xl mx-auto">
            Utilizamos um sistema interativo inspirado na imersão com mídia nativa. Absorva o idioma enquanto aproveita o conteúdo que você ama.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 text-left">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                🎵
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Estudo com Letras e Músicas</h4>
              <p className="text-slate-600">
                Aprenda a gramática em contexto decifrando músicas, animes e diálogos reais. A repetição natural das músicas fixa o vocabulário de forma eficiente.
              </p>
            </div>
            
            <div className="p-8 bg-slate-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 text-left">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                🗣️
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Foco na Fala (Keigo e Casual)</h4>
              <p className="text-slate-600">
                Diferencie a teoria da prática. Entenda quando ser formal, quando usar gírias e perca o medo de se comunicar desde a primeira aula.
              </p>
            </div>
            
            <div className="p-8 bg-slate-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 text-left">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                ⛩️
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Imersão Cultural Total</h4>
              <p className="text-slate-600">
                O idioma e a cultura andam juntos. Entenda a história e o pensamento por trás de cada ideograma (Kanji) e expressão idiomática.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />

      {/* Footer & CTA */}
      <footer id="contato" className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h3 className="text-3xl md:text-4xl font-bold">Pronto para dar o primeiro passo?</h3>
          <p className="text-slate-400 text-lg">
            Entre em contato para agendarmos um bate-papo. Vamos estruturar o seu plano de estudos ideal focado nos seus objetivos com a língua japonesa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button className="bg-[#25D366] hover:bg-[#20b858] text-white px-8 py-4 rounded-full font-bold transition-colors flex items-center justify-center gap-3">
               <span>Falar no WhatsApp</span>
            </button>
            <button className="bg-transparent border-2 border-slate-600 hover:border-slate-400 px-8 py-4 rounded-full font-bold transition-colors">
              Enviar um E-mail
            </button>
          </div>
        </div>
        <div className="mt-16 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} OiTutor. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default JapaneseLandingPage;