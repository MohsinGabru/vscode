// const sumValues = (values) => values.map(v => parseFloat(v)).reduce((acc, curr) => acc + curr, 0).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

// if (document.querySelector('[data-tooltip="Total Credit"]')) {

//     const debit = parseFloat(document.querySelector('[data-tooltip="Total Credit"]').textContent.replace('د.ك', '')) || 0,
//         credit = parseFloat(document.querySelector('[data-tooltip="Total Debit"]').textContent.replace('د.ك', '')) || 0;

//     if (debit > credit) {
//         document.querySelector('[data-tooltip="Total Credit"]').innerHTML += `<hr style="margin: 10px 0; opacity: 1;"><span>د.ك&nbsp; ${sumValues([debit - credit])}</span>`;
//     }
//     else if (credit > debit) {
//         document.querySelector('[data-tooltip="Total Debit"]').innerHTML += `<hr style="margin: 10px 0; opacity: 1;"><span>د.ك&nbsp; ${sumValues([credit - debit])}</span>`;
//     }

// }

let lastCredit = null, lastDebit = null;
let updateScheduled = false;

const updateBalances = () => {
    const totalCreditEl = document.querySelector('[data-tooltip="Total Credit"]'),
        totalDebitEl = document.querySelector('[data-tooltip="Total Debit"]');

    if (!totalCreditEl || !totalDebitEl) return;

    const parseAmount = (el) => Number(el.textContent.replace('د.ك', '').trim()) || 0,
        debit = parseAmount(totalDebitEl),
        credit = parseAmount(totalCreditEl);

    [totalCreditEl, totalDebitEl].forEach(el => el.querySelectorAll('#balance-span, hr').forEach(e => e.remove()));

    if (lastCredit == credit && lastDebit == debit) return;

    lastCredit = credit;
    lastDebit = debit;

    const targetEl = debit > credit ? totalCreditEl : credit > debit ? totalDebitEl : null;
    if (targetEl) {
        targetEl.insertAdjacentHTML('beforeend', `
            <hr style="margin:10px 0;opacity:1;">
            <span id="balance-span">د.ك ${Math.abs(debit - credit).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
        `);
    }
};

const observer = new MutationObserver(() => {
    if (!updateScheduled) {
        updateScheduled = true;
        // requestAnimationFrame(() => {
            updateBalances();
            updateScheduled = false;
        // });
    }
});

observer.observe(document.querySelector('.o_action_manager'), { childList: true, characterData: true, subtree: true });
