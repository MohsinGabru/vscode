let items = [],
    data = `
        Ahmed Mahmoud #129164 - 6.3 KD / Sajid Hayat #129165 - 262.84 KD / Eman Alsudairawi #129167 - 377.6 KD / Abbas Kanjeta #129174 - 51.7 KD / Aston Martin Service Center Al Rai #129179 - 31.7 KD / Jijo George #129178 - 4.8 KD / Fahad Ahmad Al Muhammad #129182 - 308.8 KD / Kawther Alrayes #129185 - 5.55 KD / Rajaa Alsarawi #129190 - 48.7 KD / Abdulrahman Saleh #129191 - 38.3 KD / Sheena Joseph #129183 - 216.8 KD / Sheena Joseph Sheena Joseph #129184 - 6.3 KD / Aisha Almershed #129195 - 114.7 KD / Mijbel Alnajjar #129193 - 28.7 KD / Ibrahim Almehjan #129197 - 7.3 KD / Yana Dvornichenko #129198 - 160.7 KD / Abdulrahman Alghemlas #129204 - 39.7 KD / Robert Gurney #129206 - 12.7 KD / Promax General Trading Co. #129211 - 47.8 KD / Tamer Badran #129208 - 47.8 KD / Heidi K. #129210 - 47.7 KD / Esraa Alsaibae #129139 - 13.7 KD / Sabbir Hossain #129163 - 23.7 KD / Hashem Alkout #129142 - 38.3 KD / Hussain Mazaher #129128 - 317.8 KD / Hussain Mazaher #129217 - 155.8 KD / Eman Aldehani #129229 - 11.2 KD / Org Luxury #128963 - 42.9 KD / Athari Ali #129232 - 48.7 KD / Ramu Phone #12854 - 334.8 KD / K Bhavani Prasad #129235 - 345.7 KD / Hashem Ghosheh #129234 - 60.7 KD / Khaled Almahmoud #129236 - 47.7 KD / Bloom Mart #129237 - 304.8 KD / Hamad Alrushoud #129239 - 878.8 KD / Ibrahim Al-Shammari #129240 - 15.3 KD / Ahmad Almajed #129242 - 104.7 KD / Mohammed Abdulqader #129246 - 57.85 KD / Mahmoud Abdullah #129249 - 60.7 KD / Khaled Abdullah #129250 - 16.05 KD / Anwar Draz - -170.9 KD / Farida Aujan - -70.9 KD / Moath Alhamad #129162 () - 220.7 KD / Bu Ahmad Bu Ahmad #129171 () - 17.45 KD / Asmaa Ali #129180 () - 8.8 KD / Fahad Al Shatti #129203 () - 55.8 KD / Jasim Albenali #129216 () - 133.8 KD / Zahraa Zahraa #129215 () - 4.3 KD / Ahmed Altimimi () - -7 KD / Rashed Alammar #129230 () - 107.9 KD / Dr Ghadeer Alfarhoud #129244 () - 267.8 KD / Latifa Al-Hajeri #129248 () - 6.55 KD
    `;
data.split('/').map(part => {
    if (part.includes('(')) {
        part = part.slice(part.indexOf('#') + 1).replace(' KD', '').trim().split(' () - ');
        items.push(part)
    }
})
let orders = [];
for (let i = 0; i < items.length; i++) {
    orders.push(items[i][0])
}

// console.log(orders);


// processInvoices(orders,orders.length);

/* Another Part */

let available = [];
let availablePrice = [];

document.querySelectorAll('[name="invoice_origin"]').forEach(val=>{
    available.push(val.textContent.replace('#',''));
    availablePrice.push(val.parentElement.querySelector('[name="amount_residual_signed"]').textContent.replace('د.ك','')*1)
})

// const final = items.filter(item => available.includes(item[0]));

const final = items.reduce((acc, [key, value]) => {
  if (available.includes(key)) {
    if (availablePrice.includes(value*1+.2)) {
        acc['#'+key] = value*1;
    }
  }
  return acc;
}, {});

const textOutput = Object.entries(final).map(([key, value]) => `'${key}': ${value}`).join(', ');

document.querySelectorAll('button[aria-label=Remove]').forEach(x=>{
    x.click()
})

// eval(`processFat({${textOutput}})`);

const end = data.split('/').map(s => {
  let [, id, val] = s.match(/#(\d+).*?-\s*([\d.]+)/) || [];
  return final[id] == val ? s.replace(' ()', '') : s;
});

console.log(end);
