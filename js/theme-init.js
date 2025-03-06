/**
 * 主题初始化脚本
 * 用于在所有页面加载时应用保存的主题设置
 */

// 在页面加载时初始化主题设置
document.addEventListener('DOMContentLoaded', function() {
    // 应用深色模式
    applyDarkMode();
    
    // 应用主题颜色
    applyThemeColor();
    
    // 应用字体大小
    applyFontSize();
    
    // 如果启用了自动切换，设置定时器
    setupAutoSwitch();
});

// 应用深色模式
function applyDarkMode() {
    const darkModeType = localStorage.getItem('darkModeType') || 'light';
    
    if (darkModeType === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (darkModeType === 'light') {
        document.body.classList.remove('dark-mode');
    } else if (darkModeType === 'system') {
        // 检测系统深色模式
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // 监听系统深色模式变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        });
    }
}

// 应用主题颜色
function applyThemeColor() {
    const themeColor = localStorage.getItem('themeColor') || 'red';
    
    // 移除所有主题颜色类
    document.body.classList.remove('theme-red', 'theme-blue', 'theme-green', 'theme-purple', 'theme-orange');
    
    // 添加选中的主题颜色类
    document.body.classList.add(`theme-${themeColor}`);
    
    // 更新CSS变量
    const colors = {
        'red': '#ff2442',
        'blue': '#007AFF',
        'green': '#34C759',
        'purple': '#AF52DE',
        'orange': '#FF9500'
    };
    
    document.documentElement.style.setProperty('--primary-color', colors[themeColor]);
    document.documentElement.style.setProperty('--primary-color-dark', adjustColorBrightness(colors[themeColor], -20));
}

// 应用字体大小
function applyFontSize() {
    const fontSize = localStorage.getItem('fontSize') || '2';
    
    // 移除所有字体大小类
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge');
    
    // 添加对应的字体大小类
    const sizeClasses = ['font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge'];
    document.body.classList.add(sizeClasses[fontSize - 1]);
}

// 设置自动切换
function setupAutoSwitch() {
    const autoSwitch = localStorage.getItem('autoSwitch');
    
    if (autoSwitch === 'enabled') {
        // 立即检查一次
        checkDarkModeTime();
        
        // 设置定时器每分钟检查一次
        setInterval(checkDarkModeTime, 60000);
    }
}

// 检查当前时间是否在深色模式时间范围内
function checkDarkModeTime() {
    const startTime = localStorage.getItem('startTime') || '20:00';
    const endTime = localStorage.getItem('endTime') || '6:00';
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const isNightTime = (
        (hours > startHour || (hours === startHour && minutes >= startMinute)) ||
        (hours < endHour || (hours === endHour && minutes < endMinute))
    );
    
    if (isNightTime) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// 调整颜色亮度
function adjustColorBrightness(hex, percent) {
    // 将十六进制颜色转换为RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // 调整亮度
    r = Math.max(0, Math.min(255, r + percent));
    g = Math.max(0, Math.min(255, g + percent));
    b = Math.max(0, Math.min(255, b + percent));
    
    // 转换回十六进制
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
} 