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

      // 2. Inventario de discos oficiales
      const basePlates = [
        { id: "lb45", name: "45 lb", weightKg: 45 / KG_TO_LBS, weightLb: 45, unit: "lb", cssClass: "plate-45lb", height: 85, width: 14, active: true },
        { id: "lb35", name: "35 lb", weightKg: 35 / KG_TO_LBS, weightLb: 35, unit: "lb", cssClass: "plate-35lb", height: 85, width: 12, active: true },
        { id: "lb25", name: "25 lb", weightKg: 25 / KG_TO_LBS, weightLb: 25, unit: "lb", cssClass: "plate-25lb", height: 75, width: 10, active: true },
        { id: "lb15", name: "15 lb", weightKg: 15 / KG_TO_LBS, weightLb: 15, unit: "lb", cssClass: "plate-15lb", height: 65, width: 9, active: true },
        { id: "lb10", name: "10 lb", weightKg: 10 / KG_TO_LBS, weightLb: 10, unit: "lb", cssClass: "plate-10lb", height: 60, width: 8, active: true },
        { id: "kg25", name: "25 kg", weightKg: 25, weightLb: 25 * KG_TO_LBS, unit: "kg", cssClass: "plate-25kg", height: 90, width: 15, active: true },
        { id: "kg20", name: "20 kg", weightKg: 20, weightLb: 20 * KG_TO_LBS, unit: "kg", cssClass: "plate-20kg", height: 90, width: 13, active: true },
        { id: "kg15", name: "15 kg", weightKg: 15, weightLb: 15 * KG_TO_LBS, unit: "kg", cssClass: "plate-15kg", height: 80, width: 11, active: true },
        { id: "kg10", name: "10 kg", weightKg: 10, weightLb: 10 * KG_TO_LBS, unit: "kg", cssClass: "plate-10kg", height: 70, width: 9, active: true },
        { id: "kg5", name: "5 kg", weightKg: 5, weightLb: 5 * KG_TO_LBS, unit: "kg", cssClass: "plate-5kg", height: 55, width: 8, active: true },
        { id: "kg2_5", name: "2.5 kg", weightKg: 2.5, weightLb: 2.5 * KG_TO_LBS, unit: "kg", cssClass: "plate-2_5kg", height: 46, width: 7, active: true },
        { id: "kg2_0", name: "2.0 kg", weightKg: 2.0, weightLb: 2.0 * KG_TO_LBS, unit: "kg", cssClass: "plate-2kg", height: 42, width: 7, active: true },
        { id: "kg1_5", name: "1.5 kg", weightKg: 1.5, weightLb: 1.5 * KG_TO_LBS, unit: "kg", cssClass: "plate-1_5kg", height: 38, width: 6, active: true },
        { id: "kg1_0", name: "1.0 kg", weightKg: 1.0, weightLb: 1.0 * KG_TO_LBS, unit: "kg", cssClass: "plate-1kg", height: 34, width: 6, active: true },
        { id: "kg0_5", name: "0.5 kg", weightKg: 0.5, weightLb: 0.5 * KG_TO_LBS, unit: "kg", cssClass: "plate-0_5kg", height: 30, width: 5, active: true }
      ];

      // 3. Centros de entrenamiento
      const defaultCenters = [
        { id: "box_central", name: "Box CrossFit Central", desc: "Inventario olímpico completo", isCustom: false },
        { id: "garage_gym", name: "Garage Gym Pro", desc: "Discos estándar en libras y kilos", isCustom: false },
        { id: "halterofilia_club", name: "Halterofilia Club", desc: "Equipamiento de competición IWF", isCustom: false }
      ];

      function getStoredCenters() {
        const s = localStorage.getItem("halterofilia_custom_centers");
        return s ? JSON.parse(s) : [];
      }
      function saveStoredCenters(list) {
        localStorage.setItem("halterofilia_custom_centers", JSON.stringify(list));
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
        const fromIsKg = fromUnit === "kg";
        const toIsKg = toUnit === "kg";
        if (fromIsKg === toIsKg) return value;

        if (fromIsKg && !toIsKg) {
          // kg -> lbs
          return Math.round((value * KG_TO_LBS) * 10) / 10;
        } else if (!fromIsKg && toIsKg) {
          // lbs -> kg
          return Math.round((value / KG_TO_LBS) * 10) / 10;
        }
        return value;
      }

      function convertAthleteUnit(athleteId, fromUnit, toUnit) {
        if (!athleteId) athleteId = getActiveAthleteId();
        const fromIsKg = fromUnit === "kg";
        const toIsKg = toUnit === "kg";
        if (fromIsKg === toIsKg) return;

        // 1. Convertir PRs actuales del atleta
        const allPRs = JSON.parse(localStorage.getItem("halterofilia_prs_by_athlete") || "{}");
        if (!allPRs[athleteId]) {
          allPRs[athleteId] = {};
          movements.forEach(m => {
            const defKg = (m === "Thrusters" ? 80 : 100);
            allPRs[athleteId][m] = fromIsKg ? defKg : Math.round((defKg * KG_TO_LBS) * 10) / 10;
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
            map[athleteId][m] = (athUnit === "kg" ? defKg : Math.round((defKg * KG_TO_LBS) * 10) / 10);
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
      let selectedCenterId = defaultCenters[0].id;
      let selectedUnit = "kg";
      let selectedBar = "men";
      let currentPercentage = 80;
      let generatedSolutions = [];

      // 7. Perfiles
      function refreshAthleteHeader() {
        const athletes = getAthletes();
        const activeId = getActiveAthleteId();
        const cur = athletes.find(a => a.id === activeId);
        document.getElementById("currentAthleteLabel").innerText = cur ? cur.name.split(" ")[0] : "Atleta";
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
          div.innerHTML = `
            <div>
              <strong>${a.name}</strong><br>
              <small style="color:var(--text-muted)">${a.email}</small>
            </div>
            <div class="radio-circle"></div>
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

            updateMovementDisplay();
            calculateHybridLoad();
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
        const name = document.getElementById("newAthleteName").value.trim();
        const email = document.getElementById("newAthleteEmail").value.trim();
        if (!name || !email) return alert("Completa nombre y correo.");

        const list = getAthletes();
        const newAth = { id: "ath_" + Date.now(), name, email };
        list.push(newAth);
        saveAthletes(list);
        setActiveAthleteId(newAth.id);

        document.getElementById("newAthleteName").value = "";
        document.getElementById("newAthleteEmail").value = "";
        refreshAthleteHeader();
        renderAthletesList();
        updateMovementDisplay();
        calculateHybridLoad();
      });

      // 8. Instalación
      const installModal = document.getElementById("installModal");
      function checkInstallation() {
        const installed = localStorage.getItem("halterofilia_installed");
        if (!installed) {
          installModal.classList.add("open");
        }
      }

      document.getElementById("btnConfirmInstall").addEventListener("click", () => {
        const fName = document.getElementById("installFirstName").value.trim();
        const lName = document.getElementById("installLastName").value.trim();
        const email = document.getElementById("installEmail").value.trim();

        if (!fName || !email) return alert("Por favor ingresa al menos tu nombre y correo electrónico.");

        const fullName = lName ? `${fName} ${lName}` : fName;
        const firstAthlete = { id: "ath_" + Date.now(), name: fullName, email };
        saveAthletes([firstAthlete]);
        setActiveAthleteId(firstAthlete.id);
        localStorage.setItem("halterofilia_installed", "true");
        setInstallDate(Date.now());

        installModal.classList.remove("open");
        refreshAthleteHeader();
        checkLicenseStatus();
        renderCenters();
      });

      // 9. Centros
      const centersContainer = document.getElementById("centersContainer");
      function renderCenters() {
        centersContainer.innerHTML = "";
        const allCenters = [...defaultCenters, ...getStoredCenters()];
        if (!allCenters.some(c => c.id === selectedCenterId)) {
          selectedCenterId = allCenters[0].id;
        }

        allCenters.forEach(center => {
          const item = document.createElement("div");
          item.className = `selectable-item ${center.id === selectedCenterId ? 'active' : ''}`;
          item.innerHTML = `
            <div>
              <strong>${center.name}</strong><br>
              <small style="color:var(--text-muted)">${center.desc}</small>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="radio-circle"></div>
              ${center.isCustom ? `<button class="btn-header" style="color:var(--accent-red); padding:2px 6px;" data-del="${center.id}">🗑️</button>` : ''}
            </div>
          `;

          item.addEventListener("click", (e) => {
            if (e.target.dataset.del) {
              e.stopPropagation();
              const customs = getStoredCenters().filter(c => c.id !== e.target.dataset.del);
              saveStoredCenters(customs);
              renderCenters();
              return;
            }
            selectedCenterId = center.id;
            renderCenters();
          });

          centersContainer.appendChild(item);
        });
      }

      const addCenterModal = document.getElementById("addCenterModal");
      document.getElementById("btnOpenAddCenter").addEventListener("click", () => {
        document.getElementById("newCenterName").value = "";
        document.getElementById("newCenterDesc").value = "";
        addCenterModal.classList.add("open");
      });
      document.getElementById("btnCloseModal").addEventListener("click", () => addCenterModal.classList.remove("open"));
      document.getElementById("btnSaveCenter").addEventListener("click", () => {
        const name = document.getElementById("newCenterName").value.trim();
        const desc = document.getElementById("newCenterDesc").value.trim() || "Centro personalizado";
        if (!name) return alert("Ingresa un nombre para el centro.");

        const customs = getStoredCenters();
        const newC = { id: "custom_" + Date.now(), name, desc, isCustom: true };
        customs.push(newC);
        saveStoredCenters(customs);
        selectedCenterId = newC.id;
        addCenterModal.classList.remove("open");
        renderCenters();
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
        basePlates.forEach(plate => {
          const chip = document.createElement("div");
          chip.className = `inv-chip ${plate.active ? '' : 'inactive'}`;
          chip.innerHTML = `${plate.name}<br><small>${plate.unit.toUpperCase()}</small>`;
          chip.addEventListener("click", () => {
            plate.active = !plate.active;
            renderInventory();
            calculateHybridLoad();
          });
          inventoryGrid.appendChild(chip);
        });
      }

      // 11. Navegación de Pasos
      const step1Screen = document.getElementById("step1Screen");
      const step2Screen = document.getElementById("step2Screen");

      function goToStep2() {
        if (!checkLicenseStatus()) return;
        step1Screen.style.display = "none";
        step2Screen.style.display = "block";

        const all = [...defaultCenters, ...getStoredCenters()];
        const current = all.find(c => c.id === selectedCenterId);

        document.getElementById("badgeCenterName").innerText = current ? current.name : "Centro";
        const badgeUnitEl = document.getElementById("badgeUnit");
        if (badgeUnitEl) {
          badgeUnitEl.innerText = selectedUnit.toUpperCase();
          if (!badgeUnitEl.dataset.hasListener) {
            badgeUnitEl.dataset.hasListener = "true";
            badgeUnitEl.style.cursor = "pointer";
            badgeUnitEl.title = "Toca para alternar entre KG y LBS";
            badgeUnitEl.addEventListener("click", () => {
              const target = selectedUnit === "kg" ? "lbs" : "kg";
              const btn = document.querySelector(`.selectable-item[data-type='unit'][data-val='${target}']`);
              if (btn) {
                btn.click();
                badgeUnitEl.innerText = selectedUnit.toUpperCase();
              }
            });
          }
        }
        document.getElementById("badgeBar").innerText = selectedBar === "men" ? "Barra Olímpica 20kg" : "Barra Olímpica 15kg";

        updateMovementDisplay();
        renderInventory();
        calculateHybridLoad();
      }

      function goToStep1() {
        step2Screen.style.display = "none";
        step1Screen.style.display = "block";
      }

      document.getElementById("btnStartWorkout").addEventListener("click", goToStep2);
      document.getElementById("btnSwitchParams").addEventListener("click", goToStep1);
      document.getElementById("btnQuickEdit").addEventListener("click", goToStep1);

      // 12. Movimientos
      function updateMovementDisplay() {
        const moveName = movements[currentMoveIndex];
        const activeId = getActiveAthleteId();
        const prs = getAthletePRs(activeId);
        const pr = prs[moveName] !== undefined ? prs[moveName] : (selectedUnit === "kg" ? (moveName === "Thrusters" ? 80 : 100) : (moveName === "Thrusters" ? 176.4 : 220.5));
        document.getElementById("activeMoveTitle").innerText = moveName;
        document.getElementById("activeMovePR").innerText = `PR: ${pr} ${selectedUnit.toUpperCase()}`;
      }

      document.getElementById("btnPrevMove").addEventListener("click", () => {
        currentMoveIndex = (currentMoveIndex - 1 + movements.length) % movements.length;
        updateMovementDisplay();
        calculateHybridLoad();
      });

      document.getElementById("btnNextMove").addEventListener("click", () => {
        currentMoveIndex = (currentMoveIndex + 1) % movements.length;
        updateMovementDisplay();
        calculateHybridLoad();
      });

      // 13. Porcentaje Slider y Entrada Manual de Peso
      const prSlider = document.getElementById("prSlider");
      const pctLabel = document.getElementById("pctLabel");
      const quickChipsContainer = document.getElementById("quickChipsContainer");
      const targetWeightInput = document.getElementById("targetWeightInput");
      const targetWeightUnitLabel = document.getElementById("targetWeightUnitLabel");
      const percentages = [50, 60, 70, 75, 80, 85, 90, 95, 100];

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
          prSlider.value = Math.min(120, Math.max(0, currentPercentage));
          updateSliderUI();
        } else {
          targetTotal = basePR * (currentPercentage / 100);
          if (targetWeightInput && document.activeElement !== targetWeightInput) {
            targetWeightInput.value = targetTotal.toFixed(1);
          }
        }

        if (targetWeightUnitLabel) {
          targetWeightUnitLabel.innerText = selectedUnit;
        }

        // Peso de la barra
        const barWeightKg = selectedBar === "men" ? 20 : 15;
        const barWeightInTarget = selectedUnit === "kg" ? barWeightKg : (barWeightKg * KG_TO_LBS);

        const neededTotal = targetTotal - barWeightInTarget;
        const neededPerSide = neededTotal > 0 ? (neededTotal / 2) : 0;

        generatedSolutions = [];

        if (neededPerSide > 0.1) {
          const available = basePlates.filter(p => p.active);
          generatedSolutions = generateFastAlternatives(available, neededPerSide, selectedUnit);
        }

        renderAlternativesDropdown();
      }

      // Generador voraz determinista con múltiples estrategias
      function generateFastAlternatives(availablePlates, targetPerSide, unit) {
        const tolerance = unit === "kg" ? 0.25 : 0.55;
        const solutions = [];
        const seenSignatures = new Set();

        function buildStrategy(filterFn, sortFn, titlePrefix) {
          let pool = availablePlates.filter(filterFn);
          if (pool.length === 0) pool = [...availablePlates]; // fallback si el filtro es estricto

          const prepared = pool.map(p => ({
            ref: p,
            weight: unit === "kg" ? p.weightKg : p.weightLb
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

          if (combo.length > 0) {
            const sig = combo.map(p => p.id).sort().join("|");
            if (!seenSignatures.has(sig)) {
              seenSignatures.add(sig);
              const totalLoaded = (currentSum * 2).toFixed(1);
              solutions.push({
                title: `${titlePrefix} (${totalLoaded} ${unit} en discos)`,
                plates: combo
              });
            }
          }
        }

        // Estrategia 1: Óptima / Mínimos Discos (Discos Grandes Primero)
        buildStrategy(
          () => true,
          (a, b) => b.weight - a.weight,
          "Opción 1 • Menor cantidad de discos"
        );

        // Estrategia 2: Priorizar Discos en Kilogramos
        buildStrategy(
          p => p.unit === "kg",
          (a, b) => b.weight - a.weight,
          "Opción 2 • Enfoque en Kilogramos"
        );

        // Estrategia 3: Priorizar Discos en Libras
        buildStrategy(
          p => p.unit === "lb",
          (a, b) => b.weight - a.weight,
          "Opción 3 • Enfoque en Libras"
        );

        // Estrategia 4: Balance Híbrido (Mezcla Equilibrada)
        buildStrategy(
          p => (unit === "kg" ? p.weightKg <= 20 : p.weightLb <= 35),
          (a, b) => b.weight - a.weight,
          "Opción 4 • Distribución Intermedia / Fraccional"
        );

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
          elL.innerText = plate.name;
          leftBox.appendChild(elL);
        });

        // Lado derecho
        ordered.forEach(plate => {
          const elR = document.createElement("div");
          elR.className = `plate-visual ${plate.cssClass}`;
          elR.style.height = `${plate.height}px`;
          elR.style.width = `${plate.width}px`;
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
        if (prBrowseUnitHeader) prBrowseUnitHeader.innerText = selectedUnit.toUpperCase();

        const prs = getAthletePRs(getActiveAthleteId());
        prBrowseTableBody.innerHTML = "";

        movements.forEach(m => {
          const val = prs[m] !== undefined ? prs[m] : (selectedUnit === "kg" ? (m === "Thrusters" ? 80 : 100) : (m === "Thrusters" ? 176.4 : 220.5));
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>
              <strong style="color: #f8fafc;">${m}</strong>
            </td>
            <td style="text-align: right;">
              <input type="number" step="0.1" class="pr-input-cell" data-movement="${m}" value="${val}">
              <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 4px;">${selectedUnit.toUpperCase()}</span>
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

      // Inicialización
      checkInstallation();
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
    });