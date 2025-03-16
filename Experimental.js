const mcr_style = Object.assign(document.createElement('style'), {
    innerHTML: `
    #mcr-code-runner {
        position: fixed;
        top: 40%;
        left: 50%;
		z-index: 999;
        transform: scale(1.01) translate(-50%, -50%);
        padding: 15px;
        background-color: var(--body-bg);
        box-shadow: 0 0 20px var(--body-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 300px;
        user-select: none;
		animation: scaleIn 0.3s ease-out forwards;
    }
    @keyframes scaleIn {
        from { transform: scale(0) }
    }
    @keyframes scaleOut {
        to { transform: scale(0) }
    }
    .closing {
        animation: scaleOut 0.3s ease-out forwards !important;
    }
    #date-picker {
        display: none;
        margin-top: 10px;
        width: 60%;
        padding: 5px;
        padding-right: 0;
    }
    #mcr-code-runner h1 {
        margin: 0;
		margin-bottom: 15px;
		color: var(--body-color);
		font-size: 1.5em;
    }
	#mcr-code-runner h1 textarea {
		resize: both;
	}
	#mcr-code-runner label {
        font-weight: bold;
	}
	#mcr-button,
    #change-date-container {
		display: flex;
		gap: 15px;
	}
    #mcr-button button {
        padding: 8px 12px;
        cursor: pointer;
        border: none;
        background-color: #6b3e66;
        color: #fff;
        border-radius: 4px;
        font-weight: bold;
        font-size: 1.1em;
    }
	#mcr-close {
		background-color: RGBA(184, 50, 50, var(--bg-opacity, 1)) !important;
    }
	#mcr-run:focus,
	#mcr-close:focus {
		box-shadow: 1px 1px 5px var(--body-color);
	}
    `.replace(/\s+/g, ' ')
});

document.head.appendChild(mcr_style)

const closePopup = () => {
    container.classList.add('closing');
    container.addEventListener('animationend', () => {
        container.remove();
        mcr_style.remove()
    })
},
    container = Object.assign(document.createElement('div'), { id: 'mcr-code-runner' }),
    button = Object.assign(document.createElement('div'), { id: 'mcr-button' }),
    cancel = Object.assign(document.createElement('button'), { id: 'mcr-close', innerText: 'Cancel', onclick: closePopup });

container.insertAdjacentHTML('afterbegin', `
    <h1>MyFatoorah Code Runner</h1>
    <textarea rows="4" cols="50" placeholder="Enter code here..."></textarea>
    <br>
    <div id="change-date-container">
        <input type="checkbox" id="change-date">
        <label for="changeDate"> Change Date</label>
    </div>
    <select id="date-picker"></select>
    <br>
`);

button.insertAdjacentHTML('beforeend', `<button id="mcr-run" onclick="">Run</button>`);

button.appendChild(cancel);
container.appendChild(button);
document.body.appendChild(container)

cancel.focus();

function formatDate(date) {
    const dateFull = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'long' }).replace(',', '').replaceAll(' ', '-').replace('-', ':').split(':');
    return `${dateFull[1]} (${dateFull[0]})`
}

for (let i = 0; i < 10; i++) {
    let date = new Date();
    date.setDate(date.getDate() - i);

    let option = document.createElement("option");
    option.value = i * -1;
    option.textContent = formatDate(date);

    document.getElementById('date-picker').appendChild(option);
}

document.getElementById('change-date').addEventListener("change", function () {
    if (this.checked) {
        document.getElementById('date-picker').style.display = 'block';
        document.querySelector('#change-date-container label').style.color = 'red'
    } else {
        document.getElementById('date-picker').removeAttribute('style');
        document.querySelector('#change-date-container label').removeAttribute('style')
    }
})
