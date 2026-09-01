// GatiConnect Frontend Engine: Multi-Language, Profile Hub & History, GPS & Escrow
const API_BASE = window.location.origin;

let allUsers = [];
let currentUser = null; // null represents Guest Mode
let currentCategory = "ALL";
let currentIntentDoor = "DOOR_1";
let currentTrips = [];
let currentLang = "HI"; // "HI" for Hindi, "EN" for English

// Chat State
let activeChatTripId = null;
let activeChatPartnerId = null;
let chatPollInterval = null;

// Auth & OTP State
let pendingAuthPhone = "";
let otpCountdownTimer = null;
let otpSecondsLeft = 30;

// SOS State
let activeSosBooking = null;

// Leaflet Map & GPS Tracking State
let leafletMap = null;
let mapCarMarker = null;
let mapRoutePolyline = null;
let trackingAnimationInterval = null;
let trackingWebSocket = null;
let currentDeviceCoordinates = { lat: 23.1815, lng: 77.4204 };

// PWA Deferred Prompt
let deferredPwaPrompt = null;

// Voice Recognition State
let speechRecognizer = null;
let isRecordingVoice = false;

// 🇮🇳 MULTI-LANGUAGE TRANSLATION DICTIONARY
const I18N_DICT = {
    HI: {
        brandTagline: "स्मार्ट मोबिलिटी व क्षमता नेटवर्क",
        loginBtn: "लॉगिन / साइन-अप",
        postBtnHeader: "+ पोस्ट करें (Post)",
        pwaTitle: "📲 GatiConnect ऐप फोन में इंस्टॉल करें",
        pwaDesc: "बिना प्ले स्टोर के 1-क्लिक में होम स्क्रीन पर जोड़ें और तेज़ी से चलाएं!",
        pwaBtn: "Install App",
        heroGreeting: "नमस्ते",
        heroSub: "आज आपको क्या सेवा चाहिए?",
        heroDesc: "सीधे अपनी ज़रूरत चुनें — आधार सत्यापित, लाइव GPS ट्रैकिंग और 100% एस्क्रो सुरक्षा!",
        trendingLabel: "सबसे लोकप्रिय रूट्स (Trending):",
        tileRideshareTitle: "🚗 Ride Share",
        tileRideshareSub: "सफ़र व सीट शेयरिंग",
        tileRideshareDesc: "कार या बाइक में सीट पाएं या खाली सीट शेयर कर पेट्रोल का खर्च बांटें।",
        tileDriverTitle: "👨✈️ Driver Match",
        tileDriverSub: "वेरीफाइड ड्राइवर कनेक्ट",
        tileDriverDesc: "अपनी कार के लिए ड्राइवर ढूंढें या ड्राइवर बनकर रास्ते में कमाएं।",
        tileParcelTitle: "📦 P2P Parcel",
        tileParcelSub: "लोकल कॉलोनी व पार्सल",
        tileParcelDesc: "कॉलोनी-टू-कॉलोनी टिफिन, दवाइयां व जरूरी सामान ₹30-₹40 में भेजें।",
        tileCargoTitle: "🚚 Return Cargo",
        tileCargoSub: "छोटा हाथी व खाली ट्रक",
        tileCargoDesc: "दुकान/फैक्ट्री का माल भेजें या खाली लौट रहे ट्रक में 50% छूट पाएं।",
        availableBadge: "उपलब्ध",
        driversBadge: "ड्राइवर्स",
        parcelBadge: "पार्सल",
        tripsBadge: "लोडिंग ट्रिप्स",
        synergyTitle: "💡 Smart Route Synergies (आपसी तालमेल):",
        synergyBtn: "View Synergy",
        activeBookingsTitle: "Active Bookings & Live GPS Escrow",
        myListingsTitle: "My Posted Listings & Needs",
        backHome: "← वापस होम पर जाएं",
        postBtnCat: "+ अपनी ज़रूरत पोस्ट करें",
        bestMatchesTitle: "🎯 आपकी ज़रूरत के लिए सबसे बेहतरीन मैच (Best Matches)",
        tailoredIntro: "हमने आपकी रूट पर निम्नलिखित आधार सत्यापित लोगों/वाहनों को खोजा है जो आपकी ज़रूरत तुरंत पूरी कर सकते हैं:",
        guideModalTitle: "GatiConnect कैसे काम करता है?",
        mobHome: "होम",
        mobRides: "सवारी",
        mobParcel: "पार्सल",
        mobProfile: "प्रोफ़ाइल",
        searchBtnLabel: "खोजें (Search)"
    },
    EN: {
        brandTagline: "Smart Mobility & Capacity Network",
        loginBtn: "Login / Sign Up",
        postBtnHeader: "+ Post Need / Trip",
        pwaTitle: "📲 Install GatiConnect App on Phone",
        pwaDesc: "Add to your home screen in 1 click for fast, instant access!",
        pwaBtn: "Install App",
        heroGreeting: "Hello",
        heroSub: "What service do you need today?",
        heroDesc: "Select your direct need — Aadhaar Verified, Live GPS Tracking & 100% Escrow Protection!",
        trendingLabel: "Top Trending Routes:",
        tileRideshareTitle: "🚗 Ride Share",
        tileRideshareSub: "Carpool & Seat Share",
        tileRideshareDesc: "Book seats in cars/bikes or share your empty seats to split fuel costs.",
        tileDriverTitle: "👨✈️ Driver Match",
        tileDriverSub: "Verified Driver Connect",
        tileDriverDesc: "Hire verified drivers for your personal car or find commercial driving gigs.",
        tileParcelTitle: "📦 P2P Parcel",
        tileParcelSub: "Colony Micro-Deliveries",
        tileParcelDesc: "Send tiffins, medicines & packages colony-to-colony for just ₹30-₹40.",
        tileCargoTitle: "🚚 Return Cargo",
        tileCargoSub: "Tata Ace & Return Trucks",
        tileCargoDesc: "Transport commercial goods or get up to 50% discount on empty returning trucks.",
        availableBadge: "Available",
        driversBadge: "Drivers",
        parcelBadge: "Parcels",
        tripsBadge: "Cargo Trips",
        synergyTitle: "💡 Smart Route Synergies:",
        synergyBtn: "View Synergy",
        activeBookingsTitle: "Active Bookings & Live GPS Escrow",
        myListingsTitle: "My Posted Listings & Needs",
        backHome: "← Back to Home Hub",
        postBtnCat: "+ Post Requirement",
        bestMatchesTitle: "🎯 Best Matching Solutions for You",
        tailoredIntro: "We discovered these verified commuters and drivers on your exact route:",
        guideModalTitle: "How GatiConnect Works?",
        mobHome: "Home",
        mobRides: "Rides",
        mobParcel: "Parcel",
        mobProfile: "Profile",
        searchBtnLabel: "Search"
    }
};

// Initialize on Load
document.addEventListener("DOMContentLoaded", async () => {
    initDepartureDateTime();
    initPwaInstallPrompt();
    registerServiceWorker();
    requestPushPermission();
    await loadUsers();
    await checkUserSession();
    await loadHubSummary();
    await loadListings();
});

// 1. 🇮🇳 1-TAP LANGUAGE SWITCHER
function toggleAppLanguage() {
    currentLang = (currentLang === "HI") ? "EN" : "HI";
    applyLanguage();
    playAudioSound("DING");
}

function applyLanguage() {
    const dict = I18N_DICT[currentLang];
    document.getElementById("langDisplayBadge").textContent = (currentLang === "HI") ? "🇮🇳 हिंदी" : "🌐 English";
    
    // Header & Hero
    document.getElementById("txtBrandTagline").textContent = dict.brandTagline;
    document.getElementById("txtLoginBtn").textContent = dict.loginBtn;
    document.getElementById("txtPostBtnHeader").textContent = dict.postBtnHeader;
    document.getElementById("txtPwaTitle").textContent = dict.pwaTitle;
    document.getElementById("txtPwaDesc").textContent = dict.pwaDesc;
    document.getElementById("txtPwaBtn").textContent = dict.pwaBtn;
    document.getElementById("txtHeroGreeting").textContent = dict.heroGreeting;
    document.getElementById("txtHeroSub").textContent = dict.heroSub;
    document.getElementById("txtHeroDesc").textContent = dict.heroDesc;
    document.getElementById("txtTrendingLabel").textContent = dict.trendingLabel;
    
    // Tiles
    document.getElementById("txtTileRideshareTitle").textContent = dict.tileRideshareTitle;
    document.getElementById("txtTileRideshareSub").textContent = dict.tileRideshareSub;
    document.getElementById("txtTileRideshareDesc").textContent = dict.tileRideshareDesc;
    
    document.getElementById("txtTileDriverTitle").textContent = dict.tileDriverTitle;
    document.getElementById("txtTileDriverSub").textContent = dict.tileDriverSub;
    document.getElementById("txtTileDriverDesc").textContent = dict.tileDriverDesc;
    
    document.getElementById("txtTileParcelTitle").textContent = dict.tileParcelTitle;
    document.getElementById("txtTileParcelSub").textContent = dict.tileParcelSub;
    document.getElementById("txtTileParcelDesc").textContent = dict.tileParcelDesc;
    
    document.getElementById("txtTileCargoTitle").textContent = dict.tileCargoTitle;
    document.getElementById("txtTileCargoSub").textContent = dict.tileCargoSub;
    document.getElementById("txtTileCargoDesc").textContent = dict.tileCargoDesc;
    
    document.getElementById("txtAvailableBadge").textContent = dict.availableBadge;
    document.getElementById("txtDriversBadge").textContent = dict.driversBadge;
    document.getElementById("txtParcelBadge").textContent = dict.parcelBadge;
    document.getElementById("txtTripsBadge").textContent = dict.tripsBadge;
    
    document.getElementById("txtSynergyTitle").textContent = dict.synergyTitle;
    document.getElementById("txtSynergyBtn").textContent = dict.synergyBtn;
    document.getElementById("txtActiveBookingsTitle").textContent = dict.activeBookingsTitle;
    document.getElementById("txtMyListingsTitle").textContent = dict.myListingsTitle;
    
    // Category & Navigation
    const backBtn = document.getElementById("txtBackHome");
    if (backBtn) backBtn.textContent = dict.backHome;
    const postCat = document.getElementById("txtPostBtnCat");
    if (postCat) postCat.textContent = dict.postBtnCat;
    const bestMatch = document.getElementById("txtBestMatchesTitle");
    if (bestMatch) bestMatch.textContent = dict.bestMatchesTitle;
    const tailIntro = document.getElementById("txtTailoredIntro");
    if (tailIntro) tailIntro.textContent = dict.tailoredIntro;
    const guideTitle = document.getElementById("txtGuideModalTitle");
    if (guideTitle) guideTitle.textContent = dict.guideModalTitle;
    const searchBtn = document.getElementById("txtSearchBtnLabel");
    if (searchBtn) searchBtn.textContent = dict.searchBtnLabel;
    
    // Mobile Nav
    document.getElementById("txtMobHome").textContent = dict.mobHome;
    document.getElementById("txtMobRides").textContent = dict.mobRides;
    document.getElementById("txtMobParcel").textContent = dict.mobParcel;
    document.getElementById("txtMobProfile").textContent = dict.mobProfile;
    
    const settingsLang = document.getElementById("settingsLangBadge");
    if (settingsLang) settingsLang.textContent = (currentLang === "HI") ? "🇮🇳 हिंदी" : "🌐 English";
    
    if (currentCategory !== "ALL") renderIntentDoors(currentCategory);
    filterListings();
}

// 2. 🔄 LOCATION SWAP BUTTON (Bhopal <-> Indore / From <-> To)
function swapSearchLocations() {
    const fromEl = document.getElementById("searchInputFrom");
    const toEl = document.getElementById("searchInputTo");
    
    const tempVal = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = tempVal;
    
    playAudioSound("DING");
    filterListings();
}

// 3. 📅 AUTHENTIC DATE & TIME PICKER INITIALIZATION
function initDepartureDateTime() {
    const dateInput = document.getElementById("newDepartureDate");
    const timeInput = document.getElementById("newDepartureTime");
    if (!dateInput || !timeInput) return;
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${yyyy}-${mm}-${dd}`;
    
    dateInput.min = todayFormatted;
    if (!dateInput.value) dateInput.value = todayFormatted;
    
    if (!timeInput.value) {
        const hours = String((today.getHours() + 1) % 24).padStart(2, '0');
        timeInput.value = `${hours}:00`;
    }
}

// 4. 🎛️ POST ROLE SELECTOR (OFFER vs REQUEST)
function selectPostRole(role) {
    const offerCard = document.getElementById("roleCardOffer");
    const reqCard = document.getElementById("roleCardRequest");
    const radios = document.getElementsByName("modalListingType");
    
    for (let r of radios) {
        if (r.value === role) {
            r.checked = true;
            break;
        }
    }
    
    if (role === "OFFER") {
        offerCard.classList.add("active");
        reqCard.classList.remove("active");
    } else {
        reqCard.classList.add("active");
        offerCard.classList.remove("active");
    }
    
    handleModalCategoryChange();
}

// 5. 🎙️ HTML5 WEB SPEECH API VOICE SEARCH
function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("⚠️ आपके ब्राउज़र में वॉइस रिकॉग्निशन सपोर्ट नहीं है। कृपया गूगल क्रोम का उपयोग करें।");
        return;
    }
    
    const micBtn = document.getElementById("btnVoiceSearch");
    
    if (isRecordingVoice && speechRecognizer) {
        speechRecognizer.stop();
        micBtn.classList.remove("listening");
        isRecordingVoice = false;
        return;
    }
    
    speechRecognizer = new SpeechRecognition();
    speechRecognizer.lang = (currentLang === "HI") ? "hi-IN" : "en-IN";
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = false;
    
    micBtn.classList.add("listening");
    isRecordingVoice = true;
    playAudioSound("DING");
    
    speechRecognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        micBtn.classList.remove("listening");
        isRecordingVoice = false;
        
        let fromText = transcript;
        let toText = "";
        
        const splitWords = [" से ", " to ", " se ", " tak ", " तक "];
        for (let word of splitWords) {
            if (transcript.toLowerCase().includes(word)) {
                const parts = transcript.split(new RegExp(word, 'i'));
                fromText = parts[0].trim();
                toText = parts[1].trim();
                break;
            }
        }
        
        document.getElementById("searchInputFrom").value = fromText;
        if (toText) document.getElementById("searchInputTo").value = toText;
        
        playAudioSound("CHIME");
        filterListings();
    };
    
    speechRecognizer.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        micBtn.classList.remove("listening");
        isRecordingVoice = false;
    };
    
    speechRecognizer.onend = () => {
        micBtn.classList.remove("listening");
        isRecordingVoice = false;
    };
    
    try {
        speechRecognizer.start();
    } catch (e) {
        console.error("Speech start error:", e);
    }
}

// 6. 📲 1-CLICK PWA APP INSTALLATION
function initPwaInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;
        const banner = document.getElementById("pwaInstallBanner");
        if (banner) banner.style.display = "flex";
    });
    
    window.addEventListener('appinstalled', () => {
        const banner = document.getElementById("pwaInstallBanner");
        if (banner) banner.style.display = "none";
        deferredPwaPrompt = null;
        playAudioSound("CHIME");
        alert("🎉 GatiConnect ऐप सफलतापूर्वक आपके फोन में इंस्टॉल हो गई है!");
    });
}

function installPWA() {
    if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        deferredPwaPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the PWA install prompt');
            }
            deferredPwaPrompt = null;
        });
    } else {
        alert("💡 ऐप इंस्टॉल करने के लिए ब्राउज़र मेनू (⋮) पर क्लिक करके 'Add to Home screen' चुनें।");
    }
}

// 7. 💡 "HOW IT WORKS" VISUAL GUIDE MODAL
function openHowItWorksModal() {
    playAudioSound("DING");
    document.getElementById("howItWorksModal").classList.add("open");
}

function closeHowItWorksModal() {
    document.getElementById("howItWorksModal").classList.remove("open");
}

// 8. 🧾 DIGITAL TRIP INVOICE / OFFICIAL RECEIPT
function openReceiptModal(bookingId) {
    playAudioSound("DING");
    
    const bookingItem = currentTrips.flatMap(t => t).find(i => i.booking && i.booking.id === bookingId) || {
        booking: { id: bookingId, agreed_price: 35.0, payment_method: "Razorpay UPI" },
        trip: { source_city: "Kolar Road", destination_city: "MP Nagar", service_category: "PARCEL" },
        creator: { full_name: "Rahul Gupta" },
        vehicle: { vehicle_name: "Hero Splendor", vehicle_number: "MP-04-XY-9012" }
    };
    
    const b = bookingItem.booking;
    const t = bookingItem.trip;
    const c = bookingItem.creator;
    const v = bookingItem.vehicle;
    
    document.getElementById("receiptIdText").textContent = `Invoice #GATI-${b.id}${Date.now().toString().slice(-4)}`;
    document.getElementById("rcptRoute").textContent = t ? `${t.source_city} ➔ ${t.destination_city}` : "Kolar Road ➔ MP Nagar";
    document.getElementById("rcptDate").textContent = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById("rcptCategory").textContent = t ? t.service_category : "Ride Service";
    document.getElementById("rcptDriverName").textContent = c ? c.full_name : "Rahul Gupta";
    document.getElementById("rcptVehicle").textContent = v ? `${v.vehicle_name} [${v.vehicle_number}]` : "Hero Splendor [MP-04-XY-9012]";
    document.getElementById("rcptPaymentMode").textContent = b.payment_method || "Razorpay UPI";
    document.getElementById("rcptTotalFare").textContent = `₹${(b.agreed_price || 35.0).toFixed(2)}`;
    
    document.getElementById("receiptModal").classList.add("open");
}

function closeReceiptModal() {
    document.getElementById("receiptModal").classList.remove("open");
}

function quickSelectRoute(category, from, to) {
    navigateToCategory(category);
    document.getElementById("searchInputFrom").value = from;
    document.getElementById("searchInputTo").value = to;
    filterListings();
    playAudioSound("DING");
}

// 9. NATIVE WEB AUDIO API SOUND EFFECTS ENGINE
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playAudioSound(type = "CHIME") {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        
        if (type === "COIN") {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc1.type = "sine";
            osc2.type = "triangle";
            osc1.frequency.setValueAtTime(987.77, now);
            osc1.frequency.setValueAtTime(1318.51, now + 0.08);
            osc2.frequency.setValueAtTime(1318.51, now);
            osc2.frequency.setValueAtTime(1975.53, now + 0.08);
            
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.45);
            osc2.stop(now + 0.45);
            
        } else if (type === "CHIME") {
            [523.25, 659.25, 783.99].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const start = now + (i * 0.1);
                
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.25, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.25);
            });
            
        } else if (type === "ALERT") {
            [880, 587.33, 880, 587.33].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const start = now + (i * 0.12);
                
                osc.type = "square";
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.3, start);
                gain.gain.exponentialRampToValueAtTime(0.01, start + 0.11);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.12);
            });
            
        } else if (type === "DING") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(1046.50, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        }
    } catch (e) {
        console.warn("Audio playback not allowed:", e);
    }
}

// 10. PHONE GPS AUTO-DETECTION API
function detectGPSLocationForInput(targetInputId) {
    if (!navigator.geolocation) {
        alert("आपके ब्राउज़र में GPS सपोर्ट उपलब्ध नहीं है।");
        return;
    }
    
    const inputEl = document.getElementById(targetInputId);
    if (!inputEl) return;
    
    inputEl.value = "📍 GPS लोकेशन खोजी जा रही है...";
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            currentDeviceCoordinates = { lat, lng };
            
            let detectedArea = "Kolar Road (Sarvadharma)";
            if (lat > 23.23) detectedArea = "MP Nagar (Zone 1)";
            else if (lat > 23.20) detectedArea = "Arera Colony / Shahpura";
            else if (lng < 76.5) detectedArea = "Indore (Vijay Nagar)";
            
            inputEl.value = detectedArea;
            playAudioSound("DING");
            filterListings();
            calculateSmartFareLive();
        },
        (err) => {
            console.warn("GPS error:", err);
            inputEl.value = "Kolar Road (Bhopal)";
            alert("⚠️ GPS अनुमति नहीं मिली। डिफ़ॉल्ट रूप से 'Kolar Road' सेट किया गया है।");
        },
        { enableHighAccuracy: true, timeout: 6000 }
    );
}

// 11. PWA & NOTIFICATIONS
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/static/sw.js')
                .then(reg => console.log('ServiceWorker registered:', reg.scope))
                .catch(err => console.warn('ServiceWorker error:', err));
        });
    }
}

function requestPushPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                triggerDevicePushNotification('🔔 Notifications Enabled', 'You will receive instant alerts for rides, chats, and deliveries!');
            }
        });
    }
}

function triggerDevicePushNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(title, {
                    body: body,
                    icon: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=192',
                    badge: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=96',
                    vibrate: [150, 50, 150]
                });
            });
        } else {
            new Notification(title, { body: body });
        }
    }
}

// 12. USER AUTH & DUTY SWITCH
async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE}/api/users`);
        allUsers = await res.json();
    } catch (err) {
        console.error("Error loading users:", err);
    }
}

async function checkUserSession() {
    const savedUserId = localStorage.getItem("gaticonnect_user_id");
    if (savedUserId && allUsers.length > 0) {
        const found = allUsers.find(u => u.id === parseInt(savedUserId));
        if (found) {
            currentUser = found;
        }
    }
    
    updateHeaderUserWidget();
    if (currentUser) {
        await loadUserWallet();
        await loadMyBookings();
        await loadMyCreatedTrips();
    }
}

function updateHeaderUserWidget() {
    const loggedInBox = document.getElementById("loggedInUserBox");
    const guestBox = document.getElementById("guestLoginBox");
    const greetEl = document.getElementById("heroGreetName");
    const dutyBtn = document.getElementById("dutyToggleBtn");
    
    if (currentUser) {
        loggedInBox.style.display = "flex";
        guestBox.style.display = "none";
        
        document.getElementById("headerAvatar").textContent = currentUser.full_name.charAt(0);
        document.getElementById("headerUserName").textContent = currentUser.full_name;
        document.getElementById("headerTrustBadge").textContent = `${currentUser.trust_score}/100`;
        
        if (greetEl) greetEl.textContent = currentUser.full_name.split(" ")[0];
        updateWalletBadge();
        
        if (currentUser.roles && (currentUser.roles.includes("DRIVER") || currentUser.roles.includes("CARRIER") || currentUser.roles.includes("TRANSPORTER"))) {
            dutyBtn.style.display = "inline-flex";
            updateDutyButtonUI(currentUser.is_online);
        } else {
            dutyBtn.style.display = "none";
        }
    } else {
        loggedInBox.style.display = "none";
        guestBox.style.display = "flex";
        if (dutyBtn) dutyBtn.style.display = "none";
        if (greetEl) greetEl.textContent = (currentLang === "HI") ? "यात्री" : "Guest";
        document.getElementById("activeUserWallet").textContent = "0.00";
        
        const bookingsList = document.getElementById("hubBookingsList");
        if (bookingsList) {
            bookingsList.innerHTML = `
                <div style="text-align:center; padding: 1.2rem; background:#fff; border-radius:10px; border:1px dashed #cbd5e1; color:#64748b; font-size:0.8rem;">
                    <i class="fa-solid fa-lock" style="font-size:1.4rem; color:#94a3b8; margin-bottom:0.35rem; display:block;"></i>
                    अपनी सक्रिय बुकिंग्स व लाइव GPS देखने के लिए कृपया लॉगिन करें।
                    <button class="btn-login-prominent" style="margin:0.7rem auto 0;" onclick="openAuthModal()">
                        <i class="fa-solid fa-mobile-screen-button"></i> मोबाइल नंबर से लॉगिन करें
                    </button>
                </div>
            `;
        }
    }
}

function updateDutyButtonUI(isOnline) {
    const dutyBtn = document.getElementById("dutyToggleBtn");
    const dutyText = document.getElementById("dutyToggleText");
    if (isOnline) {
        dutyBtn.className = "btn-duty-toggle duty-on";
        dutyText.textContent = "Duty ON";
    } else {
        dutyBtn.className = "btn-duty-toggle duty-off";
        dutyText.textContent = "Duty OFF";
    }
}

async function handleToggleDuty() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/users/${currentUser.id}/toggle-duty`, { method: "PUT" });
        const data = await res.json();
        currentUser.is_online = data.is_online;
        updateDutyButtonUI(currentUser.is_online);
        playAudioSound("DING");
        alert(`🚦 ${data.message}`);
    } catch (err) {
        console.error("Duty toggle error:", err);
    }
}

// AUTH GUARD
function requireAuth(actionName = "इस क्रिया") {
    if (!currentUser) {
        alert(`🔒 ${actionName} के लिए कृपया पहले अपने मोबाइल नंबर से लॉगिन करें।`);
        openAuthModal();
        return false;
    }
    return true;
}

function handleWalletClick() {
    if (requireAuth("वॉलेट देखने और पैसे जोड़ने")) openWalletModal();
}

function handlePostTripClick() {
    if (requireAuth("ट्रिप या पार्सल पोस्ट करने")) {
        openPostModal();
    }
}

function openPostModalForCurrentCategory() {
    if (!requireAuth("पोस्ट करने")) return;
    openPostModal();
}

function handleProfileNavClick() {
    if (!currentUser) {
        openAuthModal();
    } else {
        openUserProfileHub();
    }
}

function handleSignOut() {
    if (!confirm("क्या आप सचमुच GatiConnect से लॉग आउट (Sign Out) करना चाहते हैं?")) return;
    localStorage.removeItem("gaticonnect_user_id");
    currentUser = null;
    closeUserProfileHub();
    updateHeaderUserWidget();
    alert("✅ आप सफलतापूर्वक लॉग आउट हो गए हैं।");
}

// 13. REAL SMS OTP AUTH FLOW
function openAuthModal() {
    document.getElementById("authStepPhone").style.display = "block";
    document.getElementById("authStepOtp").style.display = "none";
    document.getElementById("authPhoneInput").value = "";
    document.getElementById("authOtpInput").value = "";
    document.getElementById("authModal").classList.add("open");
}

function closeAuthModal() {
    document.getElementById("authModal").classList.remove("open");
    if (otpCountdownTimer) clearInterval(otpCountdownTimer);
}

function backToPhoneStep() {
    if (otpCountdownTimer) clearInterval(otpCountdownTimer);
    document.getElementById("authStepPhone").style.display = "block";
    document.getElementById("authStepOtp").style.display = "none";
}

async function handleSendOtpSubmit(e) {
    e.preventDefault();
    const phoneVal = document.getElementById("authPhoneInput").value.trim();
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
        alert("कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू होने वाला)।");
        return;
    }
    
    pendingAuthPhone = phoneVal;
    const btn = document.getElementById("btnSendOtp");
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> SMS भेजा जा रहा है...`;
    
    try {
        const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: phoneVal })
        });
        
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> OTP प्राप्त करें (Send OTP)`;
        
        if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${err.detail || "Failed to send OTP"}`);
            return;
        }
        
        const data = await res.json();
        document.getElementById("authPhoneDisplay").textContent = `+91 ${phoneVal}`;
        document.getElementById("authStepPhone").style.display = "none";
        document.getElementById("authStepOtp").style.display = "block";
        
        if (data.is_real_sms) {
            alert(`✅ ${data.message}`);
        } else {
            document.getElementById("authOtpInput").value = data.simulated_otp || "1234";
            alert(`📱 [SMS सिमुलेशन]: आपका OTP है: ${data.simulated_otp || "1234"}\n\n(नोट: असली सिम पर SMS पाने के लिए .env में FAST2SMS_API_KEY डालें। अभी टेस्टिंग के लिए OTP अपने आप भर दिया गया है!)`);
        }
        
        document.getElementById("authOtpInput").focus();
        startOtpResendTimer();
        playAudioSound("DING");
    } catch (err) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> OTP प्राप्त करें (Send OTP)`;
        console.error("Send OTP error:", err);
    }
}

function startOtpResendTimer() {
    if (otpCountdownTimer) clearInterval(otpCountdownTimer);
    otpSecondsLeft = 30;
    
    const countEl = document.getElementById("otpCountdownText");
    const resendBtn = document.getElementById("btnResendOtp");
    countEl.style.display = "inline";
    resendBtn.style.display = "none";
    countEl.textContent = `⏱️ ${otpSecondsLeft}s में पुनः OTP मंगा सकते हैं`;
    
    otpCountdownTimer = setInterval(() => {
        otpSecondsLeft -= 1;
        if (otpSecondsLeft <= 0) {
            clearInterval(otpCountdownTimer);
            countEl.style.display = "none";
            resendBtn.style.display = "inline-block";
        } else {
            countEl.textContent = `⏱️ ${otpSecondsLeft}s में पुनः OTP मंगा सकते हैं`;
        }
    }, 1000);
}

async function handleResendOtp() {
    if (!pendingAuthPhone) return;
    try {
        const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: pendingAuthPhone })
        });
        if (res.ok) {
            alert(`✅ नया OTP आपके नंबर +91 ${pendingAuthPhone} पर SMS द्वारा भेज दिया गया है!`);
            startOtpResendTimer();
        }
    } catch (err) {
        console.error("Resend error:", err);
    }
}

async function handleVerifyOtpSubmit(e) {
    e.preventDefault();
    const otpVal = document.getElementById("authOtpInput").value.trim();
    if (otpVal.length !== 4) {
        alert("कृपया 4-अंकों का SMS OTP दर्ज करें।");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone_number: pendingAuthPhone, otp: otpVal })
        });
        
        if (!res.ok) {
            const err = await res.json();
            alert(`Verification Failed: ${err.detail || "Invalid OTP"}`);
            return;
        }
        
        const data = await res.json();
        closeAuthModal();
        playAudioSound("CHIME");
        
        if (data.status === "LOGGED_IN") {
            alert(`🎉 ${data.message}`);
            currentUser = data.user;
            localStorage.setItem("gaticonnect_user_id", currentUser.id);
            await loadUsers();
            updateHeaderUserWidget();
            await loadUserWallet();
            await loadMyBookings();
            await loadMyCreatedTrips();
        } else if (data.status === "NEW_USER") {
            openProfileSetupModal(pendingAuthPhone);
        }
    } catch (err) {
        console.error("Verify OTP error:", err);
    }
}

// 14. 👤 COMPREHENSIVE USER PROFILE, HISTORY & SETTINGS HUB
async function openUserProfileHub(initialTab = "HISTORY") {
    if (!currentUser) {
        openAuthModal();
        return;
    }
    
    playAudioSound("DING");
    
    // 1. Populate Hero Info
    document.getElementById("profileHubAvatar").textContent = currentUser.full_name.charAt(0);
    document.getElementById("profileHubFullName").textContent = currentUser.full_name;
    document.getElementById("profileHubPhone").textContent = `+91 ${currentUser.phone_number}`;
    
    let levelText = "🥈 Silver Basic";
    if (currentUser.trust_score >= 95) levelText = `💎 Diamond Verified (${currentUser.trust_score}/100)`;
    else if (currentUser.trust_score >= 85) levelText = `🥇 Gold Shield (${currentUser.trust_score}/100)`;
    else levelText = `🥈 Community Member (${currentUser.trust_score}/100)`;
    document.getElementById("profileHubTrustBadge").textContent = levelText;
    document.getElementById("profileHubTrustProgressFill").style.width = `${currentUser.trust_score}%`;
    
    const pill = document.getElementById("profileHubAadhaarPill");
    if (currentUser.is_aadhaar_verified) {
        pill.innerHTML = `<span class="badge-govt-verified" style="font-size:0.7rem;"><i class="fa-solid fa-circle-check"></i> Aadhaar Verified</span>`;
    } else {
        pill.innerHTML = `<button type="button" class="btn-kyc-trigger" onclick="openKycModal()" style="font-size:0.68rem; padding:0.15rem 0.45rem;"><i class="fa-solid fa-shield"></i> Verify Aadhaar</button>`;
    }
    
    // Display Saved Vehicle & Driving Details in Profile Hub
    const hubVeh = document.getElementById("hubSavedVehicleDisplay");
    const hubVehNum = document.getElementById("hubSavedVehicleNumDisplay");
    const hubDl = document.getElementById("hubSavedDlDisplay");
    if (hubVeh) hubVeh.textContent = currentUser.vehicle_name || "Not set (कोई गाड़ी नहीं)";
    if (hubVehNum) hubVehNum.textContent = currentUser.vehicle_number || "Not set";
    if (hubDl) hubDl.textContent = currentUser.dl_number || "Not set (लाइसेंस नहीं)";

    // 2. Populate Quick Stats
    document.getElementById("profileHubWalletVal").textContent = (currentUser.wallet_balance || 0).toFixed(2);
    document.getElementById("profilePassbookBalance").textContent = (currentUser.wallet_balance || 0).toFixed(2);

    // Driver Performance & Earnings Widget Display
    const driverPerfSec = document.getElementById("driverPerformanceSection");
    if (driverPerfSec) {
        if (currentUser.role === "DRIVER" || currentUser.role === "TRANSPORTER" || currentUser.is_dl_verified) {
            driverPerfSec.style.display = "block";
            const earningsToday = document.getElementById("driverEarningsToday");
            if (earningsToday) earningsToday.textContent = (currentUser.wallet_balance || 0).toFixed(2);
            const tripsCount = document.getElementById("driverCompletedTripsCount");
            if (tripsCount) tripsCount.textContent = currentUserBookings.filter(b => (b.booking || b).status === "COMPLETED").length || 1;
        } else {
            driverPerfSec.style.display = "none";
        }
    }
    
    // 3. Populate Edit Form Inputs
    document.getElementById("editFullName").value = currentUser.full_name || "";
    document.getElementById("editPhoneNumber").value = currentUser.phone_number || "";
    document.getElementById("editEmail").value = currentUser.email || "";
    document.getElementById("editUpiId").value = currentUser.upi_id || "";
    document.getElementById("editEmergencyContact").value = currentUser.emergency_contact || "";
    document.getElementById("editDlNumber").value = currentUser.dl_number || "";
    document.getElementById("editVehicleName").value = currentUser.vehicle_name || "";
    document.getElementById("editVehicleNumber").value = currentUser.vehicle_number || "";
    
    // 4. Update Settings Tab Info
    const settingsLang = document.getElementById("settingsLangBadge");
    if (settingsLang) settingsLang.textContent = (currentLang === "HI") ? "🇮🇳 हिंदी" : "🌐 English";
    
    // 5. Load History Records
    await loadProfileTripsHistory();
    await loadProfileCreatedPosts();
    await loadProfileWalletPassbook();
    
    switchProfileTab(initialTab);
    document.getElementById("userProfileHubModal").classList.add("open");
}

function closeUserProfileHub() {
    document.getElementById("userProfileHubModal").classList.remove("open");
}

function switchProfileTab(tabName) {
    const btnHistory = document.getElementById("pTabBtn-history");
    const btnEdit = document.getElementById("pTabBtn-edit");
    const btnSettings = document.getElementById("pTabBtn-settings");
    
    const paneHistory = document.getElementById("pTabContent-history");
    const paneEdit = document.getElementById("pTabContent-edit");
    const paneSettings = document.getElementById("pTabContent-settings");
    
    btnHistory.classList.remove("active");
    btnEdit.classList.remove("active");
    btnSettings.classList.remove("active");
    
    paneHistory.style.display = "none";
    paneEdit.style.display = "none";
    paneSettings.style.display = "none";
    
    if (tabName.startsWith("HISTORY")) {
        btnHistory.classList.add("active");
        paneHistory.style.display = "block";
        if (tabName === "HISTORY_WALLET") switchHistorySubTab("WALLET");
        else if (tabName === "HISTORY_POSTS") switchHistorySubTab("POSTS");
        else switchHistorySubTab("TRIPS");
    } else if (tabName === "EDIT") {
        btnEdit.classList.add("active");
        paneEdit.style.display = "block";
    } else if (tabName === "SETTINGS") {
        btnSettings.classList.add("active");
        paneSettings.style.display = "block";
    }
}

function switchHistorySubTab(subTab) {
    const btnTrips = document.getElementById("hSubBtn-trips");
    const btnPosts = document.getElementById("hSubBtn-posts");
    const btnWallet = document.getElementById("hSubBtn-wallet");
    
    const paneTrips = document.getElementById("hSubPane-trips");
    const panePosts = document.getElementById("hSubPane-posts");
    const paneWallet = document.getElementById("hSubPane-wallet");
    
    btnTrips.classList.remove("active");
    btnPosts.classList.remove("active");
    btnWallet.classList.remove("active");
    
    paneTrips.style.display = "none";
    panePosts.style.display = "none";
    paneWallet.style.display = "none";
    
    if (subTab === "TRIPS") {
        btnTrips.classList.add("active");
        paneTrips.style.display = "block";
    } else if (subTab === "POSTS") {
        btnPosts.classList.add("active");
        panePosts.style.display = "block";
    } else if (subTab === "WALLET") {
        btnWallet.classList.add("active");
        paneWallet.style.display = "block";
    }
}

async function loadProfileTripsHistory() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/bookings/my-bookings?user_id=${currentUser.id}`);
        const bookings = await res.json();
        
        const countEl = document.getElementById("profileHubTripsCount");
        if (countEl) countEl.textContent = bookings ? bookings.length : 0;
        
        const listEl = document.getElementById("profileTripsHistoryList");
        if (!listEl) return;
        
        if (!bookings || bookings.length === 0) {
            listEl.innerHTML = `<div style="text-align:center; padding:1.5rem; color:#64748b; font-size:0.8rem;">कोई पिछली यात्रा या बुकिंग नहीं मिली।</div>`;
            return;
        }
        
        listEl.innerHTML = bookings.map(item => {
            const b = item.booking;
            const t = item.trip;
            const otherParty = item.is_requester ? item.creator : item.requester;
            const otherName = otherParty ? otherParty.full_name : "Partner";
            const tripRouteTitle = t ? `${t.source_city} ➔ ${t.destination_city}` : "Trip";
            
            let statusBadge = "";
            if (b.booking_status === "COMPLETED") statusBadge = `<span style="color:#16a34a; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Completed</span>`;
            else if (b.booking_status === "CANCELLED") statusBadge = `<span style="color:#dc2626; font-weight:700;"><i class="fa-solid fa-ban"></i> Cancelled</span>`;
            else statusBadge = `<span style="color:#2563eb; font-weight:700;"><i class="fa-solid fa-clock"></i> ${b.booking_status}</span>`;
            
            let invoiceBtn = (b.booking_status === "COMPLETED") ? `<button class="btn-invoice-view" onclick="closeUserProfileHub(); openReceiptModal(${b.id})"><i class="fa-solid fa-file-invoice"></i> रसीद (Invoice)</button>` : '';
            
            return `
                <div class="booking-card" style="padding:0.75rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                        <strong style="font-size:0.85rem;">${tripRouteTitle}</strong>
                        <span style="font-weight:800; color:#15803d; font-size:0.9rem;">₹${b.agreed_price.toFixed(2)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:#64748b;">
                        <span>Partner: ${otherName} &bull; ${b.payment_method}</span>
                        <span>${statusBadge}</span>
                    </div>
                    ${invoiceBtn ? `<div style="margin-top:0.4rem; display:flex; justify-content:flex-end;">${invoiceBtn}</div>` : ''}
                </div>
            `;
        }).join("");
    } catch (err) {
        console.error("Error loading trip history:", err);
    }
}

async function loadProfileCreatedPosts() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/trips/my-created?user_id=${currentUser.id}`);
        const trips = await res.json();
        
        const countEl = document.getElementById("profileHubPostsCount");
        if (countEl) countEl.textContent = trips ? trips.length : 0;
        
        const listEl = document.getElementById("profileMyPostsList");
        if (!listEl) return;
        
        if (!trips || trips.length === 0) {
            listEl.innerHTML = `<div style="text-align:center; padding:1.5rem; color:#64748b; font-size:0.8rem;">कोई सक्रिय पोस्ट नहीं है।</div>`;
            return;
        }
        
        listEl.innerHTML = trips.map(t => `
            <div class="created-trip-card" style="padding:0.75rem;">
                <div>
                    <div style="font-weight:700; font-size:0.85rem;">${t.source_city} ➔ ${t.destination_city} (₹${t.price})</div>
                    <div style="font-size:0.72rem; color:#64748b;">[${t.service_category}] ${t.listing_type === 'OFFER' ? 'उपलब्ध' : 'ज़रूरत'} &bull; ${t.departure_time}</div>
                </div>
                <div class="my-trip-actions">
                    <button class="btn-match-view" onclick="closeUserProfileHub(); checkTripMatches(${t.id}, '${t.source_city} ➔ ${t.destination_city}')"><i class="fa-solid fa-bullseye"></i> Matches</button>
                    <button class="btn-delete-trip" onclick="handleDeleteTrip(${t.id})"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `).join("");
    } catch (err) {
        console.error("Error loading created posts:", err);
    }
}

async function loadProfileWalletPassbook() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/wallet/balance?user_id=${currentUser.id}`);
        const data = await res.json();
        
        const listEl = document.getElementById("profilePassbookTxnList");
        if (!listEl) return;
        
        if (!data.transactions || data.transactions.length === 0) {
            listEl.innerHTML = `<div style="text-align:center; padding:1rem; color:#94a3b8; font-size:0.75rem;">कोई लेन-देन रिकॉर्ड नहीं मिला।</div>`;
            return;
        }
        
        listEl.innerHTML = data.transactions.map(t => {
            const isCredit = t.amount > 0;
            const amountClass = isCredit ? "txn-credit" : "txn-debit";
            const sign = isCredit ? "+" : "";
            return `
                <div class="txn-item">
                    <div>
                        <div style="font-weight:700;">${t.description}</div>
                        <div style="font-size:0.68rem; color:#94a3b8;">${t.txn_type} &bull; ${t.created_at || 'Recent'}</div>
                    </div>
                    <div class="${amountClass}" style="font-size:0.85rem;">${sign}₹${Math.abs(t.amount).toFixed(2)}</div>
                </div>
            `;
        }).join("");
    } catch (err) {
        console.error("Error loading passbook:", err);
    }
}

// 15. FIRST-TIME PROFILE SETUP
function openProfileSetupModal(phone) {
    document.getElementById("setupPhoneHidden").value = phone;
    document.getElementById("setupFullName").value = "";
    document.getElementById("setupEmail").value = "";
    document.getElementById("setupUpiId").value = "";
    document.getElementById("setupEmergencyContact").value = "";
    document.getElementById("setupDlNumber").value = "";
    document.getElementById("setupVehicleName").value = "";
    document.getElementById("setupVehicleNumber").value = "";
    document.getElementById("profileSetupModal").classList.add("open");
}

function closeProfileSetupModal() {
    document.getElementById("profileSetupModal").classList.remove("open");
}

async function handleCompleteProfileSubmit(e) {
    e.preventDefault();
    const phone = document.getElementById("setupPhoneHidden").value;
    const fullName = document.getElementById("setupFullName").value.trim();
    if (!fullName) return;
    
    const payload = {
        phone_number: phone, full_name: fullName,
        email: document.getElementById("setupEmail").value.trim(),
        upi_id: document.getElementById("setupUpiId").value.trim(),
        emergency_contact: document.getElementById("setupEmergencyContact").value.trim(),
        dl_number: document.getElementById("setupDlNumber").value.trim(),
        vehicle_name: document.getElementById("setupVehicleName").value.trim(),
        vehicle_number: document.getElementById("setupVehicleNumber").value.trim(),
        vehicle_type: "CAR"
    };
    
    try {
        const res = await fetch(`${API_BASE}/api/auth/complete-profile`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        closeProfileSetupModal();
        playAudioSound("CHIME");
        alert(`🎉 ${data.message}`);
        
        currentUser = data.user;
        localStorage.setItem("gaticonnect_user_id", currentUser.id);
        await loadUsers();
        updateHeaderUserWidget();
        await loadUserWallet();
        await loadMyBookings();
        await loadMyCreatedTrips();
    } catch (err) {
        console.error("Profile complete error:", err);
    }
}

async function handleSkipProfileSetup() {
    const phone = document.getElementById("setupPhoneHidden").value;
    const fullName = document.getElementById("setupFullName").value.trim() || `User_${phone.slice(-4)}`;
    
    const payload = { phone_number: phone, full_name: fullName };
    try {
        const res = await fetch(`${API_BASE}/api/auth/complete-profile`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        closeProfileSetupModal();
        playAudioSound("DING");
        alert(`✅ प्रोफ़ाइल सेट हो गई! आपका बेसिक ट्रस्ट स्कोर 70/100 है।`);
        currentUser = data.user;
        localStorage.setItem("gaticonnect_user_id", currentUser.id);
        await loadUsers();
        updateHeaderUserWidget();
    } catch (err) {
        console.error("Skip error:", err);
    }
}

async function handleUpdateProfileSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;
    
    const payload = {
        full_name: document.getElementById("editFullName").value.trim(),
        email: document.getElementById("editEmail").value.trim(),
        upi_id: document.getElementById("editUpiId").value.trim(),
        emergency_contact: document.getElementById("editEmergencyContact").value.trim(),
        dl_number: document.getElementById("editDlNumber").value.trim(),
        vehicle_name: document.getElementById("editVehicleName").value.trim(),
        vehicle_number: document.getElementById("editVehicleNumber").value.trim(),
        vehicle_type: "CAR"
    };
    
    try {
        const res = await fetch(`${API_BASE}/api/users/${currentUser.id}/update-profile`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        playAudioSound("DING");
        alert(`✅ ${data.message} आपका नया ट्रस्ट स्कोर: ${data.trust_score}/100 है!`);
        currentUser = data.user;
        await loadUsers();
        updateHeaderUserWidget();
        openUserProfileHub("HISTORY");
    } catch (err) {
        console.error("Update profile error:", err);
    }
}

// 16. KYC VERIFICATION (AADHAAR & DL)
function openKycModal() {
    if (!currentUser) return;
    document.getElementById("aadhaarStepInput").style.display = "block";
    document.getElementById("aadhaarStepOtp").style.display = "none";
    document.getElementById("aadhaarNumberInput").value = "";
    document.getElementById("dlKycInput").value = currentUser.dl_number || "";
    switchKycTab('AADHAAR');
    document.getElementById("kycModal").classList.add("open");
}

function closeKycModal() {
    document.getElementById("kycModal").classList.remove("open");
}

function switchKycTab(tab) {
    const aBtn = document.getElementById("tabAadhaarBtn");
    const dBtn = document.getElementById("tabDlBtn");
    const rBtn = document.getElementById("tabRcBtn");
    const aSec = document.getElementById("kycAadhaarSection");
    const dSec = document.getElementById("kycDlSection");
    const rSec = document.getElementById("kycRcSection");
    
    if (aBtn) aBtn.classList.remove("active");
    if (dBtn) dBtn.classList.remove("active");
    if (rBtn) rBtn.classList.remove("active");
    if (aSec) aSec.style.display = "none";
    if (dSec) dSec.style.display = "none";
    if (rSec) rSec.style.display = "none";

    if (tab === 'AADHAAR') {
        if (aBtn) aBtn.classList.add("active");
        if (aSec) aSec.style.display = "block";
    } else if (tab === 'DL') {
        if (dBtn) dBtn.classList.add("active");
        if (dSec) dSec.style.display = "block";
    } else if (tab === 'RC') {
        if (rBtn) rBtn.classList.add("active");
        if (rSec) rSec.style.display = "block";
    }
}

async function handleVerifyRc(e) {
    e.preventDefault();
    if (!currentUser) return;
    const rcVal = document.getElementById("rcKycInput").value.trim();
    const vehName = document.getElementById("rcKycVehicleName") ? document.getElementById("rcKycVehicleName").value.trim() : "";
    if (!rcVal) return;

    try {
        const res = await fetch(`${API_BASE}/api/kyc/verify-rc`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.id, rc_number: rcVal, vehicle_name: vehName })
        });
        const data = await res.json();
        if (!res.ok) {
            alert(`RC Verification Failed: ${data.detail || "Invalid RC Number"}`);
            return;
        }

        playAudioSound("CHIME");
        currentUser = data.user;
        updateHeaderUserWidget();
        await loadUsers();

        const resultCard = document.getElementById("rcVerifyResultCard");
        if (resultCard) {
            resultCard.style.display = "block";
            resultCard.innerHTML = `
                <div style="font-weight:800; font-size:0.85rem; color:#15803d; margin-bottom:0.25rem;"><i class="fa-solid fa-circle-check"></i> ${data.rc_number} Verified!</div>
                <div><strong>RTO Authority:</strong> ${data.rto_location}</div>
                <div><strong>Insurance:</strong> ${data.insurance_status}</div>
                <div><strong>Fitness:</strong> ${data.fitness_valid}</div>
                <div style="margin-top:0.35rem; color:#0369a1;"><strong>Trust Score:</strong> +10 Points (${data.trust_score}/100)</div>
            `;
        }
        alert(data.message);
    } catch (err) {
        console.error("RC KYC Error:", err);
        alert("RC सत्यापन में त्रुटि आई। कृपया पुनः प्रयास करें।");
    }
}

async function handleSendAadhaarOtp(e) {
    e.preventDefault();
    if (!currentUser) return;
    const num = document.getElementById("aadhaarNumberInput").value.trim();
    if (num.length !== 12) {
        alert("कृपया 12 अंकों का आधार नंबर दर्ज करें।");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/api/kyc/send-aadhaar-otp`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.id, aadhaar_number: num })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById("maskedAadhaarDisplay").textContent = data.masked_aadhaar;
            document.getElementById("aadhaarStepInput").style.display = "none";
            document.getElementById("aadhaarStepOtp").style.display = "block";
            document.getElementById("aadhaarOtpInput").value = data.simulated_otp || "1234";
            playAudioSound("DING");
            alert(`📱 UIDAI आधार OTP: ${data.simulated_otp || "1234"}\n\n(सत्यापन के लिए OTP अपने आप भर दिया गया है)`);
        } else {
            alert(data.detail || "Aadhaar OTP failed");
        }
    } catch (err) {
        console.error("Aadhaar OTP error:", err);
    }
}

async function handleVerifyAadhaarOtp(e) {
    e.preventDefault();
    if (!currentUser) return;
    const num = document.getElementById("aadhaarNumberInput").value.trim();
    const otpVal = document.getElementById("aadhaarOtpInput").value.trim();
    
    try {
        const res = await fetch(`${API_BASE}/api/kyc/verify-aadhaar-otp`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.id, aadhaar_number: num, otp: otpVal })
        });
        const data = await res.json();
        if (res.ok) {
            playAudioSound("COIN");
            alert(data.message);
            currentUser = data.user;
            closeKycModal();
            openUserProfileHub("HISTORY");
            await loadUsers();
            updateHeaderUserWidget();
        } else {
            alert(data.detail || "Aadhaar verification failed");
        }
    } catch (err) {
        console.error("Verify Aadhaar error:", err);
    }
}

async function handleVerifyDl(e) {
    e.preventDefault();
    if (!currentUser) return;
    const dlNum = document.getElementById("dlKycInput").value.trim();
    
    try {
        const res = await fetch(`${API_BASE}/api/kyc/verify-dl`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.id, dl_number: dlNum })
        });
        const data = await res.json();
        if (res.ok) {
            playAudioSound("COIN");
            alert(data.message);
            currentUser = data.user;
            closeKycModal();
            openUserProfileHub("HISTORY");
            await loadUsers();
            updateHeaderUserWidget();
        } else {
            alert(data.detail || "DL verification failed");
        }
    } catch (err) {
        console.error("DL verification error:", err);
    }
}

// 17. LIVE GPS ROUTE TRACKING (LEAFLET.JS MAPS & WEBSOCKETS)
async function openTrackingModal(tripId, driverName = "Verified Driver", routeTitle = "Sarvadharma ➔ MP Nagar") {
    document.getElementById("trackTripRouteTitle").textContent = routeTitle;
    document.getElementById("trackDriverName").textContent = driverName;
    document.getElementById("trackingMapModal").classList.add("open");
    
    setTimeout(async () => {
        await initLeafletMap(tripId);
    }, 200);
}

function closeTrackingModal() {
    document.getElementById("trackingMapModal").classList.remove("open");
    if (trackingAnimationInterval) clearInterval(trackingAnimationInterval);
    if (trackingWebSocket) trackingWebSocket.close();
}

async function initLeafletMap(tripId) {
    try {
        const res = await fetch(`${API_BASE}/api/trips/${tripId}/route-coordinates`);
        const data = await res.json();
        
        const waypoints = data.waypoints;
        const startPoint = [waypoints[0].lat, waypoints[0].lng];
        const endPoint = [waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lng];
        
        if (data.road_name && data.distance_km) {
            document.getElementById("trackTripRouteTitle").textContent = `${data.source} ➔ ${data.destination} (${data.road_name} • ${data.distance_km} km)`;
        }
        
        if (leafletMap) leafletMap.remove();
        
        leafletMap = L.map('liveMapCanvas').setView(startPoint, 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18, attribution: '© OpenStreetMap'
        }).addTo(leafletMap);
        
        L.marker(startPoint).addTo(leafletMap).bindPopup(`🟢 <b>Pickup:</b> ${waypoints[0].name}`).openPopup();
        L.marker(endPoint).addTo(leafletMap).bindPopup(`🏁 <b>Drop:</b> ${waypoints[waypoints.length - 1].name}`);
        
        const latLngs = waypoints.map(w => [w.lat, w.lng]);
        mapRoutePolyline = L.polyline(latLngs, { color: '#2563eb', weight: 5, opacity: 0.8 }).addTo(leafletMap);
        leafletMap.fitBounds(mapRoutePolyline.getBounds(), { padding: [40, 40] });
        
        const carIcon = L.divIcon({
            className: 'live-car-marker',
            html: '<div style="background:#2563eb; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(37,99,235,0.8); border:2px solid white; font-size:1rem;"><i class="fa-solid fa-car-side"></i></div>',
            iconSize: [34, 34], iconAnchor: [17, 17]
        });
        
        mapCarMarker = L.marker(startPoint, { icon: carIcon }).addTo(leafletMap);
        
        let step = 0;
        const totalSteps = 100;
        if (trackingAnimationInterval) clearInterval(trackingAnimationInterval);
        
        trackingAnimationInterval = setInterval(() => {
            step = (step + 1) % totalSteps;
            const progress = step / totalSteps;
            
            const idx = Math.min(Math.floor(progress * (waypoints.length - 1)), waypoints.length - 2);
            const subProg = (progress * (waypoints.length - 1)) - idx;
            
            const p1 = waypoints[idx];
            const p2 = waypoints[idx + 1];
            
            const curLat = p1.lat + (p2.lat - p1.lat) * subProg;
            const curLng = p1.lng + (p2.lng - p1.lng) * subProg;
            
            mapCarMarker.setLatLng([curLat, curLng]);
            
            const remainingMins = Math.max(2, Math.round((1 - progress) * data.eta_minutes));
            document.getElementById("trackEtaVal").textContent = `~${remainingMins} Mins`;
            document.getElementById("trackSpeedVal").textContent = `${Math.floor(40 + Math.sin(step)*8)} km/h`;
        }, 1200);
        
    } catch (err) {
        console.error("Leaflet map error:", err);
    }
}

// 18. SMART VOLUMETRIC FARE CALCULATOR
function applyVolumetricPreset(weight, L, W, H) {
    document.getElementById("volActualWeight").value = weight;
    document.getElementById("volDimL").value = L;
    document.getElementById("volDimW").value = W;
    document.getElementById("volDimH").value = H;
    
    document.querySelectorAll(".volumetric-preset-chips .vol-chip").forEach(c => c.classList.remove("active"));
    event.target.classList.add("active");
    calculateSmartFareLive();
}

async function calculateSmartFareLive() {
    const cat = document.getElementById("newServiceCategory").value;
    const scope = document.getElementById("newTripScope").value;
    const source = document.getElementById("newSource").value;
    const dest = document.getElementById("newDestination").value;
    const mode = document.getElementById("newVehicleMode").value;
    
    const weight = parseFloat(document.getElementById("volActualWeight") ? document.getElementById("volActualWeight").value : 1.0) || 1.0;
    const L = parseFloat(document.getElementById("volDimL") ? document.getElementById("volDimL").value : 20.0) || 20.0;
    const W = parseFloat(document.getElementById("volDimW") ? document.getElementById("volDimW").value : 15.0) || 15.0;
    const H = parseFloat(document.getElementById("volDimH") ? document.getElementById("volDimH").value : 10.0) || 10.0;
    
    try {
        const res = await fetch(`${API_BASE}/api/fares/calculate`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                category: cat, scope: scope, source: source || "Bhopal",
                destination: dest || "Indore", vehicle_mode: mode,
                actual_weight_kg: weight, length_cm: L, width_cm: W, height_cm: H
            })
        });
        
        if (res.ok) {
            const data = await res.json();
            const fareEl = document.getElementById("smartFareAmount");
            if (fareEl) fareEl.textContent = `₹${data.recommended_fair_price.toFixed(2)}`;
            
            const priceInp = document.getElementById("newPrice");
            if (priceInp && (!priceInp.value || priceInp.getAttribute("data-user-edited") !== "true")) {
                priceInp.value = data.recommended_fair_price;
            }
        }
    } catch (err) {
        console.error("Fare calc error:", err);
    }
}

// 19. WALLET, RAZORPAY & DRIVER PAYOUTS
async function loadUserWallet() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/wallet/balance?user_id=${currentUser.id}`);
        const data = await res.json();
        currentUser.wallet_balance = data.wallet_balance;
        currentUser.upi_id = data.upi_id;
        currentUser.is_online = data.is_online;
        currentUser.is_aadhaar_verified = data.is_aadhaar_verified;
        updateWalletBadge();
        
        const modalBal = document.getElementById("walletModalBalance");
        if (modalBal) modalBal.textContent = data.wallet_balance.toFixed(2);
        
        const payoutBal = document.getElementById("payoutAvailableBalance");
        if (payoutBal) payoutBal.textContent = data.wallet_balance.toFixed(2);
        
        const txnContainer = document.getElementById("walletTxnContainer");
        if (txnContainer && data.transactions) {
            if (data.transactions.length === 0) {
                txnContainer.innerHTML = `<div style="font-size:0.75rem; color:#94a3b8;">No recent transactions.</div>`;
            } else {
                txnContainer.innerHTML = data.transactions.map(t => {
                    const isCredit = t.amount > 0;
                    const amountClass = isCredit ? "txn-credit" : "txn-debit";
                    const sign = isCredit ? "+" : "";
                    return `
                        <div class="txn-item">
                            <div>
                                <div style="font-weight:600;">${t.description}</div>
                                <div style="font-size:0.68rem; color:#94a3b8;">${t.txn_type}</div>
                            </div>
                            <div class="${amountClass}">${sign}₹${Math.abs(t.amount).toFixed(2)}</div>
                        </div>
                    `;
                }).join("");
            }
        }
    } catch (err) {
        console.error("Error loading wallet:", err);
    }
}

function updateWalletBadge() {
    if (!currentUser) return;
    const el = document.getElementById("activeUserWallet");
    if (el) el.textContent = (currentUser.wallet_balance || 0).toFixed(2);
}

function openWalletModal() {
    loadUserWallet();
    document.getElementById("walletModal").classList.add("open");
}

function closeWalletModal() {
    document.getElementById("walletModal").classList.remove("open");
}

async function triggerRazorpayGateway(amount, purpose, bookingPayload = null) {
    try {
        const orderRes = await fetch(`${API_BASE}/api/payments/create-order`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id, amount: amount, purpose: purpose,
                trip_id: bookingPayload ? bookingPayload.trip_id : null
            })
        });
        
        const orderData = await orderRes.json();
        
        if (window.Razorpay && orderData.is_live_gateway) {
            const options = {
                key: orderData.razorpay_key_id,
                amount: orderData.amount * 100,
                currency: "INR",
                name: "GatiConnect Mobility Network",
                description: purpose === "WALLET_TOPUP" ? "Wallet Top-Up" : "Escrow Booking",
                order_id: orderData.order_id,
                theme: { color: "#2563eb" },
                handler: async function (response) {
                    await completePaymentVerification(orderData.order_id, response.razorpay_payment_id, purpose, bookingPayload);
                }
            };
            const rzp = new Razorpay(options);
            rzp.open();
        } else {
            const simPaymentId = `pay_sim_${Date.now()}_${Math.floor(Math.random()*9000+1000)}`;
            const proceed = confirm(`💳 [Razorpay Payment Gateway Simulation]\n\nAmount: ₹${amount.toFixed(2)}\nMode: UPI / Cards\nCustomer: ${currentUser.full_name}\n\nक्या आप ₹${amount} का पेमेंट अप्रूव करना चाहते हैं?`);
            if (proceed) {
                await completePaymentVerification(orderData.order_id, simPaymentId, purpose, bookingPayload);
            }
        }
    } catch (err) {
        console.error("Payment error:", err);
    }
}

async function completePaymentVerification(orderId, paymentId, purpose, bookingPayload) {
    try {
        const verifyRes = await fetch(`${API_BASE}/api/payments/verify-payment`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                order_id: orderId, payment_id: paymentId, user_id: currentUser.id,
                purpose: purpose, trip_id: bookingPayload ? bookingPayload.trip_id : null,
                booking_details: bookingPayload
            })
        });
        
        const result = await verifyRes.json();
        if (verifyRes.ok) {
            playAudioSound("COIN");
            alert(`🎉 ${result.message}`);
            closeWalletModal();
            closeBookModal();
            await loadUserWallet();
            await loadMyBookings();
            await loadListings();
            await loadHubSummary();
        }
    } catch (err) {
        console.error("Payment verify error:", err);
    }
}

async function handleTopUpWallet(e) {
    e.preventDefault();
    if (!currentUser) return;
    const amount = parseFloat(document.getElementById("topUpAmountInput").value);
    if (!amount || amount <= 0) return;
    await triggerRazorpayGateway(amount, "WALLET_TOPUP");
}

function openPayoutModal() {
    if (!currentUser) return;
    loadUserWallet();
    document.getElementById("payoutAmountInput").value = "";
    document.getElementById("payoutUpiInput").value = currentUser.upi_id || "";
    document.getElementById("payoutModal").classList.add("open");
}

function closePayoutModal() {
    document.getElementById("payoutModal").classList.remove("open");
}

function togglePayoutMethodInput() {
    const method = document.getElementById("payoutMethodSelect").value;
    document.getElementById("payoutUpiGroup").style.display = (method === "UPI") ? "block" : "none";
    document.getElementById("payoutBankGroup").style.display = (method === "BANK") ? "block" : "none";
}

async function handleWithdrawSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;
    
    const amount = parseFloat(document.getElementById("payoutAmountInput").value);
    const method = document.getElementById("payoutMethodSelect").value;
    let address = (method === "UPI") ? document.getElementById("payoutUpiInput").value.trim() : `A/C: ${document.getElementById("payoutBankAccInput").value} (${document.getElementById("payoutBankIfscInput").value})`;
    
    if (!amount || amount > currentUser.wallet_balance) {
        alert("अपर्याप्त बैलेंस।");
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/api/wallet/withdraw`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.id, amount: amount, payout_method: method, payout_address: address })
        });
        const data = await res.json();
        if (res.ok) {
            playAudioSound("COIN");
            closePayoutModal();
            alert(`✅ ${data.message}`);
            await loadUserWallet();
        }
    } catch (err) {
        console.error("Payout error:", err);
    }
}

// 20. 🚨 DYNAMIC WHATSAPP SOS & SAFETY
function openSosModal(bookingData) {
    activeSosBooking = bookingData;
    playAudioSound("ALERT");
    document.getElementById("sosModal").classList.add("open");
}

function closeSosModal() {
    document.getElementById("sosModal").classList.remove("open");
    activeSosBooking = null;
}

function shareRideOnWhatsApp() {
    let driverStr = "Driver: Verified Partner";
    let vehicleStr = "Vehicle: Commercial Verified";
    let routeStr = "Route: Bhopal ➔ Indore";
    
    if (activeSosBooking) {
        if (activeSosBooking.creator) driverStr = `Driver: ${activeSosBooking.creator.full_name} (${activeSosBooking.creator.phone_number})`;
        if (activeSosBooking.vehicle) vehicleStr = `Vehicle: ${activeSosBooking.vehicle.vehicle_name} [${activeSosBooking.vehicle.vehicle_number}]`;
        if (activeSosBooking.trip) routeStr = `Route: ${activeSosBooking.trip.source_city} ➔ ${activeSosBooking.trip.destination_city}`;
    }
    
    const mapsLink = `https://maps.google.com/?q=${currentDeviceCoordinates.lat},${currentDeviceCoordinates.lng}`;
    
    const text = encodeURIComponent(
        `🚨 *EMERGENCY SOS - GATICONNECT LIVE RIDE ALERT* 🚨\n\n` +
        `मैं वर्तमान में GatiConnect पर यात्रा कर रहा हूँ। मेरी सुरक्षा के लिए यह विवरण तुरंत नोट करें:\n\n` +
        `👤 ${driverStr}\n` +
        `🚗 ${vehicleStr}\n` +
        `📍 ${routeStr}\n` +
        `🌐 *लाइव GPS लोकेशन:* ${mapsLink}\n\n` +
        `समय: ${new Date().toLocaleTimeString()}\n` +
        `प्लेटफॉर्म: GatiConnect Escrow Protected Mobility Network`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function openRatingModal(bookingId) {
    document.getElementById("ratingBookingId").value = bookingId;
    document.getElementById("ratingCommentInput").value = "";
    setRatingValue(5);
    document.getElementById("ratingModal").classList.add("open");
}

function closeRatingModal() {
    document.getElementById("ratingModal").classList.remove("open");
}

function setRatingValue(val) {
    document.getElementById("ratingScoreInput").value = val;
    document.querySelectorAll("#starRatingWrap .star-btn").forEach(s => {
        const sVal = parseInt(s.getAttribute("data-value"));
        s.classList.toggle("active", sVal <= val);
    });
}

async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;
    const bookingId = parseInt(document.getElementById("ratingBookingId").value);
    const ratingScore = parseFloat(document.getElementById("ratingScoreInput").value);
    const comment = document.getElementById("ratingCommentInput").value.trim();
    
    try {
        const res = await fetch(`${API_BASE}/api/reviews/create`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_id: bookingId, reviewer_id: currentUser.id, rating: ratingScore, comment: comment })
        });
        const data = await res.json();
        if (res.ok) {
            playAudioSound("CHIME");
            alert(data.message);
            closeRatingModal();
            await loadMyBookings();
            await loadUsers();
        }
    } catch (err) {
        console.error("Review error:", err);
    }
}

// 21. VIEW NAVIGATION & INTENT DOORS
function navigateToCategory(catKey) {
    currentCategory = catKey;
    currentIntentDoor = "DOOR_1";
    
    document.getElementById("homeHubView").style.display = "none";
    document.getElementById("tailoredMatchesView").style.display = "none";
    document.getElementById("categoryDetailView").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const catTitles = {
        "RIDE_SHARE": (currentLang === "HI") ? "🚗 Ride Share (सफ़र व सीट शेयरिंग)" : "🚗 Ride Share (Seat Sharing)",
        "DRIVER_MATCH": (currentLang === "HI") ? "👨✈️ Driver Match (वेरीफाइड ड्राइवर कनेक्ट)" : "👨✈️ Driver Match (Verified Drivers)",
        "PARCEL": (currentLang === "HI") ? "📦 P2P Parcel (लोकल कॉलोनी व पार्सल)" : "📦 P2P Parcel (Micro Deliveries)",
        "CARGO": (currentLang === "HI") ? "🚚 Return Cargo (छोटा हाथी व ट्रक लोड)" : "🚚 Return Cargo (Tata Ace & Trucks)"
    };
    document.getElementById("catViewTitle").textContent = catTitles[catKey] || "Available Listings";
    
    renderIntentDoors(catKey);
    updateCrossOpportunityBanner(catKey);
    filterListings();
}

function navigateBackToHub() {
    currentCategory = "ALL";
    document.getElementById("categoryDetailView").style.display = "none";
    document.getElementById("tailoredMatchesView").style.display = "none";
    document.getElementById("homeHubView").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadHubSummary();
}

function renderIntentDoors(catKey) {
    const wrap = document.getElementById("intentDoorsWrap");
    let door1Html = "";
    let door2Html = "";
    const isHi = (currentLang === "HI");
    
    if (catKey === "PARCEL") {
        door1Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_1' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_1')"><div class="door-icon-box"><i class="fa-solid fa-box-open"></i></div><div><span class="door-title">${isHi ? '📦 मुझे सामान / पार्सल भेजना है' : '📦 I Want to Send a Parcel'}</span><span class="door-subtitle">${isHi ? 'रास्ते में ले जाने वाले लोग देखें' : 'Find Commuters on this route'}</span></div></div>`;
        door2Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_2' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_2')"><div class="door-icon-box"><i class="fa-solid fa-motorcycle"></i></div><div><span class="door-title">${isHi ? '🛵 मैं जा रहा हूँ, सामान ले जाना है' : '🛵 I am Traveling & Can Carry'}</span><span class="door-subtitle">${isHi ? 'पार्सल भेजकर ₹ कमाने के अवसर देखें' : 'Earn extra by delivering'}</span></div></div>`;
    } else if (catKey === "DRIVER_MATCH") {
        door1Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_1' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_1')"><div class="door-icon-box"><i class="fa-solid fa-id-card"></i></div><div><span class="door-title">${isHi ? '👨✈️ मैं ड्राइवर हूँ — काम चाहिए' : '👨✈️ I am a Driver (Need Work)'}</span><span class="door-subtitle">${isHi ? 'गाड़ी मालिकों की ज़रूरतें देखें' : 'View Car Owners Looking for Drivers'}</span></div></div>`;
        door2Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_2' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_2')"><div class="door-icon-box"><i class="fa-solid fa-car"></i></div><div><span class="door-title">${isHi ? '🚗 मेरी गाड़ी है — ड्राइवर चाहिए' : '🚗 I Have a Car (Need Driver)'}</span><span class="door-subtitle">${isHi ? 'उपलब्ध वेरीफाइड ड्राइवर्स देखें' : 'View Available Verified Drivers'}</span></div></div>`;
    } else if (catKey === "RIDE_SHARE") {
        door1Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_1' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_1')"><div class="door-icon-box"><i class="fa-solid fa-chair"></i></div><div><span class="door-title">${isHi ? '💺 मुझे जाने के लिए सीट चाहिए' : '💺 I Need a Seat'}</span><span class="door-subtitle">${isHi ? 'उपलब्ध कार व बाइक देखें' : 'Find Available Carpool Seats'}</span></div></div>`;
        door2Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_2' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_2')"><div class="door-icon-box"><i class="fa-solid fa-car-side"></i></div><div><span class="door-title">${isHi ? '🚗 मेरी गाड़ी में खाली सीट है' : '🚗 I Have Empty Seats'}</span><span class="door-subtitle">${isHi ? 'सवारी ढूंढ रहे लोग देखें' : 'Find Passengers to Share Fuel'}</span></div></div>`;
    } else if (catKey === "CARGO") {
        door1Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_1' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_1')"><div class="door-icon-box"><i class="fa-solid fa-boxes-packing"></i></div><div><span class="door-title">${isHi ? '📦 मुझे माल / लोडिंग भेजना है' : '📦 I Want to Ship Cargo'}</span><span class="door-subtitle">${isHi ? 'उपलब्ध खाली छोटा हाथी व ट्रक देखें' : 'Find Tata Ace & Return Trucks'}</span></div></div>`;
        door2Html = `<div class="intent-door-btn ${currentIntentDoor === 'DOOR_2' ? 'active' : ''}" onclick="selectIntentDoor('DOOR_2')"><div class="door-icon-box"><i class="fa-solid fa-truck"></i></div><div><span class="door-title">${isHi ? '🚚 मेरा ट्रक/टेम्पो खाली जा रहा है' : '🚚 My Truck is Returning Empty'}</span><span class="door-subtitle">${isHi ? 'सामान भेजने वाले व्यापारियों को खोजें' : 'Find Shippers on your route'}</span></div></div>`;
    }
    wrap.innerHTML = door1Html + door2Html;
}

function selectIntentDoor(doorKey) {
    currentIntentDoor = doorKey;
    renderIntentDoors(currentCategory);
    filterListings();
}

function updateCrossOpportunityBanner(catKey) {
    const box = document.getElementById("crossOpportunityBox");
    const textEl = document.getElementById("crossOpportunityText");
    if (catKey === "RIDE_SHARE") {
        box.style.display = "flex";
        textEl.innerHTML = `<strong>💡 Cross-Category Earning:</strong> 1 Urgent Parcel on Kolar ➔ MP Nagar route. You can carry it to earn extra <strong>+₹40.00</strong>!`;
    } else if (catKey === "PARCEL") {
        box.style.display = "flex";
        textEl.innerHTML = `<strong>💡 Commuter Available:</strong> Rahul (Hero Splendor) travels Kolar ➔ MP Nagar at 10:30 AM and is ready to carry small packets for ₹35-₹40.`;
    } else {
        box.style.display = "none";
    }
}

async function loadHubSummary() {
    try {
        const res = await fetch(`${API_BASE}/api/hub-summary`);
        const data = await res.json();
        if (data.counts) {
            document.getElementById("count-RIDE_SHARE").textContent = data.counts.RIDE_SHARE || 0;
            document.getElementById("count-DRIVER_MATCH").textContent = data.counts.DRIVER_MATCH || 0;
            document.getElementById("count-PARCEL").textContent = data.counts.PARCEL || 0;
            document.getElementById("count-CARGO").textContent = data.counts.CARGO || 0;
        }
    } catch (err) {
        console.error("Hub summary error:", err);
    }
}

function openSynergyModal() {
    checkTripMatches(1, "Kolar Road ➔ MP Nagar (Daily Bike Ride)");
}

// 22. LISTINGS & HUMAN CARDS
function getHumanCardInfo(t, c) {
    const isOffer = (t.listing_type === "OFFER");
    const isHi = (currentLang === "HI");
    let roleBadgeHtml = "";
    let headlineText = "";
    let actionBtnText = isHi ? "Book" : "Book";
    
    if (t.service_category === "PARCEL") {
        if (isOffer) {
            roleBadgeHtml = `<span class="role-badge role-badge-offer"><i class="fa-solid fa-circle-check"></i> ${isHi ? '🟢 रास्ते में पार्सल ले जाने के लिए तैयार' : '🟢 Ready to Carry Parcels'}</span>`;
            headlineText = `${c.name} (${t.vehicle_mode}) — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city}`;
            actionBtnText = isHi ? "📦 पार्सल सौंपें" : "📦 Send Parcel";
        } else {
            roleBadgeHtml = `<span class="role-badge role-badge-request"><i class="fa-solid fa-box"></i> ${isHi ? '🟠 पार्सल / सामान भेजना है' : '🟠 Need Parcel Delivered'}</span>`;
            headlineText = `${c.name} — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city}`;
            actionBtnText = isHi ? "🛵 पार्सल पिक करें" : "🛵 Pick Parcel";
        }
    } else if (t.service_category === "DRIVER_MATCH") {
        if (isOffer) {
            roleBadgeHtml = `<span class="role-badge role-badge-offer"><i class="fa-solid fa-id-badge"></i> ${isHi ? '🟢 वेरीफाइड ड्राइवर उपलब्ध (गाड़ी चलाने हेतु)' : '🟢 Verified Driver Available'}</span>`;
            headlineText = `${c.name} (${isHi ? 'वेरीफाइड ड्राइवर' : 'Verified Driver'}) — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city}`;
            actionBtnText = isHi ? "👨✈️ ड्राइवर हायर करें" : "👨✈️ Hire Driver";
        } else {
            roleBadgeHtml = `<span class="role-badge role-badge-request"><i class="fa-solid fa-car"></i> ${isHi ? '🟠 अपनी गाड़ी के लिए ड्राइवर चाहिए' : '🟠 Need Driver for Car'}</span>`;
            headlineText = `${c.name} — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city}`;
            actionBtnText = isHi ? "🚗 ड्राइविंग स्वीकार करें" : "🚗 Accept Driving";
        }
    } else if (t.service_category === "RIDE_SHARE") {
        if (isOffer) {
            roleBadgeHtml = `<span class="role-badge role-badge-offer"><i class="fa-solid fa-car-side"></i> ${isHi ? '🟢 खाली सीट उपलब्ध' : '🟢 Seats Available'}</span>`;
            headlineText = `${c.name} (${t.vehicle_mode}) — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city} (${t.available_seats} ${isHi ? 'सीट खाली' : 'Seats'})`;
            actionBtnText = isHi ? "💺 सीट बुक करें" : "💺 Book Seat";
        } else {
            roleBadgeHtml = `<span class="role-badge role-badge-request"><i class="fa-solid fa-person-walking-luggage"></i> ${isHi ? '🟠 जाने के लिए सीट चाहिए' : '🟠 Seeking Ride'}</span>`;
            headlineText = `${c.name} — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city}`;
            actionBtnText = isHi ? "🚗 राइड दें" : "🚗 Offer Ride";
        }
    } else if (t.service_category === "CARGO") {
        if (isOffer) {
            roleBadgeHtml = `<span class="role-badge role-badge-offer"><i class="fa-solid fa-truck"></i> ${isHi ? '🟢 खाली छोटा हाथी/ट्रक उपलब्ध' : '🟢 Return Cargo Capacity'}</span>`;
            headlineText = `${c.name} (${t.vehicle_mode}) — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city}`;
            actionBtnText = isHi ? "🚚 लोड बुक करें" : "🚚 Book Cargo";
        } else {
            roleBadgeHtml = `<span class="role-badge role-badge-request"><i class="fa-solid fa-boxes-stacked"></i> ${isHi ? '🟠 दुकान/फैक्ट्री का माल भेजना है' : '🟠 Need Cargo Shipment'}</span>`;
            headlineText = `${c.name} — ${t.source_city} ${isHi ? 'से' : 'to'} ${t.destination_city}`;
            actionBtnText = isHi ? "📦 माल उठाएं" : "📦 Pickup Cargo";
        }
    }
    return { roleBadgeHtml, headlineText, actionBtnText };
}

async function loadListings() {
    try {
        const res = await fetch(`${API_BASE}/api/trips`);
        currentTrips = await res.json();
        filterListings();
    } catch (err) {
        console.error("Error loading listings:", err);
    }
}

function filterListings() {
    const fromVal = document.getElementById("searchInputFrom").value.trim().toLowerCase();
    const toVal = document.getElementById("searchInputTo").value.trim().toLowerCase();
    const isHi = (currentLang === "HI");
    
    let filtered = currentTrips;
    if (currentCategory !== "ALL") filtered = filtered.filter(item => item.trip.service_category === currentCategory);
    
    let targetListingType = "OFFER";
    if (currentCategory === "DRIVER_MATCH") {
        targetListingType = (currentIntentDoor === "DOOR_1") ? "OFFER" : "REQUEST";
    } else {
        targetListingType = (currentIntentDoor === "DOOR_1") ? "OFFER" : "REQUEST";
    }
    
    filtered = filtered.filter(item => item.trip.listing_type === targetListingType);
    
    if (fromVal) filtered = filtered.filter(item => item.trip.source_city.toLowerCase().includes(fromVal));
    if (toVal) filtered = filtered.filter(item => item.trip.destination_city.toLowerCase().includes(toVal));
    
    // Update Search Results Indicator
    const indicator = document.getElementById("searchResultsCount");
    if (indicator) {
        if (fromVal || toVal) {
            indicator.style.display = "flex";
            const routeStr = (fromVal && toVal) ? `${fromVal.toUpperCase()} ➔ ${toVal.toUpperCase()}` : (fromVal ? `From ${fromVal.toUpperCase()}` : `To ${toVal.toUpperCase()}`);
            indicator.innerHTML = `
                <span><i class="fa-solid fa-magnifying-glass"></i> ${isHi ? 'सर्च परिणाम:' : 'Search Results for'} <strong>${routeStr}</strong></span>
                <span class="badge-govt-verified">${filtered.length} ${isHi ? 'उपलब्ध' : 'Found'}</span>
            `;
        } else {
            indicator.style.display = "none";
        }
    }
    
    renderCategoryFeed(filtered);
}

function renderCategoryFeed(items) {
    const feed = document.getElementById("categoryFeed");
    if (!feed) return;
    const isHi = (currentLang === "HI");
    
    if (items.length === 0) {
        feed.innerHTML = `
            <div style="text-align:center; padding: 2.5rem 1rem; background:#fff; border-radius:12px; border:1px dashed #cbd5e1; color:#64748b;">
                <i class="fa-solid fa-map-location-dot" style="font-size: 2.2rem; margin-bottom: 0.6rem; color:#94a3b8;"></i>
                <p style="font-weight:700; color:#334155; margin-bottom:0.3rem;">${isHi ? 'इस रूट पर अभी कोई लिस्टिंग उपलब्ध नहीं है।' : 'No listings found on this exact route.'}</p>
                <button class="btn-create-offering" style="margin: 0.8rem auto 0;" onclick="handlePostTripClick()">
                    <i class="fa-solid fa-plus-circle"></i> ${isHi ? '+ अपनी ज़रूरत या ट्रिप पोस्ट करें' : '+ Post Your Requirement'}
                </button>
            </div>
        `;
        return;
    }
    
    feed.innerHTML = items.map(item => {
        const t = item.trip;
        const c = item.creator;
        const human = getHumanCardInfo(t, c);
        const tripSummaryStr = `${t.source_city} ➔ ${t.destination_city} (₹${t.price})`;
        
        const aadhaarBadge = c.is_aadhaar_verified ? `<span title="Govt Aadhaar Verified" style="color:#15803d;"><i class="fa-solid fa-circle-check"></i> Aadhaar</span>` : '';
        const onlineDot = c.is_online ? `<span style="color:#16a34a; font-size:0.68rem;">🟢 Online</span>` : `<span style="color:#dc2626; font-size:0.68rem;">🔴 Offline</span>`;
        
        return `
            <div class="listing-card">
                <img src="${t.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500'}" class="card-img-thumb" alt="Listing Image">
                <div class="card-body">
                    <div>
                        <div class="human-role-header">
                            <div>${human.roleBadgeHtml}</div>
                            <div>
                                <div class="price-tag">₹${t.price}</div>
                                <div class="price-label">${t.allow_bargain ? (isHi ? 'मोल-भाव संभव' : 'Negotiable') : (isHi ? 'फिक्स' : 'Fixed')}</div>
                            </div>
                        </div>

                        <div class="human-headline-text">${human.headlineText}</div>

                        <div class="route-row">
                            <span>${t.source_city}</span>
                            <i class="fa-solid fa-arrow-right-long" style="color:var(--primary); font-size:0.85rem;"></i>
                            <span>${t.destination_city}</span>
                        </div>

                        <div class="details-row">
                            <span><i class="fa-regular fa-clock"></i> ${t.departure_time}</span>
                            <span><i class="fa-solid fa-car"></i> ${t.vehicle_mode}</span>
                            <span>${onlineDot}</span>
                        </div>

                        ${t.description ? `<div class="desc-text">${t.description}</div>` : ''}
                    </div>

                    <div class="card-footer">
                        <div class="creator-info">
                            <div class="creator-avatar">${c.name.charAt(0)}</div>
                            <div>
                                <div style="display:flex; align-items:center; gap:0.4rem;">
                                    <div class="creator-name">${c.name}</div>
                                    <span style="font-size:0.7rem; color:#eab308; font-weight:700;"><i class="fa-solid fa-star"></i> ${c.rating}</span>
                                </div>
                                <div class="creator-badges" style="display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.25rem;">
                                    <span class="trust-pill-mini ${c.trust_score >= 85 ? 'trust-gold' : 'trust-verified'}"><i class="fa-solid fa-shield-halved"></i> Trust ${c.trust_score}/100</span>
                                    ${c.is_aadhaar_verified ? '<span class="trust-pill-mini trust-verified"><i class="fa-solid fa-fingerprint"></i> Aadhaar</span>' : '<span class="trust-pill-mini" style="opacity:0.6;"><i class="fa-regular fa-circle"></i> ID</span>'}
                                    ${(c.is_dl_verified || c.dl_number) ? '<span class="trust-pill-mini trust-verified"><i class="fa-solid fa-id-card"></i> DL</span>' : ''}
                                    ${(c.is_vehicle_verified || c.vehicle_number) ? '<span class="trust-pill-mini trust-verified"><i class="fa-solid fa-car-side"></i> RC</span>' : ''}
                                </div>
                            </div>
                        </div>

                        <div class="card-actions">
                            <button class="btn-chat-open" onclick="openChatModal(${t.id}, ${c.id}, '${c.name}', '${tripSummaryStr}')">
                                <i class="fa-regular fa-comment-dots"></i> Chat
                            </button>
                            <button class="btn-book" onclick="openBookModal(${t.id})">
                                ${human.actionBtnText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// 23. TAILORED MATCHES VIEW
function navigateToTailoredMatches(tripInfo, matches) {
    document.getElementById("homeHubView").style.display = "none";
    document.getElementById("categoryDetailView").style.display = "none";
    document.getElementById("tailoredMatchesView").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById("tailoredHeroRoute").textContent = `${tripInfo.source_city} ➔ ${tripInfo.destination_city}`;
    document.getElementById("tailoredHeroDetails").textContent = `Category: ${tripInfo.service_category} | Quoted Rate: ₹${tripInfo.price}`;
    
    const feed = document.getElementById("tailoredMatchesFeed");
    if (!matches || matches.length === 0) {
        feed.innerHTML = `
            <div style="text-align:center; padding: 2.5rem 1rem; background:#fff; border-radius:12px; border:1px dashed #cbd5e1; color:#64748b;">
                <i class="fa-solid fa-clock-rotate-left" style="font-size: 2.2rem; margin-bottom: 0.6rem; color:#0f766e;"></i>
                <h4 style="color:#0f172a; margin-bottom:0.3rem;">आपकी पोस्ट लाइव हो गई है!</h4>
                <p>जैसे ही कोई साथी यात्री या ड्राइवर आएगा, आपको तुरंत नोटिफिकेशन मिलेगा।</p>
                <button class="btn-create-offering" style="margin: 1rem auto 0;" onclick="navigateBackToHub()">
                    <i class="fa-solid fa-house"></i> वापस होम पर जाएं
                </button>
            </div>
        `;
        return;
    }
    
    feed.innerHTML = matches.map(m => {
        const t = m.trip;
        const c = m.creator;
        const human = getHumanCardInfo(t, c);
        const tripSummaryStr = `${t.source_city} ➔ ${t.destination_city} (₹${t.price})`;
        
        return `
            <div class="listing-card" style="border: 2px solid #0d9488;">
                <div class="card-body">
                    <div>
                        <div class="human-role-header">
                            <div>
                                <span class="match-score-badge">🎯 ${m.match_score}% Route Match</span>
                                <div style="font-weight:700; font-size:0.88rem; color:#0f766e; margin-top:0.2rem;">
                                    ${m.synergy_label || 'Direct Requirement Match'}
                                </div>
                            </div>
                            <div>
                                <div class="price-tag" style="color:#0f766e;">₹${t.price}</div>
                            </div>
                        </div>

                        <div class="human-headline-text">${human.headlineText}</div>

                        <div class="route-row">
                            <span>${t.source_city}</span>
                            <i class="fa-solid fa-arrow-right-long" style="color:#0f766e; font-size:0.85rem;"></i>
                            <span>${t.destination_city}</span>
                        </div>

                        <div class="details-row">
                            <span><i class="fa-regular fa-clock"></i> ${t.departure_time}</span>
                            <span><i class="fa-solid fa-car"></i> ${t.vehicle_mode}</span>
                        </div>

                        ${t.description ? `<div class="desc-text">${t.description}</div>` : ''}
                    </div>

                    <div class="card-footer">
                        <div class="creator-info">
                            <div class="creator-avatar">${c.name.charAt(0)}</div>
                            <div>
                                <div class="creator-name">${c.name}</div>
                                <div class="creator-badges">
                                    <span><i class="fa-solid fa-shield-check"></i> ${c.trust_score}/100</span>
                                </div>
                            </div>
                        </div>

                        <div class="card-actions">
                            <button class="btn-chat-open" onclick="openChatModal(${t.id}, ${c.id}, '${c.name}', '${tripSummaryStr}')">
                                <i class="fa-regular fa-comment-dots"></i> Chat
                            </button>
                            <button class="btn-book" onclick="openBookModal(${t.id})">
                                ${human.actionBtnText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

// 24. QUICK PRESETS
function setQuickRoute(from, to) {
    document.getElementById("searchInputFrom").value = from;
    document.getElementById("searchInputTo").value = to;
    filterListings();
}

function clearRouteFilter() {
    document.getElementById("searchInputFrom").value = "";
    document.getElementById("searchInputTo").value = "";
    filterListings();
}

// 25. CHAT & BARGAINING
function openChatModal(tripId, partnerId, partnerName, tripSummary) {
    if (!requireAuth("चैट करने")) return;
    if (currentUser.id === partnerId) {
        alert("यह आपकी अपनी लिस्टिंग है!");
        return;
    }
    
    activeChatTripId = tripId;
    activeChatPartnerId = partnerId;
    
    document.getElementById("chatPartnerAvatar").textContent = partnerName.charAt(0);
    document.getElementById("chatPartnerName").textContent = partnerName;
    document.getElementById("chatTripSummary").textContent = tripSummary;
    
    document.getElementById("chatModal").classList.add("open");
    loadChatMessages();
    
    if (chatPollInterval) clearInterval(chatPollInterval);
    chatPollInterval = setInterval(loadChatMessages, 2500);
}

function closeChatModal() {
    document.getElementById("chatModal").classList.remove("open");
    activeChatTripId = null;
    activeChatPartnerId = null;
    if (chatPollInterval) clearInterval(chatPollInterval);
}

function toggleChatOfferInput() {
    const isOffer = document.getElementById("chatIsOfferCheck").checked;
    document.getElementById("chatOfferPriceWrap").style.display = isOffer ? "flex" : "none";
}

async function loadChatMessages() {
    if (!activeChatTripId || !currentUser || !activeChatPartnerId) return;
    try {
        const res = await fetch(`${API_BASE}/api/chat/history?trip_id=${activeChatTripId}&user_id=${currentUser.id}&other_user_id=${activeChatPartnerId}`);
        const messages = await res.json();
        renderChatMessages(messages);
    } catch (err) {
        console.error("Error loading chat:", err);
    }
}

function renderChatMessages(messages) {
    const container = document.getElementById("chatMessagesContainer");
    if (!messages || messages.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#94a3b8; font-size:0.8rem; margin:auto;">पिकअप लोकेशन, समय या काउंटर-ऑफर पर बात शुरू करें!</div>`;
        return;
    }
    
    container.innerHTML = messages.map(m => {
        const bubbleClass = m.is_me ? "sent" : "received";
        let offerCard = "";
        if (m.is_price_offer) {
            let acceptBtn = m.is_accepted ? `<div style="color:#16a34a; font-weight:800; font-size:0.78rem;">Accepted & Held in Escrow!</div>` : (!m.is_me ? `<button class="btn-accept-offer" onclick="handleAcceptChatOffer(${m.id})">Accept ₹${m.offered_price}</button>` : '');
            offerCard = `<div class="price-offer-card"><div style="font-size:0.72rem; font-weight:700;">Counter-Offer:</div><div class="offer-amount-badge">₹${m.offered_price}</div>${acceptBtn}</div>`;
        }
        return `<div class="chat-bubble ${bubbleClass}"><div>${m.message_text}</div>${offerCard}<span class="chat-time">${m.time}</span></div>`;
    }).join("");
    container.scrollTop = container.scrollHeight;
}

async function handleSendChatMessage(e) {
    e.preventDefault();
    if (!currentUser || !activeChatTripId || !activeChatPartnerId) return;
    
    const textInput = document.getElementById("chatTextInput");
    const isOffer = document.getElementById("chatIsOfferCheck").checked;
    const priceInput = document.getElementById("chatOfferPriceInput");
    const textVal = textInput.value.trim();
    if (!textVal) return;
    
    const payload = {
        trip_id: activeChatTripId, sender_id: currentUser.id, receiver_id: activeChatPartnerId,
        message_text: textVal, is_price_offer: isOffer, offered_price: isOffer ? (parseFloat(priceInput.value) || null) : null
    };
    
    try {
        const res = await fetch(`${API_BASE}/api/chat/send`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        if (res.ok) {
            textInput.value = "";
            document.getElementById("chatIsOfferCheck").checked = false;
            toggleChatOfferInput();
            playAudioSound("DING");
            await loadChatMessages();
        }
    } catch (err) {
        console.error("Chat send error:", err);
    }
}

function sendQuickMessage(text) {
    document.getElementById("chatTextInput").value = text;
}

async function handleAcceptChatOffer(messageId) {
    try {
        const res = await fetch(`${API_BASE}/api/chat/accept-price`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message_id: messageId, user_id: currentUser.id })
        });
        const data = await res.json();
        if (res.ok) {
            playAudioSound("CHIME");
            alert(data.message);
            await loadChatMessages();
            await loadUserWallet();
            await loadMyBookings();
        }
    } catch (err) {
        console.error("Accept offer error:", err);
    }
}

// 26. MY POSTED LISTINGS
async function loadMyCreatedTrips() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/trips/my-created?user_id=${currentUser.id}`);
        const trips = await res.json();
        const container = document.getElementById("hubMyCreatedContainer");
        if (!trips || trips.length === 0) {
            container.innerHTML = `<div style="font-size:0.78rem; color:#64748b; padding:0.5rem 0;">No active posted listings.</div>`;
            return;
        }
        container.innerHTML = trips.map(t => `
            <div class="created-trip-card">
                <div>
                    <div style="font-weight:700; font-size:0.82rem;">${t.source_city} ➔ ${t.destination_city} (₹${t.price})</div>
                    <div style="font-size:0.72rem; color:#64748b;">[${t.listing_type === 'OFFER' ? 'उपलब्ध' : 'ज़रूरत'}] ${t.vehicle_mode} • ${t.departure_time}</div>
                </div>
                <div class="my-trip-actions">
                    <button class="btn-match-view" onclick="checkTripMatches(${t.id}, '${t.source_city} ➔ ${t.destination_city}')"><i class="fa-solid fa-bullseye"></i> Matches</button>
                    <button class="btn-delete-trip" onclick="handleDeleteTrip(${t.id})"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `).join("");
    } catch (err) {
        console.error("Error loading trips:", err);
    }
}

async function checkTripMatches(tripId, tripRoute) {
    try {
        const res = await fetch(`${API_BASE}/api/trips/${tripId}/matches`);
        const matches = await res.json();
        const trip = currentTrips.find(i => i.trip.id === tripId);
        navigateToTailoredMatches(trip ? trip.trip : { source_city: "Selected Route", destination_city: "", service_category: "All", price: 0 }, matches);
    } catch (err) {
        console.error("Match error:", err);
    }
}

async function handleDeleteTrip(tripId) {
    if (!confirm("Are you sure you want to withdraw this trip?")) return;
    try {
        const res = await fetch(`${API_BASE}/api/trips/${tripId}?user_id=${currentUser.id}`, { method: "DELETE" });
        if (res.ok) {
            alert("✅ Trip listing removed successfully!");
            await loadListings();
            await loadMyCreatedTrips();
            await loadHubSummary();
        }
    } catch (err) {
        console.error("Delete error:", err);
    }
}

// 27. BOOKINGS, INSTANT CANCELLATIONS & ESCROW REFUNDS
function openBookModal(tripId) {
    if (!requireAuth("बुकिंग करने")) return;
    const item = currentTrips.find(i => i.trip.id === tripId);
    if (!item) return;
    
    const t = item.trip;
    document.getElementById("bookTripId").value = t.id;
    document.getElementById("bookCategory").value = t.service_category;
    document.getElementById("bookOriginalPrice").value = t.price;
    document.getElementById("bookAgreedPrice").value = t.price;
    document.getElementById("listedPriceDisplay").textContent = t.price;
    
    document.getElementById("bookTripSummary").innerHTML = `
        <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.25rem;">${t.source_city} ➔ ${t.destination_city}</div>
        <div style="color:#64748b; font-size:0.78rem;"><strong>Scope:</strong> ${t.trip_scope} | <strong>Mode:</strong> ${t.vehicle_mode} | <strong>Posted By:</strong> ${item.creator.name}</div>
    `;
    
    document.getElementById("parcelFields").style.display = (t.service_category === "PARCEL" || t.service_category === "CARGO") ? "block" : "none";
    updatePaymentMethodPills();
    document.getElementById("bookModal").classList.add("open");
}

function closeBookModal() {
    document.getElementById("bookModal").classList.remove("open");
}

function handlePaymentModeChange() {
    const selectedMode = document.querySelector('input[name="bookingPaymentMethod"]:checked').value;
    const rzpCard = document.getElementById("payMethodRazorpayLabel");
    const walCard = document.getElementById("payMethodWalletLabel");
    
    if (selectedMode === "RAZORPAY_UPI") {
        rzpCard.classList.add("active");
        walCard.classList.remove("active");
        document.getElementById("btnConfirmPayBooking").innerHTML = `<i class="fa-solid fa-bolt"></i> Pay via Razorpay UPI & Lock Escrow`;
    } else {
        walCard.classList.add("active");
        rzpCard.classList.remove("active");
        document.getElementById("btnConfirmPayBooking").innerHTML = `<i class="fa-solid fa-lock"></i> Pay from Wallet & Lock Escrow`;
    }
}

function updatePaymentMethodPills() {
    if (!currentUser) return;
    const agreedPrice = parseFloat(document.getElementById("bookAgreedPrice").value) || 0;
    const walLbl = document.getElementById("bookWalletBalanceLabel");
    if (walLbl) {
        walLbl.innerHTML = `Current Balance: <strong>₹${currentUser.wallet_balance.toFixed(2)}</strong> ${currentUser.wallet_balance >= agreedPrice ? '🟢 (Sufficient)' : '🟠 (Top-Up needed)'}`;
    }
}

async function handleConfirmBooking(e) {
    e.preventDefault();
    if (!currentUser) return;
    
    const tripId = parseInt(document.getElementById("bookTripId").value);
    const originalPrice = parseFloat(document.getElementById("bookOriginalPrice").value);
    const agreedPrice = parseFloat(document.getElementById("bookAgreedPrice").value);
    const selectedMode = document.querySelector('input[name="bookingPaymentMethod"]:checked').value;
    
    const bookingPayload = {
        trip_id: tripId, requester_id: currentUser.id, original_price: originalPrice,
        agreed_price: agreedPrice, bargain_status: (agreedPrice !== originalPrice ? "OFFERED" : "STANDARD"),
        payment_method: selectedMode, item_description: document.getElementById("bookItemDesc").value,
        item_weight_kg: parseFloat(document.getElementById("bookItemWeight").value) || 0,
        receiver_phone: document.getElementById("bookReceiverPhone").value
    };
    
    if (selectedMode === "RAZORPAY_UPI") {
        await triggerRazorpayGateway(agreedPrice, "DIRECT_BOOKING", bookingPayload);
    } else {
        if (currentUser.wallet_balance < agreedPrice) {
            alert("⚠️ Wallet Balance कम है। 'Direct Razorpay UPI' विकल्प चुनें।");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/bookings/request`, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bookingPayload)
            });
            const data = await res.json();
            closeBookModal();
            playAudioSound("CHIME");
            alert(`✅ ${data.message}\n\nHandover OTP: ${data.handover_otp}\nCompletion OTP: ${data.completion_otp}`);
            await loadListings();
            await loadMyBookings();
            await loadUserWallet();
            await loadHubSummary();
        } catch (err) {
            console.error("Booking error:", err);
        }
    }
}

async function loadMyBookings() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/bookings/my-bookings?user_id=${currentUser.id}`);
        const bookings = await res.json();
        renderBookings(bookings);
    } catch (err) {
        console.error("Error loading bookings:", err);
    }
}

function renderBookings(list) {
    const container = document.getElementById("hubBookingsList");
    if (!container) return;
    
    if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 1rem; background:#fff; border-radius:10px; border:1px solid #e2e8f0; color:#64748b; font-size:0.78rem;">No active bookings. Explore services above!</div>`;
        return;
    }
    
    container.innerHTML = list.map(item => {
        const b = item.booking;
        const t = item.trip;
        const otherParty = item.is_requester ? item.creator : item.requester;
        const otherPhone = otherParty ? otherParty.phone_number : "9826000000";
        const otherName = otherParty ? otherParty.full_name : "Partner";
        const tripRouteTitle = t ? `${t.source_city} ➔ ${t.destination_city}` : "Trip Details";
        
        let statusBadge = "";
        if (b.booking_status === "PENDING_DRIVER_APPROVAL") {
            statusBadge = `<span style="color:#8b5cf6;"><i class="fa-solid fa-hourglass-half"></i> Pending Driver Approval</span>`;
        } else if (b.booking_status === "CONFIRMED") {
            statusBadge = `<span style="color:#d97706;"><i class="fa-solid fa-clock"></i> Ready</span>`;
        } else if (b.booking_status === "IN_PROGRESS") {
            statusBadge = `<span style="color:#2563eb;"><i class="fa-solid fa-route"></i> On Road</span>`;
        } else if (b.booking_status === "COMPLETED") {
            statusBadge = `<span style="color:#16a34a;"><i class="fa-solid fa-circle-check"></i> Completed</span>`;
        } else if (b.booking_status === "CANCELLED") {
            statusBadge = `<span style="color:#dc2626;"><i class="fa-solid fa-ban"></i> Cancelled</span>`;
        }
        
        let escrowBadge = "";
        if (b.escrow_status === "HELD") {
            escrowBadge = `<span class="escrow-status-pill escrow-HELD"><i class="fa-solid fa-lock"></i> ₹${b.agreed_price} In Escrow</span>`;
        } else if (b.escrow_status === "RELEASED") {
            escrowBadge = `<span class="escrow-status-pill escrow-RELEASED"><i class="fa-solid fa-circle-check"></i> ₹${b.agreed_price} Paid to Driver</span>`;
        } else if (b.escrow_status === "REFUNDED") {
            escrowBadge = `<span class="escrow-status-pill escrow-REFUNDED"><i class="fa-solid fa-rotate-left"></i> ₹${b.agreed_price} 100% Refunded</span>`;
        }
        
        let driverBargainBox = "";
        if (item.is_driver && b.booking_status === "PENDING_DRIVER_APPROVAL") {
            driverBargainBox = `
                <div class="bargain-driver-action-card">
                    <div style="font-weight:700; font-size:0.8rem; color:#854d0e; margin-bottom:0.25rem;">
                        <i class="fa-solid fa-comments-dollar"></i> यात्री ने ₹${b.agreed_price} का काउंटर-ऑफर दिया है (मूल किराया: ₹${b.original_price}):
                    </div>
                    <div style="display:flex; gap:0.4rem;">
                        <button class="btn-accept-bargain" onclick="handleRespondBargain(${b.id}, 'ACCEPT')">
                            ✅ स्वीकार करें (Accept ₹${b.agreed_price})
                        </button>
                        <button class="btn-decline-bargain" onclick="handleRespondBargain(${b.id}, 'DECLINE')">
                            ❌ अस्वीकार करें (Decline)
                        </button>
                    </div>
                </div>
            `;
        }
        
        let verifyActions = "";
        let showQrButton = "";
        
        if (item.is_requester && (b.booking_status === "CONFIRMED" || b.booking_status === "IN_PROGRESS")) {
            const currentOtp = (b.booking_status === "CONFIRMED") ? b.handover_otp : b.completion_otp;
            const currentType = (b.booking_status === "CONFIRMED") ? "HANDOVER" : "COMPLETION";
            showQrButton = `
                <div style="margin-top:0.4rem; display:flex; justify-content:center;">
                    <button class="btn-show-qr-action" onclick="openQRCodeDisplayModal(${b.id}, '${currentOtp}', '${currentType}', '${b.item_seal_code || ''}')">
                        <i class="fa-solid fa-qrcode"></i> 📱 Show Verification QR (दिखाएं क्यूआर)
                    </button>
                </div>
            `;
        }
        
        if (item.is_driver) {
            if (b.booking_status === "CONFIRMED") {
                verifyActions = `
                    <div style="display:flex; flex-direction:column; gap:0.35rem; margin-top:0.45rem;">
                        <div style="display:flex; gap:0.4rem;">
                            <button class="btn-scan-qr-action" onclick="openQRScannerModal(${b.id})">
                                <i class="fa-solid fa-camera"></i> 📷 Scan QR Code
                            </button>
                        </div>
                        <div class="otp-action-row">
                            <input type="text" id="otp-input-${b.id}" class="otp-input-small" placeholder="Or Enter Handover OTP">
                            <button class="btn-verify" onclick="verifyOTP(${b.id}, 'handover')">Start Trip</button>
                        </div>
                    </div>
                `;
            } else if (b.booking_status === "IN_PROGRESS") {
                verifyActions = `
                    <div style="display:flex; flex-direction:column; gap:0.35rem; margin-top:0.45rem;">
                        <div style="display:flex; gap:0.4rem;">
                            <button class="btn-scan-qr-action" style="background:linear-gradient(135deg, #16a34a, #15803d);" onclick="openQRScannerModal(${b.id})">
                                <i class="fa-solid fa-camera"></i> 📷 Scan Delivery QR
                            </button>
                        </div>
                        <div class="otp-action-row">
                            <input type="text" id="otp-input-${b.id}" class="otp-input-small" placeholder="Or Enter Completion OTP">
                            <button class="btn-verify" style="background:#16a34a;" onclick="verifyOTP(${b.id}, 'completion')">Release Payout</button>
                        </div>
                    </div>
                `;
            }
        }
        
        let rateButton = (b.booking_status === "COMPLETED" && !b.has_reviewed) ? `<button class="btn-rate-trip" onclick="openRatingModal(${b.id})"><i class="fa-solid fa-star"></i> रेट करें (Rate 5★)</button>` : '';
        let invoiceButton = (b.booking_status === "COMPLETED") ? `<button class="btn-invoice-view" onclick="openReceiptModal(${b.id})"><i class="fa-solid fa-file-invoice"></i> 🧾 रसीद (Invoice)</button>` : '';
        
        let cancelButton = (b.booking_status === "CONFIRMED" || b.booking_status === "PENDING_DRIVER_APPROVAL") ? `
            <button class="btn-cancel-booking" onclick="handleCancelBooking(${b.id})">
                <i class="fa-solid fa-ban"></i> रद्द करें (Cancel & Refund)
            </button>
        ` : '';
        
        return `
            <div class="booking-card status-${b.booking_status}">
                <div class="booking-top">
                    <span>${tripRouteTitle}</span>
                    <div style="display:flex; gap:0.35rem; align-items:center;">${escrowBadge} ${statusBadge}</div>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
                    <div style="font-size:0.75rem; color:#64748b;">
                        <strong>Role:</strong> ${item.is_requester ? 'Customer' : 'Carrier/Driver'} | <strong>With:</strong> ${otherName}
                    </div>
                </div>

                ${driverBargainBox}

                ${(b.booking_status !== 'CANCELLED') ? `
                <div class="otp-box-grid">
                    <div class="otp-item"><span class="otp-label">Handover OTP</span><span class="otp-code">${b.handover_otp}</span></div>
                    <div class="otp-item"><span class="otp-label">Delivery OTP</span><span class="otp-code">${b.completion_otp}</span></div>
                </div>
                ${showQrButton}
                ` : ''}

                ${verifyActions}

                <!-- QUICK CONTACT, LIVE MAP, CANCEL, INVOICE & SAFETY BUTTONS -->
                <div class="booking-quick-actions">
                    ${(b.booking_status !== 'CANCELLED') ? `
                    <button class="btn-gps-track" onclick="openTrackingModal(${t ? t.id : 1}, '${otherName}', '${tripRouteTitle}')">
                        <i class="fa-solid fa-satellite-dish"></i> 🗺️ Live GPS Tracking
                    </button>
                    <a href="tel:+91${otherPhone}" class="btn-call-direct"><i class="fa-solid fa-phone"></i> Call</a>
                    <a href="https://wa.me/91${otherPhone}?text=${encodeURIComponent('Hello regarding booking #' + b.id)}" target="_blank" class="btn-wa-direct"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                    <button class="btn-sos-trigger" onclick="openSosModal(${JSON.stringify(item).replace(/"/g, '&quot;')})"><i class="fa-solid fa-shield-halved"></i> 🚨 SOS</button>
                    ${cancelButton}
                    ` : ''}
                    ${invoiceButton}
                    ${rateButton}
                </div>
            </div>
        `;
    }).join("");
}

// 28. CANCEL BOOKING & INSTANT 100% ESCROW REFUND
async function handleCancelBooking(bookingId) {
    if (!currentUser) return;
    const confirmCancel = confirm("क्या आप सचमुच यह बुकिंग रद्द (Cancel) करना चाहते हैं?\n\nएस्क्रो में रखा गया आपका 100% पैसा तुरंत आपके वॉलेट में रिफंड हो जाएगा।");
    if (!confirmCancel) return;
    
    try {
        const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/cancel`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.id, reason: "Cancelled by user" })
        });
        
        const data = await res.json();
        if (res.ok) {
            playAudioSound("COIN");
            alert(`🎉 ${data.message}\n(New Wallet Balance: ₹${data.new_balance})`);
            await loadMyBookings();
            await loadUserWallet();
            await loadListings();
            await loadHubSummary();
        } else {
            alert(data.detail || "Cancellation failed");
        }
    } catch (err) {
        console.error("Cancel booking error:", err);
    }
}

// 29. DRIVER RESPOND TO CUSTOM BARGAIN
async function handleRespondBargain(bookingId, decision) {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/respond-bargain`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ driver_id: currentUser.id, decision: decision })
        });
        
        const data = await res.json();
        if (res.ok) {
            playAudioSound(decision === "ACCEPT" ? "CHIME" : "DING");
            alert(data.message);
            await loadMyBookings();
            await loadUserWallet();
        } else {
            alert(data.detail || "Response failed");
        }
    } catch (err) {
        console.error("Respond bargain error:", err);
    }
}

async function verifyOTP(bookingId, stage) {
    const input = document.getElementById(`otp-input-${bookingId}`);
    const otpVal = input.value.trim();
    if (!otpVal) {
        alert("Please enter the 4-digit OTP.");
        return;
    }
    const endpoint = stage === 'handover' ? '/api/bookings/verify-handover' : '/api/bookings/verify-completion';
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booking_id: bookingId, otp: otpVal })
        });
        const data = await res.json();
        if (res.ok) {
            playAudioSound(stage === 'handover' ? "CHIME" : "COIN");
            alert(`🎉 ${data.message}`);
            await loadMyBookings();
            await loadUserWallet();
            await loadUsers();
            if (stage === 'completion') {
                openRatingModal(bookingId);
            }
        }
    } catch (err) {
        console.error("Verification error:", err);
    }
}

// 30. POST TRIP, AUTO-CATEGORY LOCK & ROLE TOGGLE
function openPostModal() {
    document.getElementById("postModal").classList.add("open");
    initDepartureDateTime();
    
    // Auto-select category if inside dedicated section
    if (currentCategory && currentCategory !== "ALL") {
        document.getElementById("newServiceCategory").value = currentCategory;
    }
    
    // Auto-select role based on current intent door
    let defaultRole = "OFFER";
    if (currentCategory === "DRIVER_MATCH") {
        defaultRole = (currentIntentDoor === "DOOR_1") ? "OFFER" : "REQUEST";
    } else if (currentCategory === "RIDE_SHARE") {
        defaultRole = (currentIntentDoor === "DOOR_1") ? "REQUEST" : "OFFER";
    } else if (currentCategory === "PARCEL" || currentCategory === "CARGO") {
        defaultRole = (currentIntentDoor === "DOOR_1") ? "REQUEST" : "OFFER";
    }
    
    selectPostRole(defaultRole);
    handleModalScopeChange();

    // 🪄 SMART AUTO-FILL FROM USER PROFILE (FAST & OPTIONAL)
    const autofillBadge = document.getElementById("postAutoFillNotice");
    if (currentUser) {
        let hasAutofilled = false;

        // 1. Pre-fill Driver DL & details
        const dlInput = document.getElementById("driverDlInput");
        if (dlInput && currentUser.dl_number && !dlInput.value) {
            dlInput.value = currentUser.dl_number;
            hasAutofilled = true;
        }

        // 2. Pre-fill Vehicle Name & Number
        const vehNameInput = document.getElementById("postVehicleName");
        if (vehNameInput && currentUser.vehicle_name && !vehNameInput.value) {
            vehNameInput.value = currentUser.vehicle_name;
            hasAutofilled = true;
        }
        const vehNumInput = document.getElementById("postVehicleNumber");
        if (vehNumInput && currentUser.vehicle_number && !vehNumInput.value) {
            vehNumInput.value = currentUser.vehicle_number;
            hasAutofilled = true;
        }

        // 3. Pre-fill Owner Car Model
        const ownerCarInput = document.getElementById("ownerCarModelInput");
        if (ownerCarInput && currentUser.vehicle_name && !ownerCarInput.value) {
            ownerCarInput.value = currentUser.vehicle_name;
            hasAutofilled = true;
        }

        // 4. Pre-fill Vehicle Mode
        const vehModeSelect = document.getElementById("newVehicleMode");
        if (vehModeSelect && currentUser.vehicle_type) {
            vehModeSelect.value = currentUser.vehicle_type;
        }

        if (autofillBadge) {
            autofillBadge.style.display = hasAutofilled ? "flex" : "none";
        }
    } else {
        if (autofillBadge) autofillBadge.style.display = "none";
    }
}

function closePostModal() {
    document.getElementById("postModal").classList.remove("open");
}

function handleModalScopeChange() {
    const scope = document.getElementById("newTripScope").value;
    if (scope === "INTRA_CITY") {
        document.getElementById("lblFrom").textContent = "From Colony / Area (कहाँ से):";
        document.getElementById("lblTo").textContent = "To Colony / Area (कहाँ तक):";
        document.getElementById("newSource").placeholder = "e.g. Kolar Road / MP Nagar";
        document.getElementById("newDestination").placeholder = "e.g. Arera Hills / Bairagarh";
    } else {
        document.getElementById("lblFrom").textContent = "From City (प्रस्थान शहर):";
        document.getElementById("lblTo").textContent = "To City (गंतव्य शहर):";
        document.getElementById("newSource").placeholder = "e.g. Bhopal (ISBT)";
        document.getElementById("newDestination").placeholder = "e.g. Indore (Vijay Nagar)";
    }
    handleModalCategoryChange();
}

function handleModalCategoryChange() {
    const cat = document.getElementById("newServiceCategory").value;
    const type = document.querySelector('input[name="modalListingType"]:checked').value;
    const isHi = (currentLang === "HI");
    
    const roleTitleOffer = document.getElementById("roleTitleOffer");
    const roleDescOffer = document.getElementById("roleDescOffer");
    const roleTitleReq = document.getElementById("roleTitleRequest");
    const roleDescReq = document.getElementById("roleDescRequest");
    
    const driverSec = document.getElementById("driverAvailableSection");
    const carOwnerSec = document.getElementById("carOwnerDriverNeedSection");
    const cargoSec = document.getElementById("cargoMaterialSection");
    const vehSec = document.getElementById("vehicleDetailsSection");
    const imgLabel = document.getElementById("txtImageUploadTitle");
    const priceLabel = document.getElementById("lblPrice");
    const modeGroup = document.getElementById("vehicleModeGroup");
    
    driverSec.style.display = "none";
    carOwnerSec.style.display = "none";
    cargoSec.style.display = "none";
    vehSec.style.display = "none";
    
    if (cat === "DRIVER_MATCH") {
        roleTitleOffer.textContent = isHi ? "👨✈️ मैं ड्राइवर हूँ — काम चाहिए (गाड़ी नहीं है)" : "👨✈️ I am a Driver (Offering Service)";
        roleDescOffer.textContent = isHi ? "ड्राइविंग लाइसेंस है, आपकी गाड़ी चला सकता हूँ" : "Have License, Can Drive Your Car";
        
        roleTitleReq.textContent = isHi ? "🚗 मेरी गाड़ी है — ड्राइवर चाहिए" : "🚗 I Have a Car (Need Driver)";
        roleDescReq.textContent = isHi ? "अपनी गाड़ी चलाने हेतु वेरीफाइड ड्राइवर हायर करें" : "Hire a Verified Driver for My Car";
        
        document.getElementById("seatsGroup").style.display = "none";
        document.getElementById("weightGroup").style.display = "none";
        document.getElementById("volumetricCalculatorSection").style.display = "none";
        
        if (type === "OFFER") {
            driverSec.style.display = "block";
            modeGroup.style.display = "none";
            priceLabel.textContent = isHi ? "अपेक्षित ड्राइविंग मानदेय / मजदूरी (₹):" : "Expected Driver Wage (₹):";
            imgLabel.textContent = isHi ? "ड्राइवर की प्रोफ़ाइल / लाइसेंस फोटो (Driver Photo):" : "Driver Profile / License Photo:";
            if (currentUser && currentUser.dl_number) {
                document.getElementById("driverDlInput").value = currentUser.dl_number;
            }
        } else {
            carOwnerSec.style.display = "block";
            modeGroup.style.display = "block";
            priceLabel.textContent = isHi ? "ड्राइवर को दिया जाने वाला मानदेय (₹):" : "Offered Driver Wage (₹):";
            imgLabel.textContent = isHi ? "मेरी गाड़ी की फोटो (Car Photo):" : "Car Photo:";
        }
        
    } else if (cat === "RIDE_SHARE") {
        roleTitleOffer.textContent = isHi ? "🚗 मेरी गाड़ी में खाली सीट है" : "🚗 Offering Empty Seats";
        roleDescOffer.textContent = isHi ? "पेट्रोल का खर्च बांटने हेतु खाली सीट शेयर करें" : "Share Fuel Cost with Commuters";
        
        roleTitleReq.textContent = isHi ? "💺 मुझे जाने के लिए सीट / सवारी चाहिए" : "💺 Seeking a Seat / Ride";
        roleDescReq.textContent = isHi ? "सफ़र के लिए कार या बाइक में सीट ढूंढें" : "Find a Seat in Car or Bike";
        
        modeGroup.style.display = "block";
        document.getElementById("seatsGroup").style.display = "block";
        document.getElementById("weightGroup").style.display = "none";
        document.getElementById("volumetricCalculatorSection").style.display = "none";
        
        priceLabel.textContent = isHi ? "प्रति सीट किराया (Per Seat Fare ₹):" : "Price Per Seat (₹):";
        
        if (type === "OFFER") {
            vehSec.style.display = "block";
            imgLabel.textContent = isHi ? "गाड़ी / कार की फोटो (Vehicle Photo):" : "Vehicle Photo:";
        } else {
            imgLabel.textContent = isHi ? "फोटो (Optional):" : "Photo (Optional):";
        }
        
    } else if (cat === "PARCEL") {
        roleTitleOffer.textContent = isHi ? "🛵 मैं जा रहा हूँ — रास्ते में पार्सल ले जाऊंगा" : "🛵 Traveling & Can Carry Parcel";
        roleDescOffer.textContent = isHi ? "रास्ते में पार्सल पहुंचाकर अतिरिक्त कमाई करें" : "Earn Extra by Delivering Packages";
        
        roleTitleReq.textContent = isHi ? "📦 मुझे पार्सल / सामान भेजना है" : "📦 Need Parcel Delivered";
        roleDescReq.textContent = isHi ? "टिफिन, दवाइयां या ज़रूरी सामान भेजें" : "Send Tiffin, Medicines, Urgent Items";
        
        modeGroup.style.display = "block";
        document.getElementById("seatsGroup").style.display = "none";
        document.getElementById("weightGroup").style.display = "block";
        document.getElementById("volumetricCalculatorSection").style.display = "block";
        
        priceLabel.textContent = isHi ? "पार्सल डिलीवरी शुल्क (Delivery Fee ₹):" : "Parcel Delivery Fee (₹):";
        
        if (type === "REQUEST") {
            cargoSec.style.display = "block";
            imgLabel.textContent = isHi ? "पार्सल / सामान की फोटो (Parcel Photo):" : "Parcel Photo:";
        } else {
            vehSec.style.display = "block";
            imgLabel.textContent = isHi ? "वाहन की फोटो (Vehicle Photo):" : "Vehicle Photo:";
        }
        
    } else if (cat === "CARGO") {
        roleTitleOffer.textContent = isHi ? "🚚 मेरा छोटा हाथी / ट्रक खाली जा रहा है" : "🚚 Empty Return Truck Available";
        roleDescOffer.textContent = isHi ? "खाली ट्रक में लोडिंग क्षमता ऑफर करें" : "Offer Empty Return Loading Capacity";
        
        roleTitleReq.textContent = isHi ? "📦 मुझे दुकान / फैक्ट्री का माल भेजना है" : "📦 Need Cargo Transport";
        roleDescReq.textContent = isHi ? "कमर्शियल सामान, बक्से व भारी माल भेजें" : "Ship Commercial Boxes, Goods & Loads";
        
        modeGroup.style.display = "block";
        document.getElementById("seatsGroup").style.display = "none";
        document.getElementById("weightGroup").style.display = "block";
        document.getElementById("volumetricCalculatorSection").style.display = "block";
        
        priceLabel.textContent = isHi ? "माल भाड़ा / किराया (Freight Rate ₹):" : "Freight Rate (₹):";
        
        if (type === "REQUEST") {
            cargoSec.style.display = "block";
            imgLabel.textContent = isHi ? "माल / लोड की फोटो (Cargo Photo):" : "Cargo Photo:";
        } else {
            vehSec.style.display = "block";
            imgLabel.textContent = isHi ? "लोडिंग गाड़ी की फोटो (Truck Photo):" : "Truck Photo:";
        }
    }
    
    calculateSmartFareLive();
}

async function handleImageSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
        const res = await fetch(`${API_BASE}/api/upload`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById("newImageUrl").value = data.url;
            updateImagePreview(data.url);
            playAudioSound("DING");
        }
    } catch (err) {
        console.error("Upload error:", err);
    }
}

function updateImagePreview(url) {
    const container = document.getElementById("imagePreviewContainer");
    const img = document.getElementById("imagePreviewImg");
    if (url && url.trim() !== "") {
        img.src = url;
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
}

async function handleCreateOffering(e) {
    e.preventDefault();
    if (!currentUser) {
        alert("Please login first.");
        openAuthModal();
        return;
    }
    
    const cat = document.getElementById("newServiceCategory").value;
    const type = document.querySelector('input[name="modalListingType"]:checked').value;
    const scope = document.getElementById("newTripScope").value;
    const vmode = document.getElementById("newVehicleMode").value || "CAR";
    
    const rawDate = document.getElementById("newDepartureDate").value;
    const rawTime = document.getElementById("newDepartureTime").value;
    
    let formattedDateTime = "Today, Flexible";
    if (rawDate && rawTime) {
        const [yyyy, mm, dd] = rawDate.split("-");
        const [hh, min] = rawTime.split(":");
        const hourNum = parseInt(hh);
        const ampm = hourNum >= 12 ? "PM" : "AM";
        const hour12 = hourNum % 12 || 12;
        formattedDateTime = `${dd}/${mm}/${yyyy}, ${String(hour12).padStart(2, '0')}:${min} ${ampm}`;
    }
    
    let extraNotes = document.getElementById("newDescription").value.trim();
    
    if (cat === "DRIVER_MATCH") {
        if (type === "OFFER") {
            const exp = document.getElementById("driverExpInput").value.trim() || "5+ Years Experience";
            const trans = document.getElementById("driverTransmissionSelect").value;
            const dl = document.getElementById("driverDlInput").value.trim();
            extraNotes = `[Driver Profile: ${exp} | Gear: ${trans} | DL: ${dl || 'Verified'}] ` + extraNotes;
        } else {
            const carModel = document.getElementById("ownerCarModelInput").value.trim() || "Private Car";
            const carTrans = document.getElementById("ownerCarTransmissionSelect").value;
            extraNotes = `[Car Owner: ${carModel} (${carTrans})] ` + extraNotes;
        }
    } else if (type === "REQUEST" && document.getElementById("cargoMaterialType").value.trim()) {
        extraNotes = `[Material: ${document.getElementById("cargoMaterialType").value.trim()}] ` + extraNotes;
    } else if (type === "OFFER" && document.getElementById("postVehicleName").value.trim()) {
        extraNotes = `[Vehicle: ${document.getElementById("postVehicleName").value.trim()}] ` + extraNotes;
    }
    
    const payload = {
        creator_id: currentUser.id, service_category: cat, listing_type: type,
        trip_scope: scope, vehicle_mode: (cat === "DRIVER_MATCH" && type === "OFFER") ? "DRIVER" : vmode,
        city_name: "Bhopal",
        source_city: document.getElementById("newSource").value, destination_city: document.getElementById("newDestination").value,
        departure_time: formattedDateTime, price: parseFloat(document.getElementById("newPrice").value) || 0,
        allow_bargain: document.getElementById("newAllowBargain").checked, image_url: document.getElementById("newImageUrl").value,
        available_seats: (cat === "RIDE_SHARE") ? (parseInt(document.getElementById("newSeats").value) || 1) : 0,
        available_weight_kg: (cat === "PARCEL" || cat === "CARGO") ? (parseFloat(document.getElementById("newWeight").value) || 1) : 0,
        description: extraNotes, driver_needed: (cat === "DRIVER_MATCH" && type === "REQUEST"),
        is_return_trip: (cat === "CARGO" && type === "OFFER")
    };
    
    try {
        const res = await fetch(`${API_BASE}/api/trips/create`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        const data = await res.json();
        closePostModal();
        playAudioSound("CHIME");
        await loadListings();
        await loadMyCreatedTrips();
        await loadHubSummary();
        navigateToTailoredMatches(payload, data.matches);
    } catch (err) {
        console.error("Post error:", err);
    }
}

// ==========================================
// 33. DYNAMIC QR CODE GENERATOR & SCANNER
// ==========================================
let html5QrScannerInstance = null;

function openQRCodeDisplayModal(bookingId, otpCode, type = 'HANDOVER', sealCode = '') {
    const title = type === 'HANDOVER' ? 'Handover Verification QR' : 'Delivery Completion QR';
    const sub = type === 'HANDOVER' ? 'ड्राइवर को यात्रा शुरू करने हेतु यह QR कोड दिखाएं:' : 'डिलीवरी पूरी होने पर ड्राइवर को यह QR कोड दिखाएं:';
    
    document.getElementById("qrModalTitle").textContent = title;
    document.getElementById("qrModalSubtitle").textContent = sub;
    document.getElementById("qrFallbackOtpCode").textContent = otpCode;
    
    const sealBox = document.getElementById("qrSealBox");
    if (sealCode && sealCode !== 'None') {
        sealBox.style.display = "block";
        document.getElementById("qrSealCodeVal").textContent = sealCode;
    } else {
        sealBox.style.display = "none";
    }
    
    const container = document.getElementById("qrCodeCanvasContainer");
    container.innerHTML = "";
    
    const qrPayload = JSON.stringify({
        booking_id: bookingId,
        otp: otpCode,
        type: type,
        seal_code: sealCode || ""
    });
    
    try {
        if (typeof QRCode !== 'undefined') {
            new QRCode(container, {
                text: qrPayload,
                width: 190,
                height: 190,
                colorDark: "#0f172a",
                colorLight: "#f8fafc",
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            container.innerHTML = `<div style="font-size:2.5rem;">📱</div><div style="font-size:0.75rem; color:#64748b;">OTP Code: ${otpCode}</div>`;
        }
    } catch (err) {
        console.error("QR generation error:", err);
        container.innerHTML = `<div style="font-size:0.8rem; color:#dc2626;">Error rendering QR: ${otpCode}</div>`;
    }
    
    document.getElementById("qrCodeDisplayModal").classList.add("open");
    playAudioSound("DING");
}

function closeQRCodeDisplayModal() {
    document.getElementById("qrCodeDisplayModal").classList.remove("open");
}

async function openQRScannerModal(bookingId) {
    document.getElementById("qrScannerTitle").textContent = `Scan QR Code for Booking #${bookingId}`;
    document.getElementById("qrScanStatusMsg").textContent = "📷 कैमरा सक्रिय किया जा रहा है...";
    document.getElementById("qrScannerModal").classList.add("open");
    
    setTimeout(() => {
        startHtml5QrScanner(bookingId);
    }, 300);
}

function startHtml5QrScanner(bookingId) {
    const readerDiv = document.getElementById("qrReaderViewfinder");
    readerDiv.innerHTML = "";
    
    if (typeof Html5Qrcode === 'undefined') {
        document.getElementById("qrScanStatusMsg").innerHTML = "⚠️ स्कैनर लाइब्रेरी लोड नहीं हुई। कृपया नीचे OTP भरें।";
        return;
    }
    
    try {
        html5QrScannerInstance = new Html5Qrcode("qrReaderViewfinder");
        html5QrScannerInstance.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 220, height: 220 }
            },
            async (decodedText, decodedResult) => {
                console.log("Scanned QR Code:", decodedText);
                playAudioSound("COIN");
                document.getElementById("qrScanStatusMsg").innerHTML = "🟢 QR कोड स्कैन हो गया! सत्यापन जारी है...";
                
                await handleScannedQrPayload(bookingId, decodedText);
            },
            (errorMessage) => {
                // scanning frame ignored
            }
        ).catch(err => {
            console.warn("Camera start error:", err);
            document.getElementById("qrScanStatusMsg").innerHTML = `<span style="color:#ef4444;">⚠️ कैमरा अनुमति नहीं मिली। कृपया मैन्युअल OTP दर्ज करें।</span>`;
        });
    } catch (e) {
        console.error("Scanner exception:", e);
    }
}

async function handleScannedQrPayload(bookingId, qrPayload) {
    try {
        const res = await fetch(`${API_BASE}/api/bookings/verify-qr`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                booking_id: bookingId,
                qr_payload: qrPayload,
                scanner_user_id: currentUser ? currentUser.id : null
            })
        });
        
        const data = await res.json();
        closeQRScannerModal();
        
        if (res.ok) {
            playAudioSound("CHIME");
            alert(`✅ ${data.message}`);
            await loadMyBookings();
            await loadUserWallet();
            await loadListings();
            await loadHubSummary();
        } else {
            alert(data.detail || "QR verification failed.");
        }
    } catch (err) {
        console.error("QR verify request error:", err);
        closeQRScannerModal();
        alert("Verification error. Please enter manual OTP.");
    }
}

function closeQRScannerModal() {
    document.getElementById("qrScannerModal").classList.remove("open");
    if (html5QrScannerInstance) {
        try {
            html5QrScannerInstance.stop().then(() => {
                html5QrScannerInstance.clear();
                html5QrScannerInstance = null;
            }).catch(err => console.warn("Error stopping scanner:", err));
        } catch (e) {
            html5QrScannerInstance = null;
        }
    }
}



// ========================================================
// 📱 WHATSAPP TRIP SHARING, SOS SAFETY & QUICK ROUTE CHIPS
// ========================================================

function shareTripOnWhatsApp(bookingItem) {
    if (!bookingItem) {
        if (activeTrackingTripId) {
            shareLiveTripFromModal();
            return;
        }
        showToast("No active booking selected for sharing.", "INFO");
        return;
    }
    
    const b = bookingItem.booking || bookingItem;
    const t = bookingItem.trip || {};
    const driverName = t.creator ? t.creator.full_name : "Driver";
    const driverPhone = t.creator ? t.creator.phone_number : "";
    const vehicleNum = t.vehicle ? t.vehicle.vehicle_number : "MP-04-XX-0000";
    const routeTitle = `${t.source_city || 'Origin'} ➔ ${t.destination_city || 'Destination'}`;
    const trackingLink = `${window.location.origin}/?track_trip=${t.id || b.trip_id || 1}`;

    const text = `🚗 *GatiConnect Live Journey Tracking*\n` +
                 `📍 *Route:* ${routeTitle}\n` +
                 `👨‍✈️ *Driver:* ${driverName} (+91 ${driverPhone})\n` +
                 `🚘 *Vehicle:* ${vehicleNum}\n` +
                 `💰 *Fare:* ₹${b.final_price || 0} (Escrow Protected 🛡️)\n` +
                 `🔗 *Live GPS Map:* ${trackingLink}\n\n` +
                 `_Track my real-time journey safely on GatiConnect._`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareLiveTripFromModal() {
    const routeTitle = document.getElementById("trackTripRouteTitle") ? document.getElementById("trackTripRouteTitle").textContent.trim() : "Live Route";
    const driverName = document.getElementById("trackDriverName") ? document.getElementById("trackDriverName").textContent.trim() : "Driver";
    const etaVal = document.getElementById("trackEtaVal") ? document.getElementById("trackEtaVal").textContent.trim() : "En Route";
    const speedVal = document.getElementById("trackSpeedVal") ? document.getElementById("trackSpeedVal").textContent.trim() : "45 km/h";
    const trackingLink = `${window.location.origin}/?track_trip=${activeTrackingTripId || 1}`;

    const text = `🚗 *GatiConnect Live GPS Tracking*\n` +
                 `📍 *Route:* ${routeTitle}\n` +
                 `👨‍✈️ *Driver:* ${driverName}\n` +
                 `⚡ *Speed / ETA:* ${speedVal} | ${etaVal}\n` +
                 `🛡️ *Status:* On-Road & Escrow Protected\n` +
                 `🔗 *Live Map Tracking Link:* ${trackingLink}\n\n` +
                 `_Sharing live location for safety._`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function quickFilterHubRoute(fromCity, toCity) {
    navigateToCategory('RIDE_SHARE');
    const fromInput = document.getElementById("searchInputFrom");
    const toInput = document.getElementById("searchInputTo");
    if (fromInput) fromInput.value = fromCity;
    if (toInput) toInput.value = toCity;
    filterListings();
    showToast(`Filtering rides: ${fromCity} ➔ ${toCity}`, "INFO");
}
