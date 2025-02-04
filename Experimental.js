async function waitNext(id) {
	let timeout = 100;
	return new Promise(resolve => {
		(function checkElement() {
			const element = document.querySelector(id);
			if (element || timeout == 0) {
				resolve(element)
			} else {
				timeout--;
				setTimeout(checkElement, 50)
			}
		})()
	});
}

function waitForCondition(checkCondition) {
	return new Promise((resolve, reject) => {
		const intervalId = setInterval(() => {
			if (checkCondition()) {
				clearInterval(intervalId);
				clearTimeout(timeoutId);
				resolve()
			}
		}, 100);

		const timeoutId = setTimeout(() => {
			clearInterval(intervalId);
			reject(new Error('Condition not met within the timeout period.'))
		}, 45000)
	});
}

const createKeyEvent = (val, code) => new KeyboardEvent('keydown', {
	key: val,
	keyCode: code,
	which: code,
	bubbles: true,
	cancelable: true
}),
	delay = ms => new Promise(resolve => setTimeout(resolve, ms)),
	inputEvent = new Event('input', { bubbles: true }),
	enterEvent = createKeyEvent('Enter', 13),
	tabEvent = createKeyEvent('Tab', 9);

	async function deliveryStatus(comment) {
		if (comment) {
			comment = comment.replace(/\s+/g,' ').trim();
			comment = comment.charAt(0).toUpperCase() + comment.slice(1)
		}
		for (const row of document.querySelector('#listReportMainContainer .wtHolder').querySelectorAll('tr[elname="zc-reportRowEl"]')) {
			row.querySelector('td.zcReport_CustomAction a').click();

			await waitForCondition(() => {
				const preloader = document.getElementById('preloader');
				return preloader && window.getComputedStyle(preloader).display === 'none'
			});
			await waitNext('[name="New_Delivery_Status"]');
			await waitForCondition(() => {
				const formoverlay = document.getElementById('form-overlay');
				return formoverlay && window.getComputedStyle(formoverlay).display === 'none'
			});

			const input = await waitNext('[name="zc-sel2-foc-Delivery_Status"]');
			input.value = 'deli';
			input.dispatchEvent(inputEvent);

			if (comment) document.getElementById('zc-Comment').value = comment;

			await waitNext('li.select2-highlighted');

			// await delay(750);
			[...document.querySelectorAll('[name="zc-sel2-inp-Delivery_Status"]')].pop().dispatchEvent(enterEvent);

			document.querySelector('input[name="submit"]').click();

			await waitNext('i#zc-toast-msg');

			await waitForCondition(() => {
				const preloader = document.getElementById('preloader');
				return preloader && window.getComputedStyle(preloader).display === 'none'
			});
		}
	}
