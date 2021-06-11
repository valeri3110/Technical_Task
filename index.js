const GIT_HUB_API_URL = "https://api.github.com/users/jdsecurity/repos";

let data = {};
let currentPage = 1;
let rows = 9;
const pagesList = document.querySelector(".pagesList");
const fragment = document.createDocumentFragment();
const table = document.querySelector(".table");

//функция для получения данных

async function getData() {
	try {
		const dataResponse = await fetch(GIT_HUB_API_URL);
		data = await dataResponse.json();
	} catch (err) {
		console.error(err);
	}

	//вызывает другие функции которые отвечают за правильное отоброжение данных и пагинацию

	displayData(data, fragment, rows, currentPage);
	setupPagination(data, pagesList, rows);
}
getData();

function displayData(data, wrapper, rowsPerPage, page) {
	//очищает HTML чтобы на странице отображалось только 9 репозиториев
	//я сделала 9, а не 10 чтобы не появлялся скролл

	clearHTML();
	page--;

	//определяет количество страниц и в связи с результатом выводит нужные данные

	let start = rowsPerPage * page;
	let end = start + rowsPerPage;
	let paginatedData = data.slice(start, end);

	for (let i = 0; i < paginatedData.length; i++) {
		let item = paginatedData[i];

		let tr = document.createElement("tr");

		//тернарная оп. для проверки на null в значении
		//new Date для того чтобы изменить формат данных на нужный

		tr.innerHTML += `<td>${item.name === null ? "-" : item.name}</td>
        <td>${item.language === null ? "-" : item.language}</td>
        <td>${item.description === null ? "-" : item.description}</td>

        <td>${new Date(item.created_at).toLocaleDateString("en-US")}</td>
        <td>${new Date(item.pushed_at).toLocaleDateString("en-US")}</td>
        <td>${new Date(item.updated_at).toLocaleDateString("en-US")}</td>`;

		wrapper.appendChild(tr);
	}
	table.appendChild(wrapper);
}

function setupPagination(data, wrapper, rowsPerPage) {
	wrapper.innerHTML = "";

	//округляет количество страниц в большую сторону
	let pageCount = Math.ceil(data.length / rowsPerPage);

	//добавляет нужное количество кнопок в HTML
	for (let i = 1; i < pageCount + 1; i++) {
		let btn = paginationButton(i, data);
		wrapper.appendChild(btn);
	}
}

//переключение между страницами
function paginationButton(page, data) {
	let button = document.createElement("button");
	button.innerText = page;

	if (currentPage == page) button.classList.add("active");

	button.addEventListener("click", function () {
		currentPage = page;
		displayData(data, fragment, rows, currentPage);

		let currentBtn = document.querySelector(".pagesList button.active");
		currentBtn.classList.remove("active");

		button.classList.add("active");
	});

	return button;
}

//поиск
document.querySelector("#search").oninput = function () {
	clearHTML();

	const val = this.value.trim();
	const result = data.filter((index) => index.name.indexOf(val) > -1);

	renderData(result);
};

//сортировка

document.querySelector("#title_select").addEventListener("change", () => {
	clearHTML();

	let sortResult = data.reverse();
	displayData(sortResult, fragment, rows, currentPage);
});

//helpers

function clearHTML() {
	table.innerHTML = `<tr>
    <th>NAME</th>
    <th>LANGUAGE</th>
    <th>DESCRIPTION</th>
    <th>CREATED AT</th>
    <th>PUBLISHED AT</th>
    <th>UPDATED AT</th>
    </tr>`;
}

function renderData(result) {
	for (let value in result) {
		let tr = document.createElement("tr");
		let rv = result[value];

		tr.innerHTML += `<td>${rv.name}</td>
            <td>${rv.language === null ? "-" : rv.language}</td>
            <td>${rv.description === null ? "-" : rv.description}</td>
            <td>${new Date(rv.created_at).toLocaleDateString("en-US")}</td>
            <td>${new Date(rv.pushed_at).toLocaleDateString("en-US")}</td>
            <td>${new Date(rv.updated_at).toLocaleDateString("en-US")}</td>`;

		fragment.appendChild(tr);
	}

	table.appendChild(fragment);
}
