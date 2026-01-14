// Global state
let areasData = [];
let selectedArea = null;
let selectedTeam = null;
let selectedTrack = null;
let currentCourseData = null;
let currentCourseSection = 0;
let markdownParser = null;

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Configuration - list of area folders to scan
const areaFolders = ['pdi'];

// Discover and load areas dynamically
async function discoverAreas() {
    const areas = [];
    
    for (const folder of areaFolders) {
        try {
            const response = await fetch(`areas/${folder}/area.json`);
            if (!response.ok) {
                console.warn(`Área ${folder} não encontrada, pulando...`);
                continue;
            }
            
            const areaConfig = await response.json();
            areas.push({
                folder: folder,
                name: areaConfig.name,
                description: areaConfig.description,
                icon: areaConfig.icon,
                teamFiles: areaConfig.teams
            });
        } catch (error) {
            console.warn(`Erro ao carregar área ${folder}:`, error);
        }
    }
    
    return areas;
}

// Load areas data
async function loadAreas() {
    try {
        areasData = [];
        
        // Discover available areas
        const areas = await discoverAreas();
        
        if (areas.length === 0) {
            showError('Nenhuma área encontrada. Verifique a estrutura de pastas.');
            return;
        }

        // Load teams for each area
        for (const area of areas) {
            const areaData = {
                name: area.name,
                description: area.description,
                icon: area.icon,
                teams: []
            };

            const teamPromises = area.teamFiles.map(teamFile =>
                fetch(`areas/${area.folder}/${teamFile}`)
                    .then(response => {
                        if (!response.ok) throw new Error(`Erro ao carregar ${teamFile}`);
                        return response.json();
                    })
                    .catch(error => {
                        console.warn(`Arquivo ${teamFile} não encontrado, pulando...`);
                        return null;
                    })
            );

            const teams = await Promise.all(teamPromises);
            areaData.teams = teams.filter(team => team !== null);

            if (areaData.teams.length > 0) {
                areasData.push(areaData);
            }
        }

        if (areasData.length === 0) {
            showError('Nenhuma área com times encontrada.');
        } else {
            renderTree();
        }
    } catch (error) {
        console.error('Erro ao carregar áreas:', error);
        showError('Erro ao carregar as áreas');
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('treeSection');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <div class="empty-text">${message}</div>
        </div>
    `;
}

// Render tree navigation
function renderTree() {
    const container = document.getElementById('treeSection');
    container.innerHTML = '';    areasData.forEach((area, areaIndex) => {
        const areaItem = document.createElement('div');
        areaItem.className = 'area-item';

        const areaButton = document.createElement('button');
        areaButton.className = 'area-button';
        areaButton.innerHTML = `
            <span class="area-icon">▶</span>
            ${area.icon ? area.icon + ' ' : ''}${area.name}
        `;
        areaButton.onclick = () => toggleArea(area, areaIndex);

        const teamsContainer = document.createElement('div');
        teamsContainer.className = 'teams-container';
        teamsContainer.id = `teams-${areaIndex}`;

        area.teams.forEach((team, teamIndex) => {
            const teamItem = document.createElement('div');
            teamItem.className = 'team-item';

            const teamButton = document.createElement('button');
            teamButton.className = 'team-button';
            teamButton.innerHTML = `
                <span class="team-icon">▶</span>
                ${team.name}
            `;
            teamButton.onclick = (e) => {
                e.stopPropagation();
                toggleTeam(area, team, areaIndex, teamIndex);
            };

            const tracksTree = document.createElement('div');
            tracksTree.className = 'tracks-tree';
            tracksTree.id = `tracks-${areaIndex}-${teamIndex}`;            team.tracks.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item';
                trackItem.dataset.trackId = track.id;

                let trackText = track.name;
                if (track.onboarding) {
                    trackText = `🚩 ${track.name}`;
                }
                if (track.desirable) {
                    trackText = `✨ ${track.name}`;
                }

                trackItem.textContent = trackText;
                trackItem.onclick = (e) => {
                    e.stopPropagation();
                    selectTrack(area, team, track);
                };
                tracksTree.appendChild(trackItem);
            });

            teamItem.appendChild(teamButton);
            teamItem.appendChild(tracksTree);
            teamsContainer.appendChild(teamItem);
        });

        areaItem.appendChild(areaButton);
        areaItem.appendChild(teamsContainer);
        container.appendChild(areaItem);
    });
}

// Toggle area expansion
function toggleArea(area, areaIndex) {
    const areaButtons = document.querySelectorAll('.area-button');
    const currentButton = areaButtons[areaIndex];
    const teamsContainer = document.getElementById(`teams-${areaIndex}`);

    if (currentButton.classList.contains('active')) {
        currentButton.classList.remove('active');
        teamsContainer.classList.remove('expanded');
        selectedArea = null;
    } else {
        areaButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.teams-container').forEach(container => container.classList.remove('expanded'));

        currentButton.classList.add('active');
        teamsContainer.classList.add('expanded');
        selectedArea = area;
    }
}

// Toggle team expansion
function toggleTeam(area, team, areaIndex, teamIndex) {
    selectedArea = area;
    selectedTeam = team;

    const teamButtons = document.querySelectorAll(`#teams-${areaIndex} .team-button`);
    const currentButton = teamButtons[teamIndex];
    const tracksTree = document.getElementById(`tracks-${areaIndex}-${teamIndex}`);

    if (currentButton.classList.contains('active')) {
        currentButton.classList.remove('active');
        tracksTree.classList.remove('expanded');
        selectedTeam = null;
    } else {
        document.querySelectorAll('.team-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tracks-tree').forEach(tree => tree.classList.remove('expanded'));

        currentButton.classList.add('active');
        tracksTree.classList.add('expanded');
    }
}

// Select track and render courses
function selectTrack(area, team, track) {
    selectedArea = area;
    selectedTeam = team;
    selectedTrack = track;

    document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');

    if (window.innerWidth <= 968) {
        toggleSidebar();
    }

    renderCourses();
}

// Render courses for selected track
function renderCourses() {
    const mainContent = document.getElementById('mainContent');

    let onboardingBadge = '';
    let desirableTrackBadge = '';
    if (selectedTrack.onboarding) {
        onboardingBadge = '<span class="track-onboarding-badge">🚩 Obrigatório para Onboarding</span>';
    }
    if (selectedTrack.desirable) {
        desirableTrackBadge = '<span class="track-desirable-badge">✨ Desejável</span>';
    }

    // Generate and display deeplink
    const trackDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack);

    mainContent.innerHTML = `
        <div class="breadcrumb">
            <span>${selectedArea.name}</span> / 
            <span>${selectedTeam.name}</span> / 
            <span>${selectedTrack.name}</span>
        </div>

        <div class="track-header">
            <div class="track-icon-large">${selectedTrack.icon}</div>
            <div class="track-info">
                <h2>${selectedTrack.name} ${onboardingBadge} ${desirableTrackBadge}</h2>
                <p>${selectedTrack.description}</p>
                <button class="share-course-btn" onclick="copyDeeplinkToClipboard('${trackDeeplink}')">
                    🔗 Copiar link da trilha
                </button>
            </div>
        </div>

        <div class="courses-grid" id="coursesGrid"></div>
    `;

    const coursesGrid = document.getElementById('coursesGrid');

    selectedTrack.courses.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';

        if (course.onboarding) {
            courseCard.classList.add('onboarding');
        }
        if (course.desirable) {
            courseCard.classList.add('desirable');
        }

        let onboardingBadgeHtml = '';
        if (course.onboarding) {
            onboardingBadgeHtml = '<div class="onboarding-badge">🚩 Obrigatório para Onboarding</div>';
        }

        let desirableBadgeHtml = '';
        if (course.desirable) {
            desirableBadgeHtml = '<div class="desirable-badge">✨ Desejável</div>';
        }

        const courseDescription = course.description ? `<p class="course-description">${course.description}</p>` : '';
        const courseEstimatedTime = course.time ? `<p class="course-time">⏳ ${course.time}</p>` : '';
        const buttonText = course.buttonText || "Acessar curso";

        let linkButton = '';
        
        if (course.type === 'manual' && course.coursePath) {
            // Manual course - open modal
            linkButton = `
                <button class="course-link" onclick='openManualCourse(${JSON.stringify(course).replace(/'/g, "&apos;")})'>
                    ${buttonText} →
                </button>
            `;
        } else if (course.link) {
            // External course
            linkButton = `
                <a href="${course.link}" target="_blank" class="course-link">
                    ${buttonText} →
                </a>
            `;
        }

        courseCard.innerHTML = `
            <div class="course-number">${index + 1}</div>
            ${onboardingBadgeHtml}
            ${desirableBadgeHtml}
            <div class="course-title">${course.name}</div>
            ${courseDescription}
            ${courseEstimatedTime}
            ${linkButton}
        `;

        coursesGrid.appendChild(courseCard);
    });
}

// Show empty state
function showEmptyState() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📚</div>
            <div class="empty-title">Bem-vindo</div>
            <div class="empty-text">Selecione uma área na barra lateral para começar</div>
        </div>
    `;
}

// Toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');

    sidebar.classList.toggle('collapsed');
    toggleBtn.classList.toggle('show');
}

// Manual Course Functions
async function openManualCourse(course) {
    try {
        // Load course data
        const response = await fetch(course.coursePath);
        if (!response.ok) throw new Error('Erro ao carregar curso');
        
        currentCourseData = await response.json();
        currentCourseSection = 0;
        
        // Create modal
        createCourseModal();
        
        // Load first section
        await loadCourseSection(0);
        
        // Update URL with deeplink
        const courseDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack, course);
        window.history.pushState({}, '', courseDeeplink);
        
    } catch (error) {
        console.error('Erro ao abrir curso:', error);
        alert('Erro ao carregar o curso. Tente novamente.');
    }
}

function createCourseModal() {
    // Remove existing modal if any
    const existingModal = document.getElementById('courseModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'courseModal';
    modal.className = 'course-modal';
    
    const courseDeeplink = generateDeeplink(
        selectedArea, 
        selectedTeam, 
        selectedTrack, 
        { courseId: currentCourseData.id }
    );
    
    modal.innerHTML = `
        <div class="course-modal-content">
            <div class="course-modal-header">
                <div class="course-modal-title-area">
                    <h2>${currentCourseData.title}</h2>
                    <div class="course-modal-meta">
                        <span>⏱️ ${currentCourseData.duration}</span>
                        <span>👤 ${currentCourseData.author}</span>
                        <span>📅 ${formatDate(currentCourseData.lastUpdate)}</span>
                    </div>
                    <button class="share-course-btn" onclick="copyDeeplinkToClipboard('${courseDeeplink}')">
                        🔗 Copiar link do curso
                    </button>
                </div>
                <button class="course-modal-close" onclick="closeCourseModal()">×</button>
            </div>
            <div class="course-modal-body">
                <div class="course-modal-sidebar" id="courseSidebar"></div>
                <div class="course-modal-content-area" id="courseContent"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Render sidebar
    renderCourseSidebar();
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCourseModal();
    });
    
    // Close on ESC key
    document.addEventListener('keydown', handleModalKeydown);
}

function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeCourseModal();
    }
}

function renderCourseSidebar() {
    const sidebar = document.getElementById('courseSidebar');
    if (!sidebar) return;
    
    sidebar.innerHTML = '';
    
    currentCourseData.sections.forEach((section, index) => {
        const item = document.createElement('div');
        item.className = 'course-section-item';
        if (index === currentCourseSection) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <div class="course-section-number">Seção ${index + 1}</div>
            <div class="course-section-title">${section.title}</div>
        `;
        
        item.onclick = () => loadCourseSection(index);
        sidebar.appendChild(item);
    });
}

async function loadCourseSection(index) {
    currentCourseSection = index;
    const section = currentCourseData.sections[index];
    const contentArea = document.getElementById('courseContent');
    
    if (!contentArea) return;
    
    // Update sidebar active state
    document.querySelectorAll('.course-section-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Show loading
    contentArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando conteúdo...</p></div>';
    
    try {
        if (section.type === 'markdown') {
            await loadMarkdownSection(section, contentArea);
        } else if (section.type === 'video') {
            await loadVideoSection(section, contentArea);
        }
        
        // Add navigation buttons
        addNavigationButtons(contentArea);
        
        // Scroll to top
        contentArea.scrollTop = 0;
        
    } catch (error) {
        console.error('Erro ao carregar seção:', error);
        contentArea.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Erro ao carregar conteúdo.</p>';
    }
}

async function loadMarkdownSection(section, contentArea) {
    const coursePath = currentCourseData.sections[0].content.split('/').slice(0, -1).join('/');
    const fullPath = `areas/pdi/cursos/${currentCourseData.id}/${section.content}`;
    
    const response = await fetch(fullPath);
    if (!response.ok) throw new Error('Erro ao carregar markdown');
    
    const markdownText = await response.text();
    
    // Parse markdown
    let htmlContent = markdownText;
    if (markdownParser) {
        htmlContent = markdownParser.parse(markdownText);
    }
    
    contentArea.innerHTML = `<div class="markdown-content">${htmlContent}</div>`;
}

async function loadVideoSection(section, contentArea) {
    const coursePath = `areas/pdi/cursos/${currentCourseData.id}/${section.content}`;
    const posterPath = section.poster ? `areas/pdi/cursos/${currentCourseData.id}/${section.poster}` : '';
    
    contentArea.innerHTML = `
        <div class="markdown-content">
            <h1>${section.title}</h1>
            <div class="video-container">
                <video controls ${posterPath ? `poster="${posterPath}"` : ''}>
                    <source src="${coursePath}" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
        </div>
    `;
}

function addNavigationButtons(contentArea) {
    const hasNext = currentCourseSection < currentCourseData.sections.length - 1;
    const hasPrev = currentCourseSection > 0;
    
    const navDiv = document.createElement('div');
    navDiv.className = 'course-navigation';
    navDiv.innerHTML = `
        <button class="course-nav-btn" onclick="previousSection()" ${!hasPrev ? 'disabled' : ''}>
            ← Anterior
        </button>
        <span style="color: var(--text-secondary); font-size: 0.9em;">
            ${currentCourseSection + 1} de ${currentCourseData.sections.length}
        </span>
        <button class="course-nav-btn" onclick="nextSection()" ${!hasNext ? 'disabled' : ''}>
            Próxima →
        </button>
    `;
    
    contentArea.appendChild(navDiv);
}

function nextSection() {
    if (currentCourseSection < currentCourseData.sections.length - 1) {
        loadCourseSection(currentCourseSection + 1);
    }
}

function previousSection() {
    if (currentCourseSection > 0) {
        loadCourseSection(currentCourseSection - 1);
    }
}

function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    
    // Remove keydown listener
    document.removeEventListener('keydown', handleModalKeydown);
    
    // Update URL to track without course
    if (selectedArea && selectedTeam && selectedTrack) {
        const trackDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack);
        window.history.pushState({}, '', trackDeeplink);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadAreas().then(() => {
        // Process deeplink after areas are loaded
        processDeeplink();
    });
    initMarkdownParser();
});

// Initialize markdown parser
function initMarkdownParser() {
    // Using marked.js for markdown parsing
    if (typeof marked !== 'undefined') {
        markdownParser = marked;
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
    }
}

// Deeplink Processing
function processDeeplink() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const parts = hash.split('/');
    
    if (parts[0] === 'area' && parts.length >= 2) {
        const areaName = decodeURIComponent(parts[1]);
        const teamName = parts.length >= 3 ? decodeURIComponent(parts[2]) : null;
        const trackId = parts.length >= 4 ? decodeURIComponent(parts[3]) : null;
        const courseId = parts.length >= 5 ? decodeURIComponent(parts[4]) : null;
        
        navigateToDeeplink(areaName, teamName, trackId, courseId);
    }
}

function navigateToDeeplink(areaName, teamName, trackId, courseId) {
    // Find area
    const area = areasData.find(a => normalizeString(a.name) === normalizeString(areaName));
    if (!area) return;

    // Find team
    if (teamName) {
        const team = area.teams.find(t => normalizeString(t.name) === normalizeString(teamName));
        if (!team) return;

        // Find track
        if (trackId) {
            const track = team.tracks.find(tr => tr.id === trackId);
            if (!track) return;

            // Select track
            selectedArea = area;
            selectedTeam = team;
            selectedTrack = track;

            // Expand UI
            const areaIndex = areasData.indexOf(area);
            const teamIndex = area.teams.indexOf(team);
            
            expandArea(areaIndex);
            expandTeam(areaIndex, teamIndex);
            selectTrackInUI(track);
            renderCourses();

            // Open specific course if provided
            if (courseId) {
                setTimeout(() => {
                    const course = track.courses.find(c => c.courseId === courseId);
                    if (course && course.type === 'manual') {
                        openManualCourse(course);
                    }
                }, 100);
            }
        }
    }
}

function normalizeString(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
}

function expandArea(areaIndex) {
    const areaButtons = document.querySelectorAll('.area-button');
    const currentButton = areaButtons[areaIndex];
    const teamsContainer = document.getElementById(`teams-${areaIndex}`);
    
    if (currentButton && teamsContainer) {
        currentButton.classList.add('active');
        teamsContainer.classList.add('expanded');
    }
}

function expandTeam(areaIndex, teamIndex) {
    const teamButtons = document.querySelectorAll(`#teams-${areaIndex} .team-button`);
    const currentButton = teamButtons[teamIndex];
    const tracksTree = document.getElementById(`tracks-${areaIndex}-${teamIndex}`);
    
    if (currentButton && tracksTree) {
        currentButton.classList.add('active');
        tracksTree.classList.add('expanded');
    }
}

function selectTrackInUI(track) {
    document.querySelectorAll('.track-item').forEach(item => {
        if (item.dataset.trackId === track.id) {
            item.classList.add('active');
        }
    });
}

// Generate deeplink
function generateDeeplink(area, team, track, course = null) {
    let link = `#/area/${encodeURIComponent(area.name)}`;
    if (team) link += `/${encodeURIComponent(team.name)}`;
    if (track) link += `/${encodeURIComponent(track.id)}`;
    if (course && course.courseId) link += `/${encodeURIComponent(course.courseId)}`;
    return window.location.origin + window.location.pathname + link;
}

function copyDeeplinkToClipboard(deeplink) {
    navigator.clipboard.writeText(deeplink).then(() => {
        showNotification('Link copiado para a área de transferência! 🔗');
    }).catch(err => {
        console.error('Erro ao copiar link:', err);
        showNotification('Erro ao copiar link ❌');
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'share-notification show';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Listen to hash changes
window.addEventListener('hashchange', () => {
    processDeeplink();
});
