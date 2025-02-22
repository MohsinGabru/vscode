console.clear();
const createKeyEvent = val => new KeyboardEvent('keydown', { key: val, bubbles: true }),
    delay = ms => new Promise(resolve => setTimeout(resolve, ms)),
    inputEvent = new Event('input', { bubbles: true }),
    escapeKeyEvent = createKeyEvent('Escape'),
    enterEvent = createKeyEvent('Enter'),
    tabEvent = createKeyEvent('Tab'),
    highlight = '\x1b[35m', /* Red & For Purple color #9980ff */
    highlightGreen = '\x1b[32m',
    reset = '\x1b[0m';

document.querySelector('[class="o_menu_systray d-flex flex-shrink-0 ms-auto"][role=menu]').insertAdjacentHTML("afterbegin", `<img src="https://ruineasyweb.netlify.app/favicon_io/favicon.ico" style="cursor: pointer;" onclick="window.open('https://ruineasyweb.netlify.app','_blank')">`);

function convertTime(milliseconds) {
    const totalSeconds = milliseconds / 1000,
        minutes = Math.floor(totalSeconds / 60),
        seconds = (totalSeconds % 60).toFixed(2) * 1;

    return minutes ? `${highlight}${minutes}${reset} Minute${minutes > 1 ? 's' : ''} ${seconds ? `and ${highlight}${seconds}${reset} Seconds` : ''}` : `${highlight}${seconds}${reset} Seconds`
}

function note(id = '') {
    document.head.appendChild(Object.assign(document.createElement('style'), {
        id: id,
        innerHTML: `
        #note {
            position: fixed;
            top: 50px;
            right: 10px;
            padding: 10px;
            padding-bottom: 0;
            border: 2px solid var(--o-input-border-color);
            background: linear-gradient(0deg, var(--body-bg) 80%, transparent);
            color: var(--body-color);
            font-weight: bold;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 1.1em;
            z-index: 2;
            box-shadow: 0 0 10px var(--body-color);
        }
        #note span {
            color: #1dc959;
        }
        #progress-line {
            z-index: 3;
            height: 2px;
            width: 100%;
            margin-top: 10px;
            overflow: hidden;
            background-color: #fff;
            }
        #progress-bar {
            width: 0;
            height: 100%;
            background-color: #ff6347;
        }
        `.replace(/\s+/g, ' ')
    }));
}

bet_stop = false;

async function translateArabicToEnglish(text) {
    try {
        const data = await (await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=ar-SA|en-GB`)).json();
        return data.matches.length > 1 ? data.matches[0].translation : data.responseData.translatedText
    } catch {
        return text
    }
}

function wait(id) {
    let timeout = 100
    return new Promise(resolve => {
        (function checkElement() {
            (document.querySelector(id) || timeout == 0) ? resolve() : (timeout--, setTimeout(checkElement, 50))
        })()
    });
}

function waitNext(id) {
    let timeout = 100
    return new Promise(resolve => {
        (function checkElement() {
            const element = document.querySelector(id);
            (element || timeout == 0) ? resolve(element) : (timeout--, setTimeout(checkElement, 50))
        })()
    });
}

function waitClick(id) {
    let timeout = 100
    return new Promise(resolve => {
        (function checkElement() {
            const element = document.querySelector(id)
            if (element || timeout == 0) {
                element.click();
                resolve()
            } else {
                timeout--;
                setTimeout(checkElement, 50)
            }
        })()
    });
}

const keyMappings = {
    't': 'TAP Payment Charges',
    'f': 'MyFatoorah Charges'
};
document.addEventListener('keydown', async (event) => {
    let mapkey = keyMappings[event.key.toLowerCase()];
    if (event.altKey && mapkey) {
        if (event.shiftKey) {
            mapkey = mapkey.replace('P', 'BBY')
        }
        event.preventDefault();
        const amount = document.getElementById('amount_0');
        let click = document.querySelector('input[data-value=reconcile]'),
            el = document.getElementById('writeoff_label_0');

        if (amount) {
            amount.dispatchEvent(tabEvent);
            click = await waitNext('input[data-value=reconcile]')
        }
        if (click) {
            click.click();
            el = await waitNext('#writeoff_label_0')
        }
        if (el) {
            el.value = mapkey;
            nextValueFast('#writeoff_account_id_0', 40501)
        } else {
            const activeEl = document.activeElement;
            activeEl && /input|textarea/i.test(activeEl.tagName)
                ? activeEl.value += mapkey
                : activeEl?.isContentEditable && (activeEl.textContent += mapkey)
        }
    } else if (event.key == 'F1') {
        event.preventDefault();
        if (!window.location.href.includes('model=sale.order')) window.location.assign('/web#action=592&model=sale.order')
    } else if (event.key == 'F2') {
        event.preventDefault();
        if (!window.location.href.includes('model=account.move')) window.location.assign('/web#action=242&model=account.move')
    } else if (event.key == 'F3') {
        event.preventDefault();
        if (!window.location.href.includes('model=stock.picking')) window.location.assign('/web#action=549&model=stock.picking.type')
    } else if (event.altKey && event.key.toLowerCase() == 'q') {

        currentPage = window.location.href.replace('https://wibi.odoo.com','');
        localStorage.QuicklySwitchSelect

    } else if (event.altKey && event.key.toLowerCase() == 'a') {
        event.preventDefault();
        account()
    } else if (event.ctrlKey && event.altKey && event.key.toLowerCase() == 's') {
        if (document.getElementById('print-button')) return;
        event.preventDefault();
        document.querySelector('.o_menu_sections.d-none.d-md-flex.flex-grow-1.flex-shrink-1.w-0').appendChild(Object.assign(document.createElement('div'), { innerHTML: `<button id="print-button">Print</button>` }));
        document.head.appendChild(Object.assign(document.createElement('style'), {
            innerHTML: `
            #print-button {
                background-color: rgb(2, 199, 181);
                border-radius: 10em;
                font-weight: bold;
                border: 2px solid var(--o-input-border-color);
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s, border-color 0.3s;
            }
            #print-button:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.5);
            }
            `.replace(/\s+/g, ' ')
        }));
        note();
        document.getElementById('print-button').addEventListener('click', async () => {
            document.querySelector('[data-hotkey=u][data-tooltip=Actions]').click();
            (await waitNext('.o-dropdown.dropdown.lh-1.o-dropdown--no-caret [role="menu"] div button')).dispatchEvent(new Event('mouseenter', { bubbles: true }));
            await waitClick('.o-dropdown.dropdown.lh-1.o-dropdown--no-caret [role="menu"] div [role="menu"] span:last-child')
        });
        document.addEventListener('keydown', async (event) => {
            if (event.ctrlKey && event.key.toLowerCase() == 'r') {
                event.preventDefault();
                try {
                    const clipboardText = await navigator.clipboard.readText();

                    if (clipboardText.startsWith('processSo(') && clipboardText.endsWith(')')) {
                        eval(clipboardText);
                        done = true
                    } else {
                        console.log('Invalid Function')
                    }
                } catch (error) {
                    console.error('Error retrieving clipboard content:', error)
                }
            }
        })
    } else if (event.altKey && event.key == '/') { shortcuts() }
});

function done_message(result) {
    document.querySelector('body').insertAdjacentHTML('beforeend', `
        <div id="note">
            <strong>${result}</strong>
            <div id="progress-line">
                <div id="progress-bar"></div>
            </div>
        </div>
    `);

    let progressBar = document.getElementById('progress-bar'),
        progressWidth = 0,
        interval = setInterval(() => {
            progressWidth++;
            progressBar.style.width = progressWidth + '%';

            if (progressWidth >= 100) {
                clearInterval(interval);
                document.getElementById('note').remove()
            }
        }, 60);
}

async function format() {
    try {
        if (document.querySelector('[data-command-category=actions] span.min-w-0.text-truncate').textContent != 'Invoices') return;

        const list = ['Invoice Date', 'Source Document', 'Shopify Reference No', 'Total', 'Amount Due', 'Payment', 'Status'],
            headers = document.querySelectorAll('.o_content table thead tr th'),
            headerTexts = [];

        for (let i = 3; i < headers.length - 1; i++) {
            headerTexts.push(headers[i].textContent.trim())
        }

        if (JSON.stringify(list) == JSON.stringify(headerTexts)) return;

        const btnClick = headers[headers.length - 1].getElementsByTagName('button')[0];
        btnClick.click();

        (await waitNext('.o_content table + [role=menu]')).querySelectorAll('.dropdown-item').forEach(item => {
            const checkbox = item.getElementsByTagName('input')[0],
                data = list.includes(item.textContent.trim());
            if ((data && !checkbox.checked) || (!data && checkbox.checked)) {
                checkbox.click()
            }
        });

        btnClick.click();
        await wait('[data-name=invoice_date] + [data-name=invoice_origin] + [data-name=shopify_ref_no] + [data-name=amount_total_signed] + [data-name=amount_residual_signed] + [data-name=payment_state] + [data-name=state]');
        console.log('Format Done')
    } catch (err) { console.log(err) }
}

function account() {
    if (document.getElementById('copy-button')) return;
    [
        { id: 'copy', text: 'Copy Table' },
        { id: 'lock', text: 'Lock Date' },
        { id: 'detail', text: 'Details' }
    ].forEach(({ id, text }) => {
        document.querySelector('.o_menu_sections.d-none.d-md-flex.flex-grow-1.flex-shrink-1.w-0').appendChild(Object.assign(document.createElement('div'), { innerHTML: `<button id="${id}-button">${text}</button>` }))
    });

    document.head.appendChild(Object.assign(document.createElement('style'), {
        innerHTML: `
        #copy-button, #detail-button {
            background-color: var(--body-bg);
            color: var(--body-color);
            border: 2px solid var(--o-input-border-color);
            border-radius: 10em;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 0 1px var(--body-color);
            transition: background-color 0.3s, border-color 0.3s;
        }
        #copy-button:focus, #detail-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.5);
        }
        #lock-button {
            margin: auto 10px;
            font-size: large;
            text-decoration: underline;
            font-weight: bold;
            border: none;
            background: none;
        }
        .oe_title span .o_field_widget.o_readonly_modifier.o_required_modifier.o_field_selection span,
        amount, date {
            padding: 5px 6px;
            border-radius: 50px;
        }
        date {
            color: #000;
            background-color: #E4A900 !important;
        }
        #easy_custom {
            color: #000;
            padding-right: 0;
            background-color: RGB(29, 201, 89) !important;
        }
        #easy_total,
        amount {
            color: #fff;
            background-color: #702963 !important;
        }
        .o_content tfoot {
            position: sticky;
            bottom: 0;
            box-shadow: 0 0 10px 3px rgba(0, 0, 0, .1);
        }
        .o_content tfoot td {
            color: #E4E4E4 !important;
            background-color: #1b1d26 !important;
        }
        `.replace(/\s+/g, ' ')
    }));

    document.getElementById('lock-button').addEventListener('click', async () => {
        document.querySelector('[data-menu-xmlid="account.menu_finance_entries"]').click();
        await waitClick('[data-menu-xmlid="account_accountant.menu_action_change_lock_date"]');
        document.getElementById('lock-button').innerText = (await waitNext('#period_lock_date_0')).value;
        document.getElementsByClassName('btn-close')[0].click()
    });
    setTimeout(() => { document.getElementById('lock-button').click() }, 1500);
    document.getElementById('copy-button').addEventListener('click', async () => {
        await format();
        const a = document.querySelector('.o_list_table.table.table-sm.table-hover.position-relative.mb-0.o_list_table_ungrouped.table-striped'),
            tablex = a || document.querySelector('.table.table-borderless.table-hover.striped') || document.querySelector('.o_content table') || document.getElementsByTagName('table')[0];
        if (!tablex) return alert('Table not found!');

        let tableData = [];
        tablex.querySelectorAll('tr').forEach(row => {
            let rowData = [];
            row.querySelectorAll('td, th').forEach(cell => { rowData.push(cell.textContent.trim()); });
            tableData.push(rowData.join('\t'))
        });
        try {
            await navigator.clipboard.writeText(tableData.join('\n'));
            console.log('Table copied to clipboard successfully!');
            if (a) {
                document.getElementsByClassName('o_pager_value d-inline-block border-bottom border-transparent mb-n1')[0].click();

                const input = await waitNext('.o_pager_counter.align-self-center input');
                input.value = '1-13';
                input.dispatchEvent(enterEvent)
            }
        } catch (err) {
            alert('Unable to copy table to clipboard:' + err)
        }
    });

    document.getElementById('detail-button').addEventListener('click', async function script() {
        if (document.querySelector('.fw-bold.text-truncate')) {
            const status_check = document.querySelector('.o_widget.o_widget_web_ribbon div span'),
                head_val = ({ 'IN': 'Customer Invoice', 'RI': 'Customer Credit Note', 'BI': 'Vendor Bill', 'RB': 'Vendor Credit Note' }[document.querySelector('.d-flex.gap-1.text-truncate span.min-w-0.text-truncate').textContent.slice(0, 2)]),
                titleSpan = document.querySelector('.oe_title span .o_field_widget.o_readonly_modifier.o_required_modifier.o_field_selection span'),
                x = titleSpan ? `<span id="easy_total">Total: ${document.querySelector('.o_list_monetary').textContent.replace('د.ك', 'KD').replace(/\s+/g, ' ').trim()}</span>` : '',
                info = document.querySelectorAll('.o_field_widget.o_readonly_modifier.o_field_payment table td a[aria-label=Info]'),
                pay_count = document.querySelectorAll('.o_field_widget.o_readonly_modifier.o_field_payment:nth-child(1) table tr').length;

            if (head_val && status_check && titleSpan && info) {
                const newtext = [],
                    status_val = status_check.textContent;
                status_check.textContent = (/paid/i.test(status_val) ? 'Paid' : /Partial/i.test(status_val) ? 'Partial' : status_val) + (pay_count > 1 ? ` (${pay_count})` : '');

                for (let i = 0; i < info.length; i++) {
                    info[i].click();
                    await delay(100);
                    newtext.push(`<span id="easy_custom">${document.querySelector('.account_payment_popover table tr:nth-child(4) td:nth-child(2)').textContent.replace('(Manual)', `<date>(${document.querySelectorAll('.o_field_widget.text-start.o_payment_label')[i].textContent.replace('Paid on ', '')})</date>`)}${(pay_count > 1 || !document.querySelector('.o_field_widget.o_readonly_modifier.o_field_monetary.oe_subtotal_footer_separator.o_field_empty')) ? `&nbsp;<amount>${document.querySelectorAll('.oe_form_field.oe_form_field_float.oe_form_field_monetary')[i].textContent.replace('د.ك', 'KD').replace(/\s+/g, ' ').trim()}</amount>` : ''}</span>`)
                }

                titleSpan.innerHTML = `<div>${x}${!document.querySelector('.o_field_widget.o_readonly_modifier.o_field_monetary.oe_subtotal_footer_separator.o_field_empty') ? `<br><br><span style="color: #fff; background-color: #017E84;">Pending: ${document.querySelector('[name="amount_residual"] span').textContent.replace('د.ك', 'KD').replace(/\s+/g, ' ').trim()}</span>` : ''}</div>&nbsp;<div style="display: inline-block;">${newtext.join('<br><br>')}</div>`;
                document.dispatchEvent(escapeKeyEvent);
                document.getElementById('easy_total').closest('div').closest('span').style.cssText = 'display: flex; padding: 0 0 5px 0'
            } else if (titleSpan) {
                titleSpan.innerHTML = `${head_val}&nbsp;${x}`
            }
        }
        /* '.modal-footer.justify-content-around.justify-content-md-start.flex-wrap.gap-1.w-100 footer .btn.btn-primary' */
        [
            'left.btn.btn-secondary.o_pager_previous.px-2.rounded-start',
            'right.btn.btn-secondary.o_pager_next.px-2.rounded-end'
        ].forEach(selector => {
            document.querySelector(`.oi.oi-chevron-${selector}`)?.addEventListener('click', () => { setTimeout(script, 750) })
        });
    })
}

async function processInvoices(value, tNum) {
    const start = performance.now();
    try {
        document.body.style.pointerEvents = 'none';

        const range = document.querySelector('.o_pager_value.d-inline-block.border-bottom.border-transparent.mb-n1'),
            input = document.querySelector('.o_searchview_input.o_input.d-print-none.flex-grow-1.w-auto.border-0');

        if (range.textContent.replace('1-', '') * 1 < tNum) {
            range.click();
            const rangeInput = await waitNext('.o_pager_counter.align-self-center input');
            rangeInput.value = '1-' + tNum;
            rangeInput.dispatchEvent(enterEvent);
            await wait('.o_pager_value.d-inline-block.border-bottom.border-transparent.mb-n1')
        }

        for (const element of value) {
            input.value = element;
            input.dispatchEvent(inputEvent);
            input.dispatchEvent(enterEvent)
        }
    } finally {
        document.body.removeAttribute('style');
        console.log(`Done: ${highlightGreen}${value.length}${reset} Invoices Selected in ${highlight}${((performance.now() - start) / 1000).toFixed(2)}${reset} Seconds`)
    }
}

async function nextValue(tag, newValue) {
    const account = document.querySelector(tag);
    account.value = newValue;
    account.dispatchEvent(inputEvent);
    account.dispatchEvent(tabEvent);

    await delay(750)
}

async function nextValueFast(tag, newValue) {
    const account = document.querySelector(tag);
    account.value = newValue;
    account.dispatchEvent(inputEvent);
    account.dispatchEvent(tabEvent)
}

async function processSo(name, orderNum, salesPerson, paymentTerm, items, pNum, address) {
    const start = performance.now();
    try {
        document.body.style.pointerEvents = 'none';

        if (/[\u0600-\u06FF\u0750-\u077F]/.test(name)) name = (await translateArabicToEnglish(name)).replace(/\s+/g, ' ').trim();
        await nextValueFast('.o_field_widget.o_required_modifier.o_field_res_partner_many2one input', name);

        await processItems(items, 'order_lines');
        if (bet_stop) return;

        const cusBtn = await waitNext('.o_field_widget.o_required_modifier.o_field_res_partner_many2one [data-tooltip="Internal link"]');
        document.querySelector('.o_notebook_headers ul li a[name="other_information"]').click();

        await nextValueFast('[name="payment_term_id"] input', paymentTerm);
        (await waitNext('[name="payment_term_id"] input[aria-expanded="false"]')).blur();

        const order = await waitNext('#shopify_ref_no_0');
        order.value = orderNum;
        order.focus();
        order.dispatchEvent(tabEvent);

        await nextValueFast('#user_id_0', salesPerson);

        if (document.querySelector('.o_field_widget.o_required_modifier.o_field_res_partner_many2one .o_field_many2one_extra').textContent == '') {
            await wait(`[data-tooltip*="${salesPerson}"] #user_id_0`);
            cusBtn.click();
            await wait('#phone_0');
            nextValueFast('#phone_0', pNum);
            if (/[\u0600-\u06FF\u0750-\u077F]/.test(address)) address = (await translateArabicToEnglish(address)).replace(/\s+/g, ' ').trim();
            nextValueFast('#street_0', address)
        }
    } catch (err) { console.log('Error:', err) } finally {
        document.body.removeAttribute('style');
        const count = items[0].length,
            countForS = count > 1 ? 's' : '';
        if (done) {
            done_message(`Done: <span>${count}</span> Item${countForS} in <span>${((performance.now() - start) / 1000).toFixed(2) * 1}</span> Seconds`)
            done = false
        }
        bet_stop ? (bet_stop = false, alert(`Stopped: Item No. ${ic + 1} is Not Available`)) : console.log('Done:', count, `Item${countForS} in`, ((performance.now() - start) / 1000).toFixed(2) * 1, 'Seconds')
    }
}

async function processItems(items, clickName, boolean = false) {
    try {
        document.body.style.pointerEvents = 'none';
        document.querySelector(`.o_notebook_headers ul li a[name="${clickName}"]`).click();

        const add_row = await waitNext('.o_field_x2many_list_row_add a'),
            tableText = '.o_section_and_note_list_view.o_list_table.table.table-sm.table-hover.position-relative.mb-0.o_list_table_ungrouped.table-striped',
            tableBody = `${tableText} tbody tr.o_data_row.o_is_false:nth-child(`,
            table = document.querySelector(tableText),
            minus = items[0].toString().includes('[10731]') + items[0].toString().includes('[10732]');

        add_row.click();

        let product, quantity, unitPrice, description;
        table.querySelectorAll('thead tr th').forEach((header, i) => {
            const text = header.textContent.trim();
            if (text == 'Product') { product = i }
            else if (text == 'Description') { description = i }
            else if (text == 'Quantity') { quantity = i }
            else if (text == 'Unit Price') { unitPrice = i; return }
        });

        await wait('tr.o_data_row.o_selected_row.o_row_draggable.o_is_false');
        // input.value =/sc10610(?:[ |\]]|$)/.test('[sc10610] abc')
        for (ic = 0; ic < items[0].length - minus; ic++) {

            const body = table.querySelectorAll('tbody tr.o_data_row.o_is_false');

            for (const [index, value] of [product, quantity, unitPrice].entries()) {
                if (index == 1 && items[1][ic] == 1) continue;

                const input = body[ic].getElementsByTagName('td')[value].getElementsByTagName('input')[0];
                input.value = index == 0 ? items[index][ic].split(' splitBrand ')[0] : items[index][ic];
                input.dispatchEvent(inputEvent);

                if (index == 0) {
                    await wait(`${tableBody}${ic + 1}) td:nth-child(${value + 1}) .o-autocomplete--dropdown-item.ui-menu-item.d-block`);
                    if (document.querySelector('.o-autocomplete--dropdown-item.ui-menu-item.d-block.o_m2o_no_result')) {
                        input.value = items[index][ic].split(' splitBrand ')[0].replace(/\[|\]/g, '');
                        input.dispatchEvent(inputEvent)
                    }
                    await wait(`${tableBody}${ic + 1}) td:nth-child(${value + 1}) li.o_m2o_dropdown_option_search_more`);

                    const listItems = body[ic].getElementsByTagName('td')[value].getElementsByTagName('li');
                    if (listItems.length > 2) {
                        for (let i = 0; i < listItems.length; i++) {
                            if (new RegExp((items[index][ic]).split(' ')[1], 'i').test(listItems[i].textContent)) {
                                listItems[i].click(); break
                            } else if ((listItems.length - 1) == i) {
                                bet_stop = true; return
                            }
                        }
                    } else { input.dispatchEvent(tabEvent) }
                    await wait(`${tableBody}${ic + 1}) td:nth-child(${unitPrice}) [class^="fa fa-area-chart cursor-pointer"]`)
                } else {
                    input.dispatchEvent(enterEvent)
                }
            }

            add_row.click();
            await wait(`${tableBody}${ic + 2})`);
            if (body[ic].querySelector(`td:nth-child(${product + 1})[data-tooltip=""]`)) { bet_stop = true; return }
        }

        if (minus) {
            async function addAnother() {
                await nextValueFast(`${tableBody}${ic + 1}) td:nth-child(${product + 1}) input`, items[0][ic].replace('splitBrand', ''));
                await wait(`td:nth-child(${product + 1}) [data-tooltip="Internal link"]`);
                if (description) await wait(`${tableBody}${ic + 1}) td:nth-child(${description + 1})[data-tooltip*="["]`);

                table.querySelectorAll('tbody tr.o_data_row.o_is_false')[ic].getElementsByTagName('td')[unitPrice].getElementsByTagName('input')[0].value = items[2][ic]
            }
            await addAnother();
            if (minus > 1) {
                ic++;
                add_row.click();
                await wait(`${tableBody}${ic + 1})`);
                await addAnother()
            }
        }
    } catch (err) { bet_stop = true; console.log('Error:', err) } finally {
        if (boolean) {
            document.body.removeAttribute('style');
            bet_stop ? (bet_stop = false, alert(`Stopped: Item No. ${ic + 1} is Not Available`)) : console.log('Done:', items[0].length, 'Items')
        }
    }
}

async function processFat(main_data) {
    const start = performance.now(),
        totalEntries = Object.keys(main_data).length,
        escKeyListener = event => { if (event.keyCode == 27) stopFunction = true };

    Fat_Count = 0;
    let SafeKey, stopFunction, fatStop = false;
    document.getElementById('cross-shortcut')?.click();

    note('myFatoorah');

    document.addEventListener('keydown', escKeyListener);

    /* const date = document.getElementById('payment_date_0');
    date.value = -1;
    date.click();
    date.dispatchEvent(tabEvent); */

    {
        const timeTaken = totalEntries * 3425, date = new Date(Date.now() + timeTaken);
        console.log(`%c${highlightGreen}${totalEntries}${reset} Entries are expected to be completed by ${highlightGreen}${(date.getHours() % 12 || 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() > 11 ? 'P' : 'A'}M ${reset}\n(After: ${convertTime(timeTaken)})`, 'font-weight: bold')
    }

    try {
        document.body.style.pointerEvents = 'none';

        for (const [key, value] of Object.entries(main_data)) {
            SafeKey = key;
            await nextValueFast('[role*=searchbox]', key);

            await waitClick(`[data-tooltip="${key}"]`);

            await waitClick('#account_invoice_payment_btn');

            const account = await waitNext('#journal_id_0');
            if (account.value != 'WARBA WIBI INTL') { await nextValue('#journal_id_0', 'bnk8') }

            await nextValueFast('#amount_0', value);

            await waitClick('input[data-value=reconcile]');
            if (account.value != 'WARBA WIBI INTL') { fatStop = true; break }

            (await waitNext('#writeoff_label_0')).value = 'MyFatoorah Charges';
            await nextValueFast('#writeoff_account_id_0', 40501);
            await wait('[name=writeoff_account_id] button');
            if (document.getElementById('writeoff_account_id_0').value != '40501 SALES DISCOUN ON EARLY PAYMENT' || stopFunction) {
                fatStop = true; break
            }

            document.querySelector('.btn.btn-primary[name=action_create_payments]').click();

            await wait('.o_field_widget.o_readonly_modifier.o_field_monetary.oe_subtotal_footer_separator.o_field_empty');
            Fat_Count++;
            document.querySelector(`[data-tooltip*='Back to'][data-tooltip*=Invoices]`).click();

            await waitClick('button[aria-label=Remove]')
        }
    } finally {
        document.body.removeAttribute('style');
        document.removeEventListener('keydown', escKeyListener);
        const status = (fatStop || (totalEntries != Fat_Count)),
            time = convertTime(performance.now() - start);

        console.log(`${status ? `\x1b[31m\x1b[1mStopped: ${SafeKey}\n` : ''}Done: ${highlightGreen}${Fat_Count}${reset} Entries in ${time}`);
        done_message(`${status ? '<span style="color: red">Stopped</span><br>' : ''}Done: <span style="color: green">${Fat_Count}</span> Entries in ${time.replaceAll('\x1b[35m', '<span style="color: #BF40BF">').replaceAll('\x1b[0m', '</span>')}`);
        if (status) document.querySelector('[data-command-category="actions"]').style.cssText = 'color: #000; background-color: red';
        setTimeout(() => { document.getElementById('myFatoorah').remove() }, 15000)
    }
}
/*
async function je(entries) {
    const length = entries.length;
    for (let i = 0; i < length; i++) {
        document.querySelector('.o_field_x2many_list_row_add a').click();
        const tr = `tr:nth-child(${i + 1})`;
        const amount = await waitNext(`${tr} [name=${entries[i][1]}]`);
        await nextValueFast(`${tr} [name=account_id] input`, entries[i][0]);
        if (length - 1 == i) return;
        await wait(`${tr} [name=account_id] [data-tooltip="Internal link"]`);
        amount.click();
        amount.getElementsByTagName('input')[0].value = entries[i][2]
    }
}

je([['cash in hand', 'debit', 10], ['l.', 'credit', 10]])
*/

// document.body.appendChild(Object.assign(document.createElement('script'), { src: 'https://ruineasyweb.netlify.app/Scripts/Odoo_table_amount.js' }));

(function shortcuts() {
    if (document.getElementById('centered-div-shortcut')) return;
    const style = Object.assign(document.createElement('style'), {
        innerHTML: `
        #centered-div-shortcut::-webkit-scrollbar {
            width: 6px;
        }
        #centered-div-shortcut::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
        }
        #centered-div-shortcut::-webkit-scrollbar-thumb:hover {
            background-color: #555;
        }
        #centered-div-shortcut {
            position: fixed;
            top: 22%;
            left: 37%;
            z-index: 9999;
            color: var(--body-color);
            background-color: var(--body-bg);
            padding: 15px 9px;
            padding-top: 0;
            box-shadow: 0 0 20px var(--body-color);
            border-radius: 8px;
            min-width: 300px;
            text-align: center;
            font-weight: bold;
            transform: scale(1.2);
            transform-origin: bottom right;
            overflow-y: auto;
            max-height: 75%;
            animation: scaleIn 0.5s ease-out forwards;
        }
        #centered-div-shortcut header {
            position: sticky;
            top: 0;
            background-color: var(--body-bg);
            padding-top: 12px;
        }
        #cross-shortcut {
            position: absolute;
            top: 7px;
            right: 0;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color : #fff;
            background-color: red;
            padding: 5px 10px;
            font-weight: bold;
            border-radius: 5px;
            user-select: none;
        }
        @keyframes scaleIn {
            from { transform: scale(0); }
        }
        @keyframes scaleOut {
            to { transform: scale(0); }
        }
        .closing {
            animation: scaleOut 0.5s ease-out forwards !important;
        }
        #centered-div-shortcut h1 {
            font-size: 1.5em;
            margin-bottom: 0;
            text-decoration: underline;
        }
        #table-shortcut {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin-bottom: 10px;
        }
        #centered-div-shortcut ul {
            margin: 0;
            padding: 0;
            list-style-position: inside;
        }
        customspan {
            text-decoration: underline;
        }
        #table-shortcut thead {
            font-size: 1.2em;
        }
        #table-shortcut tr {
            border-bottom: 1px solid #ddd;
        }
        #table-shortcut th,
        #table-shortcut td {
            padding: 5px;
        }
        #table-shortcut tbody tr td:nth-child(1) {
            color: #007BFF;
            align-content: start;
        }
        #strongInfo {
            display: block;
            text-align: left;
            margin-bottom: 10px;
            font-family: 'Times New Roman';
        }
        #select-shortcut {
  position: relative;
  display: inline-block;
  margin-top: 7px;
}

#select-shortcut select {
  background: none;
  appearance: auto;
  padding: 4px;
  padding-right: 0;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #007BFF;
  cursor: pointer;
  width: 150px;
}
  #select-shortcut option {
  color: var(--body-color);
    background-color: var(--body-bg);
  outline: none;
}
  #select-shortcut optgroup {
    color: #007BFF;
    background-color: var(--body-bg);
  }
  #select-shortcut option:hover {
  background-color: var(--body-bg);
color: var(--body-color);
  }
        `.replace(/\s+/g, ' ')
    });
    document.head.appendChild(style);

    const div = document.createElement('div');
    div.id = 'centered-div-shortcut';

    div.innerHTML = `<header><h1>Shortcut List</h1></header>
                <table id="table-shortcut">
                    <thead> <tr> <th>Shortcut</th> <th>Action</th> </tr> </thead>
                    <tbody>
                        <tr> <td>Esc</td> <td>Stop MyFatoorah Script</td> </tr>
                        <tr>
                            <td>Alt + A</td>
                            <td>
                            <customspan>Enable Account Mode</customspan>
                              <ul>
                                <li>Get Copy Table Feature</li>
                                <li>Lock Date View</li>
                                <li>View Allocated Entry Details</li>
                              </ul>
                            </td>
                        </tr>
                        <tr>
                          <td>Alt + Q</td>
                          <td>
                            Quickly Switch Between Current Page with Your Selected Page<br>
                            <div id="select-shortcut">
                              <select onchange="localStorage.setItem('QuicklySwitchSelect', this.value)">
                              <optgroup label="Select Your Page">
                                <option value="Sales Order">Sales Order</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Inventory">Inventory</option>
                                </optgroup>
                              </select>
                            </div>
                          </td>
                        </tr>
                        <tr> <td>Alt + F</td> <td>Get 'MyFatoorah Charges' text</td> </tr>
                        <tr> <td>Alt + T</td> <td>Get 'TAP Payment Charges' text</td> </tr>
                        <tr> <td>Alt + Shift + T</td> <td>Get 'TABBY Payment Charges' text</td> </tr>
                        <tr>
                            <td>Ctrl + Alt + S</td>
                            <td>
                              <customspan>Enable Invoice Creation Mode</customspan>
                              <ul>
                                <li>Get Print Option <span style="color: red;">(Shortcut)</span></li>
                                <li><span style="color: #007BFF">Ctrl + R</span> to Quickly Create SO <span style="color: red;">(Outlook: Copy All <b>-Required</b>)</span></li>
                              </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
        <strong id="strongInfo">
         <div>There are many features to Avoid Manual, Frustrating Work</div>
         <div>— Use this tools for Peace of Mind.</div>
          <ul>
            <li>Automatically Allocate MyFatoorah Entries</li>
            <li>Process KNET and Petty Cash Entries SuperFast</li>
            <li>Create PO & SO without User interaction</li>
          </ul>
        </strong>
        <strong>Press <span style="color: #0BE;text-shadow: 0 0 35px var(--body-color);">Alt + /</span> to display this box again.</strong><br>
        <strong>For more tools Visit <a href="https://ruineasyweb.netlify.app/" style="text-shadow: 0 0 gray;">ruineasyweb</a></strong>`;

    const closeButton = Object.assign(document.createElement('button'), { id: 'cross-shortcut', textContent: 'X' });

    closeButton.addEventListener('click', () => {
        div.classList.add('closing');
        div.addEventListener('animationend', () => {
            div.remove();
            style.remove()
        })
    });

    div.querySelector('header').appendChild(closeButton);
    document.body.appendChild(div);

    const QSS = document.querySelector('#select-shortcut select');
    if (localStorage.getItem("QuicklySwitchSelect")) {
        QSS.value = localStorage.QuicklySwitchSelect;
    } else {
        QSS.dispatchEvent(new Event("change"))
    }
})()
