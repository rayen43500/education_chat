import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import chatService from '../services/chatService';

// Fonction pour formatter le texte avec mise en évidence
const formatMessage = (text) => {
  if (!text) return '';
  
  // Remplacer les mots clés avec des balises de formatage
  const formattedText = text
    // Mettre en gras les mots entre **texte**
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Mettre en italique les mots entre *texte*
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Souligner les mots entre _texte_
    .replace(/_(.*?)_/g, '<u>$1</u>')
    // Colorer les conseils
    .replace(/(Conseil :.*)/g, '<span class="text-success">$1</span>')
    // Colorer les avertissements
    .replace(/(Attention :.*)/g, '<span class="text-warning">$1</span>')
    // Respecter les sauts de ligne
    .replace(/\n/g, '<br/>');
    
  return formattedText;
};

// Fonction sécurisée pour vérifier la prise en charge
const safeCheckBrowserCapabilities = () => {
  try {
    const hasBasicFeatures = typeof window !== 'undefined' && 
      window.File && 
      window.FileReader && 
      window.FileList;
    
    // Vérification sécurisée de Blob
    let hasBlobSupport = false;
    try {
      hasBlobSupport = typeof window.Blob === 'function';
    } catch (e) {
      console.error('Erreur lors de la vérification de Blob:', e);
    }
    
    return {
      hasFileSupport: hasBasicFeatures && hasBlobSupport,
      browserInfo: {
        name: navigator?.userAgent?.match(/chrome|chromium|crios/i) ? 'Chrome' :
              navigator?.userAgent?.match(/firefox|fxios/i) ? 'Firefox' :
              navigator?.userAgent?.match(/safari/i) ? 'Safari' :
              navigator?.userAgent?.match(/edg/i) ? 'Edge' :
              'Autre navigateur',
        version: 'Non détecté'
      }
    };
  } catch (e) {
    console.error('Erreur lors de la vérification du navigateur:', e);
    return { hasFileSupport: false, browserInfo: { name: 'Erreur', version: 'Erreur' } };
  }
};

const ChatPage = () => {
  // Vérification initiale sécurisée
  const { hasFileSupport, browserInfo } = safeCheckBrowserCapabilities();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'system',
      content: "You are ChatAlimi, an educational assistant helping students improve their written productions. Reply in French and be supportive. Use formatting such as **bold** for important points, *italics* for emphasis, and _underlined_ for corrections. Start guidance with 'Conseil :' and warnings with 'Attention :'. When appropriate, you can send images to illustrate your explanations. You can analyze images sent by the user and provide feedback on them.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      role: 'assistant',
      content: "Bonjour ! Je suis **ChatAlimi**, ton assistant pour t'aider avec tes productions écrites. Comment puis-je t'aider aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isFileUploadEnabled] = useState(hasFileSupport);
  const [browserDetails] = useState(browserInfo);

  // useEffect pour les avertissements si nécessaire
  useEffect(() => {
    if (!isFileUploadEnabled) {
      console.warn("Ce navigateur ne prend pas en charge toutes les fonctionnalités nécessaires pour l'upload d'images.");
      setError(`L'upload d'images n'est pas disponible sur ce navigateur. Si cette fonctionnalité est importante, essayez d'utiliser Chrome, Firefox ou Edge.`);
    }
  }, [isFileUploadEnabled]);

  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Erreur lors du défilement vers le bas:', err);
      // Fallback silencieux en cas d'erreur
    }
  };

  useEffect(() => {
    try {
      scrollToBottom();
    } catch (err) {
      console.error('Erreur lors du défilement automatique:', err);
    }
  }, [messages]);

  const handleImageChange = (e) => {
    if (!isFileUploadEnabled) {
      const browser = browserDetails.name || browserInfo.name;
      setError(`Votre navigateur (${browser}) ne prend pas en charge l'upload d'images. Veuillez utiliser un navigateur plus récent comme Chrome, Firefox ou Edge.`);
      return;
    }

    const file = e.target.files[0];
    console.log("Fichier sélectionné:", file);
    
    if (!file) {
      console.log("Aucun fichier sélectionné");
      return;
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError(`Le fichier sélectionné (${file.type}) n'est pas une image. Types acceptés: jpg, png, gif, webp.`);
      console.log("Type de fichier non valide:", file.type);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError(`L'image est trop volumineuse (${(file.size / 1024 / 1024).toFixed(2)} Mo). Maximum 5 Mo.`);
      console.log("Fichier trop volumineux:", file.size);
      return;
    }
    
    try {
      setSelectedImage(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      
      reader.onloadend = () => {
        console.log("Image chargée avec succès");
        setImagePreview(reader.result);
      };
      
      reader.onerror = (error) => {
        console.error("Erreur lors de la lecture du fichier:", error);
        setError(`Impossible de lire le fichier image (${file.name}). Erreur: ${error.message || 'inconnue'}`);
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Erreur lors du traitement de l'image:", err);
      setError(`Une erreur s'est produite lors du traitement de l'image: ${err.message || 'Erreur inconnue'}`);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerImageSelect = () => {
    if (!isFileUploadEnabled) {
      const browser = browserDetails.name || browserInfo.name;
      const version = browserDetails.version || browserInfo.version;
      setError(`Votre navigateur (${browser} ${version}) ne prend pas en charge l'upload d'images. Veuillez utiliser Chrome, Firefox ou Edge.`);
      return;
    }
    
    try {
      // Vérifier si fileInputRef.current existe avant d'appeler click()
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        console.error("Référence au input file manquante");
        setError("Impossible d'ouvrir le sélecteur de fichiers. Veuillez actualiser la page ou utiliser un autre navigateur.");
      }
    } catch (err) {
      console.error("Erreur lors de l'ouverture du sélecteur de fichiers:", err);
      setError(`Erreur lors de l'ouverture du sélecteur de fichiers: ${err.message || 'Erreur inconnue'}`);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    console.log("Envoi du message - Texte:", newMessage);
    console.log("Envoi du message - Image:", selectedImage);
    
    if (newMessage.trim() === '' && !selectedImage) {
      console.log("Aucun contenu à envoyer");
      return;
    }
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message with image if selected
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: newMessage,
      timestamp: timestamp,
      image: imagePreview
    };
    
    console.log("Message utilisateur créé:", userMessage);
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setError(null);
    clearSelectedImage();
    
    try {
      // Préparer un message pour l'API qui décrit l'image si présente
      let messageForAPI = newMessage;
      
      if (userMessage.image) {
        console.log("Image détectée dans le message");
        messageForAPI += "\n\n[L'utilisateur a joint une image à ce message]";
      }
      
      // Format messages for the API (only include role and content)
      const apiMessages = messages
        .filter(msg => msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant')
        .map(({ role, content }) => ({ role, content }));
      
      // Add the new user message
      apiMessages.push({ role: userMessage.role, content: messageForAPI });
      
      console.log("Appel de l'API avec les messages:", apiMessages);
      
      // Get response from AI
      const response = await chatService.getChatResponse(apiMessages);
      
      console.log("Réponse reçue de l'API:", response);
      
      // Add bot response - handle both text-only and multimodal responses
      const botResponse = {
        id: messages.length + 2,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Check if response is a multimodal object
      if (typeof response === 'object' && response !== null && response.text !== undefined) {
        // C'est une réponse multimodale avec potentiellement des images
        botResponse.content = response.text;
        
        // Ajouter les images s'il y en a
        if (response.images && response.images.length > 0) {
          botResponse.images = response.images;
        }
      } else {
        // Réponse texte standard
        botResponse.content = response;
      }
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (err) {
      console.error('Error getting chat response:', err);
      // Utiliser un message d'erreur par défaut si l'erreur ou le message d'erreur est indéfini
      const errorMessage = err?.message || "Une erreur s'est produite lors de la communication avec l'IA";
      setError(`Désolé, ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page d-flex flex-column vh-100">
      <header className="container-fluid py-2 bg-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to="/" className="btn btn-outline-secondary me-3">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1 className="h5 mb-0">
              <span style={{ color: 'var(--primary-color)' }}>Chat</span>
              <span className="tech-accent">Alimi</span> 
              <span className="badge bg-info ms-2" style={{ fontSize: '0.6rem', verticalAlign: 'top' }}>AI</span>
            </h1>
          </div>
          <div className="badge bg-success">
            <i className="fas fa-graduation-cap me-1"></i> Assistant Éducatif
          </div>
        </div>
      </header>

      <div className="container flex-grow-1 py-4">
        <div className="chat-container p-3 d-flex flex-column mx-auto" style={{ maxWidth: '850px' }}>
          <div className="chat-messages flex-grow-1 overflow-auto p-3 mb-3" style={{ maxHeight: '70vh' }}>
            {messages
              .filter(message => message.role !== 'system')
              .map((message) => (
                <div 
                  key={message.id} 
                  className={`d-flex mb-3 ${message.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="me-2 align-self-end mb-1">
                      <div className="avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-robot text-white"></i>
                      </div>
                    </div>
                  )}
                  <div 
                    className={`message p-3 rounded-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-light border'
                    }`}
                    style={{ maxWidth: '80%' }}
                  >
                    {message.image && (
                      <div className="message-image mb-2">
                        <img 
                          src={message.image} 
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px', cursor: 'pointer' }}
                          onClick={() => window.open(message.image, '_blank')}
                          aria-label="Image partagée par l'utilisateur"
                        />
                      </div>
                    )}
                    
                    {/* Afficher les images provenant du modèle AI (si présentes) */}
                    {message.images && message.images.map((imageUrl, index) => (
                      <div className="message-image mb-2" key={`img-${message.id}-${index}`}>
                        <img 
                          src={imageUrl} 
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px', cursor: 'pointer' }}
                          onClick={() => window.open(imageUrl, '_blank')}
                          aria-label={`Image ${index + 1} partagée par l'assistant`}
                        />
                      </div>
                    ))}
                    
                    <div 
                      className="message-text"
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(message.content) 
                      }}
                    />
                    
                    <div 
                      className={`message-time small ${
                        message.role === 'user' ? 'text-light' : 'text-muted'
                      } mt-1`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="ms-2 align-self-end mb-1">
                      <div className="avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-user text-white"></i>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
            {isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="me-2 align-self-end mb-1">
                  <div className="avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-robot text-white"></i>
                  </div>
                </div>
                <div className="message p-3 rounded-3 bg-light border">
                  <div className="message-text">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input">
            {imagePreview && (
              <div className="selected-image-preview mb-2 position-relative">
                <img 
                  src={imagePreview} 
                  className="img-fluid rounded message-image"
                  aria-hidden="true"
                  alt=""
                />
                <button 
                  type="button" 
                  className="btn-close position-absolute top-0 end-0 bg-danger text-white" 
                  aria-label="Supprimer" 
                  onClick={clearSelectedImage}
                  style={{ padding: '0.25rem', margin: '0.25rem' }}
                ></button>
              </div>
            )}
            
            <div className="input-group">
              <button
                type="button"
                className="btn btn-outline-secondary btn-image"
                onClick={triggerImageSelect}
                title="Joindre une image (JPG, PNG, GIF - max 5 Mo)"
                disabled={!isFileUploadEnabled || isLoading}
              >
                <i className="fas fa-image"></i>
              </button>
              <input
                type="text"
                className="form-control"
                placeholder="Écris ton message ici..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={(newMessage.trim() === '' && !selectedImage) || isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
                {' '}Envoyer
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              capture="environment"
            />
          </form>
        </div>
        
        <div className="tips text-center mt-4">
          <div className="card p-3 border-0 shadow-sm">
            <p className="text-muted small mb-0">
              <i className="fas fa-lightbulb me-2 text-warning"></i>
              <strong>Conseil :</strong> Tu peux joindre une image à ton message en cliquant sur l'icône <i className="fas fa-image"></i>.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="py-3 bg-white border-top">
        <div className="container text-center">
          <p className="text-muted small mb-0">
            <strong>ChatAlimi</strong> - Assistant IA pour les productions écrites | Ministère de l'Éducation Tunisie
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage; 