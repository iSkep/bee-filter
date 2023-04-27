import { isMobile } from './functions.js';
import { flsModules } from './modules.js';
import * as flsFunctions from './functions.js';
import * as flsForms from './forms/forms.js';
import { rangeItems } from './forms/range.js';
import { postData, getResource } from '../files/services/services.js';

document.addEventListener('DOMContentLoaded', function () {
    resetBtnInit();
    getResource('http://localhost:3001/numbers?_embed=products').then((data) => createTable(data));

    document.addEventListener('click', documentActions);

    function documentActions(e) {
        const targetElement = e.target;

        if (window.innerWidth > 768 && isMobile.any()) {
            if (targetElement.classList.contains('menu__arrow')) {
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                flsFunctions.removeClasses(document.querySelectorAll('.menu__item._hover'), '_hover');
            }
        }
    }

    function resetBtnInit() {
        const resetBtn = document.querySelector('.filter__reset');
        const checkboxes = document.querySelectorAll('.filter input[type=checkbox]');
        const radios = document.querySelectorAll('.filter input[type=radio]');
        const ratings = document.querySelectorAll('.rating__value');
        const selectOptions = document.querySelectorAll('.select__option');

        if (resetBtn) {
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
                selectTags.forEach((tag) => {
                    tag.remove();
                });

                selectOptions.forEach((option) => {
                    option.classList.remove('_select-selected');
                });
            });
        }
    }

    function createTable(data) {
        data.forEach(({ number, date, products }) => {
            const parentSelector = document.querySelector('.spoilers');
            const element = document.createElement('div');
            element.classList.add('spoilers__item');
            const tableRows = products
                .map((product) => {
                    let clothType;

                    switch (product.clothId) {
                        case '1':
                            clothType = 'jacket';
                            break;
                        case '2':
                            clothType = 'watch';
                            break;
                        case '3':
                            clothType = 'pants';
                            break;
                        case '4':
                            clothType = 'robe';
                            break;
                        case '5':
                            clothType = 'blouse';
                            break;
                        case '6':
                            clothType = 'shoes';
                            break;
                        default:
                            clothType = '';
                    }

                    return `
                    <tr>
                        <td>${product.type}</td>
                        <td>${product.hairiness}</td>
                        <td class="spoilers__image">
                            <svg>
                                <use xlink:href="../../img/icons/sprite.svg#svg-${clothType}"></use>
                            </svg>
                        </td>
                        <td class="spoilers__price">${product.price}</td>
                    </tr>
                `;
                })
                .join('');

            element.innerHTML = `
            <button class="spoilers__button" type="button" data-spoiler>
                <span class="spoilers__number">№${number}</span>
                <span class="spoilers__date">${date}</span>
            </button>
            <div class="spoilers__body" hidden>
                <table class="spoilers__table">
                    <colgroup>
                        <col class="spoilers__col-1" />
                        <col class="spoilers__col-2" />
                        <col class="spoilers__col-3" />
                        <col class="spoilers__col-4" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Вид пчел</th>
                            <th>Волосатость брюшка пчелы</th>
                            <th>Одежда</th>
                            <th>Цена</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>`;

            parentSelector.append(element);
        });
    }
});
