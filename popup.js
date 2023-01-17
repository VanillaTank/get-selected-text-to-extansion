/* 
Источник https://www.youtube.com/watch?v=SZMGTfHnays&ab_channel=%D0%91%D0%B0%D0%B9%D0%BA%D0%B8%D0%BE%D1%82%D0%98%D0%B3%D0%BE%D1%80%D1%8F%D0%BD%D0%B0
Usage: юзер выделяет текст на странице и кликает на иконку приложения. Если выделенный текст можно 
конвертировать из унций в граммы, результат будет показан в попапе, если нет - в попапе будет "----"
*/


function func() {

    function convert(n) {
        const parts = n.split("/");
        const gramm = (((parts.length == 1) ? parseInt(parts[0]) : parseInt(parts[0]) / parseInt(parts[1])) * 28.3495231).toFixed(2);
        return isNaN(gramm) ? "--" : gramm;
    }

    const selection = [...window.getSelection().toString()];
    let selectedText = selection[0];
    let result = "";
    if (selectedText) {
        // убираем все пробелы
        selectedText = selectedText.replace(/\s+/g, '');

        /* на случай, если указан диапазон чисел. 
        *  Если  строка не содержит "-", вернет один элемент
        */
        const numbers = selectedText.split("-");
        result = convert(numbers[0]);

        if (numbers.length == 2) {
            result += " - " + convert(numbers[1]);
        }

        result += " г";
    }
    else result = "----";
    return result;
}

async function getCurrentTabId() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}


//Сработает, когда юзер нажмет на иконку расширения и будет загружен popup.html
document.addEventListener('DOMContentLoaded', async function () {

    const tabId = await getCurrentTabId();

    await chrome.scripting.executeScript(
        {
            target: { tabId },
            func: func,
        },

        (res) => {
            if (res[0] && res[0].result) {
                document.getElementById("output").innerHTML = res[0].result;
            }
        }
    );

});