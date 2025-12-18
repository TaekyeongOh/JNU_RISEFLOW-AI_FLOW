// ========================
// 더미 데이터
// ========================
const wastePredictions = {
    default: {
      material: "HDPE 플라스틱 (부표)",
      color: "화이트/블루",
      damage: "중간 (스크래치/오염 있음)",
      suitability: "✅ 제작 가능",
      difficulty: "중간",
      steps: ["세척 및 건조", "절단 (조각화)", "모서리 다듬기", "조각보 연결", "마감 처리"],
    },
  };
  
  const products = [
    { id: "pouch_01", name: "조각보 파우치", img: "./images/image1.jpg", emoji: "👝", qrKey: "story_pouch_01" },
    { id: "bag_01", name: "에코백", img: "./images/image2.jpg", emoji: "🛍️", qrKey: "story_bag_01" },
    { id: "coaster_01", name: "컵받침 세트",  img: "./images/image3.jpg", emoji: "☕", qrKey: "story_coaster_01" },
    { id: "keyring_01", name: "앞치마",  img: "./images/image4.jpg", emoji: "👗", qrKey: "story_keyring_01" },
  ];
  
  const stories = {
    story_pouch_01: {
      title: "복을 담은 조각보 파우치",
      img: "./images/image1.jpg",
      emoji: "👝",
      pickup: { place: "제주시 구좌읍 세화해변", date: "2025년 12월 10일" },
      makerStory:
        "세화리 여성 공동체 할머니들이 함께 세척·가공하고 전통 조각보 기법으로 정성스럽게 연결했습니다. 바다에서 건진 플라스틱이 새로운 생명을 얻었습니다.",
      impact: ["해양 플라스틱 3kg 재활용", "지역 참여자 작업 2시간 창출", "탄소 배출 1.2kg 절감"],
    },
    story_bag_01: {
      title: "바다를 담은 에코백",
      img: "./images/image2.jpg",
      emoji: "🛍️",
      pickup: { place: "제주시 함덕해수욕장", date: "2025년 12월 5일" },
      makerStory:
        "함덕 어촌계 어르신들이 폐어망과 부표를 활용하여 제작했습니다. 40년 경력의 그물 손질 기술이 담긴 특별한 제품입니다.",
      impact: ["폐어망 2kg 재활용", "지역 참여자 3시간 작업", "바다거북 서식지 보호에 기여"],
    },
    story_coaster_01: {
      title: "해양 조각보 컵받침",
      img: "./images/image3.jpg",
      emoji: "☕",
      pickup: { place: "서귀포시 표선해변", date: "2025년 12월 8일" },
      makerStory: "표선 지역 어머니회에서 작은 플라스틱 조각들을 모아 아름다운 컵받침으로 재탄생시켰습니다.",
      impact: ["플라스틱 조각 500g 재활용", "지역 참여자 1.5시간 작업", "미세플라스틱 확산 방지"],
    },
    story_keyring_01: {
      title: "제주 바다 앞치마",
      img: "./images/image4.jpg",
      emoji: "👗",
      pickup: { place: "제주시 이호테우해변", date: "2025년 12월 12일" },
      makerStory: "이호동 마을 할머니들이 작은 부표 조각으로 만든 알록달록한 앞치마입니다. 제주 바다의 색을 담았습니다.",
      impact: ["부표 조각 300g 재활용", "지역 참여자 1시간 작업", "해변 정화 활동 지원"],
    },
  };
  
  // ========================
  // 모드 상태 (photo | video)
  // ========================
  let currentMode = "photo";
  
  // ========================
  // 현재 분석 데이터
  // ========================
  let currentAnalysis = null;
  let currentImageData = null;
  
  let currentVideoAnalysis = null;
  let currentVideoUrl = null; // ✅ 영상은 URL로만 저장(세션 한정)
  
  // ========================
  // 화면 전환
  // ========================
  function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
  
    if (screenId === "collector") {
      applyModeUI();
    } else if (screenId === "pieces") {
      loadPieces();
    } else if (screenId === "products") {
      loadProducts();
    }
  }
  
  // ========================
  // 랜딩에서 모드 열기
  // ========================
  function openCollectorMode(mode) {
    currentMode = mode;
    showScreen("collector");
  }
  
  // ========================
  // 모드별 UI 적용
  // ========================
  function applyModeUI() {
    const photoWrap = document.getElementById("photoModeWrap");
    const videoWrap = document.getElementById("videoModeWrap");
    const hint = document.getElementById("modeHint");
  
    if (currentMode === "photo") {
      photoWrap.style.display = "block";
      videoWrap.style.display = "none";
      if (hint) hint.textContent = "📷 사진 모드: 사진만 업로드/분석 가능합니다";
      resetVideoState();
    } else {
      photoWrap.style.display = "none";
      videoWrap.style.display = "block";
      if (hint) hint.textContent = "🎥 영상 모드: 영상만 업로드/분석 가능합니다";
      resetPhotoState();
    }
  }
  
  // ========================
  // 리셋 함수들
  // ========================
  function resetPhotoState() {
    currentAnalysis = null;
    currentImageData = null;
  
    const input = document.getElementById("wasteImage");
    const preview = document.getElementById("preview");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const loading = document.getElementById("loading");
    const results = document.getElementById("results");
  
    if (input) input.value = "";
    if (preview) {
      preview.src = "";
      preview.classList.remove("show");
    }
    if (analyzeBtn) analyzeBtn.style.display = "none";
    if (loading) loading.classList.remove("show");
    if (results) results.classList.remove("show");
  }
  
  function resetVideoState() {
    currentVideoAnalysis = null;
    currentVideoUrl = null;
  
    const input = document.getElementById("wasteVideo");
    const preview = document.getElementById("previewVideo");
    const analyzeBtn = document.getElementById("analyzeBtnVideo");
    const loading = document.getElementById("loadingVideo");
    const results = document.getElementById("resultsVideo");
  
    if (input) input.value = "";
    if (preview) {
      preview.src = "";
      preview.classList.remove("show");
    }
    if (analyzeBtn) analyzeBtn.style.display = "none";
    if (loading) loading.classList.remove("show");
    if (results) results.classList.remove("show");
  }
  
  // ========================
  // 사진: 미리보기
  // ========================
  function previewImage(event) {
    if (currentMode !== "photo") return;
  
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function (e) {
      currentImageData = e.target.result;
  
      const preview = document.getElementById("preview");
      preview.src = currentImageData;
      preview.classList.add("show");
  
      document.getElementById("analyzeBtn").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
  
  // ========================
  // 사진: AI 분석
  // ========================
  function analyzeWaste() {
    if (currentMode !== "photo") return;
  
    const loading = document.getElementById("loading");
    const results = document.getElementById("results");
  
    loading.classList.add("show");
    results.classList.remove("show");
  
    setTimeout(() => {
      const prediction = wastePredictions.default;
      const confidence = (0.88 + Math.random() * 0.1).toFixed(2);
  
      currentAnalysis = prediction;
  
      document.getElementById("material").textContent = prediction.material;
      document.getElementById("color").textContent = prediction.color;
      document.getElementById("damage").textContent = prediction.damage;
      document.getElementById("suitability").textContent = prediction.suitability;
      document.getElementById("difficulty").textContent = prediction.difficulty;
      document.getElementById("confidence").textContent = confidence;
  
      const stepsList = document.getElementById("steps");
      stepsList.innerHTML = "";
      prediction.steps.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsList.appendChild(li);
      });
  
      loading.classList.remove("show");
      results.classList.add("show");
    }, 1500);
  }
  
  // ========================
  // 사진: 조각 등록
  // ========================
  function registerPiece() {
    if (currentMode !== "photo") return;
    if (!currentAnalysis || !currentImageData) return;
  
    const pieces = JSON.parse(localStorage.getItem("pieces") || "[]");
  
    pieces.push({
      id: Date.now(),
      image: currentImageData,
      location: "제주시 구좌읍 해변",
      date: new Date().toLocaleDateString("ko-KR"),
      prediction: currentAnalysis,
      maker: "제주 여성 공동체",
      sourceType: "photo",
    });
  
    localStorage.setItem("pieces", JSON.stringify(pieces));
    alert("✅ 조각이 등록되었습니다!");
    showScreen("pieces");
  }
  
  // ========================
  // 영상: 미리보기 (URL만 저장)
  // ========================
  function previewVideo(event) {
    if (currentMode !== "video") return;
  
    const file = event.target.files[0];
    if (!file) return;
  
    currentVideoUrl = URL.createObjectURL(file);
  
    const preview = document.getElementById("previewVideo");
    preview.src = currentVideoUrl;
    preview.classList.add("show");
  
    document.getElementById("analyzeBtnVideo").style.display = "block";
  }
  
  // ========================
  // 영상: AI 분석
  // ========================
  function analyzeWasteVideo() {
    if (currentMode !== "video") return;
  
    const loading = document.getElementById("loadingVideo");
    const results = document.getElementById("resultsVideo");
  
    loading.classList.add("show");
    results.classList.remove("show");
  
    setTimeout(() => {
      const prediction = wastePredictions.default;
      const confidence = (0.88 + Math.random() * 0.1).toFixed(2);
  
      currentVideoAnalysis = prediction;
  
      document.getElementById("materialVideo").textContent = prediction.material;
      document.getElementById("colorVideo").textContent = prediction.color;
      document.getElementById("damageVideo").textContent = prediction.damage;
      document.getElementById("suitabilityVideo").textContent = prediction.suitability;
      document.getElementById("difficultyVideo").textContent = prediction.difficulty;
      document.getElementById("confidenceVideo").textContent = confidence;
  
      const stepsList = document.getElementById("stepsVideo");
      stepsList.innerHTML = "";
      prediction.steps.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsList.appendChild(li);
      });
  
      loading.classList.remove("show");
      results.classList.add("show");
    }, 1500);
  }
  
  // ========================
  // 영상: 조각 등록 (URL 저장)
  // ========================
  function registerPieceFromVideo() {
    if (currentMode !== "video") return;
    if (!currentVideoAnalysis || !currentVideoUrl) return;
  
    const pieces = JSON.parse(localStorage.getItem("pieces") || "[]");
  
    pieces.push({
      id: Date.now(),
      videoUrl: currentVideoUrl,
      location: "제주시 구좌읍 해변",
      date: new Date().toLocaleDateString("ko-KR"),
      prediction: currentVideoAnalysis,
      maker: "제주 여성 공동체",
      sourceType: "video",
    });
  
    localStorage.setItem("pieces", JSON.stringify(pieces));
    alert("✅ 조각이 등록되었습니다!");
    showScreen("pieces");
  }
  
  // ========================
  // 조각 목록 로드
  // ========================
  function loadPieces() {
    const pieces = JSON.parse(localStorage.getItem("pieces") || "[]");
    const container = document.getElementById("piecesList");
  
    if (pieces.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p>등록된 조각이 없습니다</p>
          <p style="font-size: 14px; margin-top: 10px;">
            사진 모드/영상 모드에서 분석하고 등록해보세요!
          </p>
        </div>
      `;
      return;
    }
  
    container.innerHTML =
      '<div class="piece-grid">' +
      pieces
        .map((piece) => {
          const thumb =
            piece.sourceType === "video" && piece.videoUrl
              ? `<video class="piece-image"
                       src="${piece.videoUrl}"
                       muted playsinline
                       preload="metadata"></video>`
              : `<img src="${piece.image}" class="piece-image" alt="조각">`;
  
          return `
            <div class="piece-card">
              ${thumb}
              <div class="piece-info">
                <p><strong>${piece.prediction.material}</strong></p>
                <p>색상: ${piece.prediction.color}</p>
                <p>손상도: ${piece.prediction.damage}</p>
                <p>📍 ${piece.location}</p>
                <p>📅 ${piece.date}</p>
                <p style="margin-top: 10px;">
                  ${getDifficultyBadge(piece.prediction.difficulty)}
                </p>
              </div>
            </div>
          `;
        })
        .join("") +
      "</div>";
  }
  
  function getDifficultyBadge(difficulty) {
    const badges = {
      낮음: '<span class="badge badge-low">난이도: 낮음</span>',
      중간: '<span class="badge badge-medium">난이도: 중간</span>',
      높음: '<span class="badge badge-high">난이도: 높음</span>',
    };
    return badges[difficulty] || badges["중간"];
  }
  
  // ========================
  // 조각 전체 삭제
  // ========================
  function clearPieces() {
    if (confirm("모든 조각을 삭제하시겠습니까?")) {
      localStorage.removeItem("pieces");
      loadPieces();
    }
  }
  
  // ========================
  // 제품 목록 로드
  // ========================
  function loadProducts() {
    const container = document.getElementById("productsList");
    container.innerHTML = products
      .map(
        (product) => `
          <div class="product-card" onclick="showStory('${product.qrKey}')">
            <div class="product-image">
              <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-name">${product.name}</div>
          </div>
        `
      )
      .join("");
  }
  
  
  // ========================
  // 스토리 표시
  // ========================
  function showStory(qrKey) {
    const story = stories[qrKey];
    if (!story) return;
  
    document.getElementById("storyTitle").textContent = story.title;
  
    const storyImage = document.getElementById("storyImage");
    storyImage.innerHTML = `<img src="${story.img}" alt="${story.title}" style="width:100%;height:100%;object-fit:cover;border-radius:15px;">`;
  
    document.getElementById("pickupPlace").textContent = story.pickup.place;
    document.getElementById("pickupDate").textContent = story.pickup.date;
    document.getElementById("makerStory").textContent = story.makerStory;
  
    const impactList = document.getElementById("impactList");
    impactList.innerHTML = story.impact.map((item) => `<li>${item}</li>`).join("");
  
    showScreen("story");
  }  
  
  // ========================
  // 초기화
  // ========================
  loadProducts();
  