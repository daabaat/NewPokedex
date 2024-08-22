// 포켓몬 데이터를 표시할 컨테이너와 필터 버튼, 홈 타이틀, 검색 입력창 요소를 가져옴
const pokemonContainer = document.getElementById("pokemon-container");
const filterButtons = document.getElementById("filter-buttons");
const homeTitle = document.getElementById("home-title");
const searchInput = document.getElementById("search-input");
const noResultsMessage = document.getElementById("no-results");
const slickContainer = document.querySelector(".slick-container");

// 모든 포켓몬 데이터를 저장할 배열
let allPokemon = [];
// 필터링된 포켓몬 데이터를 저장할 배열
let filteredPokemon = [];
// 현재 선택된 알파벳 필터
let currentFilter = "";
// 현재 검색어
let searchQuery = "";

// 포켓몬 이미지를 localStorage에 저장하는 함수
function storePokemonImages(pokemonList) {
  pokemonList.forEach((pokemon) => {
    fetch(pokemon.url)
      .then((response) => response.json())
      .then((data) => {
        // 이미지 URL을 localStorage에 저장
        localStorage.setItem(pokemon.name, data.sprites.front_default);
      });
  });
}

// localStorage에서 이미지를 가져와 슬라이더를 초기화하는 함수
function displaySliderFromLocalStorage() {
  slickContainer.innerHTML = ""; // 슬라이더 컨테이너 초기화

  // localStorage에서 모든 포켓몬 이미지를 가져옴
  for (let i = 0; i < localStorage.length; i++) {
    const pokemonName = localStorage.key(i);
    const imageUrl = localStorage.getItem(pokemonName);

    // 이미지 요소 생성
    const slickImg = document.createElement("img");
    slickImg.src = imageUrl;

    // 슬라이더 컨테이너에 이미지 추가
    slickContainer.appendChild(slickImg);
  }

  // 슬라이더 초기화
  if ($(".slick-container").hasClass("slick-initialized")) {
    $(".slick-container").slick("unslick");
  }

  $(".slick-container").slick({
    infinite: true,
    dots: true,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 1000,
    centerMode: true,
    customPaging: function (slider, i) {
      return '<button class="custom-dot">' + (i + 1) + "</button>";
    },
  });
}

// 1세대 포켓몬 데이터를 API로부터 가져오는 비동기 함수
async function fetchPokemonData() {
  // 포켓몬 데이터를 API에서 가져옴
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  // 가져온 포켓몬 데이터를 allPokemon 배열에 저장
  allPokemon = data.results;

  // 포켓몬 이미지들을 localStorage에 저장
  storePokemonImages(allPokemon);

  // 모든 포켓몬을 화면에 표시
  displayPokemon(allPokemon);
  // 알파벳 필터 버튼들을 생성
  createFilterButtons();
  // localStorage에서 슬라이더를 초기화
  displaySliderFromLocalStorage();
}

// 포켓몬 목록을 화면에 표시하는 함수
function displayPokemon(pokemonList) {
  // 포켓몬을 표시할 컨테이너를 초기화
  pokemonContainer.innerHTML = "";
  // 포켓몬 목록이 비어 있을 경우 "No Results" 메시지를 표시
  if (pokemonList.length === 0) {
    noResultsMessage.style.display = "block";
  } else {
    noResultsMessage.style.display = "none";
    // 포켓몬 목록을 순회하면서 화면에 포켓몬을 하나씩 추가
    pokemonList.forEach((pokemon) => {
      // 각 포켓몬의 상세 데이터를 추가로 가져옴
      fetch(pokemon.url)
        .then((response) => response.json())
        .then((data) => {
          // 포켓몬을 담을 박스를 생성
          const pokemonBox = document.createElement("div");
          pokemonBox.className = "pokemon-box";
          // 포켓몬 박스를 클릭하면 해당 포켓몬의 데이터를 로컬 스토리지에 저장하고 detail.html로 이동
          pokemonBox.onclick = () => {
            localStorage.setItem("selectedPokemon", JSON.stringify(data));
            window.location.href = "detail.html";
          };

          // 포켓몬의 이미지를 생성
          const pokemonImg = document.createElement("img");
          pokemonImg.src = data.sprites.front_default;

          // 포켓몬의 이름을 생성 (첫 글자는 대문자로 변환)
          const pokemonName = document.createElement("div");
          pokemonName.textContent =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

          // 생성된 이미지와 이름을 포켓몬 박스에 추가
          pokemonBox.appendChild(pokemonImg);
          pokemonBox.appendChild(pokemonName);
          // 포켓몬 박스를 컨테이너에 추가
          pokemonContainer.appendChild(pokemonBox);
        });
    });
  }
}

// 알파벳 필터 버튼을 생성하는 함수
function createFilterButtons() {
  // A부터 Z까지의 알파벳을 배열로 만듦
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  alphabets.forEach((letter) => {
    // 각 알파벳에 대해 버튼을 생성
    const button = document.createElement("button");
    button.textContent = letter;
    // 버튼을 클릭하면 해당 알파벳으로 필터링하는 함수 호출
    button.onclick = () => filterPokemonByLetter(letter);
    // 생성된 버튼을 필터 버튼 컨테이너에 추가
    filterButtons.appendChild(button);
  });
}

// 특정 알파벳으로 포켓몬을 필터링하는 함수
function filterPokemonByLetter(letter) {
  // 현재 필터를 클릭된 알파벳으로 설정
  currentFilter = letter.toLowerCase();
  // 전체 포켓몬을 기준으로 필터링
  let pokemonToDisplay = allPokemon;

  // 검색어가 입력된 경우, 검색어에 따라 필터링
  if (searchQuery) {
    pokemonToDisplay = pokemonToDisplay.filter((pokemon) =>
      pokemon.name.includes(searchQuery)
    );
  }

  // 현재 알파벳으로 시작하는 포켓몬만 필터링
  filteredPokemon = pokemonToDisplay.filter((pokemon) =>
    pokemon.name.startsWith(currentFilter)
  );
  // 필터링된 포켓몬을 화면에 표시
  displayPokemon(filteredPokemon);

  // 선택된 알파벳 버튼의 스타일을 업데이트
  document.querySelectorAll("#filter-buttons button").forEach((btn) => {
    if (btn.textContent === letter) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

// 검색어에 따라 포켓몬을 필터링하는 함수
function searchPokemon() {
  // 검색어를 소문자로 변환하여 저장
  searchQuery = searchInput.value.toLowerCase();
  // 현재 필터된 포켓몬 중에서 검색하거나, 전체 포켓몬에서 검색
  let pokemonToSearch = currentFilter ? filteredPokemon : allPokemon;
  // 검색어를 포함하는 포켓몬만 필터링
  filteredPokemon = pokemonToSearch.filter((pokemon) =>
    pokemon.name.includes(searchQuery)
  );
  // 필터링된 포켓몬을 화면에 표시
  displayPokemon(filteredPokemon);
}

// 검색 입력창에 키를 입력할 때마다 검색 함수 호출
searchInput.addEventListener("keyup", searchPokemon);

// 페이지가 로드될 때 포켓몬 데이터를 가져옴
fetchPokemonData();
