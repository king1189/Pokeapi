let currentPokemonId = 1;

async function buscarPokemon() {
  const input = document.getElementById('pokemonInput').value.toLowerCase();
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = 'Buscando...';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!res.ok) throw new Error("No encontrado");
    const data = await res.json();

    currentPokemonId = data.id;
    mostrarPokemon(data);
  } catch (error) {
    container.innerHTML = `<p>Pokémon no encontrado. Intenta con otro nombre o número.</p>`;
  }
}
function setTheme(themeClass) {
  document.body.className = themeClass;
  localStorage.setItem('theme', themeClass); 
}


document.addEventListener('DOMContentLoaded', () => {
  const dayModeButton = document.getElementById('dayModeButton');
  const nightModeButton = document.getElementById('nightModeButton');

  if (dayModeButton) {
    dayModeButton.addEventListener('click', () => setTheme('')); 
  }

  if (nightModeButton) {
    nightModeButton.addEventListener('click', () => setTheme('dark-mode'));
  }

  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
  } else {
   
    document.body.className = '';
  }

 
  buscarPokemon();
});




function mostrarPokemon(data) {
  const container = document.getElementById('pokemonContainer');

  const stats = data.stats.map(stat => {
    const nombre = traducirStat(stat.stat.name);
    const valor = stat.base_stat;
    const color = getStatColor(valor);
    return `
      <div class="stat">
        <div class="stat-header">
          <span><strong>${nombre}</strong>: ${valor}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${valor > 100 ? 100 : valor}%; background-color: ${color};"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <h2>${capitalize(data.name)}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Altura:</strong> ${data.height / 10} m</p>
    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
    <h3>Estadísticas:</h3>
    ${stats}
  `;

  SetColorCard(data.types[0].type.name);

  // Animar las barras de estadística
  setTimeout(() => {
    document.querySelectorAll(".stat-fill").forEach(bar => {
      const width = bar.style.width;
      bar.style.width = "0"; // resetear
      void bar.offsetWidth; // forzar reflow
      bar.style.width = width; // aplicar ancho real para animación
    });
  }, 100);
}

async function cambiarPokemon(delta) {
  const newId = currentPokemonId + delta;
  if (newId < 1 || newId > 1025) return;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    if (!res.ok) throw new Error("Error");
    const data = await res.json();
    currentPokemonId = data.id;
    mostrarPokemon(data);
  } catch (error) {
    console.error("Error al cargar Pokémon:", error);
  }
}

function traducirStat(statName) {
  const traducciones = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defensa Esp.',
    'speed': 'Velocidad'
  };
  return traducciones[statName] || statName;
}

function SetColorCard(type) {
  const colors = {
    fire: "#FDDFDF",
    grass: "#DEFDE0",
    electric: "#FCF7DE",
    water: "#DEF3FD",
    ground: "#f4e7da",
    rock: "#d5d5d4",
    fairy: "#fceaff",
    poison: "#e0bbe4",
    bug: "#f8d5a3",
    dragon: "#97b3e6",
    psychic: "#eaeda1",
    flying: "#F5F5F5",
    fighting: "#E6E0D4",
    normal: "#F5F5F5",
    ghost: "#dbb2ff",
    steel: "#e6eaf0",
    dark: "#a9a9a9",
    ice: "#e0f5ff"
  };

  const card = document.getElementById('pokemonContainer');
  card.style.backgroundColor = colors[type] || "#f0f0f0";
}

function getStatColor(value) {
  if (value >= 100) return "#4CAF50"; 
  if (value >= 70) return "#FFC107";  
  return "#F44336";                   
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
