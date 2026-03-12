document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("roleSelect");

  // Обновленный список ролей
  const roles = [
    "Content Creator Tier 1",
    "Content Creator Tier 2",
    "Content Creator Tier 3",
    "Content Creator Tier 4",
    "Explorer",
    "Iron",
    "Bronze",
    "Silver",
    "Gold"
  ];

  roles.forEach(role => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    roleSelect.appendChild(option);
  });

  const form = document.getElementById("cardForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const joinDate = document.getElementById("joinDate").value;
    const avatarFile = document.getElementById("avatarUpload").files[0];
    const selectedRole = roleSelect.value;

    if (!avatarFile) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("previewAvatar").src = e.target.result;
      document.getElementById("previewUsername").textContent = username;
      document.getElementById("previewJoinDate").textContent = formatDate(joinDate);
      document.getElementById("previewRole").textContent = selectedRole;
      document.getElementById("cardPreview").style.display = "flex";
    };
    reader.readAsDataURL(avatarFile);
  });

  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('ru-RU', options);
  }
});
