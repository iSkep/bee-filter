// Подключение из node_modules
import * as noUiSlider from 'nouislider';

// Подключение стилей из scss/base/forms/range.scss
// в файле scss/forms/forms.scss

// Подключение cтилей из node_modules
// import 'nouislider/dist/nouislider.css';

const rangeItems = document.querySelectorAll('[data-range]');
export function rangeInit() {
    if (rangeItems.length) {
        rangeItems.forEach((rangeItem) => {
            const fromValue = rangeItem.querySelector('[data-range-from]');
            const toValue = rangeItem.querySelector('[data-range-to]');
            const item = rangeItem.querySelector('[data-range-item]');
            const inputs = [fromValue, toValue];
            noUiSlider.create(item, {
                start: [Number(fromValue.value), Number(toValue.value)], // [0,200000]
                connect: true,
                step: 1,
                tooltips: [false, false],
                range: {
                    min: [Number(fromValue.dataset.rangeFrom)],
                    max: [Number(toValue.dataset.rangeTo)],
                },
                format: {
                    from: function (rangeItem) {
                        return parseInt(rangeItem);
                    },
                    to: function (rangeItem) {
                        return parseInt(rangeItem);
                    },
                },
            });

            // при изменений положения элементов управления слайдера изменяем соответствующие значения
            item.noUiSlider.on('update', function (values, handle) {
                inputs[handle].value = values[handle];
            });

            // при изменении меньшего значения в input - меняем положение соответствующего элемента управления
            fromValue.addEventListener('change', function () {
                item.noUiSlider.set([this.value, null]);
            });

            // при изменении большего значения в input - меняем положение соответствующего элемента управления
            toValue.addEventListener('change', function () {
                item.noUiSlider.set([null, this.value]);
            });
        });
    }
}
rangeInit();

export { rangeItems };
