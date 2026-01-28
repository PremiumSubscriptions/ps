// =========================================
// 1. APP STATE & CONFIGURATION
// =========================================
const appState = {
    allCourses: [],      // Will be populated from courses.json
    filteredCourses: [], // Subset of courses currently visible
    filters: {
        grade: 'All', 
        type: 'All'
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 12
    },
    isLoading: true
};

// =========================================
// 2. INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
        const icon = document.querySelector('#themeToggle i');
        if(icon) icon.setAttribute('data-lucide', 'sun');
    }

    setupMobileMenu();
    setupThemeToggle();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    // Generate Footer Particles
    generateFooterParticles();
});

async function initApp() {
    const grid = document.getElementById('coursesGrid');
    
    // Show Loading State
    if(grid) {
        grid.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>`;
    }

    try {
        // ⚡ FETCH DATA FROM JSON FILE
        // Make sure 'courses.json' is in the same directory
        const response = await fetch('courses.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validation: Ensure data is an array
        if (!Array.isArray(data)) {
            throw new Error('Data format error: Expected an array of courses.');
        }

        appState.allCourses = data;
        appState.isLoading = false;

        // Initialize UI
        renderFilterButtons();
        applySmartFiltering();

    } catch (error) {
        console.error("Failed to load courses:", error);
        appState.isLoading = false;
        
        if(grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <i data-lucide="alert-triangle" class="w-8 h-8 text-red-600"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Unable to Load Courses</h3>
                    <p class="text-slate-500 max-w-md mx-auto mb-6">We couldn't retrieve the course list. Please check your internet connection or try again later.</p>
                    <button onclick="window.location.reload()" class="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
                        Retry
                    </button>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
}

// =========================================
// 3. FILTER SYSTEM LOGIC
// =========================================

function renderFilterButtons() {
    const grades = ['All', 'HSC 26', 'HSC 27', 'Admission 24', 'Admission 25', 'Admission 26'];
    const types = ['All', 'ACS', 'UDVASH', 'Physics Hunters', 'Bondi Pathshala', 'RTDS', 'Battle of Biology', 'Alchemy', 'CPS'];

    const createBtn = (text, category) => `
        <button onclick="setFilter('${category}', '${text}')" 
                class="filter-btn ${appState.filters[category] === text ? 'active' : ''}">
            ${text}
        </button>
    `;

    const gradeEl = document.getElementById('gradeFilters');
    const typeEl = document.getElementById('typeFilters');
    
    if (gradeEl) gradeEl.innerHTML = grades.map(g => createBtn(g, 'grade')).join('');
    if (typeEl) typeEl.innerHTML = types.map(t => createBtn(t, 'type')).join('');
}

// Global function for button clicks
window.setFilter = function(category, value) {
    // 1. Update State
    appState.filters[category] = value;
    
    // 2. Update UI (Re-render buttons to show active state)
    renderFilterButtons();
    
    // 3. Apply Filtering
    applySmartFiltering();
};

function applySmartFiltering() {
    const { grade, type } = appState.filters;

    appState.filteredCourses = appState.allCourses.filter(course => {
        // Robust check: Handle if grade is a string or array in JSON
        const courseGrades = Array.isArray(course.grade) ? course.grade : [course.grade];
        // Check if ANY of the course grades match the filter OR if filter is 'All'
        // Using partial matching for more flexibility (e.g., 'Admission 25' matches 'Admission')
        const matchGrade = grade === 'All' || courseGrades.some(g => g.includes(grade) || g === grade);

        const matchType = type === 'All' || course.courseType === type;

        return matchGrade && matchType;
    });

    // Reset to page 1 on filter change
    appState.pagination.currentPage = 1;
    
    // Update Count
    const countEl = document.getElementById('courseCount');
    if (countEl) {
        countEl.textContent = `Found ${appState.filteredCourses.length} courses`;
        countEl.classList.remove('animate-pulse');
    }
    
    renderGrid();
}

// =========================================
// 4. GRID & PAGINATION RENDERING
// =========================================

function renderGrid() {
    const grid = document.getElementById('coursesGrid');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    if (!grid) return;

    const { currentPage, itemsPerPage } = appState.pagination;
    const limit = currentPage * itemsPerPage;
    const coursesToShow = appState.filteredCourses.slice(0, limit);

    // Empty State
    if (coursesToShow.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <i data-lucide="search-x" class="w-16 h-16 mb-4 opacity-50"></i>
                <p class="text-lg font-medium text-slate-600 dark:text-slate-300">No courses found matching your criteria.</p>
                <button onclick="setFilter('grade', 'All'); setFilter('type', 'All')" class="mt-4 text-blue-600 font-bold hover:underline">
                    Clear Filters
                </button>
            </div>
        `;
        if(loadMoreContainer) loadMoreContainer.classList.add('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    // Generate HTML
    grid.innerHTML = coursesToShow.map(course => generateCardHTML(course)).join('');

    // Handle "Load More" Button
    if (loadMoreContainer) {
        if (limit < appState.filteredCourses.length) {
            loadMoreContainer.classList.remove('hidden');
            loadMoreContainer.innerHTML = `
                <button onclick="loadMoreCourses()" class="px-8 py-3 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md transform active:scale-95">
                    Load More (${appState.filteredCourses.length - limit} remaining)
                </button>
            `;
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }

    // Re-initialize Utilities
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof lozad !== 'undefined') {
        const observer = lozad('.lozad');
        observer.observe();
    }
}

window.loadMoreCourses = function() {
    appState.pagination.currentPage++;
    renderGrid();
};

// =========================================
// 5. HTML CARD GENERATOR
// =========================================

function generateCardHTML(course) {
    // Badge Styling Map
    const badgeStyles = {
        'ACS': 'bg-red-50 text-red-600 border-red-100',
        'UDVASH': 'bg-orange-50 text-orange-600 border-orange-100',
        'Physics Hunters': 'bg-purple-50 text-purple-600 border-purple-100',
        'Bondi Pathshala': 'bg-blue-50 text-blue-600 border-blue-100',
        'RTDS': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'default': 'bg-slate-50 text-slate-600 border-slate-100'
    };
    
    const badgeClass = badgeStyles[course.courseType] || badgeStyles['default'];
    
    // Robust Image Handling
    const fallbackImage = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';
    const imageSrc = (course.image && course.image.length > 5) ? course.image : fallbackImage;

    // Handle Grade Display (Array vs String)
    const gradeDisplay = Array.isArray(course.grade) ? course.grade[0] : course.grade;

    return `
    <div class="course-card-hover bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full fade-in-up group">
        
        <div class="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img data-src="${imageSrc}" 
                 class="lozad w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 alt="${course.title}"
                 onerror="this.onerror=null; this.src='${fallbackImage}';">
                 
            <div class="absolute top-3 left-3">
                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeClass} bg-white/95 backdrop-blur shadow-sm">
                    ${course.courseType}
                </span>
            </div>
            
            <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm text-slate-800">
                <i data-lucide="star" class="w-3 h-3 text-yellow-500 fill-yellow-500"></i> ${course.rating || 'N/A'}
            </div>
        </div>

        <div class="p-5 flex flex-col flex-grow">
            <div class="mb-2">
                <span class="inline-block text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded border border-blue-100 dark:border-blue-800">
                    ${gradeDisplay}
                </span>
            </div>

            <h3 class="text-lg font-bold text-slate-800 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors" title="${course.title}">
                ${course.title}
            </h3>

            <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 mt-auto border-t border-slate-50 dark:border-slate-700/50 pt-3">
                <div class="flex items-center gap-1.5">
                    <i data-lucide="users" class="w-3.5 h-3.5"></i> ${course.students}+ Enrolled
                </div>
                <div class="flex items-center gap-1.5">
                    <i data-lucide="clock" class="w-3.5 h-3.5"></i> ${course.duration}
                </div>
            </div>

            <div class="flex items-center justify-between mt-2">
                <div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-xl font-black text-slate-900 dark:text-white">৳${course.price}</span>
                        <span class="text-xs text-slate-400 line-through">৳${course.originalPrice}</span>
                    </div>
                </div>
                <a href="https://t.me/Premium_Subscriptonpro_bot" target="_blank">
                    <button class="bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-105 transition-all">
                        Enroll Now
                    </button>
                </a>
            </div>
        </div>
    </div>
    `;
}

// =========================================
// 6. UTILITIES (Mobile Menu, Scroll, Theme, Particles)
// =========================================

function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const isHidden = menu.classList.contains('hidden');
            // Toggle Icon logic
            toggleBtn.innerHTML = isHidden ? `<i data-lucide="menu" class="w-6 h-6"></i>` : `<i data-lucide="x" class="w-6 h-6"></i>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if(themeToggle){
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Toggle Icon
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }
}

function generateFooterParticles() {
    const container = document.getElementById('footerParticles');
    if (!container) return;
 
    const particles = 20;
 
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        const colors = ['bg-purple-400', 'bg-pink-400', 'bg-cyan-400', 'bg-blue-400'];
 
        particle.className = `absolute w-1 h-1 rounded-full animate-float opacity-30 ${colors[i % colors.length]}`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 3 + 4}s`;
 
        container.appendChild(particle);
    }
}
