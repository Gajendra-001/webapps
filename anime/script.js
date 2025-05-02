const UNSPLASH_ACCESS_KEY = 'n_UHyIKaHVQcFWvLo7ZZ2rH_ckocawacnfgWaOzOyCM';
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const categoryBtns = document.querySelectorAll('.category-btn');

let currentCategory = 'cartoon';
let currentPage = 1;
let isLoading = false;

// Function to show loading state
function showLoading() {
    loading.style.display = 'flex';
    isLoading = true;
}

// Function to hide loading state
function hideLoading() {
    loading.style.display = 'none';
    isLoading = false;
}

// Function to create gallery item
function createGalleryItem(image) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    item.innerHTML = `
        <img src="${image.urls.regular}" alt="${image.alt_description || 'Cartoon/Anime Image'}" loading="lazy">
        <div class="overlay">
            <p>${image.alt_description || 'Cartoon/Anime Image'}</p>
            <p>By ${image.user.name}</p>
        </div>
    `;
    
    return item;
}

// Function to fetch images from Unsplash
async function fetchImages(query = '', category = currentCategory) {
    showLoading();
    
    try {
        const searchQuery = query || category;
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${searchQuery}&page=${currentPage}&per_page=12`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }
        
        const data = await response.json();
        
        // Clear gallery if it's a new search
        if (currentPage === 1) {
            gallery.innerHTML = '';
        }
        
        // Add new images to gallery
        data.results.forEach(image => {
            gallery.appendChild(createGalleryItem(image));
        });
        
        currentPage++;
    } catch (error) {
        console.error('Error fetching images:', error);
        gallery.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Error loading images. Please try again.</p>';
    } finally {
        hideLoading();
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    currentPage = 1;
    fetchImages(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentPage = 1;
        fetchImages(searchInput.value);
    }
});

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        currentPage = 1;
        fetchImages('', currentCategory);
    });
});

// Infinite scroll
window.addEventListener('scroll', () => {
    if (isLoading) return;
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        fetchImages(searchInput.value);
    }
});

// Initial load
fetchImages(); 