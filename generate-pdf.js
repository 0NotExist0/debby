const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to wider width for better layout
    await page.setViewport({ width: 1000, height: 2000 });

    // Load the local HTML file
    const htmlPath = path.resolve(__dirname, 'index.html');
    const fileUrl = 'file://' + htmlPath;

    console.log('Loading:', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Wait a bit more for any animations or dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Force scroll-animated elements to be visible AND remove unwanted elements
    await page.evaluate(() => {
        // Make animated elements visible
        const animatedElements = document.querySelectorAll('.timeline__item, .education__card, .skills__category, .project__card, .stat, .about__text > *');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });

        // Remove unwanted elements from DOM
        const toRemove = document.querySelectorAll(
            '.cat-ad-wrapper, .cat-ad-label, .scroll-cat, .scroll-cat-emoji, ' +
            '.education__highlights, ' +
            '.timeline__tech, ' +
            '.stat, ' +
            '.about, ' +
            '.hero__greeting, ' +
            '.hero__actions, ' +
            '.hero__social, ' +
            '.btn, ' +
            '.nav, .header, .footer, ' +
            '.contact__intro, ' +
            '.skill-tag__level'
        );
        toRemove.forEach(el => el.remove());

        // Make education cards inline - combine degree, school, details
        document.querySelectorAll('.education__card').forEach(card => {
            const degree = card.querySelector('.education__degree');
            const school = card.querySelector('.education__school');
            const details = card.querySelector('.education__details');
            if (degree && school && details) {
                const text = document.createTextNode(`${degree.textContent.trim()} — ${school.textContent.trim()} (${details.textContent.trim()})`);
                card.innerHTML = '';
                card.appendChild(text);
                card.style.display = 'block';
                card.style.marginBottom = '1px';
            }
        });

        // Limit experience to first 3 jobs (remove 4th - shortest)
        const timelineItems = document.querySelectorAll('.timeline__item');
        if (timelineItems.length > 3) {
            for (let i = 3; i < timelineItems.length; i++) {
                timelineItems[i].remove();
            }
        }

        // Limit achievements to 1 per job
        document.querySelectorAll('.timeline__achievements').forEach(ul => {
            const items = ul.querySelectorAll('li');
            for (let i = 1; i < items.length; i++) {
                items[i].remove();
            }
        });

        // Make skill tags inline without levels
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.style.display = 'inline';
            tag.style.marginRight = '4px';
            tag.style.marginBottom = '2px';
        });

        // Make contact methods inline
        const contactMethods = document.querySelector('.contact__methods');
        if (contactMethods) {
            contactMethods.style.display = 'flex';
            contactMethods.style.flexWrap = 'wrap';
            contactMethods.style.gap = '8px';
            contactMethods.style.justifyContent = 'center';
        }
    });

    // Apply ultra-compact styles
    await page.addStyleTag({
        content: `
            @page { margin: 2mm; size: A4; }
            body { background: white !important; color: #1a1a2e !important; font-size: 6.5pt !important; line-height: 1.05 !important; }

            /* Hero - ultra compact */
            .hero { min-height: auto !important; padding: 1px 0 0 !important; background: none !important; text-align: center; }
            .hero::before, .hero::after { display: none !important; }
            .hero__name { font-size: 13pt !important; margin: 0 0 0 !important; line-height: 1.1 !important; }
            .hero__title { font-size: 7.5pt !important; margin: 0 0 0 !important; color: #555 !important; font-weight: 500 !important; }
            .hero__description { font-size: 5.5pt !important; margin: 0 0 1px !important; max-width: 100% !important; color: #444 !important; }

            /* Section titles - ultra compact */
            .section__title { font-size: 8pt !important; margin: 2px 0 0 !important; padding-bottom: 0 !important; border-bottom: 1px solid #ddd !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }

            /* Experience - ultra compact */
            .experience { padding: 0 !important; }
            .timeline { padding-left: 3px !important; }
            .timeline::before { left: 1px !important; width: 1px !important; }
            .timeline__item { padding-bottom: 1px !important; display: block !important; }
            .timeline__content {
                background: none !important;
                padding: 0 0 0 3px !important;
                border: none !important;
                border-left: 1px solid #e879c9 !important;
                border-radius: 0 !important;
                margin-left: -3px !important;
                display: block !important;
            }
            .timeline__header { margin-bottom: 0 !important; display: inline !important; }
            .timeline__role { font-size: 7pt !important; font-weight: 600 !important; margin: 0 !important; color: #1a1a2e !important; display: inline !important; }
            .timeline__company { font-size: 5.5pt !important; color: #666 !important; font-weight: normal !important; display: inline !important; margin-left: 3px !important; }
            .timeline__meta { font-size: 5pt !important; color: #888 !important; margin: 0 0 0 !important; display: inline !important; margin-left: 3px !important; }
            .timeline__achievements {
                margin: 0 !important;
                padding-left: 8px !important;
                font-size: 5.5pt !important;
                line-height: 1.05 !important;
            }
            .timeline__achievements li { margin: 0 !important; display: list-item !important; }

            /* Education - ultra compact inline */
            .education { padding: 0 !important; }
            .education__grid { display: block !important; }
            .education__card {
                background: none !important;
                border: none !important;
                padding: 0 0 0 3px !important;
                border-left: 1px solid #7c4dff !important;
                margin: 0 0 1px 0 !important;
                border-radius: 0 !important;
                display: block !important;
                font-size: 5.5pt !important;
            }

            /* Skills - ultra compact inline */
            .skills { padding: 0 !important; }
            .skills__categories { display: block !important; }
            .skills__category { margin-bottom: 1px !important; }
            .skills__category-title { font-size: 6pt !important; font-weight: 600 !important; margin: 0 0 0 !important; color: #1a1a2e !important; text-transform: uppercase !important; letter-spacing: 0.3px !important; display: inline !important; }
            .skills__list { font-size: 5pt !important; line-height: 1.1 !important; display: inline !important; }
            .skill-tag {
                display: inline !important;
                background: #f0f0f0 !important;
                padding: 0 2px !important;
                margin: 0 2px 0 0 !important;
                border-radius: 2px !important;
                font-size: 5pt !important;
                border: none !important;
            }

            /* Contact - inline single line */
            .contact { padding: 0 !important; }
            .contact__methods { display: flex !important; flex-wrap: wrap !important; gap: 6px !important; font-size: 5.5pt !important; justify-content: center !important; }
            .contact__method {
                display: inline-flex !important;
                align-items: center !important;
                gap: 1px !important;
                padding: 0 !important;
                background: none !important;
                border: none !important;
                white-space: nowrap !important;
            }
            .contact__icon { font-size: 6pt !important; }
            .contact__label { font-weight: 600 !important; color: #555 !important; }
            .contact__value { color: #333 !important; }
            .contact__availability { font-size: 5pt !important; color: #666 !important; margin: 1px 0 0 !important; text-align: center !important; }

            /* General cleanup */
            * { animation: none !important; transition: none !important; }
            ul, ol { margin: 0 !important; padding-left: 8px !important; }
            p { margin: 0 !important; }
            h1, h2, h3, h4 { margin: 1px 0 0 !important; }
            main > section { margin: 0 !important; padding: 0 !important; }
            br { display: none !important; }
            .skills__list br { display: none !important; }
        `
    });

    // Generate PDF - only first page
    const outputPath = path.resolve(__dirname, 'CV - Deborah Servidio.pdf');
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '2mm',
            right: '2mm',
            bottom: '2mm',
            left: '2mm'
        },
        pageRanges: '1'
    });

    console.log('PDF generated successfully at:', outputPath);

    await browser.close();
}

generatePDF().catch(console.error);