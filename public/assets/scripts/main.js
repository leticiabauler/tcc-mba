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

            // Determine if running locally (localhost, 127.0.0.1 or file protocol)
            const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' || window.location.hostname === '');

            // Clone team list and, when not local, remove the example team to avoid showing it in production
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
    `;    const coursesGrid = document.getElementById('coursesGrid');

    selectedTrack.courses.forEach((course, index) => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';

        if (course.onboarding) {
            courseCard.classList.add('onboarding');
        }
        if (course.desirable) {
            courseCard.classList.add('desirable');
        }

        // Badges ao lado do número
        let courseBadgesHtml = '';
        if (course.onboarding) {
            courseBadgesHtml += '<span class="course-inline-badge onboarding-inline">🚩 Obrigatório</span>';
        }
        if (course.desirable) {
            courseBadgesHtml += '<span class="course-inline-badge desirable-inline">✨ Desejável</span>';
        }

        const courseDescription = course.description ? `<p class="course-description">${course.description}</p>` : '';
        const courseEstimatedTime = (course.duration || course.time) ? `<p class="course-time">⏳ ${course.duration || course.time}</p>` : '';
        const buttonText = course.buttonText || "Acessar curso";

        // Always generate a courseId for deeplink (for both manual and external)
        let courseId = course.courseId || generateCourseId(course.name);
        // Generate course deeplink always with courseId
        const courseDeeplink = generateDeeplink(selectedArea, selectedTeam, selectedTrack, { ...course, courseId });

        let linkButton = '';

        if (course.type === 'manual' && course.coursePath) {
            // Manual course - open modal (keep original behaviour)
            linkButton = `
                <button class="course-link" onclick='openManualCourse(${JSON.stringify({ ...course, courseId }).replace(/'/g, "&apos;")})'>
                    ${buttonText} →
                </button>
            `;
        } else if (course.link) {
            // External course - open the link directly in a new tab (no modal)
            const safeLink = course.link.replace(/'/g, "%27");
            linkButton = `
                <a class="course-link" href="${safeLink}" target="_blank" rel="noopener noreferrer">
                    ${buttonText} →
                </a>
            `;
        } else {
            // No direct action (internal indicator or simple reference) - do not show action button
            linkButton = '';
        }

        // Show copy button only when there is something to deep-link to (external link, internal folder or manual course)
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
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const collapseIcon = document.getElementById('sidebarCollapseBtnIcon');

    sidebar.classList.toggle('collapsed');

    // Mobile: show ☰ only when sidebar is collapsed
    if (window.innerWidth <= 968) {
        if (sidebar.classList.contains('collapsed')) {
            toggleBtn.style.display = 'block';
            if (collapseBtn) collapseBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'none';
            if (collapseBtn) collapseBtn.style.display = 'flex';
        }
    } else {
        // Desktop: always show collapse button, never ☰
        toggleBtn.style.display = 'none';
        if (collapseBtn) collapseBtn.style.display = 'flex';
    }

    // Update arrow direction
    if (collapseIcon) {
        if (sidebar.classList.contains('collapsed')) {
            collapseIcon.textContent = '▶';
        } else {
            collapseIcon.textContent = '◀';
        }
    }
}

// On resize, ensure correct button visibility
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    if (window.innerWidth <= 968) {
        if (sidebar.classList.contains('collapsed')) {
            toggleBtn.style.display = 'block';
            if (collapseBtn) collapseBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'none';
            if (collapseBtn) collapseBtn.style.display = 'flex';
        }
    } else {
        toggleBtn.style.display = 'none';
        if (collapseBtn) collapseBtn.style.display = 'flex';
    }
});

// Go to home - reset view
function goToHome() {
    // Clear selections
    selectedArea = null;
    selectedTeam = null;
    selectedTrack = null;
    
    // Collapse all areas and teams
    document.querySelectorAll('.area-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.team-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.track-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.teams-container').forEach(container => container.classList.remove('expanded'));
    document.querySelectorAll('.tracks-tree').forEach(tree => tree.classList.remove('expanded'));
    
    // Clear URL hash
    window.location.hash = '';
    
    // Show empty state
    showEmptyState();
    
    // Close sidebar on mobile
    if (window.innerWidth <= 968) {
        toggleSidebar();
    }
}

// Manual Course Functions
async function openManualCourse(course, sectionIndex = 0) {
    try {
        // Load course data - coursePath now points to the folder, add curso.json
        const courseJsonPath = `${course.coursePath}/curso.json`;
        const response = await fetch(courseJsonPath);
        if (!response.ok) throw new Error('Erro ao carregar curso');
        
        currentCourseData = await response.json();
        currentCourseData.basePath = course.coursePath; // Store base path for loading sections
        
        // Validar índice da seção
        if (sectionIndex !== null && sectionIndex !== undefined) {
            if (sectionIndex < 0 || sectionIndex >= currentCourseData.sections.length) {
                console.warn('Índice de seção inválido:', sectionIndex, 'usando 0');
                sectionIndex = 0;
            }
            currentCourseSection = sectionIndex;
        } else {
            currentCourseSection = 0;
        }
        
        // Create modal
        createCourseModal();
        
        // Load specified section
        await loadCourseSection(currentCourseSection);
        
        // Update URL with deeplink (incluindo seção se não for a primeira)
        const courseDeeplink = generateDeeplink(
            selectedArea, 
            selectedTeam, 
            selectedTrack, 
            course,
            currentCourseSection > 0 ? currentCourseSection : null
        );
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
    
    // Buscar informações do curso atual na trilha para badges
    let currentCourseInfo = null;
    if (selectedTrack && selectedTrack.courses) {
        currentCourseInfo = selectedTrack.courses.find(c => 
            c.courseId === currentCourseData.id || 
            generateCourseId(c.name) === currentCourseData.id
        );
    }
    
    // Gerar badges se o curso for obrigatório ou desejável
    let badgesHtml = '';
    if (currentCourseInfo) {
        if (currentCourseInfo.onboarding) {
            badgesHtml += '<span class="modal-badge onboarding-badge-modal">🚩 Obrigatório</span>';
        }
        if (currentCourseInfo.desirable) {
            badgesHtml += '<span class="modal-badge desirable-badge-modal">✨ Desejável</span>';
        }
    }
    
    // Construir metadados opcionais
    let metaItems = [];
    if (currentCourseData.duration) {
        metaItems.push(`<span>⏱️ ${currentCourseData.duration}</span>`);
    }
    if (currentCourseData.author) {
        metaItems.push(`<span>👤 ${currentCourseData.author}</span>`);
    }
    if (currentCourseData.lastUpdate) {
        metaItems.push(`<span>📅 ${formatDate(currentCourseData.lastUpdate)}</span>`);
    }
      const metaHtml = metaItems.length > 0 
        ? `<div class="course-modal-meta">${metaItems.join('')}</div>` 
        : '';
    
    // Verifica se tem múltiplas seções para mostrar o sidebar
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
                            <button class="share-course-btn-inline" onclick="copyDeeplinkToClipboard('${courseDeeplink}')">
                                🔗 Copiar link do curso
                            </button>
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
        
        // Gerar deeplink da seção
        const sectionDeeplink = generateDeeplink(
            selectedArea,
            selectedTeam,
            selectedTrack,
            { courseId: currentCourseData.id },
            index
        );
        
        item.innerHTML = `
            <div class="course-section-content">
                <div class="course-section-number">Seção ${index + 1}</div>
                <div class="course-section-title">${section.title}</div>
            </div>
            <button class="copy-section-link-btn" onclick="event.stopPropagation(); copyDeeplinkToClipboard('${sectionDeeplink}')" title="Copiar link desta seção">
                🔗
            </button>
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
    const fullPath = `${currentCourseData.basePath}/${section.content}`;
    
    const response = await fetch(fullPath);
    if (!response.ok) throw new Error('Erro ao carregar markdown');
    
    const markdownText = await response.text();
    
    // Parse markdown
    let htmlContent = markdownText;
    if (markdownParser) {
        htmlContent = markdownParser.parse(markdownText);
    }
      // Fix relative image paths
    htmlContent = fixImagePaths(htmlContent, currentCourseData.basePath);
    
    // Fix relative video paths
    htmlContent = fixVideoPaths(htmlContent, currentCourseData.basePath);

    // Ensure all anchors open in a new tab and have rel="noopener noreferrer"
    // Add target and rel only when not already present
    htmlContent = htmlContent.replace(/<a\s+([^>]*?)href=(['\"])(.*?)\2([^>]*)>/gi, (match, beforeAttrs, q, href, afterAttrs) => {
        const attrs = `${beforeAttrs} ${afterAttrs}`.trim();
        // If target already exists, leave unchanged
        if (/target\s*=\s*/i.test(attrs)) return match;
        // Build new anchor tag with target and rel
        return `<a ${beforeAttrs}href=${q}${href}${q}${afterAttrs} target="_blank" rel="noopener noreferrer">`;
    });
    
    contentArea.innerHTML = `<div class="markdown-content">${htmlContent}</div>`;
}

function fixImagePaths(htmlContent, basePath) {
    // Replace relative image paths with absolute paths
    // Matches: <img src="path/to/image.png"> or <img src="../path/to/image.png">
    return htmlContent.replace(/<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, before, src, after) => {
        // Skip if already absolute (starts with http://, https://, or /)
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
            return match;
        }
        
        // Convert relative path to absolute
        // Remove ../ from the path and use basePath directly
        const cleanSrc = src.replace(/^(\.\.\/)+/, '');
        const absoluteSrc = `${basePath}/${cleanSrc}`;
        
        return `<img${before}src="${absoluteSrc}"${after}>`;
    });
}

function fixVideoPaths(htmlContent, basePath) {
    // Replace relative video source paths with absolute paths
    // Matches: <source src="video.mp4"> inside <video> tags
    htmlContent = htmlContent.replace(/<source([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, before, src, after) => {
        // Skip if already absolute (starts with http://, https://, or /)
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
            return match;
        }
        
        // Convert relative path to absolute
        const cleanSrc = src.replace(/^(\.\.\/)+/, '');
        const absoluteSrc = `${basePath}/${cleanSrc}`;
        
        return `<source${before}src="${absoluteSrc}"${after}>`;
    });
    
    // Also fix poster attribute in video tags
    htmlContent = htmlContent.replace(/<video([^>]*?)poster=["']([^"']+)["']([^>]*?)>/gi, (match, before, poster, after) => {
        // Skip if already absolute
        if (poster.startsWith('http://') || poster.startsWith('https://') || poster.startsWith('/')) {
            return match;
        }
        
        // Convert relative path to absolute
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

// Open external course modal
function openExternalCourseModal(course) {
    const modal = document.createElement('div');
    modal.className = 'external-course-modal';
    modal.id = 'externalCourseModal';
    
    let badgesHtml = '';
    if (course.onboarding) {
        badgesHtml += '<span class="modal-badge onboarding-badge-modal">🚩 Obrigatório para Onboarding</span>';
    }
    if (course.desirable) {
        badgesHtml += '<span class="modal-badge desirable-badge-modal">✨ Desejável</span>';
    }

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
                <button class="modal-cancel-btn" onclick="closeExternalCourseModal()">
                    Cancelar
                </button>
                <a href="${course.link}" target="_blank" class="modal-access-btn">
                    ${course.buttonText || 'Acessar curso'} →
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Close on ESC
    document.addEventListener('keydown', handleExternalModalEsc);
}

function closeExternalCourseModal() {
    const modal = document.getElementById('externalCourseModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    document.removeEventListener('keydown', handleExternalModalEsc);
}

function handleExternalModalEsc(e) {
    if (e.key === 'Escape') {
        closeExternalCourseModal();
    }
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
    if (!hash) {
        console.log('No hash in URL, skipping deeplink processing');
        return;
    }

    console.log('=== PROCESSING DEEPLINK ===');
    console.log('Raw hash:', window.location.hash);
    console.log('Hash without #:', hash);

    const parts = hash.split('/');
    console.log('Hash parts:', parts);
    
    if (parts[0] === '' && parts[1] === 'area' && parts.length >= 3) {
        // Format: #/area/AreaName/TeamName/trackId/courseId/section/0
        const areaName = decodeURIComponent(parts[2]);
        const teamName = parts.length >= 4 ? decodeURIComponent(parts[3]) : null;
        const trackId = parts.length >= 5 ? decodeURIComponent(parts[4]) : null;
        const courseId = parts.length >= 6 ? decodeURIComponent(parts[5]) : null;
        const sectionIndex = parts.length >= 8 && parts[6] === 'section' ? parseInt(parts[7]) : null;
        
        console.log('Decoded params:', { areaName, teamName, trackId, courseId, sectionIndex });
        
        navigateToDeeplink(areaName, teamName, trackId, courseId, sectionIndex);
    } else if (parts[0] === 'area' && parts.length >= 2) {
        // Alternative format: #area/AreaName/TeamName/trackId/courseId/section/0
        const areaName = decodeURIComponent(parts[1]);
        const teamName = parts.length >= 3 ? decodeURIComponent(parts[2]) : null;
        const trackId = parts.length >= 4 ? decodeURIComponent(parts[3]) : null;
        const courseId = parts.length >= 5 ? decodeURIComponent(parts[4]) : null;
        const sectionIndex = parts.length >= 7 && parts[5] === 'section' ? parseInt(parts[6]) : null;
        
        console.log('Decoded params (alt format):', { areaName, teamName, trackId, courseId, sectionIndex });
        
        navigateToDeeplink(areaName, teamName, trackId, courseId, sectionIndex);
    } else {
        console.log('❌ Invalid deeplink format:', parts);
        console.log('Expected format: #/area/AreaName/TeamName/trackId or #area/AreaName/TeamName/trackId');
    }
}

function navigateToDeeplink(areaName, teamName, trackId, courseId, sectionIndex = null) {
    console.log('=== NAVIGATING TO DEEPLINK ===');
    console.log('Raw params:', { areaName, teamName, trackId, courseId, sectionIndex });
    console.log('Areas data loaded:', areasData.length, 'areas');
    
    // Debug: show all available areas
    console.log('Available areas:', areasData.map(a => ({
        original: a.name,
        normalized: normalizeString(a.name)
    })));
    
    // Find area
    const normalizedAreaName = normalizeString(areaName);
    console.log('Looking for area:', areaName, '→ normalized:', normalizedAreaName);
    
    const area = areasData.find(a => {
        const normalized = normalizeString(a.name);
        console.log(`Comparing: "${normalized}" === "${normalizedAreaName}"`, normalized === normalizedAreaName);
        return normalized === normalizedAreaName;
    });
    
    if (!area) {
        console.error('❌ Area not found:', areaName);
        showNotification('Área não encontrada: ' + areaName);
        return;
    }

    console.log('✅ Found area:', area.name);

    // Find team
    if (teamName) {
        const normalizedTeamName = normalizeString(teamName);
        console.log('Looking for team:', teamName, '→ normalized:', normalizedTeamName);
        console.log('Available teams:', area.teams.map(t => ({
            original: t.name,
            normalized: normalizeString(t.name)
        })));
        
        const team = area.teams.find(t => normalizeString(t.name) === normalizedTeamName);
        if (!team) {
            console.error('❌ Team not found:', teamName);
            showNotification('Equipe não encontrada: ' + teamName);
            return;
        }

        console.log('✅ Found team:', team.name);

        // Find track
        if (trackId) {
            console.log('Looking for track:', trackId);
            console.log('Available tracks:', team.tracks.map(tr => tr.id));
            
            const track = team.tracks.find(tr => tr.id === trackId);
            if (!track) {
                console.error('❌ Track not found:', trackId);
                showNotification('Trilha não encontrada: ' + trackId);
                return;
            }

            console.log('✅ Found track:', track.name);

            // Select track
            selectedArea = area;
            selectedTeam = team;
            selectedTrack = track;

            // Expand UI
            const areaIndex = areasData.indexOf(area);
            const teamIndex = area.teams.indexOf(team);
            
            console.log('Expanding UI - area index:', areaIndex, 'team index:', teamIndex);
            
            expandArea(areaIndex);
            expandTeam(areaIndex, teamIndex);
            selectTrackInUI(track);            renderCourses();            // Open specific course if provided
            if (courseId) {
                console.log('Looking for course:', courseId);
                console.log('Available courses:', track.courses.map(c => ({
                    name: c.name,
                    courseId: c.courseId,
                    generatedId: generateCourseId(c.name)
                })));
                
                setTimeout(() => {
                    // Try to find by courseId first, then by generated ID from name
                    let course = track.courses.find(c => c.courseId === courseId);
                    if (!course) {
                        course = track.courses.find(c => generateCourseId(c.name) === courseId);
                    }
                    
                    if (course && course.type === 'manual') {
                        console.log('✅ Opening manual course:', course.name, 'at section:', sectionIndex);
                        openManualCourse(course, sectionIndex);
                    } else if (course && course.link) {
                        console.log('✅ Opening external course modal:', course.name);
                        openExternalCourseModal(course);
                    } else if (course) {
                        console.log('⚠️ Course found but has no link or type:', course);
                    } else {
                        console.error('❌ Course not found:', courseId);
                        showNotification('Curso não encontrado: ' + courseId);
                    }
                }, 500);
            } else {
                console.log('✅ Deeplink navigation complete (no course specified)');
                showNotification('Navegado para: ' + track.name);
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
function generateDeeplink(area, team, track, course = null, sectionIndex = null) {
    let link = `#/area/${encodeURIComponent(area.name)}`;
    if (team) link += `/${encodeURIComponent(team.name)}`;
    if (track) link += `/${encodeURIComponent(track.id)}`;
    if (course) {
        // Use courseId if available, otherwise generate from course name
        const courseIdToUse = course.courseId || generateCourseId(course.name);
        link += `/${encodeURIComponent(courseIdToUse)}`;
        
        // Adicionar índice da seção se fornecido
        if (sectionIndex !== null && sectionIndex !== undefined) {
            link += `/section/${sectionIndex}`;
        }
    }
    return window.location.origin + window.location.pathname + link;
}

// Generate a course ID from course name
function generateCourseId(courseName) {
    return courseName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
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
    console.log('Hash changed to:', window.location.hash);
    processDeeplink();
});
