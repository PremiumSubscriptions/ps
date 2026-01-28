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
        const response = await fetch('courses.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
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
// 3. SPA NAVIGATION (DETAILS VIEW)
// =========================================

// Switch to List View
window.showListView = function() {
    document.getElementById('detailsView').classList.add('hidden');
    document.getElementById('listView').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Switch to Details View
window.showDetails = function(courseId) {
    const course = appState.allCourses.find(c => c.id === courseId);
    if (!course) return;

    // 1. Hide List, Show Details
    document.getElementById('listView').classList.add('hidden');
    document.getElementById('detailsView').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Render Content
    const detailsContainer = document.getElementById('courseDetailsContent');
    const badgeColors = getBadgeColor(course.courseType);
    const imageSrc = (course.image && course.image.length > 5) ? course.image : 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';
    const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    const gradeDisplay = Array.isArray(course.grade) ? course.grade.join(', ') : course.grade;

    // Static Description (As requested)
    const staticDescription = `
        <ul class="text-slate-700 dark:text-slate-300 space-y-2 text-lg">
            <li>📚 <strong>Physics Hunters + ACS</strong> এর মত Exam</li>
            <li>📚 প্রতিদিনের ক্লাস প্রতিদিন।</li>
            <li>📚 নিয়মিত না পেলে রিফান্ড করা হবে।</li>
            <li>▶️ Archive Classes</li>
            <li>➡️ ক্লাস এর লেকচার শীট</li>
            <li>🗒️ Practice Sheet</li>
            <li>➡️ Super Fast Uploading</li>
            <li>➡️ লাইফটাইম এক্সেস</li>
            <li>➡️ ক্লাস সাজানো থাকবে টপিক অনুযায়ী</li>
            <li class="text-red-500 font-bold mt-4 block border-t border-slate-200 dark:border-slate-700 pt-2">(আগের আইডি নষ্ট হলে নতুন আইডি এড করা হবে।)</li>
        </ul>
    `;

    detailsContainer.innerHTML = `
        <div class="details-hero rounded-3xl p-8 mb-8 text-center animate-fade-in shadow-sm">
            <span class="px-4 py-1.5 rounded-full text-sm font-bold bg-white dark:bg-slate-800 border ${badgeColors} mb-4 inline-block shadow-sm">
                ${course.courseType}
            </span>
            <h1 class="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-3 leading-tight">
                ${course.title}
            </h1>
            <p class="text-slate-500 font-medium text-lg">${gradeDisplay}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            <div class="lg:col-span-2 space-y-6">
                <div class="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 group">
                    <img src="${imageSrc}" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" alt="${course.title}">
                    <div class="absolute top-4 right-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg animate-bounce">
                        -${discount}% OFF
                    </div>
                </div>

                <div class="space-y-3">
                    <a href="https://t.me/Premium_Subscriptonpro_bot" target="_blank">
                        <button class="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg">
                            <i data-lucide="zap" class="w-6 h-6"></i> Enroll Now (৳${course.price})
                        </button>
                    </a>
                    <div class="grid grid-cols-2 gap-3">
                        <a href="#" class="w-full py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-2 text-sm">
                            <i data-lucide="send" class="w-4 h-4"></i> Admin
                        </a>
                        <a href="#" class="w-full py-3 rounded-xl font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center justify-center gap-2 text-sm">
                            <i data-lucide="message-circle" class="w-4 h-4"></i> Channel
                        </a>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-3 space-y-8">
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="info-card">
                        <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                            <i data-lucide="users" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <span class="text-sm text-slate-400 font-medium">Students</span>
                        <span class="font-bold text-slate-800 dark:text-white text-lg">${course.students}+</span>
                    </div>
                    <div class="info-card">
                        <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                            <i data-lucide="clock" class="w-5 h-5 text-purple-600 dark:text-purple-400"></i>
                        </div>
                        <span class="text-sm text-slate-400 font-medium">Duration</span>
                        <span class="font-bold text-slate-800 dark:text-white text-lg">${course.duration}</span>
                    </div>
                    <div class="info-card">
                        <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-3">
                            <i data-lucide="star" class="w-5 h-5 text-yellow-600 dark:text-yellow-400"></i>
                        </div>
                        <span class="text-sm text-slate-400 font-medium">Rating</span>
                        <span class="font-bold text-slate-800 dark:text-white text-lg">${course.rating}/5.0</span>
                    </div>
                    <div class="info-card">
                        <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                            <i data-lucide="tag" class="w-5 h-5 text-green-600 dark:text-green-400"></i>
                        </div>
                        <span class="text-sm text-slate-400 font-medium">Price</span>
                        <span class="font-bold text-slate-800 dark:text-white text-lg">
                            ৳${course.price}
                        </span>
                    </div>
                </div>

                <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h3 class="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <span class="text-3xl">📝</span> কোর্স ডিটেইলস
                    </h3>
                    <div class="static-desc-box">
                        ${staticDescription}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Re-init Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// =========================================
// 4. FILTER LOGIC
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

window.setFilter = function(category, value) {
    appState.filters[category] = value;
    renderFilterButtons();
    applySmartFiltering();
};

window.scrollFilter = function(elementId, amount) {
    document.getElementById(elementId)?.scrollBy({ left: amount, behavior: 'smooth' });
}

function applySmartFiltering() {
    const { grade, type } = appState.filters;

    appState.filteredCourses = appState.allCourses.filter(course => {
        const courseGrades = Array.isArray(course.grade) ? course.grade : [course.grade];
        const matchGrade = grade === 'All' || courseGrades.some(g => g.includes(grade) || g === grade);
        const matchType = type === 'All' || course.courseType === type;
        return matchGrade && matchType;
    });

    appState.pagination.currentPage = 1;
    document.getElementById('courseCount').textContent = `Found ${appState.filteredCourses.length} courses`;
    renderGrid();
}

// =========================================
// 5. GRID RENDERING (LIST VIEW)
// =========================================

function renderGrid() {
    const grid = document.getElementById('coursesGrid');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    if (!grid) return;

    const { currentPage, itemsPerPage } = appState.pagination;
    const limit = currentPage * itemsPerPage;
    const coursesToShow = appState.filteredCourses.slice(0, limit);

    if (coursesToShow.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <i data-lucide="search-x" class="w-16 h-16 mb-4 opacity-50"></i>
                <p class="text-lg">No courses found matching your criteria.</p>
                <button onclick="setFilter('grade', 'All'); setFilter('type', 'All')" class="mt-4 text-blue-600 font-bold hover:underline">Clear Filters</button>
            </div>
        `;
        if(loadMoreContainer) loadMoreContainer.classList.add('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    grid.innerHTML = coursesToShow.map(course => generateCardHTML(course)).join('');

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

    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof lozad !== 'undefined') lozad('.lozad').observe();
}

window.loadMoreCourses = function() {
    appState.pagination.currentPage++;
    renderGrid();
};

// =========================================
// 6. CARD GENERATOR (LIST VIEW ITEM)
// =========================================

function generateCardHTML(course) {
    const badgeColors = getBadgeColor(course.courseType);
    const imageSrc = (course.image && course.image.length > 5) ? course.image : 'https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';
    const gradeDisplay = Array.isArray(course.grade) ? course.grade[0] : course.grade;

    return `
    <div class="course-card-hover bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full fade-in-up group">
        
        <div class="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img data-src="${imageSrc}" 
                 class="lozad w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 alt="${course.title}"
                 onerror="this.onerror=null; this.src='https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Image';">
                 
            <div class="absolute top-3 left-3">
                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${badgeColors} bg-white/95 backdrop-blur shadow-sm">
                    ${course.courseType}
                </span>
            </div>
            
            <div class="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm text-slate-800">
                <i data-lucide="star" class="w-3 h-3 text-yellow-500 fill-yellow-500"></i> ${course.rating}
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

            <div class="flex items-center justify-between mt-2 gap-2">
                <div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-xl font-black text-slate-900 dark:text-white">৳${course.price}</span>
                        <span class="text-xs text-slate-400 line-through">৳${course.originalPrice}</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                     <button onclick="showDetails(${course.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all border border-slate-200 dark:border-slate-600">
                        Details
                    </button>
                    <a href="https://t.me/Premium_Subscriptonpro_bot" target="_blank">
                        <button class="bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-105 transition-all">
                            Enroll
                        </button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Helper for Colors
function getBadgeColor(type) {
    const map = {
        'ACS': 'bg-red-50 text-red-600 border-red-100',
        'UDVASH': 'bg-orange-50 text-orange-600 border-orange-100',
        'Physics Hunters': 'bg-purple-50 text-purple-600 border-purple-100',
        'Bondi Pathshala': 'bg-blue-50 text-blue-600 border-blue-100',
        'RTDS': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'default': 'bg-slate-50 text-slate-600 border-slate-100'
    };
    return map[type] || map['default'];
}

// =========================================
// 7. UTILITIES
// =========================================

function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const isHidden = menu.classList.contains('hidden');
            toggleBtn.innerHTML = isHidden ? `<i data-lucide="menu" class="w-6 h-6"></i>` : `<i data-lucide="x" class="w-6 h-6"></i>`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }
}

function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if(btn) {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
            
            const icon = btn.querySelector('i');
            if(icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            if(typeof lucide !== 'undefined') lucide.createIcons();
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


