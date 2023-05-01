import { isMobile } from './functions.js';
import { flsModules } from './modules.js';
import * as flsFunctions from './functions.js';
import * as flsForms from './forms/forms.js';
import { rangeItems } from './forms/range.js';
import { postData, getResource } from '../files/services/services.js';
import { v4 as uuidv4 } from 'uuid';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#mainForm');
    let recordNumber = 125551;

    resetBtnInit();
    sendBtnInit(form);
    document.addEventListener('click', documentActions);

    if (window.location.pathname === '/data-table.html') {
        getResource('http://localhost:3001/numbers?_embed=products').then((data) => createTable(data));
    }

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
                    const clothTypes = ['', 'jacket', 'watch', 'pants', 'robe', 'blouse', 'shoes'];
                    let clothType = clothTypes[product.clothId];

                    const hairinessNames = [
                        '',
                        'Большая индийская пчела',
                        'Медоносная пчела',
                        'Индийская пчела',
                        'Арликовая пчела',
                    ];
                    const hairinessHtml = product.hairiness && Array.isArray(product.hairiness)
                            ? product.hairiness.map((value) => `<span>${hairinessNames[value]}</span>`).join(', ')
                            : product.hairiness !== undefined
                            ? `<span>${hairinessNames[product.hairiness]}</span>`
                            : '-';

                    const typeNames = [
                        '',
                        'Большая индийская пчела',
                        'Медоносная пчела',
                        'Индийская пчела',
                        'Арликовая пчела',
                    ];
                    const typeHtml = product.type && Array.isArray(product.type)
                            ? product.type.map((value) => `<span>${typeNames[value]}</span>`).join(', ')
                            : product.type !== undefined
                            ? `<span>${typeNames[product.type]}</span>`
                            : '-';

                    return `
                    <tr>
                        <td>${typeHtml}</td>
                        <td>${hairinessHtml}</td>
                        <td class="spoilers__image">
                            <svg>
                                <use xlink:href="../../img/icons/sprite.svg#svg-${clothType}"></use>
                            </svg>
                        </td>
                        <td class="spoilers__price">${product.price[1]}</td>
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

    function sendBtnInit(form) {
        const sendBtn = document.querySelector('.filter__send');
        if (sendBtn) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const date = new Date();
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear().toString();
                const formattedDate = `${day}.${month}.${year}`;

                const numbersData = {
                    id: uuidv4(),
                    number: recordNumber++,
                    date: formattedDate,
                };

                const productsData = {
                    id: uuidv4(),
                    numberId: numbersData.id,
                };

                formData.forEach((value, key) => {
                    if (productsData[key]) {
                        if (!Array.isArray(productsData[key])) {
                            productsData[key] = [productsData[key]];
                        }
                        productsData[key].push(value);
                    } else {
                        productsData[key] = value;
                    }
                });

                async function postAllData() {
                    try {
                        await postData('http://localhost:3001/numbers', JSON.stringify(numbersData));
                        await postData('http://localhost:3001/products', JSON.stringify(productsData));
                        console.log('Request completed successfully');
                    } catch (error) {
                        console.error('Something went wrong:', error);
                    }
                }

                postAllData();
            });
        }
    }
});
