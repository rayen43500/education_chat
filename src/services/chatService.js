import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// This service handles integration with the Azure AI Inference SDK
export class ChatService {
  constructor() {
    // Débogage: afficher toutes les variables d'environnement pour vérifier
    console.log("Variables d'environnement disponibles:", Object.keys(process.env));
    console.log("REACT_APP_ vars:", Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    console.log("Token prefixe (pour débogage):", process.env.REACT_APP_GITHUB_TOKEN?.substring(0, 10) + "...");
    
    // Token de secours pour tester (à remplacer par un vrai token pour production)
    const backupToken = "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";
    
    // Using the token from environment variables
    this.token = process.env.REACT_APP_GITHUB_TOKEN || backupToken;
    this.endpoint = "https://models.github.ai/inference";
    this.model = "openai/gpt-4.1";
    
    // Vérifier si le token est défini
    if (!this.token || this.token === "your_github_token_here") {
      console.error("Token GitHub non défini ! Veuillez définir REACT_APP_GITHUB_TOKEN dans .env.local");
    }
  }

  // Initialize the client
  getClient() {
    return ModelClient(
      this.endpoint,
      new AzureKeyCredential(this.token)
    );
  }

  // Get a response from the AI model
  async getChatResponse(messages) {
    try {
      // Vérifier si le token est défini
      if (!this.token || this.token === "your_github_token_here") {
        throw new Error("Token GitHub non défini. Veuillez configurer votre token dans le fichier .env.local");
      }
      
      const client = this.getClient();
      
      const response = await client.path("/chat/completions").post({
        body: {
          messages: messages,
          temperature: 0.7,
          top_p: 1.0,
          model: this.model
        }
      });

      if (isUnexpected(response)) {
        console.error("Réponse inattendue de l'API:", response.body);
        if (response.status === 401) {
          throw new Error("Erreur d'authentification. Vérifiez que votre token GitHub est valide et a les permissions nécessaires.");
        }
        throw new Error(response.body.error?.message || "Erreur de l'API");
      }

      // Vérifier si la réponse contient un tableau de contenus (multimodal)
      const responseMessage = response.body.choices[0].message;
      
      // Si la réponse est de type multimodal (peut contenir des images)
      if (responseMessage.content && Array.isArray(responseMessage.content)) {
        console.log("Réponse multimodale détectée:", responseMessage.content);
        
        // Traiter la réponse multimodale
        return this.processMultimodalResponse(responseMessage.content);
      }
      
      // Format standard (texte uniquement)
      return responseMessage.content;
    } catch (error) {
      console.error("Error getting chat response:", error);
      // S'assurer que l'erreur a un message
      const errorMessage = error.message || "Erreur inconnue lors de la communication avec l'API";
      const errorObject = new Error(errorMessage);
      errorObject.message = errorMessage;
      throw errorObject;
    }
  }

  // Traite une réponse multimodale (contient potentiellement des images)
  processMultimodalResponse(contentArray) {
    // Exemple de format attendu: [{ type: "image_url", image_url: { url: "..." } }, { type: "text", text: "..." }]
    let result = {
      text: "",
      images: []
    };

    // Parcourir tous les éléments de contenu
    for (const content of contentArray) {
      if (content.type === "text") {
        // Ajouter le texte à la réponse
        result.text += content.text;
      } else if (content.type === "image_url" && content.image_url && content.image_url.url) {
        // Ajouter l'URL de l'image à la liste des images
        result.images.push(content.image_url.url);
      }
    }

    console.log("Réponse traitée:", result);
    return result;
  }
}

// Create a single instance of the service
const chatServiceInstance = new ChatService();

// Export the instance as default
export default chatServiceInstance; 