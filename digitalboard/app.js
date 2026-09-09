const CLOUDFLARE_PROXY = "https://white-sun-144.idefaye.workers.dev/"; 
const PUBLIC_PAGE = "https://local.churchofjesuschrist.org/es/units/ca/qc/barrio-victoria?icid=actsh|cmh|web|mis|global|global";
const ICAL_FEED = "https://churchofjesuschrist.org/church-calendar/services/ext/v3.0/export/ical/group/973218fd9afc4304bca21e40a57713ed";

// ROTATION CONFIGURATION: Slide duration set in milliseconds (2000ms = 2 seconds)
const SLIDE_DURATION_MS = 3000; 

let activeSlideIndex = 0;
let rotationTimer = null;
let publicSlidesArray = [];

async function initDashboard() {
    try {
        const proxyUrl = CLOUDFLARE_PROXY + "?url=" + encodeURIComponent(ICAL_FEED);
        const response = await fetch(proxyUrl);
        const icalText = await response.text();
        
        const allEvents = parseICS(icalText);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingEvents = allEvents.filter(evt => evt.start >= today);

        if (upcomingEvents.length === 0) {
            document.getElementById("public-grid").innerHTML = "<div class='text-slate-400 p-4'>Aucune activité à venir</div>";
            document.getElementById("internal-ticker").innerHTML = "";
            return;
        }

        upcomingEvents.sort((a, b) => a.start - b.start);

        const publicEvents = [];
        const internalEvents = [];
        const seenPublicTitles = new Set();

        upcomingEvents.forEach(evt => {
            const hasPublicWebLink = evt.url && evt.url.includes("local.churchofjesuschrist.org");
            const eventTitleLower = (evt.title || "").toLowerCase().trim();

            if (hasPublicWebLink) {
                if (!seenPublicTitles.has(eventTitleLower) && publicEvents.length < 6) {
                    publicEvents.push(evt);
                    seenPublicTitles.add(eventTitleLower);
                } else {
                    internalEvents.push(evt);
                }
            } else {
                internalEvents.push(evt);
            }
        });

        // Background script to scrape event descriptions and flyer images
        await resolvePublicImages(publicEvents);
        
        publicSlidesArray = publicEvents;
        
        // Initialize the presentation views
        startSlideRotation();
        renderInternalGrid(internalEvents);

    } catch (err) {
        console.error("Dashboard engine failure:", err);
    }
}

function startSlideRotation() {
    if (rotationTimer) clearInterval(rotationTimer);
    if (publicSlidesArray.length === 0) {
        document.getElementById("public-grid").innerHTML = "<div class='text-slate-400 p-4'>Aucun événement public en vedette</div>";
        return;
    }
    
    // Draw the initial slide immediately
    renderActiveSlide();
    
    // Set up the interval rotation loop
    rotationTimer = setInterval(() => {
        activeSlideIndex = (activeSlideIndex + 1) % publicSlidesArray.length;
        renderActiveSlide();
    }, SLIDE_DURATION_MS);
}
async function resolvePublicImages(eventsList) {
    for (let evt of eventsList) {
        evt.bannerImg = "https://unsplash.com";
        evt.extractedDescription = ""; // Fallback blank container
        
        if (evt.url) {
            try {
                const proxyUrl = CLOUDFLARE_PROXY + "?url=" + encodeURIComponent(evt.url);
                const response = await fetch(proxyUrl);
                const htmlText = await response.text();
                
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, "text/html");
                
                // 1. Scrape the Flyer Graphic
                const imgElement = doc.querySelector(".Hero img");
                if (imgElement && imgElement.src) {
                    evt.bannerImg = imgElement.src;
                }
                
                // 2. Scrape the Live text details from the Event description profile
                const descElement = doc.querySelector(".Event--description, [class*='description'], .Hero + div p");
                if (descElement) {
                    evt.extractedDescription = descElement.innerText.trim();
                } else if (evt.description) {
                    // Fallback to iCal text field if webpage element is completely clear
                    evt.extractedDescription = evt.description;
                }
            } catch (e) {
                console.error("Scraper failed to capture data details:", e);
            }
        }
    }
}

function renderActiveSlide() {
    const slideContainer = document.getElementById("public-grid");
    const evt = publicSlidesArray[activeSlideIndex];
    if (!evt) return;

    const timeConfig = evt.isAllDay ? { weekday: 'long', month: 'short', day: 'numeric' } : { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formattedDate = evt.start.toLocaleDateString('fr-CA', timeConfig);

    // FIXED: Strict structural frame locking using Tailwind v4 structural fractions
    slideContainer.innerHTML = `
        <div class="flex flex-col h-full w-full overflow-hidden">
            
            <!-- UPPER BOX (75% Fixed Height): Bound Image Container -->
            <div class="h-3/4 w-full rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800/60 relative flex items-center justify-center">
                <img src="${evt.bannerImg}" class="h-full w-full object-contain object-center" alt="Flyer" />
                <div class="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-400 border border-slate-700/60 shadow-md">
                    Annonce ${activeSlideIndex + 1} / ${publicSlidesArray.length}
                </div>
            </div>
            
            <!-- LOWER BOX (25% Fixed Height): Rigid Metadata Text Panel -->
            <div class="h-1/4 w-full flex flex-col justify-between pt-3 overflow-hidden">
                <div class="flex flex-col shrink-0">
                    <h1 class="text-2xl font-black tracking-tight text-white leading-tight uppercase truncate">${evt.title}</h1>
                    <p class="text-xs text-amber-400 font-bold uppercase tracking-wide mt-0.5">📅 ${formattedDate}</p>
                </div>
                
                <!-- Expanded multi-line context description card -->
                <div class="flex-1 mt-1.5 text-slate-300 text-xs leading-relaxed font-normal overflow-hidden line-clamp-3 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
                    ${evt.extractedDescription || "<i class='text-slate-500'>Aucune description supplémentaire fournie pour cette activité.</i>"}
                </div>
            </div>

        </div>
    `;
}


function renderInternalGrid(eventsList) {
    const gridContainer = document.getElementById("internal-ticker");
    if (eventsList.length === 0) {
        gridContainer.innerHTML = "<div class='text-slate-500 text-xs p-2'>Aucune autre activité</div>";
        return;
    }

    gridContainer.innerHTML = "";
    // Display up to 10 events vertically inside the right column sidebar
    eventsList.slice(0, 10).forEach(evt => {
        const timeConfig = evt.isAllDay ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', hour: '2-digit' };
        const formattedDate = evt.start.toLocaleDateString('fr-CA', timeConfig);
        
        const card = document.createElement("div");
        card.className = "bg-slate-800/40 border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between border-l-2 border-l-teal-500 min-h-[76px] shrink-0 shadow-sm";
        card.innerHTML = `
            <h4 class="font-bold text-xs text-slate-200 line-clamp-2 leading-tight">${evt.title}</h4>
            <div class="flex justify-between items-center text-[10px] text-slate-400 mt-1 uppercase font-medium">
                <span class="text-teal-400 font-bold">${formattedDate}</span>
                ${evt.location ? `<span class="truncate max-w-[55%]">📍 ${evt.location.split('/')[0]}</span>` : ''}
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

function parseICS(icsText) {
    const cleanText = icsText.replace(/\r?\n\s/g, "");
    const lines = cleanText.split(/\r?\n/);
    const events = [];
    let currentEvent = null;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        if (line.startsWith("BEGIN:VEVENT")) {
            currentEvent = { isAllDay: false };
        } else if (line.startsWith("END:VEVENT")) {
            if (currentEvent && currentEvent.title) {
                events.push(currentEvent);
            }
            currentEvent = null;
        } else if (currentEvent) {
            if (line.startsWith("SUMMARY:")) {
                currentEvent.title = line.substring(8).replace(/\\,/g, ",");
            } else if (line.startsWith("LOCATION:")) {
                currentEvent.location = line.substring(9).replace(/\\,/g, ",");
            } else if (line.startsWith("DESCRIPTION:")) {
                currentEvent.description = line.substring(12).replace(/\\,/g, ",");
            } else if (line.startsWith("URL")) {
                const urlIndex = line.indexOf("http");
                if (urlIndex !== -1) currentEvent.url = line.substring(urlIndex).trim();
            } else if (line.startsWith("DTSTART")) {
                const parts = line.split(":");
                if (line.includes("VALUE=DATE")) {
                    currentEvent.isAllDay = true;
                }
                if (parts.length > 1) {
                    currentEvent.start = parseICSDate(parts[1].trim());
                }
            }
        }
    }
    return events;
}

function parseICSDate(dateStr) {
    const year = dateStr.substring(0, 4);
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = dateStr.substring(6, 8);
    
    if (dateStr.length < 11) {
        return new Date(year, month, day);
    }
    
    const hour = dateStr.substring(9, 11);
    const min = dateStr.substring(11, 13);
    return new Date(Date.UTC(year, month, day, hour, min));
}

function createMockPublicGrid() {
    document.getElementById("public-grid").innerHTML = "<div class='text-slate-500 p-4'>Erreur lors du rendu de l'interface en direct</div>";
}

initDashboard();
