import { isMobile } from './functions.js';
import { flsModules } from './modules.js';
import * as flsFunctions from './functions.js';
import * as flsForms from './forms/forms.js';
import { rangeItems } from './forms/range.js';

document.addEventListener("DOMContentLoaded", function() {
    resetBtnInit();
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

    function resetBtnInit() {
        const resetBtn = document.querySelector('.filter__reset');
        const checkboxes = document.querySelectorAll('.filter input[type=checkbox]');
        const radios = document.querySelectorAll('.filter input[type=radio]');
        const ratings = document.querySelectorAll('.rating__value')
        const selectOptions = document.querySelectorAll('.select__option');
    
        resetBtn.addEventListener('click', () => {
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });

            radios.forEach((radio) => {
                radio.checked = false;
            });

            ratings.forEach((rating) => {
                rating.innerHTML = '3';
                flsForms.formRating();
            });
            
            rangeItems.forEach((rangeItem) => {
                const item = rangeItem.querySelector('[data-range-item]');
                item.noUiSlider.reset();
            });

            const selectTags = document.querySelectorAll('._select-tag');
            selectTags.forEach(tag => {
                tag.remove();
            });

            selectOptions.forEach(option => {
                option.classList.remove('_select-selected');
            });
        });
    }
})
