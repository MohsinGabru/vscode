const styleZ = document.createElement("style");
styleZ.textContent = `
        #dsa-container {
            position: fixed;
            top: 40%;
            left: 50%;
	    	z-index: 999;
            transform: scale(1.01) translate(-50%, -50%);
            padding: 20px;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 300px;
            box-shadow: 0 0 10px #000;
            user-select: none;
	    	animation: scaleIn 0.5s ease-out forwards;
        }
        @keyframes scaleIn {
            from { transform: scale(0) }
        }
        @keyframes scaleOut {
            to { transform: scale(0); transform-origin: bottom }
        }
        .closing {
            animation: scaleOut 0.5s ease-out forwards !important;
        }
        #dsa-container h1 {
            margin: 0;
        }
        #dsa-close {
            position: absolute;
            top: 5px;
            right: 5px;
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 16px;
            color: red;
            font-weight: bold;
        }
        #dsa-textarea {
            width: 100%;
            height: 100px;
        }
        #dsa-textarea,
        #dsa-custom_data {
            margin: 10px 0;
	    	border: 1px solid #000;
	    	padding: 5px 10px;
	    	font-size: 1.5em;
            border-radius: 10px;
            resize: none;
        }
        #dsa-submit {
            padding: 8px 12px;
            cursor: pointer;
            border: none;
            background: #f65628;
            color: #fff;
            border-radius: 4px;
            font-weight: bold;
            font-size: 1.1em;
        }
        `;
document.head.appendChild(styleZ);

const closePopup = () => {
    container.classList.add('closing');
    container.addEventListener('animationend', () => {
        container.remove();
        styleZ.remove()
    })
},
    container = Object.assign(document.createElement('div'), { id: 'dsa-container' }),
    textarea = Object.assign(document.createElement('textarea'), { id: 'dsa-textarea' });

container.insertAdjacentHTML('afterbegin', '<h1>Delivery Status Automation</h1>');
container.appendChild(Object.assign(document.createElement('button'), {
    id: 'dsa-close', innerText: 'X', onclick: closePopup
}));
container.appendChild(textarea);
container.appendChild(Object.assign(document.createElement('button'), {
    innerText: 'Submit', id: 'dsa-submit',
    onclick: async () => {
        let data = document.getElementById('dsa-select').value,
            comment = textarea.value.replace(/\s+/g, ' ').trim();
        if (comment) comment = comment.charAt(0).toUpperCase() + comment.slice(1);

        if (document.getElementById('dsa-select').value == 'custom') {
            if (custom_data.value.replace(/\s+/g, ' ').trim() == '') {
                custom_data.focus()
                return
            } else {
                data = custom_data.value.replace(/\n+/, ' ')
            }
        }
        console.log(data)
        closePopup();
        return;
        for (const row of document.querySelector('#listReportMainContainer .wtHolder').querySelectorAll('tr[elname="zc-reportRowEl"]')) {
            row.querySelector('td.zcReport_CustomAction a').click();

            const preloader = document.getElementById('preloader');

            await waitForCondition(() => {
                return preloader && window.getComputedStyle(preloader).display === 'none'
            });
            await waitNext('[name="New_Delivery_Status"]');
            await waitForCondition(() => {
                const formoverlay = document.getElementById('form-overlay');
                return formoverlay && window.getComputedStyle(formoverlay).display === 'none'
            });

            const input = await waitNext('[name="zc-sel2-foc-Delivery_Status"]');
            // input.value = 'deli';
            input.value = data;

            input.dispatchEvent(inputEvent);

            if (comment) document.getElementById('zc-Comment').value = comment;

            await waitNext('li.select2-highlighted');

            [...document.querySelectorAll('[name="zc-sel2-inp-Delivery_Status"]')].pop().dispatchEvent(enterEvent);

            document.querySelector('input[name="submit"]').click();

            await waitNext('i#zc-toast-msg');

            await waitForCondition(() => {
                return preloader && window.getComputedStyle(preloader).display === 'none'
            })
        }
    }
}));

const select = document.createElement('select');
select.id = 'dsa-select';

const optionsHtml = (() => {
    try {
        return Array.from(document.querySelector('ul[fieldlabelname="Delivery_Status"]').querySelectorAll('li'))
            .map(li => `<option value="${li.textContent.trim()}">${li.textContent.trim()}</option>`).join('')
    } catch { return '' }
})();

select.innerHTML = optionsHtml + '<option value="custom">Custom Input</option>';
container.appendChild(select);

const custom_data = document.createElement('textarea');
custom_data.style.cssText = `display: ${optionsHtml == '' ? 'block' : 'none'}; width: 50%`;
custom_data.rows = 2;
custom_data.id = 'dsa-custom_data';
container.appendChild(custom_data);

select.addEventListener('change', function () {
    custom_data.style.display = this.value === 'custom' ? 'block' : 'none';
});

document.body.appendChild(container);
textarea.focus()
