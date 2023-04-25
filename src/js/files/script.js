// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from './functions.js';
// Подключение списка активных модулей
import { flsModules } from './modules.js';
import * as flsFunctions from './functions.js';

document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", documentActions);

    // Actions (click event delegation)
    function documentActions(e) {
        const targetElement = e.target;
        if (window.innerWidth > 768 && isMobile.any()) {
            if (targetElement.classList.contains('menu__arrow')) {
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                flsFunctions.removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
            }
        }
    }
})
