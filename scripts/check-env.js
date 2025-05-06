/**
 * Script to check if required environment variables are set
 * Run with: node scripts/check-env.js
 */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

console.log(chalk.blue('Checking environment variables for ChatAlimi...'));

// Vérifier si le fichier .env.local existe
const envFile = path.join(process.cwd(), '.env.local');
const envFileExists = fs.existsSync(envFile);

if (envFileExists) {
  console.log(chalk.green('✓ Fichier .env.local trouvé!'));
  
  // Lire le contenu du fichier
  const envContent = fs.readFileSync(envFile, 'utf8');
  if (envContent.includes('REACT_APP_GITHUB_TOKEN=')) {
    if (envContent.includes('REACT_APP_GITHUB_TOKEN=your_github_token_here')) {
      console.log(chalk.yellow('⚠️ Token GitHub non personnalisé dans .env.local!'));
      console.log(chalk.yellow('Remplacez "your_github_token_here" par votre vrai token GitHub.'));
    } else {
      console.log(chalk.green('✓ Variable REACT_APP_GITHUB_TOKEN définie dans .env.local'));
    }
  } else {
    console.log(chalk.red('⚠️ REACT_APP_GITHUB_TOKEN non trouvé dans .env.local!'));
    console.log(chalk.yellow('Ajoutez la ligne suivante dans votre fichier .env.local:'));
    console.log(chalk.grey('REACT_APP_GITHUB_TOKEN=your_github_token_here'));
  }
} else {
  console.log(chalk.red('⚠️ Fichier .env.local non trouvé!'));
  console.log(chalk.yellow('Ce fichier est nécessaire pour les variables d\'environnement.'));
  console.log(chalk.yellow('Créez un fichier .env.local à la racine du projet avec:'));
  console.log(chalk.grey('REACT_APP_GITHUB_TOKEN=your_github_token_here'));
}

// Check for GitHub token in environment
const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
if (!githubToken) {
  console.log(chalk.yellow('⚠️ Variable REACT_APP_GITHUB_TOKEN non trouvée dans l\'environnement actuel'));
  console.log(chalk.yellow('Même si elle est définie dans .env.local, elle sera disponible au prochain démarrage.'));
  console.log('');
  console.log(chalk.yellow('Vous pouvez obtenir un token GitHub:'));
  console.log(chalk.grey('1. GitHub > Settings > Developer settings > Personal access tokens > Fine-grained tokens'));
  console.log(chalk.grey('2. Générez un token avec la permission "models:read"'));
} else {
  console.log(chalk.green('✓ REACT_APP_GITHUB_TOKEN est définie dans l\'environnement!'));
}

console.log('');
console.log(chalk.blue('Vérification des variables d\'environnement terminée.')); 