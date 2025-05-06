import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [language, setLanguage] = useState('fr'); // Gestion de la langue (français par défaut)

  const texts = {
    fr: {
      title: "Hello ! Voici Talom AI !",
      subtitle: "Talom AI, c'est trop génial !",
      description: "Ton super ami IA t'aide à écrire des histoires magiques et à apprendre en t'amusant !",
      buttonStart: "C'est parti !",
      buttonChat: "Écris avec Talom !",
      card1Title: "Super Malin",
      card1Text: "Talom lit tes histoires et te donne des idées géniales !",
      card2Title: "Apprends Facile",
      card2Text: "Deviens un champion de l'écriture avec Talom !",
      card3Title: "Astuces Rapides",
      card3Text: "Talom te donne des conseils tout de suite pour être encore meilleur !",
      footer: "Fait avec ❤️ par Talom AI pour les super élèves !",
    },
    ar: {
      title: "مرحبًا ! هذا تالوم AI !",
      subtitle: "تالوم AI رائع جدًا !",
      description: "صديقك الذكي يساعدك في كتابة قصص سحرية والتعلم بمرح !",
      buttonStart: "هيا بنا !",
      buttonChat: "اكتب مع تالوم !",
      card1Title: "ذكي جدًا",
      card1Text: "تالوم يقرأ قصصك ويعطيك أفكارًا رائعة !",
      card2Title: "تعلم بسهولة",
      card2Text: "كن بطل الكتابة مع تالوم !",
      card3Title: "نصائح سريعة",
      card3Text: "تالوم يعطيك نصائح فورية لتكون أفضل !",
      footer: "صُنع بحب من تالوم AI للتلاميذ الرائعين !",
    },
  };

  const playSound = () => {
    const audio = new Audio('/assets/click-sound.mp3');
    audio.play().catch(() => {}); // Gestion des erreurs pour les navigateurs restrictifs
  };

  return (
    <div className="dashboard-container education-bg">
      <header className="container-fluid py-3 bg-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/fr/d/d9/Logotype_du_minist%C3%A8re_de_l%27%C3%A9ducation_Tunisie.png" 
              alt="Ministère de l'Éducation Tunisie" 
              className="ministry-logo me-3"
              aria-label="Logo du Ministère de l'Éducation"
            />
            <h1 className="h4 mb-0">Talom <span className="tech-accent">AI</span></h1>
          </div>
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-language me-2" 
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              aria-label={language === 'fr' ? "Passer à l'arabe" : "Passer au français"}
            >
              {language === 'fr' ? 'العربية' : 'Français'}
            </button>
            <Link to="/chat" className="btn btn-primary btn-start" onClick={playSound}>
              {texts[language].buttonStart}
            </Link>
          </div>
        </div>
      </header>

      <div className="hero-section container">
        <div className="mascot-container">
          
        </div>
        <div className="row align-items-center mb-5">
          <div className="col-lg-6">
            <h1 className="kid-title mb-4">{texts[language].title}</h1>
            <p className="kid-text mb-4">{texts[language].description}</p>
            <Link to="/chat" className="btn btn-primary btn-lg btn-start" onClick={playSound}>
              {texts[language].buttonChat}
            </Link>
          </div>
          <div className="col-lg-6">
            <img 
              src="/assets/kid-ai-illustration.png" 
              alt="Illustration éducative pour enfants"
              className="img-fluid rounded shadow-lg kid-image"
              onError={(e) => { e.target.src = 'https://img.freepik.com/free-vector/cute-robot-holding-book-reading-cartoon-vector-icon-illustration-technology-education-icon_138676-5673.jpg'; }}
            />
          </div>
        </div>

        <h2 className="text-center mb-5 kid-subtitle">{texts[language].subtitle}</h2>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card ai-card h-100">
              <div className="card-body text-center">
                <div className="icon-container">
                  <i className="fas fa-robot" aria-hidden="true"></i>
                </div>
                <h3 className="kid-card-title">{texts[language].card1Title}</h3>
                <p className="kid-card-text">{texts[language].card1Text}</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card ai-card h-100">
              <div className="card-body text-center">
                <div className="icon-container">
                  <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                </div>
                <h3 className="kid-card-title">{texts[language].card2Title}</h3>
                <p className="kid-card-text">{texts[language].card2Text}</p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card ai-card h-100">
              <div className="card-body text-center">
                <div className="icon-container">
                  <i className="fas fa-comments" aria-hidden="true"></i>
                </div>
                <h3 className="kid-card-title">{texts[language].card3Title}</h3>
                <p className="kid-card-text">{texts[language].card3Text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-4 bg-white border-top">
        <div className="container text-center">
          <p className="mb-1">© 2023 Ministère de l'Éducation Tunisie</p>
          <p className="kid-text small">{texts[language].footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;