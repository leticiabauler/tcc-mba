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
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
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

            const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' || window.location.hostname === '');

            let teamFiles = Array.isArray(areaConfig.teams) ? areaConfig.teams.slice() : [];
            if (!isLocal) {
                teamFiles = teamFiles.filter(t => !t.includes('exemplo'));
            }

            areas.push({
                folder: folder,
                name: areaConfig.name,
                description: areaConfig.description,
                icon: areaConfig.icon,
                teamFiles: teamFiles
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
        const areas = await discoverAreas();
        if (areas.length === 0) {
            showError('Nenhuma área encontrada. Verifique a estrutura de pastas.');
            return;
        }

        for (const area of areas) {
            const areaData = {
                name: area.name,
                description: area.description,
                icon: area.icon,
                teams: []
            };

            const teamPromises = area.teamFiles.map(teamFile =>
                fetch(`areas/${area.folder}/${teamFile}`).then(response => {
                    if (!response.ok) throw new Error(`Erro ao carregar ${teamFile}`);
                    return response.json();
                }).catch(err => {
                    console.warn(`Arquivo ${teamFile} não encontrado, pulando...`);
                    return null;
                })
            );

            const teams = await Promise.all(teamPromises);
            areaData.teams = teams.filter(t => t !== null);

            if (areaData.teams.length > 0) areasData.push(areaData);
        }

        if (areasData.length === 0) {
            showError('Nenhuma área com times encontrada.');
        } else {
            renderTree();
            // If URL has a deeplink, process it after areas are loaded
            processDeeplink();
        }
    } catch (error) {
        console.error('Erro ao carregar áreas:', error);
        showError('Erro ao carregar as áreas');
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('treeSection');
    if (!container) return;
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
    if (!container) return;
    container.innerHTML = '';

    areasData.forEach((area, areaIndex) => {
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
            tracksTree.id = `tracks-${areaIndex}-${teamIndex}`;

            team.tracks.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item';
                trackItem.dataset.trackId = track.id;

                let trackText = track.name;
                if (track.onboarding) trackText = `🚩 ${track.name}`;
                if (track.desirable) trackText = `✨ ${track.name}`;

                trackItem.textContent = trackText;
                trackItem.onclick = (e) => {
                    e.stopPropagation();
                    selectTrack(area, team, track, e);
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

    if (currentButton && currentButton.classList.contains('active')) {
        currentButton.classList.remove('active');
        if (teamsContainer) teamsContainer.classList.remove('expanded');
        selectedArea = null;
    } else {
        areaButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.teams-container').forEach(container => container.classList.remove('expanded'));

        if (currentButton) currentButton.classList.add('active');
        if (teamsContainer) teamsContainer.classList.add('expanded');
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

    if (currentButton && currentButton.classList.contains('active')) {
        currentButton.classList.remove('active');
        if (tracksTree) tracksTree.classList.remove('expanded');
        selectedTeam = null;
    } else {
        document.querySelectorAll('.team-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tracks-tree').forEach(tree => tree.classList.remove('expanded'));

        if (currentButton) currentButton.classList.add('active');
        if (tracksTree) tracksTree.classList.add('expanded');
    }
}

// Select track and render courses
function selectTrack(area, team, track, e) {
    selectedArea = area;
    selectedTeam = team;
    selectedTrack = track;

    document.querySelectorAll('.track-item').forEach(item => item.classList.remove('active'));
    if (e && e.target) e.target.classList.add('active');

    // On narrow screens, hide sidebar
    if (window.innerWidth <= 968) {
        toggleSidebar();
    }

    renderCourses();
}

// Render courses for selected track
function renderCourses() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    if (!selectedArea || !selectedTeam || !selectedTrack) {
        showEmptyState();
        return;
    }

    let onboardingBadge = '';
    let desirableTrackBadge = '';
    if (selectedTrack.onboarding) onboardingBadge = '<span class="track-onboarding-badge">🚩 Obrigatório para Onboarding</span>';
    if (selectedTrack.desirable) desirableTrackBadge = '<span class="track-desirable-badge">✨ Desejável</span>';

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
                <div class="track-title-row">
                    <h2>${selectedTrack.name}</h2>
                    <div class="track-badges-and-share">
                        ${onboardingBadge}
                        ${desirableTrackBadge}
                        <button class="share-track-btn" onclick="copyDeeplinkToClipboard('${trackDeeplink}')">
                            🔗 Copiar link da trilha
                        </button>
                    </div>
                </div>
                <p>${selectedTrack.description}</p>
            </div>
        </div>

        <div class="courses-grid" id="coursesGrid"></div>
    `;

    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    (selectedTrack.courses || []).forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        if (course.onboarding) courseCard.classList.add('onboarding');
        if (course.desirable) courseCard.classList.add('desirable');

        let courseBadgesHtml = '';
        if (course.onboarding) courseBadgesHtml += '<span class="course-inline-badge onboarding-inline">🚩 Obrigatório</span>';
        if (course.desirable) courseBadgesHtml += '<span class="course-inline-badge desirable-inline">✨ Desejável</span>';

        const courseDescription = course.description ? `<p class="course-description">${course.description}</p>` : '';
        const courseEstimatedTime = (course.duration || course.time) ? `<p class="course-time">⏳ ${course.duration || course.time}</p>` : '';
        const buttonText = course.buttonText || 'Acessar curso';

        const courseDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack, course);

        let linkButton = '';
        if (course.type === 'manual' && course.coursePath) {
            // use JSON.stringify safely inside single-quoted onclick
            const courseJson = JSON.stringify(course).replace(/'/g, "&apos;");
            linkButton = `<button class="course-link" onclick='openManualCourse(${courseJson})'>${buttonText} →</button>`;
        } else if (course.link) {
            const safeLink = course.link.replace(/'/g, "%27");
            linkButton = `<a class="course-link" href="${safeLink}" target="_blank" rel="noopener noreferrer">${buttonText} →</a>`;
        }

        const showCopy = Boolean(course.link || course.folder || course.coursePath);
        const copyButtonHtml = showCopy ? `<button class="copy-course-link-btn" onclick="copyDeeplinkToClipboard('${courseDeeplink}')" title="Copiar link do curso">🔗</button>` : '';

        courseCard.innerHTML = `
            <div class="course-header-row">
                <div class="course-number">${index + 1}</div>
                <div class="course-badges-inline">${courseBadgesHtml}</div>
            </div>
            <div class="course-title">${course.name}</div>
            ${courseDescription}
            ${courseEstimatedTime}
            <div class="course-actions">
                ${linkButton}
                ${copyButtonHtml}
            </div>
        `;

        courseCard.addEventListener('click', (e) => {
            if (e.target.closest('.course-actions') || e.target.closest('a') || e.target.closest('button')) return;
            if (course.type === 'manual' && course.coursePath) openManualCourse(course);
            else if (course.link) openExternalCourseModal(course);
        });

        coursesGrid.appendChild(courseCard);
    });
}

// Show empty state
function showEmptyState() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    mainContent.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📚</div>
            <div class="empty-title">Bem-vindo</div>
            <div class="empty-text">Selecione uma área na barra lateral para começar</div>
        </div>
    `;
}

// Toggle sidebar visibility / collapse to narrow rail
function toggleSidebar(forceState) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const collapseBtnIcon = document.getElementById('sidebarCollapseBtnIcon');
    if (!sidebar) return;

    if (typeof forceState === 'boolean') {
        if (forceState) sidebar.classList.add('collapsed'); else sidebar.classList.remove('collapsed');
    } else {
        sidebar.classList.toggle('collapsed');
    }

    // Only update the icon text, never rotate
    if (collapseBtnIcon) collapseBtnIcon.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';

    // For mobile small screens, toggle the external fixed toggle button visibility
    if (toggleBtn) {
        if (window.innerWidth <= 968) toggleBtn.classList.toggle('show');
    }
}

// Go to home - reset view
function goToHome() {
    selectedArea = null;
    selectedTeam = null;
    selectedTrack = null;

    document.querySelectorAll('.area-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.team-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.track-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.teams-container').forEach(container => container.classList.remove('expanded'));
    document.querySelectorAll('.tracks-tree').forEach(tree => tree.classList.remove('expanded'));

    window.location.hash = '';
    showEmptyState();

    if (window.innerWidth <= 968) toggleSidebar();
}

// Manual Course Functions
async function openManualCourse(course, sectionIndex = 0) {
    try {
        const courseJsonPath = `${course.coursePath}/curso.json`;
        const response = await fetch(courseJsonPath);
        if (!response.ok) throw new Error('Erro ao carregar curso');

        currentCourseData = await response.json();
        currentCourseData.basePath = course.coursePath;

        if (sectionIndex !== null && sectionIndex !== undefined) {
            if (sectionIndex < 0 || sectionIndex >= currentCourseData.sections.length) sectionIndex = 0;
            currentCourseSection = sectionIndex;
        } else {
            currentCourseSection = 0;
        }

        createCourseModal();
        await loadCourseSection(currentCourseSection);

        const courseDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack, course, currentCourseSection > 0 ? currentCourseSection : null);
        window.history.pushState({}, '', courseDeeplink);
    } catch (error) {
        console.error('Erro ao abrir curso:', error);
        alert('Erro ao carregar o curso. Tente novamente.');
    }
}

function createCourseModal() {
    const existingModal = document.getElementById('courseModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'courseModal';
    modal.className = 'course-modal';

    const courseDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack, { courseId: currentCourseData.id });

    let currentCourseInfo = null;
    if (selectedTrack && selectedTrack.courses) {
        currentCourseInfo = selectedTrack.courses.find(c => c.courseId === currentCourseData.id || generateCourseId(c.name) === currentCourseData.id);
    }

    let badgesHtml = '';
    if (currentCourseInfo) {
        if (currentCourseInfo.onboarding) badgesHtml += '<span class="modal-badge onboarding-badge-modal">🚩 Obrigatório</span>';
        if (currentCourseInfo.desirable) badgesHtml += '<span class="modal-badge desirable-badge-modal">✨ Desejável</span>';
    }

    let metaItems = [];
    if (currentCourseData.duration) metaItems.push(`<span>⏱️ ${currentCourseData.duration}</span>`);
    if (currentCourseData.author) metaItems.push(`<span>👤 ${currentCourseData.author}</span>`);
    if (currentCourseData.lastUpdate) metaItems.push(`<span>📅 ${formatDate(currentCourseData.lastUpdate)}</span>`);
    const metaHtml = metaItems.length > 0 ? `<div class="course-modal-meta">${metaItems.join('')}</div>` : '';

    const hasMultipleSections = currentCourseData.sections && currentCourseData.sections.length > 1;
    const sidebarClass = hasMultipleSections ? '' : ' hidden';
    const contentClass = hasMultipleSections ? '' : ' full-width';

    modal.innerHTML = `
        <div class="course-modal-content">
            <div class="course-modal-header">
                <div class="course-modal-title-area">
                    <div class="course-modal-title-row">
                        <h2>${currentCourseData.title}</h2>
                        <div class="course-modal-badges-and-share">
                            ${badgesHtml}
                            <button class="share-course-btn-inline" onclick="copyDeeplinkToClipboard('${courseDeeplink}')">🔗 Copiar link do curso</button>
                        </div>
                    </div>
                    ${metaHtml}
                </div>
                <button class="course-modal-close" onclick="closeCourseModal()">×</button>
            </div>
            <div class="course-modal-body">
                <div class="course-modal-sidebar${sidebarClass}" id="courseSidebar"></div>
                <div class="course-modal-content-area${contentClass}" id="courseContent"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    renderCourseSidebar();
    setTimeout(() => modal.classList.add('active'), 10);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeCourseModal(); });
    document.addEventListener('keydown', handleModalKeydown);
}

function handleModalKeydown(e) { if (e.key === 'Escape') closeCourseModal(); }

function renderCourseSidebar() {
    const sidebar = document.getElementById('courseSidebar');
    if (!sidebar) return;
    sidebar.innerHTML = '';

    (currentCourseData.sections || []).forEach((section, index) => {
        const item = document.createElement('div');
        item.className = 'course-section-item';
        if (index === currentCourseSection) item.classList.add('active');

        const sectionDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack, { courseId: currentCourseData.id }, index);

        item.innerHTML = `
            <div class="course-section-content">
                <div class="course-section-number">Seção ${index + 1}</div>
                <div class="course-section-title">${section.title}</div>
            </div>
            <button class="copy-section-link-btn" onclick="event.stopPropagation(); copyDeeplinkToClipboard('${sectionDeeplink}')" title="Copiar link desta seção">🔗</button>
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

    document.querySelectorAll('.course-section-item').forEach((item, i) => item.classList.toggle('active', i === index));
    contentArea.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando conteúdo...</p></div>';

    try {
        if (section.type === 'markdown') await loadMarkdownSection(section, contentArea);
        else if (section.type === 'video') await loadVideoSection(section, contentArea);
        addNavigationButtons(contentArea);
        contentArea.scrollTop = 0;
    } catch (error) {
        console.error('Erro ao carregar seção:', error);
        contentArea.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Erro ao carregar conteúdo.</p>';
    }
}

async function loadMarkdownSection(section, contentArea) {
    const fullPath = `${currentCourseData.basePath}/${section.content}`;
    const response = await fetch(fullPath);
    if (!response.ok) throw new Error('Erro ao carregar markdown');
    const markdownText = await response.text();

    let htmlContent = markdownText;
    if (markdownParser) htmlContent = markdownParser.parse(markdownText);

    htmlContent = fixImagePaths(htmlContent, currentCourseData.basePath);
    htmlContent = fixVideoPaths(htmlContent, currentCourseData.basePath);

    htmlContent = htmlContent.replace(/<a\s+([^>]*?)href=(['"])(.*?)\2([^>]*)>/gi, (match, beforeAttrs, q, href, afterAttrs) => {
        const attrs = `${beforeAttrs} ${afterAttrs}`.trim();
        if (/target\s*=\s*/i.test(attrs)) return match;
        return `<a ${beforeAttrs}href=${q}${href}${q}${afterAttrs} target="_blank" rel="noopener noreferrer">`;
    });

    contentArea.innerHTML = `<div class="markdown-content">${htmlContent}</div>`;
}

function fixImagePaths(htmlContent, basePath) {
    return htmlContent.replace(/<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, before, src, after) => {
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return match;
        const cleanSrc = src.replace(/^(\.\.\/)+/, '');
        const absoluteSrc = `${basePath}/${cleanSrc}`;
        return `<img${before}src="${absoluteSrc}"${after}>`;
    });
}

function fixVideoPaths(htmlContent, basePath) {
    htmlContent = htmlContent.replace(/<source([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, before, src, after) => {
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return match;
        const cleanSrc = src.replace(/^(\.\.\/)+/, '');
        const absoluteSrc = `${basePath}/${cleanSrc}`;
        return `<source${before}src="${absoluteSrc}"${after}>`;
    });

    htmlContent = htmlContent.replace(/<video([^>]*?)poster=["']([^"']+)["']([^>]*?)>/gi, (match, before, poster, after) => {
        if (poster.startsWith('http://') || poster.startsWith('https://') || poster.startsWith('/')) return match;
        const cleanPoster = poster.replace(/^(\.\.\/)+/, '');
        const absolutePoster = `${basePath}/${cleanPoster}`;
        return `<video${before}poster="${absolutePoster}"${after}>`;
    });

    return htmlContent;
}

async function loadVideoSection(section, contentArea) {
    const coursePath = `${currentCourseData.basePath}/${section.content}`;
    const posterPath = section.poster ? `${currentCourseData.basePath}/${section.poster}` : '';

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
        <button class="course-nav-btn" onclick="previousSection()" ${!hasPrev ? 'disabled' : ''}>← Anterior</button>
        <span style="color: var(--text-secondary); font-size: 0.9em;">${currentCourseSection + 1} de ${currentCourseData.sections.length}</span>
        <button class="course-nav-btn" onclick="nextSection()" ${!hasNext ? 'disabled' : ''}>Próxima →</button>
    `;
    contentArea.appendChild(navDiv);
}

function nextSection() { if (currentCourseSection < currentCourseData.sections.length - 1) loadCourseSection(currentCourseSection + 1); }
function previousSection() { if (currentCourseSection > 0) loadCourseSection(currentCourseSection - 1); }

function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    document.removeEventListener('keydown', handleModalKeydown);
    if (selectedArea && selectedTeam && selectedTrack) {
        const trackDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack);
        window.history.pushState({}, '', trackDeeplink);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Open external course modal
function openExternalCourseModal(course) {
    const modal = document.createElement('div');
    modal.className = 'external-course-modal';
    modal.id = 'externalCourseModal';

    let badgesHtml = '';
    if (course.onboarding) badgesHtml += '<span class="modal-badge onboarding-badge-modal">🚩 Obrigatório para Onboarding</span>';
    if (course.desirable) badgesHtml += '<span class="modal-badge desirable-badge-modal">✨ Desejável</span>';

    const description = course.description ? `<p class="modal-description">${course.description}</p>` : '';
    const time = course.time ? `<p class="modal-time">⏳ Duração estimada: <strong>${course.time}</strong></p>` : '';

    modal.innerHTML = `
        <div class="external-course-modal-overlay" onclick="closeExternalCourseModal()"></div>
        <div class="external-course-modal-content">
            <button class="modal-close-btn" onclick="closeExternalCourseModal()">✕</button>
            <div class="modal-header">
                <h2>${course.name}</h2>
                ${badgesHtml}
            </div>
            <div class="modal-body">
                ${description}
                ${time}
                <div class="modal-info-box">
                    <p><strong>📚 Tipo:</strong> Curso Externo</p>
                    <p><strong>🌐 Link:</strong> <a href="${course.link}" target="_blank" class="modal-link-preview">${course.link}</a></p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-cancel-btn" onclick="closeExternalCourseModal()">Cancelar</button>
                <a href="${course.link}" target="_blank" class="modal-access-btn">${course.buttonText || 'Acessar curso'} →</a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    document.addEventListener('keydown', handleExternalModalEsc);
}

function closeExternalCourseModal() {
    const modal = document.getElementById('externalCourseModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    document.removeEventListener('keydown', handleExternalModalEsc);
}
function handleExternalModalEsc(e) { if (e.key === 'Escape') closeExternalCourseModal(); }

// Deeplink Processing
function processDeeplink() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const parts = hash.split('/');

    if (parts[0] === '' && parts[1] === 'area' && parts.length >= 3) {
        const areaName = decodeURIComponent(parts[2]);
        const teamName = parts.length >= 4 ? decodeURIComponent(parts[3]) : null;
        const trackId = parts.length >= 5 ? decodeURIComponent(parts[4]) : null;
        const courseId = parts.length >= 6 ? decodeURIComponent(parts[5]) : null;
        const sectionIndex = parts.length >= 8 && parts[6] === 'section' ? parseInt(parts[7]) : null;
        navigateToDeeplink(areaName, teamName, trackId, courseId, sectionIndex);
    } else if (parts[0] === 'area' && parts.length >= 2) {
        const areaName = decodeURIComponent(parts[1]);
        const teamName = parts.length >= 3 ? decodeURIComponent(parts[2]) : null;
        const trackId = parts.length >= 4 ? decodeURIComponent(parts[3]) : null;
        const courseId = parts.length >= 5 ? decodeURIComponent(parts[4]) : null;
        const sectionIndex = parts.length >= 7 && parts[5] === 'section' ? parseInt(parts[6]) : null;
        navigateToDeeplink(areaName, teamName, trackId, courseId, sectionIndex);
    }
}

function navigateToDeeplink(areaName, teamName, trackId, courseId, sectionIndex = null) {
    if (!areasData || areasData.length === 0) return;

    const normalizedAreaName = normalizeString(areaName);
    const area = areasData.find(a => normalizeString(a.name) === normalizedAreaName);
    if (!area) { showNotification('Área não encontrada: ' + areaName); return; }

    let team = null;
    if (teamName) {
        team = area.teams.find(t => normalizeString(t.name) === normalizeString(teamName));
        if (!team) { showNotification('Equipe não encontrada: ' + teamName); return; }
    }

    let track = null;
    if (team && trackId) {
        track = team.tracks.find(tr => tr.id === trackId);
        if (!track) { showNotification('Trilha não encontrada: ' + trackId); return; }
    }

    if (area) {
        selectedArea = area;
        const areaIndex = areasData.indexOf(area);
        expandArea(areaIndex);
        if (team) {
            selectedTeam = team;
            const teamIndex = area.teams.indexOf(team);
            expandTeam(areaIndex, teamIndex);
            if (track) {
                selectedTrack = track;
                selectTrackInUI(track);
                renderCourses();

                if (courseId) {
                    setTimeout(() => {
                        let course = track.courses.find(c => c.courseId === courseId) || track.courses.find(c => generateCourseId(c.name) === courseId);
                        if (course) {
                            if (course.type === 'manual') openManualCourse(course, sectionIndex);
                            else if (course.link) openExternalCourseModal(course);
                        } else {
                            showNotification('Curso não encontrado: ' + courseId);
                        }
                    }, 350);
                }
            }
        }
    }
}

function normalizeString(str) {
    return (str || '').toLowerCase().normalize('NFD').replace(/[ -\u036f]/g, '').replace(/\s+/g, '-');
}

function expandArea(areaIndex) {
    const areaButtons = document.querySelectorAll('.area-button');
    const currentButton = areaButtons[areaIndex];
    const teamsContainer = document.getElementById(`teams-${areaIndex}`);
    if (currentButton) currentButton.classList.add('active');
    if (teamsContainer) teamsContainer.classList.add('expanded');
}

function expandTeam(areaIndex, teamIndex) {
    const teamButtons = document.querySelectorAll(`#teams-${areaIndex} .team-button`);
    const currentButton = teamButtons[teamIndex];
    const tracksTree = document.getElementById(`tracks-${areaIndex}-${teamIndex}`);
    if (currentButton) currentButton.classList.add('active');
    if (tracksTree) tracksTree.classList.add('expanded');
}

function selectTrackInUI(track) {
    document.querySelectorAll('.track-item').forEach(item => { if (item.dataset.trackId === track.id) item.classList.add('active'); });
}

function generateDeeplink(area, team, track, course = null, sectionIndex = null) {
    let link = `#/area/${encodeURIComponent(area.name)}`;
    if (team) link += `/${encodeURIComponent(team.name)}`;
    if (track) link += `/${encodeURIComponent(track.id)}`;
    if (course) {
        const courseIdToUse = course.courseId || generateCourseId(course.name);
        link += `/${encodeURIComponent(courseIdToUse)}`;
        if (sectionIndex !== null && sectionIndex !== undefined) link += `/section/${sectionIndex}`;
    }
    return window.location.origin + window.location.pathname + link;
}

function generateCourseId(courseName) {
    return courseName.toLowerCase().normalize('NFD').replace(/[ -\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function copyDeeplinkToClipboard(deeplink) {
    navigator.clipboard.writeText(deeplink).then(() => showNotification('Link copiado para a área de transferência! 🔗')).catch(err => { console.error('Erro ao copiar link:', err); showNotification('Erro ao copiar link ❌'); });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'share-notification show';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.remove('show'); setTimeout(() => notification.remove(), 300); }, 3000);
}

window.addEventListener('hashchange', () => processDeeplink());

// Initialize the app
window.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    markdownParser = (window.marked) ? window.marked : null;
    await loadAreas();

    // Ensure sidebar initial state
    toggleSidebar(false);
});
