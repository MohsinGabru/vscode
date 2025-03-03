const script = {};

fetch('scripts.json')
	.then(response => response.json())
	.then(scripts => {
		scripts.forEach(({ host, file }) => {
			script[host] = file.replace('.js', '');
		});
	})
	.catch(error => console.error('Error loading scripts.json:', error));

if (script[window.location.host]) {
	document.body.appendChild(Object.assign(document.createElement('script'), {
		src: `https://ruineasyweb.netlify.app/Scripts/${script[window.location.host]}.js`,
		onerror: () => {
			const div = Object.assign(document.createElement('div'), {
				innerHTML: `Visit webpage to get full Code:&nbsp;<br>
					<a href="https://ruineasyweb.netlify.app/Scripts" target="_blank" style="color:#00c3ff;">Click Here</a>`,
				style: `position:fixed;top:45%;left:50%;transform:translate(-50%,-50%);background:#000000cc;
					color:#fff;padding:20px;border-radius:10px;font-size:18px;text-align:center;z-index:9999;`
			});

			div.appendChild(Object.assign(document.createElement('span'), {
				innerHTML: '&times;',
				style: `position:absolute;top:5px;right:10px;cursor:pointer;font-size:22px;font-weight:bold;color:#fff;`,
				onclick: () => div.remove()
			}));

			document.body.appendChild(div);
		}
	}));
} else {
	// Create iframe
	const iframe = document.createElement('iframe');
	iframe.className = 'iframe-container';
	document.body.appendChild(iframe);

	// Apply fixed styles to iframe
	Object.assign(iframe.style, {
		position: 'fixed',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
		border: 'none',
		zIndex: '9999'
	});

	// Get iframe document
	const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

	// Inject styles into iframe
	const style = iframeDoc.createElement('style');
	style.textContent = `
        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        #modal {
            background: white;
            padding: 10px 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        #option-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        .option-row {
            border-bottom: 1px solid #ddd;
            cursor: pointer;
            border-radius: 10px;
            overflow: hidden;
            display: block;
            margin-bottom: 5px;
        }
        .option-cell {
            padding: 10px;
            text-align: left;
            font-size: 16px;
            color: black;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .run-button {
            display: none;
            margin: 10px auto;
            padding: 10px;
            border: none;
            background: #28A745;
            color: white;
            border-radius: 5px;
            cursor: pointer;
        }
		#overlay-h1 {
			text-align: center;
			color: #333;
			margin-bottom: 10px;
			font-size: 22px;
		}
    `;
	iframeDoc.head.appendChild(style);

	// Create overlay div inside iframe
	const overlay = iframeDoc.createElement('div');
	overlay.id = 'overlay';

	// Create modal div inside iframe
	const modal = iframeDoc.createElement('div');
	modal.id = 'modal';

	// Create H1 heading inside iframe
	const heading = iframeDoc.createElement('h1');
	heading.textContent = 'Select a Script to Run';
	heading.style.id = 'overlay-h1';

	modal.prepend(heading);

	let selectedScript = null;

	// Create table
	const table = iframeDoc.createElement('table');
	table.id = 'option-table';

	const options = [
		{ value: 'Odoo_table_amount', text: 'Odoo Table Amount', color: '#a44a8d' },
		{ value: 'Zoho_shortcuts', text: 'Zoho Shortcuts', color: '#f65828' },
		{ value: 'Outlook_easyworks', text: 'Outlook Easy Works', color: '#006aa7' },
		{ value: 'Whatsapp_Privacy', text: 'WhatsApp Privacy', color: '#25D366' }
	];

	options.forEach(opt => {
		const row = iframeDoc.createElement('tr');
		row.className = 'option-row';

		const cell = iframeDoc.createElement('td');
		cell.className = 'option-cell';

		const textNode = iframeDoc.createTextNode(opt.text);

		const radio = iframeDoc.createElement('input');
		radio.type = 'radio';
		radio.name = 'scriptOption';
		radio.value = opt.value;

		row.addEventListener('click', () => {
			radio.checked = true;
			selectedScript = opt.value;
			runButton.style.display = 'block';
			Array.from(table.rows).forEach(r => { r.querySelector('td').style.color = '#000'; r.style.background = '#fff' });
			row.style.background = opt.color;
			row.querySelector('td').style.color = '#fff';
			row.style.borderRadius = '10px';
		});

		cell.appendChild(textNode);
		cell.appendChild(radio);
		row.appendChild(cell);
		table.appendChild(row);
	});

	// Create run button
	const runButton = iframeDoc.createElement('button');
	runButton.textContent = 'Run This';
	runButton.className = 'run-button';
	runButton.addEventListener('click', () => {
		if (selectedScript) {
			document.body.appendChild(Object.assign(document.createElement('script'), {
				src: `https://ruineasyweb.netlify.app/Scripts/${selectedScript}.js`,
				onerror: () => console.warn(`Visit webpage to get full Code: https://ruineasyweb.netlify.app/Scripts`)
			}));
			document.body.removeChild(iframe);
		}
	});

	modal.appendChild(table);
	modal.appendChild(runButton);
	overlay.appendChild(modal);
	iframeDoc.body.appendChild(overlay);
}
