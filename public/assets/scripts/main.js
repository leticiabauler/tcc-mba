// Global state
let areasData = [];
let selectedArea = null;
let selectedTeam = null;
let selectedTrack = null;

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
            tracksTree.id = `tracks-${areaIndex}-${teamIndex}`;

            team.tracks.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item';

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
        if (course.link) {
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

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadAreas();
});
