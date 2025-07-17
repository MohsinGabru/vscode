document.addEventListener('keydown', async (event) => {
    if (event.ctrlKey && event.key.toLowerCase() == 'i') {
        event.preventDefault();
        click()
    }
})

function wait(el) {
    let timeout = 100
    return new Promise(resolve => {
        (function checkElement() {
            (document.querySelector(el) || timeout == 0) ? resolve() : (timeout--, setTimeout(checkElement, 50))
        })()
    })
}

async function click() {

    if (!document.querySelector('[data-auto-gen-binding-key="track_inventory"]')) return;

    document.querySelector('[data-auto-gen-binding-key="track_inventory"]').click();


    await wait('[data-auto-gen-binding-key="inventory_account_id"]');



    document.querySelectorAll('.modal-content [class*="text-dashed-underline"]').forEach(el => {
        if (el.textContent.trim() === 'Inventory Account') {
            el.parentElement.parentElement.querySelector('[class="ac-box "][role="combobox"] div[class="ac-toggle-container"]').click()
        }
    });

    document.querySelector('[title="Inventory Asset"]').click()



    document.querySelectorAll('.modal-content [class*="text-dashed-underline"]').forEach(el => {
        if (el.textContent.trim() === 'Inventory Valuation Method') {
            el.parentElement.parentElement.querySelector('[class="ac-box "][role="combobox"] div[class="ac-toggle-container"]').click()
        }
    });

    document.querySelector('[title="FIFO (First In First Out)"]').click()

}

click()
