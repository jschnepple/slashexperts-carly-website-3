// Integrations Page JavaScript

export function initIntegrations() {
    // Category Tab Filtering
    const categoryTabs = document.querySelectorAll('.category-tab');
    const integrationCards = document.querySelectorAll('.integration-card');
    const categoryDescription = document.getElementById('categoryDescription');

    // Calculate and update category counts dynamically
    updateCategoryCounts(categoryTabs, integrationCards);

    const categoryDescriptions = {
        all: {
            title: 'All Integrations',
            desc: 'Browse our complete library of integrations designed to embed your booking system across every customer touchpoint and accelerate your pipeline.'
        },
        crm: {
            title: 'CRM Integrations',
            desc: 'Sync activities, contacts, and campaigns to track the success of your expert programs directly inside your CRM.'
        },
        sales: {
            title: 'Sales Engagement Integrations',
            desc: 'Embed your booking system within outbound sequences giving prospects a new and enticing reason to engage with your SDRs.'
        },
        demo: {
            title: 'Demo Automation Integrations',
            desc: 'Add your booking link to interactive demos for stronger CTAs that convert demo viewers into real conversations.'
        },
        intent: {
            title: 'Web Intent Integrations',
            desc: 'Convert more web intent by offering high-value visitors the opportunity to book meetings with real customers.'
        },
        chat: {
            title: 'Chat Integrations',
            desc: 'Share your booking link in live chats for instant access to peer validation when prospects need it most.'
        },
        nps: {
            title: 'NPS Integrations',
            desc: 'Automatically identify and recruit your happiest customers based on NPS scores to join your expert program.'
        },
        'customer-reference': {
            title: 'Customer Reference Integrations',
            desc: 'Connect with leading customer reference platforms to streamline expert recruitment and management.'
        },
        'mutual-action': {
            title: 'Mutual Action Plans Integrations',
            desc: 'Embed expert calls as key milestones in your mutual action plans to accelerate deal progression.'
        },
        webinars: {
            title: 'Webinar Integrations',
            desc: 'Feature your experts in webinars and enable attendees to book follow-up conversations.'
        },
        personalization: {
            title: 'Web Personalization Integrations',
            desc: 'Deliver personalized expert booking experiences based on visitor attributes and behavior.'
        },
        optimization: {
            title: 'Web Optimization Integrations',
            desc: 'A/B test and optimize your booking system placement for maximum conversion.'
        },
        cms: {
            title: 'Website/CMS Integrations',
            desc: 'Easily embed your booking system on any website or CMS with simple code snippets.'
        }
    };

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update description
            const descData = categoryDescriptions[category];
            if (descData && categoryDescription) {
                categoryDescription.innerHTML = `
                    <h3>${descData.title}</h3>
                    <p>${descData.desc}</p>
                `;
            }

            // Filter cards with animation
            integrationCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 60);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Make entire integration card clickable
    integrationCards.forEach(card => {
        const cardLink = card.querySelector('.card-link');
        if (cardLink) {
            const href = cardLink.getAttribute('href');

            // Add cursor pointer to indicate clickability
            card.style.cursor = 'pointer';

            // Handle card click
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on the actual link (let it handle itself)
                if (e.target.closest('.card-link')) {
                    return;
                }
                // Open link in new tab
                window.open(href, '_blank', 'noopener,noreferrer');
            });
        }
    });
}

/**
 * Calculate and update category counts dynamically
 * Updates the text in each category tab to show accurate counts
 * Also updates hero badge count and stats section
 */
function updateCategoryCounts(categoryTabs, integrationCards) {
    // Count cards per category
    const categoryCounts = {};
    let totalCount = 0;

    integrationCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (category) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            totalCount++;
        }
    });

    // Category display names mapping
    const categoryNames = {
        'all': 'All Integrations',
        'demo': 'Demo Automation',
        'nps': 'NPS',
        'customer-reference': 'Customer Reference',
        'mutual-action': 'Mutual Action Plans',
        'webinars': 'Webinars',
        'intent': 'Web Intent',
        'sales': 'Sales Engagement',
        'personalization': 'Web Personalization',
        'optimization': 'Web Optimization',
        'chat': 'Chat',
        'cms': 'Website/CMS',
        'crm': 'CRM'
    };

    // Update each tab with the correct count
    categoryTabs.forEach(tab => {
        const category = tab.getAttribute('data-category');
        const displayName = categoryNames[category] || category;
        const count = category === 'all' ? totalCount : (categoryCounts[category] || 0);

        tab.textContent = `${displayName} (${count})`;
    });

    // Update hero badge count
    const badgeCount = document.querySelector('.badge-count');
    if (badgeCount) {
        badgeCount.textContent = totalCount;
    }

    // Update stats section - first stat-value (Native Integrations)
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length > 0) {
        statValues[0].textContent = totalCount;
    }
}
