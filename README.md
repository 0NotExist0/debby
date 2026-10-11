# Portfolio Deborah Servidio

Sito web portfolio professionale di Deborah Servidio, ospitato su GitHub Pages.

## 🚀 Demo Live
[https://deborahservidio.github.io/curriculumDebby/](https://deborahservidio.github.io/curriculumDebby/)

## 📁 Struttura del Progetto
```
curriculumDebby/
├── index.html          # Pagina principale
├── styles.css          # Stili CSS
├── script.js           # JavaScript per interattività
├── CV - Deborah Servidio.pdf  # CV scaricabile
├── .gitignore          # File ignorati da Git
└── README.md           # Questo file
```

## ✨ Caratteristiche

- **Design Responsive**: Funziona perfettamente su mobile, tablet e desktop
- **Tema Chiaro/Scuro**: Si adatta automaticamente alle preferenze del sistema
- **Accessibile**: Semantica HTML5, supporto screen reader, navigazione da tastiera
- **Animazioni Fluide**: Intersection Observer per animazioni al scroll
- **Performance Ottimizzate**: Lazy loading, preload risorse critiche
- **SEO Ready**: Meta tags, struttura semantica, Open Graph
- **Print Friendly**: Stili ottimizzati per stampa/PDF

## 🛠️ Personalizzazione

### 1. Modifica i tuoi dati
Apri `script.js` e modifica l'oggetto `CONFIG.skills`:

```javascript
const CONFIG = {
    skills: {
        technical: [
            { name: 'La tua skill', level: 'Il tuo livello' },
            // ...
        ],
        soft: [
            'Tua soft skill',
            // ...
        ],
        languages: [
            { name: 'Lingua', level: 'Livello' },
            // ...
        ]
    }
};
```

### 2. Aggiorna il contenuto HTML
Modifica `index.html` per:
- Nome, titolo, descrizione nell'hero
- Esperienze lavorative (sezione `#experience`)
- Formazione (sezione `#education`)
- Progetti in evidenza (sezione `#projects`)
- Contatti (sezione `#contact`)

### 3. Sostituisci il CV
Sostituisci `CV - Deborah Servidio.pdf` con il tuo CV aggiornato.

### 4. Colori e Branding
Modifica le variabili CSS in `styles.css` (sezione `:root`):
```css
:root {
    --color-primary: #2563eb;  // Il tuo colore principale
    --color-accent: #0ea5e9;   // Colore d'accento
    // ...
}
```

## 📦 Deploy su GitHub Pages

### Opzione 1: Automatica (Consigliata)
1. Crea un repository su GitHub chiamato `curriculumDebby`
2. Carica tutti i file
3. Vai in **Settings > Pages**
4. Source: **Deploy from a branch**
5. Branch: **main** / **root**
6. Salva - il sito sarà online in pochi minuti!

### Opzione 2: Da Terminale
```bash
git init
git add .
git commit -m "Initial commit: portfolio website"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/curriculumDebby.git
git push -u origin main
```
Poi abilita GitHub Pages dalle impostazioni del repository.

## 🔧 Sviluppo Locale

Apri semplicemente `index.html` nel browser, oppure usa un server locale:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx serve)
npx serve .

# Con PHP
php -S localhost:8000
```

Poi visita `http://localhost:8000`

## 📱 Test Responsive

- Chrome DevTools: `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
- Firefox Responsive Design Mode: `Ctrl+Shift+M` / `Cmd+Option+M`

## ♿ Checklist Accessibilità

- [x] Contrasto colori WCAG AA
- [x] Navigazione da tastiera completa
- [x] Skip link per screen reader
- [x] Alt text per immagini (da aggiungere)
- [x] ARIA labels dove necessario
- [x] Focus visibile
- [x] Reduced motion support
- [x] Semantica HTML5 corretta

## 🎨 Personalizzazione Avanzata

### Aggiungere una foto profilo
In `index.html`, nell'hero, aggiungi:
```html
<div class="hero__image">
    <img src="tua-foto.jpg" alt="Deborah Servidio" class="hero__photo">
</div>
```

E in `styles.css`:
```css
.hero__photo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--color-primary);
}
```

### Aggiungere Google Analytics
In `index.html`, prima di `</head>`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 📄 Licenza

Questo progetto è open source e disponibile sotto licenza [MIT](LICENSE).

## 🤝 Contributi

Suggerimenti e miglioramenti sono benvenuti! Apri una issue o una pull request.

---

**Realizzato con ❤️ per mostrare il percorso professionale di Deborah Servidio**