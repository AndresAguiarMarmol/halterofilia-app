document.addEventListener("DOMContentLoaded", () => {
      const KG_TO_LBS = 2.20462;
      const MASTER_SALT = "Halterofilia-SuperSecret-Salt-2026";
      const TRIAL_DAYS = 7;
      const TRIAL_DURATION_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000; // 604,800,000 ms (7 días)

      // 1. Movimientos olímpicos
      const movements = [
        "Snatch", "Clean & Jerk", "Power Snatch", "Power Clean",
        "Hang Snatch", "Hang Clean", "Push Jerk", "Split Jerk",
        "Back Squat", "Front Squat", "Thrusters"
      ];
      let currentMoveIndex = 0;
      const step1Screen = document.getElementById("step1Screen");
      const step2Screen = document.getElementById("step2Screen");

      // 2. Inventario de discos oficiales (Metadatos y configuración física)
      const OFFICIAL_PLATES_META = [
        { id: "lb45", name: "45 lb", weightKg: 45 / KG_TO_LBS, weightLb: 45, unit: "lb", cssClass: "plate-45lb", defaultColor: "#374151", height: 85, width: 14 },
        { id: "lb35", name: "35 lb", weightKg: 35 / KG_TO_LBS, weightLb: 35, unit: "lb", cssClass: "plate-35lb", defaultColor: "#374151", height: 85, width: 12 },
        { id: "lb25", name: "25 lb", weightKg: 25 / KG_TO_LBS, weightLb: 25, unit: "lb", cssClass: "plate-25lb", defaultColor: "#374151", height: 75, width: 10 },
        { id: "lb15", name: "15 lb", weightKg: 15 / KG_TO_LBS, weightLb: 15, unit: "lb", cssClass: "plate-15lb", defaultColor: "#374151", height: 65, width: 9 },
        { id: "lb10", name: "10 lb", weightKg: 10 / KG_TO_LBS, weightLb: 10, unit: "lb", cssClass: "plate-10lb", defaultColor: "#374151", height: 60, width: 8 },
        { id: "kg25", name: "25 kg", weightKg: 25, weightLb: 25 * KG_TO_LBS, unit: "kg", cssClass: "plate-25kg", defaultColor: "#dc2626", height: 90, width: 15 },
        { id: "kg20", name: "20 kg", weightKg: 20, weightLb: 20 * KG_TO_LBS, unit: "kg", cssClass: "plate-20kg", defaultColor: "#2563eb", height: 90, width: 13 },
        { id: "kg15", name: "15 kg", weightKg: 15, weightLb: 15 * KG_TO_LBS, unit: "kg", cssClass: "plate-15kg", defaultColor: "#eab308", height: 80, width: 11 },
        { id: "kg10", name: "10 kg", weightKg: 10, weightLb: 10 * KG_TO_LBS, unit: "kg", cssClass: "plate-10kg", defaultColor: "#16a34a", height: 70, width: 9 },
        { id: "kg5", name: "5 kg", weightKg: 5, weightLb: 5 * KG_TO_LBS, unit: "kg", cssClass: "plate-5kg", defaultColor: "#f8fafc", height: 55, width: 8 },
        { id: "kg2_5", name: "2.5 kg", weightKg: 2.5, weightLb: 2.5 * KG_TO_LBS, unit: "kg", cssClass: "plate-2_5kg", defaultColor: "#dc2626", height: 46, width: 7 },
        { id: "kg2_0", name: "2.0 kg", weightKg: 2.0, weightLb: 2.0 * KG_TO_LBS, unit: "kg", cssClass: "plate-2kg", defaultColor: "#3b82f6", height: 42, width: 7 },
        { id: "kg1_5", name: "1.5 kg", weightKg: 1.5, weightLb: 1.5 * KG_TO_LBS, unit: "kg", cssClass: "plate-1_5kg", defaultColor: "#facc15", height: 38, width: 6 },
        { id: "kg1_0", name: "1.00 kg", weightKg: 1.0, weightLb: 1.0 * KG_TO_LBS, unit: "kg", cssClass: "plate-1kg", defaultColor: "#22c55e", height: 34, width: 6 },
        { id: "kg0_5", name: "0.5 kg", weightKg: 0.5, weightLb: 0.5 * KG_TO_LBS, unit: "kg", cssClass: "plate-0_5kg", defaultColor: "#f1f5f9", height: 30, width: 5 }
      ];

      function getContrastColor(hexColor) {
        if (!hexColor || hexColor.length < 6) return "#ffffff";
        const hex = hexColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        const luminance = (r * 299 + g * 587 + b * 114) / 1000;
        return luminance > 145 ? "#0f172a" : "#ffffff";
      }

      function getBorderColor(hexColor) {
        if (!hexColor || hexColor.length < 6) return "#334155";
        const hex = hexColor.replace("#", "");
        const r = Math.max(0, (parseInt(hex.substring(0, 2), 16) || 0) - 35);
        const g = Math.max(0, (parseInt(hex.substring(2, 4), 16) || 0) - 35);
        const b = Math.max(0, (parseInt(hex.substring(4, 6), 16) || 0) - 35);
        return `rgb(${r}, ${g}, ${b})`;
      }

      const basePlates = OFFICIAL_PLATES_META.map(p => ({
        ...p,
        active: true,
        customColor: p.defaultColor
      }));

      // 3. Centros de entrenamiento
      function createDefaultPlatesConfig(category) {
        const conf = {};
        OFFICIAL_PLATES_META.forEach(p => {
          let available = true;
          if (category === "lbs" && p.unit !== "lb") available = false;
          if (category === "kg" && p.unit !== "kg") available = false;
          conf[p.id] = {
            available: available,
            color: p.defaultColor
          };
        });
        return conf;
      }

      const DEFAULT_CENTERS = [
        {
          id: "box_central",
          name: "Box CrossFit Central",
          address: "Av. Providencia 1234, Santiago",
          phone: "+56 9 8765 4321",
          category: "both",
          plates: createDefaultPlatesConfig("both")
        },
        {
          id: "garage_gym",
          name: "Garage Gym Pro",
          address: "Calle Los Robles 452, Santiago",
          phone: "+56 9 9123 4567",
          category: "lbs",
          plates: createDefaultPlatesConfig("lbs")
        },
        {
          id: "halterofilia_club",
          name: "Halterofilia Club",
          address: "Centro de Alto Rendimiento, Ñuñoa",
          phone: "+56 9 7654 3210",
          category: "kg",
          plates: createDefaultPlatesConfig("kg")
        }
      ];

      function getAllCenters() {
        const s = localStorage.getItem("halterofilia_centers_v2");
        if (s) {
          try {
            const list = JSON.parse(s);
            if (Array.isArray(list) && list.length > 0) return list;
          } catch (e) {}
        }
        saveAllCenters(DEFAULT_CENTERS);
        return DEFAULT_CENTERS;
      }

      function saveAllCenters(list) {
        localStorage.setItem("halterofilia_centers_v2", JSON.stringify(list));
      }

      // 4. Perfiles de atletas
      function getAthletes() {
        const a = localStorage.getItem("halterofilia_athletes");
        return a ? JSON.parse(a) : [];
      }
      function saveAthletes(list) {
        localStorage.setItem("halterofilia_athletes", JSON.stringify(list));
      }
      function getActiveAthleteId() {
        return localStorage.getItem("halterofilia_active_athlete_id");
      }
      function setActiveAthleteId(id) {
        localStorage.setItem("halterofilia_active_athlete_id", id);
      }

      function getAthleteUnit(athleteId) {
        if (!athleteId) athleteId = getActiveAthleteId();
        const stored = localStorage.getItem("halterofilia_athlete_unit_" + athleteId);
        return stored || "kg";
      }

      function setAthleteUnit(athleteId, unit) {
        if (!athleteId) athleteId = getActiveAthleteId();
        localStorage.setItem("halterofilia_athlete_unit_" + athleteId, unit);
      }

      function convertWeight(value, fromUnit, toUnit) {
        if (!value || isNaN(value)) return value;
        const fromIsLbs = (fromUnit === "lbs");
        const toIsLbs = (toUnit === "lbs");
        if (fromIsLbs === toIsLbs) return value;

        if (!fromIsLbs && toIsLbs) {
          // kg (o mixto) -> lbs
          return Math.round((value * KG_TO_LBS) * 10) / 10;
        } else if (fromIsLbs && !toIsLbs) {
          // lbs -> kg (o mixto)
          return Math.round((value / KG_TO_LBS) * 10) / 10;
        }
        return value;
      }

      function convertAthleteUnit(athleteId, fromUnit, toUnit) {
        if (!athleteId) athleteId = getActiveAthleteId();
        const fromIsLbs = (fromUnit === "lbs");
        const toIsLbs = (toUnit === "lbs");
        if (fromIsLbs === toIsLbs) {
          setAthleteUnit(athleteId, toUnit);
          return;
        }

        // 1. Convertir PRs actuales del atleta
        const allPRs = JSON.parse(localStorage.getItem("halterofilia_prs_by_athlete") || "{}");
        if (!allPRs[athleteId]) {
          allPRs[athleteId] = {};
          movements.forEach(m => {
            const defKg = (m === "Thrusters" ? 80 : 100);
            allPRs[athleteId][m] = !fromIsLbs ? defKg : Math.round((defKg * KG_TO_LBS) * 10) / 10;
          });
        }
        const updatedPRs = {};
        Object.keys(allPRs[athleteId]).forEach(m => {
          const val = allPRs[athleteId][m];
          updatedPRs[m] = convertWeight(val, fromUnit, toUnit);
        });
        allPRs[athleteId] = updatedPRs;
        localStorage.setItem("halterofilia_prs_by_athlete", JSON.stringify(allPRs));

        // 2. Convertir el historial de PRs para mantener coherencia en gráficas y tablas
        const histMap = JSON.parse(localStorage.getItem("halterofilia_pr_history") || "{}");
        if (histMap[athleteId] && Array.isArray(histMap[athleteId])) {
          histMap[athleteId].forEach(item => {
            if (typeof item.value === "number") {
              item.value = convertWeight(item.value, fromUnit, toUnit);
            }
          });
          localStorage.setItem("halterofilia_pr_history", JSON.stringify(histMap));
        }

        // 3. Persistir la nueva unidad oficial del atleta
        setAthleteUnit(athleteId, toUnit);
      }

      function getAthletePRs(athleteId) {
        const all = localStorage.getItem("halterofilia_prs_by_athlete");
        const map = all ? JSON.parse(all) : {};
        if (!map[athleteId]) {
          map[athleteId] = {};
        }
        const athUnit = getAthleteUnit(athleteId);
        movements.forEach(m => {
          if (map[athleteId][m] === undefined) {
            const defKg = (m === "Thrusters" ? 80 : 100);
            map[athleteId][m] = (athUnit === "lbs" ? Math.round((defKg * KG_TO_LBS) * 10) / 10 : defKg);
          }
        });
        return map[athleteId];
      }

      function getAthletePRHistory(athleteId) {
        const all = localStorage.getItem("halterofilia_pr_history");
        const histMap = all ? JSON.parse(all) : {};
        if (!histMap[athleteId] || !Array.isArray(histMap[athleteId]) || histMap[athleteId].length === 0) {
          const currentPRs = getAthletePRs(athleteId);
          const initial = [];
          const now = new Date();
          const d1 = new Date(now.getTime() - 40 * 86400000).toISOString().split('T')[0];
          const d2 = new Date(now.getTime() - 20 * 86400000).toISOString().split('T')[0];
          const d3 = now.toISOString().split('T')[0];

          movements.forEach(m => {
            const current = currentPRs[m] || (selectedUnit === "kg" ? 100 : 220.5);
            const startVal = Math.max(10, Math.round(current * 0.88 * 10) / 10);
            const midVal = Math.max(10, Math.round(current * 0.95 * 10) / 10);
            initial.push({ movement: m, value: startVal, date: d1 });
            initial.push({ movement: m, value: midVal, date: d2 });
            initial.push({ movement: m, value: current, date: d3 });
          });
          histMap[athleteId] = initial;
          localStorage.setItem("halterofilia_pr_history", JSON.stringify(histMap));
        }
        return histMap[athleteId];
      }

      function saveAthletePR(athleteId, movement, value, customDate) {
        const all = localStorage.getItem("halterofilia_prs_by_athlete");
        const map = all ? JSON.parse(all) : {};
        if (!map[athleteId]) map[athleteId] = {};
        map[athleteId][movement] = value;
        localStorage.setItem("halterofilia_prs_by_athlete", JSON.stringify(map));
        setAthleteUnit(athleteId, selectedUnit);

        const histMap = JSON.parse(localStorage.getItem("halterofilia_pr_history") || "{}");
        if (!histMap[athleteId]) histMap[athleteId] = [];
        const date = customDate || new Date().toISOString().split('T')[0];
        const existIdx = histMap[athleteId].findIndex(e => e.movement === movement && e.date === date);
        if (existIdx >= 0) {
          histMap[athleteId][existIdx].value = value;
        } else {
          histMap[athleteId].push({ movement, value, date });
        }
        histMap[athleteId].sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem("halterofilia_pr_history", JSON.stringify(histMap));
      }

      function saveAllAthletePRs(athleteId, updatedPRs) {
        const all = localStorage.getItem("halterofilia_prs_by_athlete");
        const map = all ? JSON.parse(all) : {};
        if (!map[athleteId]) map[athleteId] = {};
        const oldPRs = { ...map[athleteId] };
        map[athleteId] = { ...map[athleteId], ...updatedPRs };
        localStorage.setItem("halterofilia_prs_by_athlete", JSON.stringify(map));
        setAthleteUnit(athleteId, selectedUnit);

        const histMap = JSON.parse(localStorage.getItem("halterofilia_pr_history") || "{}");
        if (!histMap[athleteId]) histMap[athleteId] = [];
        const today = new Date().toISOString().split('T')[0];

        Object.keys(updatedPRs).forEach(m => {
          const newVal = updatedPRs[m];
          if (oldPRs[m] !== newVal) {
            const existIdx = histMap[athleteId].findIndex(e => e.movement === m && e.date === today);
            if (existIdx >= 0) {
              histMap[athleteId][existIdx].value = newVal;
            } else {
              histMap[athleteId].push({ movement: m, value: newVal, date: today });
            }
          }
        });
        histMap[athleteId].sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem("halterofilia_pr_history", JSON.stringify(histMap));
      }

      // 5. Criptografía y Device ID
      function getOrCreateDeviceId() {
        let devId = localStorage.getItem("halterofilia_device_id");
        if (!devId) {
          devId = "DEV-" + Math.random().toString(36).substring(2, 9).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
          localStorage.setItem("halterofilia_device_id", devId);
        }
        return devId;
      }

      async function sha256(str) {
        const buffer = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest("SHA-256", buffer);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
      }

      // Integridad contra manipulación local
      function getInstallDate() {
        const raw = localStorage.getItem("halterofilia_install_date");
        if (!raw) return 0;
        const sig = localStorage.getItem("halterofilia_install_sig");
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
          hash = ((hash << 5) - hash) + raw.charCodeAt(i) + 0x5a7f;
          hash |= 0;
        }
        const expectedSig = Math.abs(hash).toString(16);
        if (sig && sig !== expectedSig) {
          return 1; // Manipulado manualmente: fuerza expiración inmediata
        }
        return parseInt(raw, 10);
      }

      function setInstallDate(val) {
        const strVal = val.toString();
        let hash = 0;
        for (let i = 0; i < strVal.length; i++) {
          hash = ((hash << 5) - hash) + strVal.charCodeAt(i) + 0x5a7f;
          hash |= 0;
        }
        localStorage.setItem("halterofilia_install_date", strVal);
        localStorage.setItem("halterofilia_install_sig", Math.abs(hash).toString(16));
      }

      // 6. Validación de Trial y Licencia
      function checkLicenseStatus() {
        const installDate = getInstallDate();
        const licenseToken = localStorage.getItem("halterofilia_license_token");
        const lockBanner = document.getElementById("licenseLockBanner");

        const devId = getOrCreateDeviceId();
        const athletes = getAthletes();
        const activeId = getActiveAthleteId();
        const currentAthlete = athletes.find(a => a.id === activeId) || athletes[0];
        const email = currentAthlete ? currentAthlete.email : "atleta@halterofilia.com";
        const reqCode = `REQ|${devId}|${email}`;

        document.getElementById("modalReqCode").value = reqCode;
        document.getElementById("lockReqCode").value = reqCode;

        if (licenseToken) {
          try {
            const data = JSON.parse(atob(licenseToken));
            const expTime = data.expiryDate || data.exp;
            if (expTime && Date.now() < expTime) {
              lockBanner.style.display = "none";
              document.getElementById("licenseStatusText").innerText = "Licencia Activa ✅";
              document.getElementById("licenseExpiryText").innerText = "Vence: " + new Date(expTime).toLocaleDateString();
              return true;
            }
          } catch (e) { }
        }

        const now = Date.now();
        if (installDate > 0 && (now - installDate > TRIAL_DURATION_MS)) {
          lockBanner.style.display = "flex";
          document.getElementById("licenseStatusText").innerText = "Trial Expirado ❌";
          document.getElementById("licenseExpiryText").innerText = "Contactar al +56933395447";
          return false;
        } else {
          lockBanner.style.display = "none";
          const remainingDays = installDate > 0
            ? Math.max(0, Math.ceil((TRIAL_DURATION_MS - (now - installDate)) / (1000 * 60 * 60 * 24)))
            : TRIAL_DAYS;
          document.getElementById("licenseStatusText").innerText = `Trial Activo (${remainingDays} días restantes)`;
          return true;
        }
      }

      async function verifyAndApplyToken(tokenStr) {
        try {
          const payload = JSON.parse(atob(tokenStr.trim()));
          const expTime = payload.expiryDate || payload.exp;
          const raw1 = `${payload.deviceId}|${payload.email}|${payload.expiryDate}|${MASTER_SALT}`;
          const raw2 = `${payload.deviceId}|${payload.email}|${payload.exp}|${MASTER_SALT}`;
          const sig1 = await sha256(raw1);
          const sig2 = await sha256(raw2);

          if (payload.signature !== sig1 && payload.signature !== sig2) {
            alert("Error: Firma inválida.");
            return false;
          }

          if (Date.now() > expTime) {
            alert("Error: Token caducado.");
            return false;
          }

          localStorage.setItem("halterofilia_license_token", tokenStr.trim());
          alert("¡Licencia activada con éxito!");
          checkLicenseStatus();
          return true;
        } catch (e) {
          alert("Error: Clave corrupta o inválida.");
          return false;
        }
      }

      // Estado de sesión
      let selectedCenterId = DEFAULT_CENTERS[0].id;
      let selectedUnit = "kg";
      let selectedBar = "men";
      let currentPercentage = 80;
      let generatedSolutions = [];

      // 7. Gestión de Perfiles de Atletas y Fotos
      function compressImageFile(file, maxDim, callback) {
        if (!file || !file.type.startsWith('image/')) return callback(null);
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            callback(dataUrl);
          };
          img.onerror = function() { callback(null); };
          img.src = e.target.result;
        };
        reader.onerror = function() { callback(null); };
        reader.readAsDataURL(file);
      }

      let currentNewAthletePhoto = null;
      let currentInstallPhoto = null;
      let cameraStream = null;
      let currentCameraTarget = null; // 'newAthlete' o 'install'
      let currentFacingMode = 'user'; // 'user' (selfie frontal) o 'environment' (trasera)
      let capturedSnapshotData = null;

      // Elementos del Modal de Cámara
      const cameraCaptureModal = document.getElementById("cameraCaptureModal");
      const cameraVideo = document.getElementById("cameraVideo");
      const cameraCanvas = document.getElementById("cameraCanvas");
      const cameraSnapshotPreview = document.getElementById("cameraSnapshotPreview");
      const cameraOverlayCrosshair = document.getElementById("cameraOverlayCrosshair");
      const cameraLiveControls = document.getElementById("cameraLiveControls");
      const cameraPreviewControls = document.getElementById("cameraPreviewControls");
      const cameraStatusMsg = document.getElementById("cameraStatusMsg");
      const btnCloseCameraModal = document.getElementById("btnCloseCameraModal");
      const btnSwitchCamera = document.getElementById("btnSwitchCamera");
      const btnCapturePhoto = document.getElementById("btnCapturePhoto");
      const btnRetakePhoto = document.getElementById("btnRetakePhoto");
      const btnAcceptPhoto = document.getElementById("btnAcceptPhoto");

      // Función para apagar y liberar la cámara
      function stopCamera() {
        if (cameraStream) {
          try {
            cameraStream.getTracks().forEach(track => track.stop());
          } catch(e) {}
          cameraStream = null;
        }
        if (cameraVideo) cameraVideo.srcObject = null;
      }

      // Iniciar cámara en vivo con visor
      async function startCamera(target) {
        currentCameraTarget = target;
        capturedSnapshotData = null;

        if (!cameraCaptureModal || !cameraVideo) return;

        // Reset visual del modal
        cameraVideo.style.display = "block";
        if (cameraSnapshotPreview) cameraSnapshotPreview.style.display = "none";
        if (cameraOverlayCrosshair) cameraOverlayCrosshair.style.display = "block";
        if (cameraLiveControls) cameraLiveControls.style.display = "flex";
        if (cameraPreviewControls) cameraPreviewControls.style.display = "none";
        if (cameraStatusMsg) cameraStatusMsg.style.display = "none";

        cameraCaptureModal.classList.add("open");

        // Si el navegador no soporta MediaDevices (o contexto no seguro), fallback directo a cámara nativa
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          stopCamera();
          cameraCaptureModal.classList.remove("open");
          if (target === 'newAthlete') {
            document.getElementById("newAthleteCameraInput")?.click();
          } else {
            document.getElementById("installCameraInput")?.click();
          }
          return;
        }

        try {
          if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
          }

          const constraints = {
            video: {
              facingMode: currentFacingMode,
              width: { ideal: 640 },
              height: { ideal: 640 }
            },
            audio: false
          };

          cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
          cameraVideo.srcObject = cameraStream;
          await cameraVideo.play();

          // Ajustar efecto espejo según cámara frontal o trasera
          if (currentFacingMode === 'user') {
            cameraVideo.classList.remove("rear-camera");
          } else {
            cameraVideo.classList.add("rear-camera");
          }
        } catch (err) {
          console.warn("Fallo acceso a cámara en vivo, abriendo selector nativo:", err);
          if (cameraStatusMsg) {
            cameraStatusMsg.innerText = "Abriendo cámara nativa del dispositivo...";
            cameraStatusMsg.style.display = "block";
          }
          setTimeout(() => {
            stopCamera();
            cameraCaptureModal.classList.remove("open");
            if (target === 'newAthlete') {
              document.getElementById("newAthleteCameraInput")?.click();
            } else {
              document.getElementById("installCameraInput")?.click();
            }
          }, 450);
        }
      }

      // Tomar captura instantánea
      function takeSnapshot() {
        if (!cameraVideo || !cameraCanvas || !cameraVideo.videoWidth) return;

        const vw = cameraVideo.videoWidth;
        const vh = cameraVideo.videoHeight;
        const size = Math.min(vw, vh);
        const sx = (vw - size) / 2;
        const sy = (vh - size) / 2;

        const targetDim = 160;
        cameraCanvas.width = targetDim;
        cameraCanvas.height = targetDim;
        const ctx = cameraCanvas.getContext("2d");

        // Mantener espejo natural si es selfie
        if (currentFacingMode === 'user') {
          ctx.translate(targetDim, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(cameraVideo, sx, sy, size, size, 0, 0, targetDim, targetDim);
        capturedSnapshotData = cameraCanvas.toDataURL("image/jpeg", 0.85);

        if (cameraSnapshotPreview) {
          cameraSnapshotPreview.src = capturedSnapshotData;
          cameraSnapshotPreview.style.display = "block";
        }
        cameraVideo.style.display = "none";
        if (cameraOverlayCrosshair) cameraOverlayCrosshair.style.display = "none";
        if (cameraLiveControls) cameraLiveControls.style.display = "none";
        if (cameraPreviewControls) cameraPreviewControls.style.display = "flex";
      }

      function retakeSnapshot() {
        capturedSnapshotData = null;
        if (cameraSnapshotPreview) cameraSnapshotPreview.style.display = "none";
        if (cameraVideo) cameraVideo.style.display = "block";
        if (cameraOverlayCrosshair) cameraOverlayCrosshair.style.display = "block";
        if (cameraLiveControls) cameraLiveControls.style.display = "flex";
        if (cameraPreviewControls) cameraPreviewControls.style.display = "none";
      }

      function acceptSnapshot() {
        if (!capturedSnapshotData) return;

        if (currentCameraTarget === 'newAthlete') {
          currentNewAthletePhoto = capturedSnapshotData;
          const imgEl = document.getElementById("newAthletePhotoImg");
          const phEl = document.getElementById("newAthletePhotoPlaceholder");
          const rmBtn = document.getElementById("btnRemoveNewAthletePhoto");
          if (imgEl) { imgEl.src = capturedSnapshotData; imgEl.style.display = "block"; }
          if (phEl) phEl.style.display = "none";
          if (rmBtn) rmBtn.style.display = "inline-block";
        } else if (currentCameraTarget === 'install') {
          currentInstallPhoto = capturedSnapshotData;
          const imgEl = document.getElementById("installPhotoImg");
          const phEl = document.getElementById("installPhotoPlaceholder");
          const rmBtn = document.getElementById("btnRemoveInstallPhoto");
          if (imgEl) { imgEl.src = capturedSnapshotData; imgEl.style.display = "block"; }
          if (phEl) phEl.style.display = "none";
          if (rmBtn) rmBtn.style.display = "inline-block";
        }

        stopCamera();
        if (cameraCaptureModal) cameraCaptureModal.classList.remove("open");
      }

      // Eventos del modal de cámara
      if (btnCloseCameraModal) {
        btnCloseCameraModal.addEventListener("click", () => {
          stopCamera();
          cameraCaptureModal.classList.remove("open");
        });
      }
      if (btnCapturePhoto) btnCapturePhoto.addEventListener("click", takeSnapshot);
      if (btnRetakePhoto) btnRetakePhoto.addEventListener("click", retakeSnapshot);
      if (btnAcceptPhoto) btnAcceptPhoto.addEventListener("click", acceptSnapshot);
      if (btnSwitchCamera) {
        btnSwitchCamera.addEventListener("click", () => {
          currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
          startCamera(currentCameraTarget);
        });
      }

      // Configurar eventos de foto / cámara en modal de nuevo atleta
      const newPhotoInput = document.getElementById("newAthletePhotoInput");
      const newCameraInput = document.getElementById("newAthleteCameraInput");
      const btnCameraNewPhoto = document.getElementById("btnCameraNewAthletePhoto");
      const btnUploadNewPhoto = document.getElementById("btnUploadNewAthletePhoto");
      const btnRemoveNewPhoto = document.getElementById("btnRemoveNewAthletePhoto");
      const newPhotoPreview = document.getElementById("newAthletePhotoPreview");
      const newPhotoImg = document.getElementById("newAthletePhotoImg");
      const newPhotoPlaceholder = document.getElementById("newAthletePhotoPlaceholder");

      if (btnCameraNewPhoto) {
        btnCameraNewPhoto.addEventListener("click", () => startCamera('newAthlete'));
      }
      if (newPhotoPreview) {
        newPhotoPreview.addEventListener("click", () => startCamera('newAthlete'));
      }
      if (btnUploadNewPhoto && newPhotoInput) {
        btnUploadNewPhoto.addEventListener("click", () => newPhotoInput.click());
      }
      if (newPhotoInput) {
        newPhotoInput.addEventListener("change", (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            compressImageFile(file, 160, (dataUrl) => {
              if (dataUrl) {
                currentNewAthletePhoto = dataUrl;
                if (newPhotoImg) { newPhotoImg.src = dataUrl; newPhotoImg.style.display = "block"; }
                if (newPhotoPlaceholder) newPhotoPlaceholder.style.display = "none";
                if (btnRemoveNewPhoto) btnRemoveNewPhoto.style.display = "inline-block";
              }
            });
          }
        });
      }
      if (newCameraInput) {
        newCameraInput.addEventListener("change", (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            compressImageFile(file, 160, (dataUrl) => {
              if (dataUrl) {
                currentNewAthletePhoto = dataUrl;
                if (newPhotoImg) { newPhotoImg.src = dataUrl; newPhotoImg.style.display = "block"; }
                if (newPhotoPlaceholder) newPhotoPlaceholder.style.display = "none";
                if (btnRemoveNewPhoto) btnRemoveNewPhoto.style.display = "inline-block";
              }
            });
          }
        });
      }
      if (btnRemoveNewPhoto) {
        btnRemoveNewPhoto.addEventListener("click", (e) => {
          e.stopPropagation();
          currentNewAthletePhoto = null;
          if (newPhotoInput) newPhotoInput.value = "";
          if (newCameraInput) newCameraInput.value = "";
          if (newPhotoImg) { newPhotoImg.src = ""; newPhotoImg.style.display = "none"; }
          if (newPhotoPlaceholder) newPhotoPlaceholder.style.display = "block";
          btnRemoveNewPhoto.style.display = "none";
        });
      }

      // Configurar eventos de foto / cámara en modal de instalación inicial
      const installPhotoInput = document.getElementById("installPhotoInput");
      const installCameraInput = document.getElementById("installCameraInput");
      const btnCameraInstallPhoto = document.getElementById("btnCameraInstallPhoto");
      const btnUploadInstallPhoto = document.getElementById("btnUploadInstallPhoto");
      const btnRemoveInstallPhoto = document.getElementById("btnRemoveInstallPhoto");
      const installPhotoPreview = document.getElementById("installPhotoPreview");
      const installPhotoImg = document.getElementById("installPhotoImg");
      const installPhotoPlaceholder = document.getElementById("installPhotoPlaceholder");

      if (btnCameraInstallPhoto) {
        btnCameraInstallPhoto.addEventListener("click", () => startCamera('install'));
      }
      if (installPhotoPreview) {
        installPhotoPreview.addEventListener("click", () => startCamera('install'));
      }
      if (btnUploadInstallPhoto && installPhotoInput) {
        btnUploadInstallPhoto.addEventListener("click", () => installPhotoInput.click());
      }
      if (installPhotoInput) {
        installPhotoInput.addEventListener("change", (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            compressImageFile(file, 160, (dataUrl) => {
              if (dataUrl) {
                currentInstallPhoto = dataUrl;
                if (installPhotoImg) { installPhotoImg.src = dataUrl; installPhotoImg.style.display = "block"; }
                if (installPhotoPlaceholder) installPhotoPlaceholder.style.display = "none";
                if (btnRemoveInstallPhoto) btnRemoveInstallPhoto.style.display = "inline-block";
              }
            });
          }
        });
      }
      if (installCameraInput) {
        installCameraInput.addEventListener("change", (e) => {
          const file = e.target.files && e.target.files[0];
          if (file) {
            compressImageFile(file, 160, (dataUrl) => {
              if (dataUrl) {
                currentInstallPhoto = dataUrl;
                if (installPhotoImg) { installPhotoImg.src = dataUrl; installPhotoImg.style.display = "block"; }
                if (installPhotoPlaceholder) installPhotoPlaceholder.style.display = "none";
                if (btnRemoveInstallPhoto) btnRemoveInstallPhoto.style.display = "inline-block";
              }
            });
          }
        });
      }
      if (btnRemoveInstallPhoto) {
        btnRemoveInstallPhoto.addEventListener("click", (e) => {
          e.stopPropagation();
          currentInstallPhoto = null;
          if (installPhotoInput) installPhotoInput.value = "";
          if (installCameraInput) installCameraInput.value = "";
          if (installPhotoImg) { installPhotoImg.src = ""; installPhotoImg.style.display = "none"; }
          if (installPhotoPlaceholder) installPhotoPlaceholder.style.display = "block";
          btnRemoveInstallPhoto.style.display = "none";
        });
      }

      function refreshAthleteHeader() {
        const athletes = getAthletes();
        const activeId = getActiveAthleteId();
        const cur = athletes.find(a => a.id === activeId);
        const labelEl = document.getElementById("currentAthleteLabel");
        const avatarEl = document.getElementById("currentAthleteAvatar");
        const iconEl = document.getElementById("currentAthleteAvatarIcon");

        if (cur) {
          const displayName = cur.firstName || cur.name.split(" ")[0] || "Atleta";
          if (labelEl) labelEl.innerText = displayName;
          if (cur.photo && avatarEl) {
            avatarEl.src = cur.photo;
            avatarEl.style.display = "inline-block";
            if (iconEl) iconEl.style.display = "none";
          } else {
            if (avatarEl) avatarEl.style.display = "none";
            if (iconEl) iconEl.style.display = "inline-block";
          }
        } else {
          if (labelEl) labelEl.innerText = "Atleta";
          if (avatarEl) avatarEl.style.display = "none";
          if (iconEl) iconEl.style.display = "inline-block";
        }
      }

      const athletesModal = document.getElementById("athletesModal");
      const athletesListContainer = document.getElementById("athletesListContainer");

      function renderAthletesList() {
        athletesListContainer.innerHTML = "";
        const athletes = getAthletes();
        const activeId = getActiveAthleteId();

        athletes.forEach(a => {
          const div = document.createElement("div");
          div.className = `selectable-item ${a.id === activeId ? 'active' : ''}`;
          
          const photoHtml = a.photo
            ? `<img src="${a.photo}" alt="${a.name}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-cyan); flex-shrink: 0;">`
            : `<div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(6,182,212,0.18); color: var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; border: 1px solid var(--card-border); flex-shrink: 0;">${(a.firstName || a.name || 'A').charAt(0).toUpperCase()}</div>`;

          div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
              ${photoHtml}
              <div style="flex: 1; min-width: 0;">
                <strong style="color: var(--text-main); font-size: 0.95rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${a.name}</strong>
                <small style="color: var(--text-muted); display: block; font-size: 0.78rem;">✉️ ${a.email || 'Sin correo'}</small>
                ${a.phone ? `<small style="color: var(--accent-cyan); display: block; font-size: 0.75rem; font-weight: 600;">📞 ${a.phone}</small>` : ''}
              </div>
              <div class="radio-circle" style="flex-shrink: 0;"></div>
            </div>
          `;
          div.addEventListener("click", () => {
            setActiveAthleteId(a.id);
            refreshAthleteHeader();
            renderAthletesList();

            // Sincronizar la unidad objetivo asociada a este atleta
            const athUnit = getAthleteUnit(a.id);
            selectedUnit = athUnit;
            document.querySelectorAll(".selectable-item[data-type='unit']").forEach(i => {
              i.classList.toggle("active", i.dataset.val === athUnit);
            });

            const badgeUnitEl = document.getElementById("badgeUnit");
            if (badgeUnitEl) badgeUnitEl.innerText = selectedUnit.toUpperCase();

            syncInventoryWithAthleteUnit(athUnit);
            renderInventory();
            updateMovementDisplay();
            calculateHybridLoad();
            athletesModal.classList.remove("open");
            // Atleta existente: entrar directamente al entrenamiento
            goToStep2();
          });
          athletesListContainer.appendChild(div);
        });
      }

      document.getElementById("btnSwitchAthlete").addEventListener("click", () => {
        renderAthletesList();
        athletesModal.classList.add("open");
      });
      document.getElementById("btnCloseAthletesModal").addEventListener("click", () => athletesModal.classList.remove("open"));

      document.getElementById("btnSaveNewAthlete").addEventListener("click", () => {
        const firstName = (document.getElementById("newAthleteFirstName")?.value || "").trim();
        const lastName = (document.getElementById("newAthleteLastName")?.value || "").trim();
        const email = (document.getElementById("newAthleteEmail")?.value || "").trim();
        const phone = (document.getElementById("newAthletePhone")?.value || "").trim();

        if (!firstName) return alert("Por favor ingresa al menos el Nombre del atleta.");
        if (!email) return alert("Por favor ingresa el Correo Electrónico.");

        const fullName = lastName ? `${firstName} ${lastName}` : firstName;
        const list = getAthletes();
        const newAth = {
          id: "ath_" + Date.now(),
          name: fullName,
          firstName,
          lastName,
          email,
          phone,
          photo: currentNewAthletePhoto || null
        };
        list.push(newAth);
        saveAthletes(list);
        setActiveAthleteId(newAth.id);
        const defUnit = selectedUnit || "kg";
        setAthleteUnit(newAth.id, defUnit);

        // Limpiar formulario y foto
        if (document.getElementById("newAthleteFirstName")) document.getElementById("newAthleteFirstName").value = "";
        if (document.getElementById("newAthleteLastName")) document.getElementById("newAthleteLastName").value = "";
        if (document.getElementById("newAthleteEmail")) document.getElementById("newAthleteEmail").value = "";
        if (document.getElementById("newAthletePhone")) document.getElementById("newAthletePhone").value = "";
        currentNewAthletePhoto = null;
        if (newPhotoImg) { newPhotoImg.src = ""; newPhotoImg.style.display = "none"; }
        if (newPhotoPlaceholder) newPhotoPlaceholder.style.display = "block";
        if (btnRemoveNewPhoto) btnRemoveNewPhoto.style.display = "none";
        if (newPhotoInput) newPhotoInput.value = "";

        refreshAthleteHeader();
        renderAthletesList();
        syncInventoryWithAthleteUnit(defUnit);
        updateMovementDisplay();
        calculateHybridLoad();

        // Al definirse el nuevo usuario, mostrar Parámetros de la Aplicación
        athletesModal.classList.remove("open");
        try { document.documentElement.classList.add("hp-user-exists"); } catch(e) {}
        goToStep1(true);
      });

      // 8. Instalación
      const installModal = document.getElementById("installModal");
      function userExists() {
        try {
          const athletes = getAthletes();
          if (!Array.isArray(athletes) || athletes.length === 0) return false;
          let activeId = getActiveAthleteId();
          if (!activeId || !athletes.some(a => a.id === activeId)) {
            activeId = athletes[0].id;
            setActiveAthleteId(activeId);
          }
          return true;
        } catch (e) {
          return false;
        }
      }

      function checkInstallation() {
        if (!userExists()) {
          installModal.classList.add("open");
          step1Screen.style.display = "none";
          step2Screen.style.display = "none";
          return false;
        }
        return true;
      }

      document.getElementById("btnConfirmInstall").addEventListener("click", () => {
        const fName = (document.getElementById("installFirstName")?.value || "").trim();
        const lName = (document.getElementById("installLastName")?.value || "").trim();
        const email = (document.getElementById("installEmail")?.value || "").trim();
        const phone = (document.getElementById("installPhone")?.value || "").trim();

        if (!fName) return alert("Por favor ingresa tu Nombre.");
        if (!email) return alert("Por favor ingresa tu Correo Electrónico.");

        const fullName = lName ? `${fName} ${lName}` : fName;
        const firstAthlete = {
          id: "ath_" + Date.now(),
          name: fullName,
          firstName: fName,
          lastName: lName,
          email,
          phone,
          photo: currentInstallPhoto || null
        };
        saveAthletes([firstAthlete]);
        setActiveAthleteId(firstAthlete.id);
        setAthleteUnit(firstAthlete.id, selectedUnit || "kg");
        localStorage.setItem("halterofilia_installed", "true");
        setInstallDate(Date.now());

        installModal.classList.remove("open");
        try { document.documentElement.classList.add("hp-user-exists"); } catch(e) {}
        refreshAthleteHeader();
        checkLicenseStatus();
        renderCenters();
        syncInventoryWithAthleteUnit(selectedUnit || "kg");
        // Al definirse el usuario por primera vez, mostrar Parámetros de la Aplicación
        goToStep1(true);
      });

      // 9. Centros de Entrenamiento
      const centersContainer = document.getElementById("centersContainer");
      let currentCenterCategory = "both";

      function syncInventoryWithAthleteUnit(unit) {
        const athPrefUnit = unit || getAthleteUnit(getActiveAthleteId()) || selectedUnit;
        const centers = getAllCenters();
        const center = centers.find(c => c.id === selectedCenterId) || centers[0];

        basePlates.forEach(plate => {
          const pConf = center.plates && center.plates[plate.id];
          let allowedByCat = true;
          if (center.category === "lbs") allowedByCat = (plate.unit === "lb");
          else if (center.category === "kg") allowedByCat = (plate.unit === "kg");

          const isAvail = pConf ? (pConf.available !== false) : true;

          let allowedByAthleteUnit = true;
          if (athPrefUnit === "kg") allowedByAthleteUnit = (plate.unit === "kg");
          else if (athPrefUnit === "lbs") allowedByAthleteUnit = (plate.unit === "lb");

          plate.active = allowedByCat && isAvail && allowedByAthleteUnit;
        });
      }

      function applyCenterMaterial(centerId) {
        const centers = getAllCenters();
        let center = centers.find(c => c.id === centerId);
        if (!center) {
          center = centers[0];
          selectedCenterId = center.id;
        }

        const athPrefUnit = getAthleteUnit(getActiveAthleteId()) || selectedUnit;

        basePlates.forEach(plate => {
          const pConf = center.plates && center.plates[plate.id];
          let allowedByCat = true;
          if (center.category === "lbs") allowedByCat = (plate.unit === "lb");
          else if (center.category === "kg") allowedByCat = (plate.unit === "kg");

          const isAvail = pConf ? (pConf.available !== false) : true;

          // Seleccionar solamente la unidad de medida preferida por el atleta:
          let allowedByAthleteUnit = true;
          if (athPrefUnit === "kg") allowedByAthleteUnit = (plate.unit === "kg");
          else if (athPrefUnit === "lbs") allowedByAthleteUnit = (plate.unit === "lb");

          plate.active = allowedByCat && isAvail && allowedByAthleteUnit;
          plate.customColor = (pConf && pConf.color) ? pConf.color : plate.defaultColor;
        });

        const badgeCenterName = document.getElementById("badgeCenterName");
        if (badgeCenterName) {
          badgeCenterName.innerText = center.name;
          badgeCenterName.title = `${center.name}\n📍 ${center.address || 'Sin dirección'}\n📞 ${center.phone || 'Sin teléfono'}`;
        }

        const badgeUnit = document.getElementById("badgeUnit");
        if (badgeUnit) {
          badgeUnit.innerText = selectedUnit.toUpperCase();
        }

        renderInventory();
        calculateHybridLoad();
      }

      function renderCenters() {
        if (!centersContainer) return;
        centersContainer.innerHTML = "";
        const centers = getAllCenters();
        if (!centers.some(c => c.id === selectedCenterId)) {
          selectedCenterId = centers[0].id;
        }

        centers.forEach(center => {
          const isActive = (center.id === selectedCenterId);
          const card = document.createElement("div");
          card.className = `center-card ${isActive ? 'active' : ''}`;

          const catName = center.category === "lbs" ? "Libras" : (center.category === "kg" ? "Kgs" : "Ambas");

          let activePlatesCount = 0;
          OFFICIAL_PLATES_META.forEach(p => {
            let allowed = true;
            if (center.category === "lbs") allowed = (p.unit === "lb");
            else if (center.category === "kg") allowed = (p.unit === "kg");
            const pConf = center.plates && center.plates[p.id];
            if (allowed && (!pConf || pConf.available !== false)) activePlatesCount++;
          });

          card.innerHTML = `
            <div class="center-card-header">
              <div class="center-title-row">
                <strong class="center-name">${center.name}</strong>
                <span class="center-badge-category">${catName}</span>
              </div>
              <div class="radio-circle"></div>
            </div>
            <div class="center-details-list">
              <div class="center-detail-item">📍 ${center.address || "Dirección no especificada"}</div>
              <div class="center-detail-item">📞 ${center.phone || "Teléfono no especificado"}</div>
              <div class="center-detail-item" style="color:var(--accent-cyan); font-weight:600;">
                🏋️ Discos disponibles: ${activePlatesCount} de 15
              </div>
            </div>
            <div class="center-actions-row">
              <button type="button" class="btn-center-action" data-edit-center="${center.id}">
                ✏️ Modificar
              </button>
              <button type="button" class="btn-center-action del" data-del-center="${center.id}">
                🗑️ Eliminar
              </button>
            </div>
          `;

          card.addEventListener("click", (e) => {
            const editBtn = e.target.closest("[data-edit-center]");
            const delBtn = e.target.closest("[data-del-center]");

            if (editBtn) {
              e.stopPropagation();
              openCenterEditor(editBtn.dataset.editCenter);
              return;
            }
            if (delBtn) {
              e.stopPropagation();
              deleteCenter(delBtn.dataset.delCenter);
              return;
            }

            selectedCenterId = center.id;
            renderCenters();
            applyCenterMaterial(selectedCenterId);
          });

          centersContainer.appendChild(card);
        });
      }

      function openCenterEditor(centerId) {
        const modal = document.getElementById("centerEditorModal");
        const titleEl = document.getElementById("centerEditorTitle");
        const hiddenId = document.getElementById("centerEditId");
        const nameInp = document.getElementById("centerFormName");
        const addrInp = document.getElementById("centerFormAddress");
        const phoneInp = document.getElementById("centerFormPhone");

        const centers = getAllCenters();
        let center = centerId ? centers.find(c => c.id === centerId) : null;

        if (center) {
          titleEl.innerText = "✏️ Modificar Centro de Entrenamiento";
          hiddenId.value = center.id;
          nameInp.value = center.name || "";
          addrInp.value = center.address || "";
          phoneInp.value = center.phone || "";
          currentCenterCategory = center.category || "both";
        } else {
          titleEl.innerText = "🏋️ Definir Nuevo Centro de Entrenamiento";
          hiddenId.value = "";
          nameInp.value = "";
          addrInp.value = "";
          phoneInp.value = "";
          currentCenterCategory = "both";
        }

        updateCategorySelectorUI();
        renderEditorPlates(center ? center.plates : null);
        modal.classList.add("open");
      }

      function updateCategorySelectorUI() {
        document.querySelectorAll("#centerCategoryGroup .btn-cat-option").forEach(btn => {
          btn.classList.toggle("active", btn.dataset.cat === currentCenterCategory);
        });

        const secLb = document.getElementById("sectionPlatesLb");
        const secKg = document.getElementById("sectionPlatesKg");

        if (secLb) secLb.classList.toggle("disabled-section", currentCenterCategory === "kg");
        if (secKg) secKg.classList.toggle("disabled-section", currentCenterCategory === "lbs");
      }

      function renderEditorPlates(existingPlates) {
        const gridLb = document.getElementById("editorPlatesGridLb");
        const gridKg = document.getElementById("editorPlatesGridKg");
        if (!gridLb || !gridKg) return;
        gridLb.innerHTML = "";
        gridKg.innerHTML = "";

        OFFICIAL_PLATES_META.forEach(p => {
          const pConf = existingPlates && existingPlates[p.id];
          let isAvailable = true;
          if (existingPlates) {
            isAvailable = pConf ? (pConf.available !== false) : true;
          } else {
            if (currentCenterCategory === "lbs" && p.unit !== "lb") isAvailable = false;
            if (currentCenterCategory === "kg" && p.unit !== "kg") isAvailable = false;
          }
          const currentColor = (pConf && pConf.color) ? pConf.color : p.defaultColor;

          const row = document.createElement("div");
          row.className = `plate-editor-row ${isAvailable ? '' : 'row-inactive'}`;
          row.id = `editor_row_${p.id}`;

          const contrastColor = getContrastColor(currentColor);

          row.innerHTML = `
            <label class="plate-editor-label">
              <input type="checkbox" class="plate-avail-check" data-plate-id="${p.id}" ${isAvailable ? 'checked' : ''}>
              <span class="plate-preview-pill" id="pill_${p.id}" style="background-color:${currentColor}; color:${contrastColor};">
                ${p.name}
              </span>
            </label>
            <div class="plate-color-control">
              <input type="color" class="plate-color-input" data-color-plate="${p.id}" value="${currentColor}" title="Elegir color para ${p.name}">
              <button type="button" class="btn-reset-color" data-reset-plate="${p.id}" title="Restablecer color predeterminado">↺</button>
            </div>
          `;

          const check = row.querySelector(".plate-avail-check");
          check.addEventListener("change", () => {
            row.classList.toggle("row-inactive", !check.checked);
          });

          const colorInp = row.querySelector(".plate-color-input");
          const pill = row.querySelector(".plate-preview-pill");
          colorInp.addEventListener("input", (e) => {
            const newCol = e.target.value;
            pill.style.backgroundColor = newCol;
            pill.style.color = getContrastColor(newCol);
          });

          const resetBtn = row.querySelector(".btn-reset-color");
          resetBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            colorInp.value = p.defaultColor;
            pill.style.backgroundColor = p.defaultColor;
            pill.style.color = getContrastColor(p.defaultColor);
          });

          if (p.unit === "lb") gridLb.appendChild(row);
          else gridKg.appendChild(row);
        });
      }

      function saveCenterFromEditor() {
        const nameInp = document.getElementById("centerFormName");
        const addrInp = document.getElementById("centerFormAddress");
        const phoneInp = document.getElementById("centerFormPhone");
        const hiddenId = document.getElementById("centerEditId");

        const name = nameInp.value.trim();
        if (!name) return alert("Por favor ingresa un nombre para el centro de entrenamiento.");

        const address = addrInp.value.trim();
        const phone = phoneInp.value.trim();
        const centerId = hiddenId.value;

        const platesConfig = {};
        OFFICIAL_PLATES_META.forEach(p => {
          const check = document.querySelector(`.plate-avail-check[data-plate-id="${p.id}"]`);
          const colorInp = document.querySelector(`.plate-color-input[data-color-plate="${p.id}"]`);
          platesConfig[p.id] = {
            available: check ? check.checked : true,
            color: colorInp ? colorInp.value : p.defaultColor
          };
        });

        const centers = getAllCenters();
        if (centerId) {
          const idx = centers.findIndex(c => c.id === centerId);
          if (idx >= 0) {
            centers[idx].name = name;
            centers[idx].address = address;
            centers[idx].phone = phone;
            centers[idx].category = currentCenterCategory;
            centers[idx].plates = platesConfig;
          }
        } else {
          const newCenter = {
            id: "center_" + Date.now(),
            name: name,
            address: address,
            phone: phone,
            category: currentCenterCategory,
            plates: platesConfig
          };
          centers.push(newCenter);
          selectedCenterId = newCenter.id;
        }

        saveAllCenters(centers);
        document.getElementById("centerEditorModal").classList.remove("open");
        renderCenters();
        applyCenterMaterial(selectedCenterId);
      }

      function deleteCenter(centerId) {
        const centers = getAllCenters();
        const center = centers.find(c => c.id === centerId);
        if (!center) return;

        if (centers.length <= 1) {
          return alert("Debe existir al menos un Centro de Entrenamiento en la aplicación.");
        }

        if (!confirm(`¿Estás seguro de eliminar el centro "${center.name}"?`)) {
          return;
        }

        const updated = centers.filter(c => c.id !== centerId);
        saveAllCenters(updated);

        if (selectedCenterId === centerId) {
          selectedCenterId = updated[0].id;
        }

        renderCenters();
        applyCenterMaterial(selectedCenterId);
      }

      document.getElementById("btnOpenAddCenter").addEventListener("click", () => {
        openCenterEditor(null);
      });

      document.getElementById("btnCloseCenterEditor").addEventListener("click", () => {
        document.getElementById("centerEditorModal").classList.remove("open");
      });

      document.getElementById("btnSaveCenterEditor").addEventListener("click", () => {
        saveCenterFromEditor();
      });

      document.querySelectorAll("#centerCategoryGroup .btn-cat-option").forEach(btn => {
        btn.addEventListener("click", () => {
          currentCenterCategory = btn.dataset.cat;
          updateCategorySelectorUI();
        });
      });

      document.querySelectorAll(".selectable-item[data-type='unit']").forEach(el => {
        el.addEventListener("click", () => {
          const newUnit = el.dataset.val;
          const prevUnit = selectedUnit;
          if (prevUnit === newUnit) return;

          document.querySelectorAll(".selectable-item[data-type='unit']").forEach(i => i.classList.remove("active"));
          el.classList.add("active");
          selectedUnit = newUnit;

          const activeId = getActiveAthleteId();
          if (activeId) {
            convertAthleteUnit(activeId, prevUnit, newUnit);
          }

          const badgeUnitEl = document.getElementById("badgeUnit");
          if (badgeUnitEl) badgeUnitEl.innerText = selectedUnit.toUpperCase();

          syncInventoryWithAthleteUnit(newUnit);
          renderInventory();
          updateMovementDisplay();
          calculateHybridLoad();
          if (document.getElementById("reportsModal") && document.getElementById("reportsModal").classList.contains("open")) {
            drawTemporalReportsChart();
          }
        });
      });

      document.querySelectorAll(".selectable-item[data-type='bar']").forEach(el => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".selectable-item[data-type='bar']").forEach(i => i.classList.remove("active"));
          el.classList.add("active");
          selectedBar = el.dataset.val;
        });
      });

      // 9.1 Control de Tema (Oscuro, Claro, Sistema)
      let selectedTheme = localStorage.getItem("halterofilia_theme_preference") || "system";

      function applyTheme(themeChoice) {
        selectedTheme = themeChoice;
        localStorage.setItem("halterofilia_theme_preference", themeChoice);

        let effectiveTheme = themeChoice;
        if (themeChoice === "system") {
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          effectiveTheme = isDark ? "dark" : "light";
        }

        document.documentElement.setAttribute("data-theme", effectiveTheme);
        document.body.className = `theme-${effectiveTheme} mode-${themeChoice}`;

        document.querySelectorAll(".selectable-item[data-type='theme']").forEach(i => {
          i.classList.toggle("active", i.dataset.val === themeChoice);
        });

        // Redibujar reporte si está abierto para ajustar colores de cuadrícula y contraste
        if (document.getElementById("reportsModal") && document.getElementById("reportsModal").classList.contains("open")) {
          drawTemporalReportsChart();
        }
      }

      document.querySelectorAll(".selectable-item[data-type='theme']").forEach(el => {
        el.addEventListener("click", () => {
          applyTheme(el.dataset.val);
        });
      });

      // Escucha reactiva en tiempo real al cambio de tema del sistema/teléfono
      const systemThemeMatcher = window.matchMedia("(prefers-color-scheme: dark)");
      systemThemeMatcher.addEventListener("change", () => {
        if (selectedTheme === "system") {
          applyTheme("system");
        }
      });

      // 10. Inventario
      const inventoryGrid = document.getElementById("inventoryGrid");
      function renderInventory() {
        inventoryGrid.innerHTML = "";
        const athPrefUnit = getAthleteUnit(getActiveAthleteId()) || selectedUnit;

        const invUnitBadge = document.getElementById("inventoryUnitBadge");
        if (invUnitBadge) {
          invUnitBadge.innerText = athPrefUnit.toUpperCase();
        }

        const platesToShow = basePlates.filter(plate => {
          if (athPrefUnit === "kg") return plate.unit === "kg";
          if (athPrefUnit === "lbs") return plate.unit === "lb";
          return true; // mixto
        });
        platesToShow.forEach(plate => {
          const chip = document.createElement("div");
          chip.className = `inv-chip ${plate.cssClass} ${plate.active ? '' : 'inactive'}`;
          const col = plate.customColor || plate.defaultColor;
          if (col) {
            chip.style.backgroundColor = col;
            chip.style.color = getContrastColor(col);
            chip.style.borderColor = getBorderColor(col);
          }
          chip.innerHTML = `${plate.name}<br><small style="color:inherit; opacity:0.85;">${plate.unit.toUpperCase()}</small>`;
          chip.addEventListener("click", () => {
            plate.active = !plate.active;
            renderInventory();
            calculateHybridLoad();
          });
          inventoryGrid.appendChild(chip);
        });
      }

      // 11. Navegación de Pasos

      function goToStep2() {
        if (!checkLicenseStatus()) return;
        step1Screen.style.display = "none";
        step2Screen.style.display = "block";

        const all = getAllCenters();
        const current = all.find(c => c.id === selectedCenterId) || all[0];

        document.getElementById("badgeCenterName").innerText = current ? current.name : "Centro";
        const badgeUnitEl = document.getElementById("badgeUnit");
        if (badgeUnitEl) {
          badgeUnitEl.innerText = selectedUnit.toUpperCase();
          if (!badgeUnitEl.dataset.hasListener) {
            badgeUnitEl.dataset.hasListener = "true";
            badgeUnitEl.style.cursor = "pointer";
            badgeUnitEl.title = "Toca para alternar entre KG, LBS y MIXTO";
            badgeUnitEl.addEventListener("click", () => {
              let nextUnit = "kg";
              if (selectedUnit === "kg") nextUnit = "lbs";
              else if (selectedUnit === "lbs") nextUnit = "mixto";
              else nextUnit = "kg";

              const btn = document.querySelector(`.selectable-item[data-type='unit'][data-val='${nextUnit}']`);
              if (btn) {
                btn.click();
              }
            });
          }
        }
        const athPrefUnit = getAthleteUnit(getActiveAthleteId()) || selectedUnit;
        selectedUnit = athPrefUnit;
        document.getElementById("badgeBar").innerText = selectedBar === "men" ? "Barra Olímpica 20kg" : "Barra Olímpica 15kg";

        updateMovementDisplay();
        applyCenterMaterial(selectedCenterId);
        syncInventoryWithAthleteUnit(athPrefUnit);
        renderInventory();
        calculateHybridLoad();
      }

      function goToStep1(isInitialSetup = false) {
        step2Screen.style.display = "none";
        step1Screen.style.display = "block";

        const titleEl = document.getElementById("paramsScreenTitle");
        const btnStart = document.getElementById("btnStartWorkout");

        if (titleEl) {
          titleEl.innerText = "⚙️ Parámetros de la Aplicación";
        }
        if (btnStart) {
          if (isInitialSetup) {
            btnStart.innerText = "Guardar Preferencias y Comenzar Entrenamiento ➔";
          } else {
            btnStart.innerText = "Guardar Preferencias y Volver al Entrenamiento ➔";
          }
        }
        renderCenters();
      }

      document.getElementById("btnStartWorkout").addEventListener("click", () => {
        localStorage.setItem("halterofilia_first_session_done", "true");
        const activeId = getActiveAthleteId();
        if (activeId) {
          localStorage.setItem("halterofilia_first_session_done_" + activeId, "true");
        }
        goToStep2();
      });

      document.getElementById("btnSwitchParams").addEventListener("click", () => goToStep1(false));
      document.getElementById("btnQuickEdit").addEventListener("click", () => goToStep1(false));

      // 12. Movimientos (Selector Desplegable)
      const movementSelect = document.getElementById("movementSelect");
      if (movementSelect) {
        movementSelect.innerHTML = "";
        movements.forEach((move, idx) => {
          const opt = document.createElement("option");
          opt.value = idx;
          opt.innerText = move;
          movementSelect.appendChild(opt);
        });
        movementSelect.addEventListener("change", (e) => {
          currentMoveIndex = parseInt(e.target.value, 10);
          updateMovementDisplay();
          calculateHybridLoad();
        });
      }

      function updateMovementDisplay() {
        const moveName = movements[currentMoveIndex];
        const activeId = getActiveAthleteId();
        const prs = getAthletePRs(activeId);
        const rawPR = prs[moveName] !== undefined ? prs[moveName] : (moveName === "Thrusters" ? 80 : 100);

        const activeTitleEl = document.getElementById("activeMoveTitle");
        if (activeTitleEl) activeTitleEl.innerText = moveName;

        const moveSelect = document.getElementById("movementSelect");
        if (moveSelect && moveSelect.value !== String(currentMoveIndex)) {
          moveSelect.value = String(currentMoveIndex);
        }

        const prEl = document.getElementById("activeMovePR");
        if (prEl) {
          if (selectedUnit === "mixto") {
            const prKg = Math.round(rawPR * 10) / 10;
            const prLb = Math.round(rawPR * KG_TO_LBS * 10) / 10;
            prEl.innerText = `PR: ${prKg} KG (${prLb} LBS)`;
          } else {
            prEl.innerText = `PR: ${rawPR} ${selectedUnit.toUpperCase()}`;
          }
        }
      }

      const btnPrevMove = document.getElementById("btnPrevMove");
      if (btnPrevMove) {
        btnPrevMove.addEventListener("click", () => {
          currentMoveIndex = (currentMoveIndex - 1 + movements.length) % movements.length;
          updateMovementDisplay();
          calculateHybridLoad();
        });
      }

      const btnNextMove = document.getElementById("btnNextMove");
      if (btnNextMove) {
        btnNextMove.addEventListener("click", () => {
          currentMoveIndex = (currentMoveIndex + 1) % movements.length;
          updateMovementDisplay();
          calculateHybridLoad();
        });
      }

      // 13. Porcentaje Slider y Entrada Manual de Peso
      const prSlider = document.getElementById("prSlider");
      if (prSlider) {
        prSlider.min = "40";
        prSlider.max = "120";
      }
      const pctLabel = document.getElementById("pctLabel");
      const quickChipsContainer = document.getElementById("quickChipsContainer");
      const targetWeightInput = document.getElementById("targetWeightInput");
      const targetWeightUnitLabel = document.getElementById("targetWeightUnitLabel");
      const percentages = [40, 50, 60, 70, 75, 80, 85, 90, 95, 100, 110, 120];

      percentages.forEach(pct => {
        const btn = document.createElement("button");
        btn.className = `chip-btn ${pct === currentPercentage ? 'active' : ''}`;
        btn.innerText = `${pct}%`;
        btn.addEventListener("click", () => {
          prSlider.value = pct;
          currentPercentage = pct;
          updateSliderUI();
          calculateHybridLoad();
        });
        quickChipsContainer.appendChild(btn);
      });

      function updateSliderUI() {
        pctLabel.innerText = `${currentPercentage}%`;
        document.querySelectorAll(".chip-btn").forEach(btn => {
          btn.classList.toggle("active", btn.innerText === `${currentPercentage}%`);
        });
      }

      prSlider.addEventListener("input", () => {
        currentPercentage = parseInt(prSlider.value, 10);
        updateSliderUI();
        calculateHybridLoad();
      });

      if (targetWeightInput) {
        targetWeightInput.addEventListener("input", () => {
          const val = parseFloat(targetWeightInput.value);
          if (!isNaN(val) && val >= 0) {
            calculateHybridLoad(val);
          }
        });
      }

      // =========================================================================
      // 14. ALGORITMO OPTIMIZADO (CERO CONGELAMIENTO + ALTERNATIVAS REALES)
      // =========================================================================
      function calculateHybridLoad(customTarget) {
        const activeId = getActiveAthleteId();
        const prs = getAthletePRs(activeId);
        const basePR = prs[movements[currentMoveIndex]] || 100;

        let targetTotal;
        if (customTarget !== undefined && !isNaN(customTarget)) {
          targetTotal = Math.max(0, parseFloat(customTarget));
          // Sincronizar porcentaje respecto al PR base
          currentPercentage = basePR > 0 ? Math.round((targetTotal / basePR) * 100) : 0;
          prSlider.value = Math.min(120, Math.max(40, currentPercentage));
          updateSliderUI();
        } else {
          targetTotal = basePR * (currentPercentage / 100);
          if (targetWeightInput && document.activeElement !== targetWeightInput) {
            targetWeightInput.value = targetTotal.toFixed(1);
          }
        }

        const isMixto = (selectedUnit === "mixto");

        if (targetWeightUnitLabel) {
          targetWeightUnitLabel.innerText = isMixto ? "kg" : selectedUnit;
        }

        const dualDisplay = document.getElementById("targetWeightDualDisplay");
        if (dualDisplay) {
          if (selectedUnit === "kg") {
            dualDisplay.innerHTML = `Equivalente: <strong>${(targetTotal * KG_TO_LBS).toFixed(1)} lbs</strong>`;
          } else if (selectedUnit === "lbs") {
            dualDisplay.innerHTML = `Equivalente: <strong>${(targetTotal / KG_TO_LBS).toFixed(1)} kg</strong>`;
          } else {
            dualDisplay.innerHTML = `Cálculo Mixto: <strong>${targetTotal.toFixed(1)} kg</strong> ⇄ <strong>${(targetTotal * KG_TO_LBS).toFixed(1)} lbs</strong>`;
          }
        }

        // Peso de la barra
        const barWeightKg = selectedBar === "men" ? 20 : 15;
        const barWeightInTarget = (selectedUnit === "kg" || isMixto) ? barWeightKg : (barWeightKg * KG_TO_LBS);

        const neededTotal = targetTotal - barWeightInTarget;
        const neededPerSide = neededTotal > 0 ? (neededTotal / 2) : 0;

        generatedSolutions = [];

        if (neededPerSide > 0.1) {
          // Filtrar estrictamente según la Unidad Objetivo elegida por el usuario:
          // Si es "kg", solamente discos en kg. Si es "lbs", solamente discos en lb. Si es "mixto", ambos.
          let available = basePlates.filter(p => {
            if (!p.active) return false;
            if (selectedUnit === "kg") return p.unit === "kg";
            if (selectedUnit === "lbs") return p.unit === "lb";
            return true; // mixto
          });

          // Fallback defensivo si el usuario desactivó manualmente todos los discos de la unidad
          if (available.length === 0) {
            available = basePlates.filter(p => {
              if (selectedUnit === "kg") return p.unit === "kg";
              if (selectedUnit === "lbs") return p.unit === "lb";
              return true;
            });
          }

          generatedSolutions = generateFastAlternatives(available, neededPerSide, selectedUnit);
        }

        renderAlternativesDropdown();
      }

      // Generador voraz determinista con múltiples estrategias
      function generateFastAlternatives(availablePlates, targetPerSide, unit) {
        const isMixto = (unit === "mixto");
        const calcUnit = isMixto ? "kg" : unit;
        const tolerance = calcUnit === "kg" ? 0.25 : 0.55;
        const solutions = [];
        const seenSignatures = new Set();

        function buildStrategy(filterFn, sortFn, titlePrefix) {
          let pool = availablePlates.filter(filterFn);
          if (pool.length === 0) return; // Si no hay discos para esta estrategia, no mezclar con discos no permitidos

          const prepared = pool.map(p => ({
            ref: p,
            weight: calcUnit === "kg" ? p.weightKg : p.weightLb
          })).sort(sortFn);

          let currentSum = 0;
          const combo = [];

          for (const item of prepared) {
            // Máximo 4 discos del mismo tipo por lado para realismo físico
            while (combo.filter(p => p.id === item.ref.id).length < 4 && (currentSum + item.weight <= targetPerSide + tolerance)) {
              combo.push(item.ref);
              currentSum += item.weight;
            }
          }

          // Solo aceptar la solución si tiene discos y alcanza el peso requerido dentro de la tolerancia
          if (combo.length > 0 && Math.abs(currentSum - targetPerSide) <= tolerance) {
            const sig = combo.map(p => p.id).sort().join("|");
            if (!seenSignatures.has(sig)) {
              seenSignatures.add(sig);
              let labelTotal = "";
              if (isMixto) {
                const totKg = (currentSum * 2).toFixed(1);
                const totLb = (currentSum * 2 * KG_TO_LBS).toFixed(1);
                labelTotal = `${totKg} kg / ${totLb} lb`;
              } else {
                labelTotal = `${(currentSum * 2).toFixed(1)} ${unit}`;
              }
              solutions.push({
                title: `${titlePrefix} (${labelTotal} en discos)`,
                plates: combo
              });
            }
          }
        }

        if (unit === "kg") {
          // Estrategias 100% exclusivas para Kilogramos (pesos únicamente en KG)
          buildStrategy(
            p => p.unit === "kg",
            (a, b) => b.weight - a.weight,
            "Opción 1 • Menor cantidad de discos (Estándar)"
          );

          buildStrategy(
            p => p.unit === "kg" && p.weightKg <= 20,
            (a, b) => b.weight - a.weight,
            "Opción 2 • Tope en discos de 20 kg / 15 kg"
          );

          buildStrategy(
            p => p.unit === "kg" && p.weightKg <= 15,
            (a, b) => b.weight - a.weight,
            "Opción 3 • Carga Progresiva / Fraccional"
          );

          buildStrategy(
            p => p.unit === "kg" && p.weightKg <= 10,
            (a, b) => b.weight - a.weight,
            "Opción 4 • Carga con discos medianos / pequeños"
          );
        } else if (unit === "lbs") {
          // Estrategias 100% exclusivas para Libras (pesos únicamente en LBS)
          buildStrategy(
            p => p.unit === "lb",
            (a, b) => b.weight - a.weight,
            "Opción 1 • Menor cantidad de discos (Estándar)"
          );

          buildStrategy(
            p => p.unit === "lb" && p.weightLb <= 35,
            (a, b) => b.weight - a.weight,
            "Opción 2 • Tope en discos de 35 lb / 25 lb"
          );

          buildStrategy(
            p => p.unit === "lb" && p.weightLb <= 25,
            (a, b) => b.weight - a.weight,
            "Opción 3 • Carga Progresiva / Fraccional"
          );

          buildStrategy(
            p => p.unit === "lb" && p.weightLb <= 15,
            (a, b) => b.weight - a.weight,
            "Opción 4 • Carga con discos livianos"
          );
        } else {
          // Modo Mixto (KG + LBS)
          buildStrategy(
            () => true,
            (a, b) => b.weight - a.weight,
            "Opción 1 • Híbrido Mixto (Menor cantidad de discos)"
          );

          buildStrategy(
            p => p.unit === "kg",
            (a, b) => b.weight - a.weight,
            "Opción 2 • Enfoque en Kilogramos"
          );

          buildStrategy(
            p => p.unit === "lb",
            (a, b) => b.weight - a.weight,
            "Opción 3 • Enfoque en Libras"
          );

          buildStrategy(
            p => p.weightKg <= 15,
            (a, b) => b.weight - a.weight,
            "Opción 4 • Carga Progresiva / Fraccional"
          );
        }

        // Si ninguna estrategia alcanzó la tolerancia estricta, ofrecer la mejor aproximación voraz con los discos permitidos
        if (solutions.length === 0 && availablePlates.length > 0) {
          const prepared = [...availablePlates].map(p => ({
            ref: p,
            weight: calcUnit === "kg" ? p.weightKg : p.weightLb
          })).sort((a, b) => b.weight - a.weight);

          let currentSum = 0;
          const combo = [];
          for (const item of prepared) {
            while (combo.filter(p => p.id === item.ref.id).length < 4 && (currentSum + item.weight <= targetPerSide + tolerance)) {
              combo.push(item.ref);
              currentSum += item.weight;
            }
          }
          if (combo.length > 0) {
            let labelTotal = "";
            if (isMixto) {
              const totKg = (currentSum * 2).toFixed(1);
              const totLb = (currentSum * 2 * KG_TO_LBS).toFixed(1);
              labelTotal = `${totKg} kg / ${totLb} lb`;
            } else {
              labelTotal = `${(currentSum * 2).toFixed(1)} ${unit}`;
            }
            solutions.push({
              title: `Opción 1 • Carga Aproximada (${labelTotal} en discos)`,
              plates: combo
            });
          }
        }

        return solutions;
      }

      const alternativesDropdown = document.getElementById("loadAlternativesDropdown");
      const solutionsCount = document.getElementById("solutionsCount");

      function renderAlternativesDropdown() {
        alternativesDropdown.innerHTML = "";
        solutionsCount.innerText = generatedSolutions.length;

        if (generatedSolutions.length === 0) {
          alternativesDropdown.innerHTML = `<option>Solo la barra (sin discos adicionales)</option>`;
          renderBarbell([]);
          return;
        }

        generatedSolutions.forEach((sol, idx) => {
          const opt = document.createElement("option");
          opt.value = idx;
          opt.innerText = sol.title;
          alternativesDropdown.appendChild(opt);
        });

        renderBarbell(generatedSolutions[0].plates);
      }

      alternativesDropdown.addEventListener("change", (e) => {
        const sol = generatedSolutions[e.target.value];
        if (sol) renderBarbell(sol.plates);
      });

      function renderBarbell(sidePlates) {
        const leftBox = document.getElementById("leftPlates");
        const rightBox = document.getElementById("rightPlates");
        leftBox.innerHTML = "";
        rightBox.innerHTML = "";

        // Orden de la barra: discos más grandes adentro (junto al collar)
        const ordered = [...sidePlates].sort((a, b) => {
          const wA = selectedUnit === "kg" ? a.weightKg : a.weightLb;
          const wB = selectedUnit === "kg" ? b.weightKg : b.weightLb;
          return wB - wA;
        });

        // Lado izquierdo
        const leftDisplay = [...ordered].reverse();
        leftDisplay.forEach(plate => {
          const elL = document.createElement("div");
          elL.className = `plate-visual ${plate.cssClass}`;
          elL.style.height = `${plate.height}px`;
          elL.style.width = `${plate.width}px`;
          const col = plate.customColor || plate.defaultColor;
          if (col) {
            elL.style.backgroundColor = col;
            elL.style.color = getContrastColor(col);
            elL.style.borderColor = getBorderColor(col);
          }
          elL.innerText = plate.name;
          leftBox.appendChild(elL);
        });

        // Lado derecho
        ordered.forEach(plate => {
          const elR = document.createElement("div");
          elR.className = `plate-visual ${plate.cssClass}`;
          elR.style.height = `${plate.height}px`;
          elR.style.width = `${plate.width}px`;
          const col = plate.customColor || plate.defaultColor;
          if (col) {
            elR.style.backgroundColor = col;
            elR.style.color = getContrastColor(col);
            elR.style.borderColor = getBorderColor(col);
          }
          elR.innerText = plate.name;
          rightBox.appendChild(elR);
        });
      }

      // 15. PRs (Formato Browse Editable)
      const prModal = document.getElementById("prModal");
      const prBrowseTableBody = document.getElementById("prBrowseTableBody");
      const prModalAthleteName = document.getElementById("prModalAthleteName");
      const prBrowseUnitHeader = document.getElementById("prBrowseUnitHeader");

      document.getElementById("btnOpenPRModal").addEventListener("click", () => {
        const athletes = getAthletes();
        const cur = athletes.find(a => a.id === getActiveAthleteId());
        if (prModalAthleteName) prModalAthleteName.innerText = cur ? cur.name : "Atleta";
        if (prBrowseUnitHeader) {
          prBrowseUnitHeader.innerText = selectedUnit === "mixto" ? "KG (Equivalente LBS)" : selectedUnit.toUpperCase();
        }

        const prs = getAthletePRs(getActiveAthleteId());
        prBrowseTableBody.innerHTML = "";

        movements.forEach(m => {
          const val = prs[m] !== undefined ? prs[m] : (selectedUnit === "lbs" ? (m === "Thrusters" ? 176.4 : 220.5) : (m === "Thrusters" ? 80 : 100));
          const tr = document.createElement("tr");

          let unitTag = selectedUnit.toUpperCase();
          let equivSub = "";
          if (selectedUnit === "mixto") {
            unitTag = "KG";
            const equiv = (val * KG_TO_LBS).toFixed(1);
            equivSub = `<br><small style="color:var(--text-muted); font-size:0.68rem;">≈ ${equiv} LBS</small>`;
          }

          tr.innerHTML = `
            <td>
              <strong class="pr-discipline-name">${m}</strong>
            </td>
            <td style="text-align: right;">
              <input type="number" step="0.1" class="pr-input-cell" data-movement="${m}" value="${val}">
              <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 4px;">${unitTag}</span>
              ${equivSub}
            </td>
          `;
          prBrowseTableBody.appendChild(tr);
        });

        prModal.classList.add("open");
      });

      document.getElementById("btnClosePRModal").addEventListener("click", () => prModal.classList.remove("open"));

      document.getElementById("btnSavePR").addEventListener("click", () => {
        const inputs = prBrowseTableBody.querySelectorAll(".pr-input-cell");
        const updated = {};
        let hasError = false;

        inputs.forEach(input => {
          const move = input.dataset.movement;
          const val = parseFloat(input.value);
          if (isNaN(val) || val <= 0) {
            hasError = true;
          } else {
            updated[move] = Math.round(val * 10) / 10;
          }
        });

        if (hasError) {
          return alert("Por favor, verifica que todos los valores de PR sean números válidos y mayores a 0.");
        }

        const activeId = getActiveAthleteId();
        saveAllAthletePRs(activeId, updated);
        setAthleteUnit(activeId, selectedUnit);
        prModal.classList.remove("open");
        updateMovementDisplay();
        calculateHybridLoad();
      });

      // 16. Licencia
      const licenseModal = document.getElementById("licenseModal");
      document.getElementById("btnOpenLicenseModal").addEventListener("click", () => {
        checkLicenseStatus();
        licenseModal.classList.add("open");
      });
      document.getElementById("btnCloseLicenseModal").addEventListener("click", () => licenseModal.classList.remove("open"));

      document.getElementById("btnActivateToken").addEventListener("click", async () => {
        const token = document.getElementById("activationTokenInput").value;
        if (!token) return alert("Pega la clave de activación.");
        const ok = await verifyAndApplyToken(token);
        if (ok) licenseModal.classList.remove("open");
      });

      document.getElementById("btnUnlockFromLock").addEventListener("click", async () => {
        const token = document.getElementById("lockActivationKey").value;
        if (!token) return alert("Pega la clave de activación.");
        await verifyAndApplyToken(token);
      });

      // 17. Reportes (Avance Temporal PR vs Tiempo)
      const reportsModal = document.getElementById("reportsModal");
      const prChartCanvas = document.getElementById("prChartCanvas");
      const reportMovementFilter = document.getElementById("reportMovementFilter");

      function initReportsFilters() {
        if (!reportMovementFilter) return;
        const previousVal = reportMovementFilter.value;
        reportMovementFilter.innerHTML = "";

        const optAll = document.createElement("option");
        optAll.value = "__all__";
        optAll.innerText = "⭐ Todas las Disciplinas (Comparativa)";
        reportMovementFilter.appendChild(optAll);

        movements.forEach(m => {
          const opt = document.createElement("option");
          opt.value = m;
          opt.innerText = `🏋️ ${m}`;
          reportMovementFilter.appendChild(opt);
        });

        if (previousVal && (previousVal === "__all__" || movements.includes(previousVal))) {
          reportMovementFilter.value = previousVal;
        } else {
          reportMovementFilter.value = movements[currentMoveIndex] || movements[0];
        }
      }

      if (reportMovementFilter) {
        reportMovementFilter.addEventListener("change", () => {
          drawTemporalReportsChart();
        });
      }

      function drawTemporalReportsChart() {
        if (!prChartCanvas) return;
        const ctx = prChartCanvas.getContext("2d");
        const w = prChartCanvas.width;
        const h = prChartCanvas.height;
        ctx.clearRect(0, 0, w, h);

        const activeId = getActiveAthleteId();
        const history = getAthletePRHistory(activeId);
        const selectedFilter = reportMovementFilter ? reportMovementFilter.value : movements[0];

        // Elementos de resumen
        const elInitial = document.getElementById("statInitialPR");
        const elCurrent = document.getElementById("statCurrentPR");
        const elProgress = document.getElementById("statProgressPR");
        const elLastDate = document.getElementById("statLastDate");
        const historyContainer = document.getElementById("reportHistoryTableContainer");

        const disciplinePalette = {
          "Snatch": "#06b6d4",
          "Clean & Jerk": "#f59e0b",
          "Thrusters": "#ec4899",
          "Power Snatch": "#38bdf8",
          "Power Clean": "#fb923c",
          "Hang Snatch": "#a855f7",
          "Hang Clean": "#a3e635",
          "Push Jerk": "#e879f9",
          "Split Jerk": "#f43f5e",
          "Back Squat": "#3b82f6",
          "Front Squat": "#10b981"
        };

        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const gridLineColor = isLight ? "#cbd5e1" : "#1e293b";
        const axisTextColor = isLight ? "#475569" : "#64748b";
        const pointTextColor = isLight ? "#0f172a" : "#ffffff";
        const pointBorderColor = isLight ? "#ffffff" : "#0f172a";
        const legendTextColor = isLight ? "#334155" : "#cbd5e1";

        if (selectedFilter !== "__all__") {
          // --- MODO DISCIPLINA INDIVIDUAL ---
          const items = history
            .filter(item => item.movement === selectedFilter)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          if (items.length === 0) {
            const curPR = getAthletePRs(activeId)[selectedFilter] || 100;
            items.push({ movement: selectedFilter, value: curPR, date: new Date().toISOString().split('T')[0] });
          }

          const initialVal = items[0].value;
          const currentVal = items[items.length - 1].value;
          const diff = currentVal - initialVal;
          const pctGain = initialVal > 0 ? ((diff / initialVal) * 100).toFixed(1) : 0;
          const diffSign = diff >= 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;

          if (elInitial) elInitial.innerText = `${initialVal.toFixed(1)} ${selectedUnit}`;
          if (elCurrent) elCurrent.innerText = `${currentVal.toFixed(1)} ${selectedUnit}`;
          if (elProgress) {
            elProgress.innerText = `${diffSign} ${selectedUnit} (${diff >= 0 ? '+' : ''}${pctGain}%)`;
            elProgress.style.color = diff >= 0 ? "#22c55e" : "#ef4444";
          }
          if (elLastDate) elLastDate.innerText = items[items.length - 1].date;

          // Dibujo gráfico de línea
          const paddingLeft = 45;
          const paddingRight = 30;
          const paddingTop = 25;
          const paddingBottom = 35;
          const plotW = w - paddingLeft - paddingRight;
          const plotH = h - paddingTop - paddingBottom;

          const values = items.map(d => d.value);
          const rawMin = Math.min(...values);
          const rawMax = Math.max(...values);
          const range = (rawMax - rawMin) || (rawMin * 0.2) || 10;
          const yMin = Math.max(0, Math.floor((rawMin - range * 0.15) / 5) * 5);
          const yMax = Math.ceil((rawMax + range * 0.2) / 5) * 5;

          // Líneas guía horizontales
          ctx.strokeStyle = gridLineColor;
          ctx.lineWidth = 1;
          ctx.fillStyle = axisTextColor;
          ctx.font = "10px sans-serif";
          ctx.textAlign = "right";

          const gridSteps = 4;
          for (let i = 0; i <= gridSteps; i++) {
            const yVal = yMin + (i * (yMax - yMin) / gridSteps);
            const py = paddingTop + plotH - (i * (plotH / gridSteps));
            ctx.beginPath();
            ctx.moveTo(paddingLeft, py);
            ctx.lineTo(w - paddingRight, py);
            ctx.stroke();
            ctx.fillText(`${Math.round(yVal)}`, paddingLeft - 6, py + 3);
          }

          // Puntos en pantalla
          const points = items.map((item, idx) => {
            const px = items.length === 1
              ? paddingLeft + (plotW / 2)
              : paddingLeft + (idx * (plotW / (items.length - 1)));
            const py = paddingTop + plotH - (((item.value - yMin) / (yMax - yMin)) * plotH);
            return { x: px, y: py, item };
          });

          // Relleno gradiente bajo la curva
          if (points.length > 1) {
            const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + plotH);
            grad.addColorStop(0, isLight ? "rgba(2, 132, 199, 0.28)" : "rgba(6, 182, 212, 0.35)");
            grad.addColorStop(1, isLight ? "rgba(2, 132, 199, 0.0)" : "rgba(6, 182, 212, 0.0)");

            ctx.beginPath();
            ctx.moveTo(points[0].x, paddingTop + plotH);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineTo(points[points.length - 1].x, paddingTop + plotH);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
          }

          // Línea principal
          const lineColor = disciplinePalette[selectedFilter] || "#06b6d4";
          ctx.beginPath();
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 3;
          ctx.lineJoin = "round";
          points.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
          ctx.stroke();

          // Puntos y etiquetas
          points.forEach(p => {
            // Círculo exterior con contraste
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = pointBorderColor;
            ctx.stroke();

            // Etiqueta de valor
            ctx.fillStyle = pointTextColor;
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${p.item.value}`, p.x, p.y - 9);

            // Fecha en eje X
            ctx.fillStyle = axisTextColor;
            ctx.font = "9px sans-serif";
            const dateShort = p.item.date.length > 5 ? p.item.date.substring(5) : p.item.date;
            ctx.fillText(dateShort, p.x, paddingTop + plotH + 15);
          });

          // Renderizar tabla cronológica
          if (historyContainer) {
            historyContainer.innerHTML = `
              <table style="width:100%; font-size:0.75rem; border-collapse:collapse;">
                <thead>
                  <tr style="color:var(--accent-cyan); border-bottom:1px solid var(--card-border); text-align:left;">
                    <th style="padding:4px 6px;">Fecha</th>
                    <th style="padding:4px 6px;">Disciplina</th>
                    <th style="padding:4px 6px; text-align:right;">Marca (${selectedUnit})</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map(it => `
                    <tr style="border-bottom:1px solid var(--card-border);">
                      <td style="padding:4px 6px; color:var(--text-muted);">${it.date}</td>
                      <td style="padding:4px 6px; color:var(--text-main); font-weight:600;">${it.movement}</td>
                      <td style="padding:4px 6px; text-align:right; color:var(--accent-cyan); font-weight:700;">${it.value}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            `;
          }

        } else {
          // --- MODO TODAS LAS DISCIPLINAS (COMPARATIVA) ---
          const allMovements = movements;
          const curPRs = getAthletePRs(activeId);
          const topPR = Math.max(...allMovements.map(m => curPRs[m] || 0));

          if (elInitial) elInitial.innerText = `${allMovements.length} Movimientos`;
          if (elCurrent) elCurrent.innerText = `Máx: ${topPR} ${selectedUnit}`;
          if (elProgress) {
            elProgress.innerText = `General Activo`;
            elProgress.style.color = "#06b6d4";
          }
          if (elLastDate) elLastDate.innerText = "Hoy";

          // Dibujar líneas comparativas para movimientos principales
          const paddingLeft = 45;
          const paddingRight = 20;
          const paddingTop = 25;
          const paddingBottom = 35;
          const plotW = w - paddingLeft - paddingRight;
          const plotH = h - paddingTop - paddingBottom;

          // Obtener fechas únicas ordenadas
          const allDates = [...new Set(history.map(h => h.date))].sort();
          if (allDates.length === 0) allDates.push(new Date().toISOString().split('T')[0]);

          const maxVal = Math.max(topPR * 1.15, 120);
          const minVal = 0;

          // Eje horizontal
          ctx.strokeStyle = gridLineColor;
          ctx.lineWidth = 1;
          for (let i = 0; i <= 4; i++) {
            const py = paddingTop + plotH - (i * (plotH / 4));
            ctx.beginPath();
            ctx.moveTo(paddingLeft, py);
            ctx.lineTo(w - paddingRight, py);
            ctx.stroke();
            ctx.fillStyle = axisTextColor;
            ctx.font = "9px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText(`${Math.round((maxVal / 4) * i)}`, paddingLeft - 5, py + 3);
          }

          // Dibujar curvas para cada disciplina
          const mainToDraw = ["Snatch", "Clean & Jerk", "Thrusters", "Back Squat", "Front Squat"];
          mainToDraw.forEach(move => {
            const mItems = history.filter(h => h.movement === move).sort((a, b) => new Date(a.date) - new Date(b.date));
            if (mItems.length === 0) return;

            const mColor = disciplinePalette[move] || "#94a3b8";
            ctx.beginPath();
            ctx.strokeStyle = mColor;
            ctx.lineWidth = 2;
            mItems.forEach((it, idx) => {
              const dateIdx = allDates.indexOf(it.date);
              const px = allDates.length === 1
                ? paddingLeft + (plotW / 2)
                : paddingLeft + ((dateIdx >= 0 ? dateIdx : idx) * (plotW / Math.max(1, allDates.length - 1)));
              const py = paddingTop + plotH - ((it.value / maxVal) * plotH);
              if (idx === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.stroke();

            // Punto final con etiqueta
            const last = mItems[mItems.length - 1];
            const lastIdx = allDates.indexOf(last.date);
            const px = allDates.length === 1 ? paddingLeft + (plotW / 2) : paddingLeft + (lastIdx * (plotW / Math.max(1, allDates.length - 1)));
            const py = paddingTop + plotH - ((last.value / maxVal) * plotH);

            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fillStyle = mColor;
            ctx.fill();
          });

          // Leyenda compacta
          ctx.font = "bold 9px sans-serif";
          let legendX = paddingLeft;
          mainToDraw.forEach(move => {
            ctx.fillStyle = disciplinePalette[move] || "#fff";
            ctx.fillRect(legendX, 8, 8, 8);
            ctx.fillStyle = legendTextColor;
            ctx.textAlign = "left";
            ctx.fillText(move, legendX + 11, 15);
            legendX += ctx.measureText(move).width + 20;
          });

          // Tabla con últimos registros
          if (historyContainer) {
            const recent = [...history].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
            historyContainer.innerHTML = `
              <table style="width:100%; font-size:0.75rem; border-collapse:collapse;">
                <thead>
                  <tr style="color:var(--accent-cyan); border-bottom:1px solid var(--card-border); text-align:left;">
                    <th style="padding:4px 6px;">Fecha</th>
                    <th style="padding:4px 6px;">Disciplina</th>
                    <th style="padding:4px 6px; text-align:right;">Marca (${selectedUnit})</th>
                  </tr>
                </thead>
                <tbody>
                  ${recent.map(it => `
                    <tr style="border-bottom:1px solid var(--card-border);">
                      <td style="padding:4px 6px; color:var(--text-muted);">${it.date}</td>
                      <td style="padding:4px 6px; color:var(--text-main); font-weight:600;">${it.movement}</td>
                      <td style="padding:4px 6px; text-align:right; color:var(--accent-cyan); font-weight:700;">${it.value}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            `;
          }
        }
      }

      document.getElementById("btnOpenReports").addEventListener("click", () => {
        const athletes = getAthletes();
        const cur = athletes.find(a => a.id === getActiveAthleteId());
        const reportAthleteName = document.getElementById("reportAthleteName");
        if (reportAthleteName) reportAthleteName.innerText = cur ? cur.name : "Atleta";

        initReportsFilters();
        reportsModal.classList.add("open");
        setTimeout(drawTemporalReportsChart, 80);
      });
      document.getElementById("btnCloseReportsModal").addEventListener("click", () => reportsModal.classList.remove("open"));

      document.getElementById("btnPrintReport").addEventListener("click", () => {
        window.print();
      });

      document.getElementById("btnEmailReport").addEventListener("click", () => {
        const athletes = getAthletes();
        const cur = athletes.find(a => a.id === getActiveAthleteId());
        const prs = getAthletePRs(getActiveAthleteId());
        let bodyText = `Reporte de Rendimiento para ${cur ? cur.name : 'Atleta'}:\n\n`;
        movements.forEach(m => bodyText += `${m}: ${prs[m]} ${selectedUnit}\n`);
        window.location.href = `mailto:?subject=Reporte de PRs Halterofilia&body=${encodeURIComponent(bodyText)}`;
      });

      // ========================================================
      // 13. BARRA VERTICAL DE LA APP Y DEMO ANIMADO INTERACTIVO
      // ========================================================
      const demoModal = document.getElementById("demoModal");
      const btnVerticalDemo = document.getElementById("btnVerticalDemo");
      const btnOpenDemoHeader = document.getElementById("btnOpenDemoHeader");
      const btnCloseDemoModal = document.getElementById("btnCloseDemoModal");
      const btnDemoPrev = document.getElementById("btnDemoPrev");
      const btnDemoPlayPause = document.getElementById("btnDemoPlayPause");
      const btnDemoNext = document.getElementById("btnDemoNext");
      const btnDemoFinish = document.getElementById("btnDemoFinish");
      const demoSlideViewport = document.getElementById("demoSlideViewport");
      const demoProgressBarFill = document.getElementById("demoProgressBarFill");

      // Accesos directos de la barra vertical
      const btnVerticalAthlete = document.getElementById("btnVerticalAthlete");
      const btnVerticalReports = document.getElementById("btnVerticalReports");
      const btnVerticalPRs = document.getElementById("btnVerticalPRs");
      const btnVerticalParams = document.getElementById("btnVerticalParams");

      if (btnVerticalAthlete) {
        btnVerticalAthlete.addEventListener("click", () => {
          renderAthletesList();
          athletesModal.classList.add("open");
        });
      }
      if (btnVerticalReports) {
        btnVerticalReports.addEventListener("click", () => {
          document.getElementById("btnOpenReports")?.click();
        });
      }
      if (btnVerticalPRs) {
        btnVerticalPRs.addEventListener("click", () => {
          document.getElementById("btnOpenPRModal")?.click();
        });
      }
      if (btnVerticalParams) {
        btnVerticalParams.addEventListener("click", () => {
          goToStep1(false);
        });
      }

      // Estructura de diapositivas interactivas para el Demo Animado
      const demoSlides = [
        {
          title: "1. Parámetros Base y Barra Olímpica",
          subtitle: "Configuración inicial personalizada",
          icon: "⚙️",
          html: `
            <div style="font-size:0.85rem; line-height:1.45; color:var(--text-main); margin-bottom:12px;">
              Configura tu sesión de entrenamiento eligiendo el <strong>Centro de Entrenamiento</strong>, la <strong>Unidad Objetivo (KG o LBS)</strong> y el tipo de <strong>Barra Olímpica</strong>.
            </div>
            <div class="demo-mockup-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:0.75rem; color:var(--text-muted);">Unidad de Medida Preferida:</span>
                <span style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700;">Conversión Automática 1 kg = 2.20462 lb</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px;">
                <div style="background:var(--input-bg); border:2px solid var(--accent-cyan); border-radius:6px; padding:8px; text-align:center;">
                  <strong style="color:var(--accent-cyan); font-size:0.95rem;">⚖️ Kilogramos (KG)</strong>
                  <small style="display:block; color:var(--text-muted); font-size:0.7rem;">Estándar IWF Oficial</small>
                </div>
                <div style="background:var(--input-bg); border:1px solid var(--card-border); border-radius:6px; padding:8px; text-align:center; opacity:0.7;">
                  <strong style="font-size:0.95rem;">🇺🇸 Libras (LBS)</strong>
                  <small style="display:block; color:var(--text-muted); font-size:0.7rem;">Discos 45, 35, 25, 10...</small>
                </div>
              </div>
              <div style="display:flex; justify-content:space-around; background:var(--input-bg); padding:8px; border-radius:6px; border:1px solid var(--card-border);">
                <div style="text-align:center;">
                  <span style="font-size:1.1rem;">🏋️‍♂️</span>
                  <div style="font-size:0.75rem; font-weight:700;">Barra Hombre: 20 kg (45 lb)</div>
                  <small style="color:var(--text-muted); font-size:0.68rem;">Grip 28 mm</small>
                </div>
                <div style="text-align:center; opacity:0.65;">
                  <span style="font-size:1.1rem;">🏋️‍♀️</span>
                  <div style="font-size:0.75rem; font-weight:700;">Barra Mujer: 15 kg (35 lb)</div>
                  <small style="color:var(--text-muted); font-size:0.68rem;">Grip 25 mm</small>
                </div>
              </div>
            </div>
            <div style="font-size:0.78rem; color:var(--accent-cyan); background:rgba(6,182,212,0.1); border-left:3px solid var(--accent-cyan); padding:6px 10px; border-radius:0 6px 6px 0;">
              💡 <strong>Tip:</strong> Cada atleta guarda su unidad preferida (KG o LBS) y se activa automáticamente al cambiar de atleta.
            </div>
          `
        },
        {
          title: "2. Movimiento de Halterofilia & PRs",
          subtitle: "Selección ágil por lista desplegable",
          icon: "🏋️",
          html: `
            <div style="font-size:0.85rem; line-height:1.45; color:var(--text-main); margin-bottom:12px;">
              Selecciona el movimiento olímpico directamente desde la nueva <strong>lista desplegable</strong>. La app cargará instantáneamente tu Récord Personal (PR) vigente para esa disciplina.
            </div>
            <div class="demo-mockup-box">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <label style="font-size:0.8rem; font-weight:700; color:var(--text-main);">Movimiento de Halterofilia:</label>
                <span style="font-size:0.85rem; font-weight:700; color:var(--accent-cyan); background:rgba(6,182,212,0.15); padding:3px 8px; border-radius:6px; animation:demoPulseGlow 2s infinite;">
                  🏆 PR Actual: 100 kg
                </span>
              </div>
              <div style="background:var(--input-bg); border:1.5px solid var(--accent-cyan); border-radius:6px; padding:10px 12px; font-weight:700; font-size:0.95rem; color:var(--text-main); display:flex; justify-content:space-between; align-items:center;">
                <span>🏋️ Snatch (Arrancada)</span>
                <span style="color:var(--accent-cyan);">▼</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; margin-top:8px;">
                <span style="background:rgba(255,255,255,0.04); padding:4px 6px; border-radius:4px; font-size:0.7rem; text-align:center; color:var(--text-muted);">Clean & Jerk</span>
                <span style="background:rgba(255,255,255,0.04); padding:4px 6px; border-radius:4px; font-size:0.7rem; text-align:center; color:var(--text-muted);">Back Squat</span>
                <span style="background:rgba(255,255,255,0.04); padding:4px 6px; border-radius:4px; font-size:0.7rem; text-align:center; color:var(--text-muted);">Power Clean</span>
              </div>
            </div>
            <div style="font-size:0.78rem; color:var(--accent-cyan); background:rgba(6,182,212,0.1); border-left:3px solid var(--accent-cyan); padding:6px 10px; border-radius:0 6px 6px 0;">
              💡 <strong>Tip:</strong> Puedes editar todos tus PRs en cualquier momento presionando el botón <strong>🏆 PRs</strong> en la cabecera o barra lateral.
            </div>
          `
        },
        {
          title: "3. Control de Porcentaje y Peso en Barra",
          subtitle: "Cálculo matemático instantáneo",
          icon: "🎯",
          html: `
            <div style="font-size:0.85rem; line-height:1.45; color:var(--text-main); margin-bottom:12px;">
              Ajusta el porcentaje de entrenamiento con el deslizador suave (40% a 120%) o usando los botones rápidos. También puedes escribir el peso exacto deseado.
            </div>
            <div class="demo-mockup-box" style="text-align:center;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span style="font-size:0.8rem; color:var(--text-muted);">Porcentaje de Carga:</span>
                <strong style="color:var(--accent-cyan); font-size:1.15rem;">80% de 100 kg</strong>
              </div>
              <div style="width:100%; height:8px; background:var(--input-bg); border-radius:4px; margin:10px 0; position:relative; overflow:hidden;">
                <div style="width:66%; height:100%; background:linear-gradient(90deg, var(--accent-cyan), var(--accent-blue)); border-radius:4px;"></div>
              </div>
              <div style="display:flex; justify-content:space-between; gap:4px; margin-bottom:12px;">
                <span style="background:var(--input-bg); border:1px solid var(--card-border); padding:3px 8px; border-radius:12px; font-size:0.7rem;">50%</span>
                <span style="background:var(--input-bg); border:1px solid var(--card-border); padding:3px 8px; border-radius:12px; font-size:0.7rem;">70%</span>
                <span style="background:var(--accent-cyan); color:#000; font-weight:700; padding:3px 8px; border-radius:12px; font-size:0.7rem;">80%</span>
                <span style="background:var(--input-bg); border:1px solid var(--card-border); padding:3px 8px; border-radius:12px; font-size:0.7rem;">90%</span>
                <span style="background:var(--input-bg); border:1px solid var(--card-border); padding:3px 8px; border-radius:12px; font-size:0.7rem;">100%</span>
              </div>
              <div style="background:var(--input-bg); padding:10px; border-radius:8px; border:1px solid var(--accent-cyan); display:inline-block; min-width:180px;">
                <small style="color:var(--text-muted); display:block; font-size:0.7rem;">Peso Objetivo en Barra:</small>
                <span style="font-size:1.6rem; font-weight:800; color:var(--text-main);">80.0 <span style="font-size:1rem; color:var(--accent-cyan);">kg</span></span>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">≈ 176.4 lbs (Conversión dual)</div>
              </div>
            </div>
          `
        },
        {
          title: "4. Barra Olímpica & Carga Visual",
          subtitle: "Representación realista con colores oficiales",
          icon: "🏋️‍♂️",
          html: `
            <div style="font-size:0.85rem; line-height:1.45; color:var(--text-main); margin-bottom:12px;">
              Visualiza en pantalla cómo cargar la barra de forma 100% simétrica por lado, con collarines de seguridad y código cromático oficial de halterofilia.
            </div>
            <div class="demo-mockup-box" style="padding:18px 8px; background:var(--barbell-bg);">
              <div style="display:flex; align-items:center; justify-content:center; gap:2px; height:80px; position:relative;">
                <!-- Manga Izquierda -->
                <div style="display:flex; align-items:center; justify-content:flex-end; gap:2px;">
                  <div style="width:16px; height:70px; background:#2563eb; border-radius:3px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.5rem; font-weight:800; writing-mode:vertical-lr;">20</div>
                  <div style="width:10px; height:45px; background:#10b981; border-radius:3px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.5rem; font-weight:800; writing-mode:vertical-lr;">10</div>
                </div>
                <!-- Collarín -->
                <div style="width:7px; height:32px; background:#64748b; border-radius:2px;"></div>
                <!-- Barra de acero -->
                <div style="width:70px; height:12px; background:linear-gradient(180deg, #e2e8f0, #94a3b8); border-radius:2px;"></div>
                <!-- Collarín -->
                <div style="width:7px; height:32px; background:#64748b; border-radius:2px;"></div>
                <!-- Manga Derecha -->
                <div style="display:flex; align-items:center; justify-content:flex-start; gap:2px;">
                  <div style="width:10px; height:45px; background:#10b981; border-radius:3px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.5rem; font-weight:800; writing-mode:vertical-lr;">10</div>
                  <div style="width:16px; height:70px; background:#2563eb; border-radius:3px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.5rem; font-weight:800; writing-mode:vertical-lr;">20</div>
                </div>
              </div>
              <div style="display:flex; justify-content:center; gap:16px; font-size:0.75rem; color:var(--text-muted); margin-top:10px;">
                <span>Barra: <strong>20 kg</strong></span>
                <span>Por lado: <strong>30 kg</strong> (1x20kg + 1x10kg)</span>
                <span style="color:var(--accent-cyan); font-weight:700;">Total: 80 kg</span>
              </div>
            </div>
            <div style="font-size:0.78rem; color:var(--accent-cyan); background:rgba(6,182,212,0.1); border-left:3px solid var(--accent-cyan); padding:6px 10px; border-radius:0 6px 6px 0;">
              💡 <strong>Regla física:</strong> La aplicación organiza automáticamente los discos más grandes pegados al collarín para máxima estabilidad biomecánica.
            </div>
          `
        },
        {
          title: "5. Alternativas de Carga & Inventario",
          subtitle: "Filtradas por tu unidad y adaptadas a tus discos",
          icon: "📦",
          html: `
            <div style="font-size:0.85rem; line-height:1.45; color:var(--text-main); margin-bottom:12px;">
              El algoritmo voraz genera <strong>Alternativas de Carga</strong> filtradas estrictamente en tu unidad preferida (solo KG o solo LBS). Si en tu box falta un disco, tócalo en el Inventario para desactivarlo y el sistema recalculará la carga.
            </div>
            <div class="demo-mockup-box">
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:4px;">Alternativas Viables Generadas:</label>
              <div style="background:var(--input-bg); border:1px solid var(--card-border); padding:8px 10px; border-radius:6px; font-size:0.8rem; margin-bottom:10px;">
                <span style="color:var(--accent-cyan); font-weight:700;">Opción 1 (Menor cant. de discos):</span> 2x20kg + 2x10kg (80.0 kg exactos)
              </div>
              <label style="font-size:0.75rem; color:var(--text-muted); display:block; margin-bottom:6px;">Inventario Disponible (Toca para activar/desactivar):</label>
              <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap;">
                <span style="background:#ea580c; color:#fff; font-weight:700; padding:4px 8px; border-radius:4px; font-size:0.75rem;">25 kg</span>
                <span style="background:#2563eb; color:#fff; font-weight:700; padding:4px 8px; border-radius:4px; font-size:0.75rem; border:2px solid var(--accent-cyan);">20 kg ✓</span>
                <span style="background:#ca8a04; color:#fff; font-weight:700; padding:4px 8px; border-radius:4px; font-size:0.75rem;">15 kg</span>
                <span style="background:#16a34a; color:#fff; font-weight:700; padding:4px 8px; border-radius:4px; font-size:0.75rem; border:2px solid var(--accent-cyan);">10 kg ✓</span>
                <span style="background:#64748b; color:#cbd5e1; padding:4px 8px; border-radius:4px; font-size:0.75rem; text-decoration:line-through; opacity:0.5;">5 kg ✕</span>
              </div>
            </div>
          `
        },
        {
          title: "6. Atletas con Foto, Contacto y Reportes",
          subtitle: "Gestión integral de perfiles y evolución",
          icon: "👥",
          html: `
            <div style="font-size:0.85rem; line-height:1.45; color:var(--text-main); margin-bottom:12px;">
              Registra perfiles completos con <strong>Nombre, Apellidos, Correo Electrónico, Teléfono de Contacto y Foto de Perfil</strong>. Visualiza el historial de rendimiento de cada atleta y exporta informes a PDF o por correo.
            </div>
            <div class="demo-mockup-box">
              <div style="display:flex; align-items:center; gap:12px; background:var(--input-bg); padding:10px; border-radius:8px; border:1px solid var(--card-border); margin-bottom:8px;">
                <div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:1.3rem; border:2px solid var(--accent-cyan); flex-shrink:0;">
                  🏋️
                </div>
                <div style="flex:1;">
                  <strong style="color:var(--text-main); font-size:0.95rem; display:block;">Carlos González</strong>
                  <small style="color:var(--text-muted); display:block; font-size:0.75rem;">✉️ carlos.gonzalez@email.com</small>
                  <small style="color:var(--accent-cyan); display:block; font-size:0.75rem; font-weight:600;">📞 +56 9 8765 4321</small>
                </div>
                <span style="color:var(--accent-cyan); font-size:0.75rem; font-weight:700; background:rgba(6,182,212,0.15); padding:4px 8px; border-radius:4px;">Activo</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-muted); padding:4px 6px;">
                <span>📊 Gráfica temporal de evolución</span>
                <span>📄 Exportar informe a PDF</span>
              </div>
            </div>
            <div style="font-size:0.78rem; color:var(--accent-cyan); background:rgba(6,182,212,0.1); border-left:3px solid var(--accent-cyan); padding:6px 10px; border-radius:0 6px 6px 0;">
              💡 <strong>Tip:</strong> Puedes cambiar rápidamente de atleta tocando el botón de perfil en la barra superior o en la barra vertical lateral.
            </div>
          `
        }
      ];

      let currentDemoStep = 0;
      let demoTimer = null;
      let isDemoPlaying = true;
      const STEP_DURATION_MS = 6000;

      function renderDemoStep(stepIdx) {
        if (stepIdx < 0) stepIdx = 0;
        if (stepIdx >= demoSlides.length) stepIdx = demoSlides.length - 1;
        currentDemoStep = stepIdx;

        const slide = demoSlides[stepIdx];
        if (!slide) return;

        // Actualizar barra de progreso y pills
        const pct = ((stepIdx + 1) / demoSlides.length) * 100;
        if (demoProgressBarFill) demoProgressBarFill.style.width = pct + "%";

        document.querySelectorAll(".demo-step-pill").forEach((pill, idx) => {
          pill.classList.toggle("active", idx === stepIdx);
          pill.classList.toggle("completed", idx < stepIdx);
        });

        // Actualizar vista del slide
        if (demoSlideViewport) {
          demoSlideViewport.innerHTML = `
            <div class="demo-slide active">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span style="font-size:1.3rem;">${slide.icon}</span>
                <div>
                  <h4 style="color:var(--accent-cyan); margin:0; font-size:0.95rem;">${slide.title}</h4>
                  <small style="color:var(--text-muted); font-size:0.72rem;">${slide.subtitle}</small>
                </div>
              </div>
              <div style="margin-top:10px;">
                ${slide.html}
              </div>
            </div>
          `;
          demoSlideViewport.scrollTop = 0;
        }

        // Actualizar botones de Anterior y Siguiente
        if (btnDemoPrev) btnDemoPrev.disabled = (stepIdx === 0);
        if (btnDemoNext) {
          btnDemoNext.innerText = (stepIdx === demoSlides.length - 1) ? "Reiniciar ↺" : "Siguiente ▶";
        }
      }

      function startDemoTimer() {
        stopDemoTimer();
        if (!isDemoPlaying) return;
        demoTimer = setInterval(() => {
          if (currentDemoStep < demoSlides.length - 1) {
            renderDemoStep(currentDemoStep + 1);
          } else {
            renderDemoStep(0);
          }
        }, STEP_DURATION_MS);
      }

      function stopDemoTimer() {
        if (demoTimer) {
          clearInterval(demoTimer);
          demoTimer = null;
        }
      }

      function openDemoModal() {
        if (!demoModal) return;
        demoModal.classList.add("open");
        currentDemoStep = 0;
        isDemoPlaying = true;
        if (btnDemoPlayPause) {
          btnDemoPlayPause.innerText = "⏸ Pausa";
          btnDemoPlayPause.style.color = "var(--accent-cyan)";
        }
        renderDemoStep(0);
        startDemoTimer();
      }

      function closeDemoModal() {
        if (!demoModal) return;
        demoModal.classList.remove("open");
        stopDemoTimer();
      }

      // Eventos del modal demo
      if (btnVerticalDemo) btnVerticalDemo.addEventListener("click", openDemoModal);
      if (btnOpenDemoHeader) btnOpenDemoHeader.addEventListener("click", openDemoModal);
      if (btnCloseDemoModal) btnCloseDemoModal.addEventListener("click", closeDemoModal);
      if (btnDemoFinish) btnDemoFinish.addEventListener("click", closeDemoModal);

      if (btnDemoPrev) {
        btnDemoPrev.addEventListener("click", () => {
          if (currentDemoStep > 0) {
            renderDemoStep(currentDemoStep - 1);
            if (isDemoPlaying) startDemoTimer();
          }
        });
      }

      if (btnDemoNext) {
        btnDemoNext.addEventListener("click", () => {
          if (currentDemoStep < demoSlides.length - 1) {
            renderDemoStep(currentDemoStep + 1);
          } else {
            renderDemoStep(0);
          }
          if (isDemoPlaying) startDemoTimer();
        });
      }

      if (btnDemoPlayPause) {
        btnDemoPlayPause.addEventListener("click", () => {
          isDemoPlaying = !isDemoPlaying;
          if (isDemoPlaying) {
            btnDemoPlayPause.innerText = "⏸ Pausa";
            btnDemoPlayPause.style.color = "var(--accent-cyan)";
            startDemoTimer();
          } else {
            btnDemoPlayPause.innerText = "▶ Seguir";
            btnDemoPlayPause.style.color = "var(--text-main)";
            stopDemoTimer();
          }
        });
      }

      // Eventos al hacer click en los indicadores de paso (pills)
      document.querySelectorAll(".demo-step-pill").forEach((pill, idx) => {
        pill.addEventListener("click", () => {
          renderDemoStep(idx);
          if (isDemoPlaying) startDemoTimer();
        });
      });

      // Inicialización
      const hasExistingUser = checkInstallation();
      const initialAthId = getActiveAthleteId();
      if (initialAthId) {
        selectedUnit = getAthleteUnit(initialAthId);
        document.querySelectorAll(".selectable-item[data-type='unit']").forEach(i => {
          i.classList.toggle("active", i.dataset.val === selectedUnit);
        });
      }
      refreshAthleteHeader();
      checkLicenseStatus();
      renderCenters();
      applyTheme(selectedTheme);
      syncInventoryWithAthleteUnit(selectedUnit);
      applyCenterMaterial(selectedCenterId);

      // Si el usuario ya existe, entra directamente al entrenamiento (no muestra Parámetros de la Aplicación)
      if (hasExistingUser) {
        goToStep2();
      } else {
        step1Screen.style.display = "none";
        step2Screen.style.display = "none";
      }
    });