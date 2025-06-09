// Fashion Trends Page JavaScript

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupEventListeners();
    addPageAnimations();
});

let styleChart, colorChart, brandChart;

// Sample data for style categories
const styleData = {
    all: {
        categories: ['Casual Wear', 'Athleisure', 'Bohemian', 'Minimalist', 'Vintage', 'Streetwear'],
        values: [73, 45, 32, 28, 25, 22]
    },
    male: {
        categories: ['Casual Wear', 'Streetwear', 'Athleisure', 'Minimalist', 'Vintage', 'Smart Casual'],
        values: [68, 35, 42, 31, 18, 24]
    },
    female: {
        categories: ['Casual Wear', 'Bohemian', 'Athleisure', 'Vintage', 'Minimalist', 'Romantic'],
        values: [78, 48, 38, 32, 25, 29]
    },
    unisex: {
        categories: ['Casual Wear', 'Athleisure', 'Minimalist', 'Streetwear', 'Sustainable', 'Tech Wear'],
        values: [82, 56, 41, 28, 35, 19]
    }
};

// Sample data for color trends
const colorData = {
    colors: [
        { name: 'Earth Tones', value: 35, color: '#8B4513' },
        { name: 'Pastel Colors', value: 28, color: '#FFB6C1' },
        { name: 'Vibrant Blues', value: 25, color: '#4169E1' },
        { name: 'Forest Green', value: 22, color: '#228B22' },
        { name: 'Sunset Orange', value: 18, color: '#FF6347' },
        { name: 'Classic Black', value: 45, color: '#000000' },
        { name: 'Pure White', value: 38, color: '#FFFFFF' },
        { name: 'Coral Pink', value: 15, color: '#FF7F50' }
    ],
    patterns: [
        { name: 'Solid Colors', value: 52 },
        { name: 'Floral Prints', value: 28 },
        { name: 'Geometric', value: 18 },
        { name: 'Stripes', value: 15 },
        { name: 'Abstract', value: 12 },
        { name: 'Animal Print', value: 8 }
    ]
};

// Sample data for brand preferences
const brandData = {
    categories: ['Sportswear', 'Casual', 'Sustainable', 'Luxury', 'Local Brands'],
    brands: {
        'Sportswear': [
            { name: 'Nike', value: 32 },
            { name: 'Adidas', value: 28 },
            { name: 'Uniqlo', value: 25 },
            { name: 'Lululemon', value: 15 }
        ],
        'Casual': [
            { name: 'Zara', value: 35 },
            { name: 'H&M', value: 28 },
            { name: 'Uniqlo', value: 22 },
            { name: 'Muji', value: 15 }
        ],
        'Sustainable': [
            { name: 'Patagonia', value: 25 },
            { name: 'Everlane', value: 22 },
            { name: 'Local Artisans', value: 35 },
            { name: 'Reformation', value: 18 }
        ],
        'Luxury': [
            { name: 'Gucci', value: 28 },
            { name: 'Louis Vuitton', value: 25 },
            { name: 'Prada', value: 22 },
            { name: 'Hermès', value: 25 }
        ],
        'Local Brands': [
            { name: 'JNBY', value: 32 },
            { name: 'Exception', value: 28 },
            { name: 'ICICLE', value: 25 },
            { name: 'Local Designers', value: 15 }
        ]
    }
};

function initializeCharts() {
    initStyleChart();
    initColorChart();
    initBrandChart();
}

function initStyleChart() {
    const chartDom = document.getElementById('styleChart');
    styleChart = echarts.init(chartDom);
    
    updateStyleChart('all');
}

function updateStyleChart(gender) {
    const data = styleData[gender] || styleData.all;
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                return `<div style="padding: 8px; background: rgba(0,0,0,0.8); border-radius: 4px; color: white;">
                    <strong>${params[0].name}</strong><br/>
                    Popularity: ${params[0].value}%
                </div>`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.categories,
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisLabel: {
                color: '#666',
                fontSize: 11,
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisLabel: {
                color: '#666',
                fontSize: 11,
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: [{
            type: 'bar',
            data: data.values.map((value, index) => ({
                value: value,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index % 6] },
                            { offset: 1, color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index % 6] + '80' }
                        ]
                    },
                    borderRadius: [4, 4, 0, 0]
                }
            })),
            barWidth: '60%',
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.3)'
                }
            }
        }]
    };
    
    styleChart.setOption(option, true);
}

function initColorChart() {
    const chartDom = document.getElementById('colorChart');
    colorChart = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return `<div style="padding: 8px; background: rgba(0,0,0,0.8); border-radius: 4px; color: white;">
                    <strong>${params.name}</strong><br/>
                    Popularity: ${params.value}%
                </div>`;
            }
        },
        legend: {
            orient: 'horizontal',
            bottom: '5%',
            textStyle: {
                color: '#666',
                fontSize: 11
            }
        },
        series: [
            {
                name: 'Colors',
                type: 'pie',
                radius: ['20%', '45%'],
                center: ['25%', '45%'],
                data: colorData.colors.map(item => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                        color: item.color === '#FFFFFF' ? '#f0f0f0' : item.color,
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false
                }
            },
            {
                name: 'Patterns',
                type: 'pie',
                radius: ['20%', '45%'],
                center: ['75%', '45%'],
                data: colorData.patterns.map((item, index) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index],
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false
                }
            }
        ]
    };
    
    colorChart.setOption(option);
}

function initBrandChart() {
    const chartDom = document.getElementById('brandChart');
    brandChart = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                let result = `<div style="padding: 8px; background: rgba(0,0,0,0.8); border-radius: 4px; color: white;">`;
                result += `<strong>${params[0].axisValue}</strong><br/>`;
                params.forEach(param => {
                    result += `<div style="margin: 4px 0;">
                        <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                        ${param.seriesName}: ${param.value}%
                    </div>`;
                });
                result += '</div>';
                return result;
            }
        },
        legend: {
            data: Object.keys(brandData.brands),
            textStyle: {
                color: '#666',
                fontSize: 12
            },
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: brandData.categories,
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisLabel: {
                color: '#666',
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisLabel: {
                color: '#666',
                fontSize: 11,
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: Object.keys(brandData.brands).map((category, index) => {
            const categoryData = new Array(brandData.categories.length).fill(0);
            const categoryIndex = brandData.categories.indexOf(category);
            if (categoryIndex !== -1) {
                categoryData[categoryIndex] = brandData.brands[category].reduce((sum, brand) => sum + brand.value, 0) / brandData.brands[category].length;
            }
            
            return {
                name: category,
                type: 'bar',
                stack: 'total',
                data: categoryData,
                itemStyle: {
                    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index],
                    borderRadius: index === Object.keys(brandData.brands).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.3)'
                    }
                }
            };
        })
    };
    
    brandChart.setOption(option);
}

function setupEventListeners() {
    // Gender filter
    const genderFilter = document.getElementById('genderFilter');
    if (genderFilter) {
        genderFilter.addEventListener('change', function() {
            updateStyleChart(this.value);
        });
    }
    
    // Age group filter (placeholder for future implementation)
    const ageGroup = document.getElementById('ageGroup');
    if (ageGroup) {
        ageGroup.addEventListener('change', function() {
            // Future implementation for age-based filtering
            console.log('Age group changed to:', this.value);
        });
    }
    
    // Trend item interactions
    const trendItems = document.querySelectorAll('.trend-item');
    trendItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });
    
    // Lifestyle card interactions
    const lifestyleCards = document.querySelectorAll('.lifestyle-card');
    lifestyleCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
}

function addPageAnimations() {
    // Animate stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Animate trend categories
    const trendCategories = document.querySelectorAll('.trend-category');
    trendCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            category.style.transition = 'all 0.6s ease';
            category.style.opacity = '1';
            category.style.transform = 'translateX(0)';
        }, 800 + index * 200);
    });
    
    // Animate behavior cards
    const behaviorCards = document.querySelectorAll('.behavior-card');
    behaviorCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 1200 + index * 100);
    });
    
    // Animate lifestyle cards
    const lifestyleCards = document.querySelectorAll('.lifestyle-card');
    lifestyleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1600 + index * 150);
    });
    
    // Animate insight cards
    const insightCards = document.querySelectorAll('.insight-card');
    insightCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 2000 + index * 200);
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    if (styleChart) {
        styleChart.resize();
    }
    if (colorChart) {
        colorChart.resize();
    }
    if (brandChart) {
        brandChart.resize();
    }
});

// Export chart functionality
function exportChart(chartInstance, filename) {
    if (chartInstance) {
        const url = chartInstance.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
    }
}

// Add export buttons functionality (if needed)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                exportChart(styleChart, 'style-trends.png');
                break;
            case 'c':
                e.preventDefault();
                exportChart(colorChart, 'color-trends.png');
                break;
            case 'b':
                e.preventDefault();
                exportChart(brandChart, 'brand-preferences.png');
                break;
        }
    }
});